import { Component } from "react";
import "./App.css";
import snakeEatSound from "./assets/eat2.mp3";
import gameOverSound from "./assets/loss.wav";

class App extends Component {
  constructor() {
    super();
    const initialSnake = [];
    for (let i = 0; i < 5; i++) {
      initialSnake.push({ x: 1, y: 13 - i }); // Bottom left corner
    }

    this.state = {
      snake: initialSnake,
      food: this.generateRandomFoodPosition(),
      direction: "right",
      gameInterval: null,
      isGameStarted: false,
      isGameOver: false,
    };
    this.snakeEatSound = new Audio(snakeEatSound);
    this.gameOverAudio = new Audio(gameOverSound);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  generateRandomFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * 15),
      y: Math.floor(Math.random() * 15),
    };
  };

  startGame = () => {
    this.setState({
      isGameStarted: true,
      isGameOver: false,
    });
    const gameInterval = setInterval(this.moveSnake, 500);
    this.setState({ gameInterval });
  };

  restartGame = () => {
    clearInterval(this.state.gameInterval);
    const initialSnake = [];
    for (let i = 0; i < 5; i++) {
      initialSnake.push({ x: 1, y: 13 - i }); // Bottom left corner
    }
    this.setState({
      snake: initialSnake,
      food: this.generateRandomFoodPosition(),
      direction: "right",
      gameInterval: null,
      isGameStarted: false,
      isGameOver: false,
    });
  };

  endGame = () => {
    this.gameOverAudio.play();
    clearInterval(this.state.gameInterval);
    this.setState({ isGameOver: true });
  };

  moveSnake = () => {
    const { snake, direction, food, isGameOver } = this.state;

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
      this.endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      this.generateNewFood();
      this.snakeEatSound.play();
    } else {
      snake.pop();
    }

    this.setState({ snake });
  };

  handleKeyPress = (e) => {
    const { direction, isGameStarted } = this.state;

    if (!isGameStarted) {
      return;
    }

    if (e.key === "ArrowRight" && direction !== "left") {
      this.setState({ direction: "right" });
    } else if (e.key === "ArrowLeft" && direction !== "right") {
      this.setState({ direction: "left" });
    } else if (e.key === "ArrowUp" && direction !== "down") {
      this.setState({ direction: "up" });
    } else if (e.key === "ArrowDown" && direction !== "up") {
      this.setState({ direction: "down" });
    }
  };

  generateNewFood = () => {
    const newFood = this.generateRandomFoodPosition();
    this.setState({ food: newFood });
  };

  render() {
    const { snake, food, isGameStarted, isGameOver } = this.state;
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
      <div>
        {isGameStarted ? (
          <div>
            <div className="game-grid">{grid}</div>
            {isGameOver && (
              <div className="game-over">
                <span>Game Over! </span>
                <button onClick={this.restartGame}>Restart</button>
              </div>
            )}
          </div>
        ) : (
          <div className="start-modal">
            <h2>Welcome to Nokia Cell Phone Snake Game</h2>
            <button onClick={this.startGame}>START</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
