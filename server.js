extends Node

var socket := WebSocketPeer.new()

const SERVER_URL = "wss://extreme-online-server.onrender.com"

@onready var player = get_parent().get_node("Player")

func _ready():
	print("Connecting to server...")

	var err = socket.connect_to_url(SERVER_URL)

	if err != OK:
		print("Connection failed:", err)
	else:
		print("Connection request sent")


func _process(_delta):

	socket.poll()

	if socket.get_ready_state() == WebSocketPeer.STATE_OPEN:

		var data = {
			"type": "move",
			"x": player.global_position.x,
			"y": player.global_position.y,
			"z": player.global_position.z
		}

		socket.send_text(JSON.stringify(data))

		if Engine.get_process_frames() % 60 == 0:
			print("Sent Position:", player.global_position)

		while socket.get_available_packet_count():

			var message = socket.get_packet().get_string_from_utf8()

			print("Received:", message)
