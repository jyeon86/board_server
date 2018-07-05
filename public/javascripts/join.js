var formTag = document.getElementById('formTag');
formTag.onsubmit = function(){
    //id가 usr인 객체를 가져와서 그 객체의 value를 id에 저장
    var id = document.getElementById('usr').value;
    var pwd = document.getElementById('pwd').value;
    var pwdConfirm = document.getElementById('pwdConfirm').value;
    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    var day = parseInt(document.getElementById('day').value);
    var number = document.getElementById('number').value;
    
    var inforId = document.getElementById('inforId');
    var inforPwd = document.getElementById('inforPwd');
    var inforPwdConfirm = document.getElementById('inforPwdConfirm');
    var inforBirth = document.getElementById('inforBirth');
    var inforNumber = document.getElementById('inforNumber');
    
    var isOk = true;
    

    //id의 길이가 0이면
    if(!checkValidId(id)){
        isOk = false;
    }
    if(!checkValidPwd(pwd)){
        isOk = false;
    }
    if(!checkValidPwdcfm(pwdConfirm)){
        isOk = false;
    }
    if(!checkValidBirth()){
        isOk = false;
    }
    if(!checkValidNumber(number)){
        isOk = false;
    }
    if(!isOk)
        return false;
}
function maxDay(month){
    switch(month){
        case '1': case '3': case '5': case '7': case '8': case '10': case '12':
            return 31;
        case '2':
            return 28;
        default:
            return 30;
    }
}
/* ID의 유효성을 검사 */
function checkValidId(id){
    var idRegex = /w{1,9}$/;
   // var idRegex = /^[a-zA-Z]\w{1,9}$/; //첫글자영어로시작
    var inforId = document.getElementById('inforId');

    inforId.style.display = 'none';
    if(id.length == 0 || !idRegex.test(id)){
        inforId.style.display = 'block';
        return false;
    }
    return true;
}

function checkValidPwd(pwd){
    var pwdRegex = /^(?=\w{1,20}$)\w*(\d[A-z]|[A-z]\d)\w*$/;
    var inforPwd = document.getElementById('inforPwd');

    inforPwd.style.display = 'none';
    if(pwd.length == 0 || !pwdRegex.test(pwd)){
        inforPwd.style.display = 'block';
        return false;
    }
    return true;
}

function checkValidPwdcfm(pwdConfirm){
    var inforPwdConfirm = document.getElementById('inforPwdConfirm');
    var pwd = document.getElementById('pwd').value;
    var pwdConfirm = document.getElementById('pwdConfirm').value;
    
    inforPwdConfirm.style.display = 'none';

    if(pwd != pwdConfirm){
        inforPwdConfirm.style.display = 'block';
        return false;
    }
    return true;
}

function checkValidBirth(){
    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    var day = parseInt(document.getElementById('day').value);
    var inforBirth = document.getElementById('inforBirth');

    inforBirth.style.display = 'none';
    var max = maxDay(month);

    if(year.length != 4){
            inforBirth.innerHTML = '태어난 년도 4자리를 정확하게 입력하세요.';
            inforBirth.style.display = 'block';
        return false;
    }else if(isNaN(parseInt(month))){
            inforBirth.innerHTML = '태어난 월을 선택하세요.';
            inforBirth.style.display = 'block';
        return false;
    }else if(isNaN(day) || day < 1 || day > max){
        inforBirth.innerHTML = '태어난 일(날짜) 2자리를 정확하게 입력하세요.';
        inforBirth.style.display = 'block';
        return false;
    }
    return true;
}
function checkValidNumber(number){
    var numberRegex =/^010\d{8}$/;
    var inforNumber = document.getElementById('inforNumber');

    inforNumber.style.display = 'none';
    if(!numberRegex.test(number)){
        inforNumber.style.display = 'block';
        return false;
    }
    return true;
}