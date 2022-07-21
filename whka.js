const _greenbg = "#def1d7";
const _greenfg = "#155724";
const _redbg = "#f8d7da";
const _redfg = "#721c24";
const _grayfg = "#383d41";
const _graybg = "#e2e3e5";
const _bluefg = "#004085";
const _bluebg = "#cce5ff";

var svar = null;

function e_weeknumber(row, left, top, onclick){
    var html_id = 'weeknumber-' + row.year + '-0-0-' + row.weeknumber + '-0';
    var str_aa = '<div style="' +
        'left: ' + left + 'px; ' +
        'top: ' + top + 'px;" ' +
        'class="weeknumber" ' +
        'id="' + html_id.trim() + '" ' +
        'year="' + row.year + '" ' +
        'month="0" ' +
        'day="0" ' +
        'week="' + row.weeknumber + '" ' +
        'dayofweek="0" ' +
        'onclick="' + onclick + '">';
    var str_ab = '</div>';
    return str_aa +
        '<span class="center">' +
        row.weeknumber +
        '</span>' +
        str_ab;
}

function e(row, left, top, onclick, dimmed){
    var str_aa = '<div style="' +
        'left: ' + left + 'px; ' +
        'top: ' + top + 'px;" ' +
        'class="' + row.record_type + dimmed + '" ' +
        'id="' + row.html_id.trim() + '" ' +
        'year="' + row.year + '" ' +
        'month="' + row.month + '" ' +
        'day="' + row.day + '" ' +
        'week="' + row.weeknumber + '" ' +
        'dayofweek="' + row.weekday + '" ' +
        'onclick="' + onclick + '">';
    var str_ab = '</div>';
    return str_aa +
        '<span class="center">' +
        row.str +
        '</span>' +
        str_ab;
}

function ajaxquerybrugere() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var str = '<table class="w3-table-all">' +
            '<tr class="w3-light-green">' +
            '<th>Action</th>' +
            '<th>Name</th>' +
            '</tr>';
            var rows = JSON.parse(this.responseText);
            rows.forEach(e => {
                str += '<tr style="cursor: pointer;" onclick="selectUser(' + e.id + ', ' + "'" + e.name + "'" + ')">';
                str += '<td><a class="w3-button"><i class="fa fa-user-times"></i></a></td>';
                str += '<td>' + e.name + '</td>';
                str += '</tr>';
            });
            str += '<tr>'
            str += '<td><a class="w3-button"><i class="fa fa-user-plus"></i></a></td>';
            str += '<td></td>';
            str += '</tr>'
            str += '</table>';
            document.getElementById("bruger-listen").innerHTML = str;
        }
    };
    
    xhttp.open("POST", "/ajaxquerybrugere", true);
//    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function ajaxqueryplaner() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var str = '<table class="w3-table-all">' +
            '<tr class="w3-light-green">' +
            '<th>Action</th>' +
            '<th>Name</th>' +
            '<th>type</th>' +
            '<th>final date</th>' +
            '</tr>';
            var rows = JSON.parse(this.responseText);
            rows.forEach(e => {
                str += '<tr style="cursor: pointer;" onclick="selectPlan(' + e.id + ', ' + "'" + e.name + "')" + '">';
                str += '<td><a class="w3-button"><i class="fa fa-user-times"></i></a></td>';
                str += '<td>' + e.name + '</td>';
                str += '<td>' + e.type + '</td>';
                str += '<td>' + e.final_date + '</td>';
                str += '</tr>';
            });
            str += '</table>';
            document.getElementById("planer-listen").innerHTML = str;
        }
    };
    
    xhttp.open("POST", "/ajaxqueryplaner", true);
//    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function displayUserSelector(){
    
    if (document.getElementById('brugere').style.display !=='none'){
        document.getElementById('selected-user').innerText = '---';
        document.getElementById('selected-user-id').innerText = '-1';
        document.getElementById('brugere').style.display = 'none';
        updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
    }
    else{
        document.getElementById('brugere').style.display='block';
    }
}

function displayPlanSelector(){
    
    if (document.getElementById('planer').style.display !=='none'){
        document.getElementById('selected-plan').innerText = '---';
        document.getElementById('selected-plan-id').innerText = '-1';
        document.getElementById('planer').style.display = 'none';
        updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
    }
    else{
        document.getElementById('planer').style.display='block';
    }
}

function selectUser(id, name){
    document.getElementById('selected-user').innerText = name;
    document.getElementById('selected-user-id').innerText = id;
    document.getElementById('brugere').style.display = 'none';
    updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
}

function selectPlan(id, name){
    document.getElementById('selected-plan').innerText = name;
    document.getElementById('selected-plan-id').innerText = id;
    document.getElementById('planer').style.display = 'none';
    updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
}

