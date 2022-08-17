let table;
let nodes = [];
let aspects = [];
let img;
let ps = [];
let imgurltest = 'https://images.adsttc.com/media/images/5f48/e09b/b357/653a/0400/0148/slideshow/595741082c8b3e7cee4855280141f91a.jpg?1598611603';

function preload(){
    table = loadTable('assets/Database_6_07.csv', 'csv', 'header');
}

function setup(){
    noCanvas();

 //readTable
 for (let r=0;r<table.getRowCount();r++){
    let rnode = []

    for(let c=0;c<10;c++){
        rnode.push(table.getString(r,c));
    }
    nodes.push(rnode);
}


for(let n=0;n<nodes.length;n++){
    let rnode = [];
    rnode = nodes[n];
    let p = createP("ROW " + (n+2));
    p.style('color','green');
    p.style('font-size','20pt');
    p.style('font-weight', 'bold');
    for(let r=0;r<rnode.length;r++){
        let txt = rnode[r];
        let end = txt.length - 1;
        txt = txt.substring(1, end);

        let p2 = createP("   " + r + ": " + txt);
        switch(r){
           //project name
           case 0:
               p2.style('color','blue');
               p2.style('font-weight','bold');
               break;

            //architect
           case 1:
               break; 

            //date as year or 'under construction'
            case 2:
                break;

            //location as city, state
            case 3:
               break;

            //continent
            case 4:
               break;

            //project type
            case 5:
               break;

            //aspect list
            case 6:
               break;

            //image link
            case 7:
                //table data does not access image files
                // let icontest = createImg(imgurltest);
                let icontest = createImg(txt);               
                icontest.size(100,100);
               break;

            //source
            case 8:
               break;

            //summary
            case 9:
               break;


      } 
    }
    //line break between printed rows
    createElement('hr');
    createElement('br');
}

//style all
ps = selectAll('p');
// ps.parent('dread');
for(let i=0;i<ps.length;i++){
    ps[i].style('padding', '10px');
    ps[i].style('margin-left', '30px');
}

icons = selectAll('img');
for(let i=0;i<icons.length;i++){
    icons[i].style('padding', '10px');
    icons[i].style('margin-left', '30px');
}

}

function draw(){

}