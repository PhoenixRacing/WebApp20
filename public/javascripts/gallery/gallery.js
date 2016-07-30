
  app.controller('GalleryController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    function reloadTeam() {
      $http({
        method:'GET',
        url: '/teamdata'
      }).then(function successCallback(response) {
        $scope.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    $http.get('/gallerydata', {}).then(
      function success(response) {
        console.log(response);
        $scope.images = response.data;
      }, function error(response) {
        console.log(status);
      }
    );
  }]);