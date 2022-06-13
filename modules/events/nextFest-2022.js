var fs = require('fs');
console.log(__dirname);
var demoToRun = 50; // can only active 50 games a hour. so if just for running once, no need to change this. 10 is enof to get the badge.  
var runAtOnce = 30; // max 30 

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var demoAppIdList = fs.readFileSync(__dirname+'/nextFest-2022-demo-Appid.txt', {encoding:'utf8', flag:'r'});
    demoAppIdList = demoAppIdList.split("\r\n")

    var clustedeList = [];
    var leftOff = demoToRun;
    //build cluster
    while (leftOff > 0) {
        var cluster = [];
        for (let i = 0; i < runAtOnce; i++) {
            if(demoAppIdList.length > 0){
                var appidString = demoAppIdList.shift();
                var appid = parseInt(appidString, 10);
                //will activate the missing games, to the user
                options.steamUser.requestFreeLicense(appid);
                cluster.push({"game_id": appid });
            }else{
                leftOff = 0;
            }
        }
        leftOff -= runAtOnce;
        clustedeList.push(cluster);
    }
    //run 
    for (let i = 0; i < clustedeList.length; i++) {
        const cluster = clustedeList[i];
        options.log((i + 1) +"/" + clustedeList.length + " running games : " + cluster.length);
        await RunCluseredGames(cluster);
        
    }
    
    callback();
    
    function RunCluseredGames(list) {
        return new Promise(function (resolve) {
            options.steamUser.gamesPlayed(list);
            setTimeout(() => {
                resolve();
            }, 1000 * 2);
        });
    }
}


/*
var apps= [];
function loop2(start){
    return new Promise(function(result){
        var url = `https://store.steampowered.com/saleaction/ajaxgetsaledynamicappquery?cc=DK&l=english&clanAccountID=39049601&clanAnnouncementGID=3337742851854054341&flavor=trendingwishlisted&strFacetFilter=&start=${start}&count=50&tabuniqueid=13&return_capsules=true&origin=https://store.steampowered.com&bForceUseSaleTag=true&strTabFilter=&bRequestFacetCounts=true`;
        jQuery.getJSON( url, function( data ) {
            setTimeout(function(){
                result(data)
            }, 1000)
        });
    })
}

(async () => {
    var loop = true;
    var loopIndex = 0;
    var solr_index = 0;
        while(loop){
            var data = await loop2(solr_index);
            if(data && data.appids && data.appids.length > 0){
                apps = apps.concat(data.appids);//.filter(function(itm){ return apps.indexOf(itm)==-1; }));
                solr_index = data.solr_index;
                loopIndex += 1;
            }else{
                loop = false;
            }
        }
  
    console.log(apps)
})();
*/
/*
function loop3(appStringList){
    return new Promise(function(result){
        var url = `https://store.steampowered.com/saleaction/ajaxgetdemoevents?${appStringList}&cc=DK&origin=https:%2F%2Fstore.steampowered.com`;
        jQuery.getJSON( url, function( data ) {
            setTimeout(function(){
                result(data)
            }, 1000)
        });
    })
}

var demoList = [];
(async () => {
    var loop = true;
    var cluster = [];
    while(loop){
        var endString = "";
        for (let index = 0; index < 50; index++) {
            if(apps.length > 0){
                var app = apps.shift();
                endString += "appids[]="+app+"&";
            }else {
                loop = false;
                break;
            }
        }   
        cluster.push(endString);
    }
    for (let i = 0; i < cluster.length; i++) {
        const element = cluster[i];
        var data = await loop3(element);
        if(data.success){
            for (let j = 0; j < data.info.length; j++) {
                const info = data.info[j];
                demoList.push(info);
            }
        }else{
            console.log(data);
        }
    }
  
    console.log(demoList)
})();
*/