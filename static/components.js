class Node{
	constructor(name_, architect_, year_, continent_,type_ ,aspectsStr_, image_){
		this.name = name_;
		this.year = year_;
		this.continent = continent_;
		this.type = type_;
		this.architect = architect_;
		this.aspectsStr=aspectsStr_;
		this.aspects;
		this.image = image_;

		this.edgeCluster = [];
		
		//Moving settings
		this.p = new p5.Vector(random(0,1000),random(0,500));
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
		push();
		if(!this.isHidden){
			if(this.isHover){
				this.description();
				strokeWeight(2);
				stroke(200,200,50);
			
			}else{
				strokeWeight(1);
				stroke(50,200,200);
			}

			//sort Year test
			push();
			noStroke();
			textSize(12);
			text(this.year, this.p.x- (this.d), this.p.y + 30);
			text(this.continent, this.p.x- (this.d), this.p.y + 40);
			text(this.type, this.p.x- (this.d), this.p.y + 50);
			pop();
			
			
			fill(this.color);
			circle(this.p.x,this.p.y,this.d);
		}
		pop();
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
        //print(this.naspects.length);
        textSize(10);
        for(let i=0;i<this.aspectsStr.length;i++){
            text(this.aspectsStr[i], 650, 190+(i*15)); 
        }
        textSize(8);
        text("Following the principle of 'High Performance – Low Emissions', NEST's HiLo unit realized by ETH Zurich's Block Research Group and the Architecture and Building Systems Group in cooperation with numerous industrial partners, demonstrates how attractive architecture can be when combining energy- and resource-saving construction and operation. The unit brings together innovative planning and design methods for efficient structures in concrete with self-learning and adaptive building technologies.The HiLo Unit features innovations that address challenges of global resource and energy consumption and greenhouse gas emissions, especially perpetuated by the construction industry is responsible for a large share  The integrated design and fabrication approach used to build the two-story unit marks a starting point for the way we may design and build in the future.", 620, 195+(15*this.aspectsStr.length), 160, 500);
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
		this.color = [random(0,255),random(0,255),random(0,255)];
	}
	display(){
		if(!this.node.isHidden){
		push();
		if(this.isHover){
			stroke(255,255,50);
			strokeWeight(2);
		}else{
			stroke(this.color[0],this.color[1],this.color[2]);
			strokeWeight(0.5);
		}
		this.edges.forEach(edge => edge.display());
		pop();
	}else {
		stroke(this.color[0],this.color[1],this.color[2]);
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
		this.p = new p5.Vector(random(0,1000),random(0,500));

		//Display settings
		this.d = 10;
		this.colorIdle = [50,200,200];
		this.colorDrag = [255,255,50];
		this.strokeWidth = 0.5;	
     	this.strokeColor = (200,200,200);
	}
	display(){
		push();
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
