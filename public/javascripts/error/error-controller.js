(function(){
	//initialize the angular app and inject dependencies.
	var app = angular.module("olinbaja.error.controller", [
      'ngRoute',
      'olinbaja.error.factory'
    ])
    .controller('ErrorController', ErrorController);

  function ErrorController(errorBus) {
    console.log("HI, errors");
  }
})();