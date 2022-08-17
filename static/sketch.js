let canvas;
let canvasXW;
let canvasYH;
let canvasbg;

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

let continentStrs = ['asia', 'europe', 'africa', 'north america', 'south america', 'oceania'];

let typeStrs = ['project', 'tool', 'publication', 'strategy'];

let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];


//pop-up box and array
let pid = 0;
let popUp;
let popUps = [];

var inputLeft;
var inputRight;
var thumbLeft;
var thumbRight;
var range;



function initializeCanvas() {
	// createCanvas
	canvasXW=windowWidth;
	canvasYH=windowHeight;
	canvas = createCanvas(canvasXW, canvasYH);


  	// Slider with 2 Handles
	inputLeft = document.getElementById("input-left");
	inputRight = document.getElementById("input-right");

	thumbLeft = document.querySelector(".slider > .thumb.left");
	thumbRight = document.querySelector(".slider > .thumb.right");
	range = document.querySelector(".slider > .range");
}


function preload() {

	table = loadTable('assets/Database_6_07.csv', 'csv', 'header');

	
	// load Icons
	for(i = 0; i < typeStrs.length; i ++){
		types.push(new Type(typeStrs[i], loadImage('assets/icon6/type'+i+'.png')));
	}


}


function setup() {
	canvasbg = loadImage('assets/star-bg3.png');

	initializeCanvas();
	initializeAspects();
	initializeNodes();
	initializeEdges();

	initializeSlider();
	initializeCheckboxCon();
	initializeCheckboxType();
	initializeSelectButton();

	checkEventCon();
	checkEventType();
	

}


function draw() {
	windowResized();
	background(0);
	image(canvasbg,0,0);


	updateNodes();
	hover();
	noStack();

	displayEdgeClusters();
	displayAspects();
	displayNodes();
	displaySliderYear();

	sortYear(inputLeft.value, inputRight.value);
	sortContinent(continentSelected);
	sortType(typeSelected);
	checkHidden();
}


function noStack(){
	aspects.forEach(function(aspect0){
		aspects.forEach(function(aspect1){
			if(aspect0 != aspect1){
				let dist = aspect0.p.dist(aspect1.p);
				if(dist < 10){
					aspect0.p = aspect0.p.add(new p5.Vector(random(-aspect0.d/2,aspect0.d/2),random(-aspect0.d/2,aspect0.d/2)));
				}
			}
		})
	});
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
	let p = createP('<br>');
	p.parent('vizsort');
	buttonAll = createButton('select all');
	buttonClear = createButton('clear selection');


	buttonAll.parent('vizsort');
	buttonClear.parent('vizsort');

	buttonAll.class('button');
	buttonClear.class('button');

	buttonAll.mousePressed(selectAllCheckboxes);
	buttonClear.mousePressed(clearSelection);

	let tempButton = createButton('<a href="readTest.html">test database content</a>');
	tempButton.parent('vizsort');
	let formButton = createButton('<a href="https://forms.gle/FZEA2GpuWxDxZUh87">add a project</a>');
	formButton.parent('vizsort');

}

function initializeSlider() {
  

	let p = createP('<br>By Year');
	p.parent('vizsort');

	slider = createSlider(1900, 2020, 1900);

	
	setLeftValue();
	setRightValue();

	pYearStart = createP(1900);
// 	pYearStart.position(15, 30);

	pYearStart.parent('vizsort');

	
	pYearEnd = createP(2020);
// 	pYearEnd.position(160, 30);
	pYearEnd.parent('vizsort');
  

// 	slider.class('slider');
// 	pYearEnd.class('slider');
// 	pYearStart.class('slider');

	
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
	let p = createP('<br><br><br>By Location:');
	p.parent('vizsort');
	continentStrs.forEach(con => checkboxsCon.push(createCheckbox(con, true)));
	checkboxsCon.forEach(function (checkbox) {
		checkbox.changed(checkEventCon);
		checkbox.class('checkbox');
		checkbox.parent("vizsort");
    // checkbox.class('checkmarkCon');
	});


}

