var list = [
    "hope all is well",
    "HAVE A GOOD DAY !",
    "Hope you have a great day!",
    "god of level",
    "Have a great weekend",
    "900 iq",
    `....................„-~~'''''''~~--„„_
    ..............„-~''-,::::::::::::::::::: ''-„
    ..........,~''::::::::',:::::::::::::::: ::::|',
    .....::::::,-~'''¯¯¯''''~~--~'''¯'''-,:|
    .........'|:::::|: : : : : : : : : : : ::: : |,'
    ........|:::::|: : :-~~---: : : -----: |
    .......(¯''~-': : : :'¯°: ',: :|: :°-: :|
    .....'....''~-,|: : : : : : ~---': : : :,'
    ...............|,: : : : : :-~~--: : ::/ NEVER GONNA GIVE YOU UP
    ......,-''\':\: :'~„„_: : : : : _,-' NEVER GONNA LET YOU DOOOWN
    __„-';;;;;\:''-,: : : :'~---~''/| NEVER GONNA RUN AROUND AND DESERT YOU
    ;;;;;/;;;;;;;\: :\: : :____/: :',__
    ;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-„__
    ;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-„
    ;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|
    ;;;;;;;\;;;;;;;;;;;',: : :|¯¯|. . .|;;;;;;;;;,';;|
    ;;;;;;;;;',;;;;;;;;;;;\. . |:::|. . .'',;;;;;;;;|;;/
    ;;;;;;;;;;\;;;;;;;;;;;\. .|:::|. . . |;;;;;;;;|/
    ;;;;;;;;;;;;,;;;;;;;;;;|. .\:/. . . .|;;;;;;;;|`,
    "Have an awesome new week",
    "𝘌𝘯𝘫𝘰𝘺 𝘵𝘩𝘦 𝘸𝘦𝘦𝘬𝘦𝘯𝘥! :kb2_heart",
    "𝙃𝙤𝙥𝙚 𝙮𝙤𝙪 𝙝𝙖𝙫𝙚 𝙖 𝙜𝙧𝙚𝙖𝙩 𝙬𝙚𝙚𝙠!",
    "Have a great weekend!",
    "𝑬𝒏𝒋𝒐𝒚 𝒕𝒉𝒆 𝒓𝒆𝒔𝒕 𝒐𝒇 𝒕𝒉𝒆 𝒘𝒆𝒆𝒌!",
    "I’m feelin' like the greatest",
    "may you have a good weekend quer :)",
    "ＨＡＶＥ Ａ ＧＲＥＡＴ ＷＥＥＫＥＮＤ",
    "3k Guides!!",
    "༼ つ ◕_◕ ༽つ PRAISE GOLD HELM! ༼ つ ◕_◕ ༽つ",
    "Bun Bun",
    "𝕳𝖆𝖛𝖊 𝖆 𝖓𝖎𝖈𝖊 𝖜𝖊𝖊𝖐𝖊𝖓𝖉",
    "Have a nice day!",
    "HAVE A WONDERFUL DAY ",
    "♥",
    `♥ l、 
    （ﾟ､ ｡ ７ ♥ 
    　l、 ~ヽ 
    　じしf_, )ノ`,
    "Have a great weekend!",
    "꧁ Galadhiel ꧂",
    "༼ つ ◕_◕ ༽つ PRAISE GOLD HELM! ༼ つ ◕_◕ ༽つ",
];
var i = 0;
var steamid= "76561197990233572";
var url = "https://steamcommunity.com/comment/Profile/post/"+steamid+"/-1/";
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: url,
        form:{
            comment: list[i],
            count: 6,
            sessionid: SessionID,
            feature2: -1
        }
    }, function (error, response, body) {
        console.log(body);
        ++i;
        setTimeout(function () {
            callback();
        }, 500);
    });
};
