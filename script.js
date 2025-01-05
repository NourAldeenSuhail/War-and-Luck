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
  const icons = [
    "<i class='fas fa-ambulance' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-bomb' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-car' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-child' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-city' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-landmark' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-snowplow' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-fighter-jet' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-helicopter' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-pastafarianism' style='font-size:40px;color:gray'></i>",
    "<i class='fab fa-pied-piper-alt' style='font-size:40px;color:gray'></i>",
    "<i class='fas fa-spider' style='font-size:40px;color:gray'></i>",
  ];

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
        let randomIcon = icons[Math.floor(Math.random() * icons.length)];
        event.target.innerHTML = randomIcon; // إضافة أيقونة عشوائية
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
    } Player's Build`;
    if (currentPlayer === "blue") {
      buildButton.classList.remove("red");
      buildButton.classList.add("blue");
      enableGrid(grid2);
      handleBuildPhase();
    } else {
      buildButton.style.display = "none";
      randomButton.style.display = "inline-block";
      statusBox.textContent = "Red Player's Shot";
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

  // Function to switch turn
  function switchTurn() {
    clearInterval(interval);
    clearInterval(countdownInterval);
    let selectedGrid = currentPlayer === "red" ? grid2 : grid1; // تعديل الساحة للاختيار العشوائي
    let availableCells =
      currentPlayer === "red" ? availableCells2 : availableCells1; // تعديل الساحة للاختيار العشوائي
    if (lastSelectedIndex !== undefined) {
      const finalDiv = selectedGrid.querySelector(
        `#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`
      );
      finalDiv.style.backgroundColor = "gray";
      availableCells.splice(lastSelectedIndex, 1);

      // Check if the selected cell contains an icon
      if (finalDiv.querySelector("i")) {
        if (currentPlayer === "red") {
          blueScore--; // خصم النقطة من اللاعب الثاني
          blueScoreElement.textContent = blueScore;
        } else {
          redScore--; // خصم النقطة من اللاعب الثاني
          redScoreElement.textContent = redScore;
        }

        // Check if any player has lost
        if (redScore === 0 || blueScore === 0) {
          const winner = redScore === 0 ? "Blue" : "Red";
          statusBox.textContent = `${winner} Player Wins!`;
          statusBox.style.color = winner.toLowerCase();
          disableGrid(grid1);
          disableGrid(grid2);
          return;
        }
      }
    }
    randomButton.classList.remove("yellow");
    setTimeout(() => {
      currentPlayer = currentPlayer === "red" ? "blue" : "red";
      randomButton.classList.add(currentPlayer);
      statusBox.textContent = `${
        currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
      } Player's Shot`;
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
      let selectedGrid = currentPlayer === "red" ? grid2 : grid1; // تعديل الساحة للاختيار العشوائي
      let availableCells =
        currentPlayer === "red" ? availableCells2 : availableCells1; // تعديل الساحة للاختيار العشوائي

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
    statusBox.textContent = "Red Player's Shot";
    currentPlayer = "red";
    countdownTime = 15;
    availableCells1 = Array.from({ length: 20 }, (_, i) => i);
    availableCells2 = Array.from({ length: 20 }, (_, i) => i);
    document.querySelectorAll(".grid div").forEach((div) => {
      div.style.backgroundColor = "lightgreen";
      div.textContent = "";
    });
    redScore = 6;
    blueScore = 6;
    redScoreElement.textContent = redScore;
    blueScoreElement.textContent = blueScore;
  });
});
