// JS user module 
var user={	
	username: "",
	init: function(){ // init & set eventListeners
		var errMsg = document.getElementById("err-msg");
		errMsg.style.display = "none";
		var userBtn = document.getElementById("getUserBtn");
		var self=this;
		userBtn.addEventListener("click",function(){
			var userInput = document.getElementById("username");
			if(userInput.value == "") 
				return;
			else{
				self.username = userInput.value;
				socket.emit("joinserver", userInput.value, "desktop");
			}
		});
	},
	success: function(){ // user joined
		console.log("user joined");
		var popUp = document.getElementById("popup");
		popUp.style.display = "none";
	},
	error: function(err){ // in case username already exists
		var errMsg = document.getElementById("err-msg");
		var str = err.msg+" The proposed name is "+err.proposedName;
		errMsg.innerHTML = str;
		errMsg.style.display = "block";
	}
};

// JS chat room module
var chatRoom = {
	init: function(){ 
		var chatRoomBtn = document.getElementById("chatRoomBtn");
		chatRoomBtn.addEventListener("click",function(){
			var chatRoomName = document.getElementById("chatRoomName");
			if(chatRoomName.value){
				console.log("create chat room "+chatRoomName.value);
				socket.emit("createRoom",chatRoomName.value);
			}
		});
	},
	populate: function(list){ // populate chat room list
		var listElem = document.getElementById("roomList");
		if(list.count){
			for(var k in list.rooms){
				var liElem = document.createElement("li");
				liElem.innerHTML = list.rooms[k].name;
				listElem.appendChild(liElem);
			}
		}
	}
};


// All socket server event listners
function socketListeners(){
	socket.on('joined',function(){
		user.success();
	});
	socket.on('exists',function(err){
		user.error(err);
	});
	socket.on('roomList',function(roomlist){
		chatRoom.populate(roomlist);
	});
}

var socket; // global socket 
window.onload = function(){
	socket = io.connect("http://127.0.0.1:3000"); //init socket & listeners
	socketListeners();
	user.init();
	chatRoom.init();
}
