# SP1 — PPTX 실개봉 검증 (PowerPoint COM)
# 검증: ① 파일이 PowerPoint에서 열리는가 ② Shape.HasChart 존재 ③ Chart.ChartData.Workbook 접근(=엑셀 데이터 연동, 영상 결정타의 자동 판정 등가)
# GUI 더블클릭 편집 UX 자체는 자동화 대상 아님 — 사용자 관측 항목 (장부 분리 기록).
# 사용: pwsh -File open-verify-pptx.ps1 <pptx-path> [<pptx-path> ...]
param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Paths)

$ppt = $null
$results = @()
try {
    $ppt = New-Object -ComObject PowerPoint.Application
    foreach ($p in $Paths) {
        $full = (Resolve-Path $p).Path
        $pres = $null
        try {
            $pres = $ppt.Presentations.Open($full, $true, $false, $false) # ReadOnly, no window
            $slideCount = $pres.Slides.Count
            $chartShapes = 0
            $workbookOk = 0
            foreach ($slide in $pres.Slides) {
                foreach ($shape in $slide.Shapes) {
                    if ($shape.HasChart) {
                        $chartShapes++
                        try {
                            $wb = $shape.Chart.ChartData.Workbook   # 엑셀 데이터 연동 접근
                            if ($null -ne $wb) { $workbookOk++ }
                            $shape.Chart.ChartData.Activate() | Out-Null
                        } catch { }
                    }
                }
            }
            $results += [pscustomobject]@{ File = (Split-Path $full -Leaf); Opened = $true; Slides = $slideCount; ChartShapes = $chartShapes; WorkbookAccess = $workbookOk }
        } finally {
            if ($pres) { $pres.Close() }
        }
    }
} finally {
    if ($ppt) { $ppt.Quit() }
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
$results | Format-Table -AutoSize
$fail = $results | Where-Object { -not $_.Opened }
if ($fail) { exit 1 } else { Write-Host "PASS: all files opened in PowerPoint" }
