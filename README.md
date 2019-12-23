# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url]

# The steam events on multi account

Just add more account in the config.

# Modules
 * chance profile settings (will preload all setting allready made. then just edit the inputs you need)
 * chance profile image (will select a radom from ´http://steamcommunity.com/actions/GameAvatars/´)
 * vote and like a guide (just add id and appid in file)
 * join group (will join must have groups and random from a list, and level groups based on account level(replace api key))
 * add game to WishList
 * comment on a profile
 * game Recommend
 * run queue

# Events
Events modules are stored in ´modules/events´
 * spring cleaning (set 'day' in js file. this will run for that day, it made to insure it only run once a day.)
 * winter-sale-door-opener
 * winter-sale-vote
 * steam Award Nominate Game
 * lunar New Year Sale Tokens
 * * will get the tokens 
 * * and buy for the tokens default 1000 edit to use more
 * * will get same amount of all bg and Emoticon
 * the game awards - 2019
 * the steam awards - winter 2019
 * the steam queue card (module ´salequeue´)

# Setup
Just run ´npm install´ in the root folder
and then ´node main´

# To use 
When you run ´node main´ it will run the modules in ´/modules/´

just add a new module in the folder and add it in the main.js on line 9 like
```js
modules.push(require('./modules/guideVoteLikeShare'));
```
then when you start the node, it will all the moduels in the arrays order
## Module
To make a new module just create a new js file in the folder that have this code inside
```js
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
// add your code here
});
```
Options contains 
```js
var options = {
    Index: index, // the index in config
    UserName: auth.steam_user, // steam user name
    steamUser: steamUser, // Steam.SteamUser
    steamFriends: steamFriends //Steam.SteamFriends
}
```
just call the callback, and it will go on.
## account
if you only want to run a sinkel account use the following in ´main.js´, just replace the ´indexInConfig´ whit the index in the ´config.js´ file
```js
runBot(indexInConfig, function () {
	console.log("all done!")
	return;
});
```


[steam-img]:  https://img.shields.io/badge/donate-Steam-lightgrey.svg?style=flat-square
[steam-url]:  https://steamcommunity.com/tradeoffer/new/?partner=29967844&token=ipZz21tf