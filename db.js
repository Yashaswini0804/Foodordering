const mongoose = require("mongoose");

var mongoURL = "mongodb://localhost:27017/food-ordering";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var connection = mongoose.connection;
connection.on('error', () => {
    console.log("Mongodb connection failed");
});
connection.on('connected', () => {
    console.log("mongodb connection successful");
});

module.exports = mongoose;
