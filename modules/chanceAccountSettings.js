var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    console.log(steamClient.steamID);
    var didChange = false;
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/edit"
    RequestCommunity.get({uri: url}, function(error, response, body) {
        var $ = cheerio.load(body);
        var formDataArray = $("form#editForm").serializeArray(); // will create array => [ { name: 'foo', value: 'bar' } ]

        //create the changes here: begin
        
        //chance Profile Name
        var personaName = GetFormField(formDataArray, "personaName");
        if(personaName != null && (personaName.value == "" || personaName.value == "*****")){
            personaName.value = "random name"; // Replace whit a other name
            didChange = true;
        }
        //chance Summary
        var summary = GetFormField(formDataArray, "summary");
        if(summary != null){
            summary.value = summary.value + " - 1";
            didChange = true;
        }
        
        if(addCustomInfoBoxIfPosibal(formDataArray, "headline", "notes")){
            didChange = true;
        }

        //create the changes here: end

        //commit changes if didChange is true
        if(didChange){
            RequestCommunity.post({uri: url, form: serialize(formDataArray)}, function(error2, response2, body2) {
                var post$ = cheerio.load(body2);
                if(post$(".saved_changes_msg").text().includes("Changes saved.")){
                    console.log("updated - " + options.UserName);
                }else{
                    console.log("updated error - " + options.UserName);
                    console.log(url, formDataArray)
                    console.log(body2);
                }
                callback();
            });
        }else{
            console.log("no chance - " + options.UserName)
            callback();
        }
    });
};
function serialize(list) {
    var r20 = /%20/g;
    // Serialize each element into a key/value string
    var retArr = list.map(function (data) {
      return encodeURIComponent(data.name) + '=' + encodeURIComponent(data.value);
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
//will set the first posibal slot of Featured, a Custom info box
function addCustomInfoBoxIfPosibal(formDataArray, headline, bodyText) {
    var didChange = false;
    var firstFeatured = GetFormField(formDataArray, "profile_showcase[]", 0); //shoud get the first Featured dropdown field
    if(firstFeatured != null){
        if(firstFeatured.value != "8"){
            firstFeatured.value = "8"; // set to Custom info box
            didChange = true;
        }

        var title = GetFormField(formDataArray, "rgShowcaseConfig[8][0][title]");
        if(title != null){
            if(title.value != headline){
                title.value = headline;
                didChange = true;
            }
        }
        var notes = GetFormField(formDataArray, "rgShowcaseConfig[8][0][notes]");
        if(notes != null){
            if(notes.value != bodyText){
                notes.value = bodyText;
                didChange = true;
            }
        }
    }
    return didChange; // only call update if there is a chance.
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
country
state
city
customURL
summary
profile_background
favorite_badge_badgeid
favorite_badge_communityitemid
primary_group_steamid
profile_showcase[]
rgShowcaseConfig[4][6][notes]
profile_showcase_style_5
rgShowcaseConfig[5][0][badgeid]
rgShowcaseConfig[5][0][appid]
rgShowcaseConfig[5][0][border_color]
rgShowcaseConfig[5][1][badgeid]
rgShowcaseConfig[5][1][appid]
rgShowcaseConfig[5][1][border_color]
rgShowcaseConfig[5][2][badgeid]
rgShowcaseConfig[5][2][appid]
rgShowcaseConfig[5][2][border_color]
rgShowcaseConfig[5][3][badgeid]
rgShowcaseConfig[5][3][appid]
rgShowcaseConfig[5][3][border_color]
rgShowcaseConfig[5][4][badgeid]
rgShowcaseConfig[5][4][appid]
rgShowcaseConfig[5][4][border_color]
rgShowcaseConfig[5][5][badgeid]
rgShowcaseConfig[5][5][appid]
rgShowcaseConfig[5][5][border_color]
rgShowcaseConfig[6][0][appid]
rgShowcaseConfig[8][0][title]
rgShowcaseConfig[8][0][notes]
rgShowcaseConfig[9][0][accountid]
rgShowcaseConfig[11][0][appid]
rgShowcaseConfig[11][0][publishedfileid]
rgShowcaseConfig[15][0][appid]
rgShowcaseConfig[15][0][publishedfileid]
rgShowcaseConfig[17][0][appid]
rgShowcaseConfig[17][0][title]
rgShowcaseConfig[17][1][appid]
rgShowcaseConfig[17][1][title]
rgShowcaseConfig[17][2][appid]
rgShowcaseConfig[17][2][title]
rgShowcaseConfig[17][3][appid]
rgShowcaseConfig[17][3][title]
rgShowcaseConfig[17][4][appid]
rgShowcaseConfig[17][4][title]
rgShowcaseConfig[17][5][appid]
rgShowcaseConfig[17][5][title]
rgShowcaseConfig[17][6][appid]
rgShowcaseConfig[17][6][title]
*/