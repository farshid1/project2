angular.module('mySocket', []).factory('mySocket', function(socketFactory) {
	//console.log('in sevice');
	// var myIoSocket = io.connect('/socket.io/socket.io.js');

	// mySocket = socketFactory({
	// 	ioSocket: myIoSocket
	// });

	//   return mySocket;
  	return socketFactory();
});