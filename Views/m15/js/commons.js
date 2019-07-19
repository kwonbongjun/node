function fNet(url, type, data, callback){
    $.ajax({url: url, type: type, data: data}).done(callback);
}

function fSet(data) {
    if(data.state) {
        alert(data.text);
        location.href = data.url;
    } else {
        alert(data.text);
    }
}
