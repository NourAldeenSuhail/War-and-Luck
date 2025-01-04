document.addEventListener('DOMContentLoaded', () => {
    const grid1 = document.getElementById('grid1');
    const grid2 = document.getElementById('grid2');
    const randomButton = document.getElementById('randomButton');
    const statusBox = document.getElementById('statusBox');
    const restartButton = document.getElementById('restartButton');
    let currentPlayer = 'red';
    let interval;

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
        if (randomButton.classList.contains('red')) {
            randomButton.classList.remove('red');
            randomButton.classList.add('yellow');
            statusBox.textContent = 'إطلاق الضربة';
            interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * 20);
                const selectedGrid = currentPlayer === 'red' ? grid1 : grid2;
                const selectedDiv = selectedGrid.querySelector(`#${selectedGrid.id}-${randomIndex}`);
                selectedDiv.style.backgroundColor = 'gray';
            }, 100);
        } else if (randomButton.classList.contains('yellow')) {
            clearInterval(interval);
            randomButton.classList.remove('yellow');
            randomButton.classList.add(currentPlayer === 'red' ? 'blue' : 'red');
            currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
            statusBox.textContent = `دور اللاعب ${currentPlayer === 'red' ? 'الأحمر' : 'الأزرق'}`;
        }
    });

    restartButton.addEventListener('click', () => {
        clearInterval(interval);
        randomButton.className = 'red';
        statusBox.className = 'red';
        statusBox.textContent = 'دور اللاعب الأحمر';
        currentPlayer = 'red';
        document.querySelectorAll('.grid div').forEach(div => {
            div.style.backgroundColor = 'lightgreen';
        });
    });
});
