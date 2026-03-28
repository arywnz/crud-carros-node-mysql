const carRepository = require('../repositories/carRepository');

// LISTAR TODOS
async function listCars(req, res) {
    try {
        const cars = await carRepository.getAllCars();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar carros' });
    }
}

// BUSCAR POR ID
async function getCar(req, res) {
    try {
        const car = await carRepository.getCarById(req.params.id);

        if (!car) {
            return res.status(404).json({ erro: 'Carro não encontrado' });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar carro' });
    }
}

// CRIAR
async function createCar(req, res) {
    try {
        const { modelo, marca, ano } = req.body;

        if (!modelo || !marca || !ano) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }

        const newCar = await carRepository.createCar({ modelo, marca, ano });

        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar carro' });
    }
}

// ATUALIZAR
async function updateCar(req, res) {
    try {
        const { modelo, marca, ano } = req.body;
        const id = req.params.id;

        const updated = await carRepository.updateCar(id, { modelo, marca, ano });

        if (!updated) {
            return res.status(404).json({ erro: 'Carro não encontrado' });
        }

        res.json({ mensagem: 'Carro atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar carro' });
    }
}

// DELETAR
async function deleteCar(req, res) {
    try {
        const id = req.params.id;

        const deleted = await carRepository.deleteCar(id);

        if (!deleted) {
            return res.status(404).json({ erro: 'Carro não encontrado' });
        }

        res.json({ mensagem: 'Carro removido com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao remover carro' });
    }
}

module.exports = {
    listCars,
    getCar,
    createCar,
    updateCar,
    deleteCar
};