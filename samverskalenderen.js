const _greenbg = "#def1d7";
const _greenfg = "#155724";
const _redbg = "#f8d7da";
const _redfg = "#721c24";
const _grayfg = "#383d41";
const _graybg = "#e2e3e5";
const _bluefg = "#004085";
const _bluebg = "#cce5ff";
const _calendar = "calendar";
const _child = "child";

var current_parent = 'calendar-1';
var current_child = 'child-1';
var alldays = [];

function setyear(y) {
    window.open("/setyear?year=" + y, '_self');
}

function setGUI(n){
    var ids = [
        "2f7749a6-d82e-45db-9648-018b2aa7fe4d",
        "6c7387f9-ca23-43b0-963c-1ddcafae5a0e",
        "143821e5-8801-4898-b697-82956280eb95",
        "327d03d9-5152-4a39-944a-07cd4f404641",
        "61e19db2-07ec-41b0-8831-0411f6b0b69d"
    ];

    var id = ids[n];

    ids.forEach( i=>{
        document.getElementById(i).style.display = (i != id) ? "none" : "block";
    });
}

function initdays() {
    alldays = [];

    for (var m = 1; m < 13; m++) {
        var es = document.querySelectorAll('[month="' + m + '"]');
        es.forEach(e => {
            var day = e.getAttribute('day');
            if (day != 0){
                alldays.push(e.id);
            }
        });
    }

    var current_user_id = document.getElementById("current_user").innerText;
    document.getElementById(current_user_id).style.background = _greenbg;

    var update = {
        "userid": current_user_id,
        "command": _greenbg,
        "ids": []
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var map = JSON.parse(this.responseText);
            alldays.forEach(id => {
                document.getElementById(id).style.background = (map.ids.indexOf(id)===-1) ? '': _greenbg;
            });
        }
    };
    
    xhttp.open("POST", "/ajaxtoggledays", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function toggleday(e) {
    var ids = [];
    var count = 0;
    count = (e.style.background != '') ? count + 1 : count;
    ids.push(e.id);
    ajaxtoggledays(count, ids);
}

function togglemonth(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if (element.getAttribute('day') != '0') {
            count = (element.style.background != '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function toggleweek(e) {
    var week = e.getAttribute('week');
    var es = document.querySelectorAll('[week="' + week + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if (element.getAttribute('day') != '0') {
            count = (element.style.background != '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function toggledayofweek(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var dayofweek = e.getAttribute('dayofweek');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if ((element.getAttribute('day') != '0') &&
            (element.getAttribute('dayofweek') === dayofweek)) {
            count = (element.style.background != '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function setUser(element) {
    document.getElementById("current_user").innerText = element.id;
    window.open("/?userid="+element.id, '_self');
}

function ajaxtoggledays(count, ids) {
    var current_user_id = document.getElementById("current_user").innerText;
    var bg = (count > 0) ? '' : _graybg;
    var update = {
        "userid": current_user_id,
        "command": bg,
        "ids": ids
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var map = JSON.parse(this.responseText);
            alldays.forEach(id => {
                document.getElementById(id).style.background = (map.ids.indexOf(id)===-1) ? '': _greenbg;
                map.heatmap.forEach(e => {
                    if ((e.id == id)&&(document.getElementById(id+'heat') != null)){
                        document.getElementById(id+'heat').innerText = e.count;
                    }
                });
            });
        }
    };
    
    xhttp.open("POST", "/ajaxtoggledays", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

/***********************************
// main - program starts here !!!!!!
************************************/
initdays();
//setcalendar(document.getElementById(current_parent));
//setchild(document.getElementById(current_child));