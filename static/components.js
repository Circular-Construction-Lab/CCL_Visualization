
class Node{
	constructor(name_, architect_, year_, location_, continent_,typeStr_ ,aspectsStr_, imgUrl_, sourceUrl_, descript_, typeIcon_){
		this.name = name_;
		this.year = year_;
		this.location = location_;
		this.continent = continent_;
		this.typeStr = typeStr_;
		this.architect = architect_;
		this.aspectsStr=aspectsStr_;
		this.imgUrl = imgUrl_;
		this.sourceUrl = sourceUrl_;
		this.descript = descript_;
		this.aspects;
	

		// this.descript = "Following the principle of 'High Performance Low Emissions', NEST's HiLo unit realized by ETH Zurich's Block Research Group and the Architecture and Building Systems Group in cooperation with numerous industrial partners, demonstrates how attractive architecture can be when combining energy- and resource-saving construction and operation. The unit brings together innovative planning and design methods for efficient structures in concrete with self-learning and adaptive building technologies.The HiLo Unit features innovations that address challenges of global resource and energy consumption and greenhouse gas emissions, especially perpetuated by the construction industry is responsible for a large share  The integrated design and fabrication approach used to build the two-story unit marks a starting point for the way we may design and build in the future.";

		//Icon settings
		this.typeIcon = typeIcon_;
		this.iconSize = 20;


		this.edgeCluster = [];
		
		//Moving settings
		this.p = new p5.Vector(random(windowWidth/2 - windowWidth/5-100,windowWidth/2 + windowWidth/5-100),random(windowHeight/2 - windowHeight/5,windowHeight/2 + windowHeight/5));
		this.u = new p5.Vector(0,0);
		this.f = new p5.Vector(0,0);
		this.dt = min(0.5, windowWidth/1920);
		this.damping = min(0.3, windowWidth/1920);
		this.isFixed = false;

		//Display settings
		this.isHidden = false;
		this.isSortYear = false;
		this.isSortCont = false;
		this.isSortType = false;

		this.isHover = false;
		this.d = 20;
		this.color = random(50,255);
		this.strokeWidth = 0.5;	
     	this.strokeColor = (200,200,200);

		this.isExpand = false;
	}

	AddForceTo(sourceNode_, sourceStrength_){
		let sourceNode = sourceNode_;
		let sourceStrength = sourceStrength_;

		//Force direction
		let dv = p5.Vector.sub(sourceNode.p, this.p);
		let dist = dv.mag();
		dv.normalize();

		//Add force
		this.f = this.f.add(dv.div(dist).mult(sourceStrength));
	}

	Move(){
		// check fixed
	    if (this.isFixed) return;

	  	// Movement
	    this.u = this.u.mult(this.damping);
	    this.u = this.u.add(this.f.mult(this.dt/1));
	    this.p = this.p.add(this.u.mult(this.dt));
	}

	display(){
		//expand info box
		if(this.isHidden){
			this.isExpand = false;
		}

		if(this.isExpand){

			let eX = this.p.x - 70;
			let eY = this.p.y -100;
			let eWidth = 200;
			let eHeight = 50;
			let eColor = color(120,120,120);
			eColor.setAlpha(200);

			push();

			stroke(200);
			strokeWeight(1);			
			fill(eColor);
			rect(eX,eY,eWidth,eHeight, 3);

			line(this.p.x, this.p.y, this.p.x-20, this.p.y-50);

			noStroke();
			fill(255);
			textSize(14);
			textStyle(BOLD);
			text(this.name, eX+8, eY+17);
			textSize(10);
			textStyle(NORMAL);
			text('by ' + this.architect, eX+10, eY+30);
			text(this.type + ', ' + this.year, eX+10, eY + 40);
			pop();
		}			
		
		push();
		if(!this.isHidden){
			if(this.isHover){
				strokeWeight(3);
				stroke(220,220,220);
				push();
				noStroke();
				fill(255,255,255);
				text(this.name, this.p.x -30, this.p.y -20);
				pop();
			}
			else{
				strokeWeight(1);
				stroke(50,200,200);
			}

			//sort Year test
			push();

			//Icon Display
			fill(255);
			circle(this.p.x, this.p.y, 20);
			image(this.typeIcon,this.p.x-(this.iconSize/2),this.p.y-(this.iconSize/2),this.iconSize,this.iconSize);

			fill(255);
			noStroke();
 			pop();
			
			//Circle display
			// circle(this.p.x,this.p.y,this.d);

		}
		pop();

		
	}


