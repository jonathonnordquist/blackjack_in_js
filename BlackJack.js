(function(){  //Immediatly executing anonymous function intended to issolate this code from any external, unintended code.

$(document).ready(function(){

genDeck = function(numOfDecks){  //Creates deck(s)
	deck = [];
	for(h = 0; h < numOfDecks; h++){
		for(i = 0; i < 4; i++){
			for(j = 0; j < 13; j ++){
				deck.push([i, j]);
			}
		}	
	}
	return deck;
};

shuffleCards = function(n){  			//Randomizes deck(s) into a new array
    shuffledDeck = [];
    newDeck = genDeck(n);
    deckLength = newDeck.length;
    for(i = 0; i < deckLength; i++){
        count = Math.floor(Math.random() * newDeck.length);
        shuffledDeck.push(newDeck[count]);
        newDeck.splice(count, 1);
    }
    return shuffledDeck;
	
};

deckOfCards = function(k){
	numDeck = new shuffleCards(k);
	for(i = 0; i < numDeck.length; i++){
		if(numDeck[i][0] === 0){
			numDeck[i][0] = "spades";
		}
		if(numDeck[i][0] === 1){
			numDeck[i][0] = "hearts";
		}
		if(numDeck[i][0] === 2){
			numDeck[i][0] = "diamonds";
		}
		if(numDeck[i][0] === 3){
			numDeck[i][0] = "clubs";
		}
	}                                 
	return numDeck;
};

Hand = function(isSplit){  //Constructor for player and dealer hands
	this.cardsInHand = [];
	if(isSplit === false){
		this.cardsInHand.push(workingDeck.cardsInDeck[0], workingDeck.cardsInDeck[1]);
		workingDeck.cardsInDeck.shift();
		workingDeck.cardsInDeck.shift();
		};
};

Score = function(cards){  //Calculates each hands value, lowers by 10 if over 21 and aces present
	value = [];
	for(i = 0; i < cards.length; i++){
		value[i] = cards[i][1];
	}
	this.totalScore = 0;
	numOfAces = 0;
	for(j = 0; j < value.length; j++){
		if(value[j] === 0 || value[j] >= 10){
			totalScore += 10;
		}
		else if(value[j] > 1 && value[j] < 10){
			totalScore += value[j];
			}
		else if(value[j] === 1){
			totalScore += 11;
			numOfAces++;
		}
	}
	removeElevins = function(){
		while(totalScore > 21 && numOfAces > 0){
		totalScore -= 10;
		numOfAces -= 1;
		}
		return totalScore;
	}();
	return totalScore;
};

getScore = function(whichHand){    //Returns the current score for whatever hand it is fed
	y = whichHand;
	return Score(y.cardsInHand);
};

countDealerAces = function(){      //Keeps count of aces in case the dealer behavior function needs that information
	for(i = 0; i < dealerHand.cardsInHand.length; i++){
		if(dealerHand.cardsInHand[i][1] === 1){
			dealerCardCount.dealerAces++;
		};
	}
};

playerMoney = {                   //Holding object for player bets and related information
	playerStash: 100,
	playerBet: [],
	doubled: [],
	insuranceBet: 0,
	moneyCurrentGame: 0,
	allBet: false,
	numHandsBet: 0
};

scriptVariables = {               //Keeps track of the line count for the script screen
	numOfLines: 0,
	numOfRemovalLines: -11
};

handCount = {
	numOfDecks: 4,                 //Sets the total number of decks available to deal
	splitCount: 0,
	numDealt: 4,
	numOfHandsOrigDealt: 4,
	maxNumOfHands: 4,
	viewportWidth: 0,
	numOfSplitHands: 0,
	numOfHandsStand: 0,
	numOfSplitHandsStand: 0,
	testHitButtonCommand: true
};

dealerBehaviorVars = {              //Tells the dealer behavior function to hit or not on soft 17
	hitOnSeventeen: true
};

function setDealerCardVariables(){  //Resets all the dealer variables at the start of each hand
	this.numOfDealerCards = 0;
	this.dealerAces = 0;
	this.dealerCardHeight = 145;
	this.dealerCardLeft = 25;
};

setPlayerCardVariables = {          //Sets and holds all the variables for each player hand
	numOfCards: [],
	numOfSplitCard: [],
	handsDealt: [],
	cardToDisplay: [],
	cardHeight: [],
	cardLeft: [],
	splitCardHeight: [],
	splitCardLeft: [],
	cardsAccross: [],
	cardDown: [],
	splitCardAccross: [],
	splitCardDown: [],
	numCardsDealtOut: 0
 };

determineHandCount = function(){     //Determines how many hands to allow based on viewport size
	if($(window).width() <= 920){
		handCount.maxNumOfHands = 1;
	}
	else if($(window).width() >= 921 && $(window).width() <= 1370){
		handCount.maxNumOfHands = 2;
	}
	else if($(window).width() >= 1371 && $(window).width() <= 1820){
		handCount.maxNumOfHands = 3;
	}
	else if($(window).width() >= 1821 && $(window).width() <= 2275){
		handCount.maxNumOfHands = 4;
	}
	else{
		handCount.maxNumOfHands = 5;
	}     
};
 
createHandCountSelection = function(){               //Creates screen to allow player to determine number of hands to start with
	workingDeck.dealCards(handCount.numOfDecks);
	for(j = 0; j < handCount.numOfHandsOrigDealt; j++){
		$("#handcontainer" + j).remove();
	};
	determineHandCount();	
	$("#playarea").fadeTo(1000, .4);
	$("#ruleselectscreen").remove();
	$("#playersscorearea").html("");
	$("body").append("<div id='handcountselectscreen' class='questionscreen'><div id='firstwelcome' class='welcometext'><br /><span>Please select the number of hands you would like to begin play with:</span></div><div id='startinghandcountselector'></div>");
	for(i = 1; i <= handCount.maxNumOfHands; i++){
		$("#startinghandcountselector").append("<div class='howmanyhandsstart'><button type='button' name='handcounter' id='numhandstodeal" + i + "' value='" + i + "'>" + i + " hands</input></div>");
		createSetNumOfHandsToDeal(i);
	};
};

function createSetNumOfHandsToDeal(currentHandNum){        //Creates the hands based on players origional selection
	return $("#numhandstodeal" + currentHandNum).click(function(){
		handCount.numOfHandsOrigDealt = currentHandNum;
		$("#playersscorearea").html("");
		setZeroBet();
		for(j = 0; j < handCount.numOfHandsOrigDealt; j++){
			l = j + handCount.numOfHandsOrigDealt;
			dealHandOut(j, l);
		};
		handCount.testHitButtonCommand = true;
		goToTable();
		$("#deal").attr("disabled", "disabled");
	});
};

createWelcomeScreen = function(changeStash){               //Creates initial welcome screen, tells player about the game and sets up further play
	$("#playarea").fadeTo(1000, .4);
	$("#addhand, #minushand, #changerules").attr("disabled", "disabled");
	$("body").append("<div id='welcomescreen' class='questionscreen'><h2 class='welcometext'>Welcome to my blackjack game!</h2> <div><div id='blackjackinstructions' id='welcomescript'><p>This is my blackjack game.  It's the &quot;Whose Line Is It Anyway? &quot; of online games, everything is made up and the points don't matter<sup>*</sup>.  It's entirely browser based what you play here is powered by JavaScript and jQuery.  This is the result of a lot of effort and I hope you enjoy it.</p>  <p>To play simply select a table, then select a number of hands you would like to start with.  Once in the game you can make bets up to the total bankroll you have at the time, then proceeds.  If you want to make the bet recurring, check the box in the bet area.  You can add or remove hands between games, and you can change tables as well, but this will reset your bankroll.  To back to my webpage, you'll find a link in the table change screen. If you are new to blackjack you can get a great overview of the game on this <a href='http://en.wikipedia.org/wiki/Blackjack'>wikipedia page</a>.</p>  <div id='playbuttons'> <p>Ready to play?  Jump in! <input type='button' id='startgame' value='Start a new game'></button> </p>  <form action='work.html'> <span>Back to my webpage? <input type='submit' value='Home Page'> </span> </form> </div>  <div> <p id='welcomedisc'><sup>*</sup>For ammusement only.</p> </div>  </div> </div> </div>");
	$("#startgame").click(function(){
		createRuleSelection(changeStash);
	});
};

createRuleSelection = function(changeStash){               //Allows the player to determine which table, rules and stash they want
	$("#welcomescreen").remove();
	$("#playarea").fadeTo(1000, .4);
	$("#addhand, #minushand, #changerules").attr("disabled", "disabled");
	$("body").append("<div id='ruleselectscreen' class='questionscreen'><div id='secondwelcome' class='welcometext'><br /><span>Please select your table and bankroll:</span></div><div class='rulesselect'><button type='button' name='tableone' id='table1' class='rulesbutton'>Table One</button><p class='rulestext'>At this table the dealer will hit on a soft seventeen and there is only one deck.  You start with one hundred dollars.  The house has the smallest edge.</p></div><div class='rulesselect'><button type='button' name='tabletwo' id='table2' class='rulesbutton'>Table Two</button><p class='rulestext'>At this table the dealer will hit on a soft seventeen and there are four decks.  You start with five hundred dollars.  Slightly worse odds.</p></div><div class='rulesselect'><button type='button' name='tablethree' id='table3' class='rulesbutton'>Table Three</button><p class='rulestext'>At this table the dealer will stand on a soft seventeen and there are four decks.  You start with one thousand dollars.  Getting to high roller territory.</p></div><div class='rulesselect'><button type='button' name='tablefour' id='table4' class='rulesbutton'>Table Four</button><p class='rulestext'>At this table the dealer will stand on a soft seventeen and there are eight decks.  You start with five thousand dollars.  Strike out or strike it rich.</p><form action='work.html'><span><input type='submit' value='Home Page'>Return to website home page.</span></form></div>");
	
	$("#table1").click(function(){           		           //All remaining methods in this function set the table rules and variables
		dealerBehaviorVars.hitOnSeventeen = true;   
		handCount.numOfDecks = 1;
		if(changeStash === true){
			playerMoney.playerStash = 100;
		};
		$("#playerstash").text(playerMoney.playerStash);
		createHandCountSelection();
	});
	
	$("#table2").click(function(){
		dealerBehaviorVars.hitOnSeventeen = true;
		handCount.numOfDecks = 4;
		if(changeStash === true){
			playerMoney.playerStash = 500;
		};
		$("#playerstash").text(playerMoney.playerStash);
		createHandCountSelection();
	});
	
	$("#table3").click(function(){
		dealerBehaviorVars.hitOnSeventeen = false;
		handCount.numOfDecks = 4;
		if(changeStash === true){
			playerMoney.playerStash = 1000;
		};
		$("#playerstash").text(playerMoney.playerStash);
		createHandCountSelection();
	});
	
	$("#table4").click(function(){
		dealerBehaviorVars.hitOnSeventeen = false;
		handCount.numOfDecks = 8;
		if(changeStash === true){
			playerMoney.playerStash = 5000;
		};
		$("#playerstash").text(playerMoney.playerStash);
		createHandCountSelection();
	});
};

goToTable = function(){                               //Bails from the welcome screen and goes to table
	$("#playarea").fadeTo(500, 1);
	$("#handcountselectscreen").remove();
	$("#addhand, #minushand, #changerules").removeAttr("disabled", "disabled");
	createBetButtonCommand();
};

$("#changerules").click(function(){                   //Bails from table and goes to rule select
	createRuleSelection(true);
});

setStartingBid = function(whichHandToBet){            //Creates inital bets for all hands setup.
	playerMoney.playerBet[whichHandToBet] = [0, false];	
};

setZeroBet = function(){                              //Loops through hands and sets initial bets to zero to prevent previous bets carrying over when not needed.
	for(handsAutoBetting = 0; handsAutoBetting < handCount.numOfHandsOrigDealt; handsAutoBetting++){
		setStartingBid(handsAutoBetting);
	};
};

dealHandOut = function(start, split){                //Lays out the buttons and divs for each hand area, can be repeated for multiple hand areas.
	$("#playerarea").append("<div id='handcontainer" + start + "'></div>");
	$('#handcontainer' + start).html("<div class='betarea'><div class='betareabox'><div class='betholderbox' id='betholder" + start + "'><form><input type='text' id='bet" + start + "' class='betgoeshere'><button type='button' id='getbet" + start + "' class='canbet'>Place your bet</button>Your current bet: <span id='playersbet" + start + "'>" + playerMoney.playerBet[start][0] + " </span> dollars<div><label><input type='checkbox' id='makebetrecuringcheck" + start + "'>Make this bet recurring?</label></div></div><div id = 'playerhandcontainer" + start + "' class='initialcardsdealt'><div class='hand' id='playerhand" + start + "'></div><div class='playerbuttonsset'><div id='playerbuttonssetone" + start + "' class='buttonposition'><button type='button' id='hit" + start +"' disabled>Hit</button><button type='button' id='playerstand" + start + "' disabled>Stand</button></div><div id='playerbuttonssettwo" + start + "'><button type='button' id='ddown" + start + "' class='playerbutton' disabled>Double Down</button><button type='button' id='playersplits" + start +"' disabled>Split</button></div></div></div><div id='split"+ start +"' class='splithand'><div class='hand' id='playerhand" + split + "'>  	</div><div id='playersplitbuttons'><button type='button' id='hit" + split + "' disabled>Hit</button><button type='button' id='playerstand" + split + "' disabled>Stand</button></div></div>");
	$("#playersscorearea").append("<div class='groupofscores'><p class='scorearea'>Score Hand " + (start + 1) + ": <span id='playerscore" + start + "'></span></p><span id='splitscore" + split + "' class='hiddensplit'><p class='scorearea'>Hand " + (start + 1 ) + " Split Score:  <span id ='playerscore" + split + "'></span></div>");
	$("#split" + start).hide(0);
	setPlayerCardVariables.handsDealt[start] = 0;
};

playerBankrupt = function(){                        //Triggered when player stash reaches zero.  Game over man!
	$("#playarea").fadeTo(1000, .4);
	$("#deal, #addhand, #minushand, #changerules", ".canbet").attr("disabled", "disabled");
	$("body").append("<div id='bankruptselectscreen' class='questionscreen'>   <p class='welcometext'>You have gone bankrupt!</p> <div id='bankruptchoice'>  <div id='playerbankruptchoice'>  <p id='bankruptscript'>Would you like to:</p>  <div id='bankruptbuttons'> <input type='button' id='newgame' value='Start a new game'></button>  <form action='work.html'> <input type='submit' value='Return to Home Page'>  </form> </div>  </div> </div> </div>");
	$("#newgame").click(function(){
		$("#bankruptselectscreen").remove();
		createRuleSelection(true);
		setPlayerCardVariables.numCardsDealtOut = 0;
		setPlayerCardVariables.cardHeight = [];
		setPlayerCardVariables.cardDown = [];
		setPlayerCardVariables.numOfCards = [];
		setPlayerCardVariables.numOfSplitCard = [];
		setPlayerCardVariables.handsDealt = [];
		setPlayerCardVariables.cardToDisplay = [];
		setPlayerCardVariables.cardLeft = [];
		setPlayerCardVariables.splitCardHeight = [];
		setPlayerCardVariables.splitCardLeft = [];
		setPlayerCardVariables.cardsAccross = [];
		setPlayerCardVariables.splitCardAccross = [];
		setPlayerCardVariables.splitCardDown = [];
		handCount.numOfHandsStand = 0;
		handCount.numOfSplitHandsStand = 0;
		handCount.testHitButtonCommand = true;
		playerMoney.playerBet = [];
		playerMoney.doubled = [];
		playerMoney.insuranceBet = 0;
		playerMoney.moneyCurrentGame = 0;
		playerMoney.allBet = false;
		playerMoney.numHandsBet = 0;
		workingDeck.dealCards(handCount.numOfDecks);
	});	
};


createWelcomeScreen(true);                         //First function to trigger on loading of page.  Starts the whole thing off.

workingDeck = {                                    //Creates an initial deck of cards
	cardsInDeck: 0,
	dealCards: function(numOfDecks){
		return workingDeck.cardsInDeck = deckOfCards(numOfDecks);
	}
};

dealerBehavior = function(dealerScore){            //Run after all hands stand, executes all dealer actions for hit and stand
	dealerStand = false;
	countDealerAces();
	if(dealerCardCount.dealerAces === 2){
		dealerCardCount.dealerAces--;
	};
	putHitCard = function(){
		hit(dealerHand);
		dealerHitsScr(getScore(dealerHand));
		$("#dealershand").append('<div class="dealhand"></div>');
			$(".dealhand:eq("+dealerCardCount.numOfDealerCards+")").html('<img src ="cards/'+ dealerHand.cardsInHand[dealerCardCount.numOfDealerCards][0] + dealerHand.cardsInHand[dealerCardCount.numOfDealerCards][1] + ".svg.png" +'" />').css({"position": "relative", "bottom": dealerCardCount.dealerCardHeight +"px", "left": dealerCardCount.dealerCardLeft + "px"});
			dealerCardCount.numOfDealerCards++;
			dealerCardCount.dealerCardHeight += 145;
			dealerCardCount.dealerCardLeft += 25;
			dealerScore = getScore(dealerHand);
	};
	while(dealerStand === false){
		if(dealerScore < 17){
			putHitCard();		
		}
		else if(dealerScore === 17 && dealerCardCount.dealerAces > 0 && dealerBehaviorVars.hitOnSeventeen == true){
			putHitCard();
			dealerCardCount.dealerAces--;
			$("#acecheck").text(dealerCardCount.dealerAces);
		}
		else{
			dealerStand = true;
			$("#acecheck").text(dealerCardCount.dealerAces);
		}
	};
};

dealerDeal = function(){            	  //Initial deal of dealer cards, first card dealt is cardback hiding that cards value
	dealerHand = new Hand(false);
	$("#dealershand").append('<div class="dealhand"></div>');
	$(".dealhand:eq("+dealerCardCount.numOfDealerCards+")").html('<img class="firstcard" src="cards/cardback.jpg">');  //Change back to "dealerHand.cardsInHand[1]" when testing
	dealerCardCount.numOfDealerCards++;
	$("#dealershand").append('<div class="dealhand"></div>');
	setPlayerCardVariables.cardToDisplay = dealerHand.cardsInHand[1][0] + dealerHand.cardsInHand[1][1] + ".svg.png"
	$(".dealhand:eq("+dealerCardCount.numOfDealerCards+")").html('<img src ="cards/'+ dealerHand.cardsInHand[1][0] + dealerHand.cardsInHand[1][1] + ".svg.png" +'" />').css({"position": "relative", "bottom": dealerCardCount.dealerCardHeight +"px", "left": dealerCardCount.dealerCardLeft + "px"});
	dealerCardCount.dealerCardHeight += 145;
	dealerCardCount.dealerCardLeft += 25;
	dealerCardCount.numOfDealerCards++;
	$("#dealscore").text("Not available");
	setPlayerCardVariables.numCardsDealtOut += 2;
};

playerDeal = function(numToDealOut){	//Initial deal of player cards, runs through and deals all hands in sequence from the working deck
	for(z = 0; z < numToDealOut; z++){
		setPlayerCardVariables.numOfCards[z] = 0;
		setPlayerCardVariables.numOfSplitCard[z] = 0;
		setPlayerCardVariables.cardToDisplay[z] = "";
		setPlayerCardVariables.cardHeight[z] = 0;
		setPlayerCardVariables.cardLeft[z] = 0;
		setPlayerCardVariables.splitCardHeight[z] = 200;
		setPlayerCardVariables.splitCardLeft[z] = 35;
		setPlayerCardVariables.cardsAccross[z] = 0;
		setPlayerCardVariables.cardDown[z] = 0;
		setPlayerCardVariables.splitCardAccross[z] = 0;
		setPlayerCardVariables.splitCardDown[z] = 0;
		$("#playerhand" + z).append('<div class="playerhandcardposition"></div>');    //Heres part of the problem, this div is not being appended
		$("#playerhand" + z + " .playerhandcardposition:eq("+setPlayerCardVariables.numOfCards[z]+")").html('<img src ="cards/'+ setPlayerCardVariables.handsDealt[z].cardsInHand[0][0] + setPlayerCardVariables.handsDealt[z].cardsInHand[0][1] + ".svg.png" + '" />').css({"position": "relative", "bottom": setPlayerCardVariables.cardHeight[z] +"px", "left": setPlayerCardVariables.cardLeft[z] + "px"});
		setPlayerCardVariables.cardHeight[z] += 200;
		setPlayerCardVariables.cardLeft[z] += 35;
		setPlayerCardVariables.numOfCards[z]++;
		$("#playerhand" + z).append('<div class="playerhandcardposition"></div>');    //Here either
		$("#playerhand" + z + " .playerhandcardposition:eq("+setPlayerCardVariables.numOfCards[z]+")").html('<img src ="cards/'+ setPlayerCardVariables.handsDealt[z].cardsInHand[1][0] + setPlayerCardVariables.handsDealt[z].cardsInHand[1][1] + ".svg.png" + '" />').css({"position": "relative", "bottom": setPlayerCardVariables.cardHeight[z] +"px", "left": setPlayerCardVariables.cardLeft[z] + "px"});
		setPlayerCardVariables.numOfCards[z]++;
		setPlayerCardVariables.cardsAccross[z] += 2;
		setPlayerCardVariables.numCardsDealtOut += 2;
	};
};

$("#deal").click(function(){             				//Initial deal of cards, creates hands from deck, calculates scores and places visable cards on play area
	closeBetsScr();
	setPlayerCardVariables.handsDealt = [];
	dealerCardCount = new setDealerCardVariables();
	for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
		$("#playerhandcontainer" + i).animate({left: -30}, 0);               //Moves the hands dealt back into position.  Necessary if last hand involved a split.
		$("#split" + i).hide(0);
	};
	handCount.numOfHandsStand = 0;
	handCount.numDealt = handCount.numOfHandsOrigDealt;
	cleanUpDoubles();
	playerMoney.insuranceBet = 0;
	setInsDisplay();
	for(j = 0; j < handCount.numOfHandsOrigDealt; j++){						//Enables main buttons for each hand
		$("#hit" + j +", #playerstand" + j +", #ddown" + j ).removeAttr("disabled");
	};
	$(".canbet").attr("disabled", "disabled");
	for(k = 0; k < handCount.numOfHandsOrigDealt; k++){
		setPlayerCardVariables.handsDealt[k] = new Hand(false);
	};		
	for(l = 0; l < handCount.numOfHandsOrigDealt; l++){                     //Removes all playerhandcardposition divs to make room for new ones.  Keeps them from piling up.
		for(p = 0; p < 21; p++){
			$("#playerhand" + l + " .playerhandcardposition").remove();
			$(".dealhand:eq(" + l + ")").remove();
			m = l + handCount.numOfHandsOrigDealt;
			$("#winner" + l).text("");
			$("#winner" + m).text("");
		};
	};
	dealerDeal();
	playerDeal(handCount.numOfHandsOrigDealt);
	if(handCount.testHitButtonCommand === true){
		createButtonCommand(handCount.numDealt);   
		};
	handCount.testHitButtonCommand = false;
	if(dealerHand.cardsInHand[1][1] === 1){
		offerPlayerIns();
	};
	for(m = 0; m < handCount.numDealt; m++){
		$("#playerscore" + m).text(getScore(setPlayerCardVariables.handsDealt[m]));
	};
	for(m = 0; m < handCount.numDealt; m++){
		if(setPlayerCardVariables.handsDealt[m].cardsInHand[0][1] == setPlayerCardVariables.handsDealt[m].cardsInHand[1][1]){
			$("#playersplits" + m).removeAttr("disabled");
		};
	};
	$("#playersplit").text("");
	$("#split" + i).hide(0);
	$("#deal, #addhand, #minushand, #changerules").attr("disabled", "disabled");
	clearSplitScores();
});

enableDeal = function(){									//Enables deal button after a round is concluded.
	if(playerMoney.numHandsBet === handCount.numOfHandsOrigDealt){
		playerBetsScr(playerMoney.moneyCurrentGame);
		$("#deal").removeAttr("disabled", "disabled");
		playerMoney.allBet = true;
	};
};

createBetButtonCommand = function(){						//Enables bet buttons after a found is concluded.
	x = handCount.numOfHandsOrigDealt;
	for(i = 0; i < x; i++){
		createNewGetBet(i);
	}
};

setInsDisplay = function(){									//Sets the insurance display div to whatever the insurance value currently is.
	if(playerMoney.insuranceBet != 0){
		$("#showins").text(playerMoney.insuranceBet);
	}
	else{
		$("#showins").text(""); 
	}
};

checkIfToCollect = function(whichHand){						//After a hand is bet this checks to determine if the current bet is zero, if it is the bet is taken from the player money
	if(playerMoney.playerBet[whichHand][0] === 0){			//object.  If the current bet is not zero the bet is zeroed out and a new bet is taken.  Allows player to change a bet up 
		collectBet(whichHand);								//until play begins.
	}
	else{
		playerMoney.numHandsBet--;
		playerMoney.moneyCurrentGame -= playerMoney.playerBet[whichHand][0];
		playerMoney.playerStash += playerMoney.playerBet[whichHand][0];
		collectBet(whichHand);
	}
};

collectBet = function(whichHand){							//Processes a bet and displays the bet in the appropriate hand.
	moneyToRemove = playerMoney.playerBet[whichHand][0]
	playerMoney.playerBet[whichHand][0] = parseInt($("#bet" + whichHand).val());       
	$("#playersbet" + whichHand).text(playerMoney.playerBet[whichHand][0]);
	playerMoney.playerStash -= playerMoney.playerBet[whichHand][0];
	$("#playerstash").text(playerMoney.playerStash);
	playerMoney.numHandsBet++;
	playerMoney.moneyCurrentGame += playerMoney.playerBet[whichHand][0];
	enableDeal();
};

collectSplitBet = function(whichSplit, whichNew){			//Collects a bet for a split hand which is equal to the hand bet which is split.
	playerMoney.playerStash -= playerMoney.playerBet[whichSplit][0];
	playerMoney.moneyCurrentGame += playerMoney.playerBet[whichSplit][0];     
	playerMoney.playerBet[whichNew] = new Array;
	playerMoney.playerBet[whichNew][0] = playerMoney.playerBet[whichSplit][0];
	$("#playerstash").text(playerMoney.playerStash);
	playerSplitsBetScr(playerMoney.playerBet[whichNew][0], playerMoney.moneyCurrentGame);
};

function createNewGetBet(j){								//Creates a function for each hand which allows a bet to be taken.  These functions test the bets for validity (number > 
	return $("#getbet" + j).click(function(){				//0) and starts the process of taking the bet.
		var intRegex = /^\d+$/;
		if(intRegex.test($("#bet" + j).val()) == ""){}
		else if(intRegex.test($("#bet" + j).val()) && $("#bet" + j).val() <= playerMoney.playerBet[j][0] + playerMoney.playerStash){
			checkIfToCollect(j);
			if($('#makebetrecuringcheck' + j).is(":checked")){
				playerMoney.playerBet[j][1] = true;
			}
			else{
				playerMoney.playerBet[j][1] = false;
			}
		}
		else if(intRegex.test($("#bet" + j).val()) && $("#bet" + j).val() > playerMoney.playerStash){
			alert("You don't have enough to cover that bet.  Try a smaller amount.");
		}
		else{
			alert("Please enter a positive whole dollar value.");
		}
	});
};

clearNonRecuringBets = function(){							//If a bet is not set to reoccur by the player, this zeros and clears the bet prior to a new hand starting.
	for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
		playerMoney.numHandsBet--;
		if(playerMoney.playerBet[i][1] != true){
			playerMoney.playerBet[i][0] = 0;
		}
	}
	beginNextRoundBetting();
};

beginNextRoundBetting = function(){							//One all non recuring bets are cleared, this enables the betting for the next round.
	playerMoney.allBet = false;
	moneyCurentGameAfterRemoved = 0;
	for(k = 0; k < handCount.numOfHandsOrigDealt; k++){		//Generates a value for all recuring bets.
		if(playerMoney.playerBet[k][1] == true){
			moneyCurentGameAfterRemoved += playerMoney.playerBet[k][0];
		}
	}	
	if(moneyCurentGameAfterRemoved > playerMoney.playerStash){  //Checks if the value bet is greater then the players remaining bankroll.  Alerts if it is and clears all recuring 
		for(i = 0; i < handCount.numOfHandsOrigDealt; i++){		//bets.
			playerMoney.playerBet[i][1] = false;
			$('input').filter(':checkbox').prop('checked',false);
			playerMoney.playerBet[i][0] = 0;
		}
		alert("You don't have enough left to keep your recuring bets going, they have been reset.  Please make new bets.");	
	}
	else{														//Collects all recuring bets if players stash is enough.
		for(j = 0; j < handCount.numOfHandsOrigDealt; j++){
			if(playerMoney.playerBet[j][1] == true){
				collectBet(j);
			}
		};
	}
	for(k = 0; k < handCount.numOfHandsOrigDealt; k++){			//Displays the bet for each hand.
		$("#playersbet" + k).text(playerMoney.playerBet[k][0]);
	}
};

$("#addhand").click(function(){									//Assigns add hand command to the add hand button.
	alertHandCountChange("adding");
});

refundStash = function(betToRefund){							//Clears a players bet, returns the money to the stash and makes it non recuring.
	playerMoney.playerStash += playerMoney.playerBet[betToRefund][0];
	playerMoney.playerBet[betToRefund][0] = 0;
	playerMoney.playerBet[betToRefund][1] = false;
	$("#playerstash").text(playerMoney.playerStash);
};

increaseHandCount = function(){									//Creats a new hand area with associated functions, divs and buttons.  Does this by removing all hands,
	for(j = 0; j < handCount.numOfHandsOrigDealt; j++){			//sets all bets to zero then loops through for the new number of hands creating new hands.
		refundStash(j);
		$("#handcontainer" + j).remove();
	};
	playerMoney.moneyCurrentGame = 0;
	handCount.numOfHandsOrigDealt++;
	playerMoney.numHandsBet = 0;
	$("#playersscorearea").html("");
	setZeroBet();
	for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
		l = i + handCount.numOfHandsOrigDealt;
		dealHandOut(i, l);
	};
}

$("#minushand").click(function(){								//Assigns remove hand command to the remove hand button.
	alertHandCountChange("subtracting");
});

alertHandCountChange = function(plusOrMinus){					//Prevents adding or removing a hand if there is a current game in progress
	if(setPlayerCardVariables.handsDealt[0] != 0){
		alert("The hands dealt must be played before hands can be added or removed.");
	}
	else{
		changeHandNumber(plusOrMinus);
		$("#dealershand, #dealscore").html("");
	}
};

changeHandNumber = function(addingOrNot){						//conditional which determines if hand is added or removed.  If added, it checks to see that the table is big
	if(addingOrNot === "adding"){								//enough and adds if appropriate.  If not big enough, it displays a message.  If the parameter is to remove
		setStartingBid(handCount.numOfHandsOrigDealt);			//a hand the hand is simply removed.  If the player only has one hand left, it alerts that the number of 
		handCount.viewportWidth = $(window).width();			//hands can not bet less then one.
		determineHandCount();
		if(handCount.numOfHandsOrigDealt <= 5){
			if(handCount.maxNumOfHands > handCount.numOfHandsOrigDealt){
				increaseHandCount();
				handCount.testHitButtonCommand = true;
				outPutText("Player adds a hand.");
				$("#showins").text("");
			}
			else{
			outPutText("The table's not big enough for more hands.");
			}
		}
		else{
			outPutText("The table's not big enough for more hands.");
		}
	}
	else{
		if(handCount.numOfHandsOrigDealt > 1){
			for(j = 0; j < handCount.numOfHandsOrigDealt; j++){
				$("#handcontainer" + j).remove();
				refundStash(j);
			};
			playerMoney.playerBet.pop();
			playerMoney.numHandsBet = 0;
			handCount.numOfHandsOrigDealt--;
			$("#playersscorearea").html("");
			setZeroBet();
			for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
				l = i + handCount.numOfHandsOrigDealt;
				dealHandOut(i, l);
			};
			playerMoney.moneyCurrentGame = 0;
			handCount.testHitButtonCommand = true;
			outPutText("Player removes a hand.");
			$("#showins").text("");

		}
		else{
			outPutText("You cannot have fewer then one hand");
		}
	}
	createBetButtonCommand();
};

