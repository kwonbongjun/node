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

const server = {
        RUN : () => {
            // 앱 설정 하기.
            로그.info(">> Server init");
            앱.set("port", 설정.server_port);
            앱.set("views", 경로.join(__dirname, "../static"));
            앱.use(서버.static(경로.join(__dirname, "../static")));
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
                  res.render("./index2.html",{user : req.session.user});
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
                server.DB("select * from test.ex;", [], (err, resultList) => {
                  if(err){
                      res.redirect("/main");
                      return;
                  }
                  console.log(resultList);
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
                      conn.end();
                      callback(null, res);
                  }).catch((err) => {
                      console.log(err);
                      conn.end();
                      callback(err, null);
                  });
            }).catch((err) => {
                console.log(err);
                callback(err, null);
            });
        }
};

module.exports = server;
