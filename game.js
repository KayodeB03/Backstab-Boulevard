const players = [
  { name: "Player 1", position: 0, color: "red", token: null },
  { name: "Player 2", position: 0, color: "blue", token: null },
  { name: "Player 3", position: 0, color: "green", token: null },
  { name: "Player 4", position: 0, color: "yellow", token: null }
];

let currentPlayer = 0;
const maxTile = 15;

const turnIndicator = document.getElementById("turn-indicator");
const diceTile = document.getElementById("dice-tile");

/* ---------- SETUP ---------- */

function createTokens() {
  players.forEach(player => {
    const token = document.createElement("div");
    token.classList.add("token", player.color);
    player.token = token;
    placeToken(player);
  });
}

function placeToken(player) {
  const tile = document.querySelector(`.tile[data-index="${player.position}"]`);
  if (tile) tile.appendChild(player.token);
}

/* ---------- GAME FLOW ---------- */

diceTile.addEventListener("click", rollDice);

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  animateMove(players[currentPlayer], roll);
}

function animateMove(player, steps) {
  let step = 0;

  const interval = setInterval(() => {
    if (step >= steps) {
      clearInterval(interval);
      handleTileEvent(player);
      checkWin(player);
      nextTurn();
      return;
    }

    player.position = Math.min(player.position + 1, maxTile);
    placeToken(player);
    step++;
  }, 350);
}

/* ---------- TILE EVENTS ---------- */

function handleTileEvent(player) {
  const tile = document.querySelector(`.tile[data-index="${player.position}"]`);
  if (!tile) return;

  if (tile.classList.contains("forward")) {
    player.position = Math.min(player.position + 2, maxTile);
  }

  if (tile.classList.contains("backward")) {
    player.position = Math.max(player.position - 2, 0);
  }

  if (tile.classList.contains("swap")) {
    const otherIndex = (currentPlayer + 1) % players.length;
    const other = players[otherIndex];
    [player.position, other.position] =
      [other.position, player.position];
    placeToken(other);
  }

  placeToken(player);
}

/* ---------- TURN & WIN ---------- */

function nextTurn() {
  currentPlayer = (currentPlayer + 1) % players.length;
  turnIndicator.textContent = `${players[currentPlayer].name}'s Turn`;
}

function checkWin(player) {
  if (player.position >= maxTile) {
    setTimeout(() => {
      alert(`${player.name} wins! 🎉`);
      location.reload();
    }, 300);
  }
}

/* ---------- INIT ---------- */

createTokens();
turnIndicator.textContent = `${players[currentPlayer].name}'s Turn`;
