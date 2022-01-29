const fs = require('fs');
const config = require('../config');
const Settings = require('../lib/Settings');
//change Settings here.

for (let i = 0; i < config.length; i++) {
    const auth = config[i];
    auth[Settings.AuthFieldSpecialAccountText] = i;
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