//remeber to cance app in AddGameToWishlist.js
var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    quest1(steamClient, RequestStore, SessionID, function () {
        quest2(function () {
            require('../AddGameToWishlist')(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
                quest4(RequestStore, function () {
                    quest5(RequestStore, SessionID, function () {
                        quest6(RequestStore, function () {
                            quest7(RequestStore, function () {
                                quest8(RequestStore, function () {
                                    quest11(RequestCommunity, function () {
                                        quest12(steamClient, RequestCommunity, RequestStore, SessionID, options, function () {
                                            getPoints(RequestStore, function (points) {
                                                console.log(steamClient.steamID + " - " + options.UserName + " points:"+ points);
                                                callback();
                                            })
                                        })
                                    })
                                });
                            })
                        });
                    })
                });
            })
        })
    })
};
function quest1(steamClient, RequestStore, SessionID, callback) {
    var steamid = steamClient.steamID;
    RequestStore.get("https://store.steampowered.com/recommender", function (error, response, body){
        RequestStore.get("https://store.steampowered.com/recommender/"+steamid+"/inputs?sessionid="+SessionID+"&steamid="+steamid, function (error, response, body){
            RequestStore.get("https://store.steampowered.com/recommender/"+steamid+"/tags?sessionid="+SessionID+"", function (error, response, body){
                RequestStore.get("https://store.steampowered.com/recommender/"+steamid+"/results?sessionid="+SessionID+"&steamid="+steamid+"&include_played=0&algorithm=0&reinference=0&model_version=0", function (error, response, body){
                    callback();
                })
            })
        })
    })
}
function quest2(callback) {
    // will some soon
    var friendToChatTo = "xxxx";
    callback();
}
function quest4(RequestStore, callback) {
    var url = "https://store.steampowered.com/labs/divingbell";
    RequestStore.get(url, function (error, response, body){
        callback();
    })
}
//work haf - will get item
function quest5(RequestStore, SessionID, callback) {
    RequestStore.post(
        {
            url:'https://store.steampowered.com/holidayquests/ajaxclaimitem/', 
            form: { sessionid: SessionID, type: 1 }
        }, function (error, response, body){
            var data = JSON.parse(body);
            if(data.success){
                callback();
            }else{
                console.log('error getting free token');
                callback();
            }
        })
}
//doent work
function quest6(RequestStore, callback) {
    var url = "https://steam.tv/yulelog";
    RequestStore.get(url, function (error, response, body){
        callback();
    })
}
//work
function quest7(RequestStore, callback) {
    RequestStore.V_SetCookie("used_steam_labs_feature_new_search", 1);
    RequestStore.V_SetCookie("Steam_Language", "english");
    RequestStore.V_SetCookie("timezoneOffset", "3600,0");
    RequestStore.V_SetCookie("dp_user_language", 1);
    RequestStore.V_SetCookie("queue_type", 0);
    RequestStore.V_SetCookie("labs_search", 1);
    RequestStore.V_SetCookie("birthtime", 786236401);
    RequestStore.V_SetCookie("lastagecheckage", "1-0-1995");
    RequestStore.V_SetCookie("recentapps", "%7B%22203160%22%3A1577282821%2C%22784070%22%3A1577235962%2C%221017900%22%3A1577235807%2C%22265950%22%3A1577234685%2C%22251810%22%3A1577234575%2C%22266840%22%3A1577234448%2C%22750920%22%3A1577233808%2C%22289650%22%3A1577233244%2C%22582160%22%3A1577233200%2C%2260%22%3A1577232677%7D");
    RequestStore.V_SetCookie("app_impressions", "292030@1_7_7_230_150_1|271590@1_7_7_230_150_1|1174180@1_7_7_230_150_1|703080@1_7_7_230_150_1|1172380@1_7_7_230_150_1|730@1_7_7_230_150_1|252490@1_7_7_230_150_1|582010@1_7_7_230_150_1|227300@1_7_7_230_150_1|976730@1_7_7_230_150_1|252950@1_7_7_230_150_1|238960@1_7_7_230_150_1|359550@1_7_7_230_150_1|1100600@1_7_7_230_150_1|1196770@1_7_7_230_150_3|518790@1_7_7_230_150_3|787860@1_7_7_230_150_1|230410@1_7_7_230_150_1|814380@1_7_7_230_150_1|823500@1_7_7_230_150_1|813780@1_7_7_230_150_1|346110@1_7_7_230_150_1|863550@1_7_7_230_150_1|289070@1_7_7_230_150_1|1085660@1_7_7_230_150_1|594570@1_7_7_230_150_1|648800@1_7_7_230_150_1");

    RequestStore.MakeNavCookie("1_7_7_230_7", "https://store.steampowered.com/search/?")
    RequestStore.get('https://store.steampowered.com/search/', function (error, response, body) {
        RequestStore.get('https://store.steampowered.com/search/results/?query&start=50&count=25&dynamic_data=&sort_by=_ASC&snr=1_7_7_230_7&infinite=1', function (error, response, body) {
            callback();
        })    
    })


}
//work
function quest8(RequestStore, callback){
    RequestStore.get('https://store.steampowered.com/labs/trendingreviews', function (error, response, body) {
        RequestStore.get('https://store.steampowered.com/labs/ajaxgetrecentreviews?review_filter=helpful&playtime_filter_min=1&playtime_filter_max=0&hide_owned_games=1&hide_wishlisted_games=1&review_language=my_languages', function (error, response, body) {
            callback();
        })
    })
}
//doent work
function quest11(RequestCommunity, callback){
    RequestCommunity.get('https://steamcommunity.com/chat/', function (error, response, body) {
        callback();
    })
}

function quest12(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var itemsToChat = null;
    var steamid = steamClient.steamID;
    RequestCommunity.get('https://steamcommunity.com/profiles/'+steamid+'/inventory/json/753/6', function (error, response, body) {
        var json = JSON.parse(body);
        if(json.success){
            var items = json.rgDescriptions;
            for (var k in items) {
                if(itemsToChat != null){
                    break;
                }
                if (items.hasOwnProperty(k)) {
                   var value = items[k];
                   if(value.tags){
                    for (let i = 0; i < value.tags.length; i++) {
                        const tag = value.tags[i];
                        if(tag.name == "Emoticon"){
                            itemsToChat = value.name;
                            break;
                        }
                    }
                   }
                }
            }
            if(itemsToChat != null){
                var added = false;
                var steamIdToAdd = "76561198345139003";
                options.steamFriends.on('friend', function (SteamID, EFriendRelationship) {
                    if(SteamID == steamIdToAdd){
                        if(added != null){
                            added = true;
                            options.steamFriends.sendMessage(steamIdToAdd, itemsToChat);
                            options.steamFriends.sendMessage(steamIdToAdd, "/random 1-100");
                            setTimeout(() => {
                                options.steamFriends.removeFriend();
                                //Steam.EChatEntryType.Emote
                                callback();
                                return;    
                            }, 1000);
                            
                        }
                    }
                })
                options.steamFriends.addFriend(steamIdToAdd);
                
            }else{
                console.log("account doent have emoticon");
                callback();
            }
        }else{
            console.log("account doent have emoticon");
            callback();
        }    
    })
}
function getPoints(RequestStore, callback) {
    RequestStore.get('https://store.steampowered.com/holidayquests', function (error, response, body) {
        var $ = cheerio.load(body);
        callback($(".winter2019_quest_checked").length * 100);
    })
}