
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongodb  =require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/organic";


module.exports = function(passport){

    passport.serializeUser(function(user,done){

        //tell passport which id use for user
        console.log('serialized user: ',user.email);
        done(null,user._id);
    });

    passport.deserializeUser(function(_id,done){

        MongoClient.connect(url,function(err,db){

            if (!err){
                db.collection('users').findOne({_id:new mongodb.ObjectID(_id)},function(err,user){
                    if (!err){
                        console.log("deserializeUser "+user.email);
                        db.close();
                        return done(err,user);
                    }
                    else {
                        db.close();
                        return done(err,false);
                    }
                })
            }
            else {
                db.close();
                return done(err,false);
            }
        });

    });

    //Login strategy
    passport.use('login',new LocalStrategy({
      passReqToCallback :true
    },
        function(req,username,password,done){

            //check user name existence

            MongoClient.connect(url,function(err,db){

                if (!err){
                    var customers = db.collection("users");
                    customers.findOne({email:username},function(err,user){
                       if (!err){
                           if (user!=null){
                               if (isValidPassword(user,password)){
                                   db.close();
                                   console.log("logged in"+JSON.stringify(user));
                                   return done(null,user);
                               }
                               else {
                                   db.close();
                                   console.log('invalid password');
                                   return done(null,false);
                               }
                           }
                           else {
                               db.close();
                               console.log("not exist user");
                               return done(null,false);
                           }
                       }
                       else{
                           db.close();
                           return done(err,false);
                       }
                    });
                }
                else {
                    db.close();
                    return done(err,false);
                }

            });

        })
    );

    //signUp strategy
    passport.use('signup', new LocalStrategy({
      passReqToCallback :true
    },
        function(req,username,password,done){
            MongoClient.connect(url,function(err,db){
                if (err){
                    console.log("error in connection");
                    return done("error in connection",false);
                }
                console.log("connected to mongo");
                var col_users = db.collection('users');

                col_users.findOne({email:username},function(err,user){
                    if (user==null){
                        col_users.insert({email:username,password:createHash(password)}
                            ,{w:1}
                            ,function(err,result){

                                    console.log("inserted***"+JSON.stringify(result));
                                    db.close();
                                    return done(null,result.ops[0]);

                                });
                    }
                    else {
                        console.log("user exist");
                        db.close();
                        return done(null, false);
                    }
                });

            });
        }
    ));


    //helper functions
    var isValidPassword = function(user,password){
        return bCrypt.compareSync(password,user.password);
    };

    var createHash =function(password){
        return bCrypt.hashSync(password,bCrypt.genSaltSync(1),null);
    };

};