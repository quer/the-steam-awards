

const fs = require('fs');
const config = require('../config');
const CoreSteam = require('../lib/CoreSteam');
const getSteamAPIKey = require('steam-web-api-key');
const Settings = require('../lib/Settings');
//change Settings here.
(async function () {
    for (let i = 0; i < config.length; i++) {
        const auth = config[i];
        if(!auth[Settings.AuthFieldNameSteamApiKey]){
            await GetApiKey(auth);    
        }
    }

    var endString = `var config = ${ JSON.stringify(config, null, 4) };\n`;
    endString += "module.exports = config;";
    fs.writeFile('config.js', endString, err => {
        if (err) {
        console.error(err)
        return
        }
        //file written successfully
        console.log("Done")
    })
})()




function GetApiKey(auth) {
    return new Promise(async function (resolve, reject) {
        function CustomModuleToGetSteamApi(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
            getSteamAPIKey({ sessionID: SessionID, webCookie: options.webCookie }, function(err, APIKey) {
                    if(err){
                        console.log("Error for account: " + auth[Settings.AuthFieldNameUsername])
                        console.log(err)
                    }else{
                        auth[Settings.AuthFieldNameSteamApiKey] = APIKey;
                    }
                    callback();
            });
        }
        var botContainer = new CoreSteam(this, auth, [CustomModuleToGetSteamApi]);
        if(botContainer.ValidateAuth()){
            await botContainer.Run();
        }else{
            console.log("Invalid auth for account:" + auth[Settings.AuthFieldNameUsername] )
        }
        resolve();
    })
}

