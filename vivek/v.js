let score = 0;
        let bestScore = localStorage.getItem('bestScore') || 0;
        document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;

        let board;
        let size = 4; // Size of the grid

        // Initialize the board for the 2048 game
        function initBoard() {
            board = Array(size).fill().map(() => Array(size).fill(0));
            addRandomTile();
            addRandomTile();
            updateBoard();
            score = 0;
            document.getElementById('score').textContent = `Score: ${score}`;
            document.getElementById('game-over-message').style.display = 'none';
        }

        // Add a random tile (2 or 4)
        function addRandomTile() {
            let emptyTiles = [];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (board[r][c] === 0) {
                        emptyTiles.push({ r, c });
                    }
                }
            }
            if (emptyTiles.length > 0) {
                let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
                board[r][c] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        // Update the visual board
        function updateBoard() {
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    let tile = document.getElementById(`tile-${r}-${c}`);
                    tile.textContent = board[r][c] === 0 ? '' : board[r][c];
                    tile.className = 'tile';
                    if (board[r][c] !== 0) {
                        tile.classList.add(`tile-${board[r][c]}`);
                    }
                }
            }
        }

        // Move and merge logic for keyboard and touch events
        function move(direction) {
            let moved = false;
            if (direction === 'left') moved = moveLeft();
            else if (direction === 'right') moved = moveRight();
            else if (direction === 'up') moved = moveUp();
            else if (direction === 'down') moved = moveDown();

            if (moved) {
                addRandomTile();
                updateBoard();
            }

            if (isGameOver()) {
                document.getElementById('game-over-message').style.display = 'block';
            }
        }

        // Handle keyboard input
        window.addEventListener('keydown', function (e) {
            switch (e.key) {
                case 'ArrowUp':
                    move('up');
                    break;
                case 'ArrowDown':
                    move('down');
                    break;
                case 'ArrowLeft':
                    move('left');
                    break;
                case 'ArrowRight':
                    move('right');
                    break;
            }
        });

        // Handle swipe gestures for mobile devices
        let touchStartX = 0;
        let touchStartY = 0;

        window.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        window.addEventListener('touchend', function (e) {
            let touchEndX = e.changedTouches[0].screenX;
            let touchEndY = e.changedTouches[0].screenY;

            let diffX = touchEndX - touchStartX;
            let diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) move('right');
                else move('left');
            } else {
                if (diffY > 0) move('down');
                else move('up');
            }
        });

        // Define the movement and merging logic for each direction
        function moveLeft() {
            let moved = false;
            for (let r = 0; r < size; r++) {
                let row = board[r].filter(val => val); // Filter out zeroes
                while (row.length < size) row.push(0); // Pad with zeroes

                for (let c = 0; c < size - 1; c++) {
                    if (row[c] && row[c] === row[c + 1]) {
                        row[c] *= 2;
                        row[c + 1] = 0;
                        score += row[c];
                        updateScore(row[c]);
                    }
                }

                let newRow = row.filter(val => val);
                while (newRow.length < size) newRow.push(0);

                if (newRow.toString() !== board[r].toString()) {
                    board[r] = newRow;
                    moved = true;
                }
            }
            return moved;
        }

        function moveRight() {
            rotateBoard();
            rotateBoard();
            let moved = moveLeft();
            rotateBoard();
            rotateBoard();
            return moved;
        }

        function moveUp() {
            rotateBoard();
            rotateBoard();
            rotateBoard();
            let moved = moveLeft();
            rotateBoard();
            return moved;
        }

        function moveDown() {
            rotateBoard();
            let moved = moveLeft();
            rotateBoard();
            rotateBoard();
            rotateBoard();
            return moved;
        }

        // Rotate the board to simplify directional movement logic
        function rotateBoard() {
            let newBoard = Array(size).fill().map(() => Array(size).fill(0));
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    newBoard[c][size - r - 1] = board[r][c];
                }
            }
            board = newBoard;
        }

        // Check for game over condition
        function isGameOver() {
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (board[r][c] === 0) return false;
                    if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
                    if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
                }
            }
            return true;
        }

        // Update score
        function updateScore(points) {
            score += points;
            document.getElementById('score').textContent = `Score: ${score}`;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
            }
        }

        // Validate login and show game
        function validateLogin() {
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var phoneNumber = document.getElementById('phoneNumber').value;
            if (name && email && password && phoneNumber) {
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('info-section').classList.add('hidden');
                document.getElementById('game-board').style.display = 'block';
                document.getElementById('score-section').style.visibility = 'visible';
                initBoard(); // Start the game
            } else {
                alert("Please fill out all fields!");
            }
        }

        // Restart the game
        document.getElementById('restart-btn').addEventListener('click', function () {
            initBoard();
        });
