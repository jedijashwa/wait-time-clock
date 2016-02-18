app.controller("clock-controller", function ($scope, $rootScope, $timeout, $http, auth, $element, $location) {
  var clockID = $location.path().substr(7);
  $scope.currentWait = {};
  
  $http.get('/api/clock/?clock_id=' + clockID).then(function (res) {
    $rootScope.location = res.data[0].location;
    $rootScope.name = res.data[0].name;
  });
  
  $scope.updateWait = function () {
    if ($scope.newWait.ms() !== $scope.currentWait.ms) {
      $http.post('/api/update/?clock_id=' + clockID, {"newWait" : $scope.newWait.ms()})
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
    // gets current wait time from server
    $http.get('/api/wait/?clock_id='+clockID).then(function (res) {
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