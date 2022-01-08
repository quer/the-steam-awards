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
var i = 0;
var steamid= "76561197990233572";
var url = "https://steamcommunity.com/comment/Profile/post/"+steamid+"/-1/";
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    console.log("start module");
    RequestCommunity.post({
        url: url,
        form:{
            comment: list[i],
            count: 6,
            sessionid: SessionID,
            feature2: -1
        }
    }, function (error, response, body) {
        console.log("post done", {obj: {"test": "test", "test2": []}, "list": []});
        console.error("post done", {obj: {"test": "test", "test2": []}, "list": []});
        //console.log(body);
        ++i;
        setTimeout(function () {
            console.log("done module");
            callback();
        }, 500);
    });
};
