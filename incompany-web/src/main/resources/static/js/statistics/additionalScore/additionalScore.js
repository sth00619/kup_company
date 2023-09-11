$(document).ready(function(){

    // ul 클릭 시 해당 사원 스케쥴 페이지로 이동
    $(document).on('click', '._additionList', function(){

        const departmentCode = $(this).find('._departmentCode').attr('value');
        const employeeCode = $(this).find('._employeeCode').val();

        const url = "/schedule/schedule?employeeCode=" + employeeCode + "&departmentCode=" + departmentCode;
        $(location).attr('href',url);

    });
})