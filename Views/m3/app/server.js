/******************************************************************************
 * 1. express : 웹서버 서비스 프로그램  (예, http://localhost:80/)
 * 2. express-error-handler : 에러 관리 설정 (예, 404 오류 화면 처리)
 * 3. express-session : 섹션 정보 관리 (예, 임시 정보 저장소)
 * 4. body-parser : 요청 시 파라미터 값 편하게 관리 (예, name=nm -> {'name':'nm'})
 * 5. path : 경로 위치 및 정의 (예, c:/~/app/)
 * 6. logger : 콘솔에 내용 남기기 (예, 날짜:시간:레벨:출력내용)
 * 7. router : URL 주소 관리 설정 (예, http://localhost:80/test -> '/test')
 * 8. ejs : 템플릿 엔진, 서버 데이터 사용 (예, html속에 <% %> 이용하여 데이터 사용)
 ******************************************************************************/
const 서버 = require("express"),
      오류페이지 = require("express-error-handler"),
      섹션 = require("express-session"),
      요청값 = require("body-parser"),
      경로 = require("path"),
      엔진 = require("ejs"),
      로그 = require("./log.js"),
      설정 = require("./config.js"),
      디비 = require('mariadb'),
      앱 = 서버();
//console.log(서버);
const server = {
        RUN : () => {
            // 앱 설정 하기.
            로그.info(">> Server init");
            앱.set("port", 설정.server_port);
            앱.set("views", 경로.join(__dirname, "../"));
            앱.use(서버.static(경로.join(__dirname, "../")));
            앱.use(요청값.urlencoded({extended:false}));
            앱.use(요청값.json());
            앱.engine("html", 엔진.renderFile);
            앱.use(섹션(설정.server_session));
            server.STEP_1();
        },
        STEP_1 : () => {
            // 라우터 설정
            로그.info(">> Router init");
            const 라우터 = 서버.Router();
            라우터.route("/main").get((req, res) => {
                if(req.session.user){
                  res.render("./m3/index.html",{user : req.session.user});
                }else {
                  res.render("./index.html");
                }
            });
            라우터.route("/login").post((req, res) => {
                req.session.user = req.body;
                로그.info("세션 생성 : " + JSON.stringify(req.session.user));
                res.redirect("/main");
            });
            라우터.route("/logout").get((req, res) => {
                if(req.session.user){
                    로그.info("세션 삭제 : " + JSON.stringify(req.session.user));
                    req.session.destroy(error => {
                        if(error){
                            로그.info("세션 삭제 중 오류 발생.");
                            return;
                        }
                        로그.info("로그아웃 완료!");
                        res.redirect("/main");
                    });
                }
            });
            라우터.route("/dbTest").get((req, res) => {

                //server.DB("select * from test.test1", [], (err, resultList) => {
                var sflag;
                var sdate={};
                var edate={};
                //var obj={};
                //var obj=req._parsedOriginalUrl.query.split("&");
                //var sdate=obj[0].split("=");
                //var edate=obj[1].split("=");
                var query1="select * from test.test1;";
                if(obj !=req._parsedOriginalUrl.query) {
                var obj=JSON.stringify(req._parsedOriginalUrl.query);
                console.log(obj);
                obj=obj.substring(1,obj.length-1);
                var obj2=(obj.split("&"));
                var map=obj2[0].split("=");
                sdate[map[0]]=map[1].replace("-","");
                sdate[map[0]]=sdate[map[0]].replace("-","");
                var map2=obj2[1].split("=");
                edate[map2[0]]=map2[1].replace("-","");;
                edate[map2[0]]=edate[map2[0]].replace("-","");
                console.log(edate[map2[0]]);
                query1="select * from test.test1 where time1>="+sdate[map[0]]+" && time1<"+edate[map2[0]]+";";
              }
                server.DB(query1, [], (err, resultList) => {

                  if(err){
                      res.redirect("/main");
                      return;
                  }
                  //console.log(resultList);
                  res.type("json");
                  res.render("./db.html", {data :resultList});
                });
            });
            라우터.route("/dbTest2").post((req,res) => {
             console.log(JSON.stringify(req.body.no));
            var no=JSON.stringify(req.body.no);
            var time=JSON.stringify(req.body.time);
            var money=JSON.stringify(req.body.money);
            var content=JSON.stringify(req.body.content);
            var result=JSON.stringify(req.body.result);
            var target=JSON.stringify(req.body.target);
            var contents=JSON.stringify(req.body.contents);
//,"\"+time1+"\",'100000','1','구디','110000'
            var commit="COMMIT;";

            server.DB("insert into test.test1(no1,time1,money,content,target,result,contents) values ("+no+"\,"+time+"\,"+money+"\,"+content+"\,"+target+"\,"+result+"\,"+contents+");"+commit, [], (err, resultList) => {
            if(err){
                res.redirect("/main");
                console.log(err);
                return;
            }
            console.log(resultList);
            res.type("json");
            res.render("./db.html", {data :resultList});
          });
        });
        라우터.route("/dbTest3").get((req, res) => {
          var split1=req._parsedOriginalUrl.query.split("=");
          var val=split1[1];
          var commit="COMMIT;";
            var no=val*1;
            server.DB("delete from test.test1 where no="+no+";"+commit, [], (err, resultList) => {

              if(err){
                  res.redirect("/main");
                  return;
              }
              //console.log(resultList);
              //console.log(resultList);
              res.type("json");
              res.render("./db.html", {data :resultList});
            });
        });
        라우터.route("/update").post((req,res) => {
           console.log(JSON.stringify(req.body.no));
          var no=JSON.stringify(req.body.no);
          var no1=JSON.stringify(req.body.no1);
          var time=JSON.stringify(req.body.time1);
          var money=JSON.stringify(req.body.money);
          var content=JSON.stringify(req.body.content);
          var result=JSON.stringify(req.body.result);
          var target=JSON.stringify(req.body.target);
          var contents=JSON.stringify(req.body.contents);
          //,"\"+time1+"\",'100000','1','구디','110000'
          var commit="COMMIT;";
          server.DB("update test.test1 set no1="+no1+",time1="+time+",money="+money+
          ",content="+content+",target="+target+",result="+result+",contents="+contents+
          "where no="+no+";"+commit, [], (err, resultList) => {
          if(err){
              res.redirect("/main");
              console.log(err);
              return;
          }
          console.log(resultList);
          res.type("json");
          res.render("./db.html", {data :resultList});
          });
        });

            앱.use("/", 라우터);
            server.STEP_2();
        },
        STEP_2 : () => {
            // 에러페이지 설정
            로그.info(">> Error init");
            const 에러핸들 = 오류페이지(설정.server_error);
            앱.use(오류페이지.httpError(404));
            앱.use(에러핸들);
            server.STEP_3();
        },
        STEP_3 : () => {
            // 앱 시작
            로그.info(">> Server Start");
            앱.listen(앱.get("port"), () => {
                로그.info("서버 시작 : http://127.0.0.1:" + 앱.get("port"));
            });
        },
        DB : (sql, paramMap, callback) => {
            var 풀 = 디비.createPool(설정.jdbc);
            풀.getConnection().then((conn) => {
                  conn.query(sql, paramMap).then((res) => {
                      conn.release();
                      //conn.end();
                      callback(null, res);
                  }).catch((err) => {
                      console.log(err);
                      conn.release();
                      //conn.end();
                      callback(err, null);
                  });
            }).catch((err) => {
                console.log(err);
                callback(err, null);
            });
        }
};

module.exports = server;
