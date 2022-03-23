//to use this install modul "csgocoordinator" ( npm i csgocoordinator )
const Steam = require('steam');
const CSGOCoordinator = require('csgocoordinator');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    const steamGameCoordinator = new Steam.SteamGameCoordinator(steamClient, 730);
    const csgo = new CSGOCoordinator(options.steamUser, steamGameCoordinator);
    csgo.play();
    // Steam Game Coordinator status.
    csgo.on('ready', (ready) => {
        // Check, if Steam Game Coordinator is ready to receive commands.
        if (ready) {
            // Steam Game Coordinator is ready and you can now use commands from CSGOCoordinator.
            console.log("[CSGO] Game coordinator is ready.");

            // Commend a player for being friendly, a good teacher and a good leader.
            csgo.player.commend(29967844, true, true, true);
            //callback();
        } else {
            console.log("[CSGO] Game coordinator aren't ready any more.");
        }
    });
};
