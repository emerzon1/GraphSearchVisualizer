const color = ['white', 'black', 'red', 'green', 'CornflowerBlue', 'yellow'] 
/* TODO
Use Node object for DFS, BFS --> KEEP ALL NODES IN ARRAY LIKE ARR, update fields, add to array so that it isn't messed up.

Set each successors PARENT (new field for Node) -> to the VAL taken out of stack

When the destination reached, move backwards and make all squares yellow by going .parent.parent, etc...


*/
console.log(color)
arr = []
let WIDTH = 1300;
let HEIGHT = 700;
const canvas = document.getElementById('myCanvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
c = canvas.getContext("2d");
const rectSize = 20;
let xSize = WIDTH / rectSize;
let ySize = HEIGHT / rectSize;
let start = [0, 0];
let end = [xSize-1, 0];
let BEGIN = true;

let SPEED = 10;
function Node(pos) {
    this.position = pos;
    this.f = 0;
    this.g = 0;
    this.closed = false;
    this.parent = null;
    this.open = false;
}
function createGrid(){
    let res = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            if(arr[i][j] != 1){
                temp.push(new Node([i, j]));
            }
            else{
                temp.push("");
            }
        }
        res.push(temp);
    }
    return res;
}
//setup
var setup = () => {
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            if (i == start[0] && j == start[1]) {
                temp.push(2);
            }
            else if (i == end[0] && j == end[1]) {
                temp.push(3);
            }
            else {
                temp.push((Math.random() < 0.2) ? 1 : 0);
            }
        }
        arr.push(temp);
    }
}
var render = () => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            c.beginPath();
            c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
            if (arr[i][j] == 0) {
                c.stroke();
            }
            else {
                c.fillStyle = color[arr[i][j]]
                c.fill();
            }
        }
    }
}
var drawSq = (i, j, col) => {
    c.beginPath();
    c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
    if (col == 0) {
        c.stroke()
    }
    else {
        c.fillStyle = color[col];
        c.fill();
    }

}
setup();
render();
let grid = createGrid();
document.getElementById('reset').addEventListener('click', () => {
    location.reload();
})
function delay() {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, SPEED);
    });

}
var getAdjValues = (i, j) => { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i])
            }
        }
    }

    return actualRes;
}
var getAdjValuesAS = (i, j) => { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j], [i-1, j-1], [i-1, j+1], [i+1, j-1], [i+1, j+1]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i])
            }
        }
    }

    return actualRes;
}
let stack;
let val;
let visited;
let tmp;
let currInd = 0;
let open;
let closed;

function manhattan(a, b) {
    return (a[0] + b[0]) + (a[1] + b[1]);
}
let q;
async function astar() {
    open = new Heap((a, b) => a.f-b.f)

    let startNode = nodeAt(start);
    startNode.f = 0;
    startNode.g = 0;
    startNode.opened = true;
    open.push(new Node(start))
    while (!open.empty()) {
        open.sort(function(a, b) {
            return a.f - b.f;
        })
        q = open[0];
        if (q.position[0] == end[0] && q.position[1] == end[1]) {
            return;
        }
        open.shift();
        let successors = getAdjValuesAS(q.position[0], q.position[1]);
        for (let i = 0; i < successors.length; i++) {
            var isValid = true;
            
            node = new Node(successors[i]);
            node.g = q.g + manhattan(node.position, q.position);
            var h = manhattan(node.position, end);
            node.f = node.g + h;
            for (let j = 0; j < open.length; j++) {
                if (open[j].position[0] == node.position[0] && open[j].position[1] == node.position[1] && open[j].f <= node.f) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                for (let k = 0; k < closed.length; k++) {
                    if (closed[k].position[0] == node.position[0] && closed[k].position[1] == node.position[1] && closed[k].f <= node.f) {
                        isValid = false;
                        break;
                    }
                }
            }
            if (isValid) {
                open.push(node);
            }
        }
        drawSq(q.position[0], q.position[1], 4);


        closed.push(q);
        await delay();
    }
}
function nodeAt(val){
    return grid[val[0]][val[1]];
}
async function bfs() {
    visited = [];

    for (let i = 0; i < xSize; i++) {
        temp = [];

        for (let j = 0; j < ySize; j++) {
            temp.push(false);

        }

        visited.push(temp);
    }
    //console.log('visited');
    stack = [];
    stack.push(nodeAt(start))
    //console.log(stack);
    while (stack.length > 0) {
        val = stack.shift();
        val.closed = true;
        //console.log(currInd);

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] != 0 || val.position[1] != 0) {
                    drawSq(val.position[0], val.position[1], 4)
                }
                //console.log(val);
                await delay();
                //console.log('lol');
                visited[val.position[0]][val.position[1]] = true;
                tmp = getAdjValues(val.position[0], val.position[1])
                for (let i = 0; i < tmp.length; i++) {
                    if(tmp[i][0] == end[0] && tmp[i][1] == end[1]){
                        console.log(nodeAt(val.position));
                        let curr = nodeAt(val.position);
                        while(curr.parent != null){
                            drawSq(curr.position[0], curr.position[1], 5);
                            console.log(curr.position);
                            curr = curr.parent;
                        }
                        return;
                    }
                    if (stack.length <= 10000) {
                        if(arr[tmp[i][0]][tmp[i][1]] != 1){
                            var currNode = nodeAt(tmp[i]);
                            if(currNode.open || currNode.closed){
                                let a_ = 0;
                            }
                            else{
                                currNode.parent = nodeAt(val.position);
                                currNode.opened = true;
                                stack.push(nodeAt(tmp[i]));
                            }
                        }
                    }
                }
                
            }

            //stack = stack.splice(0, currInd-100);
            document.getElementById('par').textContent = (stack.length);

        }

    }
}

async function dfs() {
    visited = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            temp.push(false);
        }
        visited.push(temp);
    }
    stack = [];
    stack.push(nodeAt(start));

    while (stack.length > 0) {
        val = stack.pop();
        val.closed = true;
        //console.log(currInd);

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] != 0 || val.position[1] != 0) {
                    drawSq(val.position[0], val.position[1], 4)
                }
                //console.log(val);
                await delay();
                //console.log('lol');
                visited[val.position[0]][val.position[1]] = true;
                tmp = getAdjValues(val.position[0], val.position[1])
                for (let i = 0; i < tmp.length; i++) {
                    if(tmp[i][0] == end[0] && tmp[i][1] == end[1]){
                        console.log(nodeAt(val.position));
                        let curr = nodeAt(val.position);
                        while(curr.parent != null){
                            drawSq(curr.position[0], curr.position[1], 5);
                            console.log(curr.position);
                            curr = curr.parent;
                        }
                        return;
                    }
                    if (stack.length <= 10000) {
                        if(arr[tmp[i][0]][tmp[i][1]] != 1){
                            var currNode = nodeAt(tmp[i]);
                            if(currNode.open || currNode.closed){
                                let a_ = 0;
                            }
                            else{
                                currNode.parent = nodeAt(val.position);
                                currNode.opened = true;
                                stack.push(nodeAt(tmp[i]));
                            }
                        }
                    }
                }
                
            }
        }
    }
}
document.getElementById('dfs').addEventListener('click', () => {
    if (BEGIN) {
        BEGIN = false;
        dfs();
    }
})
document.getElementById('AS').addEventListener('click', () => {
    if (BEGIN) {
        BEGIN = false;
        astar();
    }
})
document.getElementById('bfs').addEventListener('click', () => {
    if (BEGIN) {
        BEGIN = false;
        bfs();
    }
})

//console.log(arr);


