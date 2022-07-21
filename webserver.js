var path = require('path');
const { Pool } = require('pg');
const express = require('express');
var fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
    }
});
/* const pool = new Pool({
    user: 'sqlmaster',
    host: 'localhost',
    database: 'warhammer_planner',
    password: '-Zx12131415',
    port: 5432,
});
 */
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


/** add plans to DB /
var planer = [
    {name:"Warhammer, august", type:"event-planner", uuid:"1", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, september", type:"", uuid:"2", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, oktober", type:"", uuid:"3", valid_dates:[], final_date:"n/a"},
    {name:"Warhammer, november", type:"", uuid:"4", valid_dates:[], final_date:"n/a"}
];

planer.forEach(e =>{
    pool.query("INSERT INTO planer (name, type, calendar) VALUES ('" + e.name + "', '" + e.type + "', '{}')", (err, res) => {
        console.log(err, res)
      })
})
/**/

/** ADD names to DB */
function initbrugeretable(){
var names = [
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
}
// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
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

// valid date
// id=timestamp-year-month-0-0-0                  : month header
// id=timestamp-year-month-0-0-weekday            : week day header
// id=timestamp-year-month-0-weeknumber-0         : weeknumber
// id=timestamp-year-month-day-weeknumber-weekday : day

/* delete...
function genId(year,month,weekday,weeknumber,day,event_index){
    return 'timestamp-' + year + '-' + month + '-' + weekday + '-' + weeknumber + '-' + day + '-' + event_index;
}
*/


/** ADD calender records to DB */
const dag = new Date();
const km = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
const kd = ["ma", "ti", "on", "to", "fr", "lø", "sø"];

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
        str += insertKalenderRecord('month', year, m, 0, 0, 0, km[m - 1]);
// rendering daynames
        for (var dd = 1; dd < 8; dd++) {
            str += insertKalenderRecord('weekday', year, m, 0, 0, dd, kd[dd - 1]);
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
//                str += insertKalenderRecord('weeknumber', 2022, 0, 0, weeknumber, 0, weeknumber);
                weekchange = false;
            }
            str += insertKalenderRecord('day', year, m, dd, weeknumber, sd, dd);
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

// create records in kalender table 
app.get('/qw', function (req, res) {
    var str = createKalenderTable(res, 2022, 0);
    initbrugeretable();
    res.send(str);
});


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

app.get('/ttt', function (req, res) {
    var sql = "SELECT calendar FROM brugere WHERE name='Org';";
    console.log(sql);
    pool.query(sql, (err, result) => {
        if (!err) {
            console.log(result.rows[0].calendar);
            res.send(result.rows[0].calendar);
        }
        else {
            console.log(err);
            res.send("Error");
        }
    });
});

app.get('*', function (req, res) {
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

app.post('/ajaxtoggledays', function (req, res) {
    var update = req.body;
    var str = "ARRAY[";
    update.ids.forEach(e => {
        str += "'" + e + "',";
    })
    str = str.substring(0, str.length - 1) + "]";
    //    var sql = "SELECT id FROM kalender WHERE html_id IN ('day-2022-1-15-2-6', 'day-2022-1-16-2-7');";
    var sql = "UPDATE brugere SET calendar=" + str + " WHERE id=" + update.userid + ";"
    //var sql = "SELECT id FROM kalender WHERE html_id IN " + str + ";";
    console.log(sql);
    pool.query(sql, (err, result) => {
        if (!err) {
            console.log(result.rows);
            res.send(result.rows);
        }
        else {
            console.log(err);
            res.send("Error");
        }
    });
    /*
          pool.query("UPDATE brugere SET calendar='" + update.ids + "' WHERE id="+update.userid+";", (err, result) => {
            if (!err){
                res.send(result.rows);
            }
            else{
                res.send("Error");
            }
          });
    */
});

async function ajaxqueryplankalender_handler(req, res) {

    var svar = {
        "monthmap": [],
        "planmap" : [],
        "kalender": [],
        "brugermap": []
    };
    var sql = "SELECT calendar FROM planer WHERE id=" + req.body.planid + ";";
    let plankalender;
    try {
        const { rows } = await pool.query(sql);
        plankalender = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    svar.planmap = plankalender[0].calendar;
    
    sql = "SELECT * FROM kalender WHERE year=2022 ORDER BY year,month,day,weeknumber,weekday;";
    let kalenderen;
    try {
        const { rows } = await pool.query(sql);
        kalenderen = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    svar.kalender = kalenderen;
 
//    console.log(kalenderen);
    return res.send(svar);
}

app.post('/ajaxqueryplankalender', function (req, res) {
    ajaxqueryplankalender_handler(req, res);
});


async function ajaxquerybrugerkalender_handler(req, res) {

    var svar = {
        "monthmap": [],
        "planmap" : [],
        "kalender": [],
        "brugermap": []
    };

    sql = "SELECT * FROM kalender WHERE year=2022 ORDER BY year,month,day,weeknumber,weekday;";
    let kalenderen;
    try {
        const { rows } = await pool.query(sql);
        kalenderen = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    svar.kalender = kalenderen;

     var sql = "SELECT calendar FROM brugere WHERE id=" + req.body.userid + ";"
    let brugermap;
    try {
        const { rows } = await pool.query(sql);
        brugermap = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    svar.brugermap = brugermap[0].calendar;
 
//    console.log(kalenderen);
    return res.send(svar);
}


app.post('/ajaxquerybrugerkalender', function (req, res) {
    ajaxquerybrugerkalender_handler(req, res);
});

function updatePlanCalender(planid, map) {
    var str = "ARRAY[ ";
    map.forEach(e => {
        str += "'" + e + "',";
    })
    str = str.substring(0, str.length - 1) + "]::text[]";
    var sql = "UPDATE planer SET calendar=" + str + " WHERE id=" + planid + ";"
    pool.query(sql, (err, result) => {
        if (err) {
            console.log("FAIL - updatePlanCalender");
            console.log(sql);
        }
    });
}

app.post('/ajaxtoggleplandays', function (req, res) {
    var sql = "SELECT calendar FROM planer WHERE id=" + req.body.planid + ";"
    pool.query(sql, (err, result) => {
        if (!err) {
            if (result.rowCount == 1) {
                /*  console.log("-----------------------");
                 console.log(result.rows[0].calendar);
                 console.log(req.body.command); */
                var map = req.body.ids;
                /* console.log(map); */
                if (req.body.command === 'set') {
                    map.forEach(e => {
                        if (result.rows[0].calendar.indexOf(e) < 0) {
                            result.rows[0].calendar.push(e);
                            /* console.log("pushing:" + e); */
                        }
                    });
                }
                else if (req.body.command === 'clear') {
                    map.forEach(e => {
                        if (result.rows[0].calendar.indexOf(e) >= 0) {
                            result.rows[0].calendar.splice(result.rows[0].calendar.indexOf(e), 1);
                            /* console.log("Slicing:" + e); */
                        }
                    });
                }
                updatePlanCalender(req.body.planid, result.rows[0].calendar);
                res.send(result.rows[0].calendar);
            }
        }
        else {
            console.log(err);
            res.send("Error");
        }
    });
});

function updateBrugerCalender(userid, map) {
    var str = "ARRAY[ ";
    map.forEach(e => {
        str += "'" + e + "',";
    })
    str = str.substring(0, str.length - 1) + "]::text[]";
    var sql = "UPDATE brugere SET calendar=" + str + " WHERE id=" + userid + ";"
    pool.query(sql, (err, result) => {
        if (err) {
            console.log("FAIL - updateBrugerCalender");
            console.log(sql);
        }
    });
}

app.post('/ajaxtogglebrugerdays', function (req, res) {
//    console.log(req.body);
    var sql = "SELECT calendar FROM brugere WHERE id=" + req.body.userid + ";"
    console.log(sql);
    pool.query(sql, (err, result) => {
        if (!err) {
            if (result.rowCount == 1) {
                /*  console.log("-----------------------");
                 console.log(result.rows[0].calendar);
                 console.log(req.body.command); */
                var map = req.body.ids;
                /* console.log(map); */
                if (req.body.command === 'set') {
                    map.forEach(e => {
                        if (result.rows[0].calendar.indexOf(e) < 0) {
                            result.rows[0].calendar.push(e);
                            /* console.log("pushing:" + e); */
                        }
                    });
                }
                else if (req.body.command === 'clear') {
                    map.forEach(e => {
                        if (result.rows[0].calendar.indexOf(e) >= 0) {
                            result.rows[0].calendar.splice(result.rows[0].calendar.indexOf(e), 1);
                            /* console.log("Slicing:" + e); */
                        }
                    });
                }
                updateBrugerCalender(req.body.userid, result.rows[0].calendar);
                res.send(result.rows[0].calendar);
            }
        }
        else {
            console.log(err);
            res.send("Error");
        }
    });
});

app.post('/ajaxquerybrugere', function (req, res) {
    pool.query("SELECT id, name FROM brugere ORDER BY name", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
});

app.post('/ajaxqueryplaner', function (req, res) {
    pool.query("SELECT id, name, type, final_date FROM planer ORDER BY final_date;", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
});

async function ajaxquerymode3kalender_handler(req, res) {

    var svar = {
        "monthmap": [],
        "planmap" : [],
        "kalender": [],
        "brugermap": [],
        "heatmap": []
    };
    var sql = "SELECT calendar FROM planer WHERE id=" + req.body.planid + ";";
    let plankalender;
    try {
        const { rows } = await pool.query(sql);
        plankalender = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    plankalender[0].calendar.forEach(r => {
        var split = r.split('-');
        var key = split[1] + '-' + split[2];
        var ix = svar.monthmap.findIndex(e => e.key === key);
        if (ix === -1) {
            svar.monthmap.push({ "key": key, "year": split[1], "month": split[2] });
        }
        svar.planmap.push(r);
    });

    var where = "";
    svar.monthmap.forEach(d => {
        where += "OR (year=" + d.year + " AND month=" + d.month + ") ";
    });
    where = where.substring(2).trim();
    sql = "SELECT * FROM kalender WHERE " + where + " ORDER BY year,month,day,weeknumber,weekday;";
    let kalenderen;
    try {
        const { rows } = await pool.query(sql);
        kalenderen = rows;
        svar.kalender = kalenderen;
    }
    catch {
        svar.kalender = [];
        console.log('ERROR :' + sql);
    }
    console.log(svar.kalender);

    var sql = "SELECT calendar FROM brugere WHERE id=" + req.body.userid + ";"
    let brugermap;
    try {
        const { rows } = await pool.query(sql);
        brugermap = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
    svar.brugermap = brugermap[0].calendar;

    var sql = "SELECT id, calendar FROM brugere WHERE id IN (19,21,22,23,24,25,26,27);"
    try {
        const { rows } = await pool.query(sql);
        svar.heatmap = rows;
    }
    catch {
        console.log('ERROR :' + sql);
        return res.status(500).send();
    }
 
//    console.log(kalenderen);
    return res.send(svar);
}

app.post('/ajaxquerymode3kalender', function (req, res) {
    ajaxquerymode3kalender_handler(req, res);

/*     pool.query("SELECT * FROM kalender WHERE year=2022 ORDER BY year, month, day;", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
        else {
            res.send("Error");
        }
    });
 */});

app.post('/ajaxaddnewplan', function (req, res) {

     pool.query("INSERT INTO planer (name, type, calendar) VALUES ('" + 
                req.body.planname + "', 'event-planner', '{}') RETURNING id;", (err, result) => {
        if (!err) {
            res.send(result.rows[0]);
        }
        else {
            res.send("Error");
        }
    });
});

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`);

});

