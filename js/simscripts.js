
const canvas = document.getElementById('ramseyCanvas');
const ctx = canvas.getContext('2d');
const playerTurnDiv = document.getElementById('playerTurn');

    const points = [
    {x: 200, y: 50 },
    {x: 350, y: 125 },
    {x: 350, y: 275 },
    {x: 200, y: 350 },
    {x: 50, y: 275 },
    {x: 50, y: 125 }
    ];

   
const playerNames = ["You", "Computer"];

var firstPlayerName = "You"; //at the beginning
var currentPlayerName = "You";//at the beginning
var edges = [];
var playerColors = ["red", "blue"];//at the beginning
var movesCount = 0;
var myTimeout;

let currentPlayer = 1;//at the beginning
    var edgeColors =[];
var gameIsOver = false;
var gameStarted = false;
var protocolSerialized = "";
var gameProtocol = []; //array of steps;
    
canvas.addEventListener('click', handleCanvasClick);
//define first player and current player at the beginning of the game
$('input[name="radTurn"]').on('click change', function (e) {
    //console.log(e.target.value);
    if (gameIsOver) {
       
        return;
    }
    currentPlayer = e.target.value; //1- you, 2 - computer
    firstPlayerName = playerNames[currentPlayer - 1];
    
    if (currentPlayer == 1)
        playerColors = ["red", "blue"]; //you is red
    else
        playerColors = ["blue", "red"]; //you is blue
    updatePlayerTurnDisplay();
});

function handleCanvasClick(event) {
    if (gameIsOver) {
        
        return;
    }
    if (!gameStarted) {
        alert("The game was not started")
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedEdge = getClickedEdge(mouseX, mouseY);

    if (clickedEdge !== null) {
        if (edgeColors[clickedEdge] === 'black') {
            drawColoredLine(clickedEdge);
            switchPlayer();
        }
        else {
            alert("Wrong move!")
        }
    }
  }

function getClickedEdge(mouseX, mouseY) {
    if (gameIsOver) {
        
        return;
    }
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
    const startPoint = points[edge[0]];
    const endPoint = points[edge[1]];
    const distance = pointToLineDistance(mouseX, mouseY, startPoint, endPoint);
    if (distance < 5) {
        return i;
      }
    }
    return null;
  }

    function pointToLineDistance(x, y, start, end) {
    const A = x - start.x;
    const B = y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = dot / lenSq;

    const xx = (param < 0) ? start.x : (param > 1) ? end.x : start.x + param * C;
    const yy = (param < 0) ? start.y : (param > 1) ? end.y : start.y + param * D;

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  

function drawColoredLine(edge) {
    if (gameIsOver)
        return;
    ctx.beginPath();
    ctx.strokeStyle = playerColors[currentPlayer-1];
    ctx.lineWidth = 2;
    ctx.moveTo(points[edges[edge][0]].x, points[edges[edge][0]].y);
    ctx.lineTo(points[edges[edge][1]].x, points[edges[edge][1]].y);
    ctx.stroke();
    edgeColors[edge] = playerColors[currentPlayer - 1];
    addRowToProtocol(edge);
    addRowToMemoryProtocol(edge);
    if (checkMonochromeTriangle(edge, edgeColors[edge])) {
        endGameHandler();
    }
}

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerTurnDisplay();
        if (currentPlayer == 2) {
            myTimeout= setTimeout(makeComputerMove, 2000);
        }
    
  }

function updatePlayerTurnDisplay() {
    currentPlayerName = playerNames[currentPlayer - 1];
    playerTurnDiv.textContent = `Player's Turn: ${currentPlayerName}`;
    if (gameStarted)
        movesCount++;
  }

  
