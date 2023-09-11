$(document).ready(function () {


    $(document).on('click', '#resetBtn', function () {

        var employeeCode = $('#resetEmployeeCode').val();

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
                    url: "/account/reset",
                    type: "PUT",
                    data: {
                        "employeeCode": employeeCode
                    },
                    success: function () {
                        alert('비밀번호 초기화에 성공했습니다');
                    },
                    error: function () {

                        alert('초기화에 실패하였습니다');
                        return false;

                    }
                })


            } else {
                alert('사원번호를 확인해주세요');
                return false;
            }

        });

    })
});