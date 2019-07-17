const m = [];

m[0] = {                        // 모듈 리스트에 넣기
    path: "/test",             // URL 주소 정의
    type: "GET",                // 통신 방식 정의
    fun: function(req, res){    // 실행 내용 정의
        res.render("./m1/test.html");
    }
}

module.exports = m;