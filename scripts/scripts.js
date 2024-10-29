// FILE: scripts.js
const gameContainer = document.getElementById('game-container');
let board = [];
let score = 0;
let waitingForAnimation = false;

function initGame() {
    // Create grid cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.left = `${15 + j * 100}px`;
            cell.style.top = `${15 + i * 100}px`;
            gameContainer.appendChild(cell);
        }
    }

    board = Array(4).fill().map(() => Array(4).fill(0));
    addNewTile();
    addNewTile();
    renderBoard();
}

function getPositionFromCoords(i, j) {
    return {
        x: 15 + j * 100,
        y: 15 + i * 100
    };
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
        return {i, j, value: board[i][j]};
    }
    return null;
}

function createTile(value, x, y, isNew = false) {
    const tile = document.createElement('div');
    tile.className = `tile tile-${value}`;
    if (isNew) tile.classList.add('new');
    tile.textContent = value;
    tile.style.left = `${x}px`;
    tile.style.top = `${y}px`;
    return tile;
}

function renderBoard() {
    const tiles = gameContainer.getElementsByClassName('tile');
    while (tiles.length > 0) {
        tiles[0].remove();
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                const {x, y} = getPositionFromCoords(i, j);
                const tile = createTile(board[i][j], x, y);
                gameContainer.appendChild(tile);
            }
        }
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

function slide(arr) {
    const numbers = arr.filter(x => x !== 0);
    const result = [];
    const merges = [];
    let points = 0;

    for (let i = 0; i < numbers.length; i++) {
        if (i < numbers.length - 1 && numbers[i] === numbers[i + 1]) {
            const mergedValue = numbers[i] * 2;
            result.push(mergedValue);
            merges.push(true);
            points += mergedValue;
            i++;
        } else {
            result.push(numbers[i]);
            merges.push(false);
        }
    }

    while (result.length < 4) {
        result.push(0);
        merges.push(false);
    }

    return { result, merges, points };
}

async function move(direction) {
    if (waitingForAnimation) return;
    waitingForAnimation = true;

    const oldBoard = board.map(row => [...row]);
    const newBoard = board.map(row => [...row]);
    const tileMoves = [];
    let totalPoints = 0;

    // Determine movements for each tile
    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = [...newBoard[i]];
            if (direction === 'right') row.reverse();
            
            const { result, merges, points } = slide(row);
            totalPoints += points;
            if (direction === 'right') result.reverse();

            // Track movements
            let oldPositions = row.map((value, index) => ({
                value,
                index: direction === 'right' ? 3 - index : index
            })).filter(item => item.value !== 0);

            let newPositions = result.map((value, index) => ({
                value,
                index: direction === 'right' ? 3 - index : index
            })).filter(item => item.value !== 0);

            oldPositions.forEach((old, idx) => {
                if (idx < newPositions.length) {
                    tileMoves.push({
                        fromI: i,
                        fromJ: old.index,
                        toI: i,
                        toJ: newPositions[idx].index,
                        value: old.value,
                        merged: merges[idx]
                    });
                }
            });

            newBoard[i] = result;
        }
    } else {
        for (let j = 0; j < 4; j++) {
            let column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
            if (direction === 'down') column.reverse();
            
            const { result, merges, points } = slide(column);
            totalPoints += points;
            if (direction === 'down') result.reverse();

            // Track movements
            let oldPositions = column.map((value, index) => ({
                value,
                index: direction === 'down' ? 3 - index : index
            })).filter(item => item.value !== 0);

            let newPositions = result.map((value, index) => ({
                value,
                index: direction === 'down' ? 3 - index : index
            })).filter(item => item.value !== 0);

            oldPositions.forEach((old, idx) => {
                if (idx < newPositions.length) {
                    tileMoves.push({
                        fromI: old.index,
                        fromJ: j,
                        toI: newPositions[idx].index,
                        toJ: j,
                        value: old.value,
                        merged: merges[idx]
                    });
                }
            });

            for (let i = 0; i < 4; i++) {
                newBoard[i][j] = result[i];
            }
        }
    }

    if (tileMoves.length > 0) {
        // Create animated tiles
        tileMoves.forEach(move => {
            const {x: fromX, y: fromY} = getPositionFromCoords(move.fromI, move.fromJ);
            const tile = createTile(move.value, fromX, fromY);
            gameContainer.appendChild(tile);

            // Start animation
            setTimeout(() => {
                const {x: toX, y: toY} = getPositionFromCoords(move.toI, move.toJ);
                tile.style.left = `${toX}px`;
                tile.style.top = `${toY}px`;
                if (move.merged) {
                    tile.classList.add('merge');
                }
            }, 0);
        });

        // Update state and add new tile
        await new Promise(resolve => {
            setTimeout(() => {
                board = newBoard;
                const newTile = addNewTile();
                renderBoard();
                if (newTile) {
                    const {x, y} = getPositionFromCoords(newTile.i, newTile.j);
                    const tile = createTile(newTile.value, x, y, true);
                    gameContainer.appendChild(tile);
                }
                updateScore(totalPoints);
                waitingForAnimation = false;
                resolve();
            }, 150);
        });
    } else {
        waitingForAnimation = false;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
    else if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
});

