param(
  [string]$OutputDir = 'assets/green-screen/port'
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
if (-not [IO.Path]::IsPathRooted($OutputDir)) { $OutputDir = Join-Path $root $OutputDir }
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

Add-Type -AssemblyName System.Drawing
$width = 2848
$height = 1600
$green = [System.Drawing.Color]::FromArgb(0,255,0)
$blackColor = [System.Drawing.Color]::FromArgb(0,0,0)
$orangeColor = [System.Drawing.Color]::FromArgb(232,88,16)

function New-Canvas {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear($green)
  return @($bitmap, $graphics)
}

function Add-Xiaohei {
  param($Graphics, [int]$X, [int]$Y, [double]$Scale = 1.0)
  $black = New-Object System.Drawing.SolidBrush $blackColor
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $limb = New-Object System.Drawing.Pen $blackColor, (18 * $Scale)
  $limb.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $limb.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $body = New-Object System.Drawing.Drawing2D.GraphicsPath
  try {
    $body.AddBezier($X, $Y, $X + 175*$Scale, $Y - 35*$Scale, $X + 285*$Scale, $Y + 85*$Scale, $X + 270*$Scale, $Y + 285*$Scale)
    $body.AddBezier($X + 270*$Scale, $Y + 285*$Scale, $X + 255*$Scale, $Y + 480*$Scale, $X + 130*$Scale, $Y + 535*$Scale, $X + 30*$Scale, $Y + 450*$Scale)
    $body.AddBezier($X + 30*$Scale, $Y + 450*$Scale, $X - 25*$Scale, $Y + 345*$Scale, $X - 20*$Scale, $Y + 120*$Scale, $X, $Y)
    $body.CloseFigure()
    $Graphics.FillPath($black, $body)
    $Graphics.FillEllipse($white, $X + 135*$Scale, $Y + 110*$Scale, 34*$Scale, 34*$Scale)
    $Graphics.FillEllipse($white, $X + 195*$Scale, $Y + 114*$Scale, 34*$Scale, 34*$Scale)
    $Graphics.DrawBezier($limb, $X + 60*$Scale, $Y + 440*$Scale, $X + 35*$Scale, $Y + 545*$Scale, $X + 5*$Scale, $Y + 610*$Scale, $X - 35*$Scale, $Y + 675*$Scale)
    $Graphics.DrawBezier($limb, $X + 205*$Scale, $Y + 475*$Scale, $X + 220*$Scale, $Y + 555*$Scale, $X + 260*$Scale, $Y + 620*$Scale, $X + 315*$Scale, $Y + 660*$Scale)
    $Graphics.DrawLine($limb, $X - 35*$Scale, $Y + 675*$Scale, $X - 95*$Scale, $Y + 675*$Scale)
    $Graphics.DrawLine($limb, $X + 315*$Scale, $Y + 660*$Scale, $X + 375*$Scale, $Y + 650*$Scale)
  } finally {
    $body.Dispose(); $black.Dispose(); $white.Dispose(); $limb.Dispose()
  }
}

# transport: Xiaohei pedals a floating cargo bicycle; the code-rendered scene supplies the route arrow.
$canvas = New-Canvas
$bitmap = $canvas[0]; $graphics = $canvas[1]
$outline = New-Object System.Drawing.Pen $blackColor, 18
$orange = New-Object System.Drawing.Pen $orangeColor, 22
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$outline.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $outline.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$orange.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $orange.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
try {
  $graphics.DrawEllipse($outline, 1050, 945, 300, 300)
  $graphics.DrawEllipse($outline, 1670, 945, 300, 300)
  $graphics.DrawLine($outline, 1200, 1095, 1450, 840)
  $graphics.DrawLine($outline, 1450, 840, 1760, 1095)
  $graphics.DrawLine($outline, 1200, 1095, 1760, 1095)
  $graphics.DrawLine($outline, 1450, 840, 1580, 1095)
  $graphics.DrawLine($outline, 1375, 810, 1515, 810)
  $graphics.DrawLine($outline, 1760, 1095, 1845, 780)
  $graphics.DrawLine($outline, 1845, 780, 1940, 770)
  $graphics.FillRectangle($white, 1010, 610, 500, 300)
  $graphics.DrawRectangle($outline, 1010, 610, 500, 300)
  $graphics.DrawLine($outline, 1260, 610, 1260, 910)
  Add-Xiaohei -Graphics $graphics -X 1435 -Y 340 -Scale 0.7
  $graphics.DrawBezier($orange, 850, 1230, 650, 1245, 510, 1245, 330, 1230)
  $graphics.DrawBezier($orange, 850, 1290, 690, 1310, 540, 1310, 410, 1300)
  $path = Join-Path $OutputDir '03_transport_across.png'
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  $graphics.Dispose(); $bitmap.Dispose(); $outline.Dispose(); $orange.Dispose(); $white.Dispose()
}

# deport: Xiaohei itself rides luggage away from a thin boundary gate.
$canvas = New-Canvas
$bitmap = $canvas[0]; $graphics = $canvas[1]
$outline = New-Object System.Drawing.Pen $blackColor, 18
$orange = New-Object System.Drawing.Pen $orangeColor, 24
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$gray = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220,225,235))
$outline.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $outline.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$orange.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $orange.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
try {
  # Sparse gate, fully floating.
  $graphics.DrawLine($outline, 620, 450, 620, 1130)
  $graphics.DrawLine($outline, 930, 450, 930, 1130)
  $graphics.DrawLine($outline, 620, 450, 930, 450)
  # Compact suitcase vehicle.
  $graphics.FillRectangle($white, 1320, 910, 760, 290)
  $graphics.DrawRectangle($outline, 1320, 910, 760, 290)
  $graphics.DrawArc($outline, 1590, 760, 220, 260, 195, 150)
  $graphics.FillEllipse($gray, 1420, 1160, 95, 95)
  $graphics.FillEllipse($gray, 1890, 1160, 95, 95)
  $graphics.DrawEllipse($outline, 1420, 1160, 95, 95)
  $graphics.DrawEllipse($outline, 1890, 1160, 95, 95)
  Add-Xiaohei -Graphics $graphics -X 1500 -Y 255 -Scale 0.78
  $graphics.DrawBezier($orange, 1230, 1020, 1070, 1005, 920, 990, 780, 965)
  $graphics.DrawBezier($orange, 1210, 1100, 1050, 1095, 900, 1080, 760, 1050)
  $path = Join-Path $OutputDir '08_deport_away.png'
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  $graphics.Dispose(); $bitmap.Dispose(); $outline.Dispose(); $orange.Dispose(); $white.Dispose(); $gray.Dispose()
}

Write-Output (Join-Path $OutputDir '03_transport_across.png')
Write-Output (Join-Path $OutputDir '08_deport_away.png')
