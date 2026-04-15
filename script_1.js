const ui = (function () {
    // let start button start a new game
    document.querySelector("#start")
    .addEventListener("click", () => game.start() );

    // Get all player display data
    const  players = [...document.querySelectorAll(".player")].map((player) => {
        return {
            display: player,
            name: player.querySelector("h1"),
            wins: player.querySelector(".wins"),
            losses: player.querySelector(".losses"),
        };
    });

    // Draws the display
    const draws = document.querySelector('#draws');

    // Dialog boxes
    const outcomeDialog = document.querySelector("#outcome");
    const namesDialog = document.querySelector("#names");

    // Ask for player names on launch
    namesDialog.showModal();
    namesDialog.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();

        // set player names once user clicks submit
        players[0].name.textContent = e.target.player1.value;
        players[1].name.textContent = e.target.player2.value;

        // starts a new game after entering names
        game.start();

        namesDialog.close();
    });

    function update(){
        // Update wins and losses displays for each player
        players.forEach((player, index) => {
            player.wins.textContent = `Wins: ${game.getPlayer(index).wins}`;
            player.losses.textContent = `Losses: ${game.getPlayer(index).losses}`;
        });

        // updates draw display
        draws.textContent = `Draws: ${game.
            getDraws()}`;

        // Select current player's display
        players.forEach((player) => player.display.classList.remove("selected"));
        players[game.getPlayerIndex()].display.classList.add("selected");
    }

    function showOutcome(outcome){
        // Set winner dialog heading based on game outcome
        outcomeDialog.querySelector("h1").textContent =  outcome === -1 ? "Draw!" : `${players[outcome].name.textContent} won!`;

        outcomeDialog.showModal();
        update();
    }
    return {update, showOutcome};
})();

const game = (function (){
    // Pause game on start
    let paused = true;

    // player stats
    let player = 0; // 0 = 'X', 1 = '0';
    const players = [
        {wins: 0, losses : 0},
        {wins: 0, losses: 0}
    ];
    let draws = 0;

    function start(){
        player = 0;
        board.setup();
        ui.update();
        paused = false;
    }

    function getPaused(){
        return paused;
    }

    function getDraws(){
        return draws;
    }

    function getPlayer(index= player){
        return {...players[index]};
    }

    // Mainly used to identify if player uses 'x' or 'o'
    function getPlayerIndex(){
        return player;
    }

    function switchPlayer(){
        player = Number(!player);
        ui.update();
    }

    function end(outcome){
        if (outcome === -1){
            draws++;
        } else {
            players[outcome].wins++;
            players[Number(!outcome)].losses++;
        }

        ui.showOutcome(outcome);
        paused = true;
    }
    return {
        start,
        getPaused,
        getDraws,
        getPlayer,
        getPlayerIndex,
        switchPlayer,
        end,
    };
})();

const checker = (function(){
    // All lines to check
    function check(cells){
        const checks = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Final outcome checking
        let outcome = "";

        checks.forEach((check) => {
            const output =check.map((i) => cells[i].textContent).join("");
            // if a line matches in all 3 cells, set outcome to 0 or 1 based on if the cell is "X" or "O"
            if (output === "XXX" || output === "OOO"){
                outcome = Number(output[0] === "O");
            }
        });

        // Check for draw and set -1 if it is a draw
        outcome = cells.map((cell) => cell.textContent).join("").length >= 9 && outcome=== "" ? -1 : outcome;

        // End game if there is an outcome, switch to next player if there isn't
        if(outcome !== "") game.end(outcome);
        else game.switchPlayer();
    }

    return {check};
})();

const board = (function(){
    // Select all cells on the GUI board and give them interaction
    const cells = [...document.querySelectorAll("#board > *")];
    cells.forEach((cell) => cell.addEventListener("click", (e) => setCell(e.target)),);

    // Clear all cells
    function setup(){
        cells.forEach((cell) => {
            cell.textContent = "";
        });

    }
    function setCell(cell){
        // Return if the celll is filled or the game is stopped
        if (cell.textContent || game.getPaused()) return;

        // fill cell with X or O
        cell.textContent = game.getPlayerIndex() ? "O" : "X";
        checker.check(cells);
    }

    return {setup};


})();