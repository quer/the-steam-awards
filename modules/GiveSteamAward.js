/**
 * Give Award
 * Warning, if you run this as it now! it wil give my profile the Cheapest Reward that can be given. if you account have the points.
 * 
 */

var helper = require('./Edit Profile/chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var accountInfo = await helper.GetAccountInfo(RequestCommunity, steamClient.steamID);
    //1. get rewards that can be given to a profile
    var allRewardsForProfile = await GetAllRewardsType(RequestCommunity, 3); // the 3, will ensure it only return reward that can be used on a user
    var cheapestRewards = allRewardsForProfile.sort((prev, next) => prev.points_cost - next.points_cost).shift();
    var allRewardsForProfileToTheCheapestRewards = allRewardsForProfile.filter(function(element){ return element.points_cost == cheapestRewards.points_cost; });
    var randomReward = GetRandomFromList(allRewardsForProfileToTheCheapestRewards);

    //2. get the accounts points to ensure it can aford the awared.
    var accountPointSummary = await GetProfilePointsSummary(RequestCommunity, steamClient.steamID, accountInfo.ProfileEdit.webapi_token);
    if(parseInt(accountPointSummary.summary.points, 10) >= randomReward.points_cost){
        //3. give profile award
        await GiveAward(RequestCommunity, 3, 76561197990233572, randomReward.reactionid, accountInfo.ProfileEdit.webapi_token);
        console.log(options.accountPretty + " Given award!")
    }else{
        console.log(options.accountPretty + " the account do not have enough points to give award!")
    }
    callback();
}

/*
+-------------+----------------+-------------------------------------------------+
| target_type | targetid       | ( description )                                 |
+-------------+----------------+-------------------------------------------------+
| 1           | unknow         |                                                 |
+-------------+----------------+-------------------------------------------------+
| 2           | filedetails id | was tested on a steam guide but i think it all  |
+-------------+----------------+-------------------------------------------------+
| 3           | steam64        | steam profile                                   |
+-------------+----------------+-------------------------------------------------+
| 4           | forum topic id | get the id from the url of the topic            |
+-------------+----------------+-------------------------------------------------+
| 5           | forum post id  | if in the code on the button                    |
+-------------+----------------+-------------------------------------------------+
*/
function GiveAward(RequestCommunity, target_type, targetid, reactionid, access_token) {
    return new Promise(function (resolve) {
        var objectToSend = {
            input_json: `{ "target_type": "${target_type}", "targetid": "${targetid}", "reactionid": "${reactionid}" }`
        }
        RequestCommunity.post({uri: "https://api.steampowered.com/ILoyaltyRewardsService/AddReaction/v1?access_token=" + access_token, form: objectToSend }, function(error, response, body) {
            
            resolve();
        });
    })
}

/**
 * will return a list whit all Reward that can be given, on steam.
 * it will look like:
 * {
    points_cost: 2400
    points_transferred: 800
    reactionid: 13              <- the id to post
    valid_target_types: [1, 3, 4, 5, 2]
    valid_ugc_types: [0, 1, 2, 11, 5, 4, 3, 9, 10]
 * }
 * the "valid_target_types" tell you where you can give the Reward
 * valid_target_types decode: 
 * 2 = player profile
 * 3 = player profile
 * 
 */
function GetAllRewardsType(RequestCommunity, target_type) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.get({uri: "https://api.steampowered.com/ILoyaltyRewardsService/GetReactionConfig/v1?input_json=%7B%7D"}, function(error, response, body) {
            var json = null;
            try {
                json = JSON.parse(body);
                if(json.response && json.response.reactions){
                    resolve(json.response.reactions.filter(function(element){ return element.valid_target_types.indexOf(target_type) > 0; }));
                }else{
                    resolve([]);
                }
            } catch (error) {
                reject({text: "Error when getting RewardsType", error: error});
            }

        })
    })
}
/**
 * returns 
 * {
    auditid_highwater: "845148626"
    summary: {
        points: "10657"
        points_earned: "40257"
        points_spent: "29600"
        timestamp_updated: 1610398216
    }
 * }
 */
function GetProfilePointsSummary(RequestCommunity, steamID, access_token) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.get({uri: "https://api.steampowered.com/ILoyaltyRewardsService/GetSummary/v1?access_token="+ access_token +"&input_json=%7B%22steamid%22:%22"+ steamID +"%22%7D"}, function(error, response, body) {
            var json = null;
            try {
                json = JSON.parse(body);
                if(json.response){
                    resolve(json.response);
                }else{
                    resolve({});
                }
            } catch (error) {
                reject({text: "Error when getting Profile Points Summary", error: error});
            }

        })
    })
}

function GetRandomFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/*
Current Rewards whit name
{reactionid: 1, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Deep Thoughts" },
{reactionid: 2, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Heartwarming" },
{reactionid: 3, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Hilarious" },
{reactionid: 4, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Hot Take" },
{reactionid: 5, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Poetry" },
{reactionid: 6, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Extra Helpful" },
{reactionid: 7, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Gotta Have It" },
{reactionid: 8, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Michelangelo" },
{reactionid: 9, points_cost: 600, points_transferred: 200, valid_target_types: [1, 3, 4, 5, 2], "Treasure" },
{reactionid: 10, points_cost: 1200, points_transferred: 400, valid_target_types: [1, 3, 4, 5, 2], "Mind Blown" },
{reactionid: 11, points_cost: 2400, points_transferred: 800, valid_target_types: [1, 3, 4, 5, 2], "Golden Unicorn" },
{reactionid: 12, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Mad Scientist" },
{reactionid: 13, points_cost: 2400, points_transferred: 800, valid_target_types: [1, 3, 4, 5, 2], "Clever" },
{reactionid: 14, points_cost: 600, points_transferred: 200, valid_target_types: [1, 3, 4, 5, 2], "Warm Blanket" },
{reactionid: 15, points_cost: 1200, points_transferred: 400, valid_target_types: [1, 3, 4, 5, 2], "Saucy" },
{reactionid: 16, points_cost: 600, points_transferred: 200, valid_target_types: [1, 3, 4, 5, 2], "Slow Clap" },
{reactionid: 17, points_cost: 4800, points_transferred: 1600, valid_target_types: [1, 3, 4, 5, 2], "Take My Points" },
{reactionid: 18, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Wholesome" },
{reactionid: 19, points_cost: 600, points_transferred: 200, valid_target_types: [1, 3, 4, 5, 2], "Jester" },
{reactionid: 20, points_cost: 1200, points_transferred: 400, valid_target_types: [1, 3, 4, 5, 2], "Fancy Pants" },
{reactionid: 21, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Whoa" },
{reactionid: 22, points_cost: 600, points_transferred: 200, valid_target_types: [1, 3, 4, 5, 2], "Super Star" },
{reactionid: 23, points_cost: 300, points_transferred: 100, valid_target_types: [1, 3, 4, 5, 2], "Wild" },
*/