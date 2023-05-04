var EvaluteTypes = {
    "Yes": 1, 
    "No": 2,
    "Funny": 3,
    "RemoveVote": 4 // the only way to remove a vote is to rate "Funny" and then do it agirn, whit rate down. so this will use 2 requests.
}
//settings start
var EvaluatingList = [
    {ID: "104131150", EvaluteType: EvaluteTypes.Yes}
];
//settings end
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < EvaluatingList.length; i++) {
        const evaluateingReview = EvaluatingList[i];
        try {
            if(evaluateingReview.EvaluteType == EvaluteTypes.Yes){
                await RateGameReview(evaluateingReview.ID, true, 0);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.No){
                await RateGameReview(evaluateingReview.ID, false, 0);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.Funny){
                await RateVoteGagGameReview(evaluateingReview.ID, true, 0);
            }else if(evaluateingReview.EvaluteType == EvaluteTypes.RemoveVote){
                //we need to rate it funny, to only have i as funny, as you can unset that rate after.
                await RateVoteGagGameReview(evaluateingReview.ID, true, 0);
                // then remove the rating. 
                await RateVoteGagGameReview(evaluateingReview.ID, false, 0);
            }
        } catch (error) {
            options.logError("Evaluating game review failed, on id: "+ evaluateingReview.ID);
            options.logError(error);
        }
    }
    callback();
        
    //the same as RateDownGameReview(), just have rateUp as true
    function RateGameReview(GameReviewID, RateMode, retryTimes) {
        return new Promise( function (resolve, reject) {
            RequestCommunity.post({
                url: "https://steamcommunity.com/userreviews/rate/" + GameReviewID,
                form:{
                    sessionid: SessionID,
                    rateup: RateMode
                }
            }, async function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                try {
                    var response = JSON.parse(body);
                    if(response){
                        if ( response.success == 1 )
                        {
                            //VALID!!
                        }
                        else if ( response.success == 21 )
                        {
                            throw 'You must be logged in to perform that action.';
                        }
                        else if ( response.success == 17){
                            if(retryTimes < 3){
                                await RateGameReview(GameReviewID, RateMode, ++retryTimes);
                            }else {
                                throw 'steam might be down, was not able to do Evaluating, will be skippec'    
                            }
                        }
                        else if ( response.success == 15 )
                        {
                            throw 'Your account does not have sufficient privileges to perform this action.';
                        }
                        else if ( response.success == 24 )
                        {
                            throw 'Your account does not meet the requirements to use this feature. https://help.steampowered.com/en/wizard/HelpWithLimitedAccount (Visit Steam Support) for more information.';
                        }
                        else
                        {
                            throw 'There was an error trying to process your request: ' + response.success;
                        }
                    }else{
                        throw "Response is not json"
                    }
                    resolve();
                    
                    return;
                } catch (error) {
                    
                    reject(error);
                    return;
                }
                
            });
        })
    }
    function RateVoteGagGameReview(GameReviewID, RateMode, retryTimes) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.post({
                url: "https://steamcommunity.com/userreviews/votetag/" + GameReviewID,
                form:{
                    sessionid: SessionID,
                    rateup: RateMode,
                    tagid: 1
                }
            }, async function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                try {
                    var response = JSON.parse(body);
                    if(response){
                        if ( response.success == 1 )
                        {
                            //VALID!!
                        }
                        else if ( response.success == 21 )
                        {
                            throw 'You must be logged in to perform that action.';
                        }
                        else if ( response.success == 17){
                            if(retryTimes < 3){
                                await RateVoteGagGameReview(GameReviewID, RateMode, ++retryTimes);
                            }else {
                                throw 'steam might be down, was not able to do Evaluating, will be skippec'    
                            }
                        }
                        else if ( response.success == 15 )
                        {
                            throw 'Your account does not have sufficient privileges to perform this action.';
                        }
                        else if ( response.success == 24 )
                        {
                            throw 'Your account does not meet the requirements to use this feature. https://help.steampowered.com/en/wizard/HelpWithLimitedAccount (Visit Steam Support) for more information.';
                        }
                        else
                        {
                            throw 'There was an error trying to process your request: ' + response.success;
                        }
                    }else{
                        throw "Response is not json"
                    }
                    resolve();
                    
                    return;
                } catch (error) {
                    
                    reject(error);
                    return;
                }
            });
        })
    }
    function HandleResponse(error, response, body, retryObj) {
        return new Promise(function (resolve, reject) {
            
        })
    }
}
