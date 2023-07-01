var doorToOpen = 2;
var clan_accountid = 33025758;
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback)
{
    RequestStore.post({
        url:'https://store.steampowered.com/saleaction/ajaxopendoor', 
        form: { 
            sessionid: SessionID, 
            door_index: doorToOpen,
            clan_accountid: clan_accountid
        }
    }, function (error, response, body){
        try {
            var res = JSON.parse(body);
            if(res.err_msg){
                options.logError(err_msg);
            }
            if(res.success == 1){
                options.log("Door opnened");
            }
        } catch (error) {
            options.logError(" error somfing went wrong", body, error);
        }
        callback();
    })

}

/*xpr_prsnlzdslpg_wsh=6; xpr_prsnlzdslpg_ir=66; xpr_prsnlzdslpg_dlc=81;*/