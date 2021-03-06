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
/* GET home page. */
// 미들웨어 부분
// 주소를 localhost:3000/으로 접속한 경우, index.ejs파일을 웹브라우저에 출력해준다.
// 이때 전달할 데이터를 담은 객체도 같이 보낸다,
// title >> 키
// 'Express' >> 값
//localhost:3000/read/3
//3값이 변수 idx에 들어간다.



router.get('/:idx', function(req, res, next) {
  var idx = req.params.idx; //req객체에저장된 웸페이지주소 레퍼런스값을 가져옴.
  console.log(idx);
  // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴

  pool.getConnection(function(err, connection) {
      // 데이터 베이스에서 실행시킬 sql문(query)을 작성
      var sql ='DELETE from my_board where _idx = '+ idx;
      console.log(sql);

      var query = connection.query(sql, function(err, rows) {
        if(err) {// sql문 작성시 에러가 발생할 경우
            connection.release();
            throw err;
        }
          //index.ejs를 클라이언트 화면에 표시할때 데이터베이스 검색 결과인 rows도 같이 전달한다.
          res.redirect("http://localhost:3000");
          connection.release();
          
      });
    }); 
  });

module.exports = router;



router.post('/', function(req, res, next) {
    var idx = req.body.idx; //req객체에저장된 웸페이지주소 레퍼런스값을 가져옴.
  
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        if(err) {// sql문 작성시 에러가 발생할 경우
            console.log("getConnection Error");
            throw err;
        }        
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var sql ="DELETE from my_board where _idx = "+ idx;
        var query = connection.query(sql, function(err, rows) {
        if(err) {
            console.log("query Error");
            connecton.release();
            throw err;
        }
        res.redirect('http://localhost:3000');
        connection.release();
                
        });
    });
});

