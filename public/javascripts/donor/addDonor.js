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
    vm.donor = {};
    vm.donor.donorType = "family";

    vm.cropper = {};
    vm.cropper.sourceImage = null;
    vm.cropper.croppedImage   = null;
    vm.bounds = {};
    vm.donorName = '';

    vm.addDonor = function(image) {
      errorBus.clearErrors();
      if (!vm.donor.donorName || vm.donor.donorName == '') {
        return errorBus.emitError('Please enter a donor name.');
      }
      if (!image) {
        return errorBus.emitError('Please upload an image.');
      }

      var blob = utils.dataURItoBlob(image);
      var file = utils.blobToImageFile(blob);

      console.log(vm.donor.donorType);
      var isCorporate = false;
      if (vm.donor.donorType == "corporate") {
        isCorporate = true;
      }
      console.log(isCorporate);

      file.upload = Upload.upload({
        url: '/donor/new',
        data: {donorName: vm.donor.donorName, isCorporate: isCorporate, image: file},
      });

      file.upload.then(function success(response) {
        // This will clear the form
        $window.location.reload();
      }, function failure(response) {
        // TODO: Show a failure to the user
      });
    }

    vm.addDonorWithoutImage = function(donor) {
      var isCorporate = false;
      if (donor.donorType == "corporate") {
        isCorporate = true;
      }

      $http({
        method:'POST',
        url: '/donor/newNoImage',
        data: {
          donorName: donor.donorName,
          isCorporate: isCorporate
        }
      }).then(function successCallback(response) {
        reloadDonors();
      }, function errorCallback(response) {
      });
    }

    function reloadDonors() {
      $http({
        method: 'POST',
        url: '/donor/data'
      }).then(function successCallback(response) {
        vm.donors = response.data.corporateDonors.concat(response.data.familyDonors);
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
