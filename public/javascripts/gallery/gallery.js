
  app.controller('GalleryController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    function reloadTeam() {
      $http({
        method:'POST',
        url: '/team/data'
      }).then(function successCallback(response) {
        $scope.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    $http.get('/gallery/data', {}).then(
      function success(response) {
        console.log(response);
        $scope.images = response.data;
      }, function error(response) {
        console.log(status);
      }
    );
  }]);