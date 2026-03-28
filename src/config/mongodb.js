const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27019/mongodb";

async function connectionMongoDB() {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB Conectado");
        console.log(mongoose.connection.client.s.url);
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectionMongoDB;