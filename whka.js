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

function e(row, left, top, onclick){
    var str_aa = '<div style="' +
        'left: ' + left + 'px; ' +
        'top: ' + top + 'px;" ' +
        'class="' + row.record_type + '" ' +
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
            document.getElementById("bruger-listen").innerHTML = str;
        }
    };
    
    xhttp.open("POST", "/ajaxquerybrugere", true);
//    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function ajaxquerykalender() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rows = JSON.parse(this.responseText);
            var html = "";
            var ypos = 85;
            var weekchange = 1;
            rows.forEach( r=> {
                if (r.day === 1){
                    ypos = 34;
                    weekchange = 1;
                }
                if (weekchange){
                    var xoff = 285 * ((r.month - 1) % 4);
                    var yoff = 100 + 270 * Math.floor((r.month - 1) / 4);
                    if (r.weeknumber != 0){
                        html += e_weeknumber(r,xoff, yoff+ypos, 'toggleweekenumber(this)');
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        var xoff = 285 * ((r.month - 1) % 4);
                        var yoff = 60 + 270 * Math.floor((r.month - 1) / 4);
                        html += e(r, xoff, yoff, 'togglemonth(this)');
                        break;
                    case 'weekday':
                        var xoff = 285 * ((r.month - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 100 + 270 * Math.floor((r.month - 1) / 4);
                        html += e(r, xoff, yoff, 'toggledayofweek(this)');
                        break;
                    case 'day':
                        var xoff = 285 * ((r.month - 1) % 4) + 2 + 33 * r.weekday;
                        var yoff = 100 + 270 * Math.floor((r.month - 1) / 4);
                        html += e(r, xoff, yoff + ypos, 'toggledayofweek(this)');
                        if (r.weekday === 7){
                            ypos += 33;
                            weekchange = 1;  
                        }
                        break;
                    }
            });
            document.getElementById("valid-kalender-selector").innerHTML = html;
        }
    };
    
    xhttp.open("POST", "/ajaxquerykalender", true);
    xhttp.send();
}

/***********************************
// main - program starts here !!!!!!
************************************/
ajaxquerybrugere();
ajaxquerykalender();
