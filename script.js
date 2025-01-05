document.addEventListener("DOMContentLoaded", () => {
  const grid1 = document.getElementById("grid1");
  const grid2 = document.getElementById("grid2");
  const randomButton = document.getElementById("randomButton");
  const statusBox = document.getElementById("statusBox");
  const restartButton = document.getElementById("restartButton");
  let currentPlayer = "red";
  let interval;
  let countdownInterval;
  let countdownTime = 15;
  let availableCells1 = Array.from({ length: 20 }, (_, i) => i);
  let availableCells2 = Array.from({ length: 20 }, (_, i) => i);
  let lastSelectedIndex;
  const buildButton = document.getElementById("buildButton");
  let selectedCells1 = [];
  let selectedCells2 = [];
  const letters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "d"];
  const redScoreElement = document.getElementById("redScore");
  const blueScoreElement = document.getElementById("blueScore");
  let redScore = 6;
  let blueScore = 6;

  // Create grids
  for (let i = 0; i < 20; i++) {
    const div1 = document.createElement("div");
    div1.id = `grid1-${i}`;
    grid1.appendChild(div1);

    const div2 = document.createElement("div");
    div2.id = `grid2-${i}`;
    grid2.appendChild(div2);
  }

  // Prevent grid container clicks
  grid1.addEventListener("click", (event) => {
    if (event.target === grid1) {
      event.stopPropagation();
    }
  });

  grid2.addEventListener("click", (event) => {
    if (event.target === grid2) {
      event.stopPropagation();
    }
  });

  // Function to handle building phase
  function handleBuildPhase() {
    let selectedCells =
      currentPlayer === "red" ? selectedCells1 : selectedCells2;
    let availableCells =
      currentPlayer === "red" ? availableCells1 : availableCells2;
    let selectedGrid = currentPlayer === "red" ? grid1 : grid2;

    selectedGrid.addEventListener("click", function selectCell(event) {
      if (
        event.target.style.backgroundColor !== "gray" &&
        selectedCells.length < 6 &&
        !event.target.classList.contains("disabled")
      ) {
        let randomLetter = letters[Math.floor(Math.random() * letters.length)];
        event.target.textContent = randomLetter;
        event.target.classList.add("disabled");
        selectedCells.push(event.target.id.split("-")[1]);
        // لا تقم بإزالة المربع من المصفوفة المتاحة
      }
      if (selectedCells.length === 6) {
        selectedGrid.removeEventListener("click", selectCell);
        disableGrid(selectedGrid);
        switchPlayer();
      }
    });
    enableGrid(selectedGrid);
  }

  // Function to enable grid for current player
  function enableGrid(grid) {
    grid.querySelectorAll("div").forEach((cell) => {
      if (!cell.classList.contains("disabled")) {
        cell.classList.remove("disabled");
        cell.style.pointerEvents = "auto";
      }
    });
  }

  // Function to disable grid
  function disableGrid(grid) {
    grid.querySelectorAll("div").forEach((cell) => {
      cell.classList.add("disabled");
      cell.style.pointerEvents = "none";
    });
  }

  // Function to switch player
  function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "blue" : "red";
    statusBox.textContent = `${
      currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
    } Player's Turn to Build`;
    if (currentPlayer === "blue") {
      buildButton.classList.remove("red");
      buildButton.classList.add("blue");
      enableGrid(grid2);
      handleBuildPhase();
    } else {
      buildButton.style.display = "none";
      randomButton.style.display = "inline-block";
      statusBox.textContent = "Red Player's Turn";
    }
  }

  // Initialize the game with red player's build phase
  handleBuildPhase();

  // Event listener for random button
  randomButton.addEventListener("click", () => {
    handleRandomSelection();
  });

  // Event listener for restart button
  restartButton.addEventListener("click", () => {
    location.reload();
  });

  function switchTurn() {
    clearInterval(interval);
    clearInterval(countdownInterval);
    let selectedGrid = currentPlayer === "red" ? grid1 : grid2;
    let availableCells =
      currentPlayer === "red" ? availableCells1 : availableCells2;
    if (lastSelectedIndex !== undefined) {
      const finalDiv = selectedGrid.querySelector(
        `#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`
      );
      finalDiv.style.backgroundColor = "gray";
      availableCells.splice(lastSelectedIndex, 1);
    }
    randomButton.classList.remove("yellow");
    setTimeout(() => {
      currentPlayer = currentPlayer === "red" ? "blue" : "red";
      randomButton.classList.add(currentPlayer);
      statusBox.textContent = `${
        currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
      } Player's Turn`;
      countdownTime = 15;
    }, 2000);
  }

  randomButton.addEventListener("click", () => {
    if (
      randomButton.classList.contains("red") ||
      randomButton.classList.contains("blue")
    ) {
      randomButton.classList.remove(currentPlayer);
      randomButton.classList.add("yellow");
      statusBox.textContent = `Launching... ${countdownTime}s`;
      let selectedGrid = currentPlayer === "red" ? grid1 : grid2;
      let availableCells =
        currentPlayer === "red" ? availableCells1 : availableCells2;

      interval = setInterval(() => {
        if (availableCells.length === 0) {
          clearInterval(interval);
          return;
        }
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const selectedDiv = selectedGrid.querySelector(
          `#${selectedGrid.id}-${availableCells[randomIndex]}`
        );
        if (lastSelectedIndex !== undefined) {
          selectedGrid.querySelector(
            `#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`
          ).style.backgroundColor = "lightgreen";
        }
        selectedDiv.style.backgroundColor = "gray";
        lastSelectedIndex = randomIndex;
      }, 400);

      countdownInterval = setInterval(() => {
        countdownTime--;
        statusBox.textContent = `Launching... ${countdownTime}s`;
        if (countdownTime <= 0) {
          switchTurn();
        }
      }, 1000);
    } else if (randomButton.classList.contains("yellow")) {
      switchTurn();
    }
  });

  restartButton.addEventListener("click", () => {
    clearInterval(interval);
    clearInterval(countdownInterval);
    randomButton.className = "button red";
    statusBox.className = "status-box";
    statusBox.textContent = "Red Player's Turn";
    currentPlayer = "red";
    countdownTime = 15;
    availableCells1 = Array.from({ length: 20 }, (_, i) => i);
    availableCells2 = Array.from({ length: 20 }, (_, i) => i);
    document.querySelectorAll(".grid div").forEach((div) => {
      div.style.backgroundColor = "lightgreen";
    });
  });
});
