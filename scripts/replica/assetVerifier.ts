import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {inflateSync} from 'node:zlib';
import {
  pressReplicaIllustrationPrompts,
  PRESS_REPLICA_IMAGE_SPEC,
} from '../../src/replica/pressIllustrationPrompts';

type VerificationLimits = {
  minWidth: number;
  minHeight: number;
  aspectRatioTolerance: number;
  cornerAlphaMax: number;
  cornerPatchTransparentRatioMin: number;
  minSubjectCoverage: number;
  maxSubjectCoverage: number;
  maxGreenResidualRatio: number;
  maxInnerEdgeBandThicknessRatio: number;
};

export type PressAssetMetrics = {
  file: string;
  width: number;
  height: number;
  colorType: number;
  bitDepth: number;
  cornerAlpha: [number, number, number, number];
  cornerPatchTransparentRatio: [number, number, number, number];
  subjectCoverage: number;
  opaqueCoverage: number;
  greenResidualRatio: number;
  maxInnerHorizontalBandRatio: number;
  maxInnerVerticalBandRatio: number;
  maxInnerHorizontalBandThicknessRatio: number;
  maxInnerVerticalBandThicknessRatio: number;
  subjectBounds: {left: number; top: number; right: number; bottom: number} | null;
};

export type PressAssetVerification = {
  ok: boolean;
  metrics?: PressAssetMetrics;
  errors: string[];
};

const DEFAULT_LIMITS: VerificationLimits = {
  minWidth: 1920,
  minHeight: 1080,
  aspectRatioTolerance: 0.015,
  cornerAlphaMax: 8,
  cornerPatchTransparentRatioMin: 0.97,
  minSubjectCoverage: 0.015,
  maxSubjectCoverage: 0.65,
  maxGreenResidualRatio: 0.0015,
  maxInnerEdgeBandThicknessRatio: 0.025,
};

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type DecodedPng = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  pixels: Buffer;
};

const paethPredictor = (left: number, up: number, upperLeft: number) => {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  if (upDistance <= upperLeftDistance) return up;
  return upperLeft;
};

const decodeRgbaPng = (filePath: string): DecodedPng => {
  const file = readFileSync(filePath);
  if (file.length < 33 || !file.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('not a PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = -1;
  let colorType = -1;
  let compression = -1;
  let filterMethod = -1;
  let interlace = -1;
  const idatChunks: Buffer[] = [];

  while (offset + 12 <= file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > file.length) throw new Error(`truncated ${type} chunk`);

    if (type === 'IHDR') {
      width = file.readUInt32BE(dataStart);
      height = file.readUInt32BE(dataStart + 4);
      bitDepth = file[dataStart + 8];
      colorType = file[dataStart + 9];
      compression = file[dataStart + 10];
      filterMethod = file[dataStart + 11];
      interlace = file[dataStart + 12];
    } else if (type === 'IDAT') {
      idatChunks.push(file.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }

    offset = dataEnd + 4;
  }

  if (width <= 0 || height <= 0 || idatChunks.length === 0) {
    throw new Error('missing IHDR or IDAT data');
  }
  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`expected 8-bit RGBA PNG (color type 6), got bit depth ${bitDepth}, color type ${colorType}`);
  }
  if (compression !== 0 || filterMethod !== 0 || interlace !== 0) {
    throw new Error(
      `unsupported PNG encoding (compression ${compression}, filter ${filterMethod}, interlace ${interlace})`,
    );
  }

  const bytesPerPixel = 4;
  const rowBytes = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const expectedBytes = (rowBytes + 1) * height;
  if (inflated.length !== expectedBytes) {
    throw new Error(`unexpected decoded byte length ${inflated.length}; expected ${expectedBytes}`);
  }

  const pixels = Buffer.allocUnsafe(rowBytes * height);
  let inputOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const rowOffset = y * rowBytes;

    for (let x = 0; x < rowBytes; x += 1) {
      const raw = inflated[inputOffset + x];
      const left = x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[rowOffset - rowBytes + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? pixels[rowOffset - rowBytes + x - bytesPerPixel] : 0;
      let value: number;

      if (filter === 0) value = raw;
      else if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + up;
      else if (filter === 3) value = raw + Math.floor((left + up) / 2);
      else if (filter === 4) value = raw + paethPredictor(left, up, upperLeft);
      else throw new Error(`unsupported PNG row filter ${filter}`);

      pixels[rowOffset + x] = value & 0xff;
    }
    inputOffset += rowBytes;
  }

  return {width, height, bitDepth, colorType, pixels};
};

const alphaAt = (image: DecodedPng, x: number, y: number) =>
  image.pixels[(y * image.width + x) * 4 + 3];

