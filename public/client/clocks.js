app.controller("clocks-controller", function ($scope, $rootScope, $timeout, $http, auth, $element) {
  $rootScope.location = 'Please select a clock below.';
  $rootScope.name = 'Wait Clock';
  
  var getLocations = function () {
    $scope.$parent.isAuthenticated = auth.isAuthenticated;

    // gets current wait time from server
    $http.get('/api/locations/').then(function (res) {
      // addes current wait time in ms to current time in ms
      $scope.locations = res.data;
      $scope.locations.forEach(function (location) {
        $http.get('/api/clocks/?location_id='+location.id)
        .then(function(res) {
          location.clocks = res.data;
        });
      });
    });
  };
  
  $scope.expand = function (location) {
    if ($scope.expanded === location) {
      $scope.expanded = false;
    } else {
      $scope.expanded = location;
    }
  }
  
  getLocations();
  
  $(document).ready(function(){
    $('body').find('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
        
});