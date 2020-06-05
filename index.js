var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 19191);
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(CORS());

const getAllQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=?";
const deleteQuery = "DELETE FROM workout WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workout";
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT, 
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit BOOLEAN, 
                        date DATE);`;
                        // unit of 0 = lbs, unit of 1 = kg

const getAllData = (res) => {
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ rows: rows });
  });
};

// get all
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    getAllData(res);
  });
});

// insert row
app.post('/',function(req,res,next){
  var context = {};
  mysql.pool.query(insertQuery, [req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date], (err, result) => {
    if(err){
      next(err);
      return;
    }
    getAllData(res);
  });
});

// delete row
app.delete('/',function(req,res,next){
  var context = {};
  // http://url:19191?id=1 deletes row with id 1
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    // context.results = JSON.stringify(rows);
  });

  mysql.pool.query(deleteQuery, [req.query.id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    // send all data back
    getAllData(res);
  });
});

// update existing row (replace)
app.put('/',function(req,res,next){
  var context = {};
  mysql.pool.query(updateQuery,[req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date, req.body.id],
    (err, result) => {
    if(err){
      next(err);
      return;
    }
    // send all data
    getAllData(res);
  });
});

// reset and create
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
