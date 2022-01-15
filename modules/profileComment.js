var list = [
    '+rep Good player 💜',
    '+rep Amazing Tactics 👌',
    '+rep Epic Clutch ✌',
    '+rep Clutch 👍',
    '+rep Killing Machine *_*',
    '+rep 1Tap Only 👊',
    '+rep Insane Skills 👌',
    '+rep One shot, one kill. No luck, just skill ✔',
    '+rep Top Player 🔝',
    '+rep Thx for carry 👍',
    '+rep Epic Comeback 👍',
    '+rep Good Teammate 🎮',
    '+rep Friendly Person 💜',
    '+rep ONE TAP MACHINE 👍'
];
var steamid = "76561197990233572";
var url = "https://steamcommunity.com/comment/Profile/post/"+steamid+"/-1/";
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    await MakeProfileComment(RequestCommunity, SessionID, list[3]);
    await MakeProfileComment(RequestCommunity, SessionID, list[4]);
    await MakeProfileComment(RequestCommunity, SessionID, list[5]);
    callback();
};

function MakeProfileComment(RequestCommunity, SessionID, text) {
    return new Promise(function (resolve, reject) {
        RequestCommunity.post({
            url: url,
            form:{
                comment: text,
                count: 6,
                sessionid: SessionID,
                feature2: -1
            }
        }, function (error, response, body) {
                resolve();
        });
    })
}
