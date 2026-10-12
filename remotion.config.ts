import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
// 默认 JPEG 质量 80 会在细墨线和文字边缘产生振铃噪点，H.264 再压一次后更明显；95 保留手绘线条细节。
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(1);
