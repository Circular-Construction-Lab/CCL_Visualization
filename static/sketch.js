let canvas;
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

<<<<<<< Updated upstream
let continentStrs = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];
let typeStrs = ['data', 'built project', 'method', 'proposal','installation','landscape architecture project','publication','movement','planning project','material','research'];
let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];

=======
let continentStrs = [
	"asia",
	"europe",
	"africa",
	"north america",
	"south america",
	"oceania",
];

let typeStrs = ["project", "tool", "publication", "strategy"];

let aspectStrs = [
	"water",
	"site",
	"digitalization",
	"fabrication",
	"people",
	"health",
	"technical metabolism",
	"circular economy",
	"biological metabolism",
	"energy",
];
>>>>>>> Stashed changes

//pop-up box and array
let popUp;
let popUps = [];

<<<<<<< Updated upstream

let img;

function initializeCanvas() {
	// createCanvas
	canvas = createCanvas(windowWidth-200, windowHeight);
	canvas.position(200,0);


	// centerCanvas
	// xW = (windowWidth - width) / 2;
	// yH = (windowHeight - height) / 2;
	// canvas.position(xW, yH);
=======
var inputLeft;
var inputRight;
var thumbLeft;
var thumbRight;
var range;

function initializeCanvas() {
	// createCanvas
	canvasXW = windowWidth - 400;
	canvasYH = windowHeight;
	canvas = createCanvas(canvasXW, canvasYH);
	//canvas.position(150,0);
>>>>>>> Stashed changes
}

function preload() {
	table = loadTable("assets/Database_6_07.csv", "csv", "header");

<<<<<<< Updated upstream
	table = loadTable('assets/Database_4_18.csv', 'csv', 'header');

	
	// load Icons
	for(i = 0; i < typeStrs.length; i ++){
		types.push(new Type(typeStrs[i], loadImage('assets/type'+i+'.png')));
	}
=======
	// load Icons
>>>>>>> Stashed changes

	for (i = 0; i < typeStrs.length; i++) {
		types.push(
			new Type(typeStrs[i], loadImage("assets/icon4/type" + i + ".png"))
		);
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
	// displaySelectButton();

<<<<<<< Updated upstream
	sortYear(slider.value(), 2020);
	sortContinent(continentSelected);
	sortType(typeSelected);
	checkHidden();

=======
	sortYear(slider.noUiSlider.get()[0], slider.noUiSlider.get()[1]);
	sortContinent(continentSelected);
	sortType(typeSelected);
	checkHidden();
}

function noStack() {
	// for between aspects
	aspects.forEach(function (aspect0) {
		aspects.forEach(function (aspect1) {
			if (aspect0 != aspect1) {
				let dist = aspect0.p.dist(aspect1.p);
				if (dist < 10) {
					aspect0.p = aspect0.p.add(
						new p5.Vector(
							random(-aspect0.d / 2, aspect0.d / 2),
							random(-aspect0.d / 2, aspect0.d / 2)
						)
					);
				}
			}
		});
	});
	// for between nodes and aspects
	nodes.forEach(function (node){
		aspects.forEach(function(aspect){
			//Calculate force between aspect and node
			let dv = p5.Vector.sub(aspect.p, node.p);
			let dist = dv.mag();
			dv.normalize();
			
			if(dist<aspect.d){
				node.f =node.f.add(dv.mult(-1));
			}
		});
	});
>>>>>>> Stashed changes
}
function checkEventCon() {
	checkboxsCon.forEach(function (checkbox) {
		if (checkbox.checked()) {
			continentSelected.push(checkbox.value());
		} else {
<<<<<<< Updated upstream
			continentSelected = continentSelected.filter(e => e !== checkbox.value());

=======
			continentSelected = continentSelected.filter(
				(e) => e !== checkbox.value()
			);
>>>>>>> Stashed changes
		}
	});

}
function checkEventType() {
	checkboxsType.forEach(function (type) {
		if (type.checked()) {
			typeSelected.push(type.value());
		} else {
<<<<<<< Updated upstream
			typeSelected = typeSelected.filter(e => e !== type.value());

=======
			typeSelected = typeSelected.filter((e) => e !== type.value());
>>>>>>> Stashed changes
		}
	});
}

function selectAllCheckboxes() {
	console.log("select");
	checkboxsCon.forEach((checkbox) => checkbox.checked(true));
	checkboxsType.forEach((checkbox) => checkbox.checked(true));
	//check check status again
	checkEventCon();
	checkEventType();
}

function clearSelection() {
	console.log("clear");
	checkboxsCon.forEach((checkbox) => checkbox.checked(false));
	checkboxsType.forEach((checkbox) => checkbox.checked(false));
	//check check status again
	checkEventCon();
	checkEventType();
	
}

<<<<<<< Updated upstream
function initializeSelectButton(){
	buttonAll = createButton('select all');
	buttonClear = createButton('clear selection');

	buttonAll.position(30, 440);
	buttonClear.position(30, 480);

	buttonAll.mousePressed(selectAllCheckboxes);
	buttonClear.mousePressed(clearSelection);
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
	continentStrs.forEach(con => checkboxsCon.push(createCheckbox(con, true)));
	checkboxsCon.forEach(function (checkbox) {
		checkbox.changed(checkEventCon);
	});
	checkboxsCon.forEach(function (checkbox, i) {
		checkbox.position(10, 50 + i * 20);
	});

}

function initializeCheckboxType() {
	typeStrs.forEach(type => checkboxsType.push(createCheckbox(type, true)));
	checkboxsType.forEach(function (checkbox) {
		checkbox.changed(checkEventType);
	});
	checkboxsType.forEach(function (checkbox, i) {
		checkbox.position(10, 190 + i * 20);
=======
function initializeSelectButton() {
	let p = createP("<br>");
	p.parent("vizsort");
	buttonAll = createButton("select all");
	buttonClear = createButton("clear selection");

	buttonAll.parent("vizsort");
	buttonClear.parent("vizsort");

	buttonAll.class("button");
	buttonClear.class("button");

	buttonAll.mousePressed(selectAllCheckboxes);
	buttonClear.mousePressed(clearSelection);

	let tempButton = createButton(
		'<a href="readTest.html">test database content</a>'
	);
	tempButton.parent("vizsort");
	let formButton = createButton(
		'<a href="https://forms.gle/FZEA2GpuWxDxZUh87">add a project</a>'
	);
	formButton.parent("vizsort");
}

function initializeSlider() {
	let p = createP("By Year");
	p.parent("vizsort");
	p.parent("top");


	slider = document.getElementById("slider-round");
	console.log(slider);

	noUiSlider.create(slider, {
		start: [1900, 2020],
		tooltips: 
			wNumb({decimals: 0}), // tooltip with custom formatting
		connect: true,
		direction: 'rtl',
		orientation: 'vertical',
		margin: 5,
		range: {
			'min': 1900,
			'max': 2020
		}
	});




	// pYearStart = createP(1900);
	// pYearStart.parent("vizsort");
	// pYearEnd = createP(2020);
	// pYearEnd.parent("vizsort");

}


function initializeCheckboxCon() {
	let p = createP("<br><br><br>By Location:");
	p.parent("vizsort");
	continentStrs.forEach((con) => checkboxsCon.push(createCheckbox(con, true)));
	checkboxsCon.forEach(function (checkbox) {
		checkbox.changed(checkEventCon);
		checkbox.class("checkbox");
		checkbox.parent("vizsort");
		// checkbox.class('checkmarkCon');
	});
}

function initializeCheckboxType() {
	let p = createP("<br><br><br>By Type:");
	p.parent("vizsort");
	typeStrs.forEach((type) => checkboxsType.push(createCheckbox(type, true)));
	checkboxsType.forEach(function (checkbox) {
		checkbox.changed(checkEventType);
		checkbox.class("checkbox");
		checkbox.parent("vizsort");
		// checkbox.class('checkmarkType');
>>>>>>> Stashed changes
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

// Display year silider text info
function displaySliderYear() {
<<<<<<< Updated upstream
	pYearStart.html(slider.value());
=======
	// pYearStart.html(int(slider.noUiSlider.get()[0]));
	// pYearEnd.html(int(slider.noUiSlider.get()[1]));
>>>>>>> Stashed changes
}

// check if the node is hidden
function checkHidden() {
	nodes.forEach(function (node) {
		if (node.isSortYear || node.isSortCont || node.isSortType) {
			node.isHidden = true;
		} else {
			node.isHidden = false;
		}
	});
}

// check if cursor is hovering on the node
function hover() {
	for (let i = 0; i < nodes.length; i++) {
		if (overElement(nodes[i].p.x, nodes[i].p.y, nodes[i].d / 2)) {
			nodes[i].isHover = true;
			nodes[i].edgeCluster.isHover = true;
		} else {
			nodes[i].isHover = false;
			nodes[i].edgeCluster.isHover = false;
		}
	}
<<<<<<< Updated upstream
=======

	for (let a = 0; a < aspects.length; a++) {
		if (overElement(aspects[a].p.x, aspects[a].p.y, aspects[a].d)) {
			aspects[a].isHover = true;
		} else {
			aspects[a].isHover = false;
		}
	}
>>>>>>> Stashed changes
}

//called when mouse is pressed to drag an aspect
function mousePressed() {
	for (let i = 0; i < aspects.length; i++) {
		if (overElement(aspects[i].p.x, aspects[i].p.y, aspects[i].d / 2)) {
			aspects[i].isDrag = true;
		}
	}

	for (let n = 0; n < nodes.length; n++) {
<<<<<<< Updated upstream
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
=======
		if (
			overElement(nodes[n].p.x, nodes[n].p.y, nodes[n].d) &&
			!nodes[n].isHidden
		) {
			if (!nodes[n].isExpand) {
				pid++;
				popUp = new Popup_v2(pid, nodes[n]);
				popUps.push(popUp);
				nodes[n].isExpand = true;
			} else {
				nodes[n].isExpand = false;
				for (let q = 0; q < popUps.length; q++) {
					if (nodes[n].popUp == popUps[q].id) {
						popUps[q].updatePopup();
					}
				}
			}
>>>>>>> Stashed changes
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
	} else {
		return false;
	}
}

function updateNodes() {
<<<<<<< Updated upstream
	nodes.forEach(node => node.Move());
	nodes.forEach(node => node.checkEdges(0, 0, windowWidth, windowHeight));
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter(element => element != node);
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -10));
=======
	//enable movements
	nodes.forEach((node) => node.Move());

	//boundary
	nodes.forEach((node) =>
		node.checkEdges(50, 50, canvasXW - 50, canvasYH - 50)
	);
	// 	nodes.forEach(node => node.checkEdges(canvasPadding, canvasPadding, windowWidth, windowHeight));

	//repel from other nodes
	nodes.forEach((node) => repel(node));
	edgeClusters.forEach((edgeCluster) => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter((element) => element != node);
	//here Control repel force
	nodesRepelFrom.forEach((element) => node.AddForceTo(element, -5));
>>>>>>> Stashed changes
}

function initializeNodes() {
	let rows = table.getArray();
<<<<<<< Updated upstream
	rows.forEach(function(row) {
		let iconIndex = typeStrs.findIndex(typeStr => typeStr == row[5]);
		let thistype = types[iconIndex];
		nodes.push(new Node(row[0], row[1], int(row[2]), row[4], row[5], row[6].replaceAll('"').split(', '),thistype.typeIcon, img));
	});
	
	nodes.forEach(node => node.aspects = findAspects(node.aspectsStr));
}

function initializeAspects() {
		aspectStrs.forEach(aspectStr => aspects.push(new Aspect(aspectStr)));
=======
	
	// data refine
	rows.forEach(function (row) {
		let name_ = row[0].replaceAll('"', "");
		let architect_ = row[1].replaceAll('"', "");
		let year_ = row[2].replaceAll('"', "");
		let location_ = row[3].replaceAll('"', "");
		let continent_ = row[4].replaceAll('"', "");
		let typeStr_ = row[5].replaceAll('"', "");
		let aspectsStr_ = row[6].replaceAll('"', "").split(", ");
		let imgUrl_ = row[7].slice(1, -1);
		let sourceUrl_ = row[8].slice(1, -1);
		let descript_ = row[9].slice(1, -1);

		let iconIndex = typeStrs.findIndex((typeStr) => typeStr == typeStr_);
		let thistype = types[iconIndex];

		// nodes.push(new Node(row[0], row[1], int(row[2]), row[3], row[4], row[5], row[6].replaceAll('"').split(', '),row[7],row[8],row[9],thistype.typeIcon, img));
		nodes.push(
			new Node(
				name_,
				architect_,
				year_,
				location_,
				continent_,
				typeStr_,
				aspectsStr_,
				imgUrl_,
				sourceUrl_,
				descript_,
				thistype.typeIcon
			)
		);
	});

	nodes.forEach((node) => (node.aspects = findAspects(node.aspectsStr)));
}

function initializeAspects() {
	// let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];

	let colorIds = [];
	colorIds.push([100, 150, 255]);
	colorIds.push([69, 168, 81]);
	colorIds.push([249, 143, 64]);
	colorIds.push([245, 160, 205]);
	colorIds.push([190, 103, 247]);
	colorIds.push([255, 103, 109]);
	colorIds.push([95, 209, 196]);
	colorIds.push([246, 13, 71]);
	colorIds.push([231, 73, 145]);
	colorIds.push([232, 232, 52]);

	//calculate aspect locations
	n = aspectStrs.length;
	let v = createVector(1, 0);
	let points = [v.copy()];
	for (let p = 1; p < n; ++p) {
		points.push(v.rotate((2 * PI) / n).copy());
	}

	//unsure what canvaspadding was?
	let canvasPadding = 200;

	for (let a = 0; a < aspectStrs.length; a++) {
		aspects.push(new Aspect(aspectStrs[a], colorIds[a]));
		aspects[a].p = new p5.Vector(
			width / 2 + (points[a].x * (height - canvasPadding)) / 2,
			height / 2 - (points[a].y * (height - canvasPadding)) / 2
		);
	}
>>>>>>> Stashed changes
}

function initializeEdges() {
	nodes.forEach(function (node) {
		node.edgeCluster = new EdgeCluster(node, node.aspects);
		edgeClusters.push(node.edgeCluster);
	});
}

function displayEdgeClusters() {
	edgeClusters.forEach((edgeCluster) => edgeCluster.display());
}

function displayNodes() {
	nodes.forEach((node) => node.display());
}

function displayAspects() {
<<<<<<< Updated upstream
	aspects.forEach(aspect => aspect.display());
=======
	aspects.forEach((aspect) => aspect.display());
>>>>>>> Stashed changes
}

function findAspects(aspectsToFind) {
	aspectsFound = [];
	aspectsToFind.forEach((aspect) =>
		aspectsFound.push(aspects.find((element) => element.name == aspect))
	);
	return aspectsFound;
}

<<<<<<< Updated upstream
function windowResized(){
	resizeCanvas(windowWidth-200, windowHeight);
}
=======
function windowResized() {
	canvasXW = windowWidth - 400;
	canvasYH = windowHeight;
	resizeCanvas(canvasXW, canvasYH);
	canvas.position(150, 0);
}
>>>>>>> Stashed changes
