const settings = require('./lib/Settings');
const core = require('./lib/Core');
settings.AuthFieldNameUsername = "username";
settings.AuthFieldNamePassword = "password";
settings.Logging.SaveLogMode = settings.Enums.logging.mode.all;
settings.Logging.SaveLogType = settings.Enums.logging.type.splitFile;
settings.RunningMode.Mode = settings.Enums.RunningMode.cluster;
settings.RunningMode.clusterSize = 4;

var modules = [];
//modules.push('events/salequeue');
//modules.push('events/FreeDailySticker');
//modules.push('profileComment');
//modules.push('Wishlist_AddGame');
//modules.push('GameRecommend_Add');
modules.push('test');



//core.RunAllBots(modules)
core.RunIndexSpecificBot([0, 1], modules)
.then(function () {
}).catch(function (error) {
	core.logError("Somefing happend!");
	core.logError(error);
}).finally(function () {
	process.exit();
})
