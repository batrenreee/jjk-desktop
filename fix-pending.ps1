# Pending file-rename engelini kaldirir (yonetici gerektirir).
$key = "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager"
$out = "C:\Users\ASUS\jjk-desktop\elev-result.txt"
try {
    Remove-ItemProperty -Path $key -Name PendingFileRenameOperations -Force -ErrorAction Stop
    "OK - silindi" | Out-File -Encoding ascii $out
} catch {
    ("HATA: " + $_.Exception.Message) | Out-File -Encoding ascii $out
}
