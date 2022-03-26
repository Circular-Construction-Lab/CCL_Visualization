1. ## Sketch.js

   **Global Variables:**
   canvas; 
   nodes[]; 
   aspects[];
   edgeClusters[];// all edges connected to a single node
   nodeEdges[]; 
   aspectStrs[]; // 10 aspects' names

   ## Main Program
   1. Preload() //Load external data
     1. table //Loaded database
     2. Img //Loaded images
   2. Setup() //Initialize canvas & class
     1. InitializeCanvas()
     2. InitializeAspects()
   	3. InitializeNodes()
   	4. InitializeEdges()
   3. Draw() //Draw in Canvas
   	1. CreateCanvas() //Refresh Canvas in frame rate
   	2. Update() //Update Canvas in frame rate
   	3. Hover() //Determine if cursor is over object and trigger reaction
   	4. Display() //Display edgeClusters & Aspects & Nodes
   1. update() //calculate all the Move() in all nodes; calculate the repel() for all nodes; edgeCluster.applyforce() from all edges to nodes
   2. overElement(element.x, element.y, element.diameter) // Once cursor overlap the element, Return true; else return false
   3. mousePressed() // Once cursor presses a aspect, turn the aspect.isDrag true
   4. mouseReleased() // Once cursor release a aspect, turn the aspect.isDrag false
   5. repel() // repel all nodes from each other
   6. hover() // if cursor is over turn node.isHover & node.edgeCluster true
   7. initialize() // loaddata from csv, generate aspects, edges, edgeClusters
   8. display() // display nodes, edgeClusters, aspects

## Components.js

1. class Node
	**local variables:**
	name;
	architect;
	aspectsStr // name of aspects this node belongs to
	aspects; // aspects this node belongs to
	image; // images related to this node
	
	edgeCluster; //all edges connected to this node
	
	p; // position of the node
	u; // velocity of the node
	f; // force of the node
	dt; // distance of one movement
	damping; // speed loss per movement
	isFixed;

	isHidden; 
	isHover; // hover status
	d; // diameter of the node
	color;
	strokeWidth;
	strokeColor;
	
	1. addForceTo(Node, Strength) // add force from the Node
	2. move(dt, damping) // node move in distence of dt, loss damping
	3. display() // display the node
	4. description() // description of the node

2. class Edge
	**local variables
	node; // the node of the edge
	aspect; // the aspect of the edge

	1. applyForce() // add force to the node in the edge
	2. display() // display this edge

3. class EdgeCluster
	**local variables
	node; // the node
	aspects; // all aspects connected to the node
	edges[]; // all edges connected to the node
	isHover;
	color;

	1. display() // display all edges in the cluster
	2. ApplyForce() //apply all forces to the node

4. class Aspect
	**local variables
	name;
	isDrag; // drag status of the aspect
	p; // position of the aspect
	d; // diameter of the aspect
	colorIdle;
	colorDrag;
	strokeWidth;
	strokecolor;

	1. display() // display the aspect