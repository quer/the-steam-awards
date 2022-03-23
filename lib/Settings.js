module.exports = new function () {
    this.Enums = {
        logging: {
            mode: {
                all: 0,
                OnlyError: 1,
                None: 2
            },
            type: {
                splitFile: 0,
                SingleFile: 1
            }
        },
        RunningMode:{
            single: 0,
            cluster: 1,
            All: 2
        },
        Request: {
            MinTimeBetweenRequest : 0,// will subtract requested time, to ensure that we min get this time between each request 
            FullWait: 1 // will wait the time, not mather how long the request did take. 
        }
    }
    this.AuthFieldNameUsername = "steam_user",
    this.AuthFieldNamePassword = "steam_pass",
    this.AuthFieldNamesharedSecret = "sharedSecret",
    this.AuthFieldNameSteamApiKey = "steamApiKey",
    this.AuthFieldSpecialAccountText = "specialAccountText",
    this.Logging = {
        ShowTimeStamp: true,
        ShowAccountSteamId: true,
        ShowAccountName: true,
        ShowStack: true,
        ShowModule: true,
        ShowSpecialAccountText: true,
        SaveLog: true,
        SaveLogMode: this.Enums.logging.mode.None,
        SaveLogType: this.Enums.logging.type.SingleFile
    },
    this.RunningMode = {
        Mode: this.Enums.RunningMode.single,
        clusterSize: 1
    },
    this.Request = {
        Time: 1000, // 1000 is 1 sec
        Mode: this.Enums.Request.MinTimeBetweenRequest
    }
}