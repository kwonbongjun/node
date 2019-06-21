/************************************************
 * npm install winston --save
 * npm install winston-daily-rotate-file --save
 * npm install moment --save
 ************************************************/
var winston = require("winston");
var winstonDaily = require("winston-daily-rotate-file");
var moment = require("moment");

function timeStampFormat(){
    return moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
}

var path = require("path").join(__dirname, "../logs/") + "server";
var logger = new (winston.Logger)({
    transports: [
        new (winstonDaily)({
            name:"info-file",
            filename:path,
            datePattern:"_yyyy-MM-dd.log",
            colorize:false,
            maxsize:10000,
            maxFiles:10,
            level:"info",
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        }),
        new (winston.transports.Console)({
            name:"debug-console",
            colorize:true,
            level:"debug",
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        })
    ]
});

module.exports = logger;

//logger.debug("디버깅 메시지 입니다.");
//logger.error("에러 메시지 입니다.");
