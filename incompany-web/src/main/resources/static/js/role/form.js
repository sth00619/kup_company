$(document).ready(function () {


    $('input[name="role"]').change(function () {

        $("._allEmployeeList").hide();
        $("._departmentList").hide();
        $("._lowerDepartmentList").hide();

        $('#employee').val('');
        $('#department').val('');
        $('#lowerDepartment').val('');

        var radioVal = $('input[name=role]:checked').val();


        switch (radioVal) {
            case 'department':
                $("._departmentList").show();

                break;
            case 'lowerDepartment':
                $("._lowerDepartmentList").show();

                break;
            case 'employee':
                $("._allEmployeeList").show();

                break;

        }

        $('#updateRoleBtn').show();


    });


    $('#updateRoleBtn').click(function () {


        var radioVal = $('input[name=role]:checked').val();
        var inputVal = $('#' + radioVal).val();

        if (radioVal == "allEmployee") {
            inputVal = "allEmployee"
        }

        if (!inputVal) {
            alert("세팅할 부서혹은 사원을 입력해주세요")
        }

        var data = {
            "key": radioVal,
            "value": inputVal
        }


        $.ajax({
            type: "POST",
            url: "form",
            data: data,
            success: function (data) {
                if (data) {
                    alert(data + "을/를 다시 확인해주세요");
                    return false;
                }
                $('html').css("cursor", "auto");

                alert("권한을 다시 세팅하였습니다.");
                location.reload();


            },
            beforeSend: function () {
                $('.black_screen').css({
                    visibility: 'visible',
                    opacity: '.3'
                });
                $('html').css("cursor", "wait");
            },
            error: function () {
                alert("권한을 다시 세팅하는데 실패했습니다.")
            }
        })

    });
});