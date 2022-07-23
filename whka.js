const _greenbg = "#def1d7";
const _greenfg = "#155724";
const _redbg = "#f8d7da";
const _redfg = "#721c24";
const _grayfg = "#383d41";
const _graybg = "#e2e3e5";
const _bluefg = "#004085";
const _bluebg = "#cce5ff";

var svar = null;
var setpinmode = false;
var setheatmode = false;

function ee_weeknumber(r, eid, onclickevent){
    var html_id = 'weeknumber-' + r.year + '-0-0-' + r.weeknumber + '-0';
    var e = document.getElementById(eid);
    e.setAttribute('id', html_id);
    e.style.visibility = 'visible';
//    e.setAttribute('record_type', r.record_type);
    e.setAttribute('year', r.year);
    e.setAttribute('month', '0');
    e.setAttribute('day', '0');
    e.setAttribute('week', r.weeknumber);
    e.setAttribute('dayofweek', r.weekday);
    e.setAttribute('onclick', onclickevent);
    e.innerText = r.weeknumber;
}

function ee_dimmed(r, eid, onclickevent){
    var e = document.getElementById(eid);
    e.setAttribute('id', r.html_id);
    e.style.visibility = 'visible';
    e.setAttribute('record_type', 'dimmed');
    e.style.color = 'lightgray';
    e.style.cursor = 'default';
/*     if (r.record_type == 'day') {
        e.setAttribute('toggle','clear');
    }
    e.setAttribute('year', r.year);
    e.setAttribute('month', r.month);
    e.setAttribute('day', r.day);
    e.setAttribute('week', r.weeknumber);
    e.setAttribute('dayofweek', r.weekday); */
    e.innerText = r.str;
}

function ee(r, eid, onclickevent){
    var e = document.getElementById(eid);
    e.setAttribute('id', r.html_id);
    e.style.visibility = 'visible';
    e.setAttribute('record_type', r.record_type);
    if (r.record_type == 'day') {
        e.setAttribute('toggle','clear');
    }
    e.setAttribute('year', r.year);
    e.setAttribute('month', r.month);
    e.setAttribute('day', r.day);
    e.setAttribute('week', r.weeknumber);
    e.setAttribute('dayofweek', r.weekday);
    e.setAttribute('onclick', onclickevent);
    e.innerText = r.str;
}

function ajaxquerybrugere() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var str = '<table class="w3-table-all">' +
            '<tr class="w3-light-green">' +
            '<th>Name</th>' +
            '</tr>';
            str += '<tr style="cursor: pointer;" onclick="selectUser(-1, ' + "''" + ')">';
            str += '<td>---</td>';
            str += '</tr>';
            var rows = JSON.parse(this.responseText);
            rows.forEach(e => {
                str += '<tr style="cursor: pointer;" onclick="selectUser(' + e.id + ', ' + "':" + e.name + "'" + ')">';
                str += '<td>' + e.name + '</td>';
                str += '</tr>';
            });
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
            '<th>Name</th>' +
            '<th>type</th>' +
            '<th>final date</th>' +
            '</tr>';
            str += '<tr style="cursor: pointer;" onclick="selectPlan(-1, ' + "''" + ')">';
            str += '<td>---</td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '</tr>';
            var rows = JSON.parse(this.responseText);
            rows.forEach(e => {
                var dd = e.dateid.split('-');
                var datestr = (dd.length === 6 ) ? dd[1] + '/' + dd[2] + '/' + dd[3] : '';
                str += '<tr style="cursor: pointer;" onclick="selectPlan(' + e.id + ', ' + "':" + e.name + "')" + '">';
                str += '<td>' + e.name + '</td>';
                str += '<td>' + e.type + '</td>';
                str += '<td>' + datestr + '</td>';
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
        document.getElementById('selected-user').innerText = '';
        document.getElementById('selected-user-id').innerText = '-1';
        document.getElementById('brugere').style.display = 'none';
        updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
    }
    else{
        ajaxquerybrugere();
        document.getElementById('brugere').style.display='block';
    }
}

