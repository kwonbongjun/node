var params = location.search.substr(1, location.search.length).split('?');
    params = decodeURI(params);
    params = params.split('&');
    var get_url = location.href.substr(0, location.href.length);
    if(get_url.indexOf('?') > 0) {
        get_url = location.href.substr(0, get_url.indexOf('?'))
    }
    var url = get_url;
    function get_data(params, index) {
        if(params == "") {
            return -1;
        } else {
            return params[index].substr(params[index].indexOf("=") + 1, params[index].length);
        }
    }
    var resSelect = [];
    function fn_select(query){
      $.ajax({
                url: '/api/get',
                dataType: 'json',
                type: 'GET',
                async:false,
                data: {data:query},
                success: function(result) {
                    if (result) {
                        // /console.log(result.result);
                        resSelect = result.result;
                    }
               }
            });
    }
    function btn_cancel(){
      location.href = "Main.html";
    }

  $(document).ready(function(){
    $("#aa").css("display","none");
    $("#bb").css("display","none");
    $("#cc").css("display","none");
    // &catelevel=2&catenm=원숭이&catecode=A1-01&price=15000&spec=30*30CM&unit=EA ->  중분류
    // &catelevel=3?catenm=원숭이눈&catecode=A1-01-01&price=2&availstock=20&spec=2*2&unit=EA
    console.log('test' ,get_data(params, 1));
    
    var catenm = get_data(params, 0);
    var catecode = get_data(params, 1);
    var price = get_data(params, 2);
    var spec = get_data(params, 3);
    var unit = get_data(params, 4);
    var catelevel = get_data(params, 5);
    
    console.log(catenm, catecode, price, spec, unit, catelevel)

    if(catelevel == 1){
      $("#aa").css("display","block");
    }
    else if(catelevel == 2){
      $("#bb").css("display","block");
      $("#midcatename").val(catenm);
      $("#midcatecode").val(catecode);
      $("#price").val(price);
      $("#spec").val(spec);
      $("#unit").val(unit);
    }
    else {
      $("#cc").css("display","block");
      var availstock = get_data(params, 6);
      $("#smallcatename").val(catenm);
      $("#smallcatecode").val(catecode);
      $("#smallcateavailstock").val(availstock);
      $("#smallcateprice").val(price);
      $("#smallcatespec").val(spec);
      $("#smallcateunit").val(unit);
    }
  });
  </script>

  <script>
  document.addEventListener('DOMContentLoaded', function() {
    var html = "";
    
    // 대분류
    html += '<option value=0>대분류</option>';
    fn_select('select catenm from o_categories where upper_catecode = "0"');
    for(var i = 0; i < resSelect.length; i++){
        html += '<option value='+(i+1)+'>'+ resSelect[i].catenm+'</option>';
    }
    $("#main_cate").append(html);
    
    // 중분류
    html = '<option value=0>중분류</option>';
    if()
    fn_select('select catenm from o_categories where upper_catecode = (select upper_catecode from o_categories where catenm = "' + get_data(params, 0) +'");');
    for(var i = 0; i < resSelect.length; i++){
        if( get_data(params, 0) == resSelect[i].catenm){
          
          console.log("aaaa");
        }
        html += '<option value='+(i+1)+'>'+ resSelect[i].catenm+'</option>';
    }
    $("#mid_cate").append(html);
    
    
    
    // 소분류
    html = '<option value=0>소분류</option>';
    fn_select('select catenm from o_categories where upper_catecode = (select catecode from o_categories where catenm = "' + get_data(params, 0) +'");');
    for(var i = 0; i < resSelect.length; i++){
        html += '<option value='+(i+1)+'>'+ resSelect[i].catenm+'</option>';
    }
    $("#small_cate").append(html);


    if($("#aa").css("display") == "block"){

    }
    else if($("#bb").css("display") == "block"){
      $('#mid_cate option:contains('+get_data(params, 0)+')').attr('selected', true);

    }
    else if($("#cc").css("display") == "block"){
      $('#small_cate option:contains('+get_data(params, 0)+')').attr('selected', true);
    }

  }, false);