let touchStartX, touchStartY, touchEndX, touchEndY;

gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

gameContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
    e.preventDefault();
});

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
        if (absDx > absDy) {
            if (dx > 0) move('right');
            else move('left');
        } else {
            if (dy > 0) move('down');
            else move('up');
        }
    }
}

document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'block';
});

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
    document.getElementById('game-container').style.backgroundColor = e.target.value;
});

document.getElementById('background-picker').addEventListener('input', (e) => {
    document.body.style.backgroundColor = e.target.value;
});

document.getElementById('animation-select').addEventListener('change', (e) => {
    const animation = e.target.value;
    document.body.className = ''; // Reset any existing animation classes
    removeSnowflakes();
    removeRaindrops();
    removeLeaves();
    if (animation !== 'none') {
        document.body.classList.add(animation);
        if (animation === 'falling-snow') {
            createSnowflakes();
        } else if (animation === 'falling-rain') {
            createRaindrops();
        } else if (animation === 'falling-leaves') {
            createLeaves();
        }
    }
});

document.getElementById('animation-speed').addEventListener('input', (e) => {
    const speed = e.target.value;
    document.documentElement.style.setProperty('--animation-speed', `${speed}s`);
});

function createSnowflakes() {
    const snowflakeContainer = document.createElement('div');
    snowflakeContainer.id = 'snowflake-container';
    snowflakeContainer.className = 'animation-container';
    document.body.appendChild(snowflakeContainer);

    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflakeContainer.appendChild(snowflake);
    }
}

function removeSnowflakes() {
    const snowflakeContainer = document.getElementById('snowflake-container');
    if (snowflakeContainer) {
        snowflakeContainer.remove();
    }
}

function createRaindrops() {
    const raindropContainer = document.createElement('div');
    raindropContainer.id = 'raindrop-container';
    raindropContainer.className = 'animation-container';
    document.body.appendChild(raindropContainer);

    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}vw`;
        raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`;
        raindropContainer.appendChild(raindrop);
    }
}

function removeRaindrops() {
    const raindropContainer = document.getElementById('raindrop-container');
    if (raindropContainer) {
        raindropContainer.remove();
    }
}

function createLeaves() {
    const leafContainer = document.createElement('div');
    leafContainer.id = 'leaf-container';
    leafContainer.className = 'animation-container';
    document.body.appendChild(leafContainer);

    for (let i = 0; i < 50; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = `${Math.random() * 100}vw`;
        leaf.style.animationDuration = `${Math.random() * 5 + 3}s`;
        leafContainer.appendChild(leaf);
    }
}

function removeLeaves() {
    const leafContainer = document.getElementById('leaf-container');
    if (leafContainer) {
        leafContainer.remove();
    }
}

initGame();