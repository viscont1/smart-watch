function applySavedSettings() {
    // Get saved icon size or use default of 1.8
    const savedIconSize = localStorage.getItem('iconSize') || '1.8';
    // Apply the icon size to the root element
    document.documentElement.style.setProperty('--icon-size', `${savedIconSize}em`);
}

function getMarioGameContent() {
    return `
        <div class="app-content mario-game">
            <div class="game-header">
                <button class="back-button">←</button>
                <h2>Mario</h2>
                <div class="score">Score: <span id="marioScore">0</span></div>
            </div>
            <canvas id="marioCanvas" width="150" height="150"></canvas>
            <div class="game-controls">
                <button id="startMario">Start Game</button>
            </div>
        </div>
    `;
}

// Update the time every second
function updateTime() {
    const timeDisplay = document.querySelector('.time');
    const now = new Date();
    
    // Convert to 12-hour format with AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    // Add leading zeros to minutes if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    // Update the time display
    timeDisplay.textContent = `${hours}:${minutesStr} ${ampm}`;
}

// App content generator functions
function getWeatherContent() {
    return `
        <div class="app-content weather">
            <div class="weather-header">
                <button class="back-button">←</button>
                <h2>Weather</h2>
            </div>
            <div class="search-container">
                <input type="text" id="citySearch" placeholder="Enter city name">
                <button id="searchButton">🔍</button>
            </div>
            <div class="weather-info">
                <div class="weather-loading">Search for a city to see weather</div>
            </div>
        </div>
    `;
}

function getMessagesContent() {
    return `
        <div class="app-content messages">
            <h2>Messages</h2>
            <div class="message-list">
                <div class="message">
                    <span class="sender">John</span>
                    <span class="preview">Hey, how are you?</span>
                </div>
                <div class="message">
                    <span class="sender">Alice</span>
                    <span class="preview">Meeting at 3pm</span>
                </div>
                <div class="message">
                    <span class="sender">Bob</span>
                    <span class="preview">Did you see the report?</span>
                </div>
                <div class="message">
                    <span class="sender">Emma</span>
                    <span class="preview">Lunch tomorrow?</span>
                </div>
                <div class="message">
                    <span class="sender">David</span>
                    <span class="preview">Project update needed</span>
                </div>
                <div class="message">
                    <span class="sender">Sarah</span>
                    <span class="preview">Great work today!</span>
                </div>
            </div>
        </div>
    `;
}

function getHealthContent() {
    return `
        <div class="app-content health">
            <h2>Health</h2>
            <div class="health-stats">
                <div class="stat">
                    <span>Steps</span>
                    <span>8,432</span>
                </div>
                <div class="stat">
                    <span>Heart Rate</span>
                    <span>72 BPM</span>
                </div>
                <div class="stat">
                    <span>Calories</span>
                    <span>1,234</span>
                </div>
            </div>
        </div>
    `;
}

// Add notes storage
let notes = [
    { id: 1, title: 'Welcome', content: 'Welcome to Notes! Click + to add a new note.' },
    { id: 2, title: 'Shopping List', content: 'Milk\nEggs\nBread' }
];

