module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    vote(RequestStore, SessionID, 34, 814380, 0, function () {
        vote(RequestStore, SessionID, 35, 620980, 0, function () {
            vote(RequestStore, SessionID, 36, 730, 0, function () {
                vote(RequestStore, SessionID, 37, 813780, 0, function () {
                    vote(RequestStore, SessionID, 38, 557340, 0, function () {
                        vote(RequestStore, SessionID, 39, 632470, 0, function () {
                            vote(RequestStore, SessionID, 40, 594650, 0, function () {
                                vote(RequestStore, SessionID, 41, 779340, 0, function () { 
                                    callback();       
                                })
                            })
                        })
                    })
                })
            })
        })
    })
};
function vote(RequestStore, SessionID, voteid, appid, developerid, callback) {
    RequestStore.post({
        url: 'https://store.steampowered.com/salevote',
        form:{
            sessionid: SessionID, 
            voteid: voteid, 
            appid: appid,  
            developerid: developerid 
        },
        headers: {
            'Origin': 'https://store.steampowered.com',
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': 'https://store.steampowered.com/steamawards/2019/'

        }
    }, function (error, response, body) {
        callback();
    })
}