
let colors = {
    "0": "rgba(238, 228, 218, 0.35)",
    "2": "#9AD5CA",
    "4": "#A63446",
    "8": "#CA61C3",
    "16": "#FF958C",
    "32": "#77B6EA",
    "64": "#A69888",
    "128": "#FCBFB7",
    "256": "#883677",
    "512": "#F2F230",
    "1024": "#C2F261",
    "2048": "#61F2C2"
}


class Cell {
    constructor(docElem, id, num = null) {

        this.docElem = docElem;
        this.num = num;
        this.id = id;

    }

    play(doc) {
        doc.className = "cell";
        window.requestAnimationFrame(function (time) {
            window.requestAnimationFrame(function (time) {
                doc.className = "cell animate";
            });
        });
    }

    pushDisplay = () => {
        this.docElem.textContent = this.num;
        if (!this.num) {

            this.docElem.style.backgroundColor = colors["0"];
        } else {
            this.docElem.style.backgroundColor = colors[this.num.toString()];
            this.play(this.docElem);
        }
    }
}

grid = [[], [], [], []]
const score = document.getElementById("scoreNum")


//GET CELLS
const cells = document.querySelectorAll(".cell");

//CREATE CELL OBJECTS
let count = 0;
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        const cell = new Cell(cells[count], count);
        grid[i].push(cell);
        count++;
    }
}

//SET TEST NUMS
/* count = 0
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        grid[i][j].num = count;
        grid[i][j].pushDisplay();
        count++
    }
}

 */
function pushDisplayAll() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            grid[i][j].pushDisplay();
        }
    }
}
//CLEAR ONE CELL
const clearCell = obj => {
    obj.num = null;
    obj.pushDisplay();
}

//
const checkifVal = obj => {
    return obj.num;
}
/////////////////////////////////////////////////////FIX THESE
function doAll(func) {
    const results = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let result = func(grid[i][j]);
            results.push(grid[i][j]);
        }
    }
    return results;
}

//GET RANDOM INT
function getRandomInt(num) {
    return Math.floor((Math.random() * num) + 1);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//SETS NEW TILES ON BOARD
function setRandomLocationVals() {
    const objOpen = [];
    for (i of doAll(checkifVal)) {
        if (!i.num) {
            objOpen.push(i);
        }
    }
    for (i of shuffle(objOpen).slice(0, 2)) {
        i.num = 2;
        i.pushDisplay();
    }

}


//GAME START
function gameStart() {

    doAll(clearCell);

    //GEN RANDOM START LOC
    setRandomLocationVals();
}


function shift(arr) {
    for (let i = 0; i < 4; i++) {
        let tmp = [];
        for (num of arr[i]) {
            tmp.push(num.num)
        }
        tmp = tmp.filter(function (value, index, arr) {
            return value !== null;
        });
        for (let j = 0; j < tmp.length; j++) {
            if (tmp[j + 1] && tmp[j + 1] == tmp[j]) {
                tmp[j] *= 2;
                let scoretmp = parseInt(score.textContent, 10);
                scoretmp += tmp[j];
                score.textContent = scoretmp;
                tmp[j + 1] = null;
            }
        }
        tmp = tmp.filter(function (value, index, arr) {
            return value !== null;
        });
        for (let j = 0; j < 4; j++) {
            if (tmp[j] && tmp[j] != null) {
                arr[i][j].num = tmp[j];
            }
            else {
                arr[i][j].num = null;
            }
        }

    }

    return arr;
}
function reverse(arr) {
    for (let i = 0; i < 4; i++) {
        arr[i].reverse();
    }
    return arr;
}
function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            k = matrix[i][j];
            matrix[i][j] = matrix[y - j][i];
            matrix[y - j][i] = matrix[y - i][y - j];
            matrix[y - i][y - j] = matrix[j][y - i]
            matrix[j][y - i] = k
        }
    }
    return matrix;
}

//HANDLER FUNCS
const leftHandler = () => rotate(rotate(rotate(reverse(shift(reverse(rotate(grid)))))));
const rightHandler = () => rotate(rotate(rotate(shift(rotate(grid)))));
const upHandler = () => shift(grid);
const downHandler = () => reverse(shift(reverse(grid)))

const button = document.getElementById('startNew');
button.addEventListener('click', () => {
    gameStart()
})


//EVENT HANDLER
document.addEventListener('keydown', function (event) {
    const callback = {
        "ArrowLeft": leftHandler,
        "ArrowRight": rightHandler,
        "ArrowUp": upHandler,
        "ArrowDown": downHandler,
    }[event.key]
    callback?.()
    setRandomLocationVals();
    pushDisplayAll();
});


gameStart();

console.log(grid);

