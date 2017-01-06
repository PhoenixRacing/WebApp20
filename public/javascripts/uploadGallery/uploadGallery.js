(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.galleryimage", [
    'ngFileUpload',
    'angular-img-cropper'
  ])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/uploadGallery', {
          templateUrl: './pages/uploadGallery.html',
          controller: 'UploadGalleryController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('UploadGalleryController', UploadGalleryController);

  function UploadGalleryController($http, $window, Upload, utils, errorBus) {
    var vm = this;

    vm.cropper = {};
    vm.cropper.sourceImage = null;
    vm.cropper.croppedImage   = null;
    vm.bounds = {};
    vm.title = '';
    vm.description = '';

    vm.addGalleryImage = function(image) {
      errorBus.clearErrors();
      if (!vm.title || vm.title == '') {
        return errorBus.emitError('Please enter a title.');
      }
      if (!vm.description || vm.description == '') {
        return errorBus.emitError('Please enter a description.');
      }
      if (!image) {
        return errorBus.emitError('Please upload an image.');
      }

      var blob = utils.dataURItoBlob(image);
      var file = utils.blobToImageFile(blob);

      file.upload = Upload.upload({
        url: '/upload/galleryimage',
        data: {title: vm.title, description: vm.description, image: file},
      });

      file.upload.then(function success(response) {
        // This will clear the form
        $window.location.reload();
      }, function failure(response) {
        // TODO: Show a failure to the user
      });
    }

    $http.post('/auth/isAdmin', {}).then(
      function success(response) {
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