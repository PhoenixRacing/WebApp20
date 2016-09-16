(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.admin", ['ngRoute'])
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

  function AdminController($http, $window) {
    var vm = this;

    function reloadTeam() {
      $http({
        method: 'POST',
        url: '/team/data'
      }).then(function successCallback(response) {
        vm.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    function reloadDonors() {
      $http({
        method: 'POST',
        url: '/donor/data'
      }).then(function successCallback(response) {
        vm.donors = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    vm.editAdmin = function(user, makeAdmin) {
      console.log(user);
      $http({
        method: 'POST',
        url: '/team/editAdmin',
        data: {
          userId: user._id,
          makeAdmin: makeAdmin
        }
      }).then(function successCallback(response) {
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
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
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
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
        console.log(response);
        reloadDonors();
      }, function errorCallback(response) {
        console.log(response);
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
        console.log(response);
      });
    };

    vm.addGallery = function(galleryImage) {
      $http({
        method: 'POST',
        url: '/upload/galleryimage',
        data: {
          title: galleryImage.title,
          description: galleryImage.description,
          image: galleryImage.image
        }
      }).then(function success(response) {
        console.log(response);
      }, function failure(response) {
        console.log(response);
      });
    }

    $http.get('/auth/isAdmin', {}).then(
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