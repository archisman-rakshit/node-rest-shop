const Product = require('../models/products');
const mongoose = require('mongoose');

exports.product_get_all = (req, res, next) => {
    Product.find()
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
                            url: 'http://localhost:3000/products/' + doc._id
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
}

exports.add_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: "Created product",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result.id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.product_get_one = (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
        .select('-__v') // the - before the __v states to ignore the __v field
        .exec()
        .then( doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    product:doc,
                    request:{
                        type:'GET',
                        description: 'Check all products',
                        url: 'http://localhost:3000/products/'
                    }
                });
            }
            else{
                res.status(404).json({error:"No valid data found"});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
            console.log(err);
        });
}

exports.update_product = (req, res, next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}

exports.delete_product = (req, res, next) =>{
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:"Deleted product",
                id: id,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {name:"String", price:"Number"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
            console.log(err);
        });
}