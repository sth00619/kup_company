$(document).ready(function(){

    $('.contract_list_box').css({'float' : 'none'});
    $('._add_form_div').prop('hidden', false);

    /*공백제거*/
    $('._name, #birthday, ._mobile, #detailAddress, #job, #average_pay').on('blur',function(){
        var trimStr = $(this).val().trim()
        $(this).val(trimStr);
    });

    /*이름에 특수문자 사용 불가*/
    $("._name").bind("keyup", function () {
        re = /[~!@\#$%^&*\()\-=+_\d']/gi;
        var temp = $("._name").val();
        if (re.test(temp)) {
            alert("✔특수문자 혹은 숫자를 사용할 수 없습니다.✔");
            $("._name").val(temp.replace(re, ""));
        }
    });

    /*핸드폰 input box 클릭시 하이픈 제거*/
    $('#mobile').on('click',function(){
        var mobile = $(this).val();
        mobile = minusStr(mobile);
        $(this).prop('value',mobile);
    });

    /*필수입력 공백 , 이름 형식 유효성 검사*/
    $('._name,._mobile').on('blur',function(){
        var nameCk = false;
        var inputName = $(this).attr('name');
        var potentialUserVal = $("input[name='"+inputName+"']").val();
        if(inputName == 'name'){
            if(potentialUserVal){
                $('.name_error').hide();
                nameCk = true;
            }else{
                $('.name_error').show();
                nameCk = false;
            }
        }else if (inputName == 'mobile'){

            if(potentialUserVal){
                $('.mobile_error').hide();

                /*핸드폰번호 중복 확인*/
                var request = $.ajax({
                    url : "/potential/isConfirmByMobile",
                    type : "GET",
                    data : { encryptMobile : potentialUserVal },
                    dataType : "text"
                });
                request.done(function(data){
                    if(data > 0){
                        var result = window.confirm("동일한 휴대폰 번호가 있습니다. 정말 사용하시겠습니까?");
                        if(result){
                            nameCk = true;
                        }else {
                            $('#mobile').val("");
                            $('._mobile').focus();
                            nameCk = false;
                        }
                    } else {
                        nameCk = true;
                    }
                });
                request.fail(function(){
                    alert('☢ Ajax ERROR ', jqXHR, textStatus);
                    nameCk = false;
                });

            }else {
                $('.mobile_error').show();
                nameCk = false;
            }
        }
    });

    /*not null 유효성검사*/
    $(document).on('click','._submitBtn', function () {
        if ($('#source').val().length == ''){
            alert("✔고객분류를 선택해 주세요.✔");
            return false;
        }else if ($('._name').val().length == '') {
            alert("✔이름을 입력해 주세요.✔");
            $('._name').focus();
            return false;
        }else if ($('._mobile').val().length > 20 || $('._mobile').val().length < 10) {
            alert("✔연락처를 정확히 입력해 주세요.✔");
            $('._mobile').focus();
            return false;
        }
    });

    /*취소버튼 경로설정*/
    $('._closeBtn').on('click', function(){
        location.href='/potential/counseling';
    });

});

/**
 * 담당자 변경 이벤트
 */
$('._employee_select_trans').on('change', function(){
    let employeeCode = $(this).val();

    const startNum = employeeCode.indexOf('(');
    const lastNum = employeeCode.indexOf(')');

    const employeeName = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(0, startNum).trim() : '';
    employeeCode = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(startNum + 1, lastNum).trim() : '';

    $('._employee_select_trans').val(employeeName);
    $('._select_employee_Code').val(employeeCode);
});