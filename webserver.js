var path = require('path');
const {Pool} = require('pg');
const express = require('express');
var fs = require('fs');

const pool = new Pool({
    user: 'sqlmaster',
    host: 'localhost',
    database: 'warhammer_planner',
    password: '-Zx12131415',
    port: 5432,
});
  
const PORT = process.env.PORT || 8080
var app = express();
app.use(express.json());

var dir = __dirname; //var dir = path.join(__dirname, "/public");
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

const dag = new Date();
const km = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
const kd = ["ma", "ti", "on", "to", "fr", "lø", "sø"];

var eventliste = [
    {name:"Warhammer, august", type:"event-planner", uuid:"1", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, september", type:"", uuid:"2", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, oktober", type:"", uuid:"3", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, november", type:"", uuid:"4", valid_dates:[], final_date:"n/a"}
];

/** ADD names to DB 

var names = [
    {"name":"Org", "role":"*", "id":"eff26981-f88b-4a6b-b2fb-caeadb6b2c4b"},
    {"name":"GM", "role":"", "id":"287aacbc-7891-4ea4-847e-5d725321dc19"},
    {"name":"Finn", "role":"", "id":"9c136d93-406d-4d12-98bb-b350564476c0"}, 
    {"name":"Undick", "role":"", "id":"42e831ac-ccf7-46f0-a137-2a8265557007"}, 
    {"name":"Ursula", "role":"", "id":"7b12767e-877b-447b-8873-8359db50878b"}, 
    {"name":"Marath", "role":"", "id":"6fd05639-3d88-4ca0-9491-832044d57b40"}, 
    {"name":"Halfdan", "role":"", "id":"38452066-307e-4da8-bcd0-2d0854475aa7"}, 
    {"name":"Adric", "role":"", "id":"3a8697e9-5dd2-476f-a0c9-acc1e61a6d39"}, 
    {"name":"Odrick", "role":"", "id":"5212219a-57ae-4531-a38c-fd2e42da9d91"}, 
];

names.forEach(e =>{
    pool.query("INSERT INTO brugere (name, calendar) VALUES ('" + e.name + "', '{}')", (err, res) => {
        console.log(err, res)
      })
})
/**/

var db=[];
var valid_ids=[];
//var current_user = names[0];
var db_filename = path.join(__dirname,"/databasen.json");
var heatmap=[];

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
}
  
function update_heat(){
    db.forEach(user => {
        if (user.role != ""){
            valid_ids = [];
            valid_ids = valid_ids.concat(user.ids);
        }
    });

    heatmap=[];
    valid_ids.forEach(id => {
        var rec = {
            "id": id,
            "count": 0
        };        
        db.forEach(user => {
            if ((user.role == "")&&(user.ids.indexOf(id) >=0)){
                rec.count++;
            }
        });
        heatmap.push(rec);
    });
}

function init_db(){
    fs.readFile(db_filename, 'utf8', function (err, data) {
        if (!err){
            db = JSON.parse(data);
            update_heat();
        }
        else{
            names.forEach(element => {
                if (element.name != ""){
                    db.push({
                        "user": element.name,
                        "userid": element.id,
                        "role": element.role,
                        "ids":[]
                    });
                }
            });
        }
    });
}

function write_db(){
    fs.writeFile (db_filename, JSON.stringify(db), function(err) {
        if (err){
            console.log("db write didnt work!!");
        }
    });
}

function renderBegin(){
    return '<!DOCTYPE html>' +
    '<html>' +
        '<title>Warhammer planneren</title>' +
        '<head>' +
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' +
        '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">' +
        '<link rel="stylesheet" href="./w3.css">' +
    '<style>' +
        '.center {' +
            'margin: 0;' +
            'position: absolute;' +
            'top: 50%;' +
            'left: 50%;' +
            '-ms-transform: translate(-50%, -50%);' +
            'transform: translate(-50%, -50%);' +
        '}' +
    '</style>' +
    '</head>' +
    '<body>';
}

