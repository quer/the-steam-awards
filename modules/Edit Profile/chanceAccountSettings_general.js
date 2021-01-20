/**
 * use this module to chance setting on a account for site:
 * https://steamcommunity.com/profiles/#steam64#/edit/info
 * as the form on the page, is generate from the js, i have mirrowed how it done on the page
 */
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    console.log(steamClient.steamID);
    if(true){ // do you what to chance all running account, here you can just make a if, eks on steam id, or loginName
        var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);
        accountInfo = accountInfo.ProfileEdit;
        if(accountInfo == null){
            console.log(options.accountPretty+ " somefing went wrong when getting account info!");
            callback();
            return;
        }
        var objectToEdit = {
            "sessionID": SessionID,
            "type": "profileSave", 
            "weblink_1_title": "",
            "weblink_1_url": "",
            "weblink_2_title": "",
            "weblink_2_url": "",
            "weblink_3_title": "",
            "weblink_3_url": "",
            "personaName": accountInfo.strPersonaName,
            "real_name": accountInfo.strRealName,
            "customURL": accountInfo.strCustomURL,
            "country": accountInfo.LocationData.locCountryCode,
            "state": accountInfo.LocationData.locStateCode,
            "city": accountInfo.LocationData.locCityCode,
            "summary": accountInfo.strSummary +"- 1",
            "hide_profile_awards": accountInfo.ProfilePreferences.hide_profile_awards,
            "json": 1
    }

        
        RequestCommunity.post({uri: "https://steamcommunity.com/profiles/76561198423665605/edit/info", form: objectToEdit}, function(error, response, body) {
            var returnJson = JSON.parse(body); // {success: 1, errmsg: ""}
            if(returnJson.success == 1){
                console.log(options.accountPretty+ " Setting chanced!");
            }else{
                console.log(options.accountPretty+ " Error saving Setting! Error:" + errmsg);
            }
            callback();
        });
    }else{
        console.log(options.accountPretty+ " Skipping changing account settings");
        callback();
    }   
};
function serialize(obj) {
    var r20 = /%20/g;
    var retArr = []
    // Serialize each element into a key/value string
    Object.keys(obj).map(function (k) {
        retArr.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
    });
  
    // Return the resulting serialization
    return retArr.join('&').replace(r20, '+');
};
function GetFormField(list, fieldName, index = 0) {
    var found = 0; // if there is a list, like "profile_showcase" where you select Featured, thay all have the same name, then to get the right one in the list, you can use the index.
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if(item.name == fieldName){
            if(found == index){
                return item;
            }else{
                ++found;
            }
        }
    }
    return null;
}

/*
Here is the possible fields to changes: (you need to go to "https://steamcommunity.com/profiles/xxxxx/edit", to see what is what. )

sessionID
type
weblink_1_title
weblink_1_url
weblink_2_title
weblink_2_url
weblink_3_title
weblink_3_url
personaName
real_name
customURL
country
state
city
summary
hide_profile_awards


//ForDev og module

use "json(`form[action=""https://steamcommunity.com/profiles/##steamID##/edit/info""]`).serializeArray()"
to get all the field in the form, to update list later on.
*/