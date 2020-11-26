# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url]

# steam awards 2020
Use module steamAwardNominateGame_v2, it have been updated to be able to hande the event
it will complete the event and give the max level badge

You need a steam api key, if you do not have one, read issue https://github.com/quer/the-steam-awards/issues/15 

I will recommend, remove the part where the code play the game. as you might need 5 min in a game. 
And making somfing that can run all account at once, and playing the app. as the scripts will play for 5 min, and then go to the next, that can be all time before the code is done, whit all account.

```js
modules.push(require('./modules/events/steamAwardNominateGame_v2'));
```

# The steam events on multi account

Just add more account in the config.

# Modules
 * chance profile settings (will preload all setting allready made. then just edit the inputs you need)
 * clear profile name alias
 * chance profile image (will select a radom from ´http://steamcommunity.com/actions/GameAvatars/´)
 * vote and like a guide (just add id and appid in file)
 * join group (will join must have groups and random from a list, and level groups based on account level(replace api key))
 * add game to WishList
 * comment on a profile
 * game Recommend
 * run queue
 * ActivateFreeGame ( will active a entered free game)
 * remove all game from wishlist

# Events
Events modules are stored in ´modules/events´
 * spring cleaning (set 'day' in js file. this will run for that day, it made to insure it only run once a day.)
 * winter-sale-door-opener
 * winter-sale-vote
 * steam Award Nominate Game
 * lunar New Year Sale Tokens (2019)
 * * will get the tokens 
 * * and buy for the tokens default 1000 edit to use more
 * * will get same amount of all bg and Emoticon
 * the game awards - 2019
 * the steam awards - winter 2019
 * the steam queue card (module ´salequeue´)
 * lunar new year 2020, get coins
 * * lunar new year 2020, get items
 * spring cleaning 2020
 * the steam awards - 2020

# Setup
Just run ´npm install´ in the root folder,
add you account into the ´config.js´ file.
change main.js to run the module you want
and if needed chance the module file. 
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
    steamFriends: steamFriends //Steam.SteamFriends,
    accountPretty: steamClient.steamID + " - " + auth.username + ":"
}
```
just call the callback, and it will go on.
Read more in the wiki
## account
if you only want to run a sinkel account use the following in ´main.js´, just replace the ´indexInConfig´ whit the index in the ´config.js´ file
```js
runBot(indexInConfig, function () {
	console.log("all done!")
	return;
});
```
# Wiki
Read more in the wiki

# Web panel to contol the account
I have started to create a web panel to handle the bots, 
it will soon be able to use all the function that this script give.
https://github.com/quer/Steam-bot-Controller

[steam-img]:  https://img.shields.io/badge/donate-Steam-lightgrey.svg?style=flat-square
[steam-url]:  https://steamcommunity.com/tradeoffer/new/?partner=29967844&token=ipZz21tf
