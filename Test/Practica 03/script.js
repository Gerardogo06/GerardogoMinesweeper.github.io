let firstClick = true;
let gamestatus = true;
let numMines = 1;

function easy() {
    const rows = document.getElementById("rows").value = 5;
    const columns = document.getElementById("columns").value = 5;
    numMines = 1;
    generateTable();
}

function mid() {
    const rows = document.getElementById("rows").value = 8;
    const columns = document.getElementById("columns").value = 8;
    numMines = 20;
    generateTable();
}

function hard() {
    const rows = document.getElementById("rows").value = 10;
    const columns = document.getElementById("columns").value = 10;
    numMines = 30;
    generateTable();
}

function hardcore() {
    const rows = document.getElementById("rows").value = 16;
    const columns = document.getElementById("columns").value = 16;
    numMines = 50;
    generateTable();
}

function leyend() {
    const rows = document.getElementById("rows").value = 25;
    const columns = document.getElementById("columns").value = 25;
    numMines = 120;
    generateTable();
}

function generateTable() {
    const rows = parseInt(document.getElementById("rows").value);
    const columns = parseInt(document.getElementById("columns").value);
    const table = document.getElementById("buttonTable");

    table.innerHTML = "";
    firstClick = true;

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.className = "game-button";
            button.textContent = "";
            button.dataset.value = ""; 
            button.onclick = () => handleCellClick(i, j, rows, columns);
            button.oncontextmenu = (e) => Bandera(e, button); 
            cell.appendChild(button);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function Bandera(event, button) {
    event.preventDefault(); 
    if (!button.disabled) {
        if (button.querySelector("img")) {
            button.innerHTML = ""; 

            if (button.dataset.value === "M") {
                remainingMines++;
            }
        } else {
            const img = document.createElement("img");
            img.src = "imagenes/Flag.png"; 
            img.alt = "Bandera";
            button.appendChild(img); 
            
            if (button.dataset.value === "M") {
                remainingMines--;
            }
        }
        
        verificarVictoria();
    }
}


function handleCellClick(row, col, rows, columns) {
    const table = document.getElementById("buttonTable");

    if (firstClick) {
        generarMinas(rows, columns, numMines, row, col); 
        firstClick = false;
        revealMultipleCells(row, col); 
    } else {
        const cellValue = table.rows[row].cells[col].querySelector(".game-button").dataset.value;
        revealCell(row, col, cellValue); 
    }
}

function generarMinas(rows, columns, numMines, initialRow, initialCol) {
    const table = document.getElementById("buttonTable");
    let minesPlaced = 0;

    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * columns);

        const cellButton = table.rows[row].cells[col].querySelector(".game-button");
        if ((row !== initialRow || col !== initialCol) && cellButton.dataset.value !== "M") {
            cellButton.dataset.value = "M"; 
            minesPlaced++;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const adjRow = row + i;
                    const adjCol = col + j;
                    if (
                        adjRow >= 0 && adjRow < rows &&
                        adjCol >= 0 && adjCol < columns &&
                        table.rows[adjRow].cells[adjCol].querySelector(".game-button").dataset.value !== "M"
                    ) {
                        let currentVal = table.rows[adjRow].cells[adjCol].querySelector(".game-button").dataset.value || 0;
                        table.rows[adjRow].cells[adjCol].querySelector(".game-button").dataset.value = parseInt(currentVal) + 1;
                    }
                }
            }
        }
    }
}

function revealCell(row, col, value) {
    const button = document.getElementById("buttonTable").rows[row].cells[col].querySelector(".game-button");
    button.disabled = true; 

    if (value === "M") {
        button.innerHTML = ""; 
        const img = document.createElement("img");
        img.src = "imagenes/Mine.png"; 
        img.alt = "Bomba";
        button.appendChild(img); 
        button.classList.add("game-button-mine"); 
        revealAllMines(); 
        alert("¡Has perdido!");
        bloqueartablero();
    } else {
        button.classList.add("game-button-revealed");
        button.textContent = value > 0 ? value : ""; 
    }
}

function verificarVictoria() {
    const table = document.getElementById("buttonTable");

    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const button = table.rows[i].cells[j].querySelector(".game-button");

            if (button.dataset.value !== "M" && !button.disabled) {
                return; 
            }
        }
    }
    alert("¡Felicidades! ¡Has ganado!");
    bloqueartablero();
}

function revealAllMines() {
    const table = document.getElementById("buttonTable");

    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const button = table.rows[i].cells[j].querySelector(".game-button");
            if (button.dataset.value === "M") {
                button.innerHTML = ""; 

                const img = document.createElement("img");
                img.src = "imagenes/Mine.png"; 
                img.alt = "Bomba";
                button.appendChild(img); 
                button.classList.add("game-button-mine"); 
            }
        }
    }
}

function revealAdjacentCells(row, col) {
    const table = document.getElementById("buttonTable");
    const stack = [[row, col]]; 

    while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        const button = table.rows[currentRow].cells[currentCol].querySelector(".game-button");
        const cellValue = button.dataset.value;

        if (button.disabled) continue;

        revealCell(currentRow, currentCol, cellValue);

        if (cellValue === "" || cellValue === "0") {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const adjRow = currentRow + i;
                    const adjCol = currentCol + j;
                    if (
                        adjRow >= 0 && adjRow < table.rows.length &&
                        adjCol >= 0 && adjCol < table.rows[0].cells.length &&
                        !table.rows[adjRow].cells[adjCol].querySelector(".game-button").disabled
                    ) {
                        stack.push([adjRow, adjCol]);
                    }
                }
            }
        }
    }
}

function bloqueartablero() {
    const table = document.getElementById("buttonTable");

    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const button = table.rows[i].cells[j].querySelector(".game-button");
            button.disabled = true; 
        }
    }
}

function revealMultipleCells(row, col) {
    const table = document.getElementById("buttonTable");
    const stack = [[row, col]];

    while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        const button = table.rows[currentRow].cells[currentCol].querySelector(".game-button");
        
        if (button.disabled) continue;

        const cellValue = button.dataset.value;
        revealCell(currentRow, currentCol, cellValue);

        if (cellValue === "" || cellValue === "0") {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const adjRow = currentRow + i;
                    const adjCol = currentCol + j;

                    if (
                        adjRow >= 0 && adjRow < table.rows.length &&
                        adjCol >= 0 && adjCol < table.rows[0].cells.length
                    ) {
                        const adjButton = table.rows[adjRow].cells[adjCol].querySelector(".game-button");
                        if (!adjButton.disabled && adjButton.dataset.value !== "M") {
                            stack.push([adjRow, adjCol]);
                        }
                    }
                }
            }
        }
    }
}

function verificarVictoria() {
    if (remainingMines === 0) {
        alert("¡Felicidades! ¡Has marcado todas las minas y ganado el juego!");
        bloqueartablero(); 
    }
}

let remainingMines = 0; 

function generateTable() {
    const rows = parseInt(document.getElementById("rows").value);
    const columns = parseInt(document.getElementById("columns").value);
    const table = document.getElementById("buttonTable");

    table.innerHTML = "";
    firstClick = true;
    remainingMines = numMines; 

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.className = "game-button";
            button.textContent = "";
            button.dataset.value = ""; 
            button.onclick = () => handleCellClick(i, j, rows, columns);
            button.oncontextmenu = (e) => Bandera(e, button); 
            cell.appendChild(button);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}



