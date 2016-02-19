app.controller("clocks-controller", function ($scope, $rootScope, $timeout, $http, auth, $element) {
  $rootScope.location = 'Please select a clock below.';
  $rootScope.name = 'Wait Clock';
  
  var getLocations = function () {
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
    if (location === undefined) {
      $scope.expanded = false;
    } else {
      if ($scope.expanded === location) {
        $scope.expanded = false;
      } else {
        $scope.expanded = location;
      }
    }
  };
  
  $scope.createOrg = function () {
    // send API request for creating location
    // promise with returned location createClock
    $scope.createClock(location.id);
  };
  
  $scope.createClock = function (locationID) {
    // sned API request for creating clock
    
    getLocations();
  };
  
  getLocations();
  
  $(document).ready(function(){
    $('body').find('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
        
});