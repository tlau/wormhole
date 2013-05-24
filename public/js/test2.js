function Test2Ctrl($scope) {
  $scope.mute = false;
  $scope.foo = 1;

  $scope.socket = io.connect('http://localhost:8080/');
  
  $scope.init = function() {
    console.log('in init');

    $scope.socket.on('connect', function() {
      $scope.socket.emit('id', {id: 'wg'});
    });

    $scope.socket.on('ready', function(params) {
      console.log('server ready', params);
    });

    $scope.socket.on('set mute', function(args) {
      // We have to insert this apply on all callbacks so that angular updates
      // its templates after the callback fires
      $scope.$apply(function() {
        $scope.updateMute.apply($scope.socket, [args]);
      });
    });
  };

  $scope.updateMute = function(params) {
      console.log('set mute', params['mute']);
      $scope.mute = params['mute'];
  };

  $('document').ready(function(){
    $scope.init();
  });
}