function drawAllEdges() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    let edgesIndex = -1;
    for (let i = 0; i < points.length; i++) {        
        for (var j = i + 1; j < points.length; j++) {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            edgesIndex++;
            edges[edgesIndex] = [i, j];
           
        }
        
    }    
    ctx.stroke();
}
function drawVerticesNumbers() {
    let dx = 0;
    let dy = 0;
    ctx.font = "20px Arial";
    for (let i = 0; i < points.length; i++) {
        switch (i) {
            case 0:
                dx = -5;
                dy = -3;
                break;
            case 1:
                dx = 5;
                dy = 5;
                break;
            case 2:
                break;
            case 1:
                break;
            case 3:
                dx = -8;
                dy = 20;
                break;
            case 4:
                dx = -16;
                dy = 5;
                break;
            case 5:
                break;
            default:
                break
        }
        ctx.fillText(i , points[i].x+dx, points[i].y+dy);
    }
}
function drawInitialSetup() {
   
    drawAllEdges();
    drawVerticesNumbers();
    edgeColors = Array.from({ length: edges.length }, () => 'black')
    updatePlayerTurnDisplay();
    $("#txtProtocol").val(" # | Player | Color | Edge");
    var txt = $("#txtProtocol").val();    
    $("#txtProtocol").val(txt+"\n-----------------------------")
}
function addRowToProtocol(edgeIndex) {
    var txt = $("#txtProtocol").val();
    if (gameIsOver)
        return;
    let s1 = centerString((movesCount + 1)+""," # ");
    let s2 = centerString(currentPlayer + "", " Player ");
    let s3 = centerString(edgeColors[edgeIndex], " Color ");
    let s4 =
        centerString("[" + edges[edgeIndex][0] + "," + edges[edgeIndex][1] + "]", " Edge");
    let newrow = "\n" + s1 + "|" + s2 + "|" + s3 + "|" + s4;
    $("#txtProtocol").val(txt + newrow);
    
}
function addRowToMemoryProtocol(edgeIndex) {
    let sep = ",";
    let row = (movesCount + 1) + sep + currentPlayer + sep + edgeColors[edgeIndex] +
        sep + edges[edgeIndex][0] + sep + edges[edgeIndex][1] + "\r\n";
    protocolSerialized += row;
    //Now as object
    let step = {};
    step.moveCount = movesCount ;
    step.player = currentPlayer;
    step.color = edgeColors[edgeIndex];
    step.edgeIndex = edgeIndex;
    step.edge = edges[edgeIndex];
    gameProtocol.push(step);
}

function getNeighbours(vertex, color) {
    let result = [];//vertices connected to this vertex
    // with edge the same color
    for (var i = 0; i <edges.length; i++) {
        let edge = edges[i];
        if (edgeColors[i] == color) {
            if (edge[0] == vertex)
                result.push(edge[1]);
            else
                if (edge[1] == vertex)
                    result.push(edge[0]);
        }
    }
    return result;
}
//Given an edge and a color this function checks all triangles containing this edge
// and teturn true if found one havibg all edges of the same color
function checkMonochromeTriangle(edgeIndex, color) {
    let result = false;    
    let p = edges[edgeIndex][0];
    let q = edges[edgeIndex][1];
    let pn = getNeighbours(p, color);
    let qn = getNeighbours(q, color);
    //Find intersection of 2 arrays
    var filteredArray = pn.filter(function (n) {
        return qn.indexOf(n) !== -1;
    });
    result = filteredArray.length > 0;
    return result;
}



