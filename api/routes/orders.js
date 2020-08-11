const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products');

router.get('/', (req, res, next) =>{
    Order.find()
        .select("-__v")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc=>{
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/'+doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch()
});

router.post('/', (req, res, next) =>{
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/orders/'+result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:orderId', (req, res, next) =>{
    Order.find()
        .select('-__v') // the - before the __v states to ignore the __v field
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                products: docs.map(doc =>{
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:orderId', (req, res, next) =>{
    const id = req.params.productId;
    Order.remove({_id: id})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:"Deleted product",
                id: id,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: {productId:"Mongoose Id type", quantity:"Number"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
            console.log(err);
        });
});

module.exports = router;