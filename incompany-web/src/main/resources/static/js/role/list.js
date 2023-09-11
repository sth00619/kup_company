$(document).ready(function () {

    const selectRole = $('#selectRole').val();
    const partialSelectBox = 'PARTIAL_SELECT_BOX';

    $(document).on('click', '#search', function () {

        let role = $('#role').val();
        location.href = "/role/list?role=" + role;
    })


    if (selectRole === partialSelectBox) {
        $(document).on('click', '._employeeList', function () {

            let selectEmployeeCode = $(this).find('._employeeCode').text();

            window.open("/partialSelectBox/condition?employeeCode=" + selectEmployeeCode, '지점추가', 'width=500px,height=300px,scrollbars=yes');


        })
    }


})