function getNotesContent() {
    return `
        <div class="app-content notes">
            <h2>Notes</h2>
            <div class="notes-controls">
                <button class="add-note">+ New Note</button>
            </div>
            <div class="notes-list">
                ${notes.map(note => `
                    <div class="note" data-id="${note.id}">
                        <div class="note-header">
                            <span class="note-title">${note.title}</span>
                            <div class="note-actions">
                                <button class="edit-note">✏️</button>
                                <button class="delete-note">🗑</button>
                            </div>
                        </div>
                        <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function createNote() {
    const newNote = {
        id: Date.now(),
        title: 'New Note',
        content: 'Click to edit'
    };
    notes.unshift(newNote);
    openApp('Notes');
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    openApp('Notes');
}

function editNote(id) {
    const note = notes.find(note => note.id === id);
    const screen = document.querySelector('.screen');
    
    screen.innerHTML = `
        <div class="app-content note-editor">
            <div class="editor-header">
                <button class="back-to-notes">←</button>
                <button class="save-note">Save</button>
            </div>
            <input type="text" class="note-title-input" value="${note.title}">
            <textarea class="note-content-input">${note.content}</textarea>
        </div>
    `;

    // Add event listeners for the editor
    screen.querySelector('.back-to-notes').addEventListener('click', () => openApp('Notes'));
    screen.querySelector('.save-note').addEventListener('click', () => {
        note.title = screen.querySelector('.note-title-input').value;
        note.content = screen.querySelector('.note-content-input').value;
        openApp('Notes');
    });
}

// Expanded app definitions with two pages
const appPages = [
    // Page 1
    [
        { name: 'Weather', emoji: '🌤️', content: getWeatherContent },
        { name: 'Messages', emoji: '💬', content: getMessagesContent },
        { name: 'Games', emoji: '🎮', content: getGamesContent },
        { name: 'Notes', emoji: '📝', content: getNotesContent }
    ],
    // Page 2
    [
        { name: 'Music', emoji: '🎵', content: () => '<div class="app-content">Music App</div>' },
        { name: 'Photos', emoji: '📸', content: () => '<div class="app-content">Photos App</div>' },
        { name: 'Settings', emoji: '⚙️', content: getSettingsContent },
        { name: 'Health', emoji: '❤️', content: getHealthContent }
    ],
    // Page 3
    [
        { name: 'Chrome', emoji: '🌐', content: getChromeContent },
        { name: 'Wallpaper', emoji: '🎨', content: getWallpaperContent }
    ]
];

let currentPage = 0;
let isAnimating = false;

function openApp(appName) {
    const screen = document.querySelector('.screen');
    const app = [...appPages[0], ...appPages[1], ...appPages[2]].find(a => a.name === appName);
    
    if (app) {
        screen.innerHTML = app.content();
        screen.classList.add('app-open');

        if (appName === 'Games') {
            screen.querySelectorAll('.game-choice').forEach(choice => {
                choice.addEventListener('click', (e) => {
                    const gameType = choice.dataset.game;
                    if (gameType === 'snake') {
                        screen.innerHTML = getSnakeGameContent();
                        initGame();
                    } else if (gameType === 'tictactoe') {
                        screen.innerHTML = getTicTacToeContent();
                        initTicTacToe();
                    } else if (gameType === 'trx') {
                        screen.innerHTML = getTrxGameContent();
                        initTrxGame();
                    } else if (gameType === 'mario') {
                        screen.innerHTML = getMarioGameContent();
                        let marioGameLoop;
                        initMarioGame();
                    }
                    
                    // Add back button handler
                    screen.querySelector('.back-button').addEventListener('click', () => {
                        // Clear any existing game loops
                        if (gameType === 'mario') {
                            clearInterval(gameLoop);
                        }
                        openApp('Games');
                    });
                });
            });
        }
        
        // Initialize game if Games app is opened
        if (appName === 'Games') {
            initGame();
        }
        
        // Add Notes app event listeners
        if (appName === 'Notes') {
            screen.querySelector('.add-note').addEventListener('click', createNote);
            
            screen.querySelectorAll('.delete-note').forEach(button => {
                button.addEventListener('click', (e) => {
                    const noteId = parseInt(e.target.closest('.note').dataset.id);
                    deleteNote(noteId);
                });
            });

            screen.querySelectorAll('.edit-note').forEach(button => {
                button.addEventListener('click', (e) => {
                    const noteId = parseInt(e.target.closest('.note').dataset.id);
                    editNote(noteId);
                });
            });
        }

        // Add weather-specific functionality
        if (appName === 'Weather') {
            // Add back button handler
            screen.querySelector('.back-button').addEventListener('click', () => {
                showHomeScreen();
            });

            const searchButton = document.getElementById('searchButton');
            const citySearch = document.getElementById('citySearch');

            searchButton.addEventListener('click', () => {
                const city = citySearch.value.trim();
                if (city) {
                    fetchWeatherData(city);
                }
            });

            citySearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const city = citySearch.value.trim();
                    if (city) {
                        fetchWeatherData(city);
                    }
                }
            });
        }

        // Add Chrome-specific functionality
        if (appName === 'Chrome') {
            const searchInput = document.getElementById('chromeSearch');
            const searchButton = document.getElementById('searchButton');
            const browserFrame = document.getElementById('browserFrame');

            function handleSearch() {
                const query = searchInput.value.trim();
                if (query) {
                    // Check if it's a URL
                    if (query.startsWith('http://') || query.startsWith('https://')) {
                        browserFrame.src = query;
                    } else if (query.includes('.') && !query.includes(' ')) {
                        browserFrame.src = 'https://' + query;
                    } else {
                        // If not a URL, perform a Google search
                        browserFrame.src = `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;
                    }
                }
            }

            searchButton.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }

        // Wallpaper-specific functionality
        if (appName === 'Wallpaper') {
            // Add back button handler
            screen.querySelector('.back-button').addEventListener('click', () => {
                showHomeScreen();
            });

            document.querySelectorAll('.wallpaper-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    // Set the wallpaper
                    document.querySelector('.screen').style.backgroundImage = `url(${url})`;
                    // Store the wallpaper preference
                    localStorage.setItem('watchWallpaper', url);
                    // Show confirmation using the new notification
                    showWatchNotification('Wallpaper changed!');
                });
            });
        }

        if (appName === 'Settings') {
            initSettings();
        }
    }
}

function showHomeScreen(pageIndex = 0) {
    const screen = document.querySelector('.screen');
    screen.classList.remove('app-open');
    screen.innerHTML = '';
    
    // Add navigation buttons
    if (appPages.length > 1) {
        // Up button (if not on first page)
        if (pageIndex > 0) {
            const upButton = document.createElement('button');
            upButton.className = 'page-nav-button up-button';
            upButton.innerHTML = '▲';
            screen.appendChild(upButton);
            
            upButton.addEventListener('click', () => {
                showHomeScreen(pageIndex - 1);
            });
        }
        
        // Down button (if not on last page)
        if (pageIndex < appPages.length - 1) {
            const downButton = document.createElement('button');
            downButton.className = 'page-nav-button down-button';
            downButton.innerHTML = '▼';
            screen.appendChild(downButton);
            
            downButton.addEventListener('click', () => {
                showHomeScreen(pageIndex + 1);
            });
        }
    }
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'home-screen-grid';
    screen.appendChild(gridContainer);
    
    appPages[pageIndex].forEach(app => {
        const icon = document.createElement('div');
        icon.className = 'app-icon';
        icon.innerHTML = `
            ${app.emoji}
            <span>${app.name}</span>
        `;
        icon.addEventListener('click', () => openApp(app.name));
        gridContainer.appendChild(icon);
    });

    currentPage = pageIndex;
}

function showLockScreen() {
    const screen = document.querySelector('.screen');
    screen.classList.remove('app-open');
    screen.innerHTML = '<div class="time">12:00</div>';
    updateTime();
}

// Toggle between screens
function toggleScreen() {
    const screen = document.querySelector('.screen');
    
    if (screen.classList.contains('app-open')) {
        showHomeScreen();
    } else if (screen.querySelector('.app-icon')) {
        showLockScreen();
    } else {
        showHomeScreen();
    }
}

// Initialize
updateTime();
setInterval(updateTime, 1000);

// Event listeners
document.querySelector('.button').addEventListener('click', toggleScreen);
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        toggleScreen();
    } else if (event.code === 'Escape') {
        const screen = document.querySelector('.screen');
        if (screen.classList.contains('app-open')) {
            showHomeScreen();
        }
    }
});

// Add wheel event listener for scrolling
function handleScroll(event) {
    if (isAnimating) return;

    const screen = document.querySelector('.screen');
    const gridContainer = screen.querySelector('.home-screen-grid');
    
    if (!screen.classList.contains('app-open')) {
        if (event.deltaY > 0 && currentPage < appPages.length - 1) {
            // Scroll down to next page
            isAnimating = true;
            
            // Create new grid
            const newGrid = document.createElement('div');
            newGrid.className = 'home-screen-grid';
            newGrid.style.opacity = '0';
            newGrid.style.transform = 'scale(0.8)';
            screen.appendChild(newGrid);
            
            // Add apps to new grid
            appPages[currentPage + 1].forEach(app => {
                const icon = document.createElement('div');
                icon.className = 'app-icon';
                icon.innerHTML = `
                    ${app.emoji}
                    <span>${app.name}</span>
                `;
                icon.addEventListener('click', () => openApp(app.name));
                newGrid.appendChild(icon);
            });
            
            // Animate out current grid
            gridContainer.style.opacity = '0';
            gridContainer.style.transform = 'scale(1.2)';
            
            // Animate in new grid
            requestAnimationFrame(() => {
                newGrid.style.opacity = '1';
                newGrid.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    gridContainer.remove();
                    currentPage++;
                    isAnimating = false;
                }, 300);
            });
            
        } else if (event.deltaY < 0 && currentPage > 0) {
            // Scroll up to previous page
            isAnimating = true;
            
            // Create new grid
            const newGrid = document.createElement('div');
            newGrid.className = 'home-screen-grid';
            newGrid.style.opacity = '0';
            newGrid.style.transform = 'scale(0.8)';
            screen.appendChild(newGrid);
            
            // Add apps to new grid
            appPages[currentPage - 1].forEach(app => {
                const icon = document.createElement('div');
                icon.className = 'app-icon';
                icon.innerHTML = `
                    ${app.emoji}
                    <span>${app.name}</span>
                `;
                icon.addEventListener('click', () => openApp(app.name));
                newGrid.appendChild(icon);
            });
            
            // Animate out current grid
            gridContainer.style.opacity = '0';
            gridContainer.style.transform = 'scale(1.2)';
            
            // Animate in new grid
            requestAnimationFrame(() => {
                newGrid.style.opacity = '1';
                newGrid.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    gridContainer.remove();
                    currentPage--;
                    isAnimating = false;
                }, 300);
            });
        }
    }
}

// Update event listeners
document.addEventListener('wheel', handleScroll);

// Add Snake game logic
let snake, food, direction, gameLoop, score;

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 10;
    
    snake = [{ x: 5, y: 5 }];
    food = generateFood();
    direction = 'right';
    score = 0;
    
    function generateFood() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }
    
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#0f0';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Draw food
        ctx.fillStyle = '#f00';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    }
    
    function moveSnake() {
        const head = { ...snake[0] };
        
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check collision with walls
        if (head.x < 0 || head.x >= canvas.width / gridSize ||
            head.y < 0 || head.y >= canvas.height / gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }
        
        snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            score += 10;
            document.getElementById('scoreDisplay').textContent = score;
        } else {
            snake.pop();
        }
    }
    
    function gameStep() {
        moveSnake();
        drawGame();
    }
    
    function startGame() {
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, 100);
    }
    
    function endGame() {
        clearInterval(gameLoop);
        showWatchNotification(`Game Over! Score: ${score}`);
        snake = [{ x: 5, y: 5 }];
        direction = 'right';
        score = 0;
        document.getElementById('scoreDisplay').textContent = score;
    }
    
    // Add event listeners for controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });
    
    document.getElementById('startGame').addEventListener('click', startGame);
    
    // Initial draw
    drawGame();
}

// Add this near the other app content generator functions
function getGamesContent() {
    return `
        <div class="app-content games">
            <h2>Games</h2>
            <div class="games-grid">
                <div class="game-choice" data-game="snake">
                    <div class="game-icon">🐍</div>
                    <span>Snake</span>
                </div>
                <div class="game-choice" data-game="tictactoe">
                    <div class="game-icon">⭕</div>
                    <span>Tic Tac Toe</span>
                </div>
                <div class="game-choice" data-game="trx">
                    <div class="game-icon">🏃</div>
                    <span>TRX Runner</span>
                </div>
            </div>
        </div>
    `;
}

function getSnakeGameContent() {
    return `
        <div class="app-content snake-game">
            <div class="game-header">
                <button class="back-button">←</button>
                <h2>Snake</h2>
            </div>
            <canvas id="gameCanvas" width="150" height="150"></canvas>
            <div class="game-controls">
                <button id="startGame">Start Game</button>
                <div class="score">Score: <span id="scoreDisplay">0</span></div>
            </div>
        </div>
    `;
}

// Add this near your other game content functions
function getTicTacToeContent() {
    return `
        <div class="app-content tictactoe-game">
            <div class="game-header">
                <button class="back-button">←</button>
                <h2>Tic Tac Toe</h2>
            </div>
            <div class="game-status">Player X's Turn</div>
            <div class="tictactoe-board">
                <div class="cell" data-index="0"></div>
                <div class="cell" data-index="1"></div>
                <div class="cell" data-index="2"></div>
                <div class="cell" data-index="3"></div>
                <div class="cell" data-index="4"></div>
                <div class="cell" data-index="5"></div>
                <div class="cell" data-index="6"></div>
                <div class="cell" data-index="7"></div>
                <div class="cell" data-index="8"></div>
            </div>
            <button id="restartTicTacToe">Restart Game</button>
        </div>
    `;
}
// Add Tic-tac-toe game logic
function initTicTacToe() {
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const statusDisplay = document.querySelector('.game-status');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restartTicTacToe');
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    function handleCellClick(clickedCell, clickedCellIndex) {
        if (gameBoard[clickedCellIndex] !== '' || !gameActive) return;
        
        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        checkWin();
        checkDraw();
        
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.innerHTML = `Player ${currentPlayer}'s Turn`;
        }
    }
    
    function checkWin() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                statusDisplay.innerHTML = `Player ${currentPlayer} Wins!`;
                showWatchNotification(`Player ${currentPlayer} Wins!`);
                return;
            }
        }
    }
    
    function checkDraw() {
        if (!gameBoard.includes('') && gameActive) {
            gameActive = false;
            statusDisplay.innerHTML = 'Game Draw!';
            showWatchNotification('Game Draw!');
        }
    }
    
    function restartGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        statusDisplay.innerHTML = `Player ${currentPlayer}'s Turn`;
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o');
        });
    }
    
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index));
    });
    
    restartButton.addEventListener('click', restartGame);
}