function updateMode(userid, planid){
    var modestr = ["---", "Juster din egen kalender", "Vælg gyldige dage for planen", "Din kalender i perioden for planen"];
    var mode = ((userid >= 0) ? 1 : 0) + ((planid >= 0) ? 2 : 0);
    document.getElementById('selected-mode-id').innerText = mode;
    document.getElementById('selected-mode').innerText = modestr[mode];
    document.getElementById("valid-kalender-selector").style.display = (mode === 0) ? 'none' : 'block';
    switch(mode){
        case 1:
            ajaxquerybrugerkalender();
            break;
        case 2:
            ajaxqueryplankalender();
            break;
        case 3:
            ajaxquerymode3kalender();
            break;
        };
}

function ajaxquerybrugerkalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
//            document.getElementById("valid-kalender-selector").innerText = this.responseText;
            svar = JSON.parse(this.responseText);
            var rows = svar.kalender;
            var html = "";
            var ypos = 85;
            var weekchange = 1;
            var monthoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    var xoff = 285 * ((monthoffset - 1) % 4);
                    var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                    if (r.weeknumber != 0){
                        html += e_weeknumber(r,xoff, yoff+ypos, 'toggleweek(this)');
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        var xoff = 285 * ((monthoffset - 1) % 4);
                        var yoff = 10 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'togglemonth(this)','');
                        break;
                    case 'weekday':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'toggledayofweek(this)','');
                        break;
                    case 'day':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff + ypos, 'toggleday(this)', '');
                        if (r.weekday === 7){
                            ypos += 33;
                            weekchange = 1;  
                        }
                        break;
                }
            });
            document.getElementById("valid-kalender-selector").innerHTML = html;

//            console.log(JSON.stringify(svar.brugermap));
            var alldays = document.querySelectorAll('[class="day"]');
            alldays.forEach(element => {
                element.style.background = (svar.brugermap.indexOf(element.id)===-1) ? '': _greenbg;
            });
        }
    };
    
    xhttp.open("POST", "/ajaxquerybrugerkalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function ajaxqueryplankalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
//            document.getElementById("valid-kalender-selector").innerText = this.responseText;
            svar = JSON.parse(this.responseText);
            var rows = svar.kalender;
            var html = "";
            var ypos = 85;
            var weekchange = 1;
            var monthoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    var xoff = 285 * ((monthoffset - 1) % 4);
                    var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                    if (r.weeknumber != 0){
                        html += e_weeknumber(r,xoff, yoff+ypos, 'plantoggleweek(this)');
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        var xoff = 285 * ((monthoffset - 1) % 4);
                        var yoff = 10 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'plantogglemonth(this)','');
                        break;
                    case 'weekday':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'plantoggledayofweek(this)','');
                        break;
                    case 'day':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff + ypos, 'plantoggleday(this)', '');
                        if (r.weekday === 7){
                            ypos += 33;
                            weekchange = 1;  
                        }
                        break;
                }
            });
            document.getElementById("valid-kalender-selector").innerHTML = html;

//            console.log(JSON.stringify(svar.brugermap));
            var alldays = document.querySelectorAll('[class="day"]');
            alldays.forEach(element => {
                element.style.color = (svar.planmap.indexOf(element.id)===-1) ? 'lightgray': '';
                element.style.border= (svar.planmap.indexOf(element.id)===-1) ? '1px solid lightgray': '1px solid black';
                //                element.style.background = (svar.planmap.indexOf(element.id)===-1) ? '': _greenbg;
            });
        }
    };
    
    xhttp.open("POST", "/ajaxqueryplankalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function ajaxquerymode3kalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
//            document.getElementById("valid-kalender-selector").innerText = this.responseText;
            svar = JSON.parse(this.responseText);
//            console.log(this.responseText);
            var rows = svar.kalender;
            var html = "";
            var ypos = 85;
            var weekchange = 1;
            var monthoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    var xoff = 285 * ((monthoffset - 1) % 4);
                    var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                    if (r.weeknumber != 0){
                        html += e_weeknumber(r,xoff, yoff+ypos, 'mode3toggleweek(this)');
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        var xoff = 285 * ((monthoffset - 1) % 4);
                        var yoff = 10 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'mode3togglemonth(this)','');
                        break;
                    case 'weekday':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        html += e(r, xoff, yoff, 'mode3toggledayofweek(this)','');
                        break;
                    case 'day':
                        var xoff = 285 * ((monthoffset - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 50 + 270 * Math.floor((monthoffset - 1) / 4);
                        var dimmed = (svar.planmap.indexOf(r.html_id) === -1) ? '-dimmed' : '';
                        var toggle = (svar.planmap.indexOf(r.html_id) === -1) ? '' : 'mode3toggleday(this)';
                        html += e(r, xoff, yoff + ypos, toggle, dimmed);
                        if (r.weekday === 7){
                            ypos += 33;
                            weekchange = 1;  
                        }
                        break;
                }
            });
            document.getElementById("valid-kalender-selector").innerHTML = html;