function renderEnd(){
    return '<script src="/samverskalenderen.js"></script>' +
    '</body></html>';
}

function renderMainMenu(){
    var xpos = 2;
    var str = e('b', '', xpos, 5, 32, 32, 29, 0, '', '<i class="fa fa-calendar-plus-o"></i>', 'c', 'setGUI(0)', '');
    xpos += 35;
    str += e('b', '', xpos, 5, 32, 32, 29, 0, '', '<i class="fa fa-calendar-check-o"></i>', 'c', 'setGUI(1)', '');
    xpos += 35;
    str += e('b', '', xpos, 5, 32, 32, 29, 0, '', '<i class="fa fa-pencil"></i>', 'c', 'setGUI(2)', '');
    xpos += 35;
    str += e('b', '', xpos, 5, 32, 32, 29, 0, '', '<i class="fa fa-users"></i>', 'c', 'setGUI(3)', '');
    xpos += 35;
    str += e('b', '', xpos, 5, 32, 32, 29, 0, '', '<i class="fa fa-list"></i>', 'c', 'setGUI(4)', '');
    return str;
}

function e(el, id, x, y, width, height, fontsize, borderthickness, borderstyle, text, verticalallign, onclick, oninput)
{
    var str_aa = '';
    var str_ab = '';
    switch (el) {
        case 'init':
            str_aa = renderBegin();
            break;
        case 'end':
            str_aa = renderEnd();
            break;
        case 'l':
        case 'label':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: ' + borderthickness + 'px ' + borderstyle + ';">';
            str_ab = '</div>';
            break;
        case 'heat':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px;"' + 
                'id="' + id + '" ' +
                '>';
            str_ab = '</div>';
            break;
        case 'b':
        case 'button':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: ' + borderthickness + 'px ' + borderstyle + '; ' +
                'cursor: pointer;"' +
                'onclick="' + onclick + '">';
            str_ab = '</div>';
            break;
        case 'bround':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'border-radius: 3px;' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: 2px solid black; ' +
                'cursor: pointer;"' +
                'id="' + id + '" ' +
                'onclick="' + onclick + '">';
            str_ab = '</div>';
            break;
        case 'bround_year':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'border-radius: 3px;' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: 2px solid black; ' +
                'cursor: pointer;"' +
                'onclick="' + onclick + '">';
            str_ab = '</div>';
            break;
        case 'bday':
            var timestamp = id.split('-');
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'border-radius: 2px;' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: ' + borderthickness + 'px ' + borderstyle + '; ' +
                'cursor: pointer;"' +
                'id="' + id + '" ' +
                'year="' + timestamp[1] + '" ' +
                'month="' + timestamp[2] + '" ' +
                'day="' + timestamp[3] + '" ' +
                'week="' + timestamp[4] + '" ' +
                'dayofweek="' + timestamp[5] + '" ' +
                'onclick="' + onclick + '">';
            str_ab = '</div>';
            break;
        case 'bday-hidden':
            str_aa = '<div style="' +
                'box-sizing: border-box; ' +
                'color: lightgray; ' +
                'border-radius: 2px;' +
                'position: absolute; ' +
                'overflow: hidden; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: ' + borderthickness + 'px ' + borderstyle + '; ' +
                '">';
            str_ab = '</div>';
            break;
        case 'i':
        case 'input':
            str_aa = '<input type="text" id="' + id +
                '" oninput="' + oninput +
                '" onclick="' + onclick + '" ' +
                'style="position: absolute; ' +
                'left: ' + x + 'px; ' +
                'top: ' + y + 'px; ' +
                'width: ' + width + 'px; ' +
                'height: ' + height + 'px; ' +
                'font-size: ' + fontsize + 'px; ' +
                'border: ' + borderthickness + 'px ' + borderstyle + '; ' +
                'cursor: pointer;" ' +
                'value="' + text + '">';
            str_ab = '';
            break;
    }

    var ret = '';
    switch (verticalallign) {
        case 'c':
        case 'center':
            ret = str_aa +
                '<span style="' +
                'margin: 0; ' +
                'position: absolute; ' +
                'top: 50%; ' +
                'left: 50%; ' +
                'margin-right: -50%;' +
                'transform: translate(-50%, -50%); ' +
                'text-align: center; ">' +
                text +
                '</span>' +
                str_ab;
            break;
        case '%':
            ret = str_aa + str_ab;
            break;
        default:
            ret = str_aa + text + str_ab;
            break;
    }
    return ret;
}

