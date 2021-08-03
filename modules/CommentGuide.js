var list = [
    "Rep+",
    "Nice work",
    "pro :p",
    "god of level",
    "send me a friend request,lets play together"
];

var i = 0;
var steamid = "76561197990233572"; // the steam64 if the owner of the Guide
var shareFileID = 923012519; // the guide id ( can be found in the url )
var url = "https://steamcommunity.com/comment/PublishedFile_Public/post/"+steamid+"/"+shareFileID+"/";

module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	RequestCommunity.post({
		url: url,
		form:{
            comment: list[i],
            count: 10,
            sessionid: SessionID,
            feature2: -1
        }
	},function (error,response,body){
		console.log(body);
		++i;
        if(i >= list.length){
            i = 0;
        }
		setTimeout(function(){
			callback();
		},500);
	});
};