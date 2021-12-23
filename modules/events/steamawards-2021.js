module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    vote(RequestStore, SessionID, 61, 892970, 0, function () {
        vote(RequestStore, SessionID, 62, 752480, 0, function () {
            vote(RequestStore, SessionID, 63, 105600, 0, function () {
                vote(RequestStore, SessionID, 64, 1426210, 0, function () {
                    vote(RequestStore, SessionID, 65, 1551360, 0, function () {
                        vote(RequestStore, SessionID, 66, 1282730, 0, function () {
                            vote(RequestStore, SessionID, 67, 1517290, 0, function () {
                                vote(RequestStore, SessionID, 68, 1088850, 0, function () { 
                                    vote(RequestStore, SessionID, 69, 1091500, 0, function () { 
                                        vote(RequestStore, SessionID, 70, 1248130, 0, function () { 
                                            callback();       
                                        })  
                                    })       
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