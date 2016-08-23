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
    //TODO: change sol=1000 below
    httpGetAsync('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=' + apiKey, displayMarsRover);
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
//TODO: use Iframes to display JPL links?
function displayNEOFeed(xml) {
    var responseArr = JSON.parse(xml.responseText);
    var elementCount = responseArr["element_count"];

    if (responseArr != null) {
        document.getElementById('neoFeedOhNo').innerHTML = "Oh shit! There are " + elementCount + " near-earth asteroids threatening our existence today!";
    }

    for (i = 0; i < elementCount; i++) {
        var neoArr = responseArr["near_earth_objects"][todayDateISO][i];

        // enter all information into a table

        var row = document.createElement("tr");
        // each td element goes into the row
        // <!-- absolute_magnitude_h -->
        var tdMag = document.createElement("td");
        tdMag.innerHTML = neoArr["absolute_magnitude_h"];
        row.appendChild(tdMag);
        // <!-- name -->
        var tdName = document.createElement("td");
        tdName.innerHTML = neoArr["name"];
        row.appendChild(tdName);
        // <!-- nasa_jpl_url --><!-- neo_reference_id -->
        var tdJPL = document.createElement("td");
        var link = document.createElement("a");
        link.href = neoArr["nasa_jpl_url"];
        link.target = "iframeJPL";
        link.innerHTML = neoArr["neo_reference_id"];
        row.appendChild(link);
        // <!-- close_approach_data [0] miss_distance miles -->
        var tdMiles = document.createElement("td");
        tdMiles.innerHTML = neoArr["close_approach_data"][0]["miss_distance"]["miles"];
        row.appendChild(tdMiles);
        // <!-- close_approach_data [0] relative_velocity miles_per_hour -->
        var tdSpeed = document.createElement("td");
        tdSpeed.innerHTML = neoArr["close_approach_data"][0]["relative_velocity"]["miles_per_hour"];
        row.appendChild(tdSpeed);
        // <!-- estimated_diameter meters estimated_diameter_max --><!-- estimated_diameter meters estimated_diameter_min -->
        var tdDia = document.createElement("td");
        tdDia.innerHTML = neoArr["estimated_diameter"]["meters"]["estimated_diameter_max"] + " meters";
        row.appendChild(tdDia);

        document.getElementById("neoTable").appendChild(row);

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

        imgLink.appendChild(imgNode);
        document.getElementById("marsroverPhotos").appendChild(imgLink);
    }
}

//TODO: more apis