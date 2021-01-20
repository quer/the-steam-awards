var cheerio = require('cheerio');
module.exports = {
    GetAccountInfo: function(RequestCommunity, steamId){
        return new Promise(function (resolve) {
            RequestCommunity.get({uri: "https://steamcommunity.com/profiles/"+steamId+"/edit/"}, function(error, response, body) {
                var returnObj = { "ProfileEdit": null, "ProfileBadges": null }
                var $ = cheerio.load(body);
                var accountConfig = $("#profile_edit_config");
                var profileInformation = accountConfig.attr("data-profile-edit")
                if(profileInformation != ""){
                    returnObj.ProfileEdit = JSON.parse(profileInformation);
                }
                var profileBagde = accountConfig.attr("data-profile-badges");
                if(profileBagde != ""){
                    returnObj.ProfileBadges = JSON.parse(profileBagde);
                }
                resolve(returnObj);
            })
        })
    }
}