function createInsCommands(){								//Takes player insurance if user elects to, then regardless of player choice clears the insurance offer and 
	$("#noins").click(function(){							//goes to the table.
		$("#playarea").fadeTo(500, 1);
		$("#insuranceoffer").remove();
		for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
			$("#hit" + i + ", #playerstand" + i  + ", #ddown" + i).removeAttr("disabled", "disabled");
		};
	});
	$("#yesins").click(function(){
		getInsBet();
		$("#playarea").fadeTo(500, 1);
		$("#insuranceoffer").remove();
		for(j = 0; j < handCount.numOfHandsOrigDealt; j++){
			$("#hit" + j + ", #playerstand" + j  + ", #ddown" + j).removeAttr("disabled", "disabled");
		};
		$("#showins").text(playerMoney.insuranceBet);
	});
};

function getInsBet(){										//Processes the insurance bet, sets the insurance and stash variables appropriatly.
	playerMoney.insuranceBet = $("#insamount").val();
	playerMoney.insuranceBet = parseInt(playerMoney.insuranceBet, 10);
};

offerPlayerIns = function(){								//creates a questionscreen div which gives the player an explination of insurance, and allows the player to place
	$("#playarea").fadeTo(1000, .4);						//an insurance bet.
	for(y = 0; y < handCount.numOfHandsOrigDealt; y++){
		$("#hit" + y + ", #playerstand" + y  + ", #ddown" + y + ", #playersplits" + y).attr("disabled", "disabled");
	};
	$("body").append("<div id='insuranceoffer' class='questionscreen'><div id='insuranceoffertext'>Dealer is showing an Ace.  Would you like to buy insurance?</div> <div id='nothanksarea'><button type='button' id='noins'>No Thanks</button> </div> <div id='yesinsarea'> <button type='button' id='yesins'>Yes, for this ammount</button> </div> <div id='insamountarea'> <input type='text' id='insamount'> </div> <div id='insinfo'>Taking insurance is a side bet that the dealer has a blackjack (a 21 on two cards.) If the dealer does you win twice the value of the insurance.  If not you loose the insurance wager.</div> </div>");
	createInsCommands();	
};

