// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();

///
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
/* GET home page. */
// 미들웨어 부분
// 주소를 localhost:3000/으로 접속한 경우, index.ejs파일을 웹브라우저에 출력해준다.
// 이때 전달할 데이터를 담은 객체도 같이 보낸다,
// title >> 키
// 'Express' >> 값
//localhost:3000/read/3
//3값이 변수 idx에 들어간다.

router.get('/',function(req, res, next){
    res.render('login.ejs', {});
});
//사용자에게 전달받은 아이디 비밀번호를 데이터베이스에서 검색하고 
//로그인처리를 해주는 미들웨어
 
router.post('/', function(req, res, next){
    //변수에저장
    var id = req.body.id;
    var password = req.body.password;
    //로그인정보가 서버의 세션에 req.session.user 객체로 저장이 된다.
    if(!req.session.user){//세션에 로그인정보가 객체로 존재하지 않으면(!)
        pool.getConnection(function(err, connection){//서버와 데이터베이스를 연결
            //데이터베이스에 질의할 sql문 작성
            var sql ="SELECT * FROM `world`.`user_info` WHERE id = '"+id+"' AND password = '"+password+"';";
            console.log(sql);
            //쿼리에 SQL문으로 검색질의
            var query= connection.query(sql, function(err, rows){
                if(err){
                    connection.release();
                    throw err;
                }
                console.dir(rows);

                if(rows.length == 0){//입력한 자료와 일치하는 자료가 없을 경우
                    res.redirect("http://localhost:3000/login")
                }else if(rows.length == 1){
                    //로그인해줄경우
                    //로그인한 정보를 세션 객체 저장한다.
                    //로그인이 되어있으면 (req.session.user)에 아이디 정보가 있고,
                    //로그인이 되어있지 않으면 세션 객체에 아이디 정보가 없다.
                    req.session.user = {id : id};
                    res.redirect('http://localhost:3000');
                }else{//사용자에게 에러처리를 해야합니다.
                }
                connection.release();
            });
        });
    }
});

module.exports = router;
