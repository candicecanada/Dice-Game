// Chaoqun Ding
// Player 1: Me, Player 2: Opponent (Computer)
// public variables:
let myDice1_FrameHandler;
let myDice1_Timeout;

let myDice2_FrameHandler;
let myDice2_Timeout;

let opponentDice1_FrameHandler;
let opponentDice1_Timeout;

let opponentDice2_FrameHandler;
let opponentDice2_Timeout;

let maxDicePoint = 6;
let minDicePoint = 1;

let myDice1_Point;
let myDice2_Point;
let opponentDice1_Point;
let opponentDice2_Point;

let myCurrentScore = 0;
let myTotalScore = 0;
let opponentCurrentScore = 0;
let opponentTotalScore = 0;

let rollDiceDelay = 100;
// // let each dice roll at least 1 second
// let minClock = 1000;
// // let each dice roll at most 3 seconds
// let maxClock = 3000;
// let each dice roll 1.5 seconds
let clockDelay = 1500;
// total number of rolls
let rollCount = 0;
// if user doesn't click on any button in 2 seconds after the page loads:
const gameRulesTimeout = setTimeout(function(){
    // show game rules window
    $("#game-rules").css("display", "block");
    $("#game-rules-button").attr("disabled", true).addClass("not-allowed");
}, 2000);


// if user clicks "Close" button in game rules window:
$("#close-game-rules-button").on("click", function(){
    // hide game rules window
    $("#game-rules").css("display", "none");
    $("#game-rules-button").attr("disabled", false).removeClass("not-allowed");

})


// if user clicks "Close" button in game result window:
$("#close-game-result-button").on("click", function(){
    // hide game result window
    $("#game-result").css("display", "none");
})

// if user clicks "Game Rules" button:
$("#game-rules-button").on("click", function(){
    // clear timeout for initial game rules popup
    clearTimeout(gameRulesTimeout);
    // show game rules window immediately
    $("#game-rules").css("display", "block");
    $("#game-rules-button").attr("disabled", true).addClass("not-allowed");
})


// if user clicks "New Game" button:
$("#new-game-button").on("click", function(){
    // disable all current timeouts
    clearTimeout(gameRulesTimeout);
    clearTimeout(myDice1_Timeout);
    clearTimeout(myDice2_Timeout);
    clearTimeout(opponentDice1_Timeout);
    clearTimeout(opponentDice2_Timeout);
    // reset everything by refreshing the page
    location.reload();
})


// if user clicks "Roll Dice" button:
$("#roll-dice-button").on("click", function(){
    if(rollCount < 3){
        // if haven't rolled 3 times yet (start from 0), then roll dice
        clearAllTimeouts();
        startRoll();
        endRoll();
        // increase roll count by 1 after each roll
        rollCount++;
    }


})

function clearAllTimeouts(){
    // clear timeout for initial game rules popup
    clearTimeout(gameRulesTimeout);
    // clear previous roll dice timeout
    clearTimeout(myDice1_Timeout);
    clearTimeout(myDice2_Timeout);
    clearTimeout(opponentDice1_Timeout);
    clearTimeout(opponentDice2_Timeout);
}

function startRoll(){
    // player 1 roll dice 1:
    myDice1_Timeout = setTimeout(function(){
        myDice1_FrameHandler = requestAnimationFrame(function(){
            rollDice("player1", "dice1")
        })
    }, rollDiceDelay);

    // player 1 roll dice 2:
    myDice2_Timeout = setTimeout(function(){
        myDice2_FrameHandler = requestAnimationFrame(function(){
            rollDice("player1", "dice2")
        })
    }, rollDiceDelay);

    // player 2 roll dice 1:
    opponentDice1_Timeout = setTimeout(function(){
        opponentDice1_FrameHandler = requestAnimationFrame(function(){
            rollDice("player2", "dice1")
        })
    }, rollDiceDelay);

    // player 2 roll dice 2:
    opponentDice2_Timeout = setTimeout(function(){
        opponentDice2_FrameHandler = requestAnimationFrame(function(){
            rollDice("player2", "dice2")
        })
    }, rollDiceDelay);
}

