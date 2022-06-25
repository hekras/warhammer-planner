var path = require('path');
const express = require('express');
const PORT = process.env.PORT || 8000

var app = express();
var fs = require('fs');

var dir = __dirname; //var dir = path.join(__dirname, "/public");

function e(el, id, x, y, width, height, fontsize, borderthickness, borderstyle, text, verticalallign, onclick, oninput)
{
    var str_aa = '';
    var str_ab = '';
    switch (el) {
        case 'init':
            str_aa = 
            '<!DOCTYPE html>' +
            '<html>' +
                '<title>Warhammer planneren</title>' +
                '<head>' +
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">' +
                '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">' +
                '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">' +
//                '<link rel="stylesheet" href="/css/w3css/w3.css">' +
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
                '<body><html>';
            break;
        case 'end':
            str_aa = 
            '<script src="/samverskalenderen.js"></script>' +
            '</body>';
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

function renderCalendar(res, year){
    var str = e('init', '', 0, 0, 0, 0, 0, '', '', '', '', '');
    var xpos = 2;
    str += e('bround', 'previous-year', xpos, 5, 32, 32, 29, 0, '', '&#10094;', 'c', 'setyear(' + (parseInt(year,10) - 1) + ')', '');
    xpos += 35;
    str += e('l', '', xpos, 5, 90, 32, 29, 0, '', year, 'c', '', '');
    xpos += 92;
    str += e('bround', 'next-year', xpos, 5, 32, 32, 29, 0, '', '&#10095;', 'c', 'setyear(' + (parseInt(year,10) + 1) + ')', '');
    str += e('end', '', 0, 0, 0, 0, 0, '', '', '', '', '');

    for (var m = 1; m < 13; m++) {

        var km = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
        var kd = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    
        var hw = 60;
        var xoff = 285 * ((m - 1) % 4);
        var yoff = 40 + 270 * Math.floor((m - 1) / 4);
    
// render month
        var id = 'timestamp-' + year + '-' + m + '-' + 0 + '-' + 0 + '-' + 0;
        str += e('bday', id, xoff, 20 + yoff, 300, 32, 20, 1, '', km[m - 1], 'c', 'togglemonth(this)', '');

// rendering daynames
        for (var dd = 1; dd < 8; dd++) {
            var ypos = 50;
            var xpos = 2 + dd * 33;
            var id = 'timestamp-' + year + '-' + m + '-' + 0 + '-' + 0 + '-' + dd;
            str += e('bday', id, xpos + xoff, ypos + yoff, 32, 32, 10, 1, 'solid black', kd[dd - 1], 'c', 'toggledayofweek(this)', '');
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
                str += e('bday', id, 2 + xoff, ypos + yoff, 32, 31, 18, 1, 'solid black', weeknumber, 'c', 'toggleweek(this)', '');
                weekchange = false;
            }
            var id = 'timestamp-' + year + '-' + m + '-' + dd + '-' + weeknumber + '-' + sd;
            xpos = 2 + sd * 33;
            str += e('bday', id, xpos + xoff, ypos + yoff, 32, 31, 10, 1, 'solid black', dd, 'c', 'toggleday(this)', '');

            switch(sd){
                case 7: // sunday
                    ypos += 33;
                    ypos2 += (hw + 1) * 3;
                    weekchange = true;
                    weeknumber++;
                    break;
            }
        }
    }    

    res.send(str);
}


app.get('/setyear', function (req, res) {
    renderCalendar(res, req.query.year);
});

app.get('/wp', function (req, res) {
    year = '2022';
    renderCalendar(res, year);
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
        console.log(file);
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.listen(PORT, function () {
    console.log('Listening on ${ PORT }');
});