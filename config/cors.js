const cors = require("cors");

module.exports = async function (app) {
    const whitelist = [
        'http://localhost:3000'
    ];

    const corsOptions = {
        origin: function (origin, callback) {
            const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
        },
        credentials: true,
    };
    app.use(cors(corsOptions));
};
