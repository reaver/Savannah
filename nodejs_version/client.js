var socket;

$(document).ready(function(){
	var connectTo = 'http://'+location.host.substring(0,location.host.indexOf(':'));
	console.log('Connecting to ' + connectTo);
	socket = io.connect(connectTo);
});

function sendDataToServer(trigger, data){
	socket.emit(trigger, data);
}