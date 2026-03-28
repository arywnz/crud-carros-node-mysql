const mongoose = require("mongoose");

const userSchemma = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchemma);
module.exports = User;