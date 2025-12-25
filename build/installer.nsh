!macro customInstall
  ; Check if already installed
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VB-Audio Virtual Cable" "DisplayName"
  
  ${If} $0 == ""
    MessageBox MB_YESNO|MB_ICONQUESTION "SoundMancer requires VB-Audio Virtual Cable to route audio to your microphone. Would you like to install it now?" IDNO skip_driver
    
    DetailPrint "Installing VB-Cable Driver..."
    ; Check if running as 64-bit
    ${If} ${RunningX64}
      ExecWait '"$INSTDIR\vb-cable\VBCABLE_Setup_x64.exe" -i -h'
    ${Else}
      ExecWait '"$INSTDIR\vb-cable\VBCABLE_Setup.exe" -i -h'
    ${EndIf}
    
    skip_driver:
  ${Else}
    DetailPrint "VB-Cable Driver already installed. Skipping."
  ${EndIf}
!macroend
