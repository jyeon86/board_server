// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_info = require('./db_info');

var pool = mysql.createPool({
    host : db_info.getHost(),
    port : db_info.getPort(),
    user : db_info.getUser(),
    password : db_info.getPassword(),
    database : db_info.getDatabase(),
    connectionLimit : 20,
    waitForConnections : false
});

// join 웹페이지를 표시하는 미들웨어
router.get('/',function(req, res, next){
    res.render('join.ejs', {});
});

//회원정보를 전달받아서 데이터베이스에 저장하는 미들웨어
router.post('/', function(req, res, next){
    console.dir(req.body);//데이터잘들어가는지 출력해보기위해
    //웹페이지에 입력한 정보를 추출하여 매개변수를 선언하고 넣어줌
    var id = req.body.username;
    var password= req.body.password;
    var year= req.body.year;
    var month= req.body.month;
    var day= req.body.day;
    var gender= req.body.gender;
    var phone_number= req.body.phone_number;


// 서버와 데이터베이스를 연결
pool.getConnection(function(err, connection){
    
    if(err){
        //에러발생시 데이터베이스 연결을 해제한다.
        connection.release();
        //에러를 발생시킨다
        throw err;
    }
    //매개변수의 정보를 데이터베이스에 넣어줌
    var sql = "INSERT INTO user_info (id, password, gender, birth, phone_number, create_at, update_at)"+
    " VALUES('"+id+"', '"+password+"', '"+gender+"', '"+year+"-"+month+"-"+day+"', '"+phone_number+"', now(), now())";
    //데이터베이스에게 앞에서 작성한 sql문을 실행한다.
    console.log(sql);

    connection.query(sql, function(err, rows){
        //sql문을 실행할 때 에러가 발생할경우
        if(err){
            console.log("query Error");
            connection.release();
            throw err;
        }
        //
        //res.render('join_success', { login_id : id});
        res.redirect('http://localhost:3000');
        connection.release();
    })
});
});


module.exports = router;