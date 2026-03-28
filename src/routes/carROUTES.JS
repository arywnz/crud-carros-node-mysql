const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController');

router.get('/', carController.listCars);
router.get('/:id', carController.getCar);
router.post('/', carController.createCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;