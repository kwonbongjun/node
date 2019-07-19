$(document).ready(function(){
  var catelevel = 0;
  //$('#mid_cate').attr('disabled', 'true');
  //$('#mid_cate').css('background-color', 'gray');
  //$('#small_cate').attr('disabled', 'true');
  //$('#small_cate').css('background-color', 'gray'); 
  
  //대분류 -> Page Load 대분류 항목 리스트업
  function init(){
    fNet("/m1/select/main", "POST", {}, function(data){
      var rows = data.rows;
      if(!data.state){
        alert("Loading Failed");
      }
      else{
        var html = "";
        var optionbox ="<option value=0>대분류</option>";
        html = '<thead style="background-color: black; color: white">';
        html +='<tr>'
        html +='<th>No</th>'
        html +='<th>품명</th>';
        html +='<th>품목코드</th>';
        html += '</tr>';
        html +=' </thead>';
        for(var i = 0; i < rows.length; i++){
          html += '<tr><td>'+ (i+1) +'</td>';
          html += '<td class="list1">'+rows[i].catenm+'</td>';
          optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
          html += '<td>'+rows[i].catecode+'</td></tr>';
        }
        $("#main_cate").empty().append(optionbox);
        $("#data_table").empty().append(html);
        catelevel = 1;
      }
    });
  }
  init();

  //중분류
  $("#main_cate").change(function(e){
    if($("#main_cate Option:selected").val() != 0){
      var key ={
        "key" : $("#main_cate Option:selected").text()
      };
      midCateList(key);
      catelevel = 2;
    }else{
      init();
      $('#mid_cate').empty();
      $('#small_cate').empty();
      catelevel = 1;
    }
  });
  //소분류
  $('#mid_cate').change(function(e){
    if($("#mid_cate Option:selected").val() != 0){
      var key ={
          "key" : $("#mid_cate Option:selected").text()
      };
      smallCateList(key);
      catelevel = 3;
    }else{
      var key ={
        "key" : $("#main_cate Option:selected").text()
      };  
      midCateList(key);
      $('#small_cate').empty();
      catelevel = 2;
    }
  });

  // 중분류 리스트
function midCateList(key){
  var optionbox, html;
  optionbox ="<option value=0>중분류</option>";
  html = '<thead style="background-color: black; color: white">';
  html +='<tr>'
  html +='<th>No</th>'
  html +='<th>품명</th>';
  html +='<th>품목코드</th>';
  html +='<th>금액</th>';
  html +='<th>규격</th>';
  html +='<th>단위</th>';
  html += '</tr>';
  html +=' </thead>';
  fNet("/m1/select/mid", "POST", key, function(data){
    var rows = data.rows;
    if(!data.state){
      alert("Loading Failed");
    }
    else{
      for(var i = 0; i < rows.length; i++){
        html += '<tr class="mybtn"><td>'+ (i+1) +'</td>';
        html += '<td class="list1">'+rows[i].catenm+'</td>';
        optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
        html += '<td>'+rows[i].catecode+'</td>';
        html += '<td>'+rows[i].price+'</td>';
        html += '<td>'+rows[i].spec+'</td>';
        html += '<td>'+rows[i].unit+'</td></tr>';
      }
      html += '</tbody>';
      $("#mid_cate").empty().append(optionbox);
      $("#data_table").empty().append(html);
      mm();
    }      
  }); 
}
//소분류 리스트
function smallCateList(key){
  fNet("/m1/select/small", "POST", key, function(data){
      var rows = data.rows;
      $("#data_table").empty();
      optionbox ="<option value=0>소분류</option>";
      html = '<thead style="background-color: black; color: white">';
      html +='<tr>'
      html +='<th>No</th>'
      html +='<th>품명</th>';
      html +='<th>품목코드</th>';
      html +='<th>소요수량</th>';
      html +='<th>금액</th>';
      html +='<th>규격</th>';
      html +='<th>단위</th>';
      html += '</tr>';
      html +=' </thead>';
      for(var i = 0; i < rows.length; i++){
          html += '<tr class="mybtn"><td>'+ (i+1) +'</td>';
          html += '<td>'+rows[i].catenm+'</td>';
          optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
          html += '<td>'+rows[i].catecode+'</td>';
          html += '<td>'+rows[i].availstock+'</td>';
          html += '<td>'+rows[i].price+'</td>';
          html += '<td>'+rows[i].spec+'</td>';
          html += '<td>'+rows[i].unit+'</td></tr>';
      }
      $("#small_cate").empty().append(optionbox);
      $("#data_table").empty().append(html);
  });
}

function mm(){
  $('.mybtn').off().on("click", function(){
    //modal Form Load
    /*
    * [ catelevel ]
    * 2 : 중분류 항목 자세히보기
    * 3 : 소분류 항목 자세히보기
    */
    var tr = $(this);
    var td = tr.children();
    
    //console.log(catelevel);
    if(catelevel == 2){
      $("span[name=detail_index]").text(td.eq(0).text());
      $("span[name=detail_catename]").text(td.eq(1).text());
      $("span[name=detail_catecode]").text(td.eq(2).text());
      $("span[name=detail_availstock]").text(td.eq(3).text());
      $("span[name=detail_reqstock]").text("없음");
      $("span[name=detail_spec]").text(td.eq(4).text());
      $("span[name=detail_unit]").text(td.eq(5).text());
    }else if(catelevel == 3){
      $("span[name=detail_index]").text(td.eq(0).text());
      $("span[name=detail_catename]").text(td.eq(1).text());
      $("span[name=detail_catecode]").text(td.eq(2).text());
      $("span[name=detail_reqstock]").text(td.eq(3).text());
      $("span[name=detail_availstock]").text(td.eq(4).text());
      $("span[name=detail_spec]").text(td.eq(5).text());
      $("span[name=detail_unit]").text(td.eq(6).text());
    }

    $("#myModal").show();

    $(".close").off().on("click", function(){
        $("#myModal").hide();
    });
    $(".update").on("click", function(){
      // 소분류 항목 클릭 후, 수정페이지
      var param ="";
      
      if( catelevel == 1 ){
        param = '?catelevel='+catelevel;
        param += '&catenm='+td.eq(1).text();
        param += '&catecode='+td.eq(2).text();  
      } else if( catelevel == 2 ){
        param = '?catelevel='+catelevel;
        param += '&catenm='+td.eq(1).text();
        param += '&catecode='+td.eq(2).text();
        param += '&price='+ td.eq(3).text();
        param += '&spec='+ td.eq(4).text();
        param += '&unit='+ td.eq(5).text();
      } else if( catelevel == 3 ){
        param = '?catelevel='+catelevel;
        param += '&catenm='+td.eq(1).text();
        param += '&catecode='+td.eq(2).text();
        param += '&availstock='+td.eq(3).text();
        param += '&price='+ td.eq(4).text();
        param += '&spec='+ td.eq(5).text();
        param += '&unit='+ td.eq(6).text();
      }
      encodeURI(encodeURIComponent(param));
      location.href = './bomupdate'+param;
    });
  });    
  } 

   
});


