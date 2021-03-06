angular.module('app').controller('LoginCtrl', ['$scope', '$rootScope', '$http', 'auth', 'store', '$location',
function ($scope, $rootScope, $http, auth, store, $location) {
  $scope.login = function (field) {
    auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $rootScope.isAuthenticated = auth.isAuthenticated;
      if (field) {
        $scope.editWait(field);
      }
    }, function () {
      // Error callback
    });
  };
  
  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $scope.edit = false;
    $rootScope.isAuthenticated = auth.isAuthenticated;
  };
}]);

