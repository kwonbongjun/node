const db = require("../Server/db"); // 데이터베이스 연결프로그램 가져오기
const commons = require("../Server/commons"); // 공통 메세지 모듈
const m = [];                   // 모듈 리스트 생성하기

m[0] = {                        // 모듈 리스트에 넣기
    path: "/index",             // URL 주소 정의
    type: "GET",                // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        commons.viewResult(req, res, "./dbTest.html");
    }
}

m[1] = {                        // 모듈 리스트에 넣기
    path: "/select",            // URL 주소 정의
    type: "POST",               // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의        
        m[1].step1(req, res);   // step1 호출
    },
    step1: function(req, res){
        var index = Number(req.body.index);
        var sql = `select * from test where DEL_YN = 'N' LIMIT ?, 5`;
        var result = {state : true};
        db("GET", sql, [index]).then(function(rows){
            if(rows.state){
                result.list = rows.rows;
            } else {
                result.list = [];
                result.state = false;
            }
            m[1].step2(req, res, result); // step2 호출
        });
    },
    step2: function(req, res, result){
        sql = "select count(*) as cnt from test where DEL_YN = 'N'";
        db("GET", sql, []).then(function(rows){     // 함수 실행 후 동작 부분
            if(rows.state){
                result.paging = rows.rows[0].cnt;
            } else {
                result.paging = 0;
                result.state = false;
            }
            commons.msgResult(res, result, "msg0");
        });
    }
}

m[2] = {
    path: "/insert",
    type: "POST",
    fun: function(req, res){
        var nm = req.body.nm;
        var id = req.session.user.id;
        var sql = 'insert into test (NM, ID) values (?, ?)';
        db("SET", sql, [nm, id]).then(function(rows){
            commons.msgResult(res, rows, "msg1", "/m0/index");
        });
    }
}

m[3] = {
    path: "/login",
    type: "POST",
    fun: function(req, res){
        var id = req.body.id;
        var password = req.body.password;
        var sql = "select * from u_users where id = ? and `password` = ?";
        db("GET", sql, [id, password]).then(function(rows){
            if(rows.rows.length > 0){
                req.session.user = rows.rows[0];
            }
            commons.msgResult(res, rows, "msg0", "/m0/index");
        });
    }
}

m[4] = {
    path: "/logout",
    type: "GET",
    fun: function(req, res){
        req.session.destroy(function(error){
            if(error){
                console.log(error);
            }
            res.redirect("/");
        });
    }
}

m[5] = {
    path: "/delete",
    type: "POST",
    fun: function(req, res){
        if(req.session.user){
            var id = req.session.user.id;
            var paramId = req.body.id;
            var no = req.body.no;
            if(id == paramId){
                var sql = "update test set DEL_YN = 'Y' where NO = ?";
                db("SET", sql, [no]).then(function(rows){
                    commons.msgResult(res, rows, "msg3", "");
                });
            } else {
                var rows = {state : false};
                commons.msgResult(res, rows, "msg3", "");
            }
        } else {
            var rows = {state : false};
            commons.msgResult(res, rows, "msg3", "");
        }
    }
}

m[6] = {
    path: "/update",
    type: "POST",
    fun: function(req, res){
        var id = req.session.user.id;
        var paramId = req.body.id;
        var no = req.body.no;
        var nm = req.body.nm;
        if(id == paramId){
            var sql = "update test set NM = ? where NO = ?";
            db("SET", sql, [nm, no]).then(function(rows){
                commons.msgResult(res, rows, "msg2", "");
            });
        } else {
            var rows = {state : false};
            commons.msgResult(res, rows, "msg2", "");
        }
    }
}
m[7] = {                        // 모듈 리스트에 넣기
    path: "/index2",             // URL 주소 정의
    type: "GET",                // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        commons.viewResult(req, res, "./m3/index.html");
    }
}
/*
            res.set('Content-Type', 'text/html');
            res.set('charset',"utf-8");
            */
module.exports = m; // 모듈 외부 사용하도록 생성