// Add Mario game content function
function getMarioGameContent() {
    return `
        <div class="app-content mario-game">
            <div class="game-header">
                <button class="back-button">←</button>
                <h2>Mario</h2>
            </div>
            <canvas id="marioCanvas" width="150" height="150"></canvas>
            <div class="game-controls">

                <button id="startMario">Start Game</button>
            </div>
        </div>
    `;
}

// Add Mario game initialization and logic
function initMarioGame() {
    const canvas = document.getElementById('marioCanvas');
    const ctx = canvas.getContext('2d');
    let gameLoop;
    let score = 0;
    
    // Mario character
    const mario = {
        x: 20,
        y: canvas.height - 30,
        width: 20,
        height: 20,
        jumping: false,
        velocityY: 0
    };
    
    // Platform
    const platform = {
        x: 0,
        y: canvas.height - 10,
        width: canvas.width,
        height: 10
    };
    
    // Obstacles
    let obstacles = [];
    
    function createObstacle() {
        obstacles.push({
            x: canvas.width,
            y: platform.y - 20,
            width: 15,
            height: 20
        });
    }
    
    function drawMario() {
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
    }
    
    function drawPlatform() {
        ctx.fillStyle = 'green';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    function drawObstacles() {
        ctx.fillStyle = 'brown';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    function jump() {
        if (!mario.jumping) {
            mario.jumping = true;
            mario.velocityY = -10;
        }
    }
    
    function update() {
        // Apply gravity
        mario.velocityY += 0.5;
        mario.y += mario.velocityY;
        
        // Platform collision
        if (mario.y + mario.height > platform.y) {
            mario.y = platform.y - mario.height;
            mario.jumping = false;
            mario.velocityY = 0;
        }
        
        // Move obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= 3;
            
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score += 10;
            }
            
            if (mario.x < obstacle.x + obstacle.width &&
                mario.x + mario.width > obstacle.x &&
                mario.y < obstacle.y + obstacle.height &&
                mario.y + mario.height > obstacle.y) {
                endMarioGame();
            }
        });
        
        // Create new obstacles
        if (Math.random() < 0.02) {
            createObstacle();
        }
    }
    
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw score at the top of the canvas
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);
        
        drawPlatform();
        drawMario();
        drawObstacles();
    }
    
    function gameStep() {
        update();
        draw();
    }
    
    function startMarioGame() {
        if (gameLoop) clearInterval(gameLoop);
        obstacles = [];
        score = 0;
        mario.x = 20;
        mario.y = canvas.height - 30;
        mario.jumping = false;
        mario.velocityY = 0;
        gameLoop = setInterval(gameStep, 1000/60);
    }
    
    function endMarioGame() {
        clearInterval(gameLoop);
        showWatchNotification(`Game Over! Score: ${score}`);
        startMarioGame();
    }
    
    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
            e.preventDefault();
        }
    });
    
    canvas.addEventListener('click', jump);
    document.getElementById('startMario').addEventListener('click', startMarioGame);
    
    // Initial draw
    draw();

    document.querySelector('.back-button').addEventListener('click', () => {
        clearInterval(gameLoop);
    });
}

