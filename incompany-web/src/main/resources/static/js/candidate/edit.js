$(document).ready(function () {

    /*공백제거*/
    $(' #mobile, #detailAddress, #name').on('blur', function () {
        var trimStr = $(this).val().trim()
        $(this).val(trimStr);
    });

    /*이름에 특수문자 사용 불가*/
    $("#name").bind("keyup", function () {
        re = /[~!@\#$%^&*\()\-=+_\d']/gi;
        var temp = $("#name").val();
        if (re.test(temp)) {
            alert("✔특수문자 혹은 숫자를 사용할 수 없습니다.✔");
            $("#name").val(temp.replace(re, ""));
        }
    });


    $(document).on("keyup", "#mobile", function () {
        $(this).val($(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-"));
    });



    /*not null 유효성검사*/
    $(document).on('click', '._submitBtn', function () {
        var form = $('#form');
        var mobile = $('#mobile').val().replace('-', '');

        if ($('#name').val().length == '') {
            alert("✔이름을 입력해 주세요.✔");
            $('#name').focus();
            return false;
        } else if (mobile.length <11) {
            alert("✔연락처를 정확히 입력해 주세요.✔");
            $('#mobile').focus();
            return false;
        }

        $('#form').attr("action", "edit");
        form.submit();


    });



    $('._employee_select_trans').on('change', function () {
        let employeeCode = $(this).val();


        const startNum = employeeCode.indexOf('(');
        const lastNum = employeeCode.indexOf(')');

        const employeeName = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(0, startNum).trim() : '';
        employeeCode = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(startNum + 1, lastNum).trim() : '';

        $('._employee_select_trans').val(employeeName);
        $('._select_employee_Code').val(employeeCode);


        // 부서 세팅
        setDepartment(employeeCode);

        // 직급 세팅
        setPosition(employeeCode);

    });

    /**
     * 담당자 변경 시 직급 세팅
     * @param employeeCode
     */
    function setDepartment(employeeCode) {
        const request = $.ajax({
            url: "/companyChart/getEmployeeInfoForAddContract",
            type: "GET",
            data: {
                employeeCode: employeeCode
            },
            dataType: "json"
        });

        request.done(function (data) {

            $('._D1').text(data.d1);
            $('._D2').text(data.d2);
            $('._D3').text(data.d3);
            $('._select_department_Code').val(data.departmentCode);

        });
    }


    /**
     * 담당자 변경 시 직급 세팅
     * @param employeeCode
     */
    function setPosition(employeeCode) {
        const request = $.ajax({
            url: "/companyChart/getEmployeeInfoForContractFortune",
            type: "GET",
            data: {
                employeeCode: employeeCode
            },
            dataType: "json"
        });

        request.done(function (data) {
            const positionName = data.positionName;
            $('._position_name').text(positionName);
        });
    }




})