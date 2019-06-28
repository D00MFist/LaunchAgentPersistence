# LaunchAgentPersistence
Persistence using Launch Agents for OSX in JXA 

This script will create a hidden directory in the current user's $HOME. 
Then uploads the payload to script within that directory.
Uploads a plist to $HOME/Library/LaunchAgents which executes that script. The default interval is every minute.

# Usage
* Modify the payload variable with the desired one

```JavaScript
D00mfist: ~$ osascript -l JavaScript LAgentPersist.js
```
