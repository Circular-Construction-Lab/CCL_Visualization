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

let continentStrs = ['asia', 'europe', 'africa', 'north america', 'south america', 'oceania'];
let typeStrs = ['data', 'built project', 'method', 'proposal','publication','movement','planning project','material','research'];
let aspectStrs = ['water', 'site', 'digitalization', 'fabrication', 'people', 'health', 'technical metabolism', 'circular economy', 'biological metabolism','energy'];


//pop-up box and array
let popUp;
let popUps = [];


function initializeCanvas() {
	// createCanvas
	canvas = createCanvas(windowWidth-200, windowHeight);
	canvas.position(200,0);


	// centerCanvas
	// xW = (windowWidth - width) / 2;
	// yH = (windowHeight - height) / 2;
	// canvas.position(xW, yH);
}


function preload() {

	table = loadTable('assets/Database_5_05.csv', 'csv', 'header');

	
	// load Icons
	
	for(i = 0; i < typeStrs.length; i ++){
		types.push(new Type(typeStrs[i], loadImage('assets/icon2/type'+i+'.png')));
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

	for (let n = 0; n < nodes.length; n++) {
		if (overElement(nodes[n].p.x, nodes[n].p.y, nodes[n].d)) {
			let h1_ = nodes[n].name;
			let h3_ = nodes[n].architect;
			let loc_ = nodes[n].location;
			let year_ = nodes[n].year;
			let pimg_ = nodes[n].imgUrl;
			let p_ = nodes[n].descript;
			popUp.updatePopup(h1_,h3_,loc_,year_,pimg_,p_);
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
	nodes.forEach(node => node.Move());
	nodes.forEach(node => node.checkEdges(0, 0, windowWidth, windowHeight));
	nodes.forEach(node => repel(node));
	edgeClusters.forEach(edgeCluster => edgeCluster.ApplyForce());
}

function repel(node) {
	let nodesRepelFrom = nodes.filter(element => element != node);
	nodesRepelFrom.forEach(element => node.AddForceTo(element, -10));
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
		colorIds.push([18,14,177]);
		colorIds.push([69,168,81]);
		colorIds.push([219,143,34]);
		colorIds.push([205,61,213]);
		colorIds.push([79,43,157]);
		colorIds.push([255,83,59]);
		colorIds.push([15,179,146]);
		colorIds.push([246,13,71]);
		colorIds.push([231,73,145]);
		colorIds.push([232,91,22]);

		for(let a =0;a<aspectStrs.length;a++){
			aspects.push(new Aspect(aspectStrs[a],colorIds[a]));
		}

		// aspectStrs.forEach(aspectStr => aspects.push(new Aspect(aspectStr,)));
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