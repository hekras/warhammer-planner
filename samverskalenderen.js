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

function setcalendar(e) {
    for (var p = 1; p < 3; p++) {
        document.getElementById('calendar-' + p).style.background = '';
    }
    e.style.background = _graybg;
    current_parent = e.id;
}

function setchild(e) {
    for (var p = 1; p < 2; p++) {
        document.getElementById('child-' + p).style.background = '';
    }
    e.style.background = _graybg;
    current_child = e.id;

    for (var i = 0; i < alldays.length; i++) {
        var s = alldays[i].getAttribute(current_child);
        alldays[i].style.background = ((s === null) || (s === 'false')) ? '' : _graybg;
    }
}

function initdays() {
    alldays = [];

    for (var m = 1; m < 13; m++) {
        var es = document.querySelectorAll('[month="' + m + '"]');
        for (var d = 0; d < es.length; d++) {
            var day = es[d].getAttribute('day');
            if (day != '0') {
                alldays.push(es[d]);

                var s = localStorage.getItem(es[d].id);
                if (s != null) {
                    console.log(es[d].id);
                    var ss = s.split('=')
                    es[d].setAttribute(ss[0], ss[1]);
                }
            }
        }
    }
}

function toggleday(e) {
    e.style.background = (e.style.background === '') ? _graybg : '';
    if (e.style.background === '') {
        e.setAttribute(current_child, 'false');
        localStorage.removeItem(e.id);
    }
    else {
        e.setAttribute(current_child, current_parent);
        localStorage.setItem(e.id, current_child + '=' + current_parent);
    } 
}

function toggledays(count, els) {
    var bg = (count > 0) ? '' : _graybg;
    var newstatus = (count > 0) ? 'false' : current_parent;

    for (var i = 0; i < els.length; i++) {
        els[i].style.background = bg;
        els[i].setAttribute(current_child, newstatus);
        if (newstatus === 'false') {
            localStorage.removeItem(els[i].id);
        }
        else {
            localStorage.setItem(els[i].id, current_child + '=' + current_parent);
        }
    }
}

function togglemonth(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var els = [];

    var count = 0;
    for (var i = 0; i < es.length; i++) {
        if (es[i].getAttribute('day') != '0') {
            count = (es[i].style.background != '') ? count + 1 : count;
            els.push(es[i]);
        }
    }
    toggledays(count, els);
    e.style.background = '';
}

function toggleweek(e) {
    var week = e.getAttribute('week');
    var es = document.querySelectorAll('[week="' + week + '"]');
    var els = [];

    var count = 0;
    for (var i = 0; i < es.length; i++) {
        if (es[i].getAttribute('day') != '0') {
            count = (es[i].style.background != '') ? count + 1 : count;
            els.push(es[i]);
        }
    }
    toggledays(count, els);
    e.style.background = '';
}

function toggledayofweek(e) {
    var month = e.getAttribute('month');
    var es = document.querySelectorAll('[month="' + month + '"]');
    var dayofweek = e.getAttribute('dayofweek');
    var els = [];

    var count = 0;
    for (var i = 0; i < es.length; i++) {
        if ((es[i].getAttribute('day') != '0') &&
            (es[i].getAttribute('dayofweek') === dayofweek)) {
            count = (es[i].style.background != '') ? count + 1 : count;
            els.push(es[i]);
        }
    }
    toggledays(count, els);
    e.style.background = '';
}

/***********************************
// main - program starts here !!!!!!
************************************/
//initdays();
//setcalendar(document.getElementById(current_parent));
//setchild(document.getElementById(current_child));