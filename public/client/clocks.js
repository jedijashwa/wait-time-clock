app.controller("clocks-controller", function ($scope, $timeout, $http, auth, $element) {
  
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
  
  getLocations();
});