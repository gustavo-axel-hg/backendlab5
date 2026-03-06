const express = require('express');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

// Rutas para estacionamiento
router.get('/', parkingController.getAllParkingCars);
router.get('/:id', parkingController.getParkingCarById);
router.post('/', parkingController.createParkingCar);
router.put('/:id', parkingController.updateParkingCar);
router.put('/:id/checkout', parkingController.checkOutParkingCar);
router.delete('/:id', parkingController.deleteParkingCar);

module.exports = router;
