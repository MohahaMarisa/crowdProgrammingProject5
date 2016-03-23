function calcAngle(){
	var oppositeLength = abs(mouseXForceVector - mouseXEndForce);
	var adjacentLength = abs(mouseYForceVector - mouseYEndForce);
	var angleOf = degrees(atan(oppositeLength/adjacentLength));
	return angleOf;
}
function calcLaunchForceX(){
	return (mouseXForceVector - mouseXEndForce);
}
function calcLaunchForceY(){
	 return (mouseYForceVector - mouseYEndForce);
}
// function calcDirection(){
// 	//right would mean I'd have to add to the x position of the sheep, so it's positive 1
// 	var negativeOrPositiveDirection = mouseXForceVector - mouseXEndForce;
// 	var directionSheep;
// 	if(negativeOrPositiveDirection<0){
// 		directionSheep = -1;
// 	}
// 	else(directionSheep = 1);
	 
// 	return directionSheep;
// }