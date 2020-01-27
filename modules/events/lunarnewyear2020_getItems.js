var ItemToGet = [29, 23, 20, 25]; //all bot will get that 4 items.
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var loop = function (list, index, inner_callback) {
        if(list.length > index){
            GetItem(RequestStore, SessionID, list[index], function () {
                loop(list, ++index, inner_callback);
            })
        }else{
            inner_callback();
        }
    }
    loop(ItemToGet, 0, callback);
}

function GetItem(RequestStore, SessionID, id, callback) {
    RequestStore.post(
        {
            url: 'https://store.steampowered.com/lunarnewyearmarket/ajaxredeemtokens/', 
            form: { sessionid: SessionID, itemid: id, eventid: 8 }
        }, 
        function (error, response, body){
            console.log("got item: " + id, body);
            callback();
        }
    );
}