const patchTransparencyRatio = (
  image: DecodedPng,
  originX: number,
  originY: number,
  patchSize: number,
  alphaMax: number,
) => {
  let transparent = 0;
  let total = 0;
  for (let y = originY; y < originY + patchSize; y += 1) {
    for (let x = originX; x < originX + patchSize; x += 1) {
      total += 1;
      if (alphaAt(image, x, y) <= alphaMax) transparent += 1;
    }
  }
  return transparent / total;
};

export const verifyPressReplicaAsset = (
  filePath: string,
  limitOverrides: Partial<VerificationLimits> = {},
): PressAssetVerification => {
  const limits = {...DEFAULT_LIMITS, ...limitOverrides};
  const errors: string[] = [];
  let image: DecodedPng;

  try {
    image = decodeRgbaPng(filePath);
  } catch (error) {
    return {ok: false, errors: [error instanceof Error ? error.message : String(error)]};
  }

  const {width, height, pixels, colorType, bitDepth} = image;
  const cornerAlpha: [number, number, number, number] = [
    alphaAt(image, 0, 0),
    alphaAt(image, width - 1, 0),
    alphaAt(image, 0, height - 1),
    alphaAt(image, width - 1, height - 1),
  ];
  const patchSize = Math.max(1, Math.min(16, width, height));
  const cornerPatchTransparentRatio: [number, number, number, number] = [
    patchTransparencyRatio(image, 0, 0, patchSize, limits.cornerAlphaMax),
    patchTransparencyRatio(image, width - patchSize, 0, patchSize, limits.cornerAlphaMax),
    patchTransparencyRatio(image, 0, height - patchSize, patchSize, limits.cornerAlphaMax),
    patchTransparencyRatio(
      image,
      width - patchSize,
      height - patchSize,
      patchSize,
      limits.cornerAlphaMax,
    ),
  ];

  let visiblePixels = 0;
  let opaquePixels = 0;
  let greenResidualPixels = 0;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const alpha = pixels[offset + 3];
      if (alpha < 16) continue;

      visiblePixels += 1;
      if (alpha >= 230) opaquePixels += 1;
      if (green >= 96 && green - red >= 35 && green - blue >= 35) greenResidualPixels += 1;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  const totalPixels = width * height;
  const subjectCoverage = visiblePixels / totalPixels;
  const opaqueCoverage = opaquePixels / totalPixels;
  const greenResidualRatio = visiblePixels === 0 ? 0 : greenResidualPixels / visiblePixels;
  const subjectBounds = right >= left && bottom >= top ? {left, top, right, bottom} : null;
  const aspectError = Math.abs(width / height - 16 / 9) / (16 / 9);

  // Transparent corners do not catch inset letterbox bars or internal frames. Scan the zones
  // immediately inside the cleared outer band for rows or columns dominated by visible pixels.
  const inInnerEdgeZone = (value: number, size: number) => {
    const ratio = value / size;
    return (ratio >= 0.07 && ratio <= 0.2) || (ratio >= 0.8 && ratio <= 0.93);
  };
  let maxInnerHorizontalBandRatio = 0;
  let horizontalRun = 0;
  let maxHorizontalRun = 0;
  for (let y = 0; y < height; y += 1) {
    if (!inInnerEdgeZone(y, height)) {
      horizontalRun = 0;
      continue;
    }
    let visible = 0;
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] >= 16) visible += 1;
    }
    const ratio = visible / width;
    maxInnerHorizontalBandRatio = Math.max(maxInnerHorizontalBandRatio, ratio);
    horizontalRun = ratio > 0.72 ? horizontalRun + 1 : 0;
    maxHorizontalRun = Math.max(maxHorizontalRun, horizontalRun);
  }
  let maxInnerVerticalBandRatio = 0;
  let verticalRun = 0;
  let maxVerticalRun = 0;
  for (let x = 0; x < width; x += 1) {
    if (!inInnerEdgeZone(x, width)) {
      verticalRun = 0;
      continue;
    }
    let visible = 0;
    for (let y = 0; y < height; y += 1) {
      if (pixels[(y * width + x) * 4 + 3] >= 16) visible += 1;
    }
    const ratio = visible / height;
    maxInnerVerticalBandRatio = Math.max(maxInnerVerticalBandRatio, ratio);
    verticalRun = ratio > 0.72 ? verticalRun + 1 : 0;
    maxVerticalRun = Math.max(maxVerticalRun, verticalRun);
  }
  const maxInnerHorizontalBandThicknessRatio = maxHorizontalRun / height;
  const maxInnerVerticalBandThicknessRatio = maxVerticalRun / width;

  if (width < limits.minWidth || height < limits.minHeight) {
    errors.push(`resolution ${width}x${height} is below ${limits.minWidth}x${limits.minHeight}`);
  }
  if (aspectError > limits.aspectRatioTolerance) {
    errors.push(`aspect ratio ${(width / height).toFixed(4)} is not 16:9`);
  }
  cornerAlpha.forEach((alpha, index) => {
    if (alpha > limits.cornerAlphaMax) errors.push(`corner ${index + 1} alpha ${alpha} is not transparent`);
  });
  cornerPatchTransparentRatio.forEach((ratio, index) => {
    if (ratio < limits.cornerPatchTransparentRatioMin) {
      errors.push(`corner patch ${index + 1} is only ${(ratio * 100).toFixed(2)}% transparent`);
    }
  });
  if (subjectCoverage < limits.minSubjectCoverage) {
    errors.push(`subject coverage ${(subjectCoverage * 100).toFixed(2)}% is too small or empty`);
  }
  if (subjectCoverage > limits.maxSubjectCoverage) {
    errors.push(`subject coverage ${(subjectCoverage * 100).toFixed(2)}% is too large`);
  }
  if (greenResidualRatio > limits.maxGreenResidualRatio) {
    errors.push(
      `visible green residual ${(greenResidualRatio * 100).toFixed(3)}% exceeds ${(limits.maxGreenResidualRatio * 100).toFixed(3)}%`,
    );
  }
  if (maxInnerHorizontalBandThicknessRatio > limits.maxInnerEdgeBandThicknessRatio) {
    errors.push(
      `inset horizontal band is ${(maxInnerHorizontalBandThicknessRatio * 100).toFixed(2)}% of canvas height`,
    );
  }
  if (maxInnerVerticalBandThicknessRatio > limits.maxInnerEdgeBandThicknessRatio) {
    errors.push(
      `inset vertical band is ${(maxInnerVerticalBandThicknessRatio * 100).toFixed(2)}% of canvas width`,
    );
  }

  return {
    ok: errors.length === 0,
    metrics: {
      file: filePath,
      width,
      height,
      colorType,
      bitDepth,
      cornerAlpha,
      cornerPatchTransparentRatio,
      subjectCoverage,
      opaqueCoverage,
      greenResidualRatio,
      maxInnerHorizontalBandRatio,
      maxInnerVerticalBandRatio,
      maxInnerHorizontalBandThicknessRatio,
      maxInnerVerticalBandThicknessRatio,
      subjectBounds,
    },
    errors,
  };
};

