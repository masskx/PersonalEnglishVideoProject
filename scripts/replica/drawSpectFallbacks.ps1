param([string]$OutputDir = 'assets/green-screen/spect')

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
if (-not [IO.Path]::IsPathRooted($OutputDir)) { $OutputDir = Join-Path $root $OutputDir }
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

Add-Type -AssemblyName System.Drawing
$width = 2848; $height = 1600
$green = [System.Drawing.Color]::FromArgb(0,255,0)
$black = [System.Drawing.Color]::FromArgb(0,0,0)
$orange = [System.Drawing.Color]::FromArgb(232,88,16)
$blue = [System.Drawing.Color]::FromArgb(202,241,247)

function New-Canvas {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear($green)
  @($bitmap, $graphics)
}

function Add-Xiaohei {
  param($Graphics, [int]$X, [int]$Y, [double]$Scale = 1.0, [bool]$LookLeft = $false)
  $bodyBrush = New-Object System.Drawing.SolidBrush $black
  $eyeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $limb = New-Object System.Drawing.Pen $black, (18 * $Scale)
  $limb.StartCap = 'Round'; $limb.EndCap = 'Round'
  try {
    $Graphics.FillEllipse($bodyBrush, $X, $Y, 300*$Scale, 520*$Scale)
    $eyeX = if ($LookLeft) { $X + 38*$Scale } else { $X + 182*$Scale }
    $Graphics.FillEllipse($eyeBrush, $eyeX, $Y + 105*$Scale, 30*$Scale, 30*$Scale)
    $Graphics.FillEllipse($eyeBrush, $eyeX + 52*$Scale, $Y + 108*$Scale, 30*$Scale, 30*$Scale)
    $Graphics.DrawLine($limb, $X + 70*$Scale, $Y + 490*$Scale, $X + 20*$Scale, $Y + 650*$Scale)
    $Graphics.DrawLine($limb, $X + 225*$Scale, $Y + 490*$Scale, $X + 300*$Scale, $Y + 640*$Scale)
    $Graphics.DrawLine($limb, $X + 20*$Scale, $Y + 650*$Scale, $X - 55*$Scale, $Y + 650*$Scale)
    $Graphics.DrawLine($limb, $X + 300*$Scale, $Y + 640*$Scale, $X + 375*$Scale, $Y + 630*$Scale)
  } finally { $bodyBrush.Dispose(); $eyeBrush.Dispose(); $limb.Dispose() }
}

function Save-Canvas($Bitmap, $Graphics, [string]$Name) {
  $path = Join-Path $OutputDir $Name
  $Graphics.Dispose(); $Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $Bitmap.Dispose()
  Write-Output $path
}

# Respect: one observer deliberately turns back and tips a hat toward a simple attention star.
$canvas = New-Canvas; $bitmap = $canvas[0]; $graphics = $canvas[1]
$line = New-Object System.Drawing.Pen $black, 18; $line.StartCap = 'Round'; $line.EndCap = 'Round'
$orangePen = New-Object System.Drawing.Pen $orange, 22; $orangePen.StartCap = 'Round'; $orangePen.EndCap = 'Round'
$hatBrush = New-Object System.Drawing.SolidBrush $black
try {
  Add-Xiaohei -Graphics $graphics -X 1240 -Y 420 -Scale 1.0 -LookLeft $true
  $graphics.DrawBezier($line, 1290, 650, 1120, 600, 1030, 515, 980, 400)
  $graphics.FillRectangle($hatBrush, 850, 270, 250, 120)
  $graphics.FillRectangle($hatBrush, 790, 380, 370, 38)
  $graphics.DrawLine($orangePen, 650, 430, 650, 340)
  $graphics.DrawLine($orangePen, 600, 450, 530, 390)
  $graphics.DrawLine($orangePen, 700, 450, 770, 390)
} finally { $line.Dispose(); $orangePen.Dispose(); $hatBrush.Dispose() }
Save-Canvas $bitmap $graphics '02_respect_back.png'

# Suspect: crouch under a floating ledge and look upward; dots are separate marks, not punctuation.
$canvas = New-Canvas; $bitmap = $canvas[0]; $graphics = $canvas[1]
$line = New-Object System.Drawing.Pen $black, 18; $line.StartCap = 'Round'; $line.EndCap = 'Round'
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$orangeBrush = New-Object System.Drawing.SolidBrush $orange
try {
  $graphics.DrawLine($line, 760, 550, 2050, 550)
  $graphics.FillRectangle($whiteBrush, 1390, 270, 430, 240)
  $graphics.DrawRectangle($line, 1390, 270, 430, 240)
  $graphics.DrawLine($line, 1390, 270, 1605, 410)
  $graphics.DrawLine($line, 1820, 270, 1605, 410)
  Add-Xiaohei -Graphics $graphics -X 1160 -Y 680 -Scale 0.9
  $graphics.FillEllipse($orangeBrush, 1510, 735, 34, 34)
  $graphics.FillEllipse($orangeBrush, 1580, 690, 34, 34)
  $graphics.FillEllipse($orangeBrush, 1650, 650, 34, 34)
} finally { $line.Dispose(); $whiteBrush.Dispose(); $orangeBrush.Dispose() }
Save-Canvas $bitmap $graphics '03_suspect_under.png'

# Expect: one observer looks outward through a complete tube toward an approaching parcel.
$canvas = New-Canvas; $bitmap = $canvas[0]; $graphics = $canvas[1]
$line = New-Object System.Drawing.Pen $black, 18; $line.StartCap = 'Round'; $line.EndCap = 'Round'
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$blueBrush = New-Object System.Drawing.SolidBrush $blue
$orangePen = New-Object System.Drawing.Pen $orange, 20; $orangePen.StartCap = 'Round'; $orangePen.EndCap = 'Round'
try {
  Add-Xiaohei -Graphics $graphics -X 720 -Y 470 -Scale 0.9
  $graphics.FillRectangle($whiteBrush, 1020, 555, 760, 150)
  $graphics.DrawRectangle($line, 1020, 555, 760, 150)
  $graphics.FillEllipse($blueBrush, 1695, 555, 170, 150)
  $graphics.DrawEllipse($line, 1695, 555, 170, 150)
  $graphics.DrawLine($line, 1110, 705, 1010, 1080)
  $graphics.DrawLine($line, 1560, 705, 1640, 1080)
  $graphics.FillRectangle($whiteBrush, 2100, 520, 300, 230)
  $graphics.DrawRectangle($line, 2100, 520, 300, 230)
  $graphics.DrawLine($orangePen, 1950, 500, 1990, 455)
  $graphics.DrawLine($orangePen, 1975, 575, 2030, 565)
} finally { $line.Dispose(); $whiteBrush.Dispose(); $blueBrush.Dispose(); $orangePen.Dispose() }
Save-Canvas $bitmap $graphics '04_expect_out.png'
