var app = angular.module('app',[]);

app.controller("info-controller", function ($scope) {
  $scope.title = "Wait Time Clock Demo";
  $scope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope, $timeout, $http) {
  
  var updateTime = function () {
    // gets current wait time from server
    $http.get('/api/wait').then(function (res) {
      // addes current wait time in ms to current time in ms
      $scope.time = Date.now() + parseInt(res.data);
      console.log("Current time:", res.data);
      
      // repeats every second
      $timeout(updateTime, 1000);
    });
  };
  
  $scope.wait = {
    hours: 0,
    minutes: 0,
    ms: function () {
      return (this.hours * 60 + this.minutes) * 60 * 1000;
    }
  };
  
  updateTime();
});