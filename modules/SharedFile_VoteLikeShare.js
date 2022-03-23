var SharedList = [
    { SharedId: "2760060365", appid: "1599340" },
    { SharedId: "2760060333", appid: "1599340" },
    { SharedId: "2760060307", appid: "1599340" },
    { SharedId: "2760060272", appid: "1599340" },
    { SharedId: "2760060238", appid: "1599340" },
    { SharedId: "2760060174", appid: "1599340" },
    { SharedId: "2760060207", appid: "1599340" },
    { SharedId: "2760060134", appid: "1599340" },
    { SharedId: "2760060106", appid: "1599340" },
    { SharedId: "2759007093", appid: "1599340" },
    { SharedId: "2759007071", appid: "1599340" },
    { SharedId: "2759007038", appid: "1599340" },
    { SharedId: "2759007019", appid: "1599340" },
    { SharedId: "2759006977", appid: "1599340" },
    { SharedId: "2759006936", appid: "1599340" },
    { SharedId: "2759006905", appid: "1599340" },
    { SharedId: "2759006865", appid: "1599340" },
    { SharedId: "2759006838", appid: "1599340" },
    { SharedId: "2759006822", appid: "1599340" },
    { SharedId: "2759006784", appid: "1599340" },
    { SharedId: "2759006754", appid: "1599340" },
    { SharedId: "2759006675", appid: "1599340" },
    { SharedId: "2759006713", appid: "1599340" },
    { SharedId: "2759006636", appid: "1599340" },
    { SharedId: "2759006591", appid: "1599340" },
    { SharedId: "2759006551", appid: "1599340" },
    { SharedId: "2759006532", appid: "1599340" },
    { SharedId: "2759006532", appid: "1599340" },
    { SharedId: "2759006510", appid: "1599340" },
    { SharedId: "2759006485", appid: "1599340" },
    { SharedId: "2759006419", appid: "1599340" },
    { SharedId: "2759006443", appid: "1599340" },
    { SharedId: "2759006395", appid: "1599340" },
    { SharedId: "2759006370", appid: "1599340" },
    { SharedId: "2759006331", appid: "1599340" },
    { SharedId: "2759006294", appid: "1599340" },
    { SharedId: "2757811780", appid: "1599340" },
    { SharedId: "2757811750", appid: "1599340" },
    { SharedId: "2757811679", appid: "1599340" },
    { SharedId: "2757811715", appid: "1599340" },
    { SharedId: "2757811656", appid: "1599340" },
    { SharedId: "2757811626", appid: "1599340" },
    { SharedId: "2757811559", appid: "1599340" },
    { SharedId: "2757811595", appid: "1599340" },
    { SharedId: "2757811474", appid: "1599340" },
    { SharedId: "2757811512", appid: "1599340" },
    { SharedId: "2757811426", appid: "1599340" },
    { SharedId: "2757811398", appid: "1599340" },
    { SharedId: "2757811362", appid: "1599340" },
    { SharedId: "2757811337", appid: "1599340" },
    { SharedId: "2757811303", appid: "1599340" },
    { SharedId: "2757811275", appid: "1599340" },
    { SharedId: "2757811275", appid: "1599340" },
    { SharedId: "2757811248", appid: "1599340" },
    { SharedId: "2757811219", appid: "1599340" },
    { SharedId: "2757811143", appid: "1599340" },
    { SharedId: "2757811181", appid: "1599340" },
    { SharedId: "2757811072", appid: "1599340" },
    { SharedId: "2757811103", appid: "1599340" },
    { SharedId: "2757811181", appid: "1599340" },
    { SharedId: "2757811028", appid: "1599340" },
    { SharedId: "2757811002", appid: "1599340" }
]








module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < SharedList.length; i++) {
        const guideInfo = SharedList[i];
        try {       
            await LoadShareWebPage(RequestCommunity, guideInfo.SharedId);
            await Rate(RequestCommunity, SessionID, guideInfo.SharedId);
            await Favorite(RequestCommunity, SessionID, guideInfo.SharedId, guideInfo.appid);
        } catch (error) {
            options.logError(error);
        }
    }

    callback();
};

function LoadShareWebPage(RequestCommunity, id) {
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