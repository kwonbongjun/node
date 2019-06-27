var fs = require('fs');
var dir = require("path").join(__dirname, "../modules");
var files = fs.readdirSync(dir).sort((a, b) => {
    return a.substring(1) - b.substring(1);
});
var 모듈 = [];
for(var i = 0; i < files.length; i++){
  var path = require("path").join(dir, files[i]);
  var dirs = fs.readdirSync(path);
  var cnt = {};
  for(var j = 0; j < dirs.length; j++){
    var subPath = require("path").join(path, dirs[j]);
    var list = fs.readdirSync(subPath);
    cnt[dirs[j]] = list.length;
  }
  var 설정 = {
    no : files[i],
    path : path,
    cnt : cnt
  };
  모듈[모듈.length] = 설정;
}
//console.log(모듈);

var test = require("path").join(모듈[0].path, 'controller');
var f = fs.readdirSync(test);
for(var x = 0; x < f.length; x++){
  var ml = require(require("path").join(test, f[x]));
  console.log(ml.length, Array.isArray(ml));
  if(Array.isArray(ml)){
    console.log(ml);
    for(var ii = 0; ii < ml.length; ii++){
      console.log(ml[ii].path);
    }
  }
}
