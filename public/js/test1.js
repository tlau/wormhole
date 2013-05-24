function Test1Ctrl($scope) {
  $scope.my_mute = false;
  $scope.their_mute = true;
  
  $scope.socket = null;

  $scope.init = function() {
    console.log('in init');
    $scope.socket = io.connect('http://localhost:8080');

    $scope.socket.on('connect', function() {
      $scope.socket.emit('id', {id: 'ar'});
    });

    $scope.socket.on('message', function(msg) {
      console.log('client received message:', msg);
    });

    $scope.socket.on('ready', function(params) {
      console.log('server ready', params);
      $scope.socket.emit('set mute', { mute: $scope.their_mute });
    });
  };

  $scope.toggleMyMute = function() {
    console.log('Toggling mute');
    $scope.my_mute = !$scope.my_mute;
  };

  $scope.toggleTheirMute = function() {
    console.log('Toggling their mute');
    $scope.their_mute = !$scope.their_mute;

    $scope.socket.emit('set mute', { mute: $scope.their_mute });
  };

  $('document').ready(function(){
    $scope.init();
  });
}


