const User = require("../models/userModel");

async function listUsers(req, res) {
    const users = await User.find();
    res.json(users);
}

async function getUser(req, res) {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(user);
}

async function createUser(req, res) {
    try {
        const { nome } = req.body;
        const novoUsuario = new User({ nome });
        await novoUsuario.save();
        res.status(201).json(novoUsuario);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao criar usuário", detalhes: erro.message });
    }
}

async function updateUser(req, res) {
    try {
        const { nome } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { nome },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json(user);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao atualizar usuário", detalhes: erro.message });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.status(204).send();
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao deletar usuário", detalhes: erro.message });
    }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };