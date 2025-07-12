const Gameboard = (function () 
    {
        let gameArray = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
        const pushX = function (index) {if (gameArray[index] === ' ') {gameArray.splice(index,1,'X')}}
        const pushO = function (index) {if (gameArray[index] === ' ') {gameArray.splice(index,1,'O')}}
        const reset = function () {gameArray = [' ',' ',' ',' ',' ',' ',' ',' ',' ']} 
        const consoleDisplay = function () {console.log('\n',gameArray.slice(0,3),'\n',gameArray.slice(3,6),'\n',gameArray.slice(6))}
        const compareArray = function (arr1,arr2) 
            {   return arr1.every(function(ele,index){return ele === arr2[index]})  }
        const checkXO = function (para) 
            {
                if (para === 0) {return 'X';}
                else if (para === 1) {return 'O'}
                else {console.log("function checkXO() error")}
            }
        const scanBoard = function () 
            {
                let allX = ['X','X','X']
                let allO = ['O','O','O']

                let x1 = gameArray.slice(0,3)
                let x2 = gameArray.slice(3,6)
                let x3 = gameArray.slice(6)

                let y1 = []
                let y2 = []
                let y3 = []

                let oneFiveNine = []
                let sevenFiveThree = []

                for (let i=0; i<9; i += 3) 
                    {
                        y1.push(gameArray[i])
                        y2.push(gameArray[i+1])
                        y3.push(gameArray[i+2])
                    }
                
                for (oneNine = 0 , threeSeven = 2 ; oneNine<9;) 
                    {
                        oneFiveNine.push(gameArray[oneNine]);
                        sevenFiveThree.push(gameArray[threeSeven]);
                        oneNine += 4;
                        threeSeven += 2;
                    }

                for (let i = 0; i<2; ++i)//it's too late for regret now, but I should have use X Y coordinates for the game board ._.
                    {
                        let winCondition = allX;
                        if (i === 1) {winCondition = allO};
                
                        if (compareArray(winCondition,x1))                  {return checkXO(i);}
                        else if (compareArray(winCondition,x2))             {return checkXO(i);}
                        else if (compareArray(winCondition,x3))             {return checkXO(i);}
                        else if (compareArray(winCondition,y1))             {return checkXO(i);}
                        else if (compareArray(winCondition,y2))             {return checkXO(i);}
                        else if (compareArray(winCondition,y3))             {return checkXO(i);}
                        else if (compareArray(winCondition,oneFiveNine))    {return checkXO(i);}
                        else if (compareArray(winCondition,sevenFiveThree)) {return checkXO(i);}
                        
                    }
                return false;
            }
        const boardDisplayUpdate = function () 
            {
                for (i=0;i<9;++i) 
                    {
                        const arrCell = document.querySelector(`div[data-index="${i}"]`)
                        arrCell.innerHTML= gameArray[i];
                    }
            }

        return {consoleDisplay,pushX,pushO,reset,scanBoard,boardDisplayUpdate}
    }
)()


const Player = function (pMarker) 
    {
        let marker = pMarker;
        let score = 0;
        const getMarker = () => marker;
        const addScore = () => score++;
        const reset = () => score=0;
        const getScore = () => score;
        return {getMarker,addScore,reset,getScore};
    }

const T3Game = (function()
    {
        const player1 = Player('X');
        const player2 = Player('O');
        const pushXO = function (marker,index) 
            {
                if (marker === 'X') {Gameboard.pushX(index);}
                else if (marker === 'O') {Gameboard.pushO(index);}
                else {console.log("unidentified marker at pushXO()");}
            }
        
        let turn = 1;

        const inputHandler = function (events) 
            {
                const choiceRange = "012345678"
                let choice = events.target.getAttribute('data-index')
                
                if ("XO".includes(events.target.innerHTML)) {}
                else if (choiceRange.includes(choice)) 
                    {  
                        startGame(Number(choice))              
                    }
                else {console.log("User clicked outside the board")}
                
            }
        
        const gameReset = function() 
            {
                Gameboard.reset()
                turn = 1;
                Gameboard.boardDisplayUpdate();
                playerDisplayUpdate(player1.getMarker());
            }

        const playerDisplayUpdate = function (marker) 
            {
                const playerTurn = document.querySelector("#turn");
                playerTurn.innerHTML = marker;
                const scoreX = document.querySelector("#score-x"); //this part is rushed...
                scoreX.innerHTML = player1.getScore();
                const scoreO = document.querySelector("#score-o");
                scoreO.innerHTML = player2.getScore();
            }

        const startGame = function (choice) //Well..... At least it work!
            {            
                console.log(`Turn: ${turn}`);   
                if ((turn % 2) !== 0) 
                    {
                        pushXO(player1.getMarker(),choice)
                        playerDisplayUpdate(player2.getMarker())
                    }
                else 
                    {
                        pushXO(player2.getMarker(),choice)
                        playerDisplayUpdate(player1.getMarker())
                    }
                Gameboard.consoleDisplay();
                Gameboard.boardDisplayUpdate();
                ++turn;
                const scanResult = Gameboard.scanBoard();
                if (scanResult) 
                    {
                        if (scanResult === player1.getMarker()) {player1.addScore(); console.log(`${player1.getMarker()} have won this round!`);}
                        else if (scanResult === player2.getMarker()) {player2.addScore(); console.log(`${player2.getMarker()} have won this round!`);}
                        else {console.log("unknown scanResult?")}
                        console.log(`Current scores: X: ${player1.getScore()} | O: ${player2.getScore()}`);
                        gameReset();
                        Gameboard.consoleDisplay();
                        playerDisplayUpdate(player1.getMarker())
                        Gameboard.boardDisplayUpdate();
                    };
                            

                if (turn === 10) 
                    {
                        console.log("DRAW!");
                        playerDisplayUpdate(player1.getMarker())
                        gameReset();
                        Gameboard.boardDisplayUpdate();
                    }       
                    
            }
        return {startGame,inputHandler,gameReset}
    }
)()

const main_page = document.querySelector("main");
main_page.addEventListener("click",T3Game.inputHandler)
const resetButton = document.querySelector("#reset-button")
resetButton.addEventListener("click",T3Game.gameReset)



