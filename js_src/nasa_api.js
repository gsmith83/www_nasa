var todayDate = new Date();
var month = todayDate.getMonth() + 1;
var todayDateISO;
if (month < 10)
    todayDateISO = todayDate.getFullYear() + "-0" + month + "-" + todayDate.getDate();
else
    todayDateISO = todayDate.getFullYear() + "-" + month + "-" + todayDate.getDate();

function displayNASAStuff() {
    var apiKey = "0b33tVGBkzuCWCTpuQCyyF2NhDxbVRu7kcsN9snr";

    httpGetAsync('https://api.nasa.gov/planetary/apod?api_key=' + apiKey, displayAPOD);
    httpGetAsync('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + todayDateISO + '&end_date=' + todayDateISO + '&api_key=' + apiKey, displayNEOFeed);
    httpGetAsync('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=' + apiKey, displayMarsRover)
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Gets the apod and info and finds the html tags to display them in
function displayAPOD(xml) {
    var responseArr = JSON.parse(xml.responseText);
    if (responseArr != null) {
        document.getElementById('apodImg').src = responseArr["url"];
        document.getElementById('apodTitle').innerHTML = responseArr["title"];
        document.getElementById('apodCopyright').innerHTML = responseArr["copyright"] + " - " + responseArr["date"];
        document.getElementById('apodText').innerHTML = responseArr["explanation"];
    }
}

// Finds all neos on today's date and displays them by generating html tags
function displayNEOFeed(xml) {
    var responseArr = JSON.parse(xml.responseText);
    var elementCount = responseArr["element_count"];

    if (responseArr != null) {
        document.getElementById('neoFeedOhNo').innerHTML = "Oh shit! There are " + elementCount + " near-earth asteroids threatening our existence today!";
    }

    for (i = 0; i < elementCount; i++) {
        var neoArr = responseArr["near_earth_objects"][todayDateISO][i];
        var para = document.createElement("p");
        var textNode = document.createTextNode("Object " + neoArr["name"] + " will come within " + neoArr["close_approach_data"][0]["miss_distance"]["miles"] + " miles from Earth. Phew!");
        para.appendChild(textNode);
        document.getElementById("neo").appendChild(para);
    }
}

// Mars rover stuff
function displayMarsRover(xml) {
    var responseArr = JSON.parse(xml.responseText);
    var elementCount = responseArr["photos"].length;

    if (elementCount > 0) {
        var imgNode = document.createElement("img");
        imgNode.src = responseArr["photos"][0]["img_src"];
        document.getElementById("marsrover").appendChild(imgNode);
    }
}