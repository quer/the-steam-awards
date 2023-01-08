const settings = require('./Settings');
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
    //normal post
    this.postPromise = function(data){
        var requestPromise = () => new Promise(function (resolve, reject) {
            this.request.post(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this));
        if(!settings.Request.UseQueue){
            return requestPromise();
        }else{
            return aQueue.enqueue(requestPromise);
        }
    }
    this.post = function(data, callback){
        this.postPromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
    //post whit no queue 
    this.postNoneQueuePromise = function(data){
        return new Promise(function (resolve) {
            this.request.post(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this))
    }
    this.postNoneQueue = function(data, callback){
        this.postNoneQueuePromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
    //normal get
    this.getPromise = function(data){
        var requestPromise = () =>  new Promise(function (resolve, reject) {
            this.request.get(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this));
        
        if(!settings.Request.UseQueue){
            return requestPromise;
        }else{
            return aQueue.enqueue(requestPromise);
        }
    }
    this.get = function(data, callback){
        this.getPromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
    //get whit no queue
    this.getNoneQueuePromise = function(data){
        return new Promise(function (resolve) {
            this.request.get(data, function (error, response, body) {
                resolve({error, response, body});
            });
        }.bind(this))
    }
    this.getNoneQueue = function(data, callback){
        this.getNoneQueuePromise(data)
        .then(function (endData) {
            callback(endData.error, endData.response, endData.body)
        }).catch(function (error) {
            callback(error, null, null)
        });
    }
}
