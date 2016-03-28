//marisa lu

// graphic representation of PHYSICS:
//these are all the variables dealing with creating the force vector that appears
//when the user clicks and drags their mouse
var howLongDidTheySurvive = second();
var didTheyStart;
var didTheyLose=false;
var forceBegin;
var mouseXForceVector;
var mouseYForceVector;
var mouseXEndForce;
var mouseYEndForce;
var isMouseDragged;
var angleOfLaunch;
var xForce;
var yForce;
var sheepLaunchedYet;//boolean

var nakedSheep;//a sheep object
var sheepMass;


//physics of the motion
var initialVelocityX;//determined by the instantaneous acceleration 
var velocityX;
var velocityY;
var frameSetRate = 30;
var gravityAccel = -9.8/frameSetRate;
var airFrictionX = 5/frameSetRate;

//sounds: sheep bleats when you launch, the clouds "whoosh" on impact
//and the clank signifies death of sheep
var mySnd;
var bop;
var drop;

var isItFluffy;//boolean determines which set of sheep images to use
var noWoolImg;
var myImg;
var fluffyImg;
var woolImg;


var randomClouds = [];
var numOfClouds = 3;


var numCloudsCollected=0;

// //==========================================================
//how to play:
//click and drag the mouse anywere on the screen to launch sheep
// don't let the sheep fall off screen or go past the borders sideways
//just enjoy, and keep launching the sheep to accumulate more fluff
// sheep will eventually get too heavy too launch, don't worry, it's normal

function preload() {
    mySnd = loadSound("sheepbleat.mp3");
    bop = loadSound("pop.mp3");
    drop = loadSound("drop.mp3");

    myImg = loadImage("UGLYSHEEP.png");
    myCloudImg = loadImage("Cloud1.png");
    fluffyImg = loadImage("UGLYSHEEPFLUFF.png");
    woolImg = loadImage("FLUFF.png");
    noWoolImg = loadImage("emptyWool.png")
}
function setup() {
    mySnd.setVolume(1);
    bop.setVolume(0.5);
    createCanvas(800, 800);
    sheepMass = 15;
    forceBegin = new ForcePoint();
    nakedSheep = new UglySheep();
    didTheyStart = false;

    //initialize random clouds and put in array
    for(var i = 0; i < numOfClouds; i++){
        var newCloud = new FatClouds(myCloudImg);
        randomClouds.push(newCloud);
    }
    //theCloud = new UglyCloud(myAwesomeCloud);
    frameRate(frameSetRate);
}
function draw(){
  background(0,100,119);
  textSize(24);
  text("Amount of damage: "+ numCloudsCollected + "How long you've played: ", 30,30);
  // if (didTheyStart){
  //   howLongDidTheySurvive = second();
  // }
  while(didTheyLose){
    text("GAME LOST", 30, 60);
  }
  noStroke();
    for(var i=0; i<100; i++){
    fill(237,241,210, i/100*255);
    //make background gradient colors
    rect(0,i*8,width,8);
  }
  for (var i=0; i<40; i++){
    //makes a sun that also has a gradient in increments of 40
    //(I didn;t use one for loop because for some odd reason, it would 
    //cause a strange overlap)
    fill(110+i,65+4*i,160+i,0+80/64000*i*i*i);
    ellipse(320,240,540-10*i,540-10*i);
  }

  stroke(0);
  forceBegin.draw();

  //depending whether the sheep has hit a cloud or not, the image loaded will change
  var whichImage;
  if(isItFluffy){
      nakedSheep.draw(fluffyImg, woolImg)
  }
  else nakedSheep.draw(myImg,noWoolImg);

    if(isMouseDragged){
      mouseXEndForce = mouseX;
      mouseYEndForce = mouseY;

      line(mouseXForceVector,mouseYForceVector,mouseXEndForce,mouseYEndForce);
    }
    if(sheepLaunchedYet){
      nakedSheep.update();
    }
  //run through cloud array to draw all the clouds and update their positions
  for(var i = 0; i < randomClouds.length; i++){
      randomClouds[i].move();
      randomClouds[i].draw();
   } 
   //removes all the offscreen clouds
    randomClouds = randomClouds.filter(shouldBeKept);
    //adds new clouds to array when you start running out
    if(randomClouds.length < numOfClouds){
        for(var i = 0; i < random(1,numOfClouds - randomClouds.length); i++){
            var newCloud = new FatClouds(myCloudImg);
            randomClouds.push(newCloud);
        }
    }
}
function shouldBeKept(FatCloud){
    return !FatCloud.isOffScreen;
}
 function mousePressed(){
    isMouseDragged=true;
    mouseXForceVector = mouseX;
    mouseYForceVector = mouseY;
    forceBegin.update();
}
function mouseReleased(){
    mySnd.play();

    isMouseDragged = false;
    sheepLaunchedYet = true;
    mouseXEndForce = mouseX;
    mouseYEndForce = mouseY;
    angleOfLaunch = calcAngle();
    xForce = calcLaunchForceX();
    yForce = calcLaunchForceY();

    var instantaneousLaunchAccelerationX=xForce/sheepMass;

        initialVelocityX = instantaneousLaunchAccelerationX;

    var instantaneousLaunchAccelerationY=yForce/sheepMass;

    velocityX = instantaneousLaunchAccelerationX;
    velocityY = instantaneousLaunchAccelerationY;
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    nakedSheep.x+=30;
  } else if (keyCode === RIGHT_ARROW) {
    nakedSheep.x-=30;
  }
    else if (keyCode === UP_ARROW) {
    nakedSheep.y-=30;
  } else if (keyCode === DOWN_ARROW) {
    nakedSheep.y+=30;
  }
}
function UglySheep(){
    this.x = width/2;
    this.y = height;
    this.angleOfSheep;
    this.size = 70;
    this.sheepImg;

    this.draw = function(whichImage, woolImage) {
        imageMode(CENTER);
        this.sheepImg = whichImage;
        this.wool = woolImage;

        this.starterAngle;

        if(velocityX>0){
            this.starterAngle = PI/2;
        }
        else(this.starterAngle = -PI/2);

        push();//sheep rotates with the parabolic motion of its launch
        translate(this.x, this.y);
        this.angleOfSheep = atan(velocityY/velocityX);
        rotate(this.angleOfSheep + this.starterAngle);
        image(this.wool, 0,0, this.size + 10*numCloudsCollected, 
            this.size + 10*numCloudsCollected);
        image(this.sheepImg, 0, 0, this.size, this.size*2);
        pop();
    }
    this.calcAngle = function(){

    }
    this.update = function(){

        velocityY -= gravityAccel; //apply gravitational acceleration to velocity
        
        //if the sheep falls off the screen, it'll reset to it's initial position
        if(this.x < -100 || this.x>width+100 || this.y>height+100){
            sheepLaunchedYet=false;
            isItFluffy = false;
            numCloudsCollected = 0;
            sheepMass = 15;
            didTheyLose = true;

            //initial position
            this.x = width/2;
            this.y = height;
            velocityX=0;
            velocityY=0;
            initialVelocityX=0;

            drop.play(); //sheep clanks when it dies
        }
        this.y +=velocityY;
        this.x +=velocityX;

        this.woolSize*=numCloudsCollected;//sheep gets more wool with every cloud
    }
}

