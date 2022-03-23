# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url] 
[![Steam Profile][steam-account-img]][steam-account-url]

# work in progress
This branch is use to commit the changes i do the core.

More info later.. But see how clean the Main.js now is.. ( 
    and you can run in cluster mode, to run more unit at once, and anti spam to steam have been build in, so even if there is 10 account at once, it will ensure it, min do a call once a sec. even when running async on all the accounts..
)

## Added new features
 * run in cluster mode. be able to run more account at once.
 * adding better logging
 * adding logging to save file 
 * * can be saved to on file, for each run
 * * can be splited up into each account, so a log file for each account. for each run
 * adding a anti spam to steam. so even when running more account at once. it will only send request to steam, one at a time.
 * * There is a Setting to set how this shoud behave. default is that is shoud at least use 1 sec on each request. so it will calculate how log before the next request is allow to be runed. 
 * can now be runed whit account that do not have sharedSecret ( but have not add the "secret" file to auto login. )

## known issues
 * the console, will in some module print for only on account. it have somefing to do whit async.


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

change `main.js`, setup what module to run.
And how the setting shoud be. 

and if needed chance the module file. 

and then `node main`

# To use
## Running Modes
we have a few way to run this.
 * RunAllBots - `core.RunAllBots(modules)` - will run all account in `config.js` 
 * RunIndexSpecificBot - `core.RunIndexSpecificBot([0, 1], modules)` - will run the specifig index in the `config.js` only
 * DoRunBots - `core.RunAllBots(auths, modules)` - will run the given account in the auths list. ( this will ignore the `config.js` and only run the account in the given list )


 the `modules` parameter, you need to give it a list of modules. read the next section


## Run Modules
To select what module to run. you have to add then into a list in the `main.js` file

You just add the filename in the `modules`. ( if the module in a sub folder. you have to add the subfolder name also)

eks:
```js
var modules = [];
modules.push('events/salequeue');
modules.push('events/FreeDailySticker');
modules.push('profileComment');
modules.push('Wishlist_AddGame');
modules.push('GameRecommend_Add');
modules.push('ActivateFreeGame');
```

## Setting
In the `main.js` you can set up setting on how it shoud be running.
The default settings are show under here. ( can be foung in `lib/Setting.js`)
```js
{
    AuthFieldNameUsername: "steam_user",
    AuthFieldNamePassword: "steam_pass",
    AuthFieldNamesharedSecret: "sharedSecret",
    Logging: {
        ShowTimeStamp: true,
        ShowAccountSteamId: true,
        ShowAccountName: true,
        ShowStack: true,
        ShowModule: true,
        SaveLog: true,
        SaveLogMode: Enums.logging.None,
        SaveLogType: Enums.logging.type.SingleFile
    },
    RunningMode: {
        Mode: 0,
        clusterSize: 4
    },
    Request: {
        Time: 1000, // 1000 is 1 sec
        Mode: Enums.Request.MinTimeBetweenRequest
    }
}
```
There will be a wiki page telling, what each part means. 

# Script
The script are some event, that might save you some time. 

If you do not use default settings, you have to add the setting in the files also. as it will use the settings.

 * `npm run SetSpecialAccountText` -> will add the property to each account, whit a index in it.
 * `npm run ConvertFromLineFormat [FilePath]` -> will add account from a text file with the format `username:password:sharedsecret:SpecialAccountText` (only username and password is mandatory)

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
