var myData, //segnaposto JSON
    posRelMe = [], //Oggetto Posizioni oggetti rispetto alla mia posizione
    myLat, //mia posizione Lat
    myLon, //mia posizione Lon
    heading, //mia direzione
    posXPointer, //posizione della freccia X
    posYPointer, //posizione della freccia Y
    circle = 500, //segnaposto cerchio radar
    zoom = 1024; //var zoom


function preload() {
  myData = loadJSON('heights.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    textAlign(CENTER);
    noStroke()

    posXPointer = width/2;
    posYPointer = height/2;

    circle = width*0.75;

    getLocationUpdate()
    calcPosRelMe()
  }


function draw() {
  background(255)

  //Cerchio:
  push()
    stroke("black")
    ellipse(width/2,height/2,circle)
    translate(posXPointer,posYPointer);
    for (var i=0; i<8 ; i++) {
      rotate(i*45)
      line(0,-(circle/2)-25,0,-(circle/2)-80)
    }
  pop()

  //Puntini sul radar:
  push()
    translate(posXPointer,posYPointer)
    fill("red")
    for (var i=0; i < myData.landmarks.length; i++) {

      if (dist(0,0,(posRelMe[i].Lon)*zoom,(posRelMe[i].Lat)*zoom*(-1))>(circle/2)) {text(i, (circle/2)*cos(posRelMe[i].Ang-90), (circle/2)*sin(posRelMe[i].Ang-90),15)}
      else {text(i, (posRelMe[i].Lon)*zoom,(posRelMe[i].Lat)*zoom*(-1),15)}
    }
  pop()

  //Freccia al centro:
  push()
    translate(posXPointer,posYPointer)
    //rotate(90+atan2(mouseY - posYPointer, mouseX - posXPointer))
    if (isNaN(heading)==true) {rotate(heading)}

    fill("blue")
    beginShape();
      vertex(0, 0);
      vertex(0, -20);
      vertex(10, 15);
      vertex(0, 0);
      vertex(-10, 15);
      vertex(0, -20);
    endShape(CLOSE);
  pop()

}

//Aggiungi dati al oggetto posRelMe:
  function calcPosRelMe() {
    for (var i=0; i < myData.landmarks.length; i++) {
      posRelMe[i] = {"name": "", "Lat": "", "Lon": "", "Ang": "", "distX": "" , "distY": "", "dist": ""},
      posRelMe[i].name = myData.landmarks[i].name;
      posRelMe[i].Lat = myData.landmarks[i].Lat - myLat;
      posRelMe[i].Lon = myData.landmarks[i].Lon - myLon;

      posRelMe[i].distX = measure(myData.landmarks[i].Lat, 0, myLat, 0);
      posRelMe[i].distY = measure(0, myData.landmarks[i].Lon, 0, myLon);

      posRelMe[i].dist = measure(myData.landmarks[i].Lat, myData.landmarks[i].Lon, myLat, myLon);

      if ((posRelMe[i].Lon>0)&&(posRelMe[i].Lat>0)) {posRelMe[i].Ang = (atan(posRelMe[i].distY/posRelMe[i].distX));}
      if ((posRelMe[i].Lon>0)&&(posRelMe[i].Lat<0)) {posRelMe[i].Ang = 180-(atan(posRelMe[i].distY/posRelMe[i].distX));}
      if ((posRelMe[i].Lon<0)&&(posRelMe[i].Lat<0)) {posRelMe[i].Ang = 180+(atan(posRelMe[i].distY/posRelMe[i].distX));}
      if ((posRelMe[i].Lon<0)&&(posRelMe[i].Lat>0)) {posRelMe[i].Ang = 360-(atan(posRelMe[i].distY/posRelMe[i].distX));}

  }
}


//Funzioni di Interazioni

function keyTyped() {
  if (key== "q") {zoomIn()}
  else if (key== "w") {zoomOut()}
}

function zoomIn() {zoom*=2}
function zoomOut() {zoom/=2}


//Funzioni di Geolocalizzazione più opizioni

function getLocationUpdate() {
  if (navigator.geolocation) {
    var options = {
      timeout:60000,
      maximumAge:10000,
      enableHighAccuracy: true};

      geoLoc = navigator.geolocation;
      watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    }

  else{alert("Sorry, browser does not support geolocation!");}
}

function showLocation(position) {
  myLat = position.coords.latitude;
  myLon = position.coords.longitude;

  heading = position.coords.heading;

  calcPosRelMe()
}

function errorHandler(err) {
  if (err.code == 1) {
    alert("Error: Access is denied!");
   }

  else if ( err.code == 2) {
    alert("Error: Position is unavailable!");
  }

  else if ( err.code == 3) {
    alert("Error: Timeout");
  }

  else if ( err.code == 0) {
    alert("Error: an unkown error occurred");
  }
}

function stopWatch(){geoLoc.clearWatch(watchID);}


//Function Aggiuntive

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
  }

Array.prototype.sum = function() {
  var total = 0;
  for(var i = 0; i < this.length; i += 1) {total += this[i];}
  return total;
};
