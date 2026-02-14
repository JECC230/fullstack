const express = require('express');
const controller = require('../controllers/productos.controller');
const router = express.Router();


router.get('/search', controller.searchAvanzado);


router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;