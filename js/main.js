const color = ['white', 'black', 'red', 'green', 'CornflowerBlue']
console.log(color)
arr = []
let WIDTH = 1300;
let HEIGHT = 700;
const canvas = document.getElementById('myCanvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
c = canvas.getContext("2d");
const rectSize = 10;
let xSize = WIDTH / rectSize;
let ySize = HEIGHT / rectSize;
let start = [0,0];
let end = [xSize-1, ySize-1];
let BEGIN = true;
//setup
var setup = () => {
    for(let i = 0; i < xSize; i ++){
        temp = [];
        for(let j = 0; j < ySize; j ++){
            if(i == start[0] && j == start[1]){
                temp.push(2);
            }
            else if(i==end[0] && j==end[1]){
                temp.push(3);
            }
            else{
                temp.push((Math.random() < 0.3) ? 1 : 0);
            }
        }
        arr.push(temp);
    }
}
var render = () => {
    for(let i = 0; i < arr.length; i ++){
        for(let j = 0; j < arr[i].length; j ++){
            c.beginPath();
            c.rect(i*rectSize, j * rectSize, rectSize, rectSize);
            if(arr[i][j] == 0){
                c.stroke();
            }
            else{
            c.fillStyle = color[arr[i][j]]
            c.fill();}
        }
    }
}
var drawSq = (i, j, col) => {
    c.beginPath();
    c.rect(i*rectSize, j * rectSize, rectSize, rectSize);
    if(col == 0){
        c.stroke()
    }
    else{
        c.fillStyle = color[col];
        c.fill();
    }
    
}
setup()
render()
document.getElementById('reset').addEventListener('click', () => {
    location.reload();
})
function delay() {
	return new Promise(resolve => {
		setTimeout(() => { resolve(); }, .50);
	});

}
var getAdjValues = (i, j) => { // * * *
                               // * - *
                               // * * *
    let res = [[i, j-1], [i+1, j], [i, j+1], [i-1, j]];
    let actualRes = [];
    for(let i = 0; i < res.length; i ++){
        if((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)){
            actualRes.push(res[i])
        } 
    }
    
    return actualRes;
}
let stack;
let val;
let visited;
let tmp;
let currInd = 0;
async function bfs(){
    visited = [];
    for(let i = 0; i < xSize; i ++){
        temp = [];
        for(let j = 0; j < ySize; j ++){
            temp.push(false);
        }
        visited.push(temp);
    }
    console.log('visited');
    stack = [];
    stack.push(start)
    console.log(stack);
    while(stack.length > 0 && visited[end[0]][end[1]] == false){
        val = stack.shift();
        //console.log(currInd);
        
        if(arr[val[0]][val[1]] != 1){
            if(visited[val[0]][val[1]] == false){
                if(val[0] != 0 || val[1] != 0){
                    drawSq(val[0], val[1], 4)
                    
                }
                //console.log(val);
                await delay();
                visited[val[0]][val[1]] = true;
                tmp = getAdjValues(val[0], val[1])
                for(let i = 0; i < tmp.length; i ++){
                    if(stack.length <= 10000){
                        stack.push(tmp[i])
                    }
                }
            }
            
            //stack = stack.splice(0, currInd-100);
            document.getElementById('par').textContent = (stack.length);
        
        }
        
    }
}

async function dfs(){
    visited = [];
    for(let i = 0; i < xSize; i ++){
        temp = [];
        for(let j = 0; j < ySize; j ++){
            temp.push(false);
        }
        visited.push(temp);
    }
    stack = [];
    stack.push(start)

    while(stack.length > 0 && visited[end[0]][end[1]] == false){
        val = stack.pop();
        if(arr[val[0]][val[1]] != 1){
            if(visited[val[0]][val[1]] == false){
                if(val[0] != 0 || val[1] != 0){
                    drawSq(val[0], val[1], 4)
                }
                visited[val[0]][val[1]] = true;
            }
            tmp = getAdjValues(val[0], val[1])
            tmp.forEach((val) => {if(visited[val[0]][val[1]] == false){stack.push(val)}});
            
            await delay();
        }
    }
}
document.getElementById('dfs').addEventListener('click', () => {
    if(BEGIN){
        BEGIN = false;
        dfs();
    }
})
document.getElementById('bfs').addEventListener('click', () => {
    if(BEGIN){
        BEGIN = false;
        bfs();
    }
})

//console.log(arr);


