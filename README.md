# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url] 
[![Steam Profile][steam-account-img]][steam-account-url]


# Steam Summer sale 2022 ( current )
The current event `Steam Summer sale 2022`, you can get a free Badge, and a new profile page theme, for completing the event, a free trading card each day.

Just run module `events/SummerSale3000_2022`. and it will give the badge. i will do a call to steam endpoing, that it have been sorted. I will do it over and over, until you get the bagde. as the order of the links, can be different between each account. so it will just do all 10 and then do it over, until it can see that the bagde is in max level. but after 10 run, it will just stop, and it will tell you. Then just wait some time and try agirn. There is a check, so it only run account that is not max level

For getting the trading card, you can run module `events/salequeue`, it will ensure you get the card, and keep retry, if it did not get it the first time. 

# Work still in progress
This branch is used to commit the changes i made to the core.

More info later.. But see how clean the Main.js now.. ( 
    and you can run in cluster mode, to run more unit at once, and anti spam for steam have been built in, so even if there is 10 account at once, it will ensure there is no more then one call per sec. even when running async on all the accounts..
)

## Added new features
 * Run in cluster mode. which allows you to run more account at once.
 * Added better loggins with enriched details.
 * Loggins can be saved now
 * * Can be saved to a single file, for each run.
 * * Can be splitted up to per each account, for each run. ( a log file for each account. )
 * Added an anti spam for steam. so even if running multiple accounts at once, it will only send one request to steam at a time.
 * * There is a Option to set how this should behave. default is talking 1 sec between requests. so it will calculate how long to hold the next request before fired. 
 * Added ability to run guard enabled accounts alongside free guard accounts. ( make sure to not add the "secret" file to auto login. )

## Known issues
 * The console, will print only one account in some modules. This have something to do with async().


# The steam events on multiple accounts
Just add more accounts in the config.

# Modules
 * change profile settings
 * * change setting on the general edit page (Edit Profile / chanceAccountSettings_general)
 * * change profile avatar, from the games that it own, it will select a random one
 * * change profile background, will take a random one that the account own, can also remove the bg
 * * change mini profile, will take a random one that the account own
 * * change profile theme, will take a random one that the account own
 * * change profile favorite badge, will take a random one that the account own
 * * change profile favorite group, will take a random one that the account own
 * clear profile name alias
 * change profile image (will select a radom from `http://steamcommunity.com/actions/GameAvatars/`) ( might be outdated, use the other one )
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
Just run `npm install` in the root folder. ( make sure to not use the audit fix, it will break everything )

Add your account(s) into the `config.js` file.

Edit `main.js`, by setting up the modules to run in order.
And how the settings should be.

And if needed change the module file.

And then run `node main`

# To use
## Running Modes
There is a few ways to run this.
 * RunAllBots - `core.RunAllBots(modules)` - will run all account in `config.js`
 * RunIndexSpecificBot - `core.RunIndexSpecificBot([0, 1], modules)` - will run the specifig index in the `config.js` only
 * DoRunBots - `core.DoRunBots(auths, modules)` - will run the given accounts in the auths list. ( Ignoring the `config.js` )


 The `modules` parameter: you need to push at least one module before running. Read the next section.


## Run Modules
To select what module to run. you have to add it into a list in the `main.js` file.

You just need to add the filename in the `modules`. ( if the module in a sub folder. you have to include the subfolder name separated by slash)

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

## Settings
In the `main.js` you can tweak settings the way how it should be running.
The default settings are show below. ( Also can be foung in `lib/Setting.js`).
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
There will be a wiki page explaining each setting. 

## Login modes
There is 3 way to loging
 * use username and password
 * use username and password and 2fa
 * use username and password and sentry file, once it have been loaded.

 Read more on the wiki soon

# Script
The scripts are made to save you time and effort for setting accounts into config.

If you do not use default settings, you have to add the setting in the files.

 * `npm run SetSpecialAccountText` -> will add the property to each account, with an index inside it.
 * `npm run ConvertFromLineFormat [FilePath]` -> will add account(s) from a text file has the format `username:password:sharedsecret:SpecialAccountText` (only username and password is mandatory)

# Wiki
Read more in the wiki.

# Web panel to contol the account
I have started to create a web panel to handle the bots, 
soon, it will be able to provide all the function that this script offer.
https://github.com/quer/Steam-bot-Controller

[steam-img]:  https://img.shields.io/badge/donate-Steam-lightgrey.svg?style=flat-square
[steam-url]:  https://steamcommunity.com/tradeoffer/new/?partner=29967844&token=ipZz21tf
[steam-account-url]:  https://steamcommunity.com/id/quer_the_gamer/
[steam-account-img]:  https://img.shields.io/badge/Steam-Profile-lightgrey.svg?style=flat-square
