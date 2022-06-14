# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url] 
[![Steam Profile][steam-account-img]][steam-account-url]

Should there be anything i missed, or that do not work as expected, Create a issue.

Curreny working on a better core, to better handle multi account at once. and loggin and modules 

see https://github.com/quer/the-steam-awards/tree/Upgrade-core for more info

# Next Fest event ( current )
The current event `Next Fest`, you can get a free Badge, for plaing demo games from the event.

Just run module `./modules/events/nextFest-2022`. and it will give the badge. If you want more, the badge add a counter on how many demo you have played. then you can run the module once a hour. where you just set the `offset` hier, and it will run the next part. just increase the number by 50 each time. 

I have added the file `nextFest-2022-demo-Appid.txt` where all the appId for the demo, that is for the event. ( only 981, there is 1023, i cant find the last ). As you can only activate 50 apps each hour. you have to change the script a bit, and run each hour, to get the counter to the 981.

I have also added the module in the Upgraded version ( `modules.push('events/nextFest-2022');` )

# The steam events on multi account
Just add more account in the config.

# Modules
 * chance profile settings
 * * chance setting on the general edit page (Edit Profile / chanceAccountSettings_general)
 * * chance profile avatar, from the games that it own, it will select a random one
 * * chance profile background, will take a random one that the account own, can also remove the bg
 * * chance mini profile, will take a random one that the account own
 * * chance profile theme, will take a random one that the account own
 * * chance profile favorite badge, will take a random one that the account own
 * * chance profile favorite group, will take a random one that the account own
 * clear profile name alias
 * chance profile image (will select a radom from `http://steamcommunity.com/actions/GameAvatars/`) ( might be outdated, use the other one )
 * vote and like a guide (just add id and appid in file)
 * join group
 * LeaveGroup ( can also remove all groups from each account )
 * Comment in a Guide
 * add game to WishList
 * comment on a profile
 * game Recommend
 * run queue
 * ActivateFreeGame ( will active a entered free game)
 * remove all game from wishlist
 * Give Awared/Rewards ( GiveSteamAward.js )
 * Create badge (createBadge.js)
 * Follow Games
 * Unfollow Games
 * Follow Curators
 * UnFollow Curators
 * Evaluating Game Review
 * Group Announcement Comment Add
 * Group Announcement Comment Delete
 * Group Announcement Rate

# Events
Events modules are stored in `modules/events`
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
 * Steam Winter Sale - 2020
 * Steam Summer Sale - 2021 ( forgeyourfate-summer-2021 )
 * steam winter sale - 2021 ( steamawards-2021 )

# Setup
Just run `npm install` in the root folder,
add you account into the `config.js` file.
change main.js to run the module you want
and if needed chance the module file. 
and then `node main`

# To use 
When you run `node main` it will run the modules in `/modules/`

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
if you only want to run a sinkel account use the following in `main.js`, just replace the `indexInConfig` whit the index in the `config.js` file
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
[steam-account-url]:  https://steamcommunity.com/id/quer_the_gamer/
[steam-account-img]:  https://img.shields.io/badge/Steam-Profile-lightgrey.svg?style=flat-square
