const express = require('express');                 // express 모듈 받아오기
const ejs = require("ejs");                         // 뷰엔진 모듈 받아오기
const bodyParser = require("body-parser");          // body 객체 처리 모듈
const dirPath = require("path");                    // 경로 생성 모듈 받아오기
const session = require('express-session');         // session 모듈 받아오기
const server_host = require("./config").server_host // express 사용할 호스트 값
const server_port = require("./config").server_port // express 사용할 포트 값
const list = require("./config").route_list;        // 설정 모듈에서 목록 가져오기
const url = function(){
        console.log("URL 모듈 시작");
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
        router.route("/").get(function(req, res){   // 기본 페이지 정의
            res.render("./index.html");
        });
        for(var i = 0; i < list.length; i++){       // 동적 URL 매핑 시작 (반복문)
            var row = list[i];                      // 관리 대상 모듈 가져오기
            var rootPath = row.path;                // 접두사 주소 받아오기
            var mod = require(row.file);            // 함수 정의 목록 가져오기
            console.log("path:%s\tpage:%d", rootPath, mod.length);
            for(var r = 0; r < mod.length; r++){    // URL 조합하기 (반복문)
                var path = rootPath + mod[r].path;  // URL 주소 생성하기
                var type = mod[r].type;             // 통신방식 받아오기
                var callBack = mod[r].fun;          // 실행할 함수 받아오기
                console.log("method:%s\tpath:%s", type, path);  // 주소 확인하기
                switch(type){
                    case "GET":                     // GET 방식일 경우 적용
                        router.route(path).get(callBack);
                        break;
                    case "POST":                    // POST 방식일 경우 적용
                        router.route(path).post(callBack);
                        break;
                    default:                        // 패턴에 없는 경우 예외처리
                        console.log("URL 패턴 오류", path);
                        break;
                }
            }
            console.log();
        }
        app.use('/', router);                       // URL 정의 내용 express 적용하기
        app.listen(server_port, function(){     // express 실행하여 대기상태 만들기
            console.log("서버 준비완료!!");
        });
    }
module.exports = url;