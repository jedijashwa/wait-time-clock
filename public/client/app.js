var app = angular.module('app',[]);

app.controller("info-controller", function ($scope) {
  $scope.title = "Wait Time Clock Demo";
  $scope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope, $timeout, $http) {
  $scope.currentWait = {};
  $scope.alert = function (msg) {
    alert(msg);
  };
  
  var updateTime = function () {
    // gets current wait time from server
    $http.get('/api/wait').then(function (res) {
      // addes current wait time in ms to current time in ms
      $scope.currentWait.ms = parseInt(res.data);
      $scope.time = Date.now() + $scope.currentWait.ms;
      $scope.currentWait.h = Math.floor($scope.currentWait.ms / 3600000);
      $scope.currentWait.m = Math.floor(($scope.currentWait.ms % 3600000 ) / 60000);
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