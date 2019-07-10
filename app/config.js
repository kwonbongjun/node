module.exports = {
    server_port: 80,
    server_session: {
        secret:"keyboard cat",//비밀키. 쿠키 임의 변경 방지
        resave:false,//변경되지 않아도 언제나 저장할지
        saveUninitialized:true //세션 저장 전에 초기화안한 상태로 미리 만들어 저장
    },
    server_error: {
      static: {
        "404":"./error/404.html" //정적폴더
      }
    },
    jdbc : {
      connectionLimit:1,

  /*    host:"192.168.3.31",
      user:"root",
      password:"1234",
      database:"test",
      debug:false,
      multipleStatements: true
*/
<<<<<<< HEAD
      //host:"192.168.3.31",
      host:"172.30.1.10",
=======
      host:"192.168.3.31",
      //host:"172.30.1.10",
      port:53306,
>>>>>>> f58ee64e6ae761683704e3c40138fe09aa119b78
      user:"root",
      password:"1234",
      database:"test",
      debug:false,
      multipleStatements: true

    }
};
