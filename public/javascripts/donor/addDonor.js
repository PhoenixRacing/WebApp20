(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.donor.add", [
    'ngFileUpload',
    'angular-img-cropper'
  ])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/addDonor', {
          templateUrl : './pages/addDonor.html',
          controller: 'AddDonorController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('AddDonorController', AddDonorController);

  function AddDonorController($http, $window, Upload, utils, errorBus) {
    var vm = this;

    vm.donors = [];

    vm.cropper = {};
    vm.cropper.sourceImage = null;
    vm.cropper.croppedImage   = null;
    vm.bounds = {};
    vm.donorName = '';

    vm.addDonor = function(image) {
      errorBus.clearErrors();
      if (!vm.donorName || vm.donorName == '') {
        return errorBus.emitError('Please enter a donor name.');
      }
      if (!image) {
        return errorBus.emitError('Please upload an image.');
      }

      var blob = utils.dataURItoBlob(image);
      var file = utils.blobToImageFile(blob);

      file.upload = Upload.upload({
        url: '/donor/new',
        data: {donorName: vm.donorName, image: file},
      });

      file.upload.then(function success(response) {
        // This will clear the form
        $window.location.reload();
      }, function failure(response) {
        // TODO: Show a failure to the user
      });
    }

    function reloadDonors() {
      $http({
        method: 'POST',
        url: '/donor/data'
      }).then(function successCallback(response) {
        vm.donors = response.data;
      }, function errorCallback(response) {
      });
    }

    vm.removeDonor = function(donorId) {
      $http({
        method:'POST',
        url: '/donor/delete',
        data: {
          donorId: donorId
        }
      }).then(function successCallback(response) {
        reloadDonors();
      }, function errorCallback(response) {
      });
    };

    $http.post('/auth/isAdmin', {}).then(
      function success(response) {
        reloadDonors();
      }, function error(response) {
        if (response.status == 401) {
          $window.location = "/";
        } else {
          $window.location = "/login?next=/admin";
        }
      }
    );
  }
})();
