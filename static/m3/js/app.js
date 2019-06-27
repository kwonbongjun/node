var sql = require('..../server')();
var sql2='select * from test1';
console.log('app.js started');
sql.DB(sql2,"",function(err, data){
  if (err) console.log(err);
  else console.log(data);

  server.풀.end(function(err){
    if (err) console.log(err);
    else {
      console.log('Connection pool has closed');
      console.log('app.js finished');
    }
  });
});
