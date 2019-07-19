var optionbox;

function maincate(){
    fNet("/m1/select/main", "POST", {}, function(data){
        var rows = data.rows;
        if(!data.state){
          alert("Loading Failed");
        } else {
          optionbox ="<option value=0>추가</option>";
          for(var i = 0; i < rows.length; i++){
            optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
          }
          $("#main_cate").empty().append(optionbox);
        }
      });
}
function midcate(key){
    fNet("/m1/select/mid", "POST", key, function(data){
        var rows = data.rows;
        if(!data.state){
            alert("Loading Failed");
        } else {
            optionbox ="<option value=0>추가</option>";
            for(var i = 0; i < rows.length; i++){
                optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
            }
            $("#mid_cate").empty().append(optionbox);
        }
    }); 
}
function smallcate(key){
    fNet("/m1/select/small", "POST", key, function(data){
        var rows = data.rows;
        $("#data_table").empty();
        optionbox ="<option value=0>추가</option>";
        for(var i = 0; i < rows.length; i++){
            optionbox += '<option value='+(i+1)+'>'+rows[i].catenm+'</option>';
        }
        $("#small_cate").empty().append(optionbox);
    });
}