hit = function(whichHand){  								//Adds a new card to the hand which is set by the function parameter.  Removes that card from the top of the deck.
	y = whichHand;
	y.cardsInHand.push(workingDeck.cardsInDeck[0]);
	workingDeck.cardsInDeck.shift();
	setPlayerCardVariables.numCardsDealtOut++;
};

playerHits = function(whichDeck){							//Processes player htis.  Runs a hit on the player hand, displays the card based on the card variables and gets the 
	x = whichDeck;											//score.  If the player busts, will run the appropriate functions, otherwise allows play to continue.
	g = setPlayerCardVariables.numOfCards[x];
	$("#playerhand" + x).append('<div class="playerhandcardposition"></div>');
	hit(setPlayerCardVariables.handsDealt[x]);
	g = setPlayerCardVariables.numOfCards[x];
	setPlayerCardVariables.cardHeight[x] += 200;
	setPlayerCardVariables.cardLeft[x] += 35;
	$("#playerhand" + x + " .playerhandcardposition:eq("+setPlayerCardVariables.numOfCards[x]+")").html('<img src ="cards/'+ setPlayerCardVariables.handsDealt[x].cardsInHand[setPlayerCardVariables.numOfCards[x]][0] + setPlayerCardVariables.handsDealt[x].cardsInHand[setPlayerCardVariables.numOfCards[x]][1] + ".svg.png" + '" />').css({"position": "relative", "bottom": setPlayerCardVariables.cardHeight[x] - setPlayerCardVariables.cardDown[x] + "px", "left": setPlayerCardVariables.cardLeft[x] + "px"});
	setPlayerCardVariables.numOfCards[x]++;
	setPlayerCardVariables.cardsAccross[x]++;
	$("#playerscore" + x).text(getScore(setPlayerCardVariables.handsDealt[x]));
	if(setPlayerCardVariables.cardsAccross[x] === 5){		//This counts the number of cards dealt to the hand, if it is greater then five a new diagonal of cards
		setPlayerCardVariables.cardDown[x] += 10;			//is started.  Helps the display to look nicer.
		setPlayerCardVariables.cardLeft[x] = 5;
		setPlayerCardVariables.cardsAccross[x] = 0;
		setPlayerCardVariables.cardHeight[x] -= 300;
	};
	if(getScore(setPlayerCardVariables.handsDealt[x]) > 21){						//This checks for busts.  If there is a bust the score is taken as if the player had stood
		if(playerMoney.doubled[x] == undefined || playerMoney.doubled[x] == false){	//and the results are output.
			handCount.numOfHandsStand++;
		};
		playerBustsScr();
		determineWinnerByHand(getScore(setPlayerCardVariables.handsDealt[x]), getScore(dealerHand), x);
		$("#hit" + x + ", #playerstand" + x + ", #ddown" + x + ", #playersplits" + x).attr("disabled", "disabled");
		bustHandScore = getScore(setPlayerCardVariables.handsDealt[x]); //This allows the score to be taken and fed to stand while allowing the array element to be set to null
		setPlayerCardVariables.handsDealt[x] = null;					//With the player hand set to null it's fed up to the score function.  The score function says "this isn't 
		stand(bustHandScore, getScore(dealerHand), x);      			//anything," sets the output score to 0 and it stays that way causing the output to be a player loss.
	};
	getScore(setPlayerCardVariables.handsDealt[x]);
	playerHitsScr(getScore(setPlayerCardVariables.handsDealt[x]));
};

