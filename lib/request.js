const request = require('request');
var aQueue = require('./QueueSystem');

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
    this.postPromise = function(data){
        var requestPromise = () => new Promise(function (resolve, reject) {
            this.request.post(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this));
        return aQueue.enqueue(requestPromise);
    }
    this.post = function(data, callback){
        this.postPromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
    this.getPromise = function(data){
        var requestPromise = () =>  new Promise(function (resolve, reject) {
            this.request.get(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this));
        return aQueue.enqueue(requestPromise);
    }
    this.get = function(data, callback){
        this.getPromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
}
/*
var http = require('http');
module.exports = function (url) {
    this.url = url;
    this.client = http.createClient(80, url);
    this.CooliesList = [];
    this.Types = {
        GET: 0,
        POST: 1
    }
    this.postNoQueue = function (url, data) {
        return this.CreateRequest(this.Types.POST, url, data);
        
    }
    this.post = function (url, data) {
        var requestPromise = new Promise(function (resolve, reject) {
            this.request.post.apply(null, arguments);
        });
        return aQueue.enqueue(requestPromise);
    },
    this.CreateRequest = function (pType, pUrl, pData) {
        new Promise(function (resolve, reject) {
            if(pType == this.Types.GET){

            }else if(pType == this.Types.GET){

            }else {
                reject("The requested type is not ");
            }
            var headers = {
                'Host': this.url,
                'Cookie': this.GetCookieToRequest(),
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(pData,'utf8')
            };
            

            var request = client.request(pType, pUrl, headers);

            // listening to the response is optional, I suppose
            request.on('response', function(response) {
                response.on('data', function(chunk) {
                    // do what you do
                });
                response.on('end', function() {
                    // do what you do
                });
            });
        });
    }
    this.GetCookieToRequest = function () {
        return this.CooliesList.join(";");
    }
    this.AddCookie = function (cookie) {
        this.CooliesList.push(cookie);
    }
    this.AddCookie_KeyValue = function (key, value) {
        this.CooliesList.push(key + "=" + value);
    }
}*/