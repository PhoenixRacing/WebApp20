(function() {
  angular.module('olinbaja.error', [])
    .directive('errorMessage', ErrorDirective);

  function ErrorDirective() {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '../../pages/error.html',
      controller: function($scope) {
        $scope.close = function($event) {
          var errorText = $event.target.parentElement.innerText;
          var end = errorText.substr(errorText.length - 5);
          // This should change and won't be needed if we use an 'x' icon.
          if (end === 'Close') {
            errorText = errorText.slice(0, -5);
            $scope.errorMessages.splice($scope.errorMessages.indexOf(errorText), 1);
          }
        };
      }
    };
  }


})();