
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

		//Icon settings
		this.typeIcon = typeIcon_;
		this.iconSize = 20;

		this.edgeCluster = [];
		
		//Moving settings
		this.p = new p5.Vector(random(windowWidth/2 - windowWidth/5, windowWidth/2 + windowWidth/5),random(windowHeight/2 - windowHeight/5,windowHeight/2 + windowHeight/5));
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
		this.popUp = 0;
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

		// if(this.isHidden){
		// 	this.isExpand = false;
		// }

		if(this.isExpand){
				strokeWeight(5);
				noFill();
				stroke(225);
				ellipse(this.p.x, this.p.y, 20);
				push();
				noStroke();
				fill(255,255,255);
				textSize(12);
				let textW =textWidth(this.name);
				text(this.name, this.p.x -textW/2, this.p.y -20);
		}			
		
		push();

		if(!this.isHidden){

			if(this.isHover){
				fill(255);
				strokeWeight(5);
				stroke(220,220,220);
				ellipse(this.p.x, this.p.y, 20);
				strokeWeight(3);
				stroke(220,220,220);
				push();
				noStroke();
				fill(255,255,255);
				textSize(12);
				let textW =textWidth(this.name);
				text(this.name, this.p.x -textW/2, this.p.y -20);
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
			image(this.typeIcon,this.p.x-(this.iconSize/2),this.p.y-(this.iconSize/2),this.iconSize,this.iconSize);
			noStroke();

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
		if (this.p.x > width) {
			this.p.x = width;
		  	this.u.x *= -1;
		} else if (this.p.x < xW) {
			this.p.x = xW;
			this.u.x *= -1;
		}
	 
		if (this.p.y > height) {
			this.p.y = height;
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
		this.node.f =this.node.f.add(dv.mult(((0.5*dist)/100-0.5)));
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
		this.d = 40;
		this.colorIdle = colorIdle_;
		this.colorDrag = [255,255,50];	
		this.strokeWidth = 0.5;	
     	this.strokeColor = (200,200,200);
		
		this.edgeColor = this.colorIdle;
		this.sine = 0;
	}

	display(){

		if (this.p.x > canvasXW-50) {
			this.p.x = canvasXW-50;
		} else if (this.p.x < 50) {
			this.p.x = 50;
		}
	 
		if (this.p.y > canvasYH - 50) {
			this.p.y = canvasYH - 50;
		}else if (this.p.y < 50){
			this.p.y = 50;
		}
	  
		push();

		fill(255);
		noStroke();


    
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
		}

		else{
			this.edgeColor = this.colorIdle;
			this.strokeWidth= 0.5;
			this.sine=0;
		}
		pop();


		stroke(255);
		fill(this.colorIdle);
		strokeWeight(2);
		circle(this.p.x,this.p.y, this.d/1.5);
		
		push();
		if(this.isHover){
			noStroke();
			fill(0)
			circle(this.p.x, this.p.y, this.d/2);
		}
		pop();


		let textW = textWidth(this.name);
		stroke(0);
		textSize(16);
		text(this.name, this.p.x - (textW/2 -2), this.p.y - 25);
		pop();

		}
	}

class Popup_v2{
	constructor(id_, node_){
		this.id = id_;
		this.node = node_;

		//match to node
		this.node.popUp = this.id;

		//create new div html elements
		this.container = createDiv(' ');
		this.container.parent('info');
		this.div = createDiv(' ');
		this.div.id(this.id);
		this.div.parent(this.container);
		this.div.class('popup');
	
		//popup fill content
		this.pfill= "<span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span><h1>"+ this.node.name + "</h1><h3>" + this.node.architect + "</h3><h3>" + this.node.location + ", " + this.node.year + "</h3><img src='" + this.node.imgUrl + "'/><p>" + this.node.descript + "</p>";

		this.div.html(this.pfill);
	}

	


	updatePopup(){
		this.container.hide();
	 }

}

class Type{
	constructor(typeStr_, typeIcon_){
		this.typeStr = typeStr_;
		this.typeIcon = typeIcon_;
	}
}