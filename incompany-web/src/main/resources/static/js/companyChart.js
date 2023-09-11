$(document).ready(function () {
    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    let urlArray = [{urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}
        , {urlKey: 'departmentCode', urlVal: $('#getDepartmentCode').val()}
        , {urlKey: 'isResign', urlVal: $('#isResign').val()}];

    //검색실행 함수
    function searchEmployee() {
        let searchValue = $('._searchValue').val();
        let searchKey = $('._searchKey').val();

        if (searchKey === '휴대폰번호') {
            searchValue = minusStr(searchValue);
            const regEx = /(\d{3})(\d{3,4})(\d{4})/; // 하이픈 정규식
            searchValue = searchValue.replace(regEx, "$1-$2-$3");
        }

        // 요청 parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey === 'searchKey') {
                item.urlVal = searchKey;
            } else if (item.urlKey === 'searchValue') {
                item.urlVal = searchValue;
            }
        });

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href', "/companyChart?" + url);
    }

    // 문자 제거 Only 숫자
    function minusStr(value) {
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

    // url parameter 세팅
    function settingUrl(urlArray) {
        let url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        urlArray.push({urlKey: 'employeeCode', urlVal: $('._employee_select').val()});

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function (index, item) {
            if (typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null) {
                url += "&" + item.urlKey + "=" + item.urlVal;
            }
        })

        // 맨 앞 '&' 제거
        return url.substring(1);
    }

    //검색버튼 클릭 시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchEmployee();
    });

    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode === 13) {
            searchEmployee();
        }
        /*
                // 스페이스바 즉, 공백 포함 못 하게 할 경우 아래 코드 주석 해제
                else if(window.event.keyCode === 32){
                    const searchStr = $(this).val().replace(' ', '');
                    $(this).val(searchStr);
                }
        */
    });


    const departmentCode = $("#getDepartmentCode").val();

    if (departmentCode === 'D') {
        $('._group_list').removeAttr('hidden');
        $('._group_management').attr('hidden', true);
    } else {
        $('._group_management').removeAttr('hidden');
        $('._group_list').attr('hidden', true);
    }

    // url parameter 숨김 처리
    // history.replaceState({}, null, location.pathname);

    // 사원 클릭 시 사원 정보 보기로 이동
    $(document).on('click', '.group_sub_title > li', function () {
        const employeeCode = $(this).parent().attr('value');
        const departmentCode = $('#departmentCode').val();
        const searchKey = $('#searchKey').val();
        const searchValue = $('#searchValue').val();
        if (!$(this).hasClass('sub_first_txt') && typeof employeeCode != 'undefined' && employeeCode !== '' && employeeCode != null) {
            const url = "/companyChart/employeeInfo?employeeCode=" + employeeCode + "&departmentCode=" + departmentCode + "&searchKey=" + searchKey + "&searchValue=" + searchValue;
            $(location).attr('href', url);
        }
    });

    /* 재직 구분 라디오 START *//* 재직 구분 라디오 START *//* 재직 구분 라디오 START */
    // 재직 구분 체크 유지
    let isResign = $('#isResign').val();
    let checkIndex = $('input[type=radio][name=check]').index('0');
    if (typeof isResign != 'undefined' && isResign !== '' && isResign != null) {
        const checkedRadio = $('input[type=radio][name=check][value=' + isResign + ']');
        checkedRadio.attr('checked', 'checked');

        checkIndex = $('input[type=radio][name=check]').index(checkedRadio);
    }

    $('._radio_box span').removeClass('onon');
    $('._radio_box span').eq(checkIndex).addClass('onon');
    $('._radio_box label').removeClass('onon2');
    $('._radio_box label').eq(checkIndex).addClass('onon2');
    $('._radio_box').prop('hidden', false);

    // 라디오 버튼 change 이벤트
    $('input[type=radio][name=check]').on('change', function () {
        changeResignStatus($(this).attr('value'));
    });

    // 라디오 버튼 옆 글자 클릭 이벤트
    $('._isResign').on('click', function () {
        changeResignStatus($(this).attr('value'));
    });

    // 재직 구분 변경 실행 함수
    function changeResignStatus(isResign) {
        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey === 'isResign') item.urlVal = isResign;
        });

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href', "/companyChart?" + url);
    }

    // 처리 실패 메세지
    if ($('#isSuccess').val() === 'false') {
        const message = $('#message').val();
        alert(message);
    }
});