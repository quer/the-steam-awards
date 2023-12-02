# Quer's Guide to Bots on Steam 
[![Steam Donate][steam-img]][steam-url] 
[![Steam Profile][steam-account-img]][steam-account-url]

This project is to do multiple actions at once on Steam, whit multiple steam account

# Status on project 
Steam have change how the login, to get cookies and sessionid. I have change the login system to use [node-steam-user](https://github.com/DoctorMcKay/node-steam-user), I doent like the change, as it remove some controll. As i do ensure there is no way to pass the steam limits. But as it handle the login request, outside the request handler i have. it can for some reach the limit. This do only effect the `cluster` mode, when it running multi account at once. So just run a smaller amount at the time. 

So you have to do `npm i`, to get the new node module. 

!Note: Only 2fa works. if you uses a other flow, do fork this, or contact me, to get it added. 
!Note: i have tested a handfull of the modules, to ensure it works are the changed. Not all is tested, so do report back if one do not work.

Im an looking into it, read more in issue : https://github.com/quer/the-steam-awards/issues/70

# Read the wiki for details
More details in the wiki, on how to setup, and use modules.

The complete module list is in the wike. 

# The steam events on multiple accounts
Just add more accounts in the config.

# Modules ( snippet )
read about each module in the wiki, on how to use!

 * change profile settings
 * * change setting on the general edit page (Edit Profile / chanceAccountSettings_general)
 * * change profile avatar, from the games that it own
 * * change profile background
 * * change mini profile
 * * change profile theme
 * * change profile favorite badge
 * * change profile favorite group
 * clear profile name alias
 * change profile image 
 * vote and like a guide 
 * join group
 * LeaveGroup ( can also remove all groups from each account )
 * Comment in a Guide
 * add game to WishList
 * comment on a profile
 * game Recommend
 * run queue
 * ActivateFreeGame
 * remove all game from wishlist
 * Give Awared/Rewards 
 * Create badge
 * Follow Games
 * Unfollow Games
 * Follow Curators
 * UnFollow Curators
 * Evaluating Game Review
 * view broadcast
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
 * Steam winter sale - 2021 ( steamawards-2021 )
 * Steam Summer sale - 2022 ( steam 3000 )
 * winter sale 2022 award
 * Spring Sale 2023
 * puzzle-festioval 2023
 * redfall 2023
 * sports fest 2023
 * Steam Summer sale - 2023
 * steam 20th anniversary - 2023
 * the steam awards - 2023

# Setup
Just run `npm install` in the root folder. ( make sure to not use the audit fix, it will break everything )

Add your account(s) into the `config.js` file.

Edit `main.js`, by setting up the modules to run in order.
And how the settings should be.

And if needed change the module file.

And then run `node main`

Read more in the Wiki

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
To understand what each setting do, read about it in the [Wiki by clicking here](https://github.com/quer/the-steam-awards/wiki/Configuration)
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
        UseQueue: false,
        Time: 1000, // 1000 is 1 sec
        Mode: Enums.Request.MinTimeBetweenRequest
    }
}
```


## Login modes
There is 3 way to loging
 * use username and password
 * use username and password and 2fa
 * use username and password and sentry file, once it have been loaded.

 Read more on the [wiki](https://github.com/quer/the-steam-awards/wiki/Setting-up), for specific settings

# Script
The scripts are made to save you time and effort for setting accounts into config.

If you do not use default settings, you have to add the setting in the files.

 * `npm run SetSpecialAccountText` -> will add the property to each account, with an index inside it.
 * `npm run ConvertFromLineFormat [FilePath]` -> will add account(s) from a text file has the format `username:password:sharedsecret:SpecialAccountText` (only username and password is mandatory)
 * `npm run Totp [index]` -> will show the username and password. and the generated totp key, to login. 

 more in the [wiki](https://github.com/quer/the-steam-awards/wiki/Setting-up#running-mode)

# Web panel to contol the account
I have started to create a web panel to handle the bots, 
soon, it will be able to provide all the function that this script offer.
https://github.com/quer/Steam-bot-Controller

[steam-img]:  https://img.shields.io/badge/donate-Steam-lightgrey.svg?style=flat-square
[steam-url]:  https://steamcommunity.com/tradeoffer/new/?partner=29967844&token=ipZz21tf
[steam-account-url]:  https://steamcommunity.com/id/quer_the_gamer/
[steam-account-img]:  https://img.shields.io/badge/Steam-Profile-lightgrey.svg?style=flat-square