// /**
//  *  
//  *  gup(name) :: retrieves URL parameters if provided
//  *
//  *  Prepares the page for MTurk on load.
//  *  1. looks for a form element with id="mturk_form", and sets its METHOD / ACTION
//  *    1a. All that the task page needs to do is submit the form element when ready
//  *  2. disables form elements if HIT hasn't been accepted
//  *
//  **/

// // selector used by jquery to identify your form
// var form_selector = "#mturk_form";

// // function for getting URL parameters
// function gup(name) {
//   name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
//   var regexS = "[\\?&]"+name+"=([^&#]*)";
//   var regex = new RegExp(regexS);
//   var results = regex.exec(window.location.href);
//   if(results == null)
//     return "";
//   else return unescape(results[1]);
// }

// //  Turkify the captioning page.
// $(document).ready(function () {
//   // is assigntmentId is a URL parameter
//   if((aid = gup("assignmentId"))!="" && $(form_selector).length>0) {

//     // If the HIT hasn't been accepted yet, disabled the form fields.
//     if(aid == "ASSIGNMENT_ID_NOT_AVAILABLE") {
//       $('input,textarea,select').attr("DISABLED", "disabled");
//     }

//     // Add a new hidden input element with name="assignmentId" that
//     // with assignmentId as its value.
//     var aid_input = $("<input type='hidden' name='assignmentId' value='" + aid + "'>").appendTo($(form_selector));
//     var aid_input = $("<input type='hidden' name='timeLived' value='" + foooklation of alltime variableforhowlongtheylivedinmycode+ "'>").appendTo($(form_selector));

//     // Make sure the submit form's method is POST
//     $(form_selector).attr('method', 'POST');

//     // Set the Action of the form to the provided "turkSubmitTo" field
//     if((submit_url=gup("turkSubmitTo"))!="") {
//       $(form_selector).attr('action', submit_url + '/mturk/externalSubmit');
//     }
//   }
// });
