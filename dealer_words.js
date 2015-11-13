$(document).ready(function(){

placeBetsScr = function(){
scriptVar = Math.floor(Math.random() * 4);
switch (scriptVar){
	case 0:
		outPutText("Please place your bets.");
		break;
	case 1:
		outPutText("Bets are now open.");
		break;
	case 2:
		outPutText("If you would like to change your bet, please do so now.");
		break;
	case 3:
		outPutText("You may now change your bet.");
		break;
	}
};

closeBetsScr = function(){
scriptVar = Math.floor(Math.random() * 3);
switch (scriptVar){
	case 0:
		outPutText("Betting is closed.");
		break;
	case 1:
		outPutText("No more bets.");
		break;
	case 2:
		outPutText("All bets are made.");
		break;
	}
};

dealerHitsScr = function(scoreVar){
scriptVar = Math.floor(Math.random() * 4);
switch (scriptVar){
	case 0:
		outPutText("Dealer hits, now showing " + scoreVar + ".");
		break;
	case 1:
		outPutText("Dealer now has " + scoreVar + ".");
		break;
	case 2:
		outPutText("Dealer shows " + scoreVar + ".");
		break;
	case 3:
		outPutText("Dealer's score is now " + scoreVar + ".");
		break;
	}
};

dealerBustsScr = function(){
	outPutText("Dealer busts.");
};

dealerShufflesScr = function(){
	outPutText("Dealer shuffles the cards.")
};

playerHitsScr = function(score){
	scriptVar = Math.floor(Math.random() * 4);
	workingScore = score;
	$("#testarea2").text("working 2");
	switch (scriptVar){
		case 0:
			outPutText("Now showing a score of " + workingScore + ".");
			break;
		case 1:
			outPutText("Player now has " + workingScore + ".");
			break;
		case 2:
			outPutText("Player now showing " + workingScore + ".");
			break;
		case 3:
			outPutText("Player's score is now " + workingScore + ".");
			break;
	}
};

playerBustsScr = function(){
	outPutText("Player busts.");
};

playerSplitsScr = function(){
	outPutText("Player splits.");
};

playerStandsScr = function(){
	outPutText("Player stands.");
};

playerDoublesScr = function(){
	outPutText("Player doubles down.");
};

playerBetsScr = function(moneyBet){
	outPutText("Player bets a total of " + moneyBet + ".");
};

playerSplitsBetScr = function(moneySplitBet, moneyTotalBet){
	outPutText("Player splits, new bet of " + moneySplitBet + " for a total bet of " + moneyTotalBet + ".");
};

outPutMoneyChangeScr = function(changeVar){                    //ChangeVar is total ammount bet, if positive the player leaves money on 
	if(changeVar < 0){                                         //the table and the house collects, if negative the player wins money
		playerWinsMoney(Math.abs(changeVar));                  //and the player collects that money
	}
	else if (changeVar > 0){
		playerLosesMoney(changeVar);
	}
	else{
		playerBreaksEven(changeVar);
	}
};

playerWinsIns = function(outputInsMoney){
	scriptVar = Math.floor(Math.random() * 3);
	realInsGain = outputInsMoney * 2;
	switch(scriptVar){
		case 0:
			outPutText("Insurance pays off, player wins " + realInsGain + ".")
			break;
		case 1:
			outPutText("Player wins " + realInsGain + " dollars on insurance.");
			break;
		case 2:
			outPutText("Player wins the insurance bet.");
			break;
	}
};

playerLossesIns = function(outputInsMoney){
	scriptVar = Math.floor(Math.random() * 3);
	switch(scriptVar){
		case 0:
			outPutText("Insurance doesn't pay off, player looses " + outputInsMoney + ".")
			break;
		case 1:
			outPutText("Player looses " + outputInsMoney + " dollars on insurance.");
			break;
		case 2:
			outPutText("Player looses the insurance bet.");
			break;
	}
};

playerWinsMoney = function(outputMoney){               
	scriptVar = Math.floor(Math.random() * 4);
	switch (scriptVar){
		case 0:
			outPutText("Player is up " + outputMoney + " for a total of " + playerMoney.playerStash + ".");
			break;
		case 1:
			outPutText("Player wins " + outputMoney + " for a total of " + playerMoney.playerStash + ".");
			break;
		case 2:
			outPutText("Player is ahead " + outputMoney + " for a total of " + playerMoney.playerStash + ".");
			break;
		case 3:
			outPutText("Player collects " + outputMoney + " for a total of " + playerMoney.playerStash + ".");
			break;
	}
};

playerBreaksEven = function(){               
	scriptVar = Math.floor(Math.random() * 3);
	switch (scriptVar){
		case 0:
			outPutText("Player breaks even. Players bank stays at " + playerMoney.playerStash + ".");
			break;
		case 1:
			outPutText("Nothing won, nothing lost.  Player still has " + playerMoney.playerStash + ".");
			break;
		case 2:
			outPutText("No change.  Players bank is still " + playerMoney.playerStash + ".");
			break;
	}
};

playerLosesMoney = function(outputMoney){
	outputMoney = Math.abs(outputMoney);
	scriptVar = Math.floor(Math.random() * 4);
	switch (scriptVar){
		case 0:
			outPutText("Player loses "  + outputMoney + " bringing the player bank to " + playerMoney.playerStash + ".");
			break;
		case 1:
			outPutText("House wins "  + outputMoney + " and player's bank drops to " + playerMoney.playerStash + ".");
			break;
		case 2:
			outPutText("Player drops "  + outputMoney + " .  Player's bank is now " + playerMoney.playerStash + ".");
			break;
		case 3:
			outPutText("House collects "  + outputMoney + ", player now has " + playerMoney.playerStash + ".");
			break;
	}
};

outCome = function(){
	if(playerBusts > 0){
		outComeWithBusts();
	}
	else{
		outComeNoBusts();
	}
};

outPutText = function(whatIsSaid){
	if(scriptVariables.numOfLines > 10){
		$("#linenumber" + scriptVariables.numOfRemovalLines).remove();
	}
	$("#rollingscript").append("<div id='linenumber" + scriptVariables.numOfLines + "'>" + whatIsSaid + "</div>");
	scriptVariables.numOfLines++;
	scriptVariables.numOfRemovalLines++;
	};




//----------------------------------------------------------------Button Area---------------------------------------------------------------------------------

$("#testbutton1").click(function(){
	$("#testarea1").text("working");
	playerWinsMoney();                                   //Changed depending on script being tested
});

$("#testbutton2").click(function(){
	playerBreaksEven();                                   //Changed depending on script being tested
});

$("#testbutton3").click(function(){
	playerLoosesMoney();                                   //Changed depending on script being tested
});

placeBetsScr();

});


