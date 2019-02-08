# The steam events on multi account

Just add more account in the config.

# Events
 * winter-sale-door-opener
 * winter-sale-vote
 * steam Award Nominate Game
 * lunar New Year Sale Tokens
 * * will get the tokens 
 * * and buy for the tokens default 1000 edit to use more
 * * will get same amount of all bg and Emoticon

# Setup
Just run ´npm install´ in the root folder
and then ´node main´

# To use 
When you run ´node main´ it will run the modules in ´/modules/´

just add a new module in the folder and add it in the main.js on line 9 like
```js
modules.push(require('./modules/lunarNewYearSaleTokens'));
```
then when you start the node, it will all the moduels in the arrays order
## Module
To make a new module just create a new js file in the folder that have this code inside
```js
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, callback){
// add your code here
});
```
just call the callback, and it will go on.