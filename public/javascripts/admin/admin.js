(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.admin", ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/admin', {
          templateUrl: './pages/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('AdminController', AdminController);

  function AdminController($http, $window, Upload) {
    var vm = this;

    function reloadTeam() {
      $http({
        method: 'POST',
        url: '/team/data'
      }).then(function successCallback(response) {
        vm.team = response.data;
      }, function errorCallback(response) {
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

    vm.editAdmin = function(user, makeAdmin) {
      $http({
        method: 'POST',
        url: '/team/editAdmin',
        data: {
          userId: user._id,
          admin: makeAdmin
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    vm.editPurchaser = function(user, makePurchaser) {
      $http({
        method: 'POST',
        url: '/team/editPurchaseManager',
        data: {
          userId: user._id,
          purchaseManager: makePurchaser
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    vm.removeUser = function(user) {
      $http({
        method:'POST',
        url: '/team/delete',
        data: {
          userId: user._id
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    vm.addDonor = function(donor) {
      $http({
        method:'POST',
        url: '/donor/new',
        data: {
          donorName: donor.name,
          donorImage: donor.image
        }
      }).then(function successCallback(response) {
        reloadDonors();
      }, function errorCallback(response) {
      });
    };

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

    vm.addGallery = function(galleryImage) {
      var file = galleryImage.image;
      file.upload = Upload.upload({
        url: '/upload/galleryimage',
        data: {title: galleryImage.title, description: galleryImage.description, image: file},
      });

      file.upload.then(function success(response) {
        // This will clear the form
        // TODO: Show success
        vm.newGalleryImage = {};
      }, function failure(response) {
        // TODO: Show a failure to the user
      });
    }

    $http.post('/auth/isAdmin', {}).then(
      function success(response) {
        reloadTeam();
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