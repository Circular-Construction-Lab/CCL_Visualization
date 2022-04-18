let canvas;
let nodes = [];
let aspects = [];
let edgeClusters = [];
let nodeEdges = [];
let slider;

let checkedValue;
let continentSelected = [];
let typeSelected = [];
let checkboxsCon = [];
let checkboxsType = [];

let continentStrs = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];
let typeStrs = ['data', 'built project', 'method', 'proposal','installation','landscape architecture project','publication','movement','planning project','material'];
let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'cultivation', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];
//git push test2

//pop-up box, change to arrays for mult?? maybe should be class?
let div;
let h1;
let h2;
let h3;
let img;
let p;


function initializeCanvas() {
	// createCanvas
	canvas = createCanvas(windowWidth-200, windowHeight-500);
	canvas.position(200,0);


	// centerCanvas
	// xW = (windowWidth - width) / 2;
	// yH = (windowHeight - height) / 2;
	// canvas.position(xW, yH);
}


function preload() {
	table = loadTable('Database_4_18.csv', 'csv', 'header');
	img = createImg('Kendeda-icon.jpg');
	img.size(190,160);
}

function setup() {
	initializeCanvas();
	initializeAspects();
	initializeNodes();
	initializeEdges();

	initializeSlider();
	initializeCheckboxCon();
	initializeCheckboxType();
	initializePopUp();

}

function draw() {
	// console.log(windowWidth, windowHeight);
	// console.log(width, height);
	canvas = createCanvas(windowWidth-200, windowHeight);
	background(0);
	update();
	hover();

	displayEdgeClusters();
	displayAspects();
	displayNodes();

	displaySliderYear();

	sortYear(slider.value(), 2020);
	sortContinent(continentSelected);
	sortType(typeSelected);
	checkHidden();

}
function checkEventCon() {
	checkboxsCon.forEach(function (checkbox) {
		if (checkbox.checked()) {
			continentSelected.push(checkbox.value());
		} else {
			continentSelected = continentSelected.filter(e => e !== checkbox.value());

		}
	});

}
function checkEventType() {
	checkboxsType.forEach(function (type) {
		if (type.checked()) {
			typeSelected.push(type.value());
		} else {
			typeSelected = typeSelected.filter(e => e !== type.value());

		}
	});
}

function initializeSlider() {
	slider = createSlider(1900, 2020, 1900);
	slider.position(35, 10);
	slider.style('width', '100px');
	pYearEnd = createP("2020");
	pYearEnd.position(150, 0);
	pYearStart = createP(1900);
	pYearStart.position(35, 10);
	slider.parent('vizsort');
	pYearStart.parent('vizsort');
	pYearEnd.parent('vizsort');
	// slider.class('slider');
	// pYearEnd.class('slider');
	// pYearStart.class('slider');

}

function initializeCheckboxCon() {
	continentStrs.forEach(con => checkboxsCon.push(createCheckbox(con, false)));
	checkboxsCon.forEach(function (checkbox) {
		checkbox.changed(checkEventCon);
	});
	checkboxsCon.forEach(function (checkbox, i) {
		checkbox.position(10, 50 + i * 20);
	});

}

function initializeCheckboxType() {
	typeStrs.forEach(type => checkboxsType.push(createCheckbox(type, false)));
	checkboxsType.forEach(function (checkbox) {
		checkbox.changed(checkEventType);
	});
	checkboxsType.forEach(function (checkbox, i) {
		checkbox.position(10, 190 + i * 20);
	});


}

function sortYear(yearStart_, yearEnd_) {
	nodes.forEach(function (node) {
		if (node.year > yearEnd_ || node.year < yearStart_) {
			node.isSortYear = true;
		} else {
			node.isSortYear = false;
		}
	});
}
function sortContinent(continents_) {
	nodes.forEach(function (node) {
		if (!continents_.includes(node.continent)) {
			node.isSortCont = true;
		} else {
			node.isSortCont = false;
		}
	});
}

function sortType(types_) {
	nodes.forEach(function (node) {
		if (!types_.includes(node.type)) {
			node.isSortType = true;
		} else {
			node.isSortType = false;
		}
	});
}


function displaySliderYear() {
	pYearStart.html(slider.value());
}

function checkHidden() {
	nodes.forEach(function (node) {
		if (node.isSortYear || node.isSortCont || node.isSortType) {
			node.isHidden = true;
		} else {
			node.isHidden = false;
		}
	});
}


function hover() {
	for (let i = 0; i < nodes.length; i++) {
		if (overElement(nodes[i].p.x, nodes[i].p.y, nodes[i].d / 2)) {
			nodes[i].isHover = true;
			nodes[i].edgeCluster.isHover = true;
		}
		else {
			nodes[i].isHover = false;
			nodes[i].edgeCluster.isHover = false;
		}
	}
}

//called when mouse is pressed to drag an aspect
function mousePressed() {

	for (let i = 0; i < aspects.length; i++) {
		if (overElement(aspects[i].p.x, aspects[i].p.y, aspects[i].d / 2)) {
			aspects[i].isDrag = true;
		}
	}
}

//called when mouse released to set the aspect in new location
function mouseReleased() {
	for (let i = 0; i < aspects.length; i++) {
		if (overElement(aspects[i].p.x, aspects[i].p.y, aspects[i].d / 2)) {
			aspects[i].isDrag = false;
		}
	}
}

function overElement(x_, y_, d_) {
	if (dist(x_, y_, mouseX, mouseY) < d_) {
		return true;
	}
	else {
		return false;
	}
}

function update() {
	nodes.forEach(node => node.Move());
	nodes.forEach(node => node.checkEdges(0, 0, width, height));
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter(element => element != node);
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -10));
}

function initializeNodes() {
	let rows = table.getArray();
	rows.forEach(row => nodes.push(new Node(row[0], row[1], int(row[2]), row[4], row[5], row[6].replaceAll('"').split(', '))), img);
	
	nodes.forEach(node => node.aspects = findAspects(node.aspectsStr));
}

function initializeAspects() {
		aspectStrs.forEach(aspectStr => aspects.push(new Aspect(aspectStr)));
}

function initializeEdges() {
	nodes.forEach(function (node) {
		node.edgeCluster = new EdgeCluster(node, node.aspects);
		edgeClusters.push(node.edgeCluster);
	});
}


function displayEdgeClusters() {
	edgeClusters.forEach(edgeCluster => edgeCluster.display());
}

function displayNodes() {
	nodes.forEach(node => node.display());
}

function displayAspects() {
	aspects.forEach(aspect => aspect.display());
}

function findAspects(aspectsToFind) {
	aspectsFound = [];
	aspectsToFind.forEach(aspect => aspectsFound.push(aspects.find(element => element.name == aspect)));
	return aspectsFound;
}


function initializePopUp(){
	let div = createDiv(' ');
	div.class('popup');
	let h1 = createElement('h1','initial h1');
	h1.class('proj');
	//h2 = createElement('h2','initial h2');
	let h3 = createElement('h3','initial h3');
	h3.class('detail');
	let p = createP('initialized');
	p.class('descript');

	h1.parent(div);
	//h2.parent(div);
	h3.parent(div);
	img.parent(div);
	p.parent(div);
	div.position(windowWidth-280,50);
	div.hide();
}