//            console.log(JSON.stringify(svar.brugermap));
            var alldays = document.querySelectorAll('[class="day"]');
            alldays.forEach(element => {
                element.style.background = (svar.brugermap.indexOf(element.id)===-1) ? '': _greenbg;
            });

            alldays.forEach(element=>{
                var count = 0;
                svar.heatmap.forEach(r=>{
                    if (r.calendar.indexOf(element.id) > -1) {count++;}
                });
                if (count > 0){
                    console.log(element.id + ":" + count);
                    element.innerHTML += '<div class="heat" style="left: ' + (element.style.left+2) +'px; top: ' + element.style.top +'px; ">' + count + '</div>';
                }
            });
        }
    };
    
    xhttp.open("POST", "/ajaxquerymode3kalender", true);
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

function mode3toggleday(e) {
    var ids = [];
    var count = 0;
    count = (e.style.background != '') ? count + 1 : count;
    ids.push(e.id);
    ajaxtoggledays(count, ids);
}

function mode3togglemonth(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if ((element.getAttribute('day') != '0')&&
            (element.getAttribute("class") === 'day')){
            count = (element.style.background != '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function mode3toggleweek(e) {
    var week = e.getAttribute('week');
    var es = document.querySelectorAll('[week="' + week + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
            if ((element.getAttribute('day') != '0')&&
                (element.getAttribute("class") === 'day')){
                count = (element.style.background != '') ? count + 1 : count;
                ids.push(element.id);
        }
    });

    ajaxtoggledays(count, ids);
}

function mode3toggledayofweek(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var dayofweek = e.getAttribute('dayofweek');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if ((element.getAttribute('day') != '0') &&
            (element.getAttribute('dayofweek') === dayofweek)&&
            (element.getAttribute("class") === 'day')){
            count = (element.style.background != '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function plantoggleday(e) {
    var ids = [];
    var count = 0;
    count = (e.style.color === '') ? count + 1 : count;
    ids.push(e.id);
//    console.log("plantoggleday:" + JSON.stringify(ids));
    ajaxtoggledays(count, ids);
}

function plantogglemonth(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if (element.getAttribute('day') != '0') {
            count = (element.style.color === '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function plantoggleweek(e) {
    var week = e.getAttribute('week');
    var es = document.querySelectorAll('[week="' + week + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if (element.getAttribute('day') != '0') {
            count = (element.style.color === '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function plantoggledayofweek(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var dayofweek = e.getAttribute('dayofweek');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if ((element.getAttribute('day') != '0') &&
            (element.getAttribute('dayofweek') === dayofweek)) {
            count = (element.style.color === '') ? count + 1 : count;
            ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}


function ajaxtoggledays(count, ids) {
    var bg = (count > 0) ? 'clear' : 'set';
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": parseInt(document.getElementById('selected-mode-id').innerText, 10),
        "command": bg,
        "ids": ids
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
//            ajaxqueryplankalender();
            var map = JSON.parse(this.responseText);
            var alldays = document.querySelectorAll('[class="day"]');
            switch(update.modeid){
                case 1:
                    alldays.forEach(element => {
                        element.style.background = (map.indexOf(element.id)===-1) ? '': _greenbg;
                    });
                    break;
                case 2:
                    alldays.forEach(element => {
                        element.style.color = (map.indexOf(element.id)===-1) ? 'lightgray': '';
                        element.style.border= (map.indexOf(element.id)===-1) ? '1px solid lightgray': '1px solid black';
                    });
                    break;
                case 3:
                    alldays.forEach(element => {
                        element.style.background = (map.indexOf(element.id)===-1) ? '': _greenbg;
                    });
                    break;
            }
        }
    };
    
    var mode2url=[null, "/ajaxtogglebrugerdays","/ajaxtoggleplandays","/ajaxtogglebrugerdays"];

    if (mode2url[update.modeid] != null){
        xhttp.open("POST", mode2url[update.modeid], true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(update));
    }
}

function ajaxaddnewplan(){
    var update = {
        "planname": document.getElementById('newplanname').value,
    };
    console.log(update.planname);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var id = JSON.parse(this.responseText);
            console.log(id.id);
            selectPlan(id.id, update.planname);
            ajaxqueryplaner();
        }
    };
    
    xhttp.open("POST", "/ajaxaddnewplan", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
    document.getElementById("addplandialog").style.display = 'none';
}

/***********************************
// main - program starts here !!!!!!
************************************/
ajaxquerybrugere();
ajaxqueryplaner();
updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
