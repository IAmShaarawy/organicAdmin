/**
 * Created by elshaarawy on 17-May-16.
 */

//angular script

var app = angular.module('organicApp', ['ngRoute','ngResource','ngMaterial']).run(function($rootScope,$http,$location){
    $rootScope.authenticated = false;
    $rootScope.current_user="";
    $rootScope.current_user_id="";

    $rootScope.logout = function(){
        $http.get('/auth/signout').success(function(){
            $rootScope.authenticated = false;
            $rootScope.current_user="";
            $location.path('/');
        });
    }


});


app.config(function($routeProvider) {

    $routeProvider
    //main

        .when('/',{
            templateUrl :'login.html',
            controller: 'authController'
        })
        .when('/orders',{
            templateUrl :'orders.html',
            controller: 'ordersController'
        })
        .when('/cat',{
            templateUrl :'cat.html',
            controller: 'catController'
        })
        .when('/pro',{
            templateUrl :'pro.html',
            controller: 'proController'
        })
        .when('/cust',{
            templateUrl :'cust.html',
            controller: 'custController'
        })
        .when('/profile',{
        templateUrl :'profile.html',
        controller: 'profileController'
    })

});

app.factory('ordersFactory',function($resource){
    return $resource('/orders');
});
app.factory('catFactory',function($resource){
   return $resource('/cat');
});

app.factory('custFactory',function($resource){
    return $resource('/cust');
});


app.controller('authController', function($scope,$rootScope ,$location,$http){

    $scope.user = {firstName:"",lastName:"",username:"",password:"",address:""};
    $scope.error="";

    $scope.login = function(){
        $http.post('/auth/login',$scope.user).success(function(data){
            if (data.user){
                $rootScope.authenticated=true;
                $rootScope.current_user = data.user.email;
                $rootScope.current_user_id = data.user._id;
                $location.path('/pro');
            }
            else {
                $scope.error  = data.message;
            }
        });
    }
});


app.controller('ordersController', function($scope){

});

app.controller('catController', function($scope,catFactory,$http){
    $scope.newCat = {category:""};
    $scope.categories = catFactory.query();
    $scope.catActive = new Array($scope.categories.length);

    $scope.removeCat = function(item,i){
        $http.delete('/cat/'+item).success(function(){
            $scope.catActive[i]=true;

        });
    }
    $scope.addCat = function() {

        $http.post('/cat',$scope.newCat).success(function(data){
            $scope.newCat = {category:""};
            $scope.categories = catFactory.query();
        })
    }
});

app.controller('proController', function($scope,catFactory,$http){

    var tabs = catFactory.query(),
        selected = null,
        previous = null;
    $scope.tabs = tabs;
    $scope.selectedIndex = 2;
    $scope.$watch('selectedIndex', function(current, old){
        previous = selected;
        selected = tabs[current];
        if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
        if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
    });


    $scope.newPro = {name:"",specs:"",price:"",qt:"",img_path:""};


    $scope.removePro = function(j,cat,pro,i){
        $http.delete('/pro/p/'+cat+'?pro_id='+pro).success(function(){
            $scope.tabs = catFactory.query();
        });
    }
    $scope.addPro = function(cat_id) {

        $http.post('/pro/'+cat_id,$scope.newPro).success(function(data){
            $scope.newPro = {name:"",specs:"",price:"",qt:"",img_path:""};
            $scope.tabs = catFactory.query();
        });
    }

});

app.controller('custController', function($scope,custFactory,$http){
    $scope.customers = custFactory.query();

    $scope.custActive = new Array($scope.customers.length);

    $scope.removeCust = function(item,i){
        $http.delete('/cust/'+item).success(function(){
            $scope.custActive[i]=true;

        });
    }

});

app.controller('profileController', function($scope){

});