const express = require('express');                 // express 모듈 받아오기
const ejs = require("ejs");                         // 뷰엔진 모듈 받아오기
const bodyParser = require("body-parser");          // body 객체 처리 모듈
const expressError = require("express-error-handler"); // express error 모듈 받아오기
const dirPath = require("path");                    // 경로 생성 모듈 받아오기
const session = require('express-session');         // session 모듈 받아오기
const log = require("./log.js");                    // log 모듈 받아오기
const commons = require("./commons");               // 공통 메세지 모듈
const db = require("./db");                         // 데이터베이스 연결프로그램 가져오기
const server_host = require("./config").server_host // express 사용할 호스트 값
const server_port = require("./config").server_port // express 사용할 포트 값
const error_info = require("./config").server_error // express 사용할 포트 값
const list = require("./config").route_list;        // 설정 모듈에서 목록 가져오기
const url = function(){
        log.info("URL 모듈 시작");
        const app = express();                      // 웹서비스 express 생성
        app.use(bodyParser.json());                 // for parsing application/json
        app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
        app.engine("html", ejs.renderFile);         // 뷰엔진 html : ejs 매핑 정의
        app.use(express.static(dirPath.join(__dirname, "../views"))); // 정적파일 경로 정의
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
          }));

        const router = express.Router();            // URL 패턴 Router 생성
        /*
        router.route("/").get(function(req, res){   // 기본 페이지 정의
            if(req.session.user){
                log.info("로그인 중..", req.session.user);
                res.redirect("/m15/");
                return;
            } else {
                commons.viewResult(req, res, "./index.html");
            }
        });
        */
        router.route("/login").post(function(req, res){
            var id = req.body.id;
            var password = req.body.password;
            var sql = "select * from u_users where id = ? and `password` = ?";
            db("GET", sql, [id, password]).then(function(rows){
                if(rows.rows.length > 0){
                    req.session.user = rows.rows[0];
                }
                commons.msgResult(res, rows, "msg0", "/m15/");
            });
        });
        router.route("/logout").get(function(req, res){
            req.session.destroy(function(error){
                if(error){
                    log.info(error);
                }
                commons.viewDirect(req, res, "/");
            });
        });

        for(var i = 0; i < list.length; i++){       // 동적 URL 매핑 시작 (반복문)
            var row = list[i];                      // 관리 대상 모듈 가져오기
            var rootPath = row.path;                // 접두사 주소 받아오기
            var mod = require(row.file);            // 함수 정의 목록 가져오기
            log.info("path:%s\tpage:%d", rootPath, mod.length);
            for(var r = 0; r < mod.length; r++){    // URL 조합하기 (반복문)
                var path = rootPath + mod[r].path;  // URL 주소 생성하기
                var type = mod[r].type;             // 통신방식 받아오기
                var callBack = mod[r].fun;          // 실행할 함수 받아오기
                //log.info("method:%s\tpath:%s", type, path);  // 주소 확인하기
                switch(type){
                    case "GET":                     // GET 방식일 경우 적용
                        router.route(path).get(callBack);
                        break;
                    case "POST":                    // POST 방식일 경우 적용
                        router.route(path).post(callBack);
                        break;
                    default:                        // 패턴에 없는 경우 예외처리
                        log.info("URL 패턴 오류", path);
                        break;
                }
            }
            log.info("");
        }
        app.use("/", router);                   // URL 정의 내용 express 적용하기
        const ErrorHandler = expressError(error_info);
        app.use(expressError.httpError(404));
        app.use(ErrorHandler);
        app.listen(server_port, function(){     // express 실행하여 대기상태 만들기
            log.info("서버 준비완료!!");
        });
    }
module.exports = url;