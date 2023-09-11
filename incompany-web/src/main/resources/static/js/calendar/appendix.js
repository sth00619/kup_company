$(document).ready(function () {

    const notExistAlert = "는 없는 코드입니다.";



    $(document).on('click', '#searchBtn', function () {
        var searchEmployeeCode = $('#searchEmployeeCode').val();

        if (!searchEmployeeCode) {
            alert('사원번호를 입력해주세요 ! ');
            return false;
        }

        $.ajax({
            url: "/companyChart/exists",
            type: "GET",
            data: {
                "employeeCode": searchEmployeeCode
            },
            success: function (data) {
                if (data) {
                    location.href = '/calendar/appendix?employeeCode=' + searchEmployeeCode;

                } else {
                    alert("사원번호" + notExistAlert);
                    return false;
                }


            },
            error: function () {

                alert('사원찾기에 실패했습니다.');
                return false;

            }
        })

    });

    $(document).on('change', '#searchEmployeeCode', function () {
        $('#inject').hide();
    });

    $(document).on('click', '#saveBtn', function () {

        var employeeCode = $('#employeeCode').val();
        var calendarId = $('#searchCalendarId').val();
        var result = true;

        var addFormData = {
            "employeeCode": employeeCode,
            "calendarId": calendarId
        }

        $('._calendarId').each(function (data) {

            if (calendarId == $(this).text()) {
                alert('이미 추가된 캘린더입니다.');
                result = false;
                return false;
            }
        })

        if (!employeeCode) {
            alert("사원번호를 입력해주세요.");
            return false;
        }

        if (!calendarId) {
            alert("캘린더를 입력해주세요.");
            return false;
        }

        if (result) {
            $.ajax({
                url: "appendix",
                type: "POST",
                data: addFormData,
                success: function (data) {
                    if (typeof data != 'undefined' && data != '' && data != 'null') {
                        alert(data + notExistAlert);
                        return false;
                    }
                    location.reload();

                },
                error: function () {

                    alert('캘린더 추가에 실패하셨습니다.');
                    return false;

                }
            })

        }




    });


    $(document).on('click', '#deleteBtn', function () {

        var employeeCode = $('#employeeCode').val();
        var calendarId = $(this).prev().prev().prev().prev().text();

        var addFormData = {
            "employeeCode": employeeCode,
            "calendarId": calendarId
        }


        $.ajax({
            url: "appendix",
            type: "DELETE",
            data: addFormData,
            success: function () {

                location.reload();

            },
            error: function () {

                alert('캘린더 삭제에 실패하셨습니다.');
                return false;

            }
        })


    });


});
