const path = require('path');
const CoreSteam = require('./CoreSteam');
const Auth = require('./Auth');
const settings = require('./Settings');
const logHandler = require('./Log');
var _log = console.log;
var _logError = console.error;

module.exports = {
    LoadModules: function (list) {
        var modules = [];
        try {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                var name = item.split("/").pop();
                modules.push({name: name, module: require(path.join(__dirname, '../modules/' + item + '.js'))})
            }
        } catch (error) {
            this.log("Somefing went wrong, loading the modules in to cache")
            this.log(error);
            modules = null;
        }
        return modules;
    },
    //run all accounts
    RunAllBots: async function (modules) {
        await this.DoRunBots(Auth.GetAll(), modules);
    },
    RunIndexSpecificBot: async function (indexList, modules) {
        await this.DoRunBots(Auth.GetIndexSpecificBot(indexList), modules);
    },
    RunAllButIndexSpecificBot: async function (indexList, modules) {
        await this.DoRunBots(Auth.GetAllButIndexSpecificBot(indexList), modules);
    },
    DoRunBots: async function (auths, modules) {
        //ensure there are modules
        if(modules == null || modules.length == 0){
            this.logError("no modules added to be runned");
            return;
        }
        this.currentlogHandler = new logHandler();
        //load the modules
        try {
            modules = await this.LoadModules(modules);
        } catch (error) {
            this.logError("Failed loading the modules, maby one of them do not exist");
            this.logError(error);
            return;
        }

        if(modules == null || modules.length == 0){
            this.logError("no modules added to be runned");
            return;
        }
        this.currentlogHandler.GlobalLogging(["Modules to run", modules.join(", ")])
        //build AccountObjs
        var accounts = [];
        for (let i = 0; i < auths.length; i++) {
            const auth = auths[i];
            accounts.push(new CoreSteam(this, auth, modules))
        }
        //run all at once
        if(settings.RunningMode.Mode == settings.Enums.RunningMode.All){
            var allPromises = [];
            for (let i = 0; i < accounts.length; i++) {
                allPromises.push(accounts[i].Run())
            }
            await Promise.allSettled(allPromises);
        }
        else if(settings.RunningMode.Mode == settings.Enums.RunningMode.Cluster){
            var size = settings.RunningMode.ClusterSize;
            var buildingcluster = [];
            var buildSize = 0;
            for (let i = 0; i < accounts.length; i++) {
                buildingcluster.push(accounts[i].Run())
                ++buildSize;
                if(buildSize >= size) {
                    //run the cluster pack, before doing the next
                    await Promise.allSettled(buildingcluster);
                    buildingcluster = [];
                    buildSize = 0;
                }
            }
            if(buildingcluster.length > 0){
                await Promise.allSettled(buildingcluster);
            }
        }
        else if(settings.RunningMode.Mode == settings.Enums.RunningMode.Single)
        {
            for (let i = 0; i < accounts.length; i++) {
                try {
                    await accounts[i].Run();
                } catch (error) {
                    this.logError("Somefing went wrong")
                    this.logError(error);
                }
            }
        }
        this.log("saving config file!");
        await Auth.saveList();
        this.log("All Done!");
    },
    _log: _log,
    _logError: _logError,
    log: function () {
        var args = []
        if(settings.Logging.ShowTimeStamp){
            timeStampPart = '[' + new Date().toUTCString() + ']';
            args.push( '\x1b[34m', timeStampPart);
        }

        if(settings.Logging.ShowStack){
            var stack = new Error().stack;
            args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
        }
        args.push('\x1b[0m');
        for( var i = 0; i < arguments.length; i++ ) {
            args.push( arguments[i] );
        }
        this.SaveToLog("log", null, args);
        _log.apply(console, args);
    },
    logError: function () {
        var args = []
        if(settings.Logging.ShowTimeStamp){
            timeStampPart = '[' + new Date().toUTCString() + ']';
            args.push( '\x1b[34m', timeStampPart);
        }
        if(settings.Logging.ShowStack){
            var stack = new Error().stack;
            args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
        }
        args.push('\x1b[0m');
        for( var i = 0; i < arguments.length; i++ ) {
            args.push( arguments[i] );
        }
        this.SaveToLog("error", null, args);
        _logError.apply(console, args);
    },
    SaveToLog: function (type, userName, args) {
        
        if(settings.Logging.SaveLogMode == settings.Enums.Logging.Mode.OnlyError){
            if(type == "error"){
                if(userName != null){
                    this.currentlogHandler.Logging(userName, args);
                }else{
                    this.currentlogHandler.GlobalLogging(args)
                }
            }
        }else if(settings.Logging.SaveLogMode == settings.Enums.Logging.Mode.All){
            if(userName != null){
                this.currentlogHandler.Logging(userName, args);
            }else{
                this.currentlogHandler.GlobalLogging(args)
            }
        }
    }
}

console.log = function () {
    var args = [];
    var stack = new Error().stack;
    args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
    args.push("use options.log([data][, ...args])")
    _log.apply(console, args);
    _log.apply(console, arguments);
}
console.error = function () {
    var args = [];
    var stack = new Error().stack;
    args.push( '\x1b[36m', stack.toString().split(/\r\n|\n/)[2]);
    args.push("use options.log([data][, ...args])")
    _logError.apply(console, args);
    _logError.apply(console, arguments);
}