// Add this new function to handle weather API calls
async function fetchWeatherData(city) {
    const weatherInfo = document.querySelector('.weather-info');
    
    try {
        weatherInfo.innerHTML = '<div class="weather-loading">Loading...</div>';
        
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=6c4f1f6d4f7c4d3e9a4175023241503&q=${city}&aqi=no`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        
        weatherInfo.innerHTML = `
            <div class="temp">${data.current.temp_c}°C</div>
            <div class="condition">
                <img src="${data.current.condition.icon}" alt="weather icon">
                ${data.current.condition.text}
            </div>
            <div class="weather-details">
                <div>Humidity: ${data.current.humidity}%</div>
                <div>Wind: ${data.current.wind_kph} km/h</div>
            </div>
        `;
    } catch (error) {
        weatherInfo.innerHTML = `
            <div class="weather-error">
                ${error.message === 'City not found' ? 'City not found. Please check the spelling.' : 'Error fetching weather data'}
            </div>
        `;
        console.error('Weather API Error:', error);
    }
}

// Update the getChromeContent function to only show the browser
function getChromeContent() {
    return `
        <div class="app-content chrome">
            <iframe id="browserFrame" src="https://www.google.com/webhp?igu=1" frameborder="0"></iframe>
        </div>
    `;
}

// Add the wallpaper content generator function
function getWallpaperContent() {
    const wallpapers = [
        { name: 'Space', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400' },
        { name: 'Ocean', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400' },
        { name: 'Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
        { name: 'Mountain', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
        { name: 'Aurora', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400' },
        { name: 'Desert', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400' },
        { name: 'City', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400' },
        { name: 'Galaxy', url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400' },
        { name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
        { name: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400' }
    ];

    const straps = [
        { name: 'Classic Black', color: '#333333' },
        { name: 'Navy Blue', color: '#1B4079' },
        { name: 'Red Leather', color: '#8B0000' },
        { name: 'Brown Leather', color: '#8B4513' },
        { name: 'White Sport', color: '#F5F5F5' },
        { name: 'Pink', color: '#FFB6C1' },
        { name: 'Green Sport', color: '#228B22' },
        { name: 'Purple', color: '#800080' }
    ];

    return `
        <div class="app-content wallpaper">
            <div class="customize-header">
                <button class="back-button">←</button>
                <h2>Customize Watch</h2>
            </div>
            
            <div class="customize-container">
                <div class="customize-tabs">
                    <button class="tab-button active" onclick="switchTab('wallpaper')">Wallpaper</button>
                    <button class="tab-button" onclick="switchTab('straps')">Straps</button>
                </div>

                <div id="wallpaper-tab" class="tab-content active">
                    <div class="wallpaper-grid">
                        ${wallpapers.map(wp => `
                            <div class="wallpaper-item" data-url="${wp.url}">
                                <img src="${wp.url}" alt="${wp.name}">
                                <span>${wp.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div id="straps-tab" class="tab-content">
                    <div class="straps-grid">
                        ${straps.map(strap => `
                            <div class="strap-item" data-color="${strap.color}">
                                <div class="strap-preview" style="background-color: ${strap.color}"></div>
                                <span>${strap.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add this new function to change strap color
function changeStrapColor(color) {
    const strapTop = document.querySelector('.strap-top');
    const strapBottom = document.querySelector('.strap-bottom');
    
    if (strapTop && strapBottom) {
        strapTop.style.backgroundColor = color;
        strapBottom.style.backgroundColor = color;
        
        // Save the color preference
        localStorage.setItem('watchStrapColor', color);
        
        // Show notification
        showWatchNotification('Strap color updated!');
    }
}

function initWallpaperApp() {
    // Add event listeners for strap colors
    document.querySelectorAll('.strap-item').forEach(item => {
        item.addEventListener('click', function() {
            const color = this.dataset.color;
            const straps = document.querySelectorAll('.smart-watch .strap');
            straps.forEach(strap => {
                strap.style.backgroundColor = color;
            });
            showWatchNotification('Strap color updated!');
        });
    });

    // Wallpaper selection (existing code)
    document.querySelectorAll('.wallpaper-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            document.querySelector('.screen').style.backgroundImage = `url(${url})`;
            localStorage.setItem('watchWallpaper', url);
            showWatchNotification('Wallpaper changed!');
        });
    });

    // Back button (existing code)
    document.querySelector('.back-button')?.addEventListener('click', () => {
        showHomeScreen();
    });
}

// Function to show notification
function showWatchNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'watch-notification';
    notification.textContent = message;
    document.querySelector('.smart-watch').appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Load saved preferences on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedStrapColor = localStorage.getItem('watchStrapColor');
    if (savedStrapColor) {
        changeStrapColor(savedStrapColor);
    }
    
    const savedWallpaper = localStorage.getItem('watchWallpaper');
    if (savedWallpaper) {
        document.querySelector('.screen').style.backgroundImage = `url(${savedWallpaper})`;
    }
});

