// function ajax_read(){$.ajax({
//   type: 'GET',
//   url: '/M11/DB',
//   dataType: 'json'
// }).
// done(function(data){
//   datalist_1 = data;
//   // console.log("ok", datalist_1);
// }).
// fail(function(err){console.log("no", err);});};
// ajax_read();

fNet("/M11/DB", "GET", {}, function(data) {
  if(data.state) {
    datalist_1 = data.rows;
    console.log('data 받아옴');
  } else {
    console.log("data 오류");
  }
})

function attitude(data_top, data_bottom){
    var data_box = datalist_1;
    var box_1 = [];
    var time_box_top = [];
    var time_box_bottom = [];
    var YDM_select_top = data_top;
    var YDM_select_bottom = data_bottom;
    var gender_female = 0,
        gender_male = 0,
        age_20 = 0,
        age_30 = 0,
        age_40 = 0,
        age_50 = 0,
        education_1 = 0,
        education_2 =0,
        education_3 =0,
        education_4 =0,
        department_0 =0,
        department_1 =0,
        department_2 =0,
        department_3 =0,
        department_4 =0,
        department_5 =0,
        department_6 =0;
        reset_box_top = 0;
        reset_box_bottom = 0;
        percentage_top = 0;
        percentage_bottom = 0;

        console.log("YDM_select_top", YDM_select_top);
        console.log("YDM_select_bottom", YDM_select_bottom);


        for(var i = 0; i<data_box.length; i++){
          var time_check = data_box[i].time.substring(0,4)
          if(time_check == YDM_select_top){
          time_box_top.push(data_box[i]);
          }
          if(time_check == YDM_select_bottom){
          time_box_bottom.push(data_box[i]);
          }
        }
        reset_box_top = time_box_top.length/18;
        reset_box_bottom = time_box_bottom.length/18;

        percentage_top = reset_box_top;
        percentage_bottom = reset_box_bottom;
        
        for(var j = 0; j < time_box_top.length; j++){
          switch(time_box_top[j].gender_flag){
            case 0 : 
            gender_female += time_box_top[j].attended_flag;
            break;
            case 1 : 
            gender_male += time_box_top[j].attended_flag;
            break;
          }
        }
        percentage_top = (gender_female/(percentage_top*6))*100+"%";
        $(".gender_female_top").text(percentage_top.substring(0,5));
        percentage_top = reset_box_top
        percentage_top = (gender_male/(percentage_top*12))*100+"%";
        $(".gender_male_top").text(percentage_top.substring(0,5));
        
        
        percentage_bottom = (gender_female/(percentage_bottom*6))*100+"%";
        $(".gender_female_bottom").text(percentage_bottom.substring(0,5));
        percentage_bottom = reset_box_bottom
        percentage_bottom = (gender_male/(percentage_bottom*12))*100+"%";
        $(".gender_male_bottom").text(percentage_bottom.substring(0,5));

        for(var j = 0; j < time_box_top.length; j++){
          switch(time_box_top[j].age_flag){
            case 0 :
            age_20 += time_box_top[j].attended_flag;
            break;
            case 1 :
            age_30 += time_box_top[j].attended_flag;
            break;
            case 2 :
            age_40 += time_box_top[j].attended_flag;
            break;
            case 3 :
            age_50 += time_box_top[j].attended_flag;
            break;
          }
        }
        for(var j = 0; j < time_box_top.length; j++){
          switch(time_box_top[j].education_flag){
            case 0 :
            education_1 += time_box_top[j].attended_flag;
            break;
            case 1 :
            education_2 += time_box_top[j].attended_flag;
            break;
            case 2 :
            education_3 += time_box_top[j].attended_flag;
            break;
            case 3 :
            education_4 += time_box_top[j].attended_flag;
            break;
          }
        }
        for(var j = 0; j < time_box_top.length; j++){
          switch(time_box_top[j].department_flag){
            case 0 :
            department_0 += time_box_top[j].attended_flag;
            break;
            case 1 :
            department_1 += time_box_top[j].attended_flag;
            break;
            case 2 :
            department_2 += time_box_top[j].attended_flag;
            break;
            case 3 :
            department_3 += time_box_top[j].attended_flag;
            break;
            case 4 :
            department_4 += time_box_top[j].attended_flag;
            break;
            case 5 :
            department_5 += time_box_top[j].attended_flag;
            break;
            case 6 :
            department_6 += time_box_top[j].attended_flag;
            break;
          }
        }
    }