function renderEventList(){
    var str = '<table class="w3-table-all">' +
    '<tr class="w3-light-green">' +
    '<th>Action</th>' +
    '<th>Name</th>' +
    '<th>Type</th>' +
    '<th>Event Date</th>' +
    '</tr>';
    eventliste.forEach(e => {
        str += '<tr>'
        str += '<td><a class="w3-button" href="/select-valid-dates/' + e.uuid + '">Valid dates</a><a class="w3-button"><i class="fa fa-pencil"></i></a></td>';
        str += '<td>' + e.name + '</td>';
        str += '<td>' + e.type + '</td>';
        str += '<td>' + e.final_date + '</td>';
        str += '</tr>'
    });
    str += '</table>';
    return str;
}

function renderUsers(){
    var str = '<table class="w3-table-all">' +
    '<tr class="w3-light-green">' +
    '<th>Action</th>' +
    '<th>Name</th>' +
    '</tr>';
    pool.query("SELECT name FROM brugere ORDER BY name", (err, res) => {
        if (!err){
            console.log(res)
                    res.rows.forEach(e => {
                str += '<tr>';
                str += '<td><a class="w3-button"><i class="fa fa-user-times"></i></a></td>';
                str += '<td>' + e.name + '</td>';
                str += '</tr>';
            });
            str += '<tr>'
            str += '<td><a class="w3-button"><i class="fa fa-user-plus"></i></a></td>';
            str += '<td></td>';
            str += '</tr>'
            str += '</table>';
            }
      });
    return str;
}

function renderGUI(res, year, userid){
    var str = renderBegin();
    str += renderMainMenu();
    str += '<div style="top: 50px; position: relative;">';
    str += '<div id="2f7749a6-d82e-45db-9648-018b2aa7fe4d" style="display:none;">';
    str += '<H1>New Calendar, Valid Dates</H1>';
    str += '</div>'
    str += '<div id="6c7387f9-ca23-43b0-963c-1ddcafae5a0e" style="display:none;">';
    str += '<H1>Calendar check</H1>';
    str += '</div>'
    str += '<div id="143821e5-8801-4898-b697-82956280eb95" style="display:none;">';
    str += '<H1>Settings</H1>';
    str += '</div>'
    str += '<div id="327d03d9-5152-4a39-944a-07cd4f404641" style="display:block;">';
    str += '<H1>Users</H1>'; 
    str += renderUsers();
    str += '</div>'
    str += '<div id="61e19db2-07ec-41b0-8831-0411f6b0b69d" style="display:block;">';
    str += '<H1>Event List</H1>';
    str += renderEventList();
    str += '</div>'
    str += '</div>'
    str += renderEnd();
    res.send(str);

}

