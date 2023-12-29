
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
canvas.addEventListener('click', handleCanvasClick);
//define first player and current player at the beginning of the game
$('input[name="radTurn"]').on('click change', function (e) {
    //console.log(e.target.value);
    if (gameIsOver) {
        //endGameHandler();
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
        //endGameHandler();
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
        //endGameHandler();
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
    ctx.beginPath();
    ctx.strokeStyle = playerColors[currentPlayer-1];
    ctx.lineWidth = 2;
    ctx.moveTo(points[edges[edge][0]].x, points[edges[edge][0]].y);
    ctx.lineTo(points[edges[edge][1]].x, points[edges[edge][1]].y);
    ctx.stroke();
    edgeColors[edge] = playerColors[currentPlayer - 1];
    addRowToProtocol(edge);
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
    //let newrow = "\n|" + (movesCount+1) + "|" + currentPlayer + "|"
    //    + edgeColors[edgeIndex] + "|"
    //    + "[" + edges[edgeIndex][0] + "," + edges[edgeIndex][1] + "]";
    let s1 = centerString((movesCount + 1)+""," # ");
    let s2 = centerString(currentPlayer + "", " Player ");
    let s3 = centerString(edgeColors[edgeIndex], " Color ");
    let s4 =
        centerString("[" + edges[edgeIndex][0] + "," + edges[edgeIndex][1] + "]", " Edge");
    let newrow = "\n" + s1 + "|" + s2 + "|" + s3 + "|" + s4;
    $("#txtProtocol").val(txt + newrow);
}

//Given an edge and a color this function checks all triangles containing this edge
// and teturn true if found one havibg all edges of the same color
function checkMonochromeTriangle(edgeIndex,color) {
    let result = false;   
    let p = edges[edgeIndex][0];
    let q = edges[edgeIndex][1];
    
    for (var i = 0; i < edges.length; i++) {
        if (i == edgeIndex || edgeColors[i] != color)
            continue;
        let edge = edges[i];
        //found the second edge the same color connected to the given on
        //so we need to take its not common vertices and check if
        // the edge connected these vertices is of the same color
        let notCommonVertex = q;
        let thirdEdgeIndex = -1;
        if (edge[0] == p )  {
            notCommonVertex = edge[1];
            thirdEdgeIndex = getEdgeIndexByVertices(q, notCommonVertex)
        }
        if (edge[0] == q) {
            notCommonVertex = edge[1];
            thirdEdgeIndex = getEdgeIndexByVertices(p, notCommonVertex)
        }
        if (edge[1] == p) {
            notCommonVertex = edge[0];
            thirdEdgeIndex = getEdgeIndexByVertices(q, notCommonVertex)
        }
        if (edge[1] == q) {
            notCommonVertex = edge[0];
            thirdEdgeIndex = getEdgeIndexByVertices(p, notCommonVertex)
        }
        if (thirdEdgeIndex >= 0) {
            if (edgeColors[thirdEdgeIndex] == color) {
                result = true;
            }
            else
                result = false;
            break;
        }
        

    }
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
    let compColor = playerColors[currentPlayer-1];
    
    let ind = randomSearchNonMomochomaticTriangle(compColor);
    if (ind >= 0) {
        drawColoredLine(ind);
        switchPlayer();
    }
    else {
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
    alert("Game is over!");
    let winner = "";
    if (currentPlayerName == playerNames[0])
        winner = playerNames[1];
    else
        winner = playerNames[0];
    alert(winner +" win.")
}

    drawInitialSetup();
