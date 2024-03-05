const conn = require("./../util/dbconn"); // Import database connection module
const snapshotController = require("../controllers/snapshotcontroller"); // Import snapshot controller module
const axios = require("axios"); // Import axios for making HTTP requests

// Render record snapshot page
exports.getRecordSnapshot = (req, res) => {
  var userInfo = {}; // Initialize user info object
  const { isloggedin, userid, firstname } = req.session; // Extract session data
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname }; // Assign session data to user info object

  res.render("recordsnapshot");
};

// Process submission of record snapshot form
exports.postRecordSnapshot = (req, res) => {
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  var userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

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
  } = req.body; // Extract form data
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
  ]; // Construct values array

  const endpoint = `http://localhost:3002/record`; // Define API endpoint

  // Send POST request to API endpoint
  axios
    .post(endpoint, vals, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((response) => {
      const status = response.status; // Extract response status

      if (status === 200) {
        res.redirect("/history"); // Redirect to history page if successful
      } else {
        console.log(response.status);
        console.log(response.data);
        res.redirect("/history"); // Redirect to history page if unsuccessful
      }
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`); // Log error if request fails
    });
};

// Render snapshot history page
exports.getSnapshotHistory = (req, res) => {
  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

  const endpoint = `http://localhost:3002/history`;

  // Send GET request to API endpoint
  axios
    .get(endpoint, { params: { userid } })
    .then((response) => {
      const rows = response.data.result;
      //console.log(rows);

      // Convert date strings to Date objects
      rows.forEach((row) => {
        row.date = new Date(row.date);
      });

      res.render("snapshothistory", { result: rows }); // Render snapshot history page with data
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

// Render view snapshot page
// Defined variables before rendering page due to complex algorithm used to create progress bars (sourced from Chat GPT)
exports.getViewSnapshot = (req, res) => {
  const { id } = req.params;

  const endpoint = `http://localhost:3002/viewsnapshot/${id}`;

  // Send GET request to API endpoint
  axios
    .get(endpoint, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((response) => {
      const status = response.status;

      if (status === 200) {
        const rows = response.data.result;

        const snapshotData = rows[0];

        // Convert date strings to Date objects
        rows.forEach((row) => {
          row.date = new Date(row.date);
        });

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
      } else {
        console.log(response.status);
        console.log(response.data);
        res.redirect("/history");
      }
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

// Render edit snapshot page
exports.getEditSnapshot = (req, res) => {
  const { id } = req.params; // Extract snapshot ID from request parameters

  const endpoint = `http://localhost:3002/viewsnapshot/${id}`;

  // Send GET request to API endpoint
  axios
    .get(endpoint, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((response) => {
      const status = response.status;

      if (status === 200) {
        const rows = response.data.result;

        const snapshotData = rows[0];

        // Convert date strings to Date objects
        rows.forEach((row) => {
          row.date = new Date(row.date);
        });

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
      } else {
        console.log(response.status);
        console.log(response.data);
        res.redirect("/history");
      }
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

// Process update of snapshot
exports.postUpdateSnapshot = (req, res) => {
  const { id } = req.params;
  const { mytrigger } = req.body; // Extract trigger data from request body
  vals = [mytrigger]; // Construct values array

  console.log(id);
  console.log(vals);

  const endpoint = `http://localhost:3002/updatesnapshot/${id}`;

  // Send POST request to API endpoint
  axios
    .post(endpoint, vals, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((response) => {
      const status = response.status;

      if (status === 200) {
        res.redirect("/history");
      } else {
        console.log(response.status);
        console.log(response.data);
        res.redirect("/history");
      }
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

// Process deletion of snapshot
exports.postDeleteSnapshot = (req, res) => {
  const { id } = req.params;

  const endpoint = `http://localhost:3002/deletesnapshot/${id}`;

  // Send DELETE request to API endpoint
  axios
    .delete(endpoint, {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((response) => {
      const status = response.status;

      if (status === 200) {
        const data = response.data.result;
        res.redirect("/history");
      } else {
        console.log(response.status);
        console.log(response.data);
        res.redirect("/history");
      }
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

// Render trends page
exports.getYourTrends = (req, res) => {
  var userInfo = {};
  const { isloggedin, userid, firstname } = req.session;
  console.log(`User data from session: ${isloggedin}, ${userid}, ${firstname}`);

  userInfo = { loggedin: isloggedin, userid: userid, firstname: firstname };

  const endpoint = `http://localhost:3002/trends`;

  // Send GET request to API endpoint
  axios
    .get(endpoint, { params: { userid } })
    .then((response) => {
      const rows = response.data.result;
      console.log(rows);

      // Arrays to store emotion values, triggers, and concatenated date-time strings
      const emotionArrays = {};
      const triggerArrays = [];
      const dateTimeArray = [];

      // Iterate through each object in the array
      rows.forEach((item) => {
        // Iterate through each key (except non-emotion and date-time keys)
        Object.keys(item).forEach((key) => {
          if (
            key !== "emotion_id" &&
            key !== "user_id" &&
            key !== "triggers" &&
            key !== "date" &&
            key !== "time"
          ) {
            // Capitalize the first character of the key
            const capitalisedKey = key.charAt(0).toUpperCase() + key.slice(1);

            // If the key doesn't exist in the emotionArrays object, create an array for it
            if (!emotionArrays[capitalisedKey]) {
              emotionArrays[capitalisedKey] = [];
            }
            // Push the value for the current key into its respective array
            emotionArrays[capitalisedKey].push(item[key]);
          }
          // Check if the key is 'triggers'
          if (key === "triggers") {
            // Push trigger values directly into the triggerArrays array
            triggerArrays.push(item[key]);
          }
        });

        // Modify the date values
        item.date = item.date.substring(0, 10);
        //console.log(item.date);
        // Convert item.date to a Date object and format it
        item.date = new Date(item.date).toLocaleDateString("en-GB"); // Change to DD-MM-YYYY format
        item.time = item.time.substring(0, 5); // Change time to HH-MM format

        // Concatenate date and time and push it into the dateTimeArray
        dateTimeArray.push(`${item.date} ${item.time}`);
      });

      console.log(emotionArrays);
      console.log(triggerArrays);
      console.log(dateTimeArray);
      
      res.render("trends", {
        emotions: emotionArrays,
        triggers: triggerArrays,
        dateTime: dateTimeArray,
      });
    })
    .catch((error) => {
      console.log(`Error making API request ${error}`);
    });
};

module.exports = snapshotController; // Export snapshot controller module
