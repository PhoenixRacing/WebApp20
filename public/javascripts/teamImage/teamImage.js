(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.profileimage", ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/uploadProfile', {
          templateUrl: './pages/uploadProfile.html',
          controller: 'teamImageController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('TeamImageController', TeamImageController);

  function TeamImageController($http, $window, Upload) {
    var vm = this;

    vm.addTeamImage = function(teamImage) {
      var file = teamImage.image;
      file.upload = Upload.upload({
        url: '/upload/profileimage',
        data: {image: file},
      });

      file.upload.then(function success(response) {
        // This will clear the form
        // TODO: Show success
        vm.newTeamImage = {};
      }, function failure(response) {
        // TODO: Show a failure to the user
      });
    }

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
      }, function error(response) {
        $window.location = "/login?next=/uploadProfile";     
      }
    );
  }
})();