playerStands = function(whichHand){							//Runs a command to stand on the hand defined by the parameter.  Disables the appropriate buttons, gets the score and 
	playerStandsScr();										//feeds it to the stand function.
	x = whichHand;
	$("#hit" + x + ", #playerstand" + x + ", #ddown" + x + ", #playersplits" + x).attr("disabled", "disabled");
	handCount.numOfHandsStand++;
	stand(getScore(setPlayerCardVariables.handsDealt[x]), getScore(dealerHand), x);
};

stand = function(playerScore, dealerScore, whichHand){		//After a hand is stood, this takes the score from that hand and checks to see if all hands dealt are stood. 
	a = playerScore;										//If they are it runs the dealer script to complete the dealer behavior, and then determines the winner(s.)
	b = dealerScore;
	c = whichHand;
	totalHands = handCount.numDealt;
	totalHandsStand = handCount.numOfHandsStand;
	if(totalHands === totalHandsStand){
		$(".dealhand:eq(0)").html('<img src ="cards/'+ dealerHand.cardsInHand[0][0] + dealerHand.cardsInHand[0][1] + ".svg.png" +'" />');   //Shows dealer hole card
		dealerBehavior(getScore(dealerHand));
		$("#dealscore").text(getScore(dealerHand));
		determineWinner();
	}
};

