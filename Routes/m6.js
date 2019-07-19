const db = require("../Server/db");           // 데이터베이스 연결프로그램 가져오기
const commons = require("../Server/commons"); // 공통 메세지 모듈
const log = require("../Server/log.js"); 
const m = [];

m[0] = {
    path: "/v/:view",
    type: "GET",
    fun: function(req, res){
        //res.end(req.params.view);
        // 화면 파일 목록을 배열에 정의
        var html_list = [
                            "editprofile", "forgotten", "forgottenpwd",
                            "molelist", "profile", "register",
                            "result", "update"
                        ];
        // 화면 처리 상태값 정의 (true:화면 출력, false:로그아웃 시킨다)
        var flag = false;
        // html 파일 존재 여부 확인 반복문
        for(var i = 0; i < html_list.length; i++){
            if(html_list[i] == req.params.view) {
                flag = true;
                break;
            }
        }
        // 화면 처리 상태값에 따라 화면 출력 정의 분기점
        if(flag){ // 정상 화면 출력
            if(req.params.view == "register"){
                commons.viewResult(req, res, "./m6/"+ req.params.view +".html", "C");    
            } else {
                commons.viewResult(req, res, "./m6/"+ req.params.view +".html");
            }            
        } else { // 비정상 URL 주소 때문에 로그아웃 처리
            commons.viewDirect(req, res, "/logout")
        }        
    }
}

m[1] = {
    path: "/d/:view",
    type: "POST",
    fun: function(req, res){
        //res.end(req.params.view);
        // 화면 파일 목록을 배열에 정의
        var html_list = [
                        "editprofile", "forgotten", "forgottenpwd",
                        "molelist", "profile", "register", "update"
                    ];
        // 화면 처리 상태값 정의 (true:화면 출력, false:로그아웃 시킨다)
        var flag = false;
        // html 파일 존재 여부 확인 반복문
        for(var i = 0; i < html_list.length; i++){
            if(html_list[i] == req.params.view) {
                flag = true;
                break;
            }
        }
        // 화면 처리 상태값에 따라 화면 출력 정의 분기점
        if(flag){ // 정상 URL 주소
            m[1].service(req, res);
        } else { // 비정상 URL 주소 
            res.end("오류");
        }
        //commons.viewResult(req, res, "./m6/"+ req.params.view +".html");
    },
    service: function(req, res){
        // 데이터베이스 연결 부분 정의
        var type = req.body.flag;  // 입력(insert, update, delete) / 출력(select)
        var url = req.body.viewDirect; // 데이터베이스 처리 후 보여 줄 화면 URL 받아오기
        var q_list = m[1].sql_list[req.params.view]; // 데이터베이스 사용할 질의어(Query) 및 파라메터 목록 가져오기
        var call_list = []; // 다중 SQL 배열 생성
        // 데이터베이스 호출 목록 생성 반복문
        for(var q = 0; q < q_list.length; q++){
            var sql = q_list[q].sql;   // 데이터베이스 SQL문 변수에 담기
            var column = q_list[q].column; // SQL문 매핑 컬럼 배열 변수에 담기
            var column_list = []; // SQL문 매핑 컬럼 매핑 배열 생성
            for(var i = 0; i < column.length; i++){ // 컬럼 매핑 배열 반복문
                column_list[i] = req.body[column[i]]; // 컬럼 배열 순서 대로 매핑 배열에 담기
            }
            // 다중 SQL문 1행 내용 담기
            call_list[q] = {
                "type" : type,
                "sql" : sql,
                "column_list" : column_list
            }
        }
        // 다중 SQL문 실행 시작!
        m[1].forEachSql(req, res, url, call_list, 0);
    },
    sql_list : {
        "editprofile" : [{"sql":"select 1", "column":[]}], 
        "forgotten" : [{"sql":"select 2", "column":[]}], 
        "forgottenpwd" : [{"sql":"select 3", "column":[]}], 
        "molelist" : [{"sql":"select 4", "column":[]}], 
        "profile" : [{"sql":"select 5", "column":[]}], 
        "register" : [
                        {"sql":"insert into j_cooperator (reg_number, corperation, ceo, tel, in_out_flag) values (?,?,?,?,?)", 
                         "column":["reg_number", "corperation", "ceo", "tel", "in_out_flag"]},
                        {"sql":"insert into u_users (`id`, `password`, `authority_code`) values (?,?,9)", 
                         "column":["reg_number", "tel"]},
                    ],
        "update" : [{"sql":"select 7", "column":[]}]
    },
    forEachSql : function(req, res, url, call_list, index){
        db(call_list[index].type, call_list[index].sql, call_list[index].column_list).then(function(rows){ // 데이터베이스에 위에서 정의한 내용으로 실행
            if(index == (call_list.length) - 1){
                commons.viewDirect(req, res, url); // 데이터베이스 처리 후 화면 처리 정의
            } else {
                index++;
                m[1].forEachSql(req, res, url, call_list, index);
            }
        });
    }
}

module.exports = m;