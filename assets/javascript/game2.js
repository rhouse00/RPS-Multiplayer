
var config = {
	apiKey: "AIzaSyC367V7U2FIJX8zKZKdgk3gUnfDDKDvwHY",
	authDomain: "rps2-50a08.firebaseapp.com",
	databaseURL: "https://rps2-50a08.firebaseio.com",
	storageBucket: "rps2-50a08.appspot.com",
	messagingSenderId: "729342918278"
};

firebase.initializeApp(config);
var database = firebase.database();

var p1Name;
var p2Name;
var p1Ready = false;
var p2Ready = false;
var p1_Wins = 0;
var p2_Wins = 0;
var p1_Loses = 0;
var p2_Loses = 0;
var p1_Choice;
var p2_Choice;
var p1_hasChoosen = false;
var p2_hasChoosen = false;
var nextGame;

function showBtns() {
	$(".p1_btn").show();
	$(".p2_btn").show();
	$("#outcomeMessage").html("Next Game");
}
function intervalClearing (){
	clearInterval(nextGame);
	nextGame = undefined;
}

function gameWinner () {
	switch(p1_Choice == "rock") {
		case p2_Choice == "paper":
			$("#outcomeMessage").html(p2Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
			break;

		case p2_Choice == "scissors":
			$("#outcomeMessage").html(p1Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
			break;

		case p2_Choice == p1_Choice:
			$("#outcomeMessage").html("Tie!");
			break;
	}
	switch(p1_Choice == "scissors") {
		case p2_Choice == "paper":
			$("#outcomeMessage").html(p1Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
			break;

		case p2_Choice == "rock":
			$("#outcomeMessage").html(p2Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
			break;

		case p2_Choice == p1_Choice:
			$("#outcomeMessage").html("Tie!");
			break;
	}
	switch(p1_Choice == "paper") {
		case p2_Choice == "rock":
			$("#outcomeMessage").html(p1Name + " Wins!");
			p1_Wins++;
			p2_Loses++;
			break;

		case p2_Choice == "scissors":
			$("#outcomeMessage").html(p2Name + " Wins!");
			p2_Wins++;
			p1_Loses++;
			break;

		case p2_Choice == p1_Choice:
			$("#outcomeMessage").html("Tie!");
			break;
	}
	p1_hasChoosen = false;
	p2_hasChoosen = false;

	database.ref("/players/firstPlayer").update({
		wins: p1_Wins,
 		loses: p1_Loses,
 		choice: null,
 		choosen: false
	})
	database.ref("/players/secondPlayer").update({
		wins: p2_Wins,
 		loses: p2_Loses,
 		choice: null,
 		choosen: false
	})
	$("#p1_winsNum").html(p1_Wins);
	$("#p2_winsNum").html(p2_Wins);
	$("#p1_losesNum").html(p1_Loses);
	$("#p2_losesNum").html(p2_Loses);
	nextGame = setInterval(showBtns, 5000);
}

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(snap) {
	// If they are connected..
	if( snap.val() ) {
		// Add user to the connections list.
		var con = connectionsRef.push(true);
		// Remove user from the connection list when they disconnect.
		con.onDisconnect().remove();
	};
});


$(document).ready(function(){
	$(".choices").hide();
	$(".W_L_record").hide();
	$(".reset").hide();

		// How to get a piece of info
	database.ref("/players").on("value", function (snapshot){
		if (snapshot.child("firstPlayer/name").exists() && snapshot.child("secondPlayer/name").exists()) {
			
			p1Name = snapshot.child("firstPlayer/name").val();
	    	$("#nameWaiting_p1").html(p1Name);
	    	
	    	p2Name = snapshot.child("secondPlayer/name").val();
	    	$("#nameWaiting_p2").html(p2Name);

	    	$(".nameForm").hide();
		  	$(".choices").show();
		  	$(".W_L_record").show();

    	}
    	else {
    		$("#nameSubmitBtn").on("click", function(){
		  		if(p1Ready == false) {
				  	p1Name = $("#nameInput").val().trim();
				  	$("#nameWaiting_p1").html(p1Name);
				  	p1Ready = true;
				  	database.ref("/players/firstPlayer").update({
				 		name: p1Name,
				 		ready: p1Ready,
				 		wins: p1_Wins,
				 		loses: p1_Loses,
				 		choice: null,
				 		choosen: false
			 		});
			 		$("#nameInput").val(" ");
				 }
	 			else if (p1Ready == true && p2Ready == false) {
					p2Name = $("#nameInput").val().trim();
					$("#nameWaiting_p2").html(p2Name);
				  	p2Ready = true;
				  	database.ref("/players/secondPlayer").update({
				 		name: p2Name,
				 		ready: p2Ready,
				 		wins: p2_Wins,
				 		loses: p2_Loses,
				 		choice: null,
				 		choosen: false
				 	})
				 	$("#nameInput").val(" ");
				 	$(".nameForm").hide();
				  	$(".choices").show();
				  	$(".W_L_record").show();
				  };
			  	return false;
			 });
		}
		}, function (errorObject) {
  			console.log("The read failed: " + errorObject.code);
	});

	database.ref("/players").on("child_added", function(snapshot){
		$(".p1_btn").on("click", function(){
			p1_Choice = $(this).val();
			p1_hasChoosen = true;
			database.ref("/players/firstPlayer").update({
				choice: p1_Choice,
				choosen: p1_hasChoosen
			})
			$(".p1_btn").hide();
			intervalClearing();
			if(p2_hasChoosen){
				gameWinner();
			}
		});

		$(".p2_btn").on("click", function(){
			p2_Choice = $(this).val();
			p2_hasChoosen = true;	
			database.ref("/players/secondPlayer").update({
				choice: p2_Choice,
				choosen: p2_hasChoosen
			})
			$(".p2_btn").hide();
			intervalClearing();
			if(p1_hasChoosen){
				gameWinner();
			}
		});
	})

});

