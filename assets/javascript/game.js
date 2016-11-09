
var config = {
	apiKey: "AIzaSyC367V7U2FIJX8zKZKdgk3gUnfDDKDvwHY",
	authDomain: "rps2-50a08.firebaseapp.com",
	databaseURL: "https://rps2-50a08.firebaseio.com",
	storageBucket: "rps2-50a08.appspot.com",
	messagingSenderId: "729342918278"
};

firebase.initializeApp(config);
var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
// connectedRef.on("value", function(snap) {
// 	if( snap.val() ) {
// 		var con = connectionsRef.push(true);
// 		con.onDisconnect().remove();
// 	};
// });
connectionsRef.on("value", function(snapshot) {
	

	if (snapshot.child("player1").exists() && snapshot.child("player2").exists()) {
		$("#outcomeMessage").html(snap.numChildren());
	}
	else {
		console.log("first timers!");
	}
});



  var p1Ready = false;
  var p2Ready = false;
  var p1_Name;
  var p2_Name;
  var p1_Choice;
  var p2_Choice;
  var p1_hasChoosen = false;
  var p2_hasChoosen = false;
  var p1_Wins = 0;
  var p1_Loses = 0;
  var p2_Wins = 0;
  var p2_Loses = 0

  function gameWinner() {
		if(p1_Choice == "rock" && p2_Choice == "paper") {
			$("#outcomeMessage").html(p2_Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
		}
		else if(p1_Choice == "rock" && p2_Choice == "scissors") {
			$("#outcomeMessage").html(p1_Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
		}
		else if(p1_Choice == "paper" && p2_Choice == "rock") {
			$("#outcomeMessage").html(p1_Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
		}
		else if(p1_Choice == "paper" && p2_Choice == "scissors") {
			$("#outcomeMessage").html(p2_Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
		}
		else if(p1_Choice == "scissors" && p2_Choice == "rock") {
			$("#outcomeMessage").html(p1_Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
		}
		else if(p1_Choice == "scissors" && p2_Choice == "paper") {
			$("#outcomeMessage").html(p2_Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
		}
		else if(p1_Choice == p2_Choice) {
			$("#outcomeMessage").html("Tie!");
		}
		$("#p1_winsNum").html(p1_Wins);
		$("#p2_winsNum").html(p2_Wins);
		$("#p1_losesNum").html(p1_Loses);
		$("#p2_losesNum").html(p2_Loses);

		resetGame();

	};

function resetGame(){

}




$(document).ready(function(){
	$(".choices").hide();
	$(".W_L_record").hide();
	$(".reset").hide();


	$("#nameSubmitBtn").on("click", function(){
	  	if(p1Ready == false) {
		  	p1_Name = $("#nameInput").val().trim();
		  	database.ref("/connections").push({
		 		player1: p1_Name
		 	})

		 	$("#nameWaiting_p1").html(p1_Name);
		  	$("#nameInput").val(" ");
		  	p1Ready = true;
		}

		else if (p1Ready == true && p2Ready == false) {
			p2_Name = $("#nameInput").val().trim();
		  	database.ref("/connections").push({
		 		player2: p2_Name
		 	})

		 	$("#nameWaiting_p2").html(p2_Name);
		  	p2Ready = true;
		  	$(".nameForm").hide();
		  	$(".choices").show();
		  	$(".W_L_record").show();
		}
		return false;
	});


	$(".p1_btn").on("click", function(){
		p1_Choice = $(this).val();
		console.log(p1_Choice);
		$(".p1_btn").hide();
		p1_hasChoosen = true;
		if(p2_hasChoosen){
			gameWinner();
		}
	});

	$(".p2_btn").on("click", function(){
		p2_Choice = $(this).val();
		console.log(p1_Choice);
		$(".p2_btn").hide();
		p2_hasChoosen = true;
		if(p1_hasChoosen){
			gameWinner();
		}
	});
	
});

