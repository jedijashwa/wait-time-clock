var app = angular.module('app',[]);

app.controller("info-controller", function ($scope) {
  $scope.title = "Wait Time Clock Demo";
  $scope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope, $timeout, $http) {
  $scope.currentWait = {};
  $scope.updateWait = function () {
    if ($scope.newWait.ms() !== $scope.currentWait.ms) {
      $http.post('/api/wait', {"newWait" : $scope.newWait.ms()})
      .then(function (res) {
      });
    }
    $scope.edit = false;
  };
  
  $scope.editWait = function (field) {
    $scope.edit = field;
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
      // $scope.newWait.reset();
      // repeats every second
      $timeout(updateTime, 1000);
    });
  };
  
  $scope.newWait = {
    h: 0,
    m: 0,
    ms: function () {
      return (this.h * 60 + this.m) * 60 * 1000;
    },
    reset: function () {
      this.h = $scope.currentWait.h;
      this.m = $scope.currentWait.m;
    }
  };
  
  updateTime();
});