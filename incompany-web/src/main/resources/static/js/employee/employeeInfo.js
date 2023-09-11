$(document).ready(function(){

    /*소속(부서) 출력*/
    var departmentCode = $("#departmentCode").val();
    var D1 = departmentCode.substring(0,3);
    var D2 = departmentCode.substring(0,5);
    var D3 = departmentCode.substring(0,7);

    /*사원정보 수정버튼 경로설정*/
    $('#updateBtn').on('click',function(){
        var employeeCode = $('#employeeCode').attr('value');
        var departmentCode = $('#departmentCode').attr('value');
        var companyCode = $('#companyCode').attr('value');
        var modifyLink = '/companyChart/updateEmployee?employeeCode='+employeeCode;
        $(location).attr('href',modifyLink);
    });

    /*하이픈 적용*/
    var birthday = $("#birthday").attr('value');
    var birthdayHyphen = birthday.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    $('#birthday').text(birthdayHyphen);

    var joinDate = $("#joinDate").attr('value');
    var joinDateHyphen = joinDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    $('#joinDate').text(joinDateHyphen);

    /*이메일 전송 버튼*/
    $('#emailBtn').on('click',function(){
        var email = $('#email').text();
        var employeeCode = $('.employeeCode').attr('value');

        alert(email + '로 발송 하였습니다.');

        $.ajax({
            type : "GET",
            url : "emailCheck?email=" + email + "&employeeCode=" + employeeCode
        });
    });

    // 처리 실패 메세지
    if($('#isSuccess').val() == 'false') {
        var message = $('#message').val();
        alert(message);
    }
})