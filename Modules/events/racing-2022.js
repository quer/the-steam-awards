//you do not need to answer all to get the Badge. if the "answerAll", is true, it will answer then all. if false, just the one to give the badge
var answerAll = true; 

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    if(answerAll){
        for (let i = 0; i < 6; i++) {
            await OpenDoor(i);
        }
    }else{
        await OpenDoor(5);
    }
    callback();
    
    function OpenDoor(doorID) {
        return new Promise(function (resolve) {
            RequestStore.post(
                {
                    url: 'https://store.steampowered.com/saleaction/ajaxopendoor',
                    form:{
                        sessionid: SessionID,
                        'door_index': doorID
                    },
                    headers: {
                        'Origin': 'https://store.steampowered.com',
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Referer': 'https://store.steampowered.com/category/racing/'
                    }
                }, function (error, response, body) {
                    options.log("do question: " + doorID);
                    options.log(body);
                    resolve();
                });
        })
    }
}
