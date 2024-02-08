const conn = require("./../util/dbconn");
const snapshotController = require('../controllers/snapshotcontroller');


exports.getRecordSnapshot = (req, res) => {

  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

  if(isloggedin==true) {
    res.render("recordsnapshot");
  } else {
    res.redirect("/login");
   }

};

exports.postRecordSnapshot = (req, res) => {
  const data = req.body;
  console.log(data);

  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

  const {
    myenjoyment,
    mysadness,
    myanger,
    mycontempt,
    mydisgust,
    myfear,
    mysurprise,
    mytrigger,
    mydate,
    mytime,
  } = req.body;
  const vals = [
    userInfo.userid, //user id from session
    myenjoyment,
    mysadness,
    myanger,
    mycontempt,
    mydisgust,
    myfear,
    mysurprise,
    mytrigger,
    mydate,
    mytime,
  ];

  const insertSQL =
    "INSERT INTO emotions (user_id, enjoyment, sadness, anger, contempt, disgust, fear, surprise, triggers, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  conn.query(insertSQL, vals, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/history");
    }
  });
};

exports.getSnapshotHistory = (req, res) => {
  
  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };
  
 if(isloggedin==true) {

  const selectSQL =
    `SELECT * FROM emotions WHERE user_id = ${userInfo.userid} ORDER BY date DESC, time DESC`;

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);

      res.render("snapshothistory", { result: rows });
    }
  });

 } else {
  res.redirect("/login");
 }
 
  
};

exports.getViewSnapshot = (req, res) => {
  const { id } = req.params; //const id = req.params.id
  console.log(id);
  console.log(req.params);
  const selectSQL = `SELECT * FROM emotions WHERE emotion_id = ${id}`;

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      const snapshotData = rows[0];

      res.render("viewsnapshot", {
        emotionid: id,
        myenjoyment: snapshotData.enjoyment,
        mysadness: snapshotData.sadness,
        myanger: snapshotData.anger,
        mycontempt: snapshotData.contempt,
        mydisgust: snapshotData.disgust,
        myfear: snapshotData.fear,
        mysurprise: snapshotData.surprise,
        mytrigger: snapshotData.triggers,
        mydate: snapshotData.date.toDateString(),
        mytime: snapshotData.time,
      });
    }
  });
};

exports.getEditSnapshot = (req, res) => {
  const { id } = req.params; //const id = req.params.id
  console.log(id);
  console.log(req.params);
  const selectSQL = `SELECT * FROM emotions WHERE emotion_id = ${id}`;

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      const snapshotData = rows[0];

      res.render("editsnapshot", {
        emotionid: id,
        myenjoyment: snapshotData.enjoyment,
        mysadness: snapshotData.sadness,
        myanger: snapshotData.anger,
        mycontempt: snapshotData.contempt,
        mydisgust: snapshotData.disgust,
        myfear: snapshotData.fear,
        mysurprise: snapshotData.surprise,
        mytrigger: snapshotData.triggers,
        mydate: snapshotData.date.toDateString(),
        mytime: snapshotData.time,
      });
    }
  });
};

exports.postUpdateSnapshot = (req, res) => {
  console.log(req.params);
  console.log(req.body);

  const { id } = req.params;
  const { mytrigger } = req.body;
  vals = [mytrigger];

  const updateSQL = `UPDATE emotions SET triggers = ? WHERE emotion_id = ${id}`;

  conn.query(updateSQL, vals, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/history");
    }
  });
};

exports.postDeleteSnapshot = (req, res) => {
  const { id } = req.params;

  const deleteSQL = `DELETE FROM emotions WHERE emotion_id = ${id}`;
  conn.query(deleteSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/history");
    }
  });
};

exports.getYourTrends = (req, res) => {

  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

  if(isloggedin==true) {

    const selectSQL =
    `SELECT * FROM emotions WHERE user_id = ${userInfo.userid} ORDER BY date DESC, time DESC`;

    conn.query(selectSQL, (err, rows) => {
      if (err) {
        throw err;
      } else {
        console.log(rows);
  
        res.render("trends", { result: rows });
      }
    });

  } else {
    res.redirect("/login");
   }

  
};

module.exports = snapshotController;