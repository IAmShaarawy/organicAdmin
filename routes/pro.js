var express = require('express');
var router  = express.Router();
//Mongo requirement
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/organic";

router.route('/:id')

    .get(function(req,res){
        MongoClient.connect(url,function(err,db){
            if (!err){
                db.collection('categories').find({_id:new mongodb.ObjectID(req.params.id)}).toArray(function(err,data){
                    if(!err){
                        db.close();
                        return res.json(data[0].products);
                    }
                    else {
                        db.close();
                        return res.send(500,err);
                    }
                });
            }
            else {
                return res.send(500,err);
            }
        });
    })

    .post(function(req,res){

        var newProduct = {
            _id:new mongodb.ObjectID(),
            name : req.body.name,
            specs : req.body.specs,
            price: req.body.price,
            qt: req.body.qt,
            img_path: req.body.img_path
        };
        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').update({_id:new mongodb.ObjectID(req.params.id)},{$push:{products:newProduct}},function(err,data){
                    if (!err){
                        db.close();
                        return res.json(data);
                    }
                    else {
                        db.close();
                        return res.send(500,err);
                    }
                });
            }
            else {
                return res.send(500,err);
            }
        });
    });




router.route('/p/:id?')
    .get(function(req,res){
        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').findOne({'products._id':new mongodb.ObjectID(req.query.pro_id) },{products:{$elemMatch:{ _id:new mongodb.ObjectID(req.query.pro_id)}}},function(err,data){
                    if(!err){
                        db.close();

                        return res.json(data.products[0]);
                    }else {
                        db.close();
                        return res.send(500,err);
                    }
                })
            } else {
                return res.send(500,err);
            }
        });
    })
    .put(function(req,res){
        var updatedProduct = {
            'products.$.name' : req.body.name,
            'products.$.specs' : req.body.specs,
            'products.$.price': req.body.price,
            'products.$.qt': req.body.qt,
            'products.$.img_path': req.body.img_path
        };
        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').update({products:{$elemMatch:{_id: new mongodb.ObjectID(req.query.pro_id) }}},{$set:updatedProduct},function(err,data){
                    if(!err){
                        return res.json(data);
                    }else {
                        db.close();
                        return res.send(500,err);
                    }
                })
            } else {
                return res.send(500,err);
            }
        });
    })
    .delete(function(req,res){

        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').update({_id:new mongodb.ObjectID(req.params.id)},{$pull:{products:{_id:new mongodb.ObjectID(req.query.pro_id)}}},function(err,data){
                    if(!err){
                        db.close();

                        return res.send(data);
                    }else {
                        db.close();
                        return res.send(500,err);
                    }
                });
            } else {
                return res.send(500,err);
            }
        });
    });

module.exports = router;