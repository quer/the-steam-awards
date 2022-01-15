var GuideList = [
    //Below object is a example ( but all properties must always exist )
    {
        GuideId: "947272224",
        appid: "753" // must be the appid for the guide
    }
]
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < GuideList.length; i++) {
        const guideInfo = GuideList[i];
        try {       
            await LoadGuide(RequestCommunity, guideInfo.GuideId);
            await Rate(RequestCommunity, SessionID, guideInfo.GuideId);
            await Favorite(RequestCommunity, SessionID, guideInfo.GuideId, guideInfo.appid);
        } catch (error) {
            options.logError(error);
        }
    }

    callback();
};

function LoadGuide(RequestCommunity, id) {
    return new Promise(function (resolve ) {
        RequestCommunity.get({
            url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+id
        }, function (error, response, body) {
            resolve();
        });
    });
}

function Rate(RequestCommunity, SessionID, id) {
    return new Promise(function (resolve, reject ) {
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

function Favorite(RequestCommunity, SessionID, id, appid) {
    return new Promise(function (resolve, reject ) {
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
//doent work, not sure why
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