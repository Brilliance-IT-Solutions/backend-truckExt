const mongoose = require("mongoose");
const environmentVariables = require("../server/utils/environmentVariables");

main().then((res) => console.log("db connected successfully...!!!"));
main().catch((err) => console.log(err));

async function main() {
    mongoose.connect('mongodb+srv://sonam_brillianceit:HrUek2MQp5I9BsIF@truckextension.b4bjq9c.mongodb.net/truckExtension?retryWrites=true&w=majority');
}
