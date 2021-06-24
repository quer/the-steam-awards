module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    let choice = 1; // 1 or 2
    for (let i = 1; i <= 14; i++) {
        await loopAnser(RequestStore, i, choice, SessionID);
    }
    callback();

}

function loopAnser(RequestStore, i, choice, SessionID) {
    return new Promise(function (resolve) {
        RequestStore.post("https://store.steampowered.com/promotion/ajaxclaimstickerforgenre", {
            url:'https://store.steampowered.com/explore/generatenewdiscoveryqueue',
            form:{ 
                genre: i, 
                choice: choice, 
                sessionid: SessionID 
            },
        }, 
        function (error, response, body) {
            console.log("genre " + i + "-" + choice + ":", body);
            resolve();
        })
    })
    
}