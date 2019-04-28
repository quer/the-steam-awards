var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var url = "http://steamcommunity.com/actions/GameAvatars/";
    RequestCommunity.get({uri: url}, function(error, response, body) {
        var $ = cheerio.load(body);
        var avatarIndex = Math.floor(Math.random() * ($(".oggAvatar").length - 1));
        var gameAvatarUrl = $(".oggAvatar").eq(avatarIndex).find("a").attr("href");
        RequestCommunity.get({uri: gameAvatarUrl}, function(formError, formResponse, formBody) {
            var $form = cheerio.load(formBody);
            var formHtml = $form("#avatarForm");
            var formUrl = formHtml.attr("action");
            var selectedAvatar = formHtml.find("[name='selectedAvatar']").attr("value");
            RequestCommunity.post({
                url: formUrl,
                form:{
                    selectedAvatar: selectedAvatar,
                    sessionid: SessionID
                }
            }, function (postErr, postHttpResponse, postBody) {
                callback();
            });
        });
    });
}