$(document).ready(function () {

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    let urlArray = [{urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}];

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

    //계약 선택 시 계약 상세 보기 이동
    $(document).on('click', '._fund_sub > li', function () {
        const fundManageNo = $(this).parent().attr('value');
        if (!$(this).hasClass('_checkbox_li') && typeof fundManageNo != 'undefined' && fundManageNo !== '' && fundManageNo != null) {
            const url = "/fund/fundInfo?fundManageNo=" + fundManageNo;
            $(location).attr('href', url);
        }
    });

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchContractFortune();
    });
    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode === 13) {
            searchContractFortune();
        } else if (window.event.keyCode === 32) {
            const searchStr = $(this).val().replace(' ', '');
            $(this).val(searchStr);
        }
    });

    // 검색 실행 함수
    function searchContractFortune() {
        let searchValue = $('._searchValue').val();
        let searchKey = $('._searchKey').val();

        if (searchKey === '연락처') {
            searchValue = minusStr(searchValue);
            // 하이픈 추가 정규식(000-0000-0000)
            searchValue = searchValue.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3");
        }

        // 요청 parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey === 'searchKey') {
                item.urlVal = searchKey;
            } else if (item.urlKey === 'searchValue') {
                item.urlVal = searchValue;
            }
        });

        const startDate = $('._search_start_date').val();
        const endDate = $('._search_end_date').val();

        if (typeof startDate != 'undefined' && startDate !== '' && startDate != null) {
            if (typeof endDate != 'undefined' && endDate !== '' && endDate != null) {
                urlArray.push({urlKey: 'startDate', urlVal: startDate},
                    {urlKey: 'endDate', urlVal: endDate},
                    {urlKey: 'employeeCode', urlVal: $('._employee_select').val()});
            } else {
                alert('마지막 날짜를 선택해 주세요.');
                return false;
            }
        }

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href', "/fund/fund?" + url);
    }

    // 문자 제거 Only 숫자
    function minusStr(value) {
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

    /* 이관 구현 */
    $('._contract_transfer').on('click', function () {
        // 이관 select box 에서 선택 한 사원
        const transferEmployeeCode = $('._employee_select_trans').val();

        // 이관이 아닌 기본 select box 에서 선택 한 사원
        const selectEmployeeCode = $('._employee_select').val();

        if (typeof transferEmployeeCode != 'undefined' && transferEmployeeCode !== '' && transferEmployeeCode != null) {
            const fundCodeList = getCheckFundCodeList();
            if (typeof fundCodeList != 'undefined' && fundCodeList !== '' && fundCodeList != null) {
                // url parameter 추가
                urlArray.push({urlKey: 'pageNum', urlVal: $('#pageNum').val()},
                    {urlKey: 'startDate', urlVal: $('._search_start_date').val()},
                    {urlKey: 'endDate', urlVal: $('._search_end_date').val()},
                    {urlKey: 'transferEmployeeCode', urlVal: transferEmployeeCode},
                    {urlKey: 'selectEmployeeCode', urlVal: selectEmployeeCode});

                // url 문자열 세팅
                const url = settingUrl(urlArray);
                $(location).attr('href', "/fund/transferEmployeeFund?" + url + fundCodeList);

            } else {
                alert('펀드 계약을 선택해 주세요.');
            }
        } else {
            alert('담당자를 선택해 주세요.');
        }
    });

    // 체크되어 있는 계약 찾기
    function getCheckFundCodeList() {
        let fundCodeList = '';
        $('._sub_check:checked').each(function () {
            fundCodeList += "&fundCodeList=" + $(this).parents('._sub_ul').attr('value');
        });
        return fundCodeList;
    }

    // 이관
    $('.Escalation').on('click', function () {
        $(this).toggleClass('E_on');

        if ($(this).hasClass('E_on')) {
            $('.Escalation_visual').css({display: 'block', marginTop: '10px'});
        } else {
            $('.Escalation_visual').css({display: 'none'});
        }
    });

    const belong_length = 3;
    const department_length = 5;
    /* 이관 셀렉트 박스 구현 */
    $(document).on('change', '._belong_select_trans, ._department_select_trans, ._team_select_trans', function () {

        // 선택한 부서 코드
        let departmentCode = $(this).val();
        let departmentName;

        if ($(this).val() === 'cancel') {
            if ($(this).hasClass('_department_select_trans')) {
                departmentCode = $('._belong_select_trans').val();
            } else if ($(this).hasClass('_team_select_trans')) {
                departmentCode = $('._department_select_trans').val();
            } else {
                departmentCode = '';
            }

            if (typeof departmentCode == 'undefined' || departmentCode === '' || departmentCode == null) {
                departmentCode = $('#getDepartmentCode').val();
                if ($(this).hasClass('_department_select_trans')) {
                    $('._department_select_trans').val(departmentCode);
                } else if ($(this).hasClass('_team_select_trans')) {
                    $('._team_select_trans').val(departmentCode);
                }
            }
        }

        if (departmentCode.length === 3) {
            departmentName = '지점';
        } else if (departmentCode.length === 5) {
            departmentName = '팀';
        }

        getChileDepartment(departmentCode, departmentName, department_length);
    });

    function getChileDepartment(departmentCode, departmentName, department_length) {

        const team_select = $('._team_select_trans');
        const department_select = $('._department_select_trans');
        const employee_select = $('._employee_select_trans');

        // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
        const isResign = 2;

        if (departmentCode === 'team') {
            departmentCode = department_select.val();
        }

        // 부서 변경 시
        // 팀 코드 초기화
        if (departmentCode.length === department_length) {
            team_select.val('');
            team_select.children().remove();
            team_select.append('<option disabled selected>팀</option>');
        } else if (departmentCode.length === belong_length) {
            team_select.val('');
            team_select.children().remove();
            team_select.append('<option disabled selected>팀</option>');
            department_select.val('');
            department_select.children().remove();
            department_select.append('<option disabled selected>지점</option>');
        }
        // 담당자 초기화
        employee_select.val('');
        employee_select.children().remove();
        employee_select.append('<option disabled selected>담당자</option>');
        // 1뎁스 하위 부서 및 담당자 데이터 요청
        const request = $.ajax({
            url: '/departments/getChildDepartmentByResign'
            , method: 'GET'
            , data: { departmentCode : departmentCode
                    , departmentName : departmentName
                    , isResign       : isResign }
            , dataType: 'json'   // 리스트, 맵을 받는경우 json 형식을 사용하자
        });

        // 요청 성공
        request.done(function ({childDepartmentList, employeeList}) {

            // 부서 변경 시
            if (departmentCode.length === department_length) {
                // 하위부서 -> 팀 셋팅
                team_select.append('<option value="cancel">선택취소</option>');
                $(childDepartmentList).each(function (index, item) {
                    team_select.append('<option value="' + item.departmentCode + '">' + item.departmentName + '</option>');
                });
            } else if (departmentCode.length === belong_length) {
                // 하위부서 -> 팀 셋팅
                department_select.append('<option value="cancel">선택취소</option>');
                $(childDepartmentList).each(function (index, item) {
                    department_select.append('<option value="' + item.departmentCode + '">' + item.departmentName + '</option>');
                });
            }

            // 해당 부서 사원 -> 담당자 셋팅
            $(employeeList).each(function (index, item) {
                const employeeCode = item.employeeCode;
                const employeeName = item.employeeName;
                if (employeeCode !== null) {
                    employee_select.append('<option value="' + employeeCode + '">' + employeeName + '</option>');
                } else {
                    employee_select.append('<option selected value="' + employeeCode + '">' + employeeName + '</option>');
                }
            })
        });

        // 요청 실패
        request.fail(function () {
            alert('☢ Ajax ERROR');
        });
    }
    $('._top_left_menu').removeAttr('hidden');

    // 처리 실패 메세지
    if ($('#isSuccess').val() === 'false') {
        const message = $('#message').val();
        alert(message);
    }

    // 정렬 기준에 따라 조회
    $('._sort').on('click', function () {

        const orderBy = $(this).data('sort');

        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'orderBy') item.urlVal = orderBy;
        });

        urlArray.push(
            {urlKey: 'orderBy', urlVal: orderBy},
            {urlKey: 'employeeCode', urlVal: $('#getEmployeeCode').val()});

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href', "/fund/fund?" + url);
    });
})