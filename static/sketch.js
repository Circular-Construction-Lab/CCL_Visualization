let canvas;
let nodes = [];
let aspects = [];
let edgeClusters = [];
let nodeEdges = [];

let aspectStrs = ['water','site','data infrastructure','fabrication','cultivation','people','health','abioltic material','capital','carbon'];

function initializeCanvas(){
  // createCanvas
	canvas = createCanvas(1000,600);
	background(240);
	
	// centerCanvas
	let xW = (windowWidth-width)/2;
	let yH = (windowHeight-height)/2;
	canvas.position(xW, yH);
}


function preload() {
  table = loadTable('../assets/SimpleData3.csv','csv','header');
  img = loadImage('../assets/Kendeda-icon.jpg');
}

function setup() {
	initializeCanvas();
	initializeAspects();
	initializeNodes();
	initializeEdges();

	console.log(nodes);
}

function draw(){
	canvas = createCanvas(1000,600);
	update();
	hover();

	displayEdgeClusters();
	displayAspects();
	displayNodes();

}

function hover(){
  for (let i=0; i<nodes.length; i++){
    if (overElement(nodes[i].p.x, nodes[i].p.y, nodes[i].d/2)){
      nodes[i].isHover=true;
      nodes[i].edgeCluster.isHover = true;
    }
    else{      
    	nodes[i].isHover=false;      
    	nodes[i].edgeCluster.isHover = false;
    }
  }
}

//called when mouse is pressed to drag an aspect
function mousePressed(){
  for (let i=0; i<aspects.length; i++){
    if (overElement(aspects[i].p.x, aspects[i].p.y, aspects[i].d/2)){
      aspects[i].isDrag=true;
    }
  }
}

//called when mouse released to set the aspect in new location
function mouseReleased(){
  for (let i=0; i<aspects.length; i++){
    if (overElement(aspects[i].p.x, aspects[i].p.y, aspects[i].d/2)){
      aspects[i].isDrag=false;
    }
  }
}

function overElement(x_, y_, d_){
  if (dist(x_, y_, mouseX, mouseY)< d_){
    return true;
  }
    else{
      return false;
    }
}

function update(){
	nodes.forEach(node => node.Move());
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node){
	let nodesRepelFrom = nodes.filter(element => element != node);
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -10));
}

function initializeNodes(){
	let rows = table.getArray();
	rows.forEach(row => nodes.push(new Node(row[0],row[1],row.splice(2,4).filter(Boolean))),img);
	nodes.forEach(node => node.aspects = findAspects(node.aspectsStr));
}

function initializeAspects(){
	aspectStrs.forEach(aspectStr => aspects.push(new Aspect(aspectStr)));
}

function initializeEdges(){
	nodes.forEach(node => edgeClusters.push(new EdgeCluster(node, node.aspects)));
	nodes.forEach(function(node){		
		node.edgeCluster = new EdgeCluster(node, node.aspects);
		edgeClusters.push(node.edgeCluster);
	});
}


function displayEdgeClusters(){
	edgeClusters.forEach(edgeCluster => edgeCluster.display());
}

function displayNodes(){
	nodes.forEach(node => node.display());
}

function displayAspects(){
	aspects.forEach(aspect => aspect.display());
}

function findAspects(aspectsToFind){
	aspectsFound = [];
	aspectsToFind.forEach(aspect => aspectsFound.push(aspects.find(element=>element.name == aspect)));
	return aspectsFound;
}