createButtonCommand = function(numOfButtons){				//Runs a loop through all hands the player wants to use.  Creates the appropriate hit, stand, double and split
	x = numOfButtons;										//functions with the proper closures for the buttons for each hand.
	for(i = 0; i < x; i++){
			createNewHitCommand(i);	
			createNewStandCommand(i);
			createDoubleDownCommand(i);
			createSplitCommand(i);
			j = i + handCount.numOfHandsOrigDealt;
			createNewhit(j);
			createNewplayerstand(j);
	};
};

function createNewHitCommand(i){							//Creates a hit function for the hit button for each hand dealt.
	//i = i;
	return $("#hit" + i).click(function(){		
		$("#ddown" + i + ", #playersplits" + i).attr("disabled", "disabled");
		playerHits(i);
		});
};

function createNewStandCommand(i){							//Creates a stand function for the stand button for each hand dealt.
	//i = i;
	return $("#playerstand" + i).click(function(){
		playerStands(i);		
	});
};

createDoubleDownCommand = function(i){						//Creates a double down function for the double down button for each hand dealt.
	//i = i;
	return $("#ddown" + i).click(function(){
		playerDoublesScr();
		ddown(i);
	});
};

function createSplitCommand(i){								//Creates a split function for the split button for each hand dealt.
	//i = i;
	return $("#playersplits" + i).click(function(){
		playerSplitsScr();
		handCount.splitCount++;
		playerSplits(i);
	});
};

