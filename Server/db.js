const log = require("./log.js");                    // log 모듈 받아오기
const mariadb = require('mariadb');       // MariaDB 모듈 받아오기
const pool = mariadb.createPool(require("./config").db_info); // 접속 정보를 이용하여 풀 만들기
 
async function asyncFunction(type, sql, params) { // async, await를 이용하여 동기식 함수 구성하기
  var conn, result = {};                  // 전역변수 선언
  try {
    //console.log(sql, params);
    result.state = true;                  // 상태값 true로 정의
    conn = await pool.getConnection();    // 풀에서 하나의 연결 정보 받아오기
    rows = await conn.query(sql, params); // 데이터베이스 쿼리 실행 후 결과값 받기
    if(type == "GET") result.rows = rows; // 결과값을 받아와야 하는 SELECT문은 여기서 결과값 받기
    //console.log(rows);
    // else console.log(rows);            // 결과값 없이 INSERT, UPDATE, DELETE문은 실행만 하기
  } catch (error) {
    log.info(error);
    result.state = false;                 // 오류 발생 시 상태값 false로 정의
    result.msg = error.code;              // 오류 발생 시 오류내용 보내기
    throw error;
  } finally {
    if (conn) conn.end();                 // 연결 정보가 있는 경우는 연결 종료 하기
    return result;                        // 모든 실행이 완료 후 결과값 보내기
  }
}

module.exports = asyncFunction;