const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orders');
const checkAuth = require('../middleware/check_auth');

router.get('/', checkAuth, OrderController.order_get_all);

router.post('/',checkAuth, OrderController.create_order);

router.get('/:orderId',checkAuth, OrderController.order_get_one);

router.delete('/:orderId',checkAuth, OrderController.delete_order);

module.exports = router;