$(document).ready(function () {

    // 처리 결과 메세지
    var message = $('#message').val();
    if (typeof message != 'undefined' && message != '' && message != null) alert(message);

    // 기본권한 체크박스 체크, 글씨색 변경
    $('input:checkbox[name="role"]').each(function () {
        for (var i = 0; i < positionAuthNameList.length; i++) {
            if (this.value === positionAuthNameList[i]) { //값 비교 
                this.checked = true;
                this.disabled = true;
                this.name = ''
                this.parentElement.parentElement.className = '_existRole';


            }

        }
    });


    // 추가권한 체크박스 체크,글씨색 변경
    $('input:checkbox[name="role"]').each(function () {
        for (var i = 0; i < employeeRoleAppendixList.length; i++) {
            if (this.value === employeeRoleAppendixList[i].role) { //값 비교 
                this.checked = true;
                this.parentElement.parentElement.className = '_appendixRole';

            }

        }
    });



    $(document).on('click', '#modifyRole', function () {

        var employeeCode = $('#employeeCode').val()
        var checkboxValues = [];

        $("input[name='role']:checked").each(function (i) {
            checkboxValues.push($(this).val());
        });

        var request = $.ajax({
            url: "/companyChart/isAddEmployeeCode",
            type: "GET",
            data: {
                employeeCode: employeeCode
            },
            dataType: "text"
        });

        request.done(function (data) {
            if (data > 0) {

                $.ajax({
                    url: "form",
                    type: "POST",
                    data: {
                        "employeeCode": employeeCode,
                        "checkArray": checkboxValues
                    },
                    success: function () {
                        alert("추가권한을 변경했습니다");
                        location.reload();

                    },
                    error: function () {
                        alert("추가권한 변경에 실패하셨습니다.");
                        return false;
                    }

                });


            } else {
                alert('사원번호를 확인해주세요!! ');
                return false;
            }

        });


    })

    $(document).on('click', '#findRoleAppendixBtn', function () {
        var employeeCode = $('#employeeCode').val();
        if (typeof employeeCode != 'undefined' && employeeCode != '' && employeeCode != 'null') {
            $.ajax({
                url: "/companyChart/isAddEmployeeCode",
                type: "GET",
                data: {
                    "employeeCode": employeeCode
                },
                dataType: "text",
                success: function (data) {
                    if (data > 0) {
                        location.href = '/roleAppendix/form?employeeCode=' + employeeCode;
                    } else {
                        alert("사원번호를 확인해주세요!! ");
                    }
                }
            });
        }

    });

    $(document).on('keyup', '#employeeCode', function () {
        $('#modifyForm').hide();

    });


})