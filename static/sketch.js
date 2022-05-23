let canvas;
let canvasXW;
let canvasYH;
let nodes = [];
let aspects = [];
let edgeClusters = [];
let nodeEdges = [];
let icons = [11];
let slider;

let checkedValue;
let continentSelected = [];
let typeSelected = [];
let checkboxsCon = [];
let checkboxsType = [];
let types = [];


let continentStrs = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];
let typeStrs = ['data', 'built project', 'method', 'proposal','installation','landscape architecture project','publication','movement','planning project','material','research'];
let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];


//pop-up box and array
let popUp;
let popUps = [];


let img;

// Slider with 2 Handles
var inputLeft = document.getElementById("input-left");
var inputRight = document.getElementById("input-right");

var thumbLeft = document.querySelector(".slider > .thumb.left");
var thumbRight = document.querySelector(".slider > .thumb.right");
var range = document.querySelector(".slider > .range");


function initializeCanvas() {
	// createCanvas

	canvas = createCanvas(windowWidth-200, windowHeight);
	canvasPadding = 150;
	canvas.position(200,0);


	// centerCanvas
	// xW = (windowWidth - width) / 2;
	// yH = (windowHeight - height) / 2;
	// canvas.position(xW, yH);
}


function preload() {

	table = loadTable('assets/Database_4_18.csv', 'csv', 'header');

	
	// load Icons
	for(i = 0; i < typeStrs.length; i ++){
		types.push(new Type(typeStrs[i], loadImage('assets/type'+i+'.png')));
	}

}


function setup() {

	initializeCanvas();
	initializeAspects();
	initializeNodes();
	initializeEdges();

	initializeSelectButton();
	initializeSlider();
	initializeCheckboxCon();
	initializeCheckboxType();


	popUp = new Popup();
	popUp.initialStyle();

	checkEventCon();
	checkEventType();
	

}


function draw() {

	//canvas = createCanvas(windowWidth-200, windowHeight);
	windowResized();

	background(0);
	updateNodes();
	hover();

	displayEdgeClusters();
	displayAspects();
	displayNodes();
	displaySliderYear();

	sortYear(inputLeft.value, inputRight.value);
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

function selectAllCheckboxes(){
	console.log('select');
	checkboxsCon.forEach(checkbox => checkbox.checked(true));
	checkboxsType.forEach(checkbox => checkbox.checked(true));
	//check check status again
	checkEventCon()
	checkEventType();
}

function clearSelection(){
	console.log('clear');
	checkboxsCon.forEach(checkbox => checkbox.checked(false));
	checkboxsType.forEach(checkbox => checkbox.checked(false));
	//check check status again
	checkEventCon()
	checkEventType();
	
}

function initializeSelectButton(){
	buttonAll = createButton('select all');
	buttonClear = createButton('clear selection');

	buttonAll.position(20, 450);
	buttonClear.position(20, 480);

	buttonAll.mousePressed(selectAllCheckboxes);
	buttonClear.mousePressed(clearSelection);
}

function initializeSlider() {
	
	setLeftValue();
	setRightValue();

	pYearStart = createP(1900);
	pYearStart.position(10, 20);
	pYearStart.parent('vizsort');

	
	pYearEnd = createP(2020);
	pYearEnd.position(160, 20);
	pYearEnd.parent('vizsort');
	
	// //P5 Solution
	// slider = createSlider(1900, 2020, 1900);
	// slider.position(35, 10);
	// slider.style('width', '100px');
	// pYearEnd = createP("2020");
	// pYearEnd.position(150, 0);
	// pYearStart = createP(1900);
	// pYearStart.position(35, 10);
	// slider.parent('vizsort');
	// pYearStart.parent('vizsort');
	// pYearEnd.parent('vizsort');
	// // slider.class('slider');
	// // pYearEnd.class('slider');
	// // pYearStart.class('slider');

}


function setLeftValue() {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);

	_this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
}