function renderCalendar(res, year, userid){
    var str = renderBegin();
    str += renderMainMenu()
    var xpos = 2 + 35*5;
//    str += e('bround', 'previous-year', xpos, 5, 32, 32, 29, 0, '', '&#10094;', 'c', 'setyear(' + (parseInt(year,10) - 1) + ')', '');
//    xpos += 35;
    str += e('l', '', xpos, 5, 90, 32, 29, 0, '', year, 'c', '', '');
    xpos += 92;
//    str += e('bround', 'next-year', xpos, 5, 32, 32, 29, 0, '', '&#10095;', 'c', 'setyear(' + (parseInt(year,10) + 1) + ')', '');
    xpos += 100;
    names.forEach(element => {
        var star = (element.role !== "") ? " " + element.role : "";
        str += e('bround', element.id, xpos, 5, 75, 32, 12, 0, '', element.name + star, 'c', 'setUser(this)', '');
        xpos += 92;
    });

//    str += e('bround', "current_user", xpos, 5, 75, 32, 12, 0, '', userid, 'c', 'testopen()', '');
    str += '<div id="current_user" style="display: none;">' + userid + '</div>';
    xpos += 92;

    str += '<div style="top: 50px; height: 200px; position: relative;">';
    var user_record = null; 
    db.forEach(e => {
        if (e.userid === userid){
            user_record = e;
        }
    });
    var valid_months = [];
    if (user_record.role != ""){
        valid_months = [1,2,3,4,5,6,7,8,9,10,11,12];
    }
    else{
        valid_ids.forEach(id => {
            var m = parseInt(id.split('-')[2], 10);
            if (valid_months.indexOf(m) === -1) {
                valid_months.push(m);
            }
        });
    }
    valid_months.sort(function(a, b) {
        return a - b;
    });

    var mm = 1;
    valid_months.forEach(m => {
        var hw = 60;
        var xoff = 285 * ((mm - 1) % 4);
        var yoff = 40 + 270 * Math.floor((mm - 1) / 4);
    
// render month
        var id = 'timestamp-' + year + '-' + m + '-' + 0 + '-' + 0 + '-' + 0;
        str += e('bday', id, xoff, 20 + yoff, 300, 32, 20, 1, '', km[m - 1], 'c', 'togglemonth(this)', '');

// rendering daynames
        for (var dd = 1; dd < 8; dd++) {
            var ypos = 50;
            var xpos = 2 + dd * 33;
            var id = 'timestamp-' + year + '-' + m + '-' + 0 + '-' + 0 + '-' + dd;
            str += e('bday', id, xpos + xoff, ypos + yoff, 32, 32, 12, 1, 'solid black', kd[dd - 1], 'c', 'toggledayofweek(this)', '');
        }

// rendering small calendar
        var ypos = 85;
        var ypos2 = 50;
        var weekchange = true;
        dag.setFullYear(year,m,0);
        var num_days = dag.getDate();
        for (var dd = 1; dd < num_days+1; dd++) {
            dag.setFullYear(year,m-1,dd);
            sd = dag.getDay();
            sd = (sd === 0) ? 7 : sd;
            if (weekchange) {
                weeknumber = dag.getWeek();
                var id = 'timestamp-' + year + '-' + 0 + '-' + 0 + '-' + weeknumber + '-' + 0;
                str += e('bday', id, 2 + xoff, ypos + yoff, 32, 31, 12, 1, 'solid black', weeknumber, 'c', 'toggleweek(this)', '');
                weekchange = false;
            }
            var id = 'timestamp-' + year + '-' + m + '-' + dd + '-' + weeknumber + '-' + sd;
            xpos = 2 + sd * 33;
            if (user_record.role != ""){
                str += e('bday', id, xpos + xoff, ypos + yoff, 32, 31, 18, 1, 'solid black', dd, 'c', 'toggleday(this)', '');
                heatmap.forEach(rec => {
                    if (rec.id == id){
                        str += e('heat', id+'heat', xpos + xoff + 22, ypos + yoff + 20, 10, 10, 8, 1, '', rec.count, '', '', '');
                    }
                });
            }
            else if (valid_ids.indexOf(id) >= 0) {
                str += e('bday', id, xpos + xoff, ypos + yoff, 32, 31, 18, 1, 'solid black', dd, 'c', 'toggleday(this)', '');
                heatmap.forEach(rec => {
                    if (rec.id == id){
                        str += e('heat', id+'heat', xpos + xoff + 22, ypos + yoff + 20, 10, 10, 8, 1, '', rec.count, '', '', '');
                    }
                });
            }
            else{
                str += e('bday-hidden', id, xpos + xoff, ypos + yoff, 32, 31, 18, 1, 'solid lightgray', dd, 'c', '', '');
            }
            switch(sd){
                case 7: // sunday
                    ypos += 33;
                    ypos2 += (hw + 1) * 3;
                    weekchange = true;
                    weeknumber++;
                    break;
            }
        }
        mm++;
    });

    str += '</div>'
    str += e('end', '', 0, 0, 0, 0, 0, '', '', '', '', '');
    res.send(str);
}

