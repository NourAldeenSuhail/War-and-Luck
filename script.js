document.addEventListener('DOMContentLoaded', () => {
    const grid1 = document.getElementById('grid1');
    const grid2 = document.getElementById('grid2');
    const randomButton = document.getElementById('randomButton');
    const statusBox = document.getElementById('statusBox');
    const restartButton = document.getElementById('restartButton');
    let currentPlayer = 'red';
    let interval;
    let availableCells1 = Array.from({ length: 20 }, (_, i) => i);
    let availableCells2 = Array.from({ length: 20 }, (_, i) => i);

    // Create grids
    for (let i = 0; i < 20; i++) {
        const div1 = document.createElement('div');
        div1.id = `grid1-${i}`;
        grid1.appendChild(div1);

        const div2 = document.createElement('div');
        div2.id = `grid2-${i}`;
        grid2.appendChild(div2);
    }

    randomButton.addEventListener('click', () => {
        if (randomButton.classList.contains('red') || randomButton.classList.contains('blue')) {
            randomButton.classList.remove(currentPlayer);
            randomButton.classList.add('yellow');
            statusBox.textContent = 'Launching...';
            let selectedGrid = currentPlayer === 'red' ? grid1 : grid2;
            let availableCells = currentPlayer === 'red' ? availableCells1 : availableCells2;
            let lastSelectedIndex;

            interval = setInterval(() => {
                if (availableCells.length === 0) {
                    clearInterval(interval);
                    return;
                }
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const selectedDiv = selectedGrid.querySelector(`#${selectedGrid.id}-${availableCells[randomIndex]}`);
                if (lastSelectedIndex !== undefined) {
                    selectedGrid.querySelector(`#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`).style.backgroundColor = 'lightgreen';
                }
                selectedDiv.style.backgroundColor = 'gray';
                lastSelectedIndex = randomIndex;
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                if (lastSelectedIndex !== undefined) {
                    const finalDiv = selectedGrid.querySelector(`#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`);
                    finalDiv.style.backgroundColor = 'gray';
                    availableCells.splice(lastSelectedIndex, 1);
                }
                randomButton.classList.remove('yellow');
                currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
                randomButton.classList.add(currentPlayer);
                statusBox.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player's Turn`;
            }, 30000);
        } else if (randomButton.classList.contains('yellow')) {
            clearInterval(interval);
            let selectedGrid = currentPlayer === 'red' ? grid1 : grid2;
            let availableCells = currentPlayer === 'red' ? availableCells1 : availableCells2;
            if (lastSelectedIndex !== undefined) {
                const finalDiv = selectedGrid.querySelector(`#${selectedGrid.id}-${availableCells[lastSelectedIndex]}`);
                finalDiv.style.backgroundColor = 'gray';
                availableCells.splice(lastSelectedIndex, 1);
            }
            randomButton.classList.remove('yellow');
            currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
            randomButton.classList.add(currentPlayer);
            statusBox.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player's Turn`;
        }
    });

    restartButton.addEventListener('click', () => {
        clearInterval(interval);
        randomButton.className = 'button red';
        statusBox.className = 'status-box';
        statusBox.textContent = "Red Player's Turn";
        currentPlayer = 'red';
        availableCells1 = Array.from({ length: 20 }, (_, i) => i);
        availableCells2 = Array.from({ length: 20 }, (_, i) => i);
        document.querySelectorAll('.grid div').forEach(div => {
            div.style.backgroundColor = 'lightgreen';
        });
    });
});