// Update the switchTab function to ensure event listeners are reattached
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked tab button
    document.querySelector(`.tab-button[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Reinitialize event listeners if needed
    if (tabName === 'straps') {
        initWallpaperApp();
    }
}

// Update the Settings app content in your existing app definitions
function getSettingsContent() {
    const savedIconSize = localStorage.getItem('iconSize') || '1.8';
    const savedBrightness = localStorage.getItem('brightness') || '1';

    return `
        <div class="app-content settings">
            <h2>Settings</h2>
            <div class="settings-controls">
                <div class="setting-item">
                    <label for="iconSize">Icon Size</label>
                    <div class="icon-size-preview">
                        <div class="preview-icon" style="font-size: ${savedIconSize}em">
                            ⚪
                            <span>Preview</span>
                        </div>
                    </div>
                    <input type="range" id="iconSize" min="1" max="2.5" step="0.1" value="${savedIconSize}">
                    <span class="size-value">${savedIconSize}x</span>
                </div>
                
                <div class="setting-item">
                    <label for="brightness">Screen Brightness</label>
                    <input type="range" id="brightness" min="0.3" max="1" step="0.1" value="${savedBrightness}">
                    <span class="brightness-value">${Math.round(savedBrightness * 100)}%</span>
                </div>
            </div>
        </div>
    `;
}

// Update the existing initSettings function to include localStorage
function initSettings() {
    const iconSizeSlider = document.getElementById('iconSize');
    const sizeValue = document.querySelector('.size-value');
    const previewIcon = document.querySelector('.preview-icon');
    
    if (iconSizeSlider && sizeValue && previewIcon) {
        // Get saved icon size or use default of 1.8
        const savedIconSize = localStorage.getItem('iconSize') || '1.8';
        
        // Set initial values
        iconSizeSlider.value = savedIconSize;
        sizeValue.textContent = `${savedIconSize}x`;
        previewIcon.style.fontSize = `${savedIconSize}em`;
        
        iconSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            previewIcon.style.fontSize = `${size}em`;
            sizeValue.textContent = `${size}x`;
            document.documentElement.style.setProperty('--icon-size', `${size}em`);
            localStorage.setItem('iconSize', size);
        });
    }

    // Keep existing brightness control code
    const brightnessSlider = document.getElementById('brightness');
    const brightnessValue = document.querySelector('.brightness-value');
    const screen = document.querySelector('.screen');
    
    if (brightnessSlider && brightnessValue && screen) {
        const savedBrightness = localStorage.getItem('brightness') || '1';
        brightnessSlider.value = savedBrightness;
        brightnessValue.textContent = `${Math.round(savedBrightness * 100)}%`;
        screen.style.setProperty('--brightness-level', savedBrightness);
        
        brightnessSlider.addEventListener('input', (e) => {
            const brightness = e.target.value;
            const percentage = Math.round(brightness * 100);
            screen.style.setProperty('--brightness-level', brightness);
            brightnessValue.textContent = `${percentage}%`;
            localStorage.setItem('brightness', brightness);
        });
    }
}

// Call applySavedSettings when the app starts
document.addEventListener('DOMContentLoaded', applySavedSettings);

// Add these new functions after your existing game-related functions
function getTrxGameContent() {
    return `
        <div class="app-content trx-game">
            <div class="game-header">
                <button class="back-button">←</button>
                <h2>TRX Runner</h2>
                <div class="score">Score: <span id="trxScore">0</span></div>
            </div>
            <canvas id="trxCanvas" width="150" height="150"></canvas>
            <div class="game-controls">
                <button id="startTrx">Start Game</button>
                <button id="jumpTrx">Jump</button>
            </div>
        </div>
    `;
}

function initTrxGame() {
    const canvas = document.getElementById('trxCanvas');
    const ctx = canvas.getContext('2d');
    let gameLoop;
    let score = 0;
    let isGameRunning = false;
    
    // Adjusted game parameters
    let obstacleSpeed = 3; // Increased initial speed
    let obstacleSpawnRate = 0.01; // Decreased spawn rate for better spacing
    const MAX_SPEED = 5; // Slightly increased max speed
    const MAX_SPAWN_RATE = 0.02; // Decreased max spawn rate
    const MIN_OBSTACLE_GAP = 100; // Minimum pixels between obstacles
    
    // Improved runner physics
    const runner = {
        x: 30,
        y: canvas.height - 30,
        width: 20,  // Adjusted to match emoji size
        height: 20, // Adjusted to match emoji size
        jumping: false,
        velocityY: 0,
        gravity: 0.7,
        jumpForce: -11
    };
    
    const ground = {
        y: canvas.height - 10,
        height: 10
    };
    
    let obstacles = [];
    
    function createObstacle() {
        // Check distance from last obstacle
        const lastObstacle = obstacles[obstacles.length - 1];
        if (lastObstacle && lastObstacle.x > canvas.width - MIN_OBSTACLE_GAP) {
            return; // Ensure minimum gap
        }

        // Randomize obstacle height with consistent range
        const minHeight = 12;
        const maxHeight = 18;
        const height = minHeight + Math.random() * (maxHeight - minHeight);

        obstacles.push({
            x: canvas.width,
            y: ground.y - height,
            width: 10,
            height: height
        });
    }
    
    function jump() {
        if (!runner.jumping && isGameRunning) {
            runner.jumping = true;
            runner.velocityY = runner.jumpForce;
        }
    }
    
    function update() {
        if (!isGameRunning) return;
        
        // Update runner
        runner.velocityY += runner.gravity;
        runner.y += runner.velocityY;
        
        // Ground collision
        if (runner.y + runner.height > ground.y) {
            runner.y = ground.y - runner.height;
            runner.jumping = false;
            runner.velocityY = 0;
        }
        
        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            obstacle.x -= obstacleSpeed;
            
            // Remove passed obstacles
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(i, 1);
                score += 10;
                document.getElementById('trxScore').textContent = score;
                
                // More gradual difficulty increase
                if (score % 100 === 0 && score <= 500) { // Cap difficulty increase at 500 points
                    obstacleSpeed = Math.min(obstacleSpeed + 0.2, MAX_SPEED);
                    obstacleSpawnRate = Math.min(obstacleSpawnRate + 0.001, MAX_SPAWN_RATE);
                }
            }
            
            // Collision detection
            if (runner.x < obstacle.x + obstacle.width - 4 &&
                runner.x + runner.width - 4 > obstacle.x &&
                runner.y < obstacle.y + obstacle.height - 2 &&
                runner.y + runner.height > obstacle.y + 2) {
                endTrxGame();
            }
        }
        
        // Spawn new obstacles with better spacing control
        if (Math.random() < obstacleSpawnRate && obstacles.length < 2) { // Reduced max obstacles
            createObstacle();
        }
    }
    
    function draw() {
        // Clear and draw background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, ground.y, canvas.width, ground.height);
        
        // Draw reversed dinosaur emoji
        ctx.save();  // Save current context state
        ctx.scale(-1, 1);  // Flip horizontally
        ctx.font = '20px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillText('🦖', -runner.x - 22, runner.y + runner.height + 2);  // Adjust position for reversed drawing
        ctx.restore();  // Restore context state
        
        // Draw obstacles
        ctx.fillStyle = '#FF4444';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);
        
        // Draw start message if not running
        if (!isGameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '14px Arial';
            ctx.fillText('Press Start or Space to play', canvas.width/2, canvas.height/2);
            ctx.textAlign = 'left';
        }
    }
    
    function gameStep() {
        update();
        draw();
        if (isGameRunning) {
            requestAnimationFrame(gameStep);
        }
    }
    
    function startTrxGame() {
        if (isGameRunning) return;
        
        // Reset game state
        obstacles = [];
        score = 0;
        obstacleSpeed = 3; // Reset to initial speed
        obstacleSpawnRate = 0.01; // Reset to initial spawn rate
        document.getElementById('trxScore').textContent = score;
        
        // Reset runner
        runner.x = 30;
        runner.y = canvas.height - 30;
        runner.jumping = false;
        runner.velocityY = 0;
        
        isGameRunning = true;
        requestAnimationFrame(gameStep);
    }
    
    function endTrxGame() {
        isGameRunning = false;
        showWatchNotification(`Game Over! Score: ${score}`);
        draw(); // Draw final state
    }
    
    function setupControls() {
        // Keyboard controls - Add these event listeners to the window
        window.addEventListener('keydown', function(e) {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
                e.preventDefault();
                if (!isGameRunning) {
                    startTrxGame();
                } else {
                    jump();
                }
            }
        });

        // Start button
        const startButton = document.getElementById('startTrx');
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isGameRunning) {
                startTrxGame();
            }
        });

        // Jump button
        const jumpButton = document.getElementById('jumpTrx');
        jumpButton.addEventListener('click', (e) => {
            e.preventDefault();
            jump();
        });

        // Touch controls for the canvas
        canvas.addEventListener('click', () => {
            if (!isGameRunning) {
                startTrxGame();
            } else {
                jump();
            }
        });

        // Back button
        const backButton = document.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            isGameRunning = false;
            openApp('Games');
        });
    }

    // Clean up function to remove event listeners when leaving the game
    function cleanup() {
        window.removeEventListener('keydown', jump);
        isGameRunning = false;
    }

    // Set up the controls
    setupControls();

    // Initial draw
    draw();

    // Add cleanup when leaving
    document.querySelector('.back-button').addEventListener('click', cleanup);
}

let isLightOn = false;
let lightEffect = null;
let lightOptions = null;

document.querySelector('.lamp-emoji').addEventListener('click', function() {
    if (!isLightOn) {
        // إضاءة المصباح
        if (!lightEffect) {
            // إنشاء تأثير الإضاءة
            lightEffect = document.createElement('div');
            lightEffect.className = 'light-effect';
            document.querySelector('.container').appendChild(lightEffect);
            
            // إنشاء قائمة الخيارات
            lightOptions = document.createElement('div');
            lightOptions.className = 'light-options';
            lightOptions.innerHTML = `
                <div class="light-option" data-option="smart-watch">Smart Watch</div>
                <div class="light-option" data-option="computer">Computer</div>
            `;
            document.querySelector('.container').appendChild(lightOptions);
            
            // إضافة مستمعي الأحداث للخيارات
            lightOptions.querySelectorAll('.light-option').forEach(option => {
                option.addEventListener('click', function() {
                    const selectedOption = this.dataset.option;
                    if (selectedOption === 'smart-watch') {
                        window.location.href = 'index.html';
                    } else if (selectedOption === 'computer') {
                        window.location.href = 'computer.html';
                    }
                });
            });

            // تفعيل الإضاءة فوراً
            setTimeout(() => {
                lightEffect.classList.add('active');
            }, 10);

            // تفعيل الخيارات بعد نصف ثانية
            setTimeout(() => {
                lightOptions.classList.add('active');
            }, 500);
        }
    } else {
        // إطفاء المصباح
        if (lightEffect) {
            lightEffect.classList.remove('active');
            lightOptions.classList.remove('active');
            setTimeout(() => {
                lightEffect.remove();
                lightOptions.remove();
                lightEffect = null;
                lightOptions = null;
            }, 300);
        }
    }
    isLightOn = !isLightOn;
});


