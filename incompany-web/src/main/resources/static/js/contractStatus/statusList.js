$(document).ready(function () {

    /*지점순위*/
    setContractRankingByDepartment();

// 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    let urlArray = [{urlKey: 'orderBy', urlVal: $('#orderBy').val()}];

    // 정렬 기준에 따라 조회
    $('._sort').on('click', function () {

        const orderBy = $(this).data('sort');

        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'orderBy') item.urlVal = orderBy;
        });
        urlArray.push({urlKey: 'employeeCode', urlVal: $('#getEmployeeCode').val()});
        // url 문자열 세팅
        var url = settingUrl(urlArray);
        $(location).attr('href', "/contractStatus/statusList?" + url);

        /*$('#orderBy').attr('value', orderBy);
        const checkOrderBy = $('#orderBy').val();
        if(isEmpty(checkOrderBy)) return;
        let url = 'orderBy='+ checkOrderBy;
        $(location).attr('href', "/contractStatus/statusList?" + url);*/
    });

});

// url parameter 세팅
function settingUrl(urlArray) {
    let url = '';

    // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
    urlArray.push({urlKey: 'departmentCode', urlVal: $('#getDepartmentCode').val()});

    // 값이 있는 parameter 들만 url 세팅
    $.each(urlArray, function (index, item) {
        if (typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null) {
            url += "&" + item.urlKey + "=" + item.urlVal;
        }
    });

    // 맨 앞 '&' 제거
    return url.substring(1);
}

/*본부 셀렉 박스 변경 시*/
$('._belong_select_trans').change(function(){
    rowShowByD1();
    rowHideByD1();
});

/*지점 셀렉 박스 변경 시*/
$('._department_select_trans').change(function(){
    rowShowByD2();
    rowHideByD2();
});

/*해당 본부이외 hide
function rowHideByD1 () {
    var centralDepartment = $('._list_ul');
    var D1Select = $('._belong_select_trans').val();

    $('._list_ul').each(function(){
        var D1 = $(this).attr('value');
        if (D1 != D1Select) {
            $(this).hide();
        }
    });
}

*//*전체 본부 show*//*
function rowShowByD1 () {
    var centralDepartment = $('._list_ul');
    var D1Select = $('._belong_select_trans').val();

    $('._list_ul').each(function(){
        var D1 = $(this).attr('value');
        $(this).show();
    });
}

*//*해당 지점이외 hide*//*
function rowHideByD2 () {
    var centralDepartment = $('._list_ul');
    var D2Select = $('._department_select_trans').val();

    $('._list_ul').each(function(){
        var D2 = $(this).find('._D2').attr('value');
        if (D2 != D2Select) {
            $(this).hide();
        }
    });
}

*//*전체 지점 show*//*
function rowShowByD2 () {
    var centralDepartment = $('._list_ul');
    var D2Select = $('._department_select_trans').val();

    $('._list_ul').each(function(){
        var D2 = $(this).find('._D2').attr('value');
        $(this).show();
    });
}*/


// 지점 순위 세팅
function setContractRankingByDepartment() {
    // 지점 추가 될 경우 아래 departmentGroup 에 지점 코드 추가
    const departmentGroup = ['D0101', 'D0201', 'D0301', 'D0401', 'D0501','D0502'];

    // 지점 코드와 같은 지점의 사원을 위에서 부터 1등으로 세팅
    $.each(departmentGroup, function(index, department){
        let i = 1;
        $('._list_ul').each(function(ulIndex, ulItem){
            const salesDepartmentCode = $(this).find('._D2').attr('value') || $(this).find('._D2').val();
            const isDepartment = salesDepartmentCode === department;

            if(salesDepartmentCode === 0 || !isDepartment) return true;

            $(this).find('._sales_department_Ranking').text(i);
            i++;
        });
    });


}
