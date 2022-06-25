const crypto = require("crypto");
const fs = require('fs');
module.exports = {
    Dir: __dirname + "/../sentrys/",
    Get: function (username) {
        var sha_sentryfile = null;
        try {
            var sentry = fs.readFileSync(this.Dir + username);
            if (sentry.length) {
                sha_sentryfile = this.MakeSha(sentry);
            }
        } catch (beef) {
        }
        return sha_sentryfile;
    },
    Save: function (username, content) {
        if (!fs.existsSync(this.Dir)) {
            fs.mkdirSync(this.Dir);
        }
        fs.writeFileSync(this.Dir + username, content);
    },
    MakeSha: function(bytes) {
        var hash = crypto.createHash('sha1');
        hash.update(bytes);
        return hash.digest();
    }
}