	toggleExpand(){
		if(!this.isHidden && this.isExpand==false){
			this.isExpand = true;
		}
		else{
			this.isExpand = false;
		}
	}


	checkEdges(xW, yH, width, height) {
		if (this.p.x > width-xW-200) {
			this.p.x = width-xW-200;
		  	this.u.x *= -1;
		} else if (this.p.x < xW) {
			this.p.x = xW;
			this.u.x *= -1;
		}
	 
		if (this.p.y > height-yH) {
			this.p.y = height-yH;
			this.u.y *= -1;
		}else if (this.p.y < yH){
			this.p.y = yH;
			this.u.y *= -1;
		}
	  }

	description(){
		textSize(12);
        text('selected: ' + this.name,(this.p.x+this.d/2)+5, this.p.y);
        text('by: ' + this.architect,(this.p.x+this.d/2)+5, this.p.y+15);
        noStroke();
        image(img, 650, 50, 100);
        text(this.name, 650, 150);
        text("architect: " + this.architect, 650,165);
        textSize(10);
        for(let i=0;i<this.aspectsStr.length;i++){
            text(this.aspectsStr[i], 650, 190+(i*15)); 
        }
        textSize(8);
        text(this.descript, 620, 195+(15*this.aspectsStr.length), 160, 500);
	}
}

class Edge{
	constructor(node_, aspect_,){
		this.node = node_;
		this.aspect = aspect_;
	}
	ApplyForce(){
		let dv = p5.Vector.sub(this.aspect.p, this.node.p);
		let dist = dv.mag();
		dv.normalize();
		//here control force, speed
		this.node.f =this.node.f.add(dv.mult((0.5*dist/100)-0.5));
	}

	display(){
		if(!this.node.isHover){
			strokeWeight(this.aspect.strokeWidth);
		}
		stroke(this.aspect.edgeColor);
		line(this.node.p.x,this.node.p.y, this.aspect.p.x,this.aspect.p.y);
	}
}

class EdgeCluster{
	constructor(node_, aspects_,){
		this.node = node_;
		this.aspects = aspects_;
		this.edges = [];
		this.aspects.forEach(element => this.edges.push(new Edge(this.node, element)));
		//display setting
		this.isHover = false;
	}

	display(){
		if(!this.node.isHidden){
		push();
		if(this.isHover){
			strokeWeight(3);			
			stroke(255,255,255);

		}else{
			strokeWeight(0.5);
		}
		this.edges.forEach(edge => edge.display());
		pop();
	}else {
		strokeWeight(0.1);
		
	}

}
	ApplyForce(){
		this.edges.forEach(edge => edge.ApplyForce());
	}
}

class Aspect{
	constructor(name_,colorIdle_){
		this.name = name_;
		this.isDrag = false;
		this.isHover = false;

		//Location
		this.p = new p5.Vector(random(100,windowWidth-300),random(100,windowHeight-100));

		//Display settings
		this.d = 20;
		this.colorIdle = colorIdle_;
		this.colorDrag = [255,255,50];	
		this.strokeWidth = 0.5;	
     	this.strokeColor = (200,200,200);
		
		this.edgeColor = this.colorIdle;
		this.sine = 0;
	}

	display(){

		if (this.p.x > windowWidth-450) {
			this.p.x = windowWidth-450;
		} else if (this.p.x < 20) {
			this.p.x = 20;
		}
	 
		if (this.p.y > windowHeight-20) {
			this.p.y = windowHeight-20;
		}else if (this.p.y < 20){
			this.p.y = 20;
		}
	  
		push();

		fill(255);
		noStroke();

		textSize(12);
		let textW = textWidth(this.name);
		text(this.name, this.p.x- textW/2, this.p.y + 20);
    
		if(this.isDrag){
			this.p.x = mouseX;
			this.p.y = mouseY;
			// fill(this.colorDrag[0],this.colorDrag[1],this.colorDrag[2]);
			stroke(this.colorIdle);
			strokeWeight(0.5);
			fill(0,0,0,0);
			circle(this.p.x, this.p.y, this.d+this.sine);
			this.sine++;
			fill(this.colorIdle);

		}else{
			// fill(this.colorIdle[0],this.colorIdle[1],this.colorIdle[2]);
			fill(0);
			
		}
		push();
		if(this.isHover){
			this.strokeWidth= 2;
			strokeWeight(0.5);
			stroke(this.colorIdle);
			fill(0,0,0,0);
			circle(this.p.x, this.p.y, this.d+this.sine);
			this.sine++;
			// this.edgeColor = [255,255,255];
		}
		else{
			this.edgeColor = this.colorIdle;
			this.strokeWidth= 0.5;
			this.sine=0;
		}
		pop();
		stroke(this.colorIdle);
		strokeWeight(2);
		circle(this.p.x,this.p.y,this.d);
		fill(this.colorIdle);
		noStroke();
		textSize(14);
		text(this.name, this.p.x- (this.d), this.p.y - 20);
		pop();
		}
	}



