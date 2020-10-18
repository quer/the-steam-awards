var cheerio = require('cheerio');
// the sub id is not the app id, bot the id from the "add to account" button from the store page 
// you can find the sub id, by finding the game on https://steamdb.info/ and then under "packages" you can see the subids. ( the it the one call "Free on Demand")
// steamdb have a list of free app ( sub ids ) that can be activated. here is a eks, from the day i crate this. where i have just copy and paste the list in here.
var subIds = [
    511497, //  Evil Possession
    510845, //  Waking the Glares
    510753, //  Don't Make Love
    510512, //  Brimstone Brawlers
    510367, //  Total War: SHOGUN 2 - Battle Bonus DLC
    510196, //  NAVYFIELD Soundtrack
    509854, //  HistoryMaker VR
    509847, //  Goblin Summer Camp
    509486, //  Stream Arenas
    509432, //  X Wars Deluxe
    508883, //  Pejes Vs Zombies
    508857, //  Special Tactics Online
    508494, //  Getaway Mayhem
    508487, //  Audio Drive 2 VR
    508265, //  Genius!
    506869, //  Interlude
    506713, //  B-12
    506108, //  Gambol
    506023, //  Two Inns at Miller's Hollow
    505109, //  Simplode Suite
    504934, //  Moo Moo Move
    504713, //  Nystagmus
    504712, //  All Over
    504356, //  Curse of the Great Forest
    504263, //  Bloody Rally Show: Prologue
    504172, //  Placement
    504131, //  ハンターハーツ Hunter Hearts
    504124, //  Noda
    504123, //  Death World
    504114, //  Brave Furries
    503950, //  Sunshine Manor Prologue
    503688, //  Death Circus
    503328, //  The First Day
    503235, //  Freedom Defender
    503225, //  Gauge Of Rage
    502951, //  JungleKnight
    502895, //  Gallic Wars: Battle Simulator Prologue
    502746, //  ENHANCE
    502617, //  The Blue Box
    502365, //  NetGunner
    502313, //  PP Puncher
    502277, //  Chip's Challenge 1
    502260, //  Chip's Challenge 1
    502216, //  Rogue Rails
    502119, //  Raji: An Ancient Epic Prologue
    501985, //  SWAM
    501957, //  Gelldonia
    501922, //  Siren Head: The Siren's Forest
    501820, //  Penny's Path Soundtrack
    501819, //  Penny's Path
    501770, //  Animal Rescuer: Prologue
    501534, //  Sunset Mall Soundtrack
    501009, //  烽火攻城
    501006, //  封神霸业
    500703, //  9 Monkeys of Shaolin: Prologue
    500349, //  Air Attack
    500343, //  Gizmos: Steampunk Nonograms Soundtrack
    500252, //  Island of Deception
    500142, //  GameAssistant: The Tool For Every Gamer
    499593, //  Cosplay Maker
    499586, //  Explosion Magic Firebolt
    499560, //  In Extremis
    499559, //  Core Of Darkness
    499521, //  Active Neurons - Wonders Of The World
    499357, //  ARTHA: Epic Card Battle Game
    499315, //  UOS Prototype
    499309, //  Fatal Theory
    499286, //  HordeCore Prologue
    498877, //  Mafia: Definitive Edition - Official Score
    498799, //  Syberia The World Before - Prologue
    498761, //  Binaural Odyssey
    498734, //  Supermarket VR
    498639, //  无名录
    498410, //  DeadTruth: The Dark Path Ahead
    498388, //  Helix Slider
    498385, //  Loot Grind Simulator
    498272, //  The Witch in the Forest
    498238, //  CONTINGENCY
    498234, //  Coronavirus - Nano Force
    498145, //  Cooking Companions: Appetizer Edition
    498115, //  Towards a perilous journey
    498037, //  The Unexpected Quest Prologue
    497995, //  This Game Might Improve Your Memory
    497472, //  Fashion Show Makeover Mega Pack
    497298, //  Shrine II
    497201, //  Ball at Work
    497177, //  Conqueror's Blade - Battle Born Bundle
    497023, //  安堂的心理咨询室：杯中之心
    496973, //  Space Mega Force Man
    496960, //  Dies irae ~Amantes amentes~
    496892, //  Life is Strange 2
    496891, //  Life is Strange 2
    496521, //  The Imagined Leviathan
    496342, //  여우불
    496312, //  POPPIN' DONUTS
    496309, //  Rainy
    496267, //  Buddi Bot:  Your Machine Learning AI Helper With Advanced Neural Networking!
    496082, //  Moonshine Maniacs - A Wild West Saga
    496062, //  Amarok Dreams
];
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < subIds.length; i++) {
        const subid = subIds[i];
        await ActivateGame(RequestStore, SessionID, options, subid);
        console.log(options.accountPretty + " "+i);
    }
    callback();
}

function ActivateGame(RequestStore, SessionID, options, subid) {
    return new Promise(function (resolve) {
        RequestStore.post({
            url: "https://store.steampowered.com/checkout/addfreelicense/",
            form:{
                action: 'add_to_cart',
                subid: subid,
                sessionid: SessionID
            }
        }, function (error, response, body) {
            var $ = cheerio.load(body);
            console.log(options.accountPretty + " subid:" + subid + " - status: " + $(".checkout_tab.checkout_content h2").html())
            setTimeout(function () {
                resolve();
            }, 500);
        })
    })
    
}