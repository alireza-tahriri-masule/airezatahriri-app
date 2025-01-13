const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
const gridSize = 25;

// Set canvas to fullscreen
canvas.width = Math.floor(window.innerWidth / gridSize) * gridSize;
canvas.height = Math.floor(window.innerHeight / gridSize) * gridSize;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let snake = [
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 },
]; // Snake body segments
const winning_length = 80;
let fruit = { x: 140, y: 140 }; // Fruit position
let direction = { x: 1, y: 0 }; // Initial direction (right)
let nextDirection = { x: 1, y: 0 }; // Queue direction changes
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from localStorage
let lastFrameTime = 0; // Track time between frames
let frameDelay = 100; // Snake speed (ms per frame)
let gameOver = false; // Indicates whether the game has ended

// Function to draw the snake
function drawSnake() {
  ctx.fillStyle = "#32FF32"; // Snake body color

  // Draw each body segment
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw the snake's head
      ctx.fillStyle = "#32FF32";
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize); // Draw the head

      // Draw eyes for the snake's head
      ctx.fillStyle = "#FFFFFF"; // White color for the eyes

      // Left eye
      ctx.fillRect(segment.x + gridSize * 0.2, segment.y + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);
      
      // Right eye
      ctx.fillRect(segment.x + gridSize * 0.6, segment.y + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);

      // Draw pupils (inside the eyes)
      ctx.fillStyle = "#000000"; // Black color for pupils
      
      // Left pupil
      ctx.fillRect(segment.x + gridSize * 0.25, segment.y + gridSize * 0.25, gridSize * 0.1, gridSize * 0.1);
      
      // Right pupil
      ctx.fillRect(segment.x + gridSize * 0.65, segment.y + gridSize * 0.25, gridSize * 0.1, gridSize * 0.1);

      // Draw the mouth of the snake (small rectangle under the eyes)
      ctx.fillStyle = "#000000"; // Color for the mouth
      ctx.fillRect(segment.x + gridSize * 0.3, segment.y + gridSize * 0.7, gridSize * 0.4, gridSize * 0.1); // Draw the mouth
    } else {
      // Draw body segments for the rest of the snake
      ctx.fillStyle = "#32FF32";
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize); // Draw body segment
    }
  });
}

// Function to draw the fruit
function drawFruit() {
  ctx.fillStyle = "#ff0200"; // Fruit color
  ctx.beginPath();
  ctx.arc(
    fruit.x + gridSize / 2,
    fruit.y + gridSize / 2,
    gridSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Function to display the score and high score
function drawScores() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // White text color with some transparency
  ctx.font =
    "95px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "center";

  // Draw the current score
  ctx.fillText(`${score}`, canvasWidth / 2, 150);

  ctx.font =
    "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  // Draw the high score
  ctx.fillText(`High Score: ${highScore}`, canvasWidth / 2, 200);
}

// Function to update the snake's position
function updateSnake() {
  direction = nextDirection; // Apply the queued direction change
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };

  // Add the new head to the snake
  snake.unshift(head);

  // Check if the snake ate the fruit
  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    placeFruit(); // Place a new fruit
  } else {
    // Remove the tail segment if the fruit wasn't eaten
    snake.pop();
  }

  // Update high score if necessary
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Save high score to localStorage
  }
}

// Function to place the fruit at a random position
function placeFruit() {
  do {
    fruit.x = Math.floor(Math.random() * ((canvasWidth - gridSize) / gridSize)) * gridSize;
    fruit.y = Math.floor(Math.random() * ((canvasHeight - gridSize) / gridSize)) * gridSize;
  } while (
    snake.some((segment) => segment.x === fruit.x && segment.y === fruit.y) // Ensure the fruit doesn't spawn on the snake
  );
}

// Function to check for collisions
function checkCollision() {
  const head = snake[0];

  // Check if the snake collides with the walls
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasWidth ||
    head.y >= canvasHeight
  ) {
    endGame(false); // End the game if the snake hits the wall
  }

  // Check if the snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame(false); // End the game if the snake collides with its own body
    }
  }
}

// Function to display the win message
function showWinMessage() {
  ctx.fillStyle = "#10b981"; // Semi-transparent background for win
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#ffffff"; // White text color
  ctx.font =
    "42px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🎉 You Win!", canvasWidth / 2, canvasHeight / 2 - 20);

  ctx.font =
    "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 20);

  ctx.font =
    "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText(
    "Reload the page to play again!",
    canvasWidth / 2,
    canvasHeight / 2 + 60
  );
}

// Function to display the game over message
function showGameOverMessage() {
  ctx.fillStyle = "#ef4444"; // Semi-transparent background for game over
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#ffffff"; // White text color
  ctx.font =
    "42px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("👻 Game Over!", canvasWidth / 2, canvasHeight / 2 - 20);

  ctx.font =
    "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 20);

  ctx.font =
    "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText(
    "Reload the page to play again!",
    canvasWidth / 2,
    canvasHeight / 2 + 60
  );
}

// Function to handle keyboard input
document.addEventListener("keydown", (event) => {
  if (gameOver) return; // Stop further input if the game is over

  if ((event.key === "ArrowUp" || event.key === "w") && direction.y === 0) {
    nextDirection = { x: 0, y: -1 }; // Move up
  } else if (
    (event.key === "ArrowDown" || event.key === "s") &&
    direction.y === 0
  ) {
    nextDirection = { x: 0, y: 1 }; // Move down
  } else if (
    (event.key === "ArrowLeft" || event.key === "a") &&
    direction.x === 0
  ) {
    nextDirection = { x: -1, y: 0 }; // Move left
  } else if (
    (event.key === "ArrowRight" || event.key === "d") &&
    direction.x === 0
  ) {
    nextDirection = { x: 1, y: 0 }; // Move right
  }
});

// Main game loop
function gameLoop(timestamp) {
  if (gameOver) {
    return; // Stop the game if it's over
  }

  const timeSinceLastFrame = timestamp - lastFrameTime;

  if (timeSinceLastFrame >= frameDelay) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas

    updateSnake(); // Update snake's position
    checkCollision(); // Check for collisions

    // Check if the player has won
    if (score >= winning_length) {
      showWinMessage(); // Display win message
      return; // Stop the game loop
    }

    if (!gameOver) {
      drawFruit(); // Draw the fruit
      drawSnake(); // Draw the snake
      drawScores(); // Draw the score and high score
    }

    lastFrameTime = timestamp;
  }

  if (!gameOver) {
    requestAnimationFrame(gameLoop); // Continue the game loop
  }
}

// Function to end the game and stop drawing snake and fruit
function endGame(isWin) {
  if (!gameOver) {
    gameOver = true;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (isWin) {
      showWinMessage();
    } else {
      showGameOverMessage();
    }
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  placeFruit(); // Reposition the first fruit
  requestAnimationFrame(gameLoop); // Restart the game loop
});

// Start the game
placeFruit(); // Place the first fruit
requestAnimationFrame(gameLoop); // Begin the game loop
checkCollision();
// showGameOverMessage()
showWinMessage()