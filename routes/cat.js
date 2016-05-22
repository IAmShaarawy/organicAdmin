var express = require('express');
var router  = express.Router();
//Mongo requirement
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/organic";


// this middleware
//router.use(function(req,res,next){
//
//   if(req.method === "GET"){
//       //continue to next middleware
//       return next();
//   }
//
//   if (!req.isAuthenticated()){
//       //redirect to login page
//       return res.redirect('/#login')
//   }
//
//   //user isAuthorised
//   return next();
//
//});

router.route('/')

    .get(function(req,res){

        MongoClient.connect(url,function(err,db){
            if (!err){
                db.collection('categories').find({}).toArray(function(err,data){
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
    })

    .post(function(req,res){

        var newCategory = {
            category : req.body.category,
            products : [],
            color : req.body.color
        };

        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').insert(newCategory,function(err,result){
                    if (!err){
                        db.close();
                        return res.json(result.ops[0]);
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
                db.collection('categories').findOne({_id:new mongodb.ObjectID(req.params.id)},function(err,post){
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
        var updatedCategory = {
            category : req.body.category,
            color : req.body.color
        }
        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').update({_id:new mongodb.ObjectID(req.params.id)},{$set:updatedCategory},function(err,post){
                    if(!err){
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
    .delete(function(req,res){

        MongoClient.connect(url,function(err,db){
            if(!err){
                db.collection('categories').remove({_id:new mongodb.ObjectID(req.params.id)},function(err,deletedrows){
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

module.exports = router;