function displayPlanSelector(){
    
    if (document.getElementById('planer').style.display !=='none'){
        document.getElementById('selected-plan').innerText = '';
        document.getElementById('selected-plan-id').innerText = '-1';
        document.getElementById('planer').style.display = 'none';
        updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
    }
    else{
        ajaxqueryplaner();
        document.getElementById('planer').style.display='block';
    }
}

function displayheatmap(newmode){
    setheatmode = (!setheatmode) & newmode;;
    document.getElementById('heatmapbutton').style.background = (setheatmode) ? 'red' : '';
    updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
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

function setPlanPin(newmode){
    setpinmode = (!setpinmode) & newmode;;
    document.getElementById('planpinbutton').style.background = (setpinmode) ? 'red' : '';
}

function updateMode(userid, planid){
    var modestr = ["", ": Juster din egen kalender", ": Vælg gyldige dage for planen", ": Din kalender i perioden for planen", ": Heatmap"];
    var mode = ((userid >= 0) ? 1 : 0) + ((planid >= 0) ? 2 : 0);
    document.getElementById('selected-mode-id').innerText = mode;
    document.getElementById('selected-mode').innerText = modestr[mode];
    switch(mode){
        case 0:
            document.getElementById('planpinbutton').style.display = 
            document.getElementById("responsivekalender").style.display = 'none';
            setPlanPin(false);
            break;
        case 1:
            document.getElementById('planpinbutton').style.display = 
            document.getElementById("responsivekalender").style.display = 'none';
            responsivekalender();
            ajaxquerybrugerresponsivekalender();
            document.getElementById("responsivekalender").style.display = 'block';
            setPlanPin(false);
            break;
        case 2:
            document.getElementById("responsivekalender").style.display = 'none';
            responsivekalender();
            ajaxqueryresponsiveplankalender();
            document.getElementById('planpinbutton').style.display = 
            document.getElementById("responsivekalender").style.display = 'block';
            break;
        case 3:
            document.getElementById("responsivekalender").style.display = 'none';
            responsivekalender();
            ajaxquerymode3responsivekalender();
            document.getElementById('planpinbutton').style.display = 
            document.getElementById("responsivekalender").style.display = 'block';
            break;
        };
}

function toggleday(e) {
    var ids = [];
    var count = 0;
    if (!setpinmode){
        count = (e.getAttribute('toggle') !== 'clear') ?  count + 1 : count;
        ids.push(e.id);
        ajaxtoggledays(count, ids);
    }
    else {
        ajaxsetpin(e.id);
    }
}

function togglemonth(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var ids = [];

    var count = 0;
    es.forEach(element => {
        if ((element.getAttribute('day') != '0')&&
            (element.getAttribute("record_type") === 'day')) {
            count = (element.getAttribute('toggle') === 'set') ?  count + 1 : count;
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
        if ((element.getAttribute('day') != '0')&&
            (element.getAttribute("record_type") === 'day')) {
            count = (element.getAttribute('toggle') === 'set') ?  count + 1 : count;
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
            (element.getAttribute('dayofweek') === dayofweek)&&
            (element.getAttribute("record_type") === 'day')) {
                count = (element.getAttribute('toggle') === 'set') ?  count + 1 : count;
                ids.push(element.id);
        }
    });
    ajaxtoggledays(count, ids);
}

function ajaxsetpin(id){
    var update = {
        "dateid": id,
        "planid": document.getElementById('selected-plan-id').innerText,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var map = JSON.parse(this.responseText);
            if (map.fromdateid !== '') {
                var el = document.getElementById(map.fromdateid);
                el.innerHTML = el.getAttribute('day');
            }
            if (map.todateid !== '') {
                var el = document.getElementById(map.todateid);
                el.innerHTML = '<i class="fa fa-thumb-tack fa-2x"></i>';
            }
        }
    };
    
    xhttp.open("POST", '/ajaxsetpin', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));

    setPlanPin(false);
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
            var map = JSON.parse(this.responseText);
            var alldays = document.querySelectorAll('[record_type="day"]');
            switch(update.modeid){
                case 1:
                    alldays.forEach(element => {
                        element.style.background = (map.indexOf(element.id)===-1) ? '': _greenbg;
                        element.setAttribute('toggle', (map.indexOf(element.id)===-1) ? 'clear': 'set');
                    });
                    break;
                case 2:
                    alldays.forEach(element => {
                        element.style.color = (map.indexOf(element.id)===-1) ? 'lightgray': 'red';
                        element.setAttribute('toggle', (map.indexOf(element.id)===-1) ? 'clear': 'set');
                    });
                    break;
                case 3:
                    alldays.forEach(element => {
                        element.style.background = (map.indexOf(element.id)===-1) ? '': _greenbg;
                        element.setAttribute('toggle', (map.indexOf(element.id)===-1) ? 'clear': 'set');
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

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var id = JSON.parse(this.responseText);
            selectPlan(id.id, update.planname);
            ajaxqueryplaner();
        }
    };
    
    xhttp.open("POST", "/ajaxaddnewplan", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
    document.getElementById("addplandialog").style.display = 'none';
}

function responsivekalender(){
    const kd = [1,2,3,4,5,6,7];
    const wi = 100/8;

    var html = '<div class="w3-row">';
    var mm = [1,2,3,4,5,6,7,8,9,10,11,12];
    mm.forEach(m=>{
        html += '<div class="w3-col w3-container l3 m6"">';

        html += '<div class="w3-row">';
        html += '<div id="month-' + m + '" class="w3-col" style="width:100%; height: 32px; text-align: center; font-size: 20px; cursor:pointer; visibility: hidden;">---</div>';
        // render weekdays names
        html += '<div class="w3-col" style="width:' + wi + '%; height: 32px; visibility: hidden;"></div>';
        kd.forEach(wd=>{
            html += '<div id="weekday-' + m + '-' + wd + '" class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; font-weight: bold; cursor: pointer; padding: 6px; visibility: hidden;"></div>';
        });

        for(var w=0;w<6;w++){
            html += '<div id="weeknumber-' + m + '-' + w + '" class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; font-weight: bold; cursor: pointer; padding: 6px; visibility: hidden;">-</div>';
            for(var d=1;d<8;d++){
                html += '<div id="day-' + m + '-' + w +  '-' + d + '"class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; cursor: pointer; padding: 6px; visibility: hidden;"></div>';
            }
        }

        html += '</div>';
        
        html += '</div>';

    });

    html += '</div>'
    document.getElementById('responsivekalender').innerHTML = html;
}

function ajaxquerymode3responsivekalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            svar = JSON.parse(this.responseText);
            var rows = svar.kalender;
            var weekchange = 1;
            var monthoffset = 0;
            var weekoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    if ((r.weeknumber != 0)&&(monthoffset != 0)){
                        ee_weeknumber(r, 'weeknumber-' + monthoffset + '-' + weekoffset, 'toggleweek(this)');
                        weekoffset++;
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        weekoffset = 0;
                        ee(r, 'month-' + monthoffset, 'togglemonth(this)');
                        break;
                    case 'weekday':
                        ee(r, 'weekday-' + monthoffset + '-' + r.weekday, 'toggledayofweek(this)' );
                        break;
                    case 'day':
                        if (svar.planmap.indexOf(r.html_id) === -1){
                            ee_dimmed(r, 'day-' + monthoffset + '-' + (weekoffset-1) +  '-' + r.weekday, 'toggleday(this)' );
                        }
                        else {
                            ee(r, 'day-' + monthoffset + '-' + (weekoffset-1) +  '-' + r.weekday, 'toggleday(this)' );
                        }
                        if (r.weekday === 7){
                            weekchange = 1;  
                        }
                        break;
                }
            });


            var alldays = document.querySelectorAll('[record_type="day"]');
            alldays.forEach(element => {
                element.style.color = 'red';
                element.style.background = (svar.brugermap.indexOf(element.id)===-1) ? '': _greenbg;
                var toggle = (svar.brugermap.indexOf(element.id)===-1) ? 'clear': 'set';
                element.setAttribute('toggle', toggle);
            });

            if (svar.dateid !== ''){
                document.getElementById(svar.dateid).innerHTML = '<i class="fa fa-thumb-tack"></i>';
            }

            updateheatmap(svar.heatmap);

        }
    };
    
    xhttp.open("POST", "/ajaxquerymode3kalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function ajaxqueryresponsiveplankalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            svar = JSON.parse(this.responseText);
            var rows = svar.kalender;
            var weekchange = 1;
            var monthoffset = 0;
            var weekoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    if ((r.weeknumber != 0)&&(monthoffset != 0)){
                        ee_weeknumber(r, 'weeknumber-' + monthoffset + '-' + weekoffset, 'toggleweek(this)');
                        weekoffset++;
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        weekoffset = 0;
                        ee(r, 'month-' + monthoffset, 'togglemonth(this)');
                        break;
                    case 'weekday':
                        ee(r, 'weekday-' + monthoffset + '-' + r.weekday, 'toggledayofweek(this)' );
                        break;
                    case 'day':
                        ee(r, 'day-' + monthoffset + '-' + (weekoffset-1) +  '-' + r.weekday, 'toggleday(this)' );
                        if (r.weekday === 7){
                            weekchange = 1;  
                        }
                        break;
                }
            });

            var alldays = document.querySelectorAll('[record_type="day"]');
            alldays.forEach(element => {
                var toggle = (svar.brugermap.indexOf(element.id)===-1) ? 'clear': 'set';
                element.setAttribute('toggle', toggle);
                element.style.color = (svar.planmap.indexOf(element.id)===-1) ? 'lightgray': 'red';
                element.style.border= (svar.planmap.indexOf(element.id)===-1) ? '1px solid lightgray': '1px solid black';
            });

            if (svar.dateid !== ''){
                document.getElementById(svar.dateid).innerHTML = '<i class="fa fa-thumb-tack fa-2x"></i>';
            }
            updateheatmap(svar.heatmap);

        }
    };
    
    xhttp.open("POST", "/ajaxqueryplankalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function ajaxquerybrugerresponsivekalender() {
    var update = {
        "userid": document.getElementById('selected-user-id').innerText,
        "planid": document.getElementById('selected-plan-id').innerText,
        "modeid": document.getElementById('selected-mode-id').innerText
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            svar = JSON.parse(this.responseText);
            var rows = svar.kalender;
            var weekchange = 1;
            var monthoffset = 0;
            var weekoffset = 0;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    if ((r.weeknumber != 0)&&(monthoffset != 0)){
                        ee_weeknumber(r, 'weeknumber-' + monthoffset + '-' + weekoffset, 'toggleweek(this)');
                        weekoffset++;
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        weekoffset = 0;
                        ee(r, 'month-' + monthoffset, 'togglemonth(this)');
                        break;
                    case 'weekday':
                        ee(r, 'weekday-' + monthoffset + '-' + r.weekday, 'toggledayofweek(this)' );
                        break;
                    case 'day':
                        ee(r, 'day-' + monthoffset + '-' + (weekoffset-1) +  '-' + r.weekday, 'toggleday(this)' );
                        if (r.weekday === 7){
                            weekchange = 1;  
                        }
                        break;
                }
            });

            var alldays = document.querySelectorAll('[record_type="day"]');
            alldays.forEach(element => {
                var toggle = (svar.brugermap.indexOf(element.id)===-1) ? 'clear': 'set';
                element.setAttribute('toggle', toggle);
                element.style.background = (svar.brugermap.indexOf(element.id)===-1) ? '': _greenbg;
            });

            updateheatmap(svar.heatmap);
        }
    };
    
    xhttp.open("POST", "/ajaxquerybrugerkalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

function updateheatmap(heatmap){
    if ((heatmap != null)&&(setheatmode)){
        var colormap = ['','#005582','#0086ad','#00c2c7','#97ebdb','#daf8e3','#fff33b','#fdc70c','#f3903f','#ed683c','#e93e3a'];
        
        var alldays = document.querySelectorAll('[record_type="day"]');
        alldays.forEach(el=>{
            var heat=0;
            heatmap.forEach(bruger=>{
                heat = (bruger.calendar.indexOf(el.id) !== -1) ? heat+1: heat;
            });
            if (heat>10) {hear=10;}
            el.style.background = colormap[heat];
        });
    }
}

/***********************************
// main - program starts here !!!!!!
************************************/
ajaxquerybrugere();
ajaxqueryplaner();
updateMode(document.getElementById('selected-user-id').innerText, document.getElementById('selected-plan-id').innerText);
//responsivekalender();
//ajaxquerybrugerresponsivekalender();
