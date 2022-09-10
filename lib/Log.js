const fs = require('fs');
const path = require('path');
const settings = require('./Settings');
module.exports = function () {
    this.SaveFilePath = path.join(__dirname, "../Log/");
    if (!fs.existsSync(this.SaveFilePath)){
        fs.mkdirSync(this.SaveFilePath);
    }
    this.SaveFileName = "";
    var timeStamp = (new Date().toJSON()).replace(/:/g, "-")
    if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SingleFile){
        this.SaveFileName = timeStamp + ".txt";
    }else if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SplitFile){
        this.SaveFilePath = path.join(this.SaveFilePath, timeStamp); // add log into folder
        if (!fs.existsSync(this.SaveFilePath)){
            fs.mkdirSync(this.SaveFilePath);
        }
    }
    this.GlobalLogging = function (args) {
        var log = args.join(" ");
        var file = ""
        if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SplitFile){
            file = path.join(this.SaveFilePath, "main.txt");
        }else if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SingleFile){
            file = path.join(this.SaveFilePath, this.SaveFileName);
        }
        this.AddToFile(file, log)
    }
    this.Logging = function module(bot, args) {
        var log = args.join(" ");
        if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SingleFile){
            var file = path.join(this.SaveFilePath, this.SaveFileName);
            this.AddToFile(file, log)
            
        }else if(settings.Logging.SaveLogType == settings.Enums.Logging.type.SplitFile){
            
            var folder = path.join(this.SaveFilePath, this.SaveFileName)
            var file = path.join(folder, bot + ".txt");
            this.AddToFile(file, log)
        }
    }
    this.AddToFile = function (file, log) {
        try{
            if(!fs.existsSync(file)){
                fs.writeFileSync(file, log, { flag: 'a+' });
            } else {
                fs.appendFileSync(file, "\n"+log);
            }
        } catch(err) {
            // An error occurred
            console.error(err);
        }
    }
}