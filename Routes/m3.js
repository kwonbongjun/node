const db = require("../Server/db"); // 데이터베이스 연결프로그램 가져오기
const commons = require("../Server/commons"); // 공통 메세지 모듈
const m = [];                   // 모듈 리스트 생성하기
const express = require("express");
const router=express.Router();
router.route("../Views/m3").post(function(req, res){
  console.log("시작");
    if(req.session.user) {

    }else {
      commons.viewDirect(req, res, "/");
    }
});
express().use("/", router);
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
        //var index = Number(req.query.index);
        var sql = `select budgets_id,DATE_FORMAT(date,'%Y-%m-%d') as date ,division,money from a_budgets order by budgets_id desc LIMIT ?, 5`;
        //var result = {state : true};
        if(req.session.user) {
        var result = {state : true, login : 1};
        }else {
          var result = {state : true, login : 0};
        }      console.log("111111111111",result);
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
      if(req.session.user){
        var id = req.session.user.id;
        var date = req.body.date;
        var division = req.body.division;
        var money =  req.body.money;
        if(id == "M3" || req.session.user.authority_code == 0){
        var sql = 'insert into a_budgets (`date`, `division`,`money`) values (?, ?, ?)';
        db("SET", sql, [date, division, money]).then(function(rows){
            commons.msgResult(res, rows, "msg1", "../m3/index2.html#c1");//이동주소
        });
    } else {
        var rows = {state : false};
        //alert("권한없음");
        commons.msgResult(res, rows, "msg2", "");
    }

}else {
    var rows = {state : false};
    commons.msgResult(res, rows, "msg3", "");
  }
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
            var index = req.body.index;
            //console.log(id);
            if(id == "M3" || req.session.user.authority_code == 0){
                //console.log(id);
                var sql = "delete from a_budgets where budgets_id = ?";
                db("SET", sql, [index]).then(function(rows){
                    commons.msgResult(res, rows, "msg3", "../m3/index2.html#c1");
                });
             } else {
                 var rows = {state : false};

                 commons.msgResult(res, rows, "msg3", "");
                 console.log("권한 없음");
                 //res.redirect("/");
             }
         } else {
             //var rows = {state : false};
             //commons.msgResult(res, rows, "msg3", "");
             var rows = {state : false};
             commons.msgResult(res, rows, "msg3", "");
             //commons.viewResult(req,res,"./m3/index.html");
         }
    }
}

