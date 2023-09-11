$(document).ready(function () {


    var searchDate = $('#searchDate').val();


    $(document).on('change', '._selectDepartment', function () {


        var selectDepartmentCode = $(this).val();

        if($(this).val() == "cancel"){
            window.location = "/statistics/teamFullSchedule?searchDate="+searchDate;

        }else{
        window.location = "/statistics/teamFullSchedule?searchDepartmentCode=" + selectDepartmentCode+"&searchDate="+searchDate;

        }
    })

    $(document).on('click', '#prev', function () {

        var departmentCode = $("#selectDepartment option:selected").val();

        var prevDate = new Date(searchDate);
        prevDate.setDate(prevDate.getDate() - 1);
        prevDate = prevDate.toISOString().split("T")[0];

        if (departmentCode) {
            window.location = "/statistics/teamFullSchedule?searchDepartmentCode=" + departmentCode + "&searchDate=" + prevDate;

        } else {
            window.location = "/statistics/teamFullSchedule?searchDate=" + prevDate;

        }




    })



    $(document).on('click', '#next', function () {

        var departmentCode = $("#selectDepartment option:selected").val();


        var nextDate = new Date(searchDate);

        nextDate.setDate(nextDate.getDate() + 1);
        nextDate = nextDate.toISOString().split("T")[0];


        if (departmentCode) {
            window.location = "/statistics/teamFullSchedule?searchDepartmentCode=" + departmentCode + "&searchDate=" + nextDate;

        } else {
            window.location = "/statistics/teamFullSchedule?searchDate=" + nextDate;

        }

    })


    $(document).on('click', '.card', function () {

        var scheduleEmployeeCode = $(this).children('.card-body').children('._cardEmployeeCode').val();
        var scheduleDepartmentCode = $(this).children('.card-body').children('._cardDepartmentCode').val();

        window.location = "/schedule/schedule?employeeCode="+scheduleEmployeeCode+"&departmentCode="+scheduleDepartmentCode;

    
    
    });

})