// class Popup{
// 	constructor(x_,y_){
// 		this.x = x_;
// 		this.y = y_;
// 		this.div = createDiv(' ');
// 		this.pimg = createImg('../assets/Kendeda-icon.jpg','test image');
// 		this.h1 = createElement('h1','initial h1');
// 		//this.h2 = createElement('h2','initial h2');
// 		this.h3 = createElement('h3','initial h3');
// 		this.p = createP('initialized');
// 	}

// 	initialStyle(){
// 		this.div.class('popup');
// 		this.h1.class('proj');

// 		this.h3.class('detail');
// 		this.p.class('descript');
// 		this.h1.parent(this.div);
// 		this.pimg.parent(this.div);
// 		this.h3.parent(this.div);

// 		this.p.parent(this.div);
// 		this.div.position(windowWidth-280,50);
// 		this.div.hide();
// 	}

// 	updatePopup(h1_,h3_,loc_,year_,pimg_,p_){
// 		this.h1.html(h1_);
// 		this.h3.html(h3_ + '<br>' + loc_ + '<br>' + year_);
// 		this.pimg = createImg(pimg_,'test');
// 		this.p.html(p_);
// 		print(pimg_);
// 	}

// 	toggleShow(){
// 		this.div.show();
// 	}

// }

class Popup_v2{
	constructor(id_){
		this.div = createDiv(' ');
		this.div.id(id_);
		this.container = createDiv(' ');
		this.div.parent(this.container);
		this.container.parent('info');
		this.pimg = createImg('../assets/Kendeda-icon.jpg','test image');
		this.div.class('popup');
		this.pfill = "<span id='close' onclick='this.parentNode.parentNode.removeChild(this.parentNode); return false;'>x</span><h1>initial h1</h1><h3>initial h3</h3><img src='../assets/Kendeda-icon.jpg'><p>initialized</p>";
		this.div.html(this.pfill);

		// this.div.position(windowWidth-280,50);
		// this.h1 = createElement('h1','initial h1');
		//this.h2 = createElement('h2','initial h2');
		// this.h3 = createElement('h3','initial h3');
		// this.p = createP('initialized');
	}

	initialStyle(){
		// this.h1.class('proj');
		// this.h3.class('detail');
		// this.p.class('descript');
		// this.h1.parent(this.div);
		// this.pimg.parent(this.div);
		// this.h3.parent(this.div);
		// this.p.parent(this.div);
		// this.div.hide();
	}

	updatePopup(h1_,h3_,loc_,year_,pimg_,p_){
		// this.pfill = "<span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span><h1>"+ h1_ + "</h1><h3>" + h3_ + "</h3><h3>" + loc_ + ", " + year_ + "</h3><img src='../assets/Kendeda-icon.jpg'><p>" + p_ + "</p>";

		this.pfill = "<span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span><h1>"+ h1_ + "</h1><h3>" + h3_ + "</h3><h3>" + loc_ + ", " + year_ + "</h3><img src='" + pimg_ + "'/><p>" + p_ + "</p>";
		this.div.html(this.pfill);

		// this.h1.html(h1_);
		// this.h3.html(h3_ + '<br>' + loc_ + '<br>' + year_);
		// this.pimg = createImg(pimg_,'test');
		// this.p.html(p_);
		// print(pimg_);
	}

	toggleShow(){
		this.div.show();
	}

}

class Type{
	constructor(typeStr_, typeIcon_){
		this.typeStr = typeStr_;
		this.typeIcon = typeIcon_;
	}
}