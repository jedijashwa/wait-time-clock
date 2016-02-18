var app = angular.module('app',[
  'auth0', 
  'angular-storage', 
  'angular-jwt', 
  'ngRoute'
])
// routing
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'client/clocks.html'
    })
    .when('/clocks/', {
      templateUrl : 'client/clocks.html'
    })
    .when('/clock/:clock_id', {
      templateUrl : 'client/clock.html'
    });
})

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

// activates sidebar on mobile
$(document).ready(function () {
  $(".button-collapse").sideNav();
});