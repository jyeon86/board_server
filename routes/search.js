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
                console.dir(rows);
                //데이터베이스에 검색한 결과물(rows)을 index.ejs에 전송한다.
                //index.ejs가 클라이언트에 출력됨
                res.render('index.ejs', {rows : rows }); //res라는 메소드?내에 render(대상파일, 데이터입력)
                connection.release();
            });
    });
});


module.exports = router;