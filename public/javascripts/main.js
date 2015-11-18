(function(){
	//initialize the angular app and inject dependencies.
	var app = angular.module("olinbaja", ['ngRoute']);

	app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './pages/home.html'
        })
        .when('/car', {
        	templateUrl : './pages/car.html'
        });
    });

})();