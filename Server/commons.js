const log = require("./log.js");    // log 모듈 받아오기
const msg = {
    msgList : {
        msg0: ["", "데이터 가져 오는 중 오류 발생!"],
        msg1: ["저장 완료!", "저장 중 오류 발생!"],
        msg2: ["수정 완료!", "수정 중 오류 발생!"],
        msg3: ["삭제 완료!", "삭제 중 오류 발생!"]
    },
    msgResult : function(res, rows, msgCode, url){
        if(rows.state){
            if(url) rows.url = url;
            rows.text = msg.msgList[msgCode][0];
        } else {
            rows.text = msg.msgList[msgCode][1];
        }
        //log.info(rows);
        res.json(rows);
    },
    viewResult : function(req, res, url, type){
        try {
            if(type == "C"){
                res.render(url);
                return;
            }
            if(req.session.user){
                log.info("로그인 중..", url);
                res.render(url);
                return;
            } else {
                res.redirect("/");
            }
        } catch (error) {
            res.redirect("/");
        }
    },
    viewDirect : function(req, res, url){
        try {
            if(req.session.user){
                log.info("로그인 중..", url);
            }
        } catch (error) {
            url = "/";
        } finally {
            //log.info(url);
            res.redirect(url);
        }     
    }
}
module.exports = msg;