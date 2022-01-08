const config = require('../config');
const SteamTotp = require('steam-totp');
var user = config[0];
console.log(user.username);
console.log(user.password);
setInterval(function(){
    console.log(SteamTotp.getAuthCode(user.sharedSecret));
}, 1000); 