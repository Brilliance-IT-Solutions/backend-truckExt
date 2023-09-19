const mongoose = require("mongoose");
const environmentVariables = require("../server/utils/environmentVariables");

main().then((res) => console.log("db connected successfully...!!!"));
main().catch((err) => console.log(err));

async function main() {
    mongoose.connect(environmentVariables.MONGODB_CONNECTION);
}
