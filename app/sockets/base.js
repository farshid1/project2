module.exports = function (io) {
  'use strict';
  io.sockets.on('connection', function (socket) {
	console.log('connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
};

