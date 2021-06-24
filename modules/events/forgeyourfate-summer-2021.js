module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    /*
    * Made by Revadike (License MIT)
    * found on https://www.steamgifts.com/discussion/ARvJT/cheat-summer-sale-2021-badge
    *
    * The Masked Avenger (badge 51) = choices sum 14-16
    * The Trailblazing Explorer (badge 52) = choices sum 17-19
    * The Gorilla Scientist (badge 53) = choices sum 20-22
    * The Paranormal Professor (badge 54) = choices sum 23-25
    * The Ghost Detective (badge 55) = choices sum 26-28
    */
    let choices = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]; // make sure the sum matches your desired badge! use 1 or 2 

    /**
     * let choices = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]; // 14 => The Masked Avenger
     * let choices = [1,2,1,1,1,2,2,1,2,1,1,2,1,2]; // 20 => The Gorilla Scientist
     */
    await getNewItems(RequestCommunity);
    for (let i = 1; i <= 14; i++) {
        await loopAnswer(RequestStore, i, choices[i-1], SessionID);
    }
    await getNewItems(RequestCommunity);
    callback();

}

function loopAnswer(RequestStore, i, choice, SessionID) {
    return new Promise(function (resolve) {
        RequestStore.post({
            url:'https://store.steampowered.com/promotion/ajaxclaimstickerforgenre',
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

function getNewItems(RequestCommunity) {
    return new Promise(function (resolve) {
        RequestCommunity.get('https://steamcommunity.com/actions/GetNotificationCounts', function (error, response, body) {
            //console.log(body);    
            var data = JSON.parse(body);
            console.log("new items: "+ data.notifications["5"]);
            resolve(data.notifications["5"]);
        })
    })
}