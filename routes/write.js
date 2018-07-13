// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_info = require('./db_info');
//업로드 관련 코드 시작.
var multer = require('multer');//  multer(업로드 모듈)를 로드
// 저장할 파일의 위치, 파일 이름 등을 설정하는 부분
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '../public/uploads/') //cb 콜백 함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)//cb 콜백 함수를 통해 전송된 파일 이름 설정
  }
});
// upload객체를 만들어서 실제로 파일 업로드 기능을 수행
var upload = multer({ storage: storage });

//업로드 관련 코드 끝.

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
  res.render('write', { title: 'Express' });
});

router.post('/', upload.single("myFile"), function(req, res, next) {
  //클라이언트로부터 받은 데이터들
  var title = req.body.titleInput;
  var name = req.body.nameInput;
  var contents = req.body.contentsInput;
  var category = req.body.categoryInput;
  var noti = req.body.noti;

  console.log(title, contents, category);
  //데이터서비스와 서버가 연결되기 시작
  pool.getConnection(function(err, connection) {
    //데이터베이스와 서버가 연결될 때 에러가 발생하면 실행되는 부분이다.
    if(err) {
      console.log("getConnection Error");
      throw err;
    }
    /** var sql = "INSERT INTO my_board (title, name, category,"+
    " contents, update_at, create_at) VALUES "+"('"+title+"', '"+
    name+"', '"+category+"', '"+contents+"',"+
    "now(), now())";
 */
  var sql = "INSERT INTO my_board (title, name, category,"+
    " contents, update_at, create_at, noti) VALUES "+"('"+title+"', '"+
    name+"', '"+category+"', '"+contents+"',"+
    "now(), now(), '"+noti+"');";//공지글체크인식하도록 수정
   console.log(sql);
    var query = connection.query(sql, function(err, rows) {
      if(err){
        console.log("query Error");
        connection.release();
        throw err;
      }
      res.redirect('http://localhost:3000/');
      connection.release();
    });
  });
});

module.exports = router;