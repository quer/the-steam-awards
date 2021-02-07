/**
 * Simple use to craft Booster Pack
 * use CraftBostedPack() ( it a promises )
 */
/**
 * More advance. a 3 part step.
 * 1. a way to find what Booster Pack each account can create -> GetAccountGamesToCreateBadgeTo() ( it a promises )
 * 2. a way to get all prices from current market. -> call GetBoosterPrices() ( it a promises )
 * 3. craft the Booster Pack ->  CraftBostedPack() ( it a promises )
 */
/**
 * have tested all but not the CraftBostedPack metode, as i doent have gems on the other accounts. please report back in a issue or discussion on github
 */
var fs = require('fs');
var requestCommunity = null;
var gemPrices = 32; // 0,32€; -- set the price for a boosted pack on the market ( if you have to buy it )
//To update prices delete the file "BoostedPacks.json", in the "saves" folder
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    requestCommunity = RequestCommunity;
    console.log("you have to chance this module to fit you needs.")
    callback();
    return;
    // a eks off the more advance ideer.
    var listToMakeMoneyOn = [];
    //get a list of all Boosted Packs, whit prices, and sell price. 
    var BoostedPacks = await GetBoosterPrices();
    //get
    var pricePrSinkleGem = gemPrices / 1000; // set that 1 gem whoud cost.
    var sets = await GetAccountGamesToCreateBadgeTo(); // get that set the account can create, as you can only create for games you own.
    if(sets != null){
        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            var setPriceToCreate = parseInt(set.price, 10) * pricePrSinkleGem;
            var markeretSetPrice = getMarketSet(set.appid, BoostedPacks);
            if(markeretSetPrice != null && setPriceToCreate < markeretSetPrice.sell_price){
                listToMakeMoneyOn.push({
                    marketPrice: markeretSetPrice.sell_price, 
                    gemPrice: setPriceToCreate, 
                    marketPriceSale: markeretSetPrice.sale_price_text, 
                    profit: markeretSetPrice.sell_price - setPriceToCreate, 
                    marketLink: markeretSetPrice["hash_name"],
                    gemsToCreate: set.price
                })
            }
        }
    }
    console.table(listToMakeMoneyOn.sort(function(a, b) { return a.markeretSetPrice < b.markeretSetPrice;}));
    /** will print somfing like this:
    ┌─────────┬─────────────┬──────────┬─────────────────┬───────────────────┬─────────────────────────────────────────┬──────────────┐
    │ (index) │ marketPrice │ gemPrice │ marketPriceSale │      profit       │               marketLink                │ gemsToCreate │
    ├─────────┼─────────────┼──────────┼─────────────────┼───────────────────┼─────────────────────────────────────────┼──────────────┤
    │    0    │     25      │   19.2   │     '0,24€'     │ 5.800000000000001 │ '335190-200% Mixed Juice! Booster Pack' │    '600'     │
    │    1    │     64      │   38.4   │     '0,62€'     │       25.6        │  '628950-Nephise Begins Booster Pack'   │    '1200'    │
    └─────────┴─────────────┴──────────┴─────────────────┴───────────────────┴─────────────────────────────────────────┴──────────────┘
     * index - just ignore. it the index in the listToMakeMoneyOn list
     * marketPrice - the buy price from the market
     * gemPrice - the price for the gems that is used. ex if 1000 gems cost 0,32€ and the set uses 600 gems. then the 'gemPrice' is 0.19, to create the set
     * marketPriceSale - the price that you will get after steam cut, for selling the Booster Pack
     * profit - the profit in cent. as 25,6 is 0.25 € that price is before steam cut. os it is offen, -0.01 less then what i say.
     * marketLink - "https://steamcommunity.com/market/listings/753/" + the "marketLink" will get the market page.
     * gemsToCreate - how many gems it cost to create.
     */
    callback()
}

function CraftBostedPack(appid, sessionid) {
    return new Promise(function (resolve) {
        requestCommunity.post({
            url: "https://steamcommunity.com/tradingcards/ajaxcreatebooster/",
            form:{
                sessionid: sessionid,
                appid: appid,
                series: 1,
                tradability_preference: 2, // 2 is default. 1 SHOUD be that you cant trade it. If you use gems that is locked, you cant create a tradabil pack.
            }
        }, function (Err, HttpResponse, Body) {
            resolve();
        });
    });
}

function getMarketSet(appid, BoostedPacks) {
    for (let i = 0; i < BoostedPacks.length; i++) {
        const BoostedPack = BoostedPacks[i];
        if(BoostedPack.hash_name.startsWith(appid)){
            return BoostedPack;
        }
    }
    return null;
}
var SessionBoosterCache = null;
async function GetBoosterPrices() {
    if(SessionBoosterCache == null){
        SessionBoosterCache = LoadBooosterFile();
        if(SessionBoosterCache == null) {
            SessionBoosterCache = await fetchBoosterFromMarket(0);
            SaveBoosterToFile(SessionBoosterCache)
        }
    }
    return SessionBoosterCache;
}

function fetchBoosterFromMarket(page) {
    return new Promise(function (resolve) {
        var url = "https://steamcommunity.com/market/search/render/?query=Booster%20Pack&start="+page+"&count=20000&search_descriptions=0&sort_column=default&sort_dir=desc&norender=1";
        requestCommunity.get(url, function( Error, Response, Body ){
            var searchResolve = JSON.parse(Body);
            if(searchResolve.success){
                if(searchResolve.start + searchResolve.pagesize > searchResolve.total_count){
                    console.log("fetch done!");
                    resolve(searchResolve.results);
                }else{
                    console.log("fetch page: "+ page);
                    fetchBoosterFromMarket( page + searchResolve.pagesize ).then(function (list) {
                        resolve(list.concat(searchResolve.results));
                    })    
                }
            }else{
                console.log("fetch failed");
                fetchBoosterFromMarket(page).then(function (list) {
                    resolve(list);
                })
            }
        })
    })
}
var dir = './Saves/';
function SaveBoosterToFile(Data) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const data = fs.writeFileSync(dir+'/BoostedPacks.json', JSON.stringify(Data, null, 4))
}
function LoadBooosterFile() {
    try {
    var list = fs.readFileSync( dir + '/BoostedPacks.json', {encoding:'utf8', flag:'r'} );
        if(list != ""){
            return JSON.parse(list);
        }
    } catch (error) {
        
    }
    return null;
}

function GetAccountGamesToCreateBadgeTo() {
    return new Promise(function (resolve) {
        requestCommunity.get("https://steamcommunity.com/tradingcards/boostercreator/", function( Error, Response, Body ){
            var bodyAsRows = Body.split('\n');
            var rowIWhitApps = null;
            for (let i = 0; i < bodyAsRows.length; i++) {
                const bodyAsRow = bodyAsRows[i];
                if(bodyAsRow.indexOf('CBoosterCreatorPage.Init') > -1){
                    rowIWhitApps = i + 1;
                    break;
                }
            }
            if(rowIWhitApps != null){
                resolve(JSON.parse(bodyAsRows[rowIWhitApps].replace(/,\s*$/, "")));
            }else{
                resolve(null);
            }
        });
    });
}