function getEdgeIndexByVertices(p, q) {
    let result = 0;
    let m = Math.min(p, q);
    let M = Math.max(p, q);
    for (var i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if (edge[0] == m && edge[1] == M) {
            result = i;
            break;
        }
    }
    return result;
}
function randomSearchNonMomochomaticTriangle(color) {
    let resultIndex = -1;
    let usedIds = [];//List of indices of edges that were found
    //as closed a monochromatic triangle
    let ind = -1; //it will be the last founded index
    while (usedIds.length<15) {
        //get random index
        ind = Math.floor(Math.random() * 15);
        if (edgeColors[ind] != 'black') {
            usedIds.push(ind);
            ind = -1;
            continue;
        }
        if (!usedIds.includes(ind)) {
            
                if (!checkMonochromeTriangle(ind, color)) {
                    break; //an index was found
                }
                else {
                    usedIds.push(ind);
                }
        }
    }
    resultIndex = ind;
    return resultIndex;
}
function startGame() {
    let startColor = "red";
    gameStarted = true;
    if (currentPlayer == 2) //computer
    {
        makeComputerMove();
    }
}
function makeComputerMove() {
    if (gameIsOver)
        return;
    let compColor = playerColors[currentPlayer-1];
    
    let ind = randomSearchNonMomochomaticTriangle(compColor);
    if (ind >= 0) {
        drawColoredLine(ind);
        switchPlayer();
    }
    else {
        //find any black edge,draw icolor line on it and end
        for (var i = 0; i < edges.length; i++) {
            if (edgeColors[i] == 'black') {
                drawColoredLine(i);
                break;
            }
        }
        endGameHandler();
    }

}
function centerString(input, pattern) {
    let n = input.length;
    let m = pattern.length;
    let dif2 = (m - n) / 2;
    let result = ' '.repeat(dif2) + input;
    let k = result.length;
    result += ' '.repeat(m - k);
    return result;
}
function endGameHandler()
{
    gameIsOver = true;
    clearTimeout(myTimeout);
    //alert("Game is over!");
    let winner = "";
    if (currentPlayerName == playerNames[0])
        winner = playerNames[1];
    else
        winner = playerNames[0];
    alert("Game is over, "+winner +" win.")
}
function readProtocol(input) {
    let file = input.files[0];
    let fileReader = new FileReader();
    let txt = "";
    fileReader.readAsText(file);
    fileReader.onload = function () {
        //alert(fileReader.result);
        let text = fileReader.result;
        let arr = text.split("\r\n");
        buildGameProtocol(arr)
    };
    fileReader.onerror = function () {       
        alert(fileReader.error);        
    };

}
function buildGameProtocol(arr) {
    //alert("buildGameProtocol")
    let sep = "|";
    //don't take header
    for (var i = 2; i < arr.length; i++) {       
        let row = arr[i].split(sep);
        let step = {};
        step.moveCount = parseInt( row[0]);
        step.player = parseInt(row[1]);
        step.color = row[2].trim();
        let s = row[3];
        s = s.substr(1, s.length - 2);
        step.edge = s.split(",");
        step.edge[0] = parseInt(step.edge[0]);
        step.edge[1] = parseInt(step.edge[1]);
        //find edge index
        let edgeIndex = 0;
        for (var j = 0; j < edges.length; j++) {
            if (edges[j][0] == step.edge[0] && edges[j][1] == step.edge[1]) {
                edgeIndex = j;
                break;
            }
        }
        step.edgeIndex = edgeIndex;        
        gameProtocol.push(step);
    }
}
function reproduceGame() {
    gameIsOver = false;
    gameStarted = true;   
   
    currentPlayer = 1;
    edgeColors = [];
    drawInitialSetup();
    movesCount = 0;
    alert("Begin by click on Next")
}
function nextStep() {
    let step = gameProtocol[movesCount];
    if (movesCount < gameProtocol.length) {
        drawLineByStep(step);
    }
    else {
        $("#btnNext").prop("disabled", true);
        $("#btnReproduce").prop("disabled", true);
    }
    movesCount++;
}
function drawLineByStep(step) {
    let player = step.player;
    let color = step.color;
    let edge = step.edge;
    let edgeIndex = step.edgeIndex;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(points[edge[0]].x, points[edge[0]].y);
    ctx.lineTo(points[edge[1]].x, points[edge[1]].y);
    ctx.stroke();
    edgeColors[edgeIndex] = color;
    currentPlayer = player;
    addRowToProtocol(edgeIndex);
    if (checkMonochromeTriangle(edgeIndex, color)) {
        alert("Found Monochrome Triangle")
    }
    
}


    drawInitialSetup();
