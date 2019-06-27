<p>var pool = require('..../server');</p>

module.exports = function () {
  return {
    select: function(callback){
      pool.getConnection(function(err, con){
        var sql = 'select * from test1';
        con.query(sql,"", function (err, result, fields) {
          con.release();
          if (err) return callback(err);
          callback(null, result);
        });
      });
    },
    pool: pool
  }
};
