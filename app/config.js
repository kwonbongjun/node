module.exports = {
    server_port: 80,
    server_session: {
        secret:"keyboard cat",
        resave:false,
        saveUninitialized:true
    },
    server_error: {
      static: {
        "404":"./error/404.html"
      }
    },
    jdbc : {
      connectionLimit:3,

  /*    host:"192.168.3.31",
      user:"root",
      password:"1234",
      database:"test",
      debug:false,
      multipleStatements: true
*/
      host:"192.168.3.32",
      //host:"172.30.1.10",
      user:"root",
      password:"1234",
      database:"test",
      debug:false,
      multipleStatements: true

    }
};
