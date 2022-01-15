var EvaluteTypes = {
    "Yes": 1, 
    "No": 2,
    "Funny": 3,
    "RemoveVote": 4 // the only way to remove a vote is to rate "Funny" and then do it agirn, whit rate down. so this will use 2 requests.
}
//settings start
var timeBetweenEachRequest = 1000; //1sec
/**
 * Here, create the list of review to rate, and what mode to rate. Under here you can see 4 examples.
 * to find the id, go to the page where you can rate the game view, right click on one of the 3 buttons ("Yes", "No", "Funny") and open dev tool on it. 
 * in the devtool you will see somfing like :
    <span onclick="UserReviewVoteTag( 1, 'https://steamcommunity.com/login/home/?goto=xxxxxxx', '46049008', 1, 'RecommendationVoteTagBtn46049008_1' );" class="btn_grey_grey btn_small_thin ico_hover btn_active" id="RecommendationVoteTagBtn46049008_1">
 * Here you can see the id "46049008". then just place that in the "ID" field like, under here.
 * 
 */
var EvaluatingList = [
    {ID: 80019466, EvaluteType: EvaluteTypes.Yes }, //https://steamcommunity.com/id/quer_the_gamer/recommended/1172620/ 
    {ID: 46049008, EvaluteType: EvaluteTypes.Funny }, //https://steamcommunity.com/id/quer_the_gamer/recommended/275850/
    //{ID: 105055236, EvaluteType: EvaluteTypes.No },
    //{ID: 105055236, EvaluteType: EvaluteTypes.RemoveVote }
];
//settings end
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < EvaluatingList.length; i++) {
        const evaluateingReview = EvaluatingList[i];
        try {
            if(evaluateingReview.EvaluteType == EvaluteTypes.Yes){
                await RateGameReview(RequestCommunity, SessionID, evaluateingReview.ID, true);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.No){
                await RateGameReview(RequestCommunity, SessionID, evaluateingReview.ID, false);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.Funny){
                await RateVoteGagGameReview(RequestCommunity, SessionID, evaluateingReview.ID, true);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.RemoveVote){
                //we need to rate it funny, to only have i as funny, as you can unset that rate after.
                await RateVoteGagGameReview(RequestCommunity, SessionID, evaluateingReview.ID, true);
                await Wait(timeBetweenEachRequest)
                // then remove the rating. 
                await RateVoteGagGameReview(RequestCommunity, SessionID, evaluateingReview.ID, false);
            }
        } catch (error) {
            options.logError(options.accountPretty + " Evaluating game review failed, on id: "+ evaluateingReview.ID);
            options.logError(error);
        }
        await Wait(timeBetweenEachRequest)
    }
    callback();
}

//the same as RateDownGameReview(), just have rateUp as true
function RateGameReview(RequestCommunity, SessionID, GameReviewID, RateMode) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: "https://steamcommunity.com/userreviews/rate/" + GameReviewID,
            form:{
                sessionid: SessionID,
                rateup: RateMode
            }
        }, function (error, response, body) {
            if(error){
                reject(error);
                return;
            }
            try {
                var response = JSON.parse(body);
                if(response && response.success == 1){
                    resolve();
                    return;
                }
            } catch (error) {
                reject(error);
                return;
            }
        });
    })
}
function RateVoteGagGameReview(RequestCommunity, SessionID, GameReviewID, RateMode) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: "https://steamcommunity.com/userreviews/votetag/" + GameReviewID,
            form:{
                sessionid: SessionID,
                rateup: RateMode,
                tagid: 1
            }
        }, function (error, response, body) {
            if(error){
                reject(error);
                return;
            }
            try {
                var response = JSON.parse(body);
                if(response && response.success == 1){
                    resolve();
                    return;
                }
            } catch (error) {
                reject(error);
                return;
            }
        });
    })
}

function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}