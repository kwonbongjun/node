const db = require("../Server/db"); // 데이터베이스 연결프로그램 가져오기
const commons = require("../Server/commons"); // 공통 메세지 모듈
const m = [];                   // 모듈 리스트 생성하기

m[0] = {                        // 모듈 리스트에 넣기
    path: "/index",             // URL 주소 정의
    type: "GET",                // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        commons.viewResult(req, res, "./m3/index.html");
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
        var sql = `select budgets_id,DATE_FORMAT(date,'%Y-%m-%d') as date ,division,money from a_budgets order by budgets_id desc LIMIT ?, 5`;
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
        sql = "select count(*) as cnt from a_budgets";
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
        var date = req.body.date;
        var division = req.body.division;
        var money =  req.body.money;

        var sql = 'insert into a_budgets (`date`, `division`,`money`) values (?, ?, ?)';
        db("SET", sql, [date, division, money]).then(function(rows){
            commons.msgResult(res, rows, "msg1", "../m3/index2.html#c1");//이동주소
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
            commons.msgResult(res, rows, "msg0", "/m3/index");
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
        console.log(req.body);
        //var id = req.session.user.id;
        var b_id = req.body.budgets_id;
        var date = req.body.date;
        var division = req.body.division;
        var money = req.body.money;
        //if(id == paramId){
            var sql = "update test set date = ?,division = ?, money= ? where budgets_id = ?";
            db("SET", sql, [date,division,money,b_id]).then(function(rows){
                commons.msgResult(res, rows, "msg2", "");
            });
        //} else {
          //  var rows = {state : false};
          //  commons.msgResult(res, rows, "msg2", "");
        //}
    }
}
m[7] = {                        // 모듈 리스트에 넣기
    path: "/index2",             // URL 주소 정의
    type: "GET",                // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        commons.viewResult(req, res, "./m3/index2.html");
    }
}
m[8] = {
    path: "/createview",
    type: "POST",
    fun: function(req, res){

        var sql = `CREATE OR REPLACE VIEW v_a_money as 
        SELECT type_flag AS 구분, b.부서, publisheddate AS  발생일자, price AS  금액,  reciver  AS  대상,ids   AS   항목
        FROM b_voucher cross join (SELECT '영업' AS 부서) b
        UNION 
        SELECT b.구분, b.부서, pay_date AS  발생일자, total_salary AS  금액, b.항목, b.대상
        FROM p_pay_dailies cross join (SELECT '인사' AS 부서, '출금' AS '구분', '부서내' AS  대상,'일용직' AS  항목 ) b
        UNION
        SELECT b.구분, b.부서, pay_date AS  발생일자, total_salary AS  금액, b.항목, b.대상
        FROM p_pay_permanents cross join (SELECT '인사' AS 부서, '출금' AS '구분', '부서내' AS  대상,'상용직' AS  항목 ) b`;
        
        db("GET", sql, []).then(function(rows){
           // commons.msgResult(res, rows, "msg1", "../m3/index1.html#c1");//이동주소
        });
        m[8].step1(req,res);
    },
    step1: function(req, res){
        var index = Number(req.body.index);
        var sql = `select * from v_a_money order by 발생일자 desc LIMIT ?, 5`;
        var result = {state : true};
        db("GET", sql, [index]).then(function(rows){
            if(rows.state){
                result.list = rows.rows;
            } else {
                result.list = [];
                result.state = false;
            }
            m[8].step2(req, res, result); // step2 호출
        });
    },
    step2: function(req, res, result){
        sql = "select count(*) as cnt from v_a_money";
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
m[9] = {
    path: "/insertaddbudget",
    type: "POST",
    fun: function(req, res){
        var budgets_id = req.body.budgets_id;
        var money = req.body.money;
        var contents =  req.body.contents;
        var flag= req.body.approval_flag;

        var sql = 'insert into a_add_budgets (`budgets_id`, `money`,`contents`,`flag`) values (?, ?, ? ?)';
        db("SET", sql, [budgets_id, money,contents,flag]).then(function(rows){
            commons.msgResult(res, rows, "msg1", "../m3/index2.html#c1");//이동주소
        });
    }
}

/*
            res.set('Content-Type', 'text/html');
            res.set('charset',"utf-8");
            */
module.exports = m; // 모듈 외부 사용하도록 생성
