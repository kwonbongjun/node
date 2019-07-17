const msg = {
    msgList : {
        msg0: ["", "데이터 가져 오는 중 오류 발생!"],
        msg1: ["저장 완료!", "저장 중 오류 발생!"],
        msg2: ["수정 완료!", "수정 중 오류 발생!"]
    },
    msgResult : function(res, rows, msgCode, url){
        if(rows.state){
            if(url) rows.url = url;
            rows.text = msg.msgList[msgCode][0];
        } else {
            rows.text = msg.msgList[msgCode][1];
        }
        res.json(rows);
    },
    viewResult : function(req, res, url){
        if(req.session.user){
            res.render(url);
        } else {
            res.redirect("/");
        }
    }
}
module.exports = msg;