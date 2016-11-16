angular.module('olinbaja.error.factory', [], function($provide) {
    $provide.factory('errorBus', ['$rootScope', function($rootScope) {
        // Solution found here: https://gist.github.com/turtlemonvh/10686980/038e8b023f32b98325363513bf2a7245470eaf80
        var errorBus = {};
        errorBus.emitError = function(errorMessage) {
            $rootScope.$emit('error', {'error': errorMessage});
        };
        errorBus.onError = function(func, scope) {
            var unbind = $rootScope.$on('error', func);
            scope.$on('$destroy', unbind);
        };
        return errorBus;
    }]);
});