// valid date
// id=timestamp-year-month-0-0-0                  : month header
// id=timestamp-year-month-0-0-dd                 : week day header
// id=timestamp-year-month-0-weeknumber-0         : weeknumber
// id=timestamp-year-month-weekday-weeknumber-day : day

function genId(year,month,weekday,weeknumber,day,event_index){
    return 'timestamp-' + year + '-' + month + '-' + weekday + '-' + weeknumber + '-' + day + '-' + event_index;
}

function insertKalenderRecord(recordType, year, month, day, weeknumber, weekday, text){
    var str = "INSERT INTO kalender (html_id, record_type, year, month, day, weeknumber, weekday, str) VALUES (" +
              "'" + recordType + "-" + year + "-" + month + "-" + day + "-" + weeknumber + "-" + weekday + "', " +
              "'" + recordType + "', " +
              year + ", " + month + ", " + day + ", " + weeknumber + ", " + weekday + ", '" + text + "');";
    pool.query(str, (err, res) => {
    console.log(err, res)
    });
        
    return str + "<br>";
}

function createKalenderTable(res, year, event_index){
    var str = "";
    valid_months = [1,2,3,4,5,6,7,8,9,10,11,12];

    valid_months.forEach(m => {
// render month
        str += insertKalenderRecord('month', 2022, m, 0, 0, 0, km[m - 1]);
// rendering daynames
        for (var dd = 1; dd < 8; dd++) {
            str += insertKalenderRecord('weekday', 2022, m, 0, 0, dd, kd[dd - 1]);
        }
// rendering small calendar
        var weekchange = true;
        dag.setFullYear(year,m,0);
        var num_days = dag.getDate();
        for (var dd = 1; dd < num_days+1; dd++) {
            dag.setFullYear(year,m-1,dd);
            sd = dag.getDay();
            sd = (sd === 0) ? 7 : sd;
            if (weekchange) {
                weeknumber = dag.getWeek();
                str += insertKalenderRecord('weeknumber', 2022, 0, 0, weeknumber, 0, weeknumber);
                weekchange = false;
            }
            str += insertKalenderRecord('day', 2022, m, dd, weeknumber, sd, dd);
            switch(sd){
                case 7: // sunday
                    weekchange = true;
                    weeknumber++;
                    break;
            }
        }
    });

    return str;
}

