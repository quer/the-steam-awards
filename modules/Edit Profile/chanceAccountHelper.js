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
    },
    /*
     * the access_token is from the GetAccountInfo()-> ProfileEdit
     eks on output list
     {
        appid: 1017190,
        communityitemid: "10564936286",
        image_large: "items/1017190/575d19e7d5fabb313c6c4d99c5d37f15a80e0018.jpg",
        item_class: 3,
        item_description: "Courtyard",
        item_title: "Lunar New Year 2019 - Courtyard",
        item_type: 14,
        name: "Courtyard"
    }
     */
    GetBackgrounds: function (RequestCommunity, access_token) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.get({uri: "https://api.steampowered.com/IPlayerService/GetProfileItemsOwned/v1?access_token="+ access_token +"&input_json=%7B%22language%22:%22english%22%7D"}, function(error, response, body) {
                var json = null;
                try {
                    json = JSON.parse(body);
                    if(json.response && json.response.profile_backgrounds){
                        resolve(json.response.profile_backgrounds);
                    }else{
                        resolve([]);
                    }
                } catch (error) {
                    reject({text: "Error when getting account backgrounds", error: error});
                }

            })
        })
    },
    /*
     * the access_token is from the GetAccountInfo()-> ProfileEdit
     eks on output list
     {
        appid: 1017190,
        communityitemid: "10564936286",
        image_large: "items/1017190/575d19e7d5fabb313c6c4d99c5d37f15a80e0018.jpg",
        item_class: 3,
        item_description: "Courtyard",
        item_title: "Lunar New Year 2019 - Courtyard",
        item_type: 14,
        name: "Courtyard"
    }
     */
    GetMineProfiles: function (RequestCommunity, access_token) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.get({uri: "https://api.steampowered.com/IPlayerService/GetProfileItemsOwned/v1?access_token="+ access_token +"&input_json=%7B%22language%22:%22english%22%7D"}, function(error, response, body) {
                var json = null;
                try {
                    json = JSON.parse(body);
                    if(json.response && json.response.mini_profile_backgrounds){
                        resolve(json.response.mini_profile_backgrounds);
                    }else{
                        resolve([]);
                    }
                } catch (error) {
                    reject({text: "Error when getting account Mine Profiles", error: error});
                }

            })
        })
    },
    /**
     * will return a list of
    {
        avatarHash: "160d0ea47303bd7eb364c7bcf686286b5feafb16"
        name: "Big Picture"
        steamid: "103582791433577547"
    }
     */
    GetGroups: function (RequestCommunity, steamId) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.get({uri: "https://steamcommunity.com/profiles/"+ steamId +"/ajaxgroupinvite?select_primary=1&json=1"}, function(error, response, body) {
                var json = null;
                try {
                    json = JSON.parse(body);
                    resolve(json);
                    
                } catch (error) {
                    reject({text: "Error when getting account Groups", error: error});
                }

            })
        })
    },
    GetRandomFromList: function (list) {
        return list[Math.floor(Math.random() * list.length)];
    }
}


/**
 * dev info !
 * i shoud make a wiki tutoial on this, when there is time to it.
 * Normal when you see the ajax call from steam it will have a "input_protobuf_encoded" as parm, and the return a encrypted data eks: 
 * Ê78´B@HøÎâ4:.8ÎM@4H¢Þ4
 * 
 * To get a normal/real ajax call, set a break point into "main.js" in the "e.prototype.Send = function(e, t, n, r) {" ( line 8918 af the time) methode ( or search for "this.m_bJsonMode")
 * Here you need to set the "this.m_bJsonMode" to true, this will set all calles to be json data, and not the encripted. 
 */