playerSplits = function(handToSplit){							//Runs the split on each hand.  Animates the first hand, moves it left.  Then takes the second card from the dealt 
	x = handToSplit;											//hand, makes it the first card of the split hand.  Runs a hit on both the dealt and split hands, unhides the split 
	$("#playerhandcontainer" + x).animate({left: -130}, 2000);	//div, displays the cards for both hands, enables the split buttons, sets new bet for the split hand and displays 
	$("#split" + x).fadeIn("2000");								//that bet.
	$("#ddown" + x + ", #playersplits" + x).attr("disabled", "disabled");
	workingSplitHand = handToSplit + handCount.numOfHandsOrigDealt;
	collectSplitBet(handToSplit, workingSplitHand);
	$("#playerhand" + workingSplitHand).append('<div class="playerhandcardposition"></div>');
	setPlayerCardVariables.handsDealt[workingSplitHand] = new Hand(true);
	setPlayerCardVariables.handsDealt[workingSplitHand].cardsInHand[0] = setPlayerCardVariables.handsDealt[handToSplit].cardsInHand[1];	
	setPlayerCardVariables.handsDealt[handToSplit].cardsInHand.pop();
	setPlayerCardVariables.numOfCards[handToSplit] = 1;
	setPlayerCardVariables.cardHeight[handToSplit] -= 200;
	setPlayerCardVariables.cardLeft[handToSplit] -= 35;
	setPlayerCardVariables.cardsAccross[handToSplit] -= 1;
	playerHits(handToSplit);
	setPlayerCardVariables.numOfCards[workingSplitHand] = 0;
	$("#split" + x + " .playerhandcardposition:eq("+setPlayerCardVariables.numOfCards[workingSplitHand]+")").html('<img src ="cards/'+ setPlayerCardVariables.handsDealt[workingSplitHand].cardsInHand[0][0] + setPlayerCardVariables.handsDealt[workingSplitHand].cardsInHand[0][1] + ".svg.png" + '" />');
	setPlayerCardVariables.numOfCards[workingSplitHand] = 1;
	setPlayerCardVariables.splitCardAccross[workingSplitHand] = 1;
	setPlayerCardVariables.cardHeight[workingSplitHand] = 0;
	setPlayerCardVariables.cardLeft[workingSplitHand] = 0;
	setPlayerCardVariables.cardDown[workingSplitHand] = 0;
	setPlayerCardVariables.cardsAccross[workingSplitHand] = 1;
	playerHits(workingSplitHand);
	$("#playerscore" + workingSplitHand).text(getScore(setPlayerCardVariables.handsDealt[workingSplitHand]));
	handCount.numDealt++;
	$("#splitscore" + workingSplitHand).removeClass("hiddensplit");
	$("#hit" + workingSplitHand + ", #playerstand" + workingSplitHand).removeAttr("disabled");
};

