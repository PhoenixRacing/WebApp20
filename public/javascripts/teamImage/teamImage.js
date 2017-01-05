(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.profileimage", [
    'ngFileUpload',
    'angular-img-cropper',
    'olinbaja.utils'
  ])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/uploadProfile', {
          templateUrl: './pages/uploadProfile.html',
          controller: 'TeamImageController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('TeamImageController', TeamImageController);

  function TeamImageController($http, $window, Upload, utils) {
    var vm = this;

    vm.cropper = {};
    vm.cropper.sourceImage = null;
    vm.cropper.croppedImage   = null;
    vm.bounds = {};

    vm.addProfileImage = function(image) {
      var blob = utils.dataURItoBlob(image);
      var file = utils.blobToImageFile(blob);

      file.upload = Upload.upload({
        url: '/upload/profileimage',
        data: {image: file},
      });

      file.upload.then(function success(response) {
        $window.location = "/profile";
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