function endRoll(){
    setTimeout(function(){
        clearTimeout(myDice1_Timeout)
        clearTimeout(myDice2_Timeout)
        clearTimeout(opponentDice1_Timeout)
        clearTimeout(opponentDice2_Timeout)
        cancelAnimationFrame(myDice1_FrameHandler)
        cancelAnimationFrame(myDice2_FrameHandler)
        cancelAnimationFrame(opponentDice1_FrameHandler)
        cancelAnimationFrame(opponentDice2_FrameHandler)
        // update scores after all dice points are out.
        updateScores();
        // if the roll count reach 3 times after this roll
        if(rollCount == 3){
            // process the content to show in game result window
            processGameResult();
            // fade in the game result window
            fadeInGameResult();
            // disable "Roll Dice" button:
            $("#roll-dice-button").attr("disabled", true).addClass("not-allowed");
        }
    }, clockDelay);
}


function updateScores(){
    // get current dice points:
    myDice1_Point = Number($("#player1-dice1 img").attr("alt").match(/\d+/)[0]);
    myDice2_Point = Number($("#player1-dice2 img").attr("alt").match(/\d+/)[0]);
    opponentDice1_Point = Number($("#player2-dice1 img").attr("alt").match(/\d+/)[0]);
    opponentDice2_Point = Number($("#player2-dice2 img").attr("alt").match(/\d+/)[0]);

    // if there contains a point 1, current score is 0
    if(myDice1_Point == 1 || myDice2_Point == 1){
        myCurrentScore = 0;
    }
    // if none of the dice points contain 1, and two dice points are the same
    else if(myDice1_Point == myDice2_Point){
        myCurrentScore = (myDice1_Point + myDice2_Point) * 2
    }
    // if none of the dice points contain 1 and two dice points are different
    else{
        myCurrentScore = myDice1_Point + myDice2_Point
    }


    // same rule applies to opponent dices:
    if(opponentDice1_Point == 1 || opponentDice2_Point == 1){
        opponentCurrentScore = 0;
    }
    else if(opponentDice1_Point == opponentDice2_Point){
        opponentCurrentScore = (opponentDice1_Point + opponentDice2_Point) * 2
    }
    else{
        opponentCurrentScore = opponentDice1_Point + opponentDice2_Point
    }

    // add current scores to total scores:
    myTotalScore += myCurrentScore;
    opponentTotalScore += opponentCurrentScore;

    // show scores on page:
    $("#player1-current-score").html(myCurrentScore)
    $("#player1-total-score").html(myTotalScore)
    $("#player2-current-score").html(opponentCurrentScore)
    $("#player2-total-score").html(opponentTotalScore)
    
}


function processGameResult(){
    if(myTotalScore == opponentTotalScore){
        $("#game-result h3").html(`It's a Tie.`)
        $("#game-result img").attr({"src": "../images/tie.gif", "alt": "tie"})
    }
    if(myTotalScore > opponentTotalScore){
        $("#game-result h3").html(`You Won`)
        $("#game-result img").attr({"src": "../images/win.gif", "alt": "win"})
    }
    if(myTotalScore < opponentTotalScore){
        $("#game-result h3").html(`You Lose`)
        $("#game-result img").attr({"src": "../images/lose.gif", "alt": "lose"})
    }
    $("#game-ratio").html(`${myTotalScore}:${opponentTotalScore}`)
}


function fadeInGameResult(){
    // show the game result window by change opacity from 0 to 1 and change z-index from -100 to 100
    $("#game-result").css({"z-index": 100, "opacity": 1, "transition": "opacity, 2s"})
}

function rollDice(player, dice){
    let currentPoint = Math.floor(Math.random() * (maxDicePoint - minDicePoint + 1) + minDicePoint)
    $(`#${player}-${dice} img`).attr({"src": `../images/dice${currentPoint}.png`, "alt": `Dice Point ${currentPoint}`});
    if(player=="player1" && dice=="dice1"){
        myDice1_Timeout = setTimeout(function(){
            myDice1_FrameHandler = requestAnimationFrame(function(){
                rollDice(player, dice)
            });
        }, rollDiceDelay)
    }
    if(player=="player1" && dice=="dice2"){
        myDice2_Timeout = setTimeout(function(){
            myDice2_FrameHandler = requestAnimationFrame(function(){
                rollDice(player, dice)
            });
        }, rollDiceDelay)
    }
    if(player=="player2" && dice=="dice1"){
        opponentDice1_Timeout = setTimeout(function(){
            opponentDice1_FrameHandler = requestAnimationFrame(function(){
                rollDice(player, dice)
            });
        }, rollDiceDelay)
    }
    if(player=="player2" && dice=="dice2"){
        opponentDice2_Timeout = setTimeout(function(){
            opponentDice2_FrameHandler = requestAnimationFrame(function(){
                rollDice(player, dice)
            });
        }, rollDiceDelay)
    }
}