var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    console.log(steamClient.steamID);
    var didChance = false;
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/edit"
    RequestCommunity.get({uri: url}, function(error, response, body) {
        var $ = cheerio.load(body);
        var inputs = $("form#editForm input");
        var formData = {};

        inputs.each(function(i, elem) {
            var input = $(this);
            var name = input.attr("name");
            var value = input.val();
            if(name == "personaName" && (value == "" || value == "*****")){
                value = "random name"; // Replace whit a other name
                didChance = true;
            }
            if(name == "real_name" && value == ""){
                value = "#" + options.Index; // replace whit a other real name
                didChance = true;
            }
            if(name == "primary_group_steamid" && (value == "0" || value == "")){ // eks if you what a other default group
                value = "0"; // eks -> "103582791429521975"; 
                didChance = true;
            }
            if(value == undefined){
                value = "";
            }
            formData[name] = value; // set all input whit the value from the real page, to ensure all field are as it shoud be.
        });
        if(didChance){
            RequestCommunity.post({uri: url, formData: formData}, function(error2, response2, body2) {
                var post$ = cheerio.load(body2);
                if(post$(".saved_changes_msg").text().includes("Changes saved.")){
                    console.log("updated - " + options.UserName);
                }else{
                    console.log(url, formData)
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