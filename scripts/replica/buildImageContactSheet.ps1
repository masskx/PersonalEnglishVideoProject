param(
  [Parameter(Mandatory = $true)]
  [string]$Source,
  [Parameter(Mandatory = $true)]
  [string]$Output,
  [int]$Columns = 2,
  [int]$CellWidth = 800,
  [int]$CellHeight = 500
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
if (-not [IO.Path]::IsPathRooted($Source)) { $Source = Join-Path $root $Source }
if (-not [IO.Path]::IsPathRooted($Output)) { $Output = Join-Path $root $Output }
if (-not (Test-Path -LiteralPath $Source)) { throw "Source directory not found: $Source" }
$files = @(Get-ChildItem -LiteralPath $Source -File | Where-Object {$_.Extension -match '^\.(png|jpg|jpeg)$'} | Sort-Object Name)
if ($files.Count -eq 0) { throw "No images found under $Source" }

Add-Type -AssemblyName System.Drawing
$labelHeight = 38
$rows = [Math]::Ceiling($files.Count / $Columns)
$sheet = New-Object System.Drawing.Bitmap ($Columns * $CellWidth), ($rows * $CellHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$font = New-Object System.Drawing.Font 'Microsoft YaHei', 15, ([System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(4,31,160))
$rule = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(225,229,242)), 2

try {
  for ($index = 0; $index -lt $files.Count; $index += 1) {
    $column = $index % $Columns
    $row = [Math]::Floor($index / $Columns)
    $originX = $column * $CellWidth
    $originY = $row * $CellHeight
    $graphics.DrawRectangle($rule, $originX + 6, $originY + 6, $CellWidth - 12, $CellHeight - 12)
    $image = [System.Drawing.Image]::FromFile($files[$index].FullName)
    try {
      $availableWidth = $CellWidth - 28
      $availableHeight = $CellHeight - $labelHeight - 24
      $scale = [Math]::Min($availableWidth / $image.Width, $availableHeight / $image.Height)
      $width = [Math]::Round($image.Width * $scale)
      $height = [Math]::Round($image.Height * $scale)
      $x = $originX + [Math]::Round(($CellWidth - $width) / 2)
      $y = $originY + 10 + [Math]::Round(($availableHeight - $height) / 2)
      $graphics.DrawImage($image, $x, $y, $width, $height)
    } finally { $image.Dispose() }
    $graphics.DrawString($files[$index].BaseName, $font, $brush, $originX + 16, $originY + $CellHeight - $labelHeight)
  }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Output) | Out-Null
  $sheet.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output $Output
} finally {
  $graphics.Dispose(); $sheet.Dispose(); $font.Dispose(); $brush.Dispose(); $rule.Dispose()
}
