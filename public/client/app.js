var app = angular.module('app',[]);

app.controller("info-controller", function ($scope) {
  $scope.title = "Wait Time Clock Demo";
  $scope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope, $timeout) {
  
  var updateTime = function () {
    $scope.time = Date.now() + $scope.wait.ms();
    console.log("Current time: ", $scope.wait);
    $timeout(updateTime, 100);
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