
const wi = 100/6;

function v3calender(){
    var html = '<div class="w3-row">';
    var mm = [1,2,3,4,5,6,7,8,9,10,11,12];
    var dd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    mm.forEach(m=>{
        html += '<div class="w3-col w3-container l4 m6"">';

        html += '<div class="w3-row">';
        html += '<div><br></div>';
        html += '<div id="month-' + m + '" class="w3-col" style="width:100%; height: 32px; text-align: center; font-size: 20px; cursor:pointer;">- ' + m + ' -</div>';
        // render weekdays names
        dd.forEach(d=>{
            html += '<div id="day-' + m + '-' + d + '" class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; font-weight: bold; cursor: pointer; padding: 6px; visibility: hidden;">' + d + '</div>';
            html += '<div id="weekday-' + m + '-' + d + '" class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; font-weight: bold; cursor: pointer; padding: 6px; visibility: hidden;">-</div>';
            for(var s=1;s<5;s++){
                html += '<div id="day-s-' + m + '-' + d + '-' + s + '" class="w3-col w3-border" style="width:' + wi + '%; height: 32px; text-align: center; font-size: 12px; cursor: pointer; padding: 6px; visibility: hidden;">' + s + '</div>';
            }
        });
        html += '</div>';
        html += '</div>';

    });
    html += '</div>';
    return html;
}

function v3ee_weekday(r, eid, onclickevent){
    const wd = ['-','ma','ti','on','to','fr','lø','sø'];
    const daybackground = ['black','','','','','','#dddddd','#dddddd'];
    var e = document.getElementById(eid);
//    e.setAttribute('id', r.html_id);
    e.style.visibility = 'visible';
    e.setAttribute('record_type', "weekday");
    e.setAttribute('year', r.year);
    e.setAttribute('month', r.month);
    e.setAttribute('day', r.day);
    e.setAttribute('week', r.weeknumber);
    e.setAttribute('dayofweek', r.weekday);
    e.setAttribute('onclick', onclickevent);
    e.innerText = wd[r.weekday];
    e.style.background = daybackground[r.weekday];
}

function v3ee_s(r, eid, onclickevent){
    var e = document.getElementById(eid);
//    e.setAttribute('id', r.html_id);
    e.style.visibility = 'visible';
    e.setAttribute('record_type', 'slot');
    e.setAttribute('toggle','clear');
    e.setAttribute('year', r.year);
    e.setAttribute('month', r.month);
    e.setAttribute('day', r.day);
    e.setAttribute('week', r.weeknumber);
    e.setAttribute('dayofweek', r.weekday);
    e.setAttribute('onclick', onclickevent);
    e.innerText = '';
}

function v3ee(r, eid, onclickevent){
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

function ajaxquerybrugerresponsivekalender() {
    var update = {
        "userid": 0,
        "planid": 0,
        "modeid": 0
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
//                        ee_weeknumber(r, 'weeknumber-' + monthoffset + '-' + weekoffset, 'toggleweek(this)');
                        weekoffset++;
                    }
                    weekchange = 0;
                }
                switch(r.record_type){
                    case 'month':
                        monthoffset++;
                        weekoffset = 0;
                        v3ee(r, 'month-' + r.month, 'togglemonth(this)');
                        break;
                    case 'weekday':
//                        ee(r, 'weekday-' + monthoffset + '-' + r.weekday, 'toggledayofweek(this)' );
                        break;
                    case 'day':
                        v3ee_weekday(r, 'weekday-' + r.month + '-' + r.day, 'toggleday(this)' );
                        v3ee(r, 'day-' + r.month + '-' + r.day, 'toggleday(this)' );
                        for(var s=1;s<5;s++){
                            v3ee_s(r, 'day-s-' + r.month + '-' + r.day + '-' + s, 'toggleday(this)' );
                        }
                        if (r.weekday === 7){
                            weekchange = 1;  
                        }
                        break;
                }
            });

/*             var alldays = document.querySelectorAll('[record_type="day"]');
            alldays.forEach(element => {
                var toggle = (svar.brugermap.indexOf(element.id)===-1) ? 'clear': 'set';
                element.setAttribute('toggle', toggle);
                element.style.background = (svar.brugermap.indexOf(element.id)===-1) ? '': _greenbg;
            });
 */
//            updateheatmap(svar.heatmap);
        }
    };
    
    xhttp.open("POST", "/ajaxqueryv3kalender", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(update));
}

document.getElementById('responsivekalender').innerHTML = v3calender();
ajaxquerybrugerresponsivekalender();