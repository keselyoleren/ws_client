function WebSocketClient() {
	
	var ws = null;
	var connected = false;

	var serverUrl, connectionStatus, sendMessage;
	var connectButton, disconnectButton, sendButton;

	

	var open = function() {
		try {
			ws = new WebSocket(serverUrl.val());
			ws.onopen = onOpen;
			ws.onclose = onClose;
			ws.onmessage = onMessage;
			ws.onerror = onError;

			connectionStatus.text('OPENING ...');
			serverUrl.attr('disabled', 'disabled');
			connectButton.hide();
			disconnectButton.show();
		} catch (error) {
			connectionStatus.text('Websocket url not valid');
			connectionStatus.css('color', 'red');
		
		}
	};

	var close = function() {
		if (ws) ws.close();
		connected = false;
		connectionStatus.text('CLOSED');
		connectionStatus.css('color', 'red');
		serverUrl.removeAttr('disabled');
		connectButton.show();
		disconnectButton.hide();
		sendMessage.attr('disabled', 'disabled');
		sendButton.attr('disabled', 'disabled');
	};

	var clearLog = function() {
		$('#messages').html('');
	};

	var onOpen = function() {
		connectionStatus.text('OPENED');
		connectionStatus.css('color', 'green');
		sendMessage.removeAttr('disabled');
		sendButton.removeAttr('disabled');
	};

	var onClose = function() {
		ws = null;
	};

	var onMessage = function(event) {
		addMessage(event.data);
	};

	var onError = function(event) {
		connectionStatus.text(event.data);
	};

	var addMessage = function(data, type) {
		var msg = $('<pre>').text(data);
		if (type === 'SENT') msg.addClass('sent');
		$('#messages').append(msg);

		var msgBox = $('#messages').get(0);
		while (msgBox.childNodes.length > 1000) {
			msgBox.removeChild(msgBox.firstChild);
		}
		msgBox.scrollTop = msgBox.scrollHeight;
	};

	this.init = function() {
		serverUrl = $('#serverUrl');
		connectionStatus = $('#connectionStatus');
		sendMessage = $('#sendMessage');

		connectButton = $('#connectButton');
		disconnectButton = $('#disconnectButton');
		sendButton = $('#sendButton');

		connectButton.click(function() {
			close();
			open();
		});

		disconnectButton.click(close);
		sendButton.click(function() {
			addMessage(sendMessage.val(), 'SENT');
			ws.send(sendMessage.val());
		});

		disconnectButton.hide()

		$('#clearMessage').click(clearLog);

		var isCtrl;
		sendMessage.keyup(function(e) {
			if (e.which == 17) isCtrl = false;
		}).keydown(function(e) {
			if (e.which == 17) isCtrl = true;
			if (e.which == 13 && isCtrl) {
				sendButton.click();
				return false;
			}
		});
	};
}

$(function() {
	new WebSocketClient().init();
});
