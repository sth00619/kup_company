$(document).ready(function () {

    /*공백제거*/
    $('#employeeName, #employeeCode, #mobile, #detailAddress, #emailId').on('blur',function(){
        var trimStr = $(this).val().trim()
        $(this).val(trimStr);
    });

    /*사원이름에 특수문자 사용 불가*/
    $("#employeeName").bind("keyup", function () {
        re = /[~!@\#$%^&*\()\-=+_\d']/gi;

        var temp = $("#employeeName").val();
        if (re.test(temp)) {
            alert("✔특수문자 혹은 숫자를 사용할 수 없습니다.✔");
            $("#employeeName").val(temp.replace(re, ""));
        }
    });

    /*공백 유효성검사*/
    $('#employeeName, #employeeCode, #mobile, #location, #birthday, #companyEmailId').on('blur',function(){
        var nameCk = false;
        var inputName = $(this).attr('name');
        var employeeVal = $("input[name='"+inputName+"']").val();

        if(inputName == 'employeeName'){
            if (employeeVal) {
                $('.name_error').hide();
                nameCk = true;
            }else {
                $('.name_error').show();
                nameCk = false;
            }
        }else if(inputName == 'employeeCode'){

            if (employeeVal.length == 8) {
                $('.code_error').hide();
                /*사원코드 중복체크*/
                var request = $.ajax({
                    url : "/companyChart/isAddEmployeeCode",
                    type : "GET",
                    data : { employeeCode : employeeVal },
                    dataType : "text"
                });
                request.done(function(data){
                    if(data > 0){
                        $('._checkEcode').show();
                        $('._checkEcode').val('show');
                        $('._successCheck').hide();
                        nameCk = false;
                    }else{
                        $('._successCheck').show();
                        $('._checkEcode').hide();
                        $('._checkEcode').val('');
                        nameCk = true;
                    }
                });
                request.fail(function(jqXHR, textStatus){
                    alert('☢ Ajax ERROR ', jqXHR, textStatus);
                    nameCk = false;
                });
            }else if(!employeeVal) {
                $('.code_error').show();
                $('._checkEcode').hide();
                $('._successCheck').hide();
                nameCk = false;
            }else if(employeeVal.length != 8){
                $('.code_error').hide();
                $('._checkEcode').hide();
                $('._successCheck').hide();
                alert("✔사원번호를 정확히 입력해 주세요.✔");
            }
        }else if(inputName == 'birthday'){
            if (employeeVal) {
                $('.birthday_error').hide();
                nameCk = true;
            }else {
                $('.birthday_error').show();
                nameCk = false;
            }
        }else if(inputName == 'mobile'){
            if (employeeVal) {
                $('.mobile_error').hide();
                nameCk = true;
            }else {
                $('.mobile_error').show();
                nameCk = false;
            }
        }else if(inputName == 'location'){
            if (employeeVal) {
                $('.location_error').hide();
                nameCk = true;
            }else {
                $('.location_error').show();
                nameCk = false;
            }
        } else if (inputName == 'companyEmailId') {
            var companyEmailVal = $('#companyEmailId').val();
            var companyEmailForm = $('#companyEmailForm').val();
            var companyEmail = companyEmailVal + '@' + companyEmailForm;

            if (companyEmailVal.length > 0 && !(companyEmailForm.isEmpty())) {
                $('.companyEmail_error').hide();
                /*사내 이메일 중복체크*/
                var request = $.ajax({
                    url: "/email/duplicate",
                    type: "GET",
                    data: {companyEmail: companyEmail},
                    dataType: "text"
                });
                request.done(function (data) {
                    if (data > 0) {
                        $('._checkCompanyEmail').show();
                        $('._checkCompanyEmail').val('show');
                        $('._successCompanyEmail').hide();
                        nameCk = false;
                    } else {
                        $('._successCompanyEmail').show();
                        $('._checkCompanyEmail').hide();
                        $('._checkCompanyEmail').val('');
                        nameCk = true;
                    }
                });
                request.fail(function (jqXHR, textStatus) {
                    alert('☢ Ajax ERROR ', jqXHR, textStatus);
                    nameCk = false;
                });
            } else {
                $('.companyEmail_error').show();
                $('._successCompanyEmail').hide();
                $('._checkCompanyEmail').hide();
                nameCk = false;
            }
        };
    });

    /*not null 유효성검사*/
    $(document).on('click','._submitBtn', function () {
        var companyName = $('._companyCode option:checked').text();
        $('#workplace').prop('value',companyName);

        if (isValue($('._companyCode').val())){
            alert("✔법인을 선택해 주세요.✔");
            $('._companyCode').focus();
            return false;
        } else if (isValue($('#departmentCode').val())) {
            alert("✔소속을 선택해 주세요.✔");
            $('#departmentCode').focus();
            return false;
        } else if (isValue($('._positionCode').val())) {
            alert("✔직급을 선택해 주세요.✔");
            $('._positionCode').focus();
            return false;
        } else if (isValue($('#employeeName').val())) {
            alert("✔이름을 입력해 주세요.✔");
            $('#employeeName').focus();
            return false;
        } else if (isValue($('#employeeCode').val()) || $('#employeeCode').val().length >= 15) {
            alert("✔사원번호를 정확히 입력해 주세요.✔");
            $('#employeeCode').focus();
            return false;
        }else if (isValue($('#birthday').val())) {
            alert("✔생년월일을 입력해 주세요.✔");
            $('#birthday').focus();
            return false;
        }else if ($('#mobile').val().length < 10 && $('#mobile').val().length > 13) {
            alert("✔연락처를 정확히 입력해 주세요.✔");
            $('#mobile').focus();
            return false;
        }else if (isValue($('#postcode').val())) {
            alert("✔주소를 정확히 입력해 주세요.✔");
            $('#postcode').focus();
            return false;
        }else if (isValue($('#detailAddress').val())) {
            alert("✔상세주소를 입력해 주세요.✔");
            $('#detailAddress').focus();
            return false;
        }else if (!isValue($('._checkEcode').val())){
            alert("✔이미 사용 중인 사번입니다.✔");
            $('#employeeCode').focus();
            return false;
        }
        // 이메일 체크 주석처리
        /* else if (isValue($('#emailId').val())) {
            alert("✔이메일주소를 입력해 주세요.✔");
            $('#emailId').focus();
            return false;
        }else if (isValue($('#emailForm').val())) {
            alert("✔이메일주소를 선택해 주세요.✔");
            $('#emailForm').focus();
            return false;
        }else if ($('#emailForm').val() === 'self' && isValue($('._emailSelf').val())) {
            alert("✔이메일주소를 입력해 주세요.✔");
            $('._emailSelf').focus();
            return false;
        }
        * */
    });

    // 널 체크 함수 값이 없을 때 true 반환
    function isValue(value){
        return (typeof value == 'undefined' || value === '' || value == null);
    }

    /*#selbox의 value 값이 '직접입력'일 경우 input box 생성*/
    $('._emailSelect').on('change',function(){
        const emailSelf = $('._emailSelf');
        const isEmailId = isValue($('#emailId').val());

        // 직접 입력 select -> 직접 입력 input 노출
        if($(this).val() === 'self'){
            emailSelf.prop('hidden', false);
        }else {
            emailSelf.prop('hidden', true);
        }

        // 포커스 위치 설정
        if(isEmailId){
            $('#emailId').focus();
        } else if(!emailSelf.prop('hidden')) {
            emailSelf.focus();
        }
    });


    /*상위부서 별 하위부서*/
    $('._companyCode').change(function(){
        $('#departmentCode').removeAttr('value');
        var companyCode = this.value;
        $('._D1 option').remove();
        $('._D2 option').remove();
        $('._D2').prop('hidden',true);
        $('._D3 option').remove();
        $('._D3').prop('hidden',true);
        $('._D1').append('<option disabled selected>본부</option>');

        var request = $.ajax({
            url : '/getDepartmentDepth'
            ,method : 'GET'
            ,data : { companyCode : companyCode }
            ,dataType : 'json'
        })

        request.done(function(data){
            let D1Code;
            let D1Name;
            $(data).each(function(index, item){
                D1Code = item.departmentCode;
                D1Name = item.departmentName;
                $('._D1').append('<option value="'+D1Code+'">'+D1Name+'</option>');
            });
            if(typeof D1Code == 'undefined' || D1Code == '' || D1Code == null) {
                $('._D1').prop('hidden',true);
            }else {
                $('._D1').prop('hidden',false);
            };
        });
    });

    $('._D1').change(function(){
        var departmentCode = this.value;
        $('#departmentCode').attr('value',departmentCode);
        $('._D2 option').remove();
        $('._D3 option').remove();
        $('._D3').prop('hidden',true);
        $('._D2').append('<option disabled selected>지점</option>');

        var request = $.ajax({
            url : '/departments/getChildDepartment'
            ,method:'GET'
            ,data:{departmentCode : departmentCode}
            ,dataType:'json'
        })

        request.done(function(data){
            let D2Code;
            let D2Name;
            $(data.childDepartmentList).each(function(index, item){
                D2Code = item.departmentCode;
                D2Name = item.departmentName;
                $('._D2').append('<option value="'+D2Code+'">'+D2Name+'</option>');
            });

            if(typeof D2Code == 'undefined' || D2Code == '' || D2Code == null) {
                $('._D2').prop('hidden',true);
            }else {
                $('._D2').prop('hidden',false);
            };
        });
    });

    $('._D2').change(function(){
        var departmentCode = this.value;
        $('#departmentCode').attr('value',departmentCode);
        $('._D3 option').remove();
        $('._D3').children().remove();
        $('._D3').append('<option disabled selected>팀</option>');

        var request = $.ajax({
            url:'/departments/getChildDepartment'
            ,method:'GET'
            ,data:{departmentCode : departmentCode}
            ,dataType:'json'
        });

        request.done(function(data){
            let D3Code;
            let D3Name;
            $(data.childDepartmentList).each(function(index, item){
                D3Code = item.departmentCode;
                D3Name = item.departmentName;
                $('._D3').append('<option value="'+D3Code+'">'+D3Name+'</option>');
            });
            if(typeof D3Code == 'undefined' || D3Code == '' || D3Code == null) {
                $('._D3').prop('hidden',true);
            }else {
                $('._D3').prop('hidden',false);
            };
        });
    });

    $('._D3').change(function(){
        $('#departmentCode').attr('value', this.value);
    });
})