ddown = function(whichDeck){								//Runs the doubleBet function, takes one hit and then stands that hand.
	x = whichDeck;
		$("#hit" + x + ", #playerstand" + x + ", #ddown" + x + ", #playersplits" + x).attr("disabled", "disabled");
		playerMoney.doubled[x] = true;
		doubleBet(x);
		handCount.numOfHandsStand++;
		playerHits(x);
		stand(getScore(setPlayerCardVariables.handsDealt[x]), getScore(dealerHand), x);	
};

clearSplitScores = function(){								//Clears split hand bets at the end of a game.  Keeps the bets from piling up.
	for(i = 0; i < handCount.numOfHandsOrigDealt; i++){
		splitScoreToRemove = i + handCount.numOfHandsOrigDealt;
		$("#splitscore" + splitScoreToRemove).addClass("hiddensplit");
	};
};

doubleBet = function(whichHand){							//Doubles the players bet
	y = whichHand;
	playerMoney.playerBet[y][0] = playerMoney.playerBet[y][0] * 2;
	
};

cleanUpDoubles = function(){								//Clears doubled bets at the end of a game.  Keeps the bets from piling up.
	for(i = 0; i < handCount.numDealt; i++){
		if(playerMoney.doubled[i] === true){
			playerMoney.doubled[i] = false;
				playerMoney.playerBet[i][0] = playerMoney.playerBet[i][0] / 2;
		};
	};
};

