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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
//             document.getElementById("demo").innerHTML = this.responseText;

            var oldel = document.getElementById(document.getElementById("current_user").innerText);
            if (oldel != null){
                oldel.style.background = "";
            }
            document.getElementById("current_user").innerText = element.id;
            document.getElementById(element.id).style.background = _greenbg;

            var db = JSON.parse(this.responseText);

            var user_record = null; 
            db.forEach(e => {
                if (e.userid === element.id){
                    user_record = e;
                }
            });

            if (user_record != null){
                alldays.forEach(id => {
                    document.getElementById(id).style.background = (user_record.ids.indexOf(id)===-1) ? '': _greenbg;
                });
//                console.log( '=======================' );
//                console.log( JSON.stringify(user_record) );
            }
        }
    };
 
    xhttp.open("POST", "/ajaxuser", true);
    //xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function ajaxtoggledays(count, ids) {
    var current_user_id = document.getElementById("current_user").innerText;
    if (current_user_id != "none"){
//        console.log("count="+count);
        var bg = (count > 0) ? '' : _graybg;

        /*
        ids.forEach(element => {
            document.getElementById(element).style.background = bg;
        });
*/

        var update = {
            "userid": current_user_id,
            "command": bg,
            "ids": ids
        };

//        console.log(JSON.stringify(update));

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    //             document.getElementById("demo").innerHTML = this.responseText;
                var db = JSON.parse(this.responseText);

                var user_record = null; 
                db.forEach(e => {
                    if (e.userid === current_user_id){
                        user_record = e;
                    }
                });

                if (user_record != null){
                    alldays.forEach(id => {
                        document.getElementById(id).style.background = (user_record.ids.indexOf(id)===-1) ? '': _greenbg;
                    });
  //                  console.log( '=======================' );
  //                  console.log( JSON.stringify(user_record) );
                }
            }
        };
     
        xhttp.open("POST", "/ajaxtoggledays", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(update));
    }

}

/***********************************
// main - program starts here !!!!!!
************************************/
initdays();
//setcalendar(document.getElementById(current_parent));
//setchild(document.getElementById(current_child));