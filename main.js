const settings = require('./lib/Settings');
const core = require('./lib/Core');


var modules = [];
//modules.push('events/salequeue');
//modules.push('events/FreeDailySticker');
//modules.push('profileComment');
//modules.push('Wishlist_AddGame');
//modules.push('GameRecommend_Add');
modules.push('ActivateFreeGame');



core.RunAllBots(modules)
.then(function () {
}).catch(function (error) {
	core.logError("Somefing happend!");
	core.logError(error);
}).finally(function () {
	process.exit();
})
