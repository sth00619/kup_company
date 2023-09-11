$(document).ready(function () {





    $(document).on('click', '._deleteBtn', function () {


        $(this).closest('._departmentList').remove();

    })

    $(document).on('click', '#addDepartmentBtn', function () {


        let addDepartmentCode = $('#addDepartment option:selected').val();
        let addDepartmentName = $('#addDepartment option:selected').text();
        let flagTag = false;

        $('._departmentCodeList').each(function () {

            if ($(this).text() == addDepartmentCode) {
                flagTag = true;
                return false;

            }

        });

        if (flagTag) {
            alert('이미 추가된 지점입니다.');
            return false;
        }




        let str = '';
        str += '<tr class="_departmentList">';
        str += '<td class="_departmentCodeList">';
        str += addDepartmentCode;
        str += '</td>'
        str += '<td>';
        str += addDepartmentName;
        str += '</td>'
        str += '<td>';
        str += '<button class="_deleteBtn">';
        str += '삭제'
        str += '</button>'
        str += '</td>'
        str += '</tr>';

        $('#titleTr').after(str)


    })


    $(document).on('click', '#saveBtn', function () {

        let query = window.location.search;
        let param = new URLSearchParams(query);
        let employeeCode = param.get('employeeCode');
        let type = "PUT"

        let partDepartmentCodes = [];

        const isNew = JSON.parse($('#isNew').val());


        console.log(isNew)

        if (isNew) {
            type = "POST";
        }

        $('._departmentCodeList').each(function () {

            partDepartmentCodes.push($(this).text());


        });


        $.ajax({
            type: type,
            url: "/partialSelectBox/condition",
            data: {
                "partDepartmentCodes": partDepartmentCodes,
                "employeeCode": employeeCode

            },
            success: function (result) {
                if (result) {
                    alert(result);
                    return false;
                }

                location.reload();

            },
            error: function () {
                alert("수정에 실패하셨습니다.");
            }
        });




    })

})