function initializeCheckboxType() {
	let p = createP('<br><br><br>By Type:');
	p.parent('vizsort');
	typeStrs.forEach(type => checkboxsType.push(createCheckbox(type, true)));
	checkboxsType.forEach(function (checkbox) {
		checkbox.changed(checkEventType);
		checkbox.class('checkbox');
		checkbox.parent("vizsort");
    // checkbox.class('checkmarkType');
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
		if (overElement(nodes[i].p.x, nodes[i].p.y, nodes[i].d)) {
			nodes[i].isHover = true;
			nodes[i].edgeCluster.isHover = true;
		}
		else {
			nodes[i].isHover = false;
			nodes[i].edgeCluster.isHover = false;
		}
	}

	for (let a = 0; a < aspects.length; a++) {
		if (overElement(aspects[a].p.x, aspects[a].p.y, aspects[a].d)) {
			aspects[a].isHover = true;
		}
		else {
			aspects[a].isHover = false;
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
		if (overElement(nodes[n].p.x, nodes[n].p.y, nodes[n].d) && !nodes[n].isHidden) {

			if(!nodes[n].isExpand){
				pid++;
				popUp = new Popup_v2(pid, nodes[n]);
				popUps.push(popUp);
				nodes[n].isExpand=true;
			}

			else{
				nodes[n].isExpand = false;
				for(let q=0; q< popUps.length; q++){
					if(nodes[n].popUp == popUps[q].id){
						popUps[q].updatePopup();
					}
				}
				
			}
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
	nodes.forEach(node => node.checkEdges(50, 50, canvasXW-50, canvasYH-50));
// 	nodes.forEach(node => node.checkEdges(canvasPadding, canvasPadding, windowWidth, windowHeight));
  
	//repel from other nodes
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter(element => element != node);
	//here Control repel force
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -5));
}

function initializeNodes() {
	let rows = table.getArray();

	rows.forEach(function(row) {
		let name_ = row[0].replaceAll('"', '');
		let architect_ = row[1].replaceAll('"','');
		let year_ = row[2].replaceAll('"','');
		let location_ = row[3].replaceAll('"','');
		let continent_ = row[4].replaceAll('"','');
		let typeStr_ = row[5].replaceAll('"','');
		let aspectsStr_ = row[6].replaceAll('"','').split(', ');
		let imgUrl_ = row[7].slice(1,-1);
		let sourceUrl_ = row[8].slice(1,-1);
		let descript_ = row[9].slice(1,-1);

		let iconIndex = typeStrs.findIndex(typeStr => typeStr == typeStr_);
		let thistype = types[iconIndex];

		// nodes.push(new Node(row[0], row[1], int(row[2]), row[3], row[4], row[5], row[6].replaceAll('"').split(', '),row[7],row[8],row[9],thistype.typeIcon, img));
		nodes.push(new Node(name_, architect_,year_,location_,continent_, typeStr_, aspectsStr_,imgUrl_, sourceUrl_, descript_,thistype.typeIcon));
		
	});
	
	nodes.forEach(node => node.aspects = findAspects(node.aspectsStr));
	
}

function initializeAspects() {
	
	// let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];

		let colorIds = [];
		colorIds.push([100,150,255]);
		colorIds.push([69,168,81]);
		colorIds.push([249,143,64]);
		colorIds.push([245,160,205]);
		colorIds.push([190,103,247]);
		colorIds.push([255,103,109]);
		colorIds.push([95,209,196]);
		colorIds.push([246,13,71]);
		colorIds.push([231,73,145]);
		colorIds.push([232,232,52]);

	
	//calculate aspect locations
	n = aspectStrs.length;
	let v = createVector(1, 0);
	let points = [v.copy()];
	for(let p = 1; p < n; ++p) {
	  points.push(v.rotate(2*PI/n).copy());
	}
  
	//unsure what canvaspadding was?
	let canvasPadding = 200;

	for(let a =0;a<aspectStrs.length;a++){
			aspects.push(new Aspect(aspectStrs[a],colorIds[a]));
      aspects[a].p = new p5.Vector(width/2 + points[a].x * (height-canvasPadding)/2,height/2 - points[a].y * (height-canvasPadding)/2);
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

	canvasXW=windowWidth;
	canvasYH=windowHeight;
	resizeCanvas(canvasXW, canvasYH);
	canvas.position(0,0);


}