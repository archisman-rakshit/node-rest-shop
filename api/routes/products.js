const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products')
const checkAuth = require('../middleware/check_auth');

router.get('/', ProductController.product_get_all );

router.post('/', checkAuth, ProductController.add_product);

router.get('/:productId', ProductController.product_get_one);

router.patch('/:productId', checkAuth , ProductController.update_product);

router.delete('/:productId', checkAuth , ProductController.delete_product);


module.exports = router;