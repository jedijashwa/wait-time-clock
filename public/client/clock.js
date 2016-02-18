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