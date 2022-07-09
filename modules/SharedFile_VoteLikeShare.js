var RateMode = {
    "up": 1, 
    "down": 2
}
var FavoriteMode = {
    "favorite": 1, 
    "unFavorite": 2
}

var SharedList = [
    { sharedId: "923012519", appid: "753", view: true, rate: true, rateMode: RateMode.up, favorite: true, favoriteMode: FavoriteMode.favorite },
    ...
]

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < SharedList.length; i++) {
        const guideInfo = SharedList[i];
        try {  
            if('view' in guideInfo && guideInfo.view)
                await viewPage(RequestCommunity, guideInfo.sharedId);
            if('rate' in guideInfo && guideInfo.rate){
                if('rateMode' in guideInfo && guideInfo.rateMode == RateMode.down){
                    await RateDown(RequestCommunity, SessionID, guideInfo.sharedId);
                }else{
                    await RateUp(RequestCommunity, SessionID, guideInfo.sharedId);
                }
            }
            if('favorite' in guideInfo && guideInfo.favorite)
            {
                if('favoriteMode' in guideInfo && guideInfo.favoriteMode == FavoriteMode.unFavorite){
                    await UnFavorite(RequestCommunity, SessionID, guideInfo.sharedId, guideInfo.appid);
                }else{
                    await Favorite(RequestCommunity, SessionID, guideInfo.sharedId, guideInfo.appid);
                }
            }
        } catch (error) {
            options.logError(error);
        }
    }

    callback();
};

function viewPage(RequestCommunity, id) {
    return new Promise(function (resolve ) {
        RequestCommunity.get({
            url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+id
        }, function (error, response, body) {
            resolve();
        });
    });
}

function RateUp(RequestCommunity, SessionID, id) {
    return new Promise(function (resolve ) {
        var voteUrl = "https://steamcommunity.com/sharedfiles/voteup";
        RequestCommunity.post({
            url: voteUrl,
            form:{
                sessionid: SessionID,
                id: id
            }
        }, function (error, response, body) {
            resolve();
        });
    });
}
function RateDown(RequestCommunity, SessionID, id) {
    return new Promise(function (resolve ) {
        var voteUrl = "https://steamcommunity.com/sharedfiles/votedown";
        RequestCommunity.post({
            url: voteUrl,
            form:{
                sessionid: SessionID,
                id: id
            }
        }, function (error, response, body) {
            resolve();
        });
    });
}
function Favorite(RequestCommunity, SessionID, id, appid) {
    return new Promise(function (resolve ) {
        var url = "https://steamcommunity.com/sharedfiles/favorite";
        RequestCommunity.post({
            url: url,
            form:{
                sessionid: SessionID,
                id: id,
                appid:appid 
            }
        }, function (error, response, body) {
            resolve();
        });   
    });
}
function UnFavorite(RequestCommunity, SessionID, id, appid) {
    return new Promise(function (resolve ) {
        var url = "https://steamcommunity.com/sharedfiles/unfavorite";
        RequestCommunity.post({
            url: url,
            form:{
                sessionid: SessionID,
                id: id,
                appid:appid 
            }
        }, function (error, response, body) {
            resolve();
        });   
    });
}
//doent work, not sure why ( it not that RequestCommunity and steamClient doent exist here.. )
function Share(id, appid, callback) {
    var url = "https://steamcommunity.com/profiles/"+ steamClient.steamID +"/ajaxpostuserstatus/";
    RequestCommunity.post({
        url: url,
        form:{
            sessionid: SessionID,
            status_text: "\n\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=" + id,
            appid:appid 
        }
    }, function (error, response, body) {
        setTimeout(function () {
            callback();
        }, 500);
    });
}