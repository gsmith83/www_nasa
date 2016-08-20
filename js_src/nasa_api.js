var todayDate = new Date();
var month = todayDate.getMonth() + 1;
var todayDateISO;
if (month < 10)
    todayDateISO = todayDate.getFullYear() + "-0" + month + "-" + todayDate.getDate();
else
    todayDateISO = todayDate.getFullYear() + "-" + month + "-" + todayDate.getDate();

// calls other functions to display nasa daily digest
function displayNASAStuff() {
    var apiKey = "0b33tVGBkzuCWCTpuQCyyF2NhDxbVRu7kcsN9snr";

    httpGetAsync('https://api.nasa.gov/planetary/apod?api_key=' + apiKey, displayAPOD);
    httpGetAsync('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + todayDateISO + '&end_date=' + todayDateISO + '&api_key=' + apiKey, displayNEOFeed);
    httpGetAsync('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=' + apiKey, displayMarsRover)
}

// Async http getter
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
/*
copyright:"El Cielo de Canarias"
date:"2016-08-20"
explanation:"Gamma-rays and dust from periodic Comet Swift-Tuttle plowed through planet Earth's atmosphere on the night of August 11/12. Impacting at about 60 kilometers per second the grains of comet dust produced this year's remarkably active Perseid meteor shower. This composite wide-angle image of aligned shower meteors covers a 4.5 hour period on that Perseid night. In it the flashing meteor streaks can be traced back to the shower's origin on the sky. Alongside the Milky Way in the constellation Perseus, the radiant marks the direction along the perodic comet's orbit. Traveling at the speed of light, cosmic gamma-rays impacting Earth's atmosphere generated showers too, showers of high energy particles. Just as the meteor streaks point back to their origin, the even briefer flashes of light from the particles can be used to reconstruct the direction of the particle shower, to point back to the origin on the sky of the incoming gamma-ray. Unlike the meteors, the incredibly fast particle shower flashes can't be followed by eye. But both can be followed by the high speed cameras on the multi-mirrored dishes in the foreground. Of course, the dishes are MAGIC (Major Atmospheric Gamma Imaging Cherenkov) telescopes, an Earth-based gamma-ray observatory on the Canary Island of La Palma."
hdurl:"http://apod.nasa.gov/apod/image/1608/PerseidsMAGIC_DLopez.jpg"
media_type:"image"
service_version:"v1"
title:"Gamma-rays and Comet Dust"
url:"http://apod.nasa.gov/apod/image/1608/PerseidsMAGIC_DLopez1024.jpg"
*/
//TODO: allow choosing days
function displayAPOD(xml) {
    var responseArr = JSON.parse(xml.responseText);
    if (responseArr != null) {
        document.getElementById('apodImg').src = responseArr["url"];
        document.getElementById('apodLink').href = responseArr["hdurl"];
        document.getElementById('apodTitle').innerHTML = responseArr["title"];
        document.getElementById('apodCopyright').innerHTML = responseArr["copyright"] + " - " + responseArr["date"];
        document.getElementById('apodText').innerHTML = responseArr["explanation"];
    }
}

// Finds all neos on today's date and displays them by generating html tags
//TODO: display all information about closes neo
//TODO: allow choosing days
//TODO: display the date and info of nearest neo that threatens earth
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
//TODO: get latest photos
//TODO: allow uses to choose day
function displayMarsRover(xml) {
    var responseArr = JSON.parse(xml.responseText);
    var elementCount = responseArr["photos"].length;

    for (i = 0; i < elementCount; i++) {
        var imgLink = document.createElement("a");
        imgLink.href = responseArr["photos"][i]["img_src"];

        var imgNode = document.createElement("img");
        imgNode.src = imgLink.href;
        imgNode.alt = "rover_pic" + i;
        imgNode.width = 125;
        imgNode.style = "display:inline;margin:5px;";

        imgLink.appendChild(imgNode);
        document.getElementById("marsrover").appendChild(imgLink);
    }
}

//TODO: more apis