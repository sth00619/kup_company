$(document).ready(function () {

    // 날짜 변경 > 이전 버튼, 다음 버튼
    $('._prePage, ._nextPage').on('click', function () {
        const requestUrl = $('#requestUrl').val();
        const departmentCode = $('#departmentCode').val();
        const employeeCode = $('#employeeCode').val();

        if (!requestUrl) return;

        let url = requestUrl + '?';
        let searchDate = '';

        let month_date = $('#searchDate').val();
        if ($(this).hasClass('_prePage')) {
            month_date = getDt1(month_date);            
            searchDate = getDt3(month_date).substring(0,7);
            
        } else if ($(this).hasClass('_nextPage')) {
            month_date = getDt1(month_date);
            searchDate = getDt5(month_date).substring(0,7);
        }

        if (searchDate) {
            url += '&searchDate=' + searchDate;
        }

        if (departmentCode) {
            url += '&departmentCode=' + departmentCode;
        }

        if (employeeCode) url += '&employeeCode=' + employeeCode;




        $(location).attr('href', url);

    });

})