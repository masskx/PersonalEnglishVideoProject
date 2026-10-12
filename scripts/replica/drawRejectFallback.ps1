param(
  [string]$Output = 'assets/green-screen/ject/02_reject_return.png'
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
if (-not [IO.Path]::IsPathRooted($Output)) { $Output = Join-Path $root $Output }
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Output) | Out-Null

Add-Type -AssemblyName System.Drawing
$width = 2848
$height = 1600
$bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::FromArgb(0,255,0))

$black = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(0,0,0))
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$orange = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(232,88,16)), 24
$outline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(0,0,0)), 18
$limb = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(0,0,0)), 20
$orange.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$orange.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$outline.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$outline.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$limb.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$limb.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

try {
  # Featureless returned object.
  $graphics.FillEllipse($white, 600, 590, 310, 310)
  $graphics.DrawEllipse($outline, 600, 590, 310, 310)
  $graphics.DrawBezier($orange, 1160, 630, 1080, 600, 1010, 590, 940, 585)
  $graphics.DrawBezier($orange, 1180, 750, 1095, 735, 1015, 730, 940, 725)
  $graphics.DrawBezier($orange, 1150, 865, 1070, 880, 1010, 890, 945, 900)

  # Slightly irregular solid-black bean body.
  $body = New-Object System.Drawing.Drawing2D.GraphicsPath
  $body.StartFigure()
  $body.AddBezier(1760, 365, 2010, 320, 2160, 490, 2140, 720)
  $body.AddBezier(2140, 720, 2120, 980, 1970, 1110, 1740, 1070)
  $body.AddBezier(1740, 1070, 1540, 1035, 1495, 835, 1530, 615)
  $body.AddBezier(1530, 615, 1565, 450, 1630, 385, 1760, 365)
  $body.CloseFigure()
  $graphics.FillPath($black, $body)

  # Thin arms push in the opposite direction.
  $graphics.DrawBezier($limb, 1580, 650, 1450, 625, 1360, 620, 1245, 650)
  $graphics.DrawBezier($limb, 1580, 755, 1460, 760, 1370, 742, 1250, 705)
  $graphics.FillEllipse($black, 1218, 622, 54, 54)
  $graphics.FillEllipse($black, 1222, 678, 54, 54)

  # Thin legs with calm planted feet.
  $graphics.DrawBezier($limb, 1745, 1050, 1690, 1130, 1650, 1210, 1595, 1280)
  $graphics.DrawBezier($limb, 1970, 1070, 2000, 1155, 2050, 1225, 2125, 1280)
  $graphics.DrawLine($limb, 1595, 1280, 1510, 1280)
  $graphics.DrawLine($limb, 2125, 1280, 2208, 1280)

  # Exactly two white dot eyes, no mouth.
  $graphics.FillEllipse($white, 1870, 535, 40, 40)
  $graphics.FillEllipse($white, 1945, 540, 40, 40)

  $bitmap.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output $Output
} finally {
  $graphics.Dispose()
  $bitmap.Dispose()
  $black.Dispose()
  $white.Dispose()
  $orange.Dispose()
  $outline.Dispose()
  $limb.Dispose()
  if ($body) { $body.Dispose() }
}
