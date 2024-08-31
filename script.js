document.addEventListener('DOMContentLoaded', function () {
    const maze = document.getElementById('maze');
    const rows = 20;
    const cols = 20;
    let playerPosition = { row: 0, col: 0 };
    let moves = 0;
    let time = 0;
    let timerInterval;

    // Direções possíveis para mover (cima, baixo, esquerda, direita)
    const directions = [
        { row: -1, col: 0 },  // Cima
        { row: 1, col: 0 },   // Baixo
        { row: 0, col: -1 },  // Esquerda
        { row: 0, col: 1 }    // Direita
    ];

    // Função para criar o labirinto
    function createMaze() {
        maze.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            let row = maze.insertRow();
            for (let c = 0; c < cols; c++) {
                let cell = row.insertCell();
                cell.classList.add('wall'); // Todas as células começam como paredes
            }
        }
    }

    // Algoritmo backtracking para criar o labirinto com caminho garantido
    function generateMaze(row, col) {
        maze.rows[row].cells[col].classList.remove('wall');
        const shuffledDirections = directions.sort(() => Math.random() - 0.5);

        for (let direction of shuffledDirections) {
            const newRow = row + direction.row * 2;
            const newCol = col + direction.col * 2;

            if (isValidCell(newRow, newCol)) {
                maze.rows[row + direction.row].cells[col + direction.col].classList.remove('wall');
                generateMaze(newRow, newCol);
            }
        }
    }

    // Verificar se a célula está dentro dos limites
    function isValidCell(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols && maze.rows[row].cells[col].classList.contains('wall');
    }

    // Função para garantir que a célula de chegada (objetivo) seja acessível
    function ensureGoalAccess() {
        // Remover as paredes próximas ao objetivo
        if (cols > 1) {
            maze.rows[rows - 1].cells[cols - 2].classList.remove('wall'); // Célula à esquerda da célula de chegada
        }
        if (rows > 1) {
            maze.rows[rows - 2].cells[cols - 1].classList.remove('wall'); // Célula acima da célula de chegada
        }
        maze.rows[rows - 1].cells[cols - 1].style.borderLeft = 'none'; // Remover borda esquerda da célula de chegada
    }

    // Função para mover o jogador
    function movePlayer(newRow, newCol) {
        const newCell = maze.rows[newRow]?.cells[newCol];
        if (newCell && !newCell.classList.contains('wall')) {
            maze.rows[playerPosition.row].cells[playerPosition.col].classList.remove('player');
            newCell.classList.add('player');
            playerPosition = { row: newRow, col: newCol };
            moves++;
            document.getElementById('moves').textContent = moves;

            // Verificar se atingiu o objetivo
            if (newCell.classList.contains('goal')) {
                clearInterval(timerInterval);
                alert('Parabéns! Você venceu o jogo em ' + time + ' segundos e ' + moves + ' movimentos!');
                resetGame();
            }
        }
    }

    // Controle pelo teclado
    document.addEventListener('keydown', function (event) {
        const key = event.key;
        switch (key) {
            case 'ArrowUp':
                movePlayer(playerPosition.row - 1, playerPosition.col);
                break;
            case 'ArrowDown':
                movePlayer(playerPosition.row + 1, playerPosition.col);
                break;
            case 'ArrowLeft':
                movePlayer(playerPosition.row, playerPosition.col - 1);
                break;
            case 'ArrowRight':
                movePlayer(playerPosition.row, playerPosition.col + 1);
                break;
        }
    });

    // Controle por toque
    document.getElementById('up').addEventListener('click', () => movePlayer(playerPosition.row - 1, playerPosition.col));
    document.getElementById('down').addEventListener('click', () => movePlayer(playerPosition.row + 1, playerPosition.col));
    document.getElementById('left').addEventListener('click', () => movePlayer(playerPosition.row, playerPosition.col - 1));
    document.getElementById('right').addEventListener('click', () => movePlayer(playerPosition.row, playerPosition.col + 1));

    // Função para iniciar o cronômetro
    function startTimer() {
        time = 0;
        document.getElementById('time').textContent = time;
        timerInterval = setInterval(() => {
            time++;
            document.getElementById('time').textContent = time;
        }, 1000);
    }

    // Função para reiniciar o jogo
    function resetGame() {
        clearInterval(timerInterval); // Parar o cronômetro anterior
        moves = 0;
        document.getElementById('moves').textContent = moves;

        // Criar um novo labirinto
        createMaze();
        generateMaze(0, 0);

        // Remover as paredes ao redor da célula de chegada
        ensureGoalAccess();

        // Definir o jogador na posição inicial e o objetivo
        maze.rows[0].cells[0].classList.add('player');
        maze.rows[rows - 1].cells[cols - 1].classList.remove('wall');
        maze.rows[rows - 1].cells[cols - 1].classList.add('goal');

        playerPosition = { row: 0, col: 0 };
        startTimer();
    }

    // Iniciar o jogo
    resetGame();

    // Ação para o botão de reinício
    document.getElementById('restart').addEventListener('click', resetGame);
});

