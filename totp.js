const config = require('./config');
const SteamTotp = require('steam-totp');
var user = config[0];
console.log(user.steam_user);
console.log(user.steam_pass);
setInterval(function(){
    console.log(SteamTotp.getAuthCode(user.sharedSecret));
}, 1000);