var EvaluteTypes = {
    "Yes": 1, 
    "No": 2,
    "Funny": 3,
    "RemoveVote": 4 // the only way to remove a vote is to rate "Funny" and then do it agirn, whit rate down. so this will use 2 requests.
}
//settings start
var EvaluatingList = [
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
                // then remove the rating. 
                await RateVoteGagGameReview(RequestCommunity, SessionID, evaluateingReview.ID, false);
            }
        } catch (error) {
            options.logError(options.accountPretty + " Evaluating game review failed, on id: "+ evaluateingReview.ID);
            options.logError(error);
        }
    }
    callback();
        
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
}