function renderValidDateSelector(res, year, event_index){
    var str = renderBegin();
    str += renderMainMenu()
    var xpos = 2 + 35*5;
//    str += e('bround', 'previous-year', xpos, 5, 32, 32, 29, 0, '', '&#10094;', 'c', 'setyear(' + (parseInt(year,10) - 1) + ')', '');
//    xpos += 35;
    str += e('l', '', xpos, 5, 90, 32, 29, 0, '', year, 'c', '', '');
    xpos += 92;
//    str += e('bround', 'next-year', xpos, 5, 32, 32, 29, 0, '', '&#10095;', 'c', 'setyear(' + (parseInt(year,10) + 1) + ')', '');
    xpos += 100;

//    str += e('bround', "current_user", xpos, 5, 75, 32, 12, 0, '', userid, 'c', 'testopen()', '');

    valid_months = [1,2,3,4,5,6,7,8,9,10,11,12];

    var mm = 1;
    valid_months.forEach(m => {
        var hw = 60;
        var xoff = 285 * ((mm - 1) % 4);
        var yoff = 40 + 270 * Math.floor((mm - 1) / 4);
    
// render month
        var id = genId(year, m, 0 ,0 ,0 , event_index);
        str += e('bday', id, xoff, 20 + yoff, 300, 32, 20, 1, '', km[m - 1], 'c', 'togglemonth(this)', '');

// rendering daynames
        for (var dd = 1; dd < 8; dd++) {
            var ypos = 50;
            var xpos = 2 + dd * 33;
            var id = genId(year, m, 0 ,0 ,dd , event_index);
            str += e('bday', id, xpos + xoff, ypos + yoff, 32, 32, 12, 1, 'solid black', kd[dd - 1], 'c', 'toggledayofweek(this)', '');
        }

// rendering small calendar
        var ypos = 85;
        var ypos2 = 50;
        var weekchange = true;
        dag.setFullYear(year,m,0);
        var num_days = dag.getDate();
        for (var dd = 1; dd < num_days+1; dd++) {
            dag.setFullYear(year,m-1,dd);
            sd = dag.getDay();
            sd = (sd === 0) ? 7 : sd;
            if (weekchange) {
                weeknumber = dag.getWeek();
                var id = genId(year, 0 ,0 ,weeknumber, 0 , event_index);
                str += e('bday', id, 2 + xoff, ypos + yoff, 32, 31, 12, 1, 'solid black', weeknumber, 'c', 'toggleweek(this)', '');
                weekchange = false;
            }
            var id = genId(year, m, dd, weeknumber, sd, event_index);
            xpos = 2 + sd * 33;
            str += e('bday', id, xpos + xoff, ypos + yoff, 32, 31, 18, 1, 'solid black', dd, 'c', 'toggleday(this)', '');
            switch(sd){
                case 7: // sunday
                    ypos += 33;
                    ypos2 += (hw + 1) * 3;
                    weekchange = true;
                    weeknumber++;
                    break;
            }
        }
        mm++;
    });

    str += '</div>'
    str += e('end', '', 0, 0, 0, 0, 0, '', '', '', '', '');
    res.send(str);
}

init_db();

app.get('/', function (req, res) {
//    year = '2022';
//    renderGUI(res, year, 0);
    var file = path.join(dir, req.path.replace(/\/$/, '/whka.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

/** create records in kalender table */
app.get('/qw', function (req, res) {
    var str = renderBegin();
    str += createKalenderTable(res, 2022, 0);
    str += renderEnd();
    res.send(str);
});

app.get('/select-valid-dates/*', function (req, res) {
    renderValidDateSelector(res, '2022', 0);
});

app.get('*', function (req, res) {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.post('/ajaxtoggledays', function(req, res){
    var update = req.body;
    var user_record = null;
    
    db.forEach(e => {
        if (e.userid === update.userid){
            user_record = e;
        }
    });

    if (user_record != null){
        if (update.command === ''){
            update.ids.forEach(e => {
                user_record.ids = user_record.ids.filter(a => e!== a);
            });
        }
        else{
            user_record.ids = user_record.ids.concat(update.ids);
        }
        update_heat();

        var map = {
            "ids": user_record.ids,
            "heatmap": heatmap
        };

        res.send(map);
        write_db();
    }
});

app.post('/ajaxquerybrugere', function(req, res){
    pool.query("SELECT name FROM brugere ORDER BY name", (err, result) => {
        if (!err){
            res.send(result.rows);
        }
      });
});

app.post('/ajaxquerykalender', function(req, res){
    pool.query("SELECT * FROM kalender WHERE year=2022 ORDER BY year, month, day", (err, result) => {
        if (!err){
            res.send(result.rows);
        }
        else{
            res.send("Error");
        }
      });
});

app.listen(PORT, function () {
    console.log(`Listening on ${ PORT }`);

});

