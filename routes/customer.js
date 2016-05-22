var express = require('express');
var router  = express.Router();
var bCrypt = require('bcrypt-nodejs');
//Mongo requirement
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/organic";




router.route('/')

    .get(function(req,res){

        MongoClient.connect(url,function(err,db){
            if (!err){
                db.collection('customers').find({}).toArray(function(err,data){
                    if(!err){
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


router.route('/:id')
    .get(function(req,res){

        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('customers').findOne({_id:new mongodb.ObjectID(req.params.id)},function(err,post){
                    if(!err){
                        db.close();
                        return res.json(post);
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
        var updatedCustomer = req.body.password? {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                password:createHash(req.body.password),
                address: req.body.address
            }:{
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                address: req.body.address
            };

        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('customers').update({_id:new mongodb.ObjectID(req.params.id)},{$set:updatedCustomer},function(err,data){
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
                db.collection('customers').remove({_id:new mongodb.ObjectID(req.params.id)},function(err,deletedrows){
                    if(!err){
                        db.close();
                        console.log(deletedrows);
                        return res.send(deletedrows);
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

var createHash =function(password){
    return bCrypt.hashSync(password,bCrypt.genSaltSync(1),null);
};

module.exports = router;