$(document).ready(function(){

    var employeeCode = $('#employeeCode').val();
    var employeeLoginCode = $('#employeeLoginCode').val();
    var isMyPotentialUser = $('#isMyPotentialUser').val();

    if(isMyPotentialUser == 'false'){
        $('input').prop('disabled', true);
        $('textarea').prop('readonly', true);
        $('option').attr('disabled', true);
        $('select').attr('disabled', true);
        $('._submitBtn').hide();
    }

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
    // 문자 제거 Only 숫자
    function minusStr(value){
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

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
        }else if(inputName == 'mobile'){
            if(potentialUserVal){
                $('.mobile_error').hide();
                nameCk = true;
            }else{
                $('.mobile_error').show();
                nameCk = false;
            }
        }
    });

    /*not null 유효성검사*/
    $(document).on('click','._submitBtn', function () {
        if ($('._source').val().length == ''){
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

})