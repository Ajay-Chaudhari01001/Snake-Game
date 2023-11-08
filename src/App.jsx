import { useEffect, useState } from "react";
import useSound from "use-sound";
import snakeEatSound from "./assets/eat2.mp3";
import gameOverSound from "./assets/loss.wav";
import "./App.css";

const App = () => {
  const totalGridSize = 20;
  const initialSnakePosition = [
    { x: totalGridSize / 2, y: totalGridSize / 2 },
    { x: totalGridSize / 2 + 1, y: totalGridSize / 2 },
    { x: totalGridSize / 2 + 1, y: totalGridSize / 2 },
    { x: totalGridSize / 2 + 1, y: totalGridSize / 2 },
  ];

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [snake, setSnake] = useState(initialSnakePosition);
  const [direction, setDirection] = useState("right");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameOverSoundPlayed, setIsGameOverSoundPlayed] = useState(false);

  const [playSnakeEatSound] = useSound(snakeEatSound);
  const [playGameOverSound] = useSound(gameOverSound);

  function renderBoard() {
    const cellArray = [];
    for (let row = 0; row < totalGridSize; row++) {
      for (let col = 0; col < totalGridSize; col++) {
        let className = "cell";
        const isFood = food.x === row && food.y === col;
        const isSnake = snake.some((ele) => ele.x === row && ele.y === col);
        const isSnakeHead = snake[0].x === row && snake[0].y === col;

        if (isFood) {
          className += " food";
        }

        if (isSnake) {
          className += " snake";
        }

        if (isSnakeHead) {
          className += " snakeHead";
        }

        const cell = <div className={className} key={`${row} - ${col}`}></div>;
        cellArray.push(cell);
      }
    }
    return cellArray;
  }

  function startGame() {
    setIsGameOver(false);
    setIsGameOverSoundPlayed(false);
    setSnake(initialSnakePosition);
    setDirection("right");
    setScore(0);
    randomFood();
  }

  function gameOver() {
    setIsGameOver(true);
    if (!isGameOverSoundPlayed) {
      playGameOverSound();
      setIsGameOverSoundPlayed(true);
    }
  }

  function retryGame() {
    startGame();
  }

  function randomFood() {
    const xPosition = Math.floor(Math.random() * totalGridSize);
    const yPosition = Math.floor(Math.random() * totalGridSize);

    setFood({ x: xPosition, y: yPosition });
  }

  function updateDirection(e) {
    const key = e.code;

    switch (key) {
      case "ArrowUp":
        if (direction !== "down") setDirection("up");
        break;
      case "ArrowDown":
        if (direction !== "up") setDirection("down");
        break;
      case "ArrowLeft":
        if (direction !== "right") setDirection("left");
        break;
      case "ArrowRight":
        if (direction !== "left") setDirection("right");
        break;
    }
  }

  function updateGame() {
    const newSnake = [...snake];

    switch (direction) {
      case "left":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case "right":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
      case "up":
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
        break;
      case "down":
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
        break;
    }

    if (
      newSnake[0].x < 0 ||
      newSnake[0].x >= totalGridSize ||
      newSnake[0].y < 0 ||
      newSnake[0].y >= totalGridSize
    ) {
      gameOver();
      return;
    }

    const isBit = newSnake
      .slice(1)
      .some((ele) => ele.x === newSnake[0].x && ele.y === newSnake[0].y);

    if (isBit) {
      gameOver();
      return;
    }

    const isAteFood = newSnake[0].x === food.x && newSnake[0].y === food.y;

    if (isAteFood) {
      playSnakeEatSound();
      setScore((prev) => prev + 1);
      randomFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  useEffect(() => {
    const interval = setInterval(updateGame, 500);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    document.addEventListener("keydown", updateDirection);
    return () => document.removeEventListener("keydown", updateDirection);
  });

  return (
    <div className="container">
      {isGameOver ? (
        <button onClick={retryGame}>Retry</button>
      ) : (
        <>
          <div className="score">
            Score : <span>{score}</span>
          </div>
          <div className="board">{renderBoard()}</div>
        </>
      )}
    </div>
  );
};

export default App;
