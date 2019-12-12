const request = require('request');

//var storeURL = 'https://store.steampowered.com';
//var communityURL = 'https://steamcommunity.com';

module.exports = function (url) {
    this.url = url;
    this.defaultTimeout = 30000;
    this.requestWrapper1 = request.defaults({
        timeout: this.defaultTimeout
    });
    this.jar = request.jar();
    this.request = this.requestWrapper1.defaults({jar: this.jar});

    this.setCookie = function (cookie) {
        this.jar.setCookie(request.cookie(cookie), this.url);
    }
    this.MakeNavCookie = function (snr, url) {
        var dateExpires = new Date();
        dateExpires.setTime( dateExpires.getTime() + 1000 * 60 );
        this.setCookie('snr=' + snr + '|' + encodeURIComponent( url ) +'; expires=' + dateExpires.toGMTString() + ';path=/');
    }
    this.V_SetCookie = function( strCookieName, strValue, expiryInDays, path )
    {
        if ( !path )
            path = '/';

        var strDate = '';

        if( typeof expiryInDays != 'undefined' && expiryInDays )
        {
            var dateExpires = new Date();
            dateExpires.setTime( dateExpires.getTime() + 1000 * 60 * 60 * 24 * expiryInDays );
            strDate = '; expires=' + dateExpires.toGMTString();
        }

        this.setCookie(strCookieName + '=' + strValue + strDate + ';path=' + path);
    }
    this.mature_content = function () {
        this.V_SetCookie('wants_mature_content', 1, 365, '/');
    }
    this.post = function(){
        this.request.post.apply(null, arguments);
    }
    this.get = function(){
        this.request.get.apply(null, arguments);
    }
}