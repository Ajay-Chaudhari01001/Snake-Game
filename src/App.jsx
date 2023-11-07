import { useState, useEffect } from "react";
import "./App.css";
import snakeEatSound from "./assets/eat2.mp3";
import gameOverSound from "./assets/loss.wav";

function App() {
  const generateRandomFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * 15),
      y: Math.floor(Math.random() * 15),
    };
  };

  const initialSnake = [];
  for (let i = 0; i < 5; i++) {
    initialSnake.push({ x: 1, y: 13 - i }); // Bottom left corner
  }

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(generateRandomFoodPosition());
  const [direction, setDirection] = useState("right");
  const [gameInterval, setGameInterval] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const snakeEatSoundRef = new Audio(snakeEatSound);
  const gameOverAudioRef = new Audio(gameOverSound);


  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameStarted) {
        return;
      }

      if (e.key === "ArrowRight" && direction !== "left") {
        setDirection("right");
      } else if (e.key === "ArrowLeft" && direction !== "right") {
        setDirection("left");
      } else if (e.key === "ArrowUp" && direction !== "down") {
        setDirection("up");
      } else if (e.key === "ArrowDown" && direction !== "up") {
        setDirection("down");
      }
    };

    console.log("direction ", direction)

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isGameStarted, direction]);

  useEffect(() => {
    if (isGameStarted) {
      const gameInterval = setInterval(moveSnake, 500);
      setGameInterval(gameInterval);
    }

    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    moveSnake(); // Start the game by moving the snake initially.
  };

  const restartGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    setSnake(initialSnake);
    setFood(generateRandomFoodPosition());
    setDirection("right");
    setGameInterval(null);
    setIsGameStarted(false);
    setIsGameOver(false);
  };

  const endGame = () => {
    gameOverAudioRef.play();
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    setIsGameOver(true);
  };

  const moveSnake = () => {
    if (isGameOver) {
      return;
    }

    const head = { ...snake[0] };

    if (direction === "right") {
      head.x += 1;
    } else if (direction === "left") {
      head.x -= 1;
    } else if (direction === "up") {
      head.y -= 1;
    } else if (direction === "down") {
      head.y += 1;
    }

    if (
      head.x < 0 ||
      head.x >= 15 ||
      head.y < 0 ||
      head.y >= 15 ||
      snake.some((cell) => cell.x === head.x && cell.y === head.y)
    ) {
      endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      generateNewFood();
      snakeEatSoundRef.play();
    } else {
      snake.pop();
    }

    setSnake([...snake]);
  };

  const generateNewFood = () => {
    const newFood = generateRandomFoodPosition();
    setFood(newFood);
  };

  const grid = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const isSnakeCell = snake.some(
        (cell) => cell.x === col && cell.y === row
      );
      const isFoodCell = food.x === col && food.y === row;

      grid.push(
        <div
          key={`${col}-${row}`}
          className={`cell ${isSnakeCell ? "snake" : ""} ${
            isFoodCell ? "food" : ""
          }`}
        ></div>
      );
    }
  }

  return (
    <>
      {isGameStarted ? (
        <div>
          <div className="game-grid">{grid}</div>
          {isGameOver && (
            <div className="game-over">
              <span>Game Over! </span>
              <button onClick={restartGame}>Restart</button>
            </div>
          )}
        </div>
      ) : (
        <div className="start-modal">
          <h2>Welcome to Nokia Cell Phone Snake Game</h2>
          <button onClick={startGame}>START</button>
        </div>
      )}
    </>
  );
}

export default App;
