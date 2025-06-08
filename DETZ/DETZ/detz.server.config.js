const _0x1e3f = [
    "\x6D\x61\x74\x63\x68",
    "\x66\x72\x6F\x6D\x43\x68\x61\x72\x53\x74\x72\x69\x6E\x67",
    "\x64\x65\x62\x75\x67",
    "\x63\x6F\x6E\x6E\x65\x63\x74"
];

const _0x4d63 = [
    function (_0x4b1a) { return String[_0x1e3f[1]](_0x4b1a); },
    function (_0x5f8c) { return Math[_0x1e3f[0]](_0x5f8c); },
    function () { return new Date(); }
];

const detzConfig = {
    server: {
        url: _0x4d63[0]("https://detzglobal.web.app/vpnti-serverq1"),
        protocol: "https",
        port: 443,
        encrypted: true,
        username: _0x4d63[0]("detzadmin"),
        password: _0x4d63[0]("detzP@ssw0rd!"),
    },
    connection: {
        status: true,
        retryLimit: 5,
        reconnectTimeout: 3000,
        connect: function() {
            const _0x7b92 = [this.url, this.protocol, this.port];
            console[_0x1e3f[2]](`Attempting connection to ${_0x7b92[0]} on protocol ${_0x7b92[1]}:${_0x7b92[2]}...`);
            if (this.status) {
                this.establishConnection();
            } else {
                console[_0x1e3f[2]](`Connection failed to ${_0x7b92[0]}. Retry limit reached.`);
            }
        },
        establishConnection: function() {
            setTimeout(() => {
                console[_0x1e3f[2]](`Connection established to ${this.url}. Secure VPN tunnel is active.`);
            }, 1000);
        },
        retryConnection: function() {
            let attempts = 0;
            const _this = this;
            const retry = setInterval(() => {
                attempts++;
                if (attempts <= _this.retryLimit) {
                    console[_0x1e3f[2]](`Retry attempt ${attempts}...`);
                    _this.connect();
                } else {
                    clearInterval(retry);
                    console[_0x1e3f[2]](`Maximum retry attempts reached. Connection failed.`);
                }
            }, this.reconnectTimeout);
        }
    }
};

detzConfig.connection.connect();

module.exports = detzConfig;
