var fs = require('fs');
const path = require("path");
var saveFile = "./lunarNewYearSaleItemResived.json";
var poletter = 1000;
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, callback){
    poletter = 1000;
    RequestStore.post({
		url: 'https://store.steampowered.com/lny2019/ajaxopenenvelope/',
		form:{
			sessionid: SessionID
		},
		headers: {
			'Origin': 'https://store.steampowered.com',
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer': 'https://store.steampowered.com/lny2019/rewards'
		}
	}, function (error, response, body) {
        console.log(body);
        var nextItemsToGet = getNextItem(poletter);
        getItem(RequestStore, SessionID, nextItemsToGet, callback)

	});
}
function getNextItem(maxPoletter){
    var itemsToGet = JSON.parse(fs.readFileSync(path.resolve(__dirname, saveFile), 'utf8'));
    var itemid = null;
    for (let i = 0; i < itemsToGet.length; i++) {
        const items = itemsToGet[i];
        if(items.price <= maxPoletter && (itemid == null || itemid.amount > items.amount)){
            itemid = items;
        }
    }
    return itemid;
}
function getItem(RequestStore, SessionID, itemid, callback) {
    RequestStore.post({
		url: 'https://store.steampowered.com/lny2019/ajaxredeemtokens/',
		form:{
            sessionid: SessionID,
            itemid: itemid.id
		},
		headers: {
			'Origin': 'https://store.steampowered.com',
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer': 'https://store.steampowered.com/lny2019/rewards'
		}
	}, function (error, response, body) {
        console.log(body);
		setTimeout(function(){
            saveResived(itemid.id, function () {
                poletter -= itemid.price; 
                var nextItemsToGet = getNextItem(poletter);
                if(nextItemsToGet != null){
                    getItem(RequestStore, SessionID, nextItemsToGet, callback);
                }else{
                    callback();
                }  
            });
		}, 500);
	});
}
function saveResived(id, callback) {
    var itemsToGet = JSON.parse(fs.readFileSync(path.resolve(__dirname, saveFile), 'utf8'));
    for (let i = 0; i < itemsToGet.length; i++) {
        const item = itemsToGet[i];
        if(item.id == id){
            item.amount += 1;
        }
    }
    fs.writeFile(path.resolve(__dirname, saveFile), JSON.stringify(itemsToGet), 'utf8', function () {
        callback();
    });
}