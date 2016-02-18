var app = angular.module('app',[
  'auth0', 
  'angular-storage', 
  'angular-jwt', 
  'ngRoute'
])

// Auth0 setup start
.config(function (authProvider) {
  authProvider.init({
    domain: 'riesenable.auth0.com',
    clientID: '3y4I7YR2w0tbSitWGGA5aedYF8Apx4ts'
  });
})
.config(function (authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function(auth) {
  // This hooks al auth events to check everything as soon as the app starts
  auth.hookEvents();
})
.run(function($rootScope, auth, store, jwtHelper, $location) {
  // This events gets triggered on refresh or URL change
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page or use the refresh token to get a new idToken
        $location.path('/');
      }
    }
  });
  
});
// end of Auth0 set up

app.controller("info-controller", function ($rootScope) {
  $rootScope.title = "Wait Time Clock Demo";
  $rootScope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope, $timeout, $http, auth, $element) {
  $scope.currentWait = {};
  $scope.updateWait = function () {
    if ($scope.newWait.ms() !== $scope.currentWait.ms) {
      $http.post('/api/update', {"newWait" : $scope.newWait.ms()})
      .then(function (res) {
      });
    }
    $scope.edit = false;
  };
  
  $scope.$parent.editWait = function (field) {
    if (auth.isAuthenticated) {
      $scope.edit = field;
      setTimeout(function () {
        $('#new' + field).focus();
      }, 100);
    } else {
      $scope.login(field);
    }
  };
  
  var updateTime = function () {
    $scope.$parent.isAuthenticated = auth.isAuthenticated;

    // gets current wait time from server
    $http.get('/api/wait').then(function (res) {
      // addes current wait time in ms to current time in ms
      $scope.currentWait.ms = parseInt(res.data);
      $scope.time = Date.now() + $scope.currentWait.ms;
      $scope.currentWait.h = Math.floor($scope.currentWait.ms / 3600000);
      $scope.currentWait.m = Math.floor(($scope.currentWait.ms % 3600000 ) / 60000);
      
      if(!$scope.edit) {
        $scope.newWait.reset();
      }
      // repeats every second
      $timeout(updateTime, 1000);
    });
  };
  
  $scope.newWait = {
    h: 0,
    m: 0,
    ms: function () {
      return this.h * 3600000 + this.m * 60000;
    },
    reset: function () {
      this.h = $scope.currentWait.h;
      this.m = $scope.currentWait.m;
    }
  };
  
  updateTime();
});

// activates sidebar on mobile
$(document).ready(function () {
  $(".button-collapse").sideNav();
});