$("#playersplits").click(function(){						//Initiates the split process, disables double down and split buttons for the selected hand.
	$("#ddown, #playersplits").attr("disabled", "disabled");
	playerSplits(0);
});

function createNewhit(k){									//Creates a new hit function and closure for the hand defined by the parameter.  Useful for creating hit commands 
	//k = k;				
	return $("#hit" + k).click(function(){					//for split hands.
		playerHits(k);
	});
};

function createNewplayerstand(k){							//Creates a new stand function and closure for the hand defined by the parameter.  Useful for creating stand commands 
	//k = k;
	return $("#playerstand" + k).click(function(){			//for split hands.
		playerStands(k);
	});
}

determineWinner = function(){								//Run after all hands are stood and the dealer behavior runs.  Fisrt settles insurance, then if the dealer butsts displays
	if(playerMoney.insuranceBet != 0){						//the bust script.  Sets a variable for the total amount of money the player had prior to the betting starting.  Loops 
		settleIns();										//through, ignoring any busted hands and runs the determineWinner function to get the results of all hands not yet 
	};														//settled.  The change in the player stash is output, bankrupcy is checked for and if the player can still continue,
	if(getScore(dealerHand) > 21){							//betting for the next game is enabled.
		dealerBustsScr();
	};
	var oldStash = playerMoney.playerStash + playerMoney.moneyCurrentGame;
	for(w = 0; w < handCount.numOfHandsOrigDealt * 2; w++){
		if(setPlayerCardVariables.handsDealt[w] != null){            //Causes final scoring to ignore null hands, only scores hands which have not busted
			determineWinnerByHand(getScore(setPlayerCardVariables.handsDealt[w]), getScore(dealerHand), w);
			$("#playersbet" + w).text(playerMoney.playerBet[w][0]);
		};
	};
	outPutMoneyChangeScr(oldStash - playerMoney.playerStash);
	if(playerMoney.playerStash === 0){
		playerBankrupt();
	}
	else{
		totalCardCount = (handCount.numOfDecks * 52) / 2;
		if(setPlayerCardVariables.numCardsDealtOut >= totalCardCount){		//Checks the total number of cards dealt, shuffles if the cards are more then 50% gone.
			setPlayerCardVariables.numCardsDealtOut = 0;
			workingDeck.dealCards(handCount.numOfDecks);
			dealerShufflesScr();
		};
		placeBetsScr();																	//Alerts the player betting is open.
		setPlayerCardVariables.handsDealt[0] = 0;										//Resets the number of hands dealt variables.
		$("#addhand, #minushand, #changerules").removeAttr("disabled", "disabled");		//Allows the hand number or table to be changed between games.
		$("#deal").attr("disabled", "disabled");										//Ensures deal is disabled until all bets are placed.
		for(i = handCount.numOfHandsOrigDealt; i < handCount.numDealt * 2; i++){		//Ensures all player bets greater then the number of hands dealt are cleared.  Prevents
			playerMoney.playerBet[i] = [0, false];										//bets for split hands becoming recuring.
		};
		playerMoney.moneyCurrentGame = 0;												//Resets the total bet to zero.
		clearNonRecuringBets();															//Clears all non recuring bets.
	};
};

settleIns = function(){																	//Runs the insurance bet if any, changes the necessary variables and outputs the changes.
	if(getScore(dealerHand) === 21 && dealerCardCount.numOfDealerCards === 2){
		playerMoney.playerStash += playerMoney.insuranceBet * 2;
		playerWinsIns(playerMoney.insuranceBet);
	}
	else{
		playerMoney.playerStash -= playerMoney.insuranceBet;
		playerLossesIns(playerMoney.insuranceBet);
	}
};
determineWinnerByHand = function(playersScore, dealersScore, whichHand){  //Compares scores between player and dealer hands, determines and displays result
	if(playersScore > 21){
		$("#playerstash").text(playerMoney.playerStash);
	}
	else if(playersScore <= 21 && dealersScore > 21){
		playerMoney.playerStash = playerMoney.playerStash + (playerMoney.playerBet[whichHand][0] * 2);
		$("#playerstash").text(playerMoney.playerStash);
		playerMoney.moneyCurrentGame -= (playerMoney.playerBet[whichHand][0] * 2);
	}
	else if(playersScore <= 21 && playersScore === dealersScore){
		playerMoney.playerStash = playerMoney.playerStash + playerMoney.playerBet[whichHand][0];
		$("#playerstash").text(playerMoney.playerStash);
		playerMoney.moneyCurrentGame -= playerMoney.playerBet[whichHand];
	}
	else if(playersScore <= 21 && playersScore < dealersScore){
		$("#playerstash").text(playerMoney.playerStash);
	}
	else{
		playerMoney.playerStash = playerMoney.playerStash + (playerMoney.playerBet[whichHand][0] * 2);
		$("#playerstash").text(playerMoney.playerStash);
		playerMoney.moneyCurrentGame -= (playerMoney.playerBet[whichHand][0] * 2);
	}
	for(i = 0; i < handCount.numDealt; i++){
		$("#getbet" + i).removeAttr("disabled");
	};
};
	

});

}())  //Close of immediatly executing anonymous function.

//Jonathon Nordquist 2013
//
//This is a document
//To prove that I was here