const parseNumberArg = (name: string) => {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  if (raw === undefined) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`Invalid --${name} value: ${raw}`);
  return value;
};

const runCli = () => {
  const dirArg = process.argv.find((arg) => arg.startsWith('--dir='))?.slice('--dir='.length);
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))?.slice('--only='.length);
  const json = process.argv.includes('--json');
  const outputDir = path.resolve(process.cwd(), dirArg ?? PRESS_REPLICA_IMAGE_SPEC.alphaOutputDir);
  const requested = onlyArg ? new Set(onlyArg.split(',').map((value) => value.trim()).filter(Boolean)) : null;
  const limits: Partial<VerificationLimits> = {
    minSubjectCoverage: parseNumberArg('min-coverage'),
    maxSubjectCoverage: parseNumberArg('max-coverage'),
    maxGreenResidualRatio: parseNumberArg('max-green'),
  };
  for (const key of Object.keys(limits) as Array<keyof typeof limits>) {
    if (limits[key] === undefined) delete limits[key];
  }

  const assets = pressReplicaIllustrationPrompts.filter(
    (asset) => !requested || requested.has(asset.id) || requested.has(asset.filename),
  );
  if (assets.length === 0) throw new Error('No assets matched --only.');

  const results = assets.map((asset) => {
    const filePath = path.resolve(outputDir, asset.filename);
    if (!existsSync(filePath)) {
      return {asset: asset.id, file: filePath, ok: false, errors: ['file is missing']} as const;
    }
    return {asset: asset.id, ...verifyPressReplicaAsset(filePath, limits)};
  });

  if (json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const result of results) {
      if (!result.ok || !result.metrics) {
        console.error(`FAIL ${result.asset}: ${result.errors.join('; ')}`);
        continue;
      }
      const metrics = result.metrics;
      console.log(
        `PASS ${result.asset}: ${metrics.width}x${metrics.height}, coverage ${(metrics.subjectCoverage * 100).toFixed(2)}%, green ${(metrics.greenResidualRatio * 100).toFixed(3)}%`,
      );
    }
    const failed = results.filter((result) => !result.ok);
    console.log(`${results.length - failed.length}/${results.length} press replica assets passed QA.`);
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) process.exitCode = 1;
};

const isMainModule = Boolean(
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url,
);

if (isMainModule) {
  try {
    runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

export const PRESS_ASSET_QA_DEFAULTS = DEFAULT_LIMITS;
