module.exports = new function () {
    this.Enums = {
        Logging: {
            Mode: {
                All: 0,
                OnlyError: 1,
                None: 2
            },
            type: {
                SplitFile: 0,
                SingleFile: 1
            }
        },
        RunningMode:{
            Single: 0,
            Cluster: 1,
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
    this.AuthFieldNameFamilyViewPIN = "PIN",
    this.AuthFieldNameMailAuth = "mailAuth",
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
        SaveLogMode: this.Enums.Logging.Mode.All,
        SaveLogType: this.Enums.Logging.type.SplitFile
    },
    this.RunningMode = {
        Mode: this.Enums.RunningMode.Single,
        ClusterSize: 1
    },
    this.Request = {
        UseQueue: false,
        Time: 1000, // 1000 is 1 sec
        Mode: this.Enums.Request.MinTimeBetweenRequest
    }
}