m[6] = {
    path: "/update",
    type: "POST",
    fun: function(req, res){
      if(req.session.user){
        var id = req.session.user.id;
        console.log(req.body);
        var id = req.session.user.id;
        var b_id = req.body.budgets_id;
        var date = req.body.date;
        var division = req.body.division;
        var money = req.body.money;
        console.log("1"+req.session);
        if(id == "M3" || req.session.user.authority_code == 0){
            var sql = "update a_budgets set date = ?,division = ?, money= ? where budgets_id = ?";
            db("SET", sql, [date,division,money,b_id]).then(function(rows){
                commons.msgResult(res, rows, "msg2", "../m3/index2.html#c1");
            });
        } else {
          res.redirect("/");
            //var rows = {state : false};
            //console.log("권한없음");
            //alert("권한없음");
            //commons.msgResult(res, rows, "msg2", "");
        }
    }
  else {
      //var rows = {state : false};
      //commons.msgResult(res, rows, "msg3", "");
  }
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
        SELECT b.구분, b.부서, DATE_FORMAT(publisheddate,'%Y-%m-%d') AS  발생일자, price AS  금액,b.대상, b.항목
        FROM b_voucher cross join (SELECT '영업' AS 부서,'출금' AS '구분', '부서내' AS  대상,'유류비' AS  항목) b on (delete_flag = 'N')
        UNION ALL
        SELECT b.구분, b.부서, DATE_FORMAT(payD,'%Y-%m-%d') AS  발생일자, totsal AS  금액, b.대상, b.항목
        FROM p_pay_dailies cross join (SELECT '인사' AS 부서, '출금' AS '구분', '부서내' AS  대상,'일용직' AS  항목 ) b
        UNION ALL
        SELECT b.구분, b.부서, DATE_FORMAT(payD ,'%Y-%m-%d') AS  발생일자, totsal AS  금액, b.대상, b.항목
        FROM p_pay_permanents cross join (SELECT '인사' AS 부서, '출금' AS '구분', '부서내' AS  대상,'상용직' AS  항목 ) b`;

        db("GET", sql, []).then(function(rows){
           // commons.msgResult(res, rows, "msg1", "../m3/index1.html#c1");//이동주소
        });
        m[8].step1(req,res);
    },
    step1: function(req, res){
        var index = Number(req.body.index);
        var sql = `select * from v_a_money order by 발생일자 desc LIMIT ?, 5`;
        if(req.session.user) {
        console.log("1");
        var result = {state : true, login : 1};
        }else {
          var result = {state : true, login : 0};
        }      console.log("111111111111",result);
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
      if(req.session.user){
        var id = req.session.user.id;
        var sql;
        var add_budgets_id = req.body.add_budgets_id;
        var budgets_id = req.body.budgets_id;
        var money = req.body.money;
        var contents =  req.body.contents;
        var flag= req.body.flag;
        //console.log(budgets_id,money,contents,flag);
        console.log(req.session);
        if(id == "M3" || req.session.user.authority_code == 0){
            sql='insert into a_add_budgets (`add_budgets_id`, `budgets_id`, `money`,`contents`,`approval_flag`) values (?, ?, ?, ?, ?) on duplicate key update budgets_id= ? , money = ?,contents = ?, approval_flag= ?';
          db("SET", sql, [add_budgets_id, budgets_id,money,contents,flag,budgets_id,money,contents,flag]).then(function(rows){
              commons.msgResult(res, rows, "msg1", "../m3/index2.html#c1");//이동주소
          });
        } else {
            var rows = {state : false};
            //alert("권한없음");

            commons.msgResult(res, rows, "msg2", "");
        }

    }
    else {

        var rows = {state : false};
        commons.msgResult(res, rows, "msg3", "");
        //commons.viewResult(req,res,"./m3/index.html");
    }
  }
}
m[10] = {                        // 모듈 리스트에 넣기
    path: "/searchdate",            // URL 주소 정의
    type: "POST",               // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        m[10].step1(req, res);   // step1 호출
    },
    step1: function(req, res){
      //console.log(req.body);
        var index = Number(req.body.index);
        var sdate = req.body.sdate;
        var edate = req.body.edate;
        var sn = req.body.sn;
        console.log("111"+sdate,edate);
        var sql = `select budgets_id,DATE_FORMAT(date,'%Y-%m-%d') as date ,
        division,money from a_budgets where date>=? and date<=? order by budgets_id desc LIMIT ?, 5`;
        if(sn==1) {
            sql=`select * from v_a_money WHERE 발생일자 >= ? AND 발생일자 <= ? order by 발생일자 desc LIMIT ?, 5`;
        }else if(sn==2) {
          sql=`select * from (SELECT 구분,부서,발생일자,SUM(금액) as 금액 FROM v_a_money GROUP BY 부서, DATE_FORMAT(발생일자,'%m')) as a WHERE 발생일자 >= ? AND 발생일자 <= ? order by 발생일자 desc LIMIT ?, 5`;
        }
        //console.log(sql);

        var result = {state : true};
        db("GET", sql, [sdate,edate,index]).then(function(rows){
            if(rows.state){
                result.list = rows.rows;
                //console.log(result.list);
            } else {
                result.list = [];
                result.state = false;
                //console.log(result.list);
            }
            m[10].step2(req, res, result); // step2 호출
        });
    },
    step2: function(req, res, result){
      var sn = req.body.sn;
      var sdate = req.body.sdate;
      var edate = req.body.edate;
      console.log(req.body);
        sql = "select count(*) as cnt from a_budgets where date>=? and date<=?";
        if(sn==1) {
            sql=`select count(*) as cnt from v_a_money WHERE 발생일자 >= ? AND 발생일자 <= ?`;
        }else if(sn==2) {
            sql=`select count(*) as cnt from  (SELECT 구분,부서,발생일자,SUM(금액) as 금액 FROM v_a_money GROUP BY 부서, DATE_FORMAT(발생일자,'%m')) as a WHERE 발생일자 >= ? AND 발생일자 <= ?`;
        }
        db("GET", sql, [sdate, edate]).then(function(rows){     // 함수 실행 후 동작 부분
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
m[11] = {                        // 모듈 리스트에 넣기
    path: "/selectaddbudget",            // URL 주소 정의
    type: "POST",               // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        m[11].step1(req, res);   // step1 호출
    },
    step1: function(req, res){

        var index = Number(req.body.index);
        //console.log(req.body);

        var sql = `select * from a_add_budgets order by add_budgets_id desc LIMIT ?, 5`;

        var result = {state : true};
        db("GET", sql, [index]).then(function(rows){
            if(rows.state){
                result.list = rows.rows;
            } else {
                result.list = [];
                result.state = false;
            }
            m[11].step2(req, res, result); // step2 호출
        });
    },
    step2: function(req, res, result){
        sql = "select count(*) as cnt from a_add_budgets";
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
m[12] = {                        // 모듈 리스트에 넣기
    path: "/monthmoney",            // URL 주소 정의
    type: "POST",               // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        m[12].step1(req, res);   // step1 호출
    },
    step1: function(req, res){

        var index = Number(req.body.index);
        console.log(req.body);

        var sql = `SELECT 구분,부서,발생일자,SUM(금액) as 금액 FROM v_a_money GROUP BY 부서, DATE_FORMAT(발생일자,'%m')`;

        var result = {state : true};
        db("GET", sql, [index]).then(function(rows){
            if(rows.state){
                result.list = rows.rows;
            } else {
                result.list = [];
                result.state = false;
            }
            m[12].step2(req, res, result); // step2 호출
        });
    },
    step2: function(req, res, result){
        sql = "select count(*) as cnt from (SELECT SUM(금액) FROM v_a_money GROUP BY DATE_FORMAT(발생일자,'%m'))  AS s";
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

m[13] = {
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
/*
            res.set('Content-Type', 'text/html');
            res.set('charset',"utf-8");
            */
module.exports = m; // 모듈 외부 사용하도록 생성
