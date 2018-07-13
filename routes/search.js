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


//검색할 조건과 키워드를 받으면 검색하여 표시해주는 미들웨어
router.post('/',function(req,res,next){
    //클라이언트로부터 검색 할 조건과 키워드를 입력받음
    var type = req.body.searchTypeInput;
    var keyword = req.body.keywordInput;

    //데이터베이스에 겁색을 위해 서버에서 데이터베이스와 연결함
    pool.getConnection(function(err,connection){
        if(err) {
            console.log("getConnection Error");
            throw err;
        }
/*
    var sql_title = "SELECT * FROM my_board WHERE title like '% " + keyword + "%'";
*/

        //공통sql문 초기화 문장 입력
        var sql = 'SELECT * FROM my_board WHERE ';

        switch(type){
            case 'title'://제목으로검색
                sql+="title like '%" + keyword + "%';";

            break;
            
            case 'name'://이름으로검색
                sql= sql + "name like '%" + keyword + "%';";

            break;
            
            case '_idx'://번호로검색
                sql= sql + "_idx=" + keyword +";";

            break;
         } console.log(sql);

            //데이터베이스에서 검색함, 에러는 err에, 검색결과는rows(임의변수)에 저장됨
            var query = connection.query(sql, function(err, rows){
                //에러가 발생시 동작한다.
                if(err) {
                    console.log("query Error");
                    connection.release();
                    throw err;
                }

                if(req.session.user){
                    //사용자 정보가 있는 경우
                    //사용자가 로그인되어있는상태이고,index.ejs를 불러오는데
                    //사용자 아이디(req.session.user.user_id)를 전달한다
                    res.render('index', { rows : rows, is_logined : true, login_id : req.session.user.user_id });
                }else{
                    //사용자 정보가 있는 경우
                    //사용자가 로그인되어 있지 않은 상태이고, index.ejs를 표시하는데 로그인이 되어있지
                    //않으므로, 사용자 아이디는 빈칸으로 보낸다.
                    res.render('index', { rows : rows, is_logined : false, login_id : ""});
                }
                //index.ejs를 클라이언트 화면에 표시할때 데이터베이스 검색 결과인 rows도 같이 전달한다.
                connection.release();
            });
    });
});


module.exports = router;