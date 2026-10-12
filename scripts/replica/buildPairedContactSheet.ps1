param(
  [Parameter(Mandatory = $true)][string]$LeftDir,
  [Parameter(Mandatory = $true)][string]$RightDir,
  [Parameter(Mandatory = $true)][string]$Output,
  [string]$LeftLabel = 'Series reference',
  [string]$RightLabel = 'Candidate'
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
foreach ($name in @('LeftDir','RightDir','Output')) {
  $value = Get-Variable -Name $name -ValueOnly
  if (-not [IO.Path]::IsPathRooted($value)) { Set-Variable -Name $name -Value (Join-Path $root $value) }
}
$left = @(Get-ChildItem -LiteralPath $LeftDir -File | Where-Object {$_.Extension -match '^\.(png|jpg|jpeg)$'} | Sort-Object Name)
$right = @(Get-ChildItem -LiteralPath $RightDir -File | Where-Object {$_.Extension -match '^\.(png|jpg|jpeg)$'} | Sort-Object Name)
if ($left.Count -eq 0 -or $left.Count -ne $right.Count) {
  throw "Paired folders must contain the same non-zero image count: left=$($left.Count), right=$($right.Count)"
}

Add-Type -AssemblyName System.Drawing
$cellWidth = 800; $cellHeight = 475; $headerHeight = 42
$sheet = New-Object System.Drawing.Bitmap 1600, ($left.Count * $cellHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font 'Microsoft YaHei', 15, ([System.Drawing.FontStyle]::Bold)
$leftBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(4,31,160))
$rightBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(232,88,16))
$rule = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(220,225,240)), 2

try {
  for ($index = 0; $index -lt $left.Count; $index += 1) {
    foreach ($side in 0,1) {
      $file = if ($side -eq 0) {$left[$index]} else {$right[$index]}
      $originX = $side * $cellWidth; $originY = $index * $cellHeight
      $graphics.DrawRectangle($rule, $originX + 4, $originY + 4, $cellWidth - 8, $cellHeight - 8)
      $image = [System.Drawing.Image]::FromFile($file.FullName)
      try {
        $maxWidth = $cellWidth - 24; $maxHeight = $cellHeight - $headerHeight - 20
        $scale = [Math]::Min($maxWidth / $image.Width, $maxHeight / $image.Height)
        $width = [Math]::Round($image.Width * $scale); $height = [Math]::Round($image.Height * $scale)
        $x = $originX + [Math]::Round(($cellWidth - $width) / 2)
        $y = $originY + $headerHeight + [Math]::Round(($maxHeight - $height) / 2)
        $graphics.DrawImage($image, $x, $y, $width, $height)
      } finally { $image.Dispose() }
      $label = if ($side -eq 0) {$LeftLabel} else {$RightLabel}
      $brush = if ($side -eq 0) {$leftBrush} else {$rightBrush}
      $graphics.DrawString("$($index + 1). $label", $font, $brush, $originX + 16, $originY + 10)
    }
  }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Output) | Out-Null
  $sheet.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output $Output
} finally {
  $graphics.Dispose(); $sheet.Dispose(); $font.Dispose(); $leftBrush.Dispose(); $rightBrush.Dispose(); $rule.Dispose()
}
