$ErrorActionPreference = 'Stop'
$root = 'C:\Users\40312758\Desktop\hr.manager.front.end-main\EditionProject'

Write-Host '=== Phase 1: Rename Edition -> JavidHrm ===' -ForegroundColor Cyan

# Rename directories (deepest first)
Get-ChildItem $root -Recurse -Directory |
    Where-Object { $_.Name -like 'Edition*' } |
    Sort-Object { $_.FullName.Length } -Descending |
    ForEach-Object {
        $newName = $_.Name -replace '^Edition', 'JavidHrm'
        if ($newName -ne $_.Name) {
            Rename-Item -LiteralPath $_.FullName -NewName $newName
            Write-Host "Renamed dir: $($_.Name) -> $newName"
        }
    }

# Rename csproj files
Get-ChildItem $root -Recurse -Filter 'Edition*.csproj' | ForEach-Object {
    $newName = $_.Name -replace '^Edition', 'JavidHrm'
    Rename-Item -LiteralPath $_.FullName -NewName $newName
    Write-Host "Renamed csproj: $($_.Name) -> $newName"
}

# Rename solution
if (Test-Path "$root\Edition.sln") {
    Rename-Item "$root\Edition.sln" 'JavidHrm.sln'
    Write-Host 'Renamed Edition.sln -> JavidHrm.sln'
}

# Replace text content
$patterns = @('*.cs', '*.csproj', '*.sln', '*.json', '*.resx', '*.md', '*.http', '*.props', '*.targets')
$files = Get-ChildItem $root -Recurse -File -Include $patterns |
    Where-Object { $_.FullName -notmatch '\\scripts\\' }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -notmatch 'Edition') { continue }

    $newContent = $content
    $newContent = $newContent -replace 'EditionDbContext', 'JavidHrmDbContext'
    $newContent = $newContent -replace 'EditionWebSite', 'JavidHrm'
    $newContent = $newContent -replace 'namespace Edition\.', 'namespace JavidHrm.'
    $newContent = $newContent -replace 'using Edition\.', 'using JavidHrm.'
    $newContent = $newContent -replace 'Edition\.', 'JavidHrm.'

    if ($newContent -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
    }
}

Write-Host '=== Phase 1: Delete commerce seed data ===' -ForegroundColor Cyan
$seedExtract = "$root\src\Infrastructure\JavidHrm.Infrastructure.Persistence\SeedData\Data\Extract Code Files"
if (Test-Path $seedExtract) {
    Remove-Item $seedExtract -Recurse -Force
    Write-Host "Removed: $seedExtract"
}

Write-Host 'Rename complete.' -ForegroundColor Green
