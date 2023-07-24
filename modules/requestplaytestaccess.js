var appid = '2504900';
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback)
{
    RequestStore.post({
        url:'https://store.steampowered.com/ajaxrequestplaytestaccess/'+appid, 
        form: { 
            sessionid: SessionID
        }
    }, function (error, response, body){
        try {
            var res = JSON.parse(body);
            if(res.granted == 1 && res.success == 1){
                options.log("granted");
            }else{
                options.logError("Not granted!! " + body);

            }
        } catch (error) {
            options.logError(" error somfing went wrong", body, error);
        }
        callback();
    })
}