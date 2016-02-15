var app = angular.module('app',[]);

app.controller("info-controller", function ($scope) {
  $scope.title = "Wait Time Clock Demo";
  $scope.location = "riesenable.io";
});

app.controller("clock-controller", function ($scope) {
  var updateTime = function () {
    $scope.time = new Date();
    console.log("updated");
    setTimeout(updateTime, 1000);
  };
  
  updateTime();
});