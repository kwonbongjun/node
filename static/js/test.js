$(document).ready(function(){
  var toDate = new Date();
  var searchYear = toDate.getFullYear();
  var searchMonth = toDate.getMonth() + 1;
  var searchDay = toDate.getDate();
  var choiceYear = searchYear;
  var choiceToYear = searchYear;
  var choiceMonth = searchMonth;
  var choiceToMonth = searchMonth;
  var choiceDay = 0;
  var lv = 0;
  var pagingCheckIndex = 1;
  var calendarMonthDataSource = [];

  // 날짝선택 버튼 클릭시
  $(".btn_calendar").click(function(){
    if($(".calendar_wrap").attr("class").indexOf("dn") > -1) {
      $(".calendar_wrap").removeClass("dn");
      yearData();
      yearMonthEvent(0);
    } else {
      $(".calendar_wrap").addClass("dn");
    }

  });

  // 달력 선택
  $(".calendar_wrap .tab_menu li").click(function(){
    var index = $(".calendar_wrap .tab_menu li").index(this);
    $(".calendar_contents").addClass("dn");
    $(".calendar_wrap .tab_menu li").removeClass("on");
    $(this).addClass("on");
    $(".calendar_contents").eq(index).removeClass("dn");
    if(index == 0){
      yearData();
    } else {
      yearMonthDayData();
    }
  });

  /*******************************
   * 달력 연도 이벤트
   *******************************/
  function dateYearEvent(position){
    lv = 0;
    pagingCheckIndex = 1;
    if(position == 'prev'){
      choiceYear = choiceYear - 1;
    }else if(position == 'next'){
      choiceYear = choiceYear + 1;
    }
  };

  /*******************************
   * 달력 연도 + 월 이벤트
   *******************************/
  function dateYearMonthEvent(position){
    lv = 0;
    pagingCheckIndex = 1;
    if(position == 'prev'){
      if(choiceMonth == 1){
        choiceYear = choiceYear - 1;
        choiceMonth = 12;
      }else {
        choiceMonth = choiceMonth - 1;
      }
    }else if(position == 'next'){
      if(choiceMonth == 12){
        choiceYear = choiceYear + 1;
        choiceMonth = 1;
      }else {
        choiceMonth = choiceMonth + 1;
      }
    }
    yearMonthDayData();
  };

  /*******************************
   * 달력 월 이벤트
   *******************************/
  function dateMonthEvent(month){
    choiceMonth = month;
    choiceToYear = choiceYear;
    lv = 0;
    pagingCheckIndex = 1;
    $(".calendar_wrap").hide();
  };

  /*******************************
   * 달력 연도 + 월 화면 생성
   *******************************/
  function yearMonthEvent(type){
    var header = "";
    if(type == 0){
      header = choiceYear + "년";
    } else {
      header = choiceYear + "년 " + choiceMonth + "월";
    }
    $(".calendar_header").text(header);
  }

  /*******************************
   * 달력 연도 + 월 데이터 및 화면 생성
   *******************************/
  function yearData(){
    var calendar = "";
    for(var i = 1; i <= 12; i++){
		  if(choiceYear >= toDate.getFullYear() && choiceMonth >= i){
        calendar += '<li><a href="javascript:alert(' + i + ');">' + i + '월</a></li>';
		  }else{
        calendar += '<li><span>' + i + '월</span></li>';
		  }
	  }
    $("#calendar_month").empty().html(calendar);
  }

  /*******************************
   * 달력 연도 + 월 + 일 데이터 및 화면 생성
   *******************************/
  function yearMonthDayData(){
    /* 현재 날짜와 현재 달에 1일의 날짜 객체를 생성합니다. */
    var sy = searchYear; // 현재 연도
    var sm = searchMonth; // 현재 월
    var sd = searchDay; // 현재 일
    var cy = choiceYear; // 보여지는 연도
    var cty = choiceToYear; // 선택한 연도 저장
    var cm = choiceMonth - 1; // 보여지는 월
    var ctm = choiceToMonth - 1; // 선택한 월
    var cd = choiceDay; // 선택한 일
    // 현재 년(y)월(m)의 1일(1)의 요일을 구합니다.
    var theDate = new Date(cy,cm,1);
    // 선택한 날의 요일은?
    var theDay = theDate.getDay();
    /* 현재 월의 마지막 일을 구합니다. */
    // 1월부터 12월까지의 마지막 일을 배열로 만듭니다.
    var last = []; //[31,28,31,30,31,30,31,31,30,31,30,31];
    for(var lastDay = 1; lastDay <= 12; lastDay++){
      var ld = new Date(cy, lastDay, 0);
      last.push(ld.getDate());
    }
    // 현재 월의 마지막 일이 며칠인지 구합니다.
    var lastDate = last[cm];
    /* 현재 월의 달력에 필요한 행의 개수를 구합니다. */
    // theDay(빈 칸의 수), lastDate(월의 전체 일수)
    var row = Math.ceil((theDay+lastDate)/7);
    // 달력에 표기되는 일의 초기값!
    var dNum = 1;
    var ndNum = 1;
    var pdNum = 0;
    var calendar = "";
    if(cm == 0){
      pdNum = 32 - theDay;
    }else {
      pdNum = (last[cm-1] + 1) - theDay;
    }
    for (var i=1; i<=row; i++) { // 행 만들기
        calendar += "<tr>";
        for (var k=1; k<=7; k++) { // 열 만들기
            // 월1일 이전 + 월마지막일 이후 = 빈 칸으로!
          if(i===1 && k<=theDay) {
                calendar += "<td><a class='before'>" + pdNum + "</a></td>";
                pdNum++;
//		              calendar += "<td></td>";
          }else if(dNum>lastDate) {
            calendar += "<td><a class='before'>" + ndNum + "</a></td>";
            ndNum++;
//		    	  }else if(i===1 && k<=theDay || dNum>lastDate) {
//		              calendar += "<td><a href='' class='before'></a></td>";
//		              calendar += "<td></td>";
            } else {
              if(dNum == sd && sy == cy && sm == cm + 1){
                calendar += "<td><a href=\"javascript:alert(" + dNum + ");\" class='today'>" + dNum + "</a></td>";
              }else if(dNum == cd  && cty == cy && ctm + 1 == cm + 1){
                calendar += "<td><a href=\"javascript:alert(" + dNum + ");\" class='choice'>" + dNum + "</a></td>";
              }else{
                calendar += "<td><a href=\"javascript:alert(" + dNum + ");\">" + dNum + "</a></td>";
              }
                dNum++;
            }
        }
        calendar += "</tr>";
    }

    $("#calendar_day").empty().html(calendar);
  };

  function calendarDayEvent(day){
    console.log(day);
    choiceDay = day;
    yearMonthDayData();
  }
});
