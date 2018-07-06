// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();
///////////////////////////////////////추가작업-읽어오도록명령할때 사용
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


router.get('/', function(req, res, next) {
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var sql= "SELECT * FROM my_board WHERE category = '회원';";

        var query = connection.query('select * from my_board WHERE category = "회원"; ', function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            if(req.session.user) {
                res.render('index', { rows : rows, is_logined : true, login_id : req.session.user.user_id });
                    
            } else {
                res.render('index', { rows : rows, is_logined : false, login_id : "" });   
            }

            connection.release();
            
        });
    });
  
});

router.get('/', function(req, res, next) {
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성

        var query = connection.query('select * from my_board', function(err, rows){ 

        if(err) {// sql문 작성시 에러가 발생할 경우
            connection.release();
            throw err;
        }
        //세션에 사용자 정보가 있는지 없는지에 따라 로그인 여부를 판단한다.
        if(req.session.user){
            //사용자 정보가 있는 경우
            //사용자가 로그인되어있는상태이고,index.ejs를 불러오는데
            //사용자 아이디(req.session.user.user_id)를 전달한다
            res.render('show_members', { rows : rows, is_logined : true, login_id : req.session.user.user_id });
        }else{
            //사용자 정보가 있는 경우
            //사용자가 로그인되어 있지 않은 상태이고, index.ejs를 표시하는데 로그인이 되어있지
            //않으므로, 사용자 아이디는 빈칸으로 보낸다.
            res.render('show_members', { rows : rows, is_logined : false, login_id : ""});
        }
        //index.ejs를 클라이언트 화면에 표시할때 데이터베이스 검색 결과인 rows도 같이 전달한다.
        connection.release();
        
        });
    });
  
});

module.exports = router;