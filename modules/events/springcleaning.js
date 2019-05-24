var cheerio = require('cheerio');
var day = 0; // will ensure that 
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){

    addTag(RequestStore, SessionID, function () {
        RequestStore.get('https://store.steampowered.com/springcleaning', function(error, response, body) {
            var $ = cheerio.load(body);
            var projeckts = $(".spring_cleaning_task_ctn");
            runDaily(0, projeckts, function () {
                runProject(3, projeckts, callback, $, options.steamUser);
            }, $, options.steamUser);
        })
    })
};

function runDaily(index, list, callback, $, steamUser) {
    if(index < list.length && index < 3){
        const projeckt = list[index];
        var haveRunToDay = $(projeckt).find(".spring_cleaning_day");
        if($(haveRunToDay[day]).attr("class") == "spring_cleaning_day completed"){
            runDaily(++index, list, callback, $, steamUser);
        }else{   
            var GamesNotDoneContainer = $(projeckt).find(".spring_cleaning_apps_ctn");
            var game = GamesNotDoneContainer.find(".spring_game");
            if(game.length > 0){
                var link = $($(game[0]).find("a")[0]).attr('href');
                var res = link.split("/", 5);
                steamUser.gamesPlayed([{ game_id: res[4] }]);
                setTimeout(function () {
                    console.log("done daily task: " + (index + 1));
                    runDaily(++index, list, callback, $, steamUser);
                }, 1500);
            }else{
                console.log("a bot doent have a game to play");
            }
        }
    }else{
        callback();
    }
}
function runProject(index, list, callback, $, steamUser) {
    if(index < list.length){
        const projeckt = list[index];
        var haveDoneProjeckt = $(projeckt).find(".task_completed_ctn");
        if(haveDoneProjeckt.length > 0){
            runProject(++index, list, callback, $, steamUser);
        }else{
            if(index == 5){ // the project "TRUSTED FRIEND" will list all, also game you doent own, then make sure you add it as friends and, add one for csgo(free)
                steamUser.gamesPlayed([{ game_id: "730" }]);
                setTimeout(function () {
                    console.log("done projects task: " + (index - 2));
                    runProject(++index, list, callback, $, steamUser);
                }, 1500);
            }else{   
                var GamesNotDoneContainer = $(projeckt).find(".spring_cleaning_apps_ctn");
                if(GamesNotDoneContainer.length > 0){
                    var game = GamesNotDoneContainer.find(".spring_game");
                    if(game.length > 0){
                        var link = $($(game[0]).find("a")[0]).attr('href');
                        if(link == "steam://nav/games/details/0"){
                            runProject(++index, list, callback, $, steamUser);
                            console.log("bot doent have a game in this type of project");           
                        }else{
                            var res = link.split("/", 5);
                            steamUser.gamesPlayed([{ game_id: res[4] }]);
                            setTimeout(function () {
                                console.log("done projects task: " + (index - 2));
                                runProject(++index, list, callback, $, steamUser);
                            }, 1500);
                        }
                    }
                }
                else{
                    console.log("projects task: " + (index - 2) +" doent have eny games, cant do the projects");
                    runProject(++index, list, callback, $, steamUser);
                }
            }
        }
    }else{
        callback();
    }
}
function addTag(RequestStore, SessionID, callback){
    RequestStore.post({
        url: "https://store.steampowered.com/tagdata/tagapp", 
            form: {
                appid: 550,
                sessionid: SessionID,
                tag: "Shooter",
                tagid: 1774   
            }
        }, function () {
            callback();
        })
}