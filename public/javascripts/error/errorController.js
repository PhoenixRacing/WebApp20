(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.error.controller", [
    'olinbaja.error.factory'
  ])
    .controller('ErrorController', ErrorController);

  function ErrorController(errorBus, $scope, $rootScope) {
    var vm = this;

    vm.errorMessages = [];

    vm.relabelErrors = function() {
      for(var i = 0; i < vm.errorMessages.length; i++) {
        vm.errorMessages[i].id = i;
      }
    }

    $rootScope.$on('$locationChangeSuccess', function() {
      vm.errorMessages = [];
    });

    errorBus.onError(function(evt, data) {
      err = {
        'error': data.error,
        'id': vm.errorMessages.length
      };
      vm.errorMessages.push(err);
      vm.relabelErrors();
    }, $scope);

    errorBus.onClear(function(evt, data) {
      vm.errorMessages = [];
    }, $scope);

    vm.closeError = function(id) {
      for(var i = 0; i < vm.errorMessages.length; i++) {
        if(vm.errorMessages[i].id == id) {
          vm.errorMessages.splice(i, 1);
          break;
        }
      }
      vm.relabelErrors();
    };
  }
})();