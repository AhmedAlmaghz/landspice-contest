# حذف قاعدة البيانات القديمة
Remove-Item -Path "contest.db" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "data\contest.db" -Force -ErrorAction SilentlyContinue

Write-Host "تم حذف قاعدة البيانات القديمة"
