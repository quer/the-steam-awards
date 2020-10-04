//Info if a user have more then one page, only one page will be cleaned. 
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get("https://store.steampowered.com/wishlist/profiles/"+steamClient.steamID+"/wishlistdata/?p=0", function (err, httpResponse, body) {
        var jsonObj = JSON.parse(body);
        var apps = [];
        for (var k in jsonObj) {
            if (jsonObj.hasOwnProperty(k)) {
               apps.push(k);
            }
        }
        console.log(apps);
        var loop = function (index, end_callback) {
            if(apps.length > index){
                var app = apps[index];
                RequestStore.post({
                    url: "https://store.steampowered.com/wishlist/profiles/"+steamClient.steamID+"/remove",
                    form:{
                        appid: app,
                        sessionid: SessionID
                    }
                }, function (postErr, postHttpResponse, postBody) {
                    console.log("Removed: " + apps[index]);
                    loop(++index, end_callback);
                });
            }else{
                console.log("done remove all games from wishlist");
                end_callback();
            }
        }
        loop(0, callback);
    });
}