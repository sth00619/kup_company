$(document).ready(function () {

    var getDepartmentCode = $('#getDepartmentCode').val();

    if (getDepartmentCode.length === 7) {
        $('#getTeamCode').val(getDepartmentCode);
    }

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    const urlArray = [{urlKey: 'orderBy', urlVal: $('#orderBy').val()}
        , {urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}
        , {urlKey: 'assignStatus', urlVal: $('#assignStatus').val()}];

    // url parameter 세팅
    function settingUrl(urlArray) {
        let url = '';

        let startDate = $('._search_start_date').val();
        let endDate = $('._search_end_date').val();
        if(typeof startDate === 'undefined' || startDate === '' || startDate === null){
            startDate = $('#startDate').val();
            endDate = $('#endDate').val();
        }

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        urlArray.push({ urlKey : 'employeeCode', urlVal : $('._employee_select').val() }
                    , { urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() }
                    , { urlKey : 'startDate', urlVal : startDate }
                    , { urlKey : 'endDate', urlVal : endDate }
                    , { urlKey : 'requestDate', urlVal : $('#requestDate').val() });

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function (index, item) {
            if (typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null) {
                url += "&" + item.urlKey + "=" + item.urlVal;
            }
        })

        /*
         *  현제 경로 추출
         *  ex) /contractFortune/contractFortune
         */
        const pathName = $(location).attr('pathname');

        // 맨 앞 '&' 제거
        url = pathName + '?' + url.substring(1);

        return url;
    }

    // 체크 되어 있는 잠재고객
    function getPotentialUserNo() {
        let potentialUserNo = '';
        $('._sub_check:checked').each(function () {
            potentialUserNo += "&potentialUserNo=" + $(this).parents('._sub_ul').find('.potentialUserNo').attr('value');
        });
        return potentialUserNo;
    }

    var isLeader = $('#isLeader').hasClass('_true_leader');
    var getDepartmentCode = $('#getDepartmentCode').val();

    var getEmployeeCode = $('#getEmployeeCode').val();
    var departmentCode = getDepartmentCode;
    var belong_length = 3;
    var department_length = 5;
    var team_length = 7;

    if (getDepartmentCode.length === team_length) {
        // 팀이 선택되어 있을 경우 - 영업 부서 코드, 팀 코드 세팅
        var getTeamCode = getDepartmentCode;
        departmentCode = getDepartmentCode.substring(0, 5);
        var belongCode = getDepartmentCode.substring(0, 3);
        $('#getTeamCode').val(getTeamCode);
    } else if (getDepartmentCode.length === 5) {
        // 부서만 선택했을 경우 - 팀 리스트 세팅
        var belongCode = getDepartmentCode.substring(0, 3);
        departmentCode = getDepartmentCode;
    } else if (getDepartmentCode.length === 3) {
        var belongCode = getDepartmentCode;
    }

    // 리더권한 Default setting
    if (isLeader && $('._department_select').children().length === 1) {
        $('#getDepartmentCode').val($('._department_select').val());
    }

    /* 부서, 팀 select box */
    $(document).on('change', '._belong_select, ._department_select, ._team_select, ._employee_select', function () {

        if (!$(this).hasClass('_employee_select')) {
            let locationDepartmentCode = null;
            if ($(this).val() === 'cancel') {
                if ($(this).hasClass('_department_select')) {
                    locationDepartmentCode = $('._belong_select').val();
                } else if ($(this).hasClass('_team_select')) {
                    locationDepartmentCode = $('._department_select').val();
                }
            } else {
                locationDepartmentCode = $(this).val();
            }
            $('#getDepartmentCode').val(locationDepartmentCode);
            $('._employee_select').val('');
        } else {
            if ($(this).val() === 'cancel') {
                $('._employee_select').val('');
            }
        }

        // url 문자열 세팅
        let url = settingUrl(urlArray);
        const potentialUserNo = getPotentialUserNo();
        if (typeof potentialUserNo != 'undefined' && potentialUserNo !== '' && potentialUserNo != null) {
            url += potentialUserNo;
        }

        $(location).attr('href', url);
    });

    let isBelong = false;
    const belongChild = $('._belong_select').children();
    $.each(belongChild, function () {
        if ($(this).val() === $('#getDepartmentCode').val()) {
            isBelong = true;
        }
    });

    let isEmployee = false;
    const employeeChild = $('._employee_select').children();
    $.each(employeeChild, function () {
        if ($(this).val() === $('#getEmployeeCode').val()) {
            isEmployee = true;
        }
    });

    // 본부 selected 유지
    if (typeof belongCode != 'undefined' && belongCode !== '' && belongCode !== 'null' && isBelong) {
        $('._belong_select').val(belongCode).prop('selected', true);
        $('._belong_select_trans').val(belongCode).prop('selected', true);
    }

    // 부서 selected 유지
    if (typeof departmentCode != 'undefined' && departmentCode !== '' && departmentCode !== 'null' && departmentCode.length === department_length) {

        // 영업본부 부서코드가 아닌 SELECT_SALES_ALL 권한이 본부 선택 후 지점을 선택하여 새로고침 됐을 때
        // 지점은 정상적으로 selected 되어 있고 본부는 selected 가 안되는 현상 해결
        if (!isBelong) {
            $('._belong_select').val(departmentCode.substring(0, belong_length)).prop('selected', true);
            $('._belong_select_trans').val(departmentCode.substring(0, belong_length)).prop('selected', true);
        }

        $('._department_select').val(departmentCode).prop('selected', true);
        $('._department_select_trans').val(departmentCode).prop('selected', true);
    }

    // 팀 selected 유지
    if (typeof getTeamCode != 'undefined' && getTeamCode !== '' && getTeamCode !== 'null') {
        $('._team_select').val(getTeamCode).prop('selected', true);
        $('._team_select_trans').val(getTeamCode).prop('selected', true);
    }

    // 담당자 selected 유지
    if (typeof getEmployeeCode != 'undefined' && getEmployeeCode !== '' && getEmployeeCode !== 'null') {
        if (!isEmployee) return;

        $('._employee_select').val(getEmployeeCode).prop('selected', true);
        $('._employee_select_trans').val(getEmployeeCode).prop('selected', true);
    }
});