function setRightValue() {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);

	_this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
}

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

inputLeft.addEventListener("mouseover", function() {
	thumbLeft.classList.add("hover");
});
inputLeft.addEventListener("mouseout", function() {
	thumbLeft.classList.remove("hover");
});
inputLeft.addEventListener("mousedown", function() {
	thumbLeft.classList.add("active");
});
inputLeft.addEventListener("mouseup", function() {
	thumbLeft.classList.remove("active");
});

inputRight.addEventListener("mouseover", function() {
	thumbRight.classList.add("hover");
});
inputRight.addEventListener("mouseout", function() {
	thumbRight.classList.remove("hover");
});
inputRight.addEventListener("mousedown", function() {
	thumbRight.classList.add("active");
});
inputRight.addEventListener("mouseup", function() {
	thumbRight.classList.remove("active");
});


function initializeCheckboxCon() {
	continentStrs.forEach(con => checkboxsCon.push(createCheckbox(con, true)));
	checkboxsCon.forEach(function (checkbox) {
		checkbox.changed(checkEventCon);
	});
	checkboxsCon.forEach(function (checkbox, i) {
		checkbox.position(10, 70 + i * 20);
	});

}

function initializeCheckboxType() {
	typeStrs.forEach(type => checkboxsType.push(createCheckbox(type, true)));
	checkboxsType.forEach(function (checkbox) {
		checkbox.changed(checkEventType);
	});
	checkboxsType.forEach(function (checkbox, i) {
		checkbox.position(10, 210 + i * 20);
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
		if (!types_.includes(node.typeStr)) {
			node.isSortType = true;
		} else {
			node.isSortType = false;
		}
	});
}


function displaySliderYear() {
	pYearStart.html(inputLeft.value);
	pYearEnd.html(inputRight.value);

	// pYearStart.html(slider.value());
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

	for (let n = 0; n < nodes.length; n++) {
		if (overElement(nodes[n].p.x, nodes[n].p.y, nodes[n].d)) {
			let h1_ = nodes[n].name;
			let h3_ = nodes[n].architect;
			let cont_ = nodes[n].continent;
			let year_ = nodes[n].year;
			let pimg_ = nodes[n].image;
			let p_ = nodes[n].descript;
			popUp.updatePopup(h1_,h3_,cont_,year_,pimg_,p_);
			popUp.toggleShow();
			nodes[n].toggleExpand();
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

function updateNodes() {
	//enable movements
	nodes.forEach(node => node.Move());
	//boundary
	nodes.forEach(node => node.checkEdges(canvasPadding, canvasPadding, windowWidth, windowHeight));
	//repel from other nodes
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter(element => element != node);
	//here Control repel force
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -20));
}

function initializeNodes() {
	let rows = table.getArray();
	rows.forEach(function(row) {
		let iconIndex = typeStrs.findIndex(typeStr => typeStr == row[5]);
		let thistype = types[iconIndex];
		nodes.push(new Node(row[0], row[1], int(row[2]), row[4], row[5], row[6].replaceAll('"').split(', '),thistype.typeIcon, img));
	});
	
	nodes.forEach(node => node.aspects = findAspects(node.aspectsStr));
}

function initializeAspects() {
	
	//calculate aspect locations
	n = aspectStrs.length;
	let v = createVector(1, 0);
	let points = [v.copy()];
	for(let p = 1; p < n; ++p) {
	  points.push(v.rotate(2*PI/n).copy());
	}

	aspectStrs.forEach(aspectStr => aspects.push(new Aspect(aspectStr)));
	for(i = 0; i < aspects.length; i++){
		aspects[i].p = new p5.Vector(width/2 + points[i].x * (height-canvasPadding)/2,height/2 - points[i].y * (height-canvasPadding)/2);
	}
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

function windowResized(){
	resizeCanvas(windowWidth-200, windowHeight);
}