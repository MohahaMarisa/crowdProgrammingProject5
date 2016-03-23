function ForcePoint(){
    this.x = -1;
    this.y = -1;
    this.size = 10;

    this.draw = function() {
        fill(255,100,100);
        ellipse(this.x,this.y,this.size,this.size);
    }

    this.update = function(){
        this.x = mouseXForceVector;
        this.y = mouseYForceVector;
    }
}
function FatClouds(myCloudImg){

    this.size = random(200,400);
    this.proportion = randomGaussian(68,3)/100;
    // print(this.proportion);
    this.x = random(0,width);
    this.y = - (this.size);
    this.speed = random(4,25);
    this.cloudImg = myCloudImg;
    this.isOffScreen = false; //this boolean is used to determine whether or not
    //something should be removed from the screen and therefore from the
    //array, or whether something has on it's own gone off the screen 
    this.draw = function() {
        image(this.cloudImg, this.x, this.y, this.size, this.size*this.proportion);

    }
    this.move = function(){
        this.y += this.speed;
        if (this.y - this.size > height){
          this.isOffScreen = true;
        }
        //if the sheep crosses the cloud...
        if (nakedSheep.x < this.x+this.size/2 
            && nakedSheep.x > this.x-this.size/2
            && nakedSheep.y < this.y+this.size*this.proportion/2 
            && nakedSheep.y > this.y-this.size*this.proportion/2) {
            this.isOffScreen = true;//cloud should disappear
            isItFluffy = true;//the sheep should gian fluff
            numCloudsCollected++;
            sheepMass+=int(numCloudsCollected/3); //mass of sheep increases the more
            //cloud fluff it has
            bop.play();
        }
    }
}