const config = require('../config');
const SteamTotp = require('steam-totp');
var args = process.argv;
if(args.length > 2){
    try {
        var index = args[2];
        index = parseInt(index);
        if(config[index]){
            var user = config[index];
            if(user.sharedSecret){
                console.log(user.username);
                console.log(user.password);
                setInterval(function(){
                    console.log(SteamTotp.getAuthCode(user.sharedSecret));
                }, 1000); 
            }else{
                console.log("the account do not have a sharedSecret")
            }
        }else{
            console.log("the account index '"+ index +"', do not exist ")
        }        
    } catch (error) {
        
    }
    
}else{
    console.log("you have to pass the index, of the account to se totp from")
}