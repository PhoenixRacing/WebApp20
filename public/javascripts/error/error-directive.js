(function() {
  angular.module('olinbaja.error', ['olinbaja.error.factory'])
    .directive('errorMessage', ErrorDirective);

  function ErrorDirective(errorBus) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: './../../pages/error.html',
      link: function(scope, element, attrs) {
        var linkedScope = scope;
        linkedScope.errorMessages = [];

        function relabelErrors() {
          for(var i = 0; i < linkedScope.errorMessages.length; i++) {
            linkedScope.errorMessages[i].id = i;
          }
        }

        errorBus.onError(function(evt, data) {
          err = {
            'error': data.error,
            'id': linkedScope.errorMessages.length
          };
          linkedScope.errorMessages.push(err);
          relabelErrors();
        }, linkedScope);

        linkedScope.closeError = function(id) {
          for(var i = 0; i < linkedScope.errorMessages.length; i++) {
            if(linkedScope.errorMessages[i].id == id) {
              linkedScope.errorMessages.splice(i, 1);
              break;
            }
          }
          relabelErrors();z
        };
      }
    };
  }


})();
