class Node{
	constructor(name_, architect_, year_, continent_,typeStr_ ,aspectsStr_,typeIcon_, image_){
		this.name = name_;
		this.year = year_;
		this.continent = continent_;
		this.typeStr = typeStr_;
		this.architect = architect_;
		this.aspectsStr=aspectsStr_;
		this.aspects;
		//Image 
		this.image = image_;

		this.descript = "Following the principle of 'High Performance Low Emissions', NEST's HiLo unit realized by ETH Zurich's Block Research Group and the Architecture and Building Systems Group in cooperation with numerous industrial partners, demonstrates how attractive architecture can be when combining energy- and resource-saving construction and operation. The unit brings together innovative planning and design methods for efficient structures in concrete with self-learning and adaptive building technologies.The HiLo Unit features innovations that address challenges of global resource and energy consumption and greenhouse gas emissions, especially perpetuated by the construction industry is responsible for a large share  The integrated design and fabrication approach used to build the two-story unit marks a starting point for the way we may design and build in the future.";

		//Icon settings
		this.typeIcon = typeIcon_;
		this.iconSize = 20;


		this.edgeCluster = [];
		
		//Moving settings
		this.p = new p5.Vector(random(50,windowWidth-250),random(50,windowHeight-50));
		this.u = new p5.Vector(0,0);
		this.f = new p5.Vector(0,0);
		this.dt = 0.5;
		this.damping = 0.3;
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

	Move(dt, damping){
		// check fixed
	    if (this.isFixed) return;

	  	// Movement
	    this.u = this.u.mult(this.damping);
	    this.u = this.u.add(this.f.mult(this.dt/1));
	    this.p = this.p.add(this.u.mult(this.dt));
	}

	display(){
		//expand info box
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
				strokeWeight(2);
				stroke(200,200,50);
			}
			else{
				strokeWeight(1);
				stroke(50,200,200);
			}

			//sort Year test
			push();
			//Icon Display
			image(this.typeIcon,this.p.x-(this.iconSize/2),this.p.y-(this.iconSize/2),this.iconSize,this.iconSize);

			fill(255);
			noStroke();
			//Text Display
// 			textSize(12);
// 			text(this.year, this.p.x- (this.d), this.p.y + 30);
// 			text(this.continent, this.p.x- (this.d), this.p.y + 40);
// 			text(this.typeStr, this.p.x- (this.d), this.p.y + 50);
 			pop();
			
			//Circle Nodes Display
 			// fill(this.color);
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
		if (this.p.x > xW+ width) {
			this.p.x = xW+ width;
		  	this.u.x *= -1;
		} else if (this.p.x < xW) {
			this.p.x = xW;
			this.u.x *= -1;
		}
	 
		if (this.p.y > yH + height) {
			this.p.y = yH + height;
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
		this.node.f =this.node.f.add(dv.mult((dist/100)-0.5));
	}

	display(){
		stroke(this.aspect.edgeColor[0],this.aspect.edgeColor[1],this.aspect.edgeColor[2]);
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
			stroke(255,255,50);
			strokeWeight(2);
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
	constructor(name_){
		this.name = name_;
		this.isDrag = false;

		//Location
		this.p = new p5.Vector(random(100,windowWidth-300),random(100,windowHeight-100));

		//Display settings
		this.d = 10;
		this.colorIdle = [50,200,200];
		this.colorDrag = [255,255,50];	
		this.strokeWidth = 0.5;	
     	this.strokeColor = (200,200,200);

		this.edgeColor = [random(0,255),random(0,255),random(0,255)];
	}

	display(){

		if (this.p.x > windowWidth-200) {
			this.p.x = windowWidth-200;
		} else if (this.p.x < 0) {
			this.p.x = 0;
		}
	 
		if (this.p.y > windowHeight) {
			this.p.y = windowHeight;
		}else if (this.p.y < 0){
			this.p.y = 0;
		}
	  
		push();
		fill(255);
		noStroke();
		textSize(12);
		text(this.name, this.p.x- (this.d), this.p.y + 16);
		if(this.isDrag){
			this.p.x = mouseX;
			this.p.y = mouseY;
			fill(this.colorDrag[0],this.colorDrag[1],this.colorDrag[2]);
		}else{
			fill(this.colorIdle[0],this.colorIdle[1],this.colorIdle[2]);
		}
		circle(this.p.x,this.p.y,this.d);
		pop();
		}
	}



class Popup{
	constructor(x_,y_){
		this.x = x_;
		this.y = y_;
		this.div = createDiv(' ');
		this.pimg = createImg('../assets/Kendeda-icon.jpg','test image');
		this.h1 = createElement('h1','initial h1');
		//this.h2 = createElement('h2','initial h2');
		this.h3 = createElement('h3','initial h3');
		this.p = createP('initialized');
	}

	initialStyle(){
		this.div.class('popup');
		this.h1.class('proj');

		this.h3.class('detail');
		this.p.class('descript');
		this.h1.parent(this.div);
		this.pimg.parent(this.div);
		this.h3.parent(this.div);

		this.p.parent(this.div);
		this.div.position(windowWidth-280,50);
		this.div.hide();
	}

	updatePopup(h1_,h3_,cont_,year_,pimg_,p_){
		this.h1.html(h1_);
		this.h3.html(h3_ + '<br>' + cont_ + ', ' + year_);
		this.pimg = pimg_;
		this.p.html(p_);
		
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