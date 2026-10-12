param(
  [Parameter(Mandatory = $true)]
  [string]$Project,
  [string]$Output
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
$source = Join-Path $root "public\assets\replica\$Project"
if (-not (Test-Path -LiteralPath $source)) {
  throw "Asset directory not found: $source"
}
if (-not $Output) {
  $Output = Join-Path $root "outputs\$Project\asset-contact-sheet.png"
} elseif (-not [IO.Path]::IsPathRooted($Output)) {
  $Output = Join-Path $root $Output
}

$files = @(Get-ChildItem -LiteralPath $source -Filter '*.png' -File | Sort-Object Name)
if ($files.Count -eq 0) { throw "No PNG assets found under $source" }

Add-Type -AssemblyName System.Drawing
$columns = 2
$cellWidth = 800
$cellHeight = 500
$labelHeight = 42
$rows = [Math]::Ceiling($files.Count / $columns)
$sheet = New-Object System.Drawing.Bitmap ($columns * $cellWidth), ($rows * $cellHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$font = New-Object System.Drawing.Font 'Microsoft YaHei', 18, ([System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(4,31,160))
$rule = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(225,229,242)), 2

try {
  for ($index = 0; $index -lt $files.Count; $index += 1) {
    $column = $index % $columns
    $row = [Math]::Floor($index / $columns)
    $originX = $column * $cellWidth
    $originY = $row * $cellHeight
    $graphics.DrawRectangle($rule, $originX + 8, $originY + 8, $cellWidth - 16, $cellHeight - 16)
    $image = [System.Drawing.Image]::FromFile($files[$index].FullName)
    try {
      $availableWidth = $cellWidth - 50
      $availableHeight = $cellHeight - $labelHeight - 44
      $scale = [Math]::Min($availableWidth / $image.Width, $availableHeight / $image.Height)
      $width = [Math]::Round($image.Width * $scale)
      $height = [Math]::Round($image.Height * $scale)
      $x = $originX + [Math]::Round(($cellWidth - $width) / 2)
      $y = $originY + 18 + [Math]::Round(($availableHeight - $height) / 2)
      $graphics.DrawImage($image, $x, $y, $width, $height)
    } finally {
      $image.Dispose()
    }
    $graphics.DrawString($files[$index].BaseName, $font, $brush, $originX + 24, $originY + $cellHeight - $labelHeight)
  }
  $directory = Split-Path -Parent $Output
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  $sheet.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output $Output
} finally {
  $graphics.Dispose()
  $sheet.Dispose()
  $font.Dispose()
  $brush.Dispose()
  $rule.Dispose()
}
