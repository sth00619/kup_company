$(document).ready(function () {

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    var urlArray = [{
        urlKey: 'orderBy',
        urlVal: $('#orderBy').val()
    }, {
        urlKey: 'searchKey',
        urlVal: $('#searchKey').val()
    }, {
        urlKey: 'searchValue',
        urlVal: $('#searchValue').val()
    }, {
        urlKey: 'assignStatus',
        urlVal: $('#assignStatus').val()
    }];

    // url parameter 세팅
    function settingUrl(urlArray) {
        var url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        urlArray.push({
            urlKey: 'employeeCode',
            urlVal: $('._employee_select').val()
        }, {
            urlKey: 'departmentCode',
            urlVal: $('#getDepartmentCode').val()
        });

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function (index, item) {
            if (typeof item.urlVal != 'undefined' && item.urlVal != '' && item.urlVal != null) {
                url += "&" + item.urlKey + "=" + item.urlVal;
            };
        })

        // 맨 앞 '&' 제거
        return url.substring(1);
    }

    /* 할당 미할당 전체보기 라디오 START */
    /* 할당 미할당 전체보기 라디오 START */
    /* 할당 미할당 전체보기 라디오 START */ /* 할당 미할당 전체보기 라디오 START */
    // 할당, 미할당, 전체보기 체크 유지
    var assignStatus = $('#assignStatus').val();
    var checkIndex = $('input[type=radio][name=check]').index('notAssigned');
    if (typeof assignStatus != 'undefined' && assignStatus != '' && assignStatus != null) {
        var checkedRadio = $('input[type=radio][name=check][value=' + assignStatus + ']');
        checkedRadio.attr('checked', 'checked');

        checkIndex = $('input[type=radio][name=check]').index(checkedRadio);
    }

    $('.check_box span').removeClass('onon');
    $('.check_box span').eq(checkIndex).addClass('onon');
    $('.check_box label').removeClass('onon2');
    $('.check_box label').eq(checkIndex).addClass('onon2');

    // 라디오 버튼 change 이벤트
    $('input[type=radio][name=check]').on('change', function () {
        assignStatus = this.value;

        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'assignStatus') item.urlVal = assignStatus;
        });

        // url 문자열 세팅
        var url = settingUrl(urlArray);

        $(location).attr('href', "/potential/potentialManage?" + url);
    });

    // 라디오 버튼 옆 글자 클릭 이벤트
    $('._check_assign').on('click', function () {
        assignStatus = $(this).attr('value');

        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'assignStatus') item.urlVal = assignStatus;
        });

        // url 문자열 세팅
        var url = settingUrl(urlArray);

        $(location).attr('href', "/potential/potentialManage?" + url);
    });

    /* 할당 회수 이벤트 */
    /* 할당 회수 이벤트 */
    /* 할당 회수 이벤트 */ /* 할당 회수 이벤트 */ /* 할당 회수 이벤트 */ /* 할당 회수 이벤트 */

    // 할당 버튼 클릭 시
    $('#_allocationBtn').on('click', function () {
        var potentialUserNo = getPotentialUserNo();

        var getDepartmentCode = $('#getDepartmentCode').val();
        var getEmployeeCode = $('._employee_select').val();

        if (typeof getEmployeeCode != 'undefined' && getEmployeeCode != '' && getEmployeeCode != null) {
            if (typeof potentialUserNo != 'undefined' && potentialUserNo != '' && potentialUserNo != null) {
                // url parameter 추가
                urlArray.push({
                    urlKey: 'pageNum',
                    urlVal: $('#pageNum').val()
                });

                // url 문자열 세팅
                var url = settingUrl(urlArray);

                $(location).attr('href', "/potential/allocationPotentialUser?" + url + potentialUserNo);
            } else {
                alert('잠재고객을 선택해 주세요.');
            }
        } else {
            alert('담당자를 선택해 주세요.');
        }
    });

    // 회수 버튼 클릭 시
    $('#_notAllocationBtn').on('click', function () {
        var potentialUserNo = getPotentialUserNo();
        var potentialUserList = getPotentialUserList();

        $.ajax({
            url: '/contractFortune/count',
            method: 'GET',
            data: {
                "potentialUserList": potentialUserList
            },
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (data) {
                if (data != 0) {
                    alert('목돈 혹은 보험에 가입되어있습니다');
                    return false;


                }

                if (typeof potentialUserNo != 'undefined' && potentialUserNo != '' && potentialUserNo != null) {
                    // url parameter 추가
                    urlArray.push({
                        urlKey: 'pageNum',
                        urlVal: $('#pageNum').val()
                    });

                    // url 문자열 세팅
                    var url = settingUrl(urlArray);
                    $(location).attr('href', "/potential/notAllocationPotentialUser?" + url + potentialUserNo);
                } else {
                    alert('잠재고객을 선택해 주세요.');
                }
            }
        })



    });

    function getPotentialUserList() {
        var potentialUserNo = [];
        $('._sub_check:checked').each(function () {
            potentialUserNo.push($(this).parents('._sub_ul').find('.potentialUserNo').attr('value'));
        });
        return potentialUserNo;
    };

    /* 잠재고객 리스트 체크박스 구현 START */
    /* 잠재고객 리스트 체크박스 구현 START */
    /* 잠재고객 리스트 체크박스 구현 START */ /* 잠재고객 리스트 체크박스 구현 START */
    // 체크 되어 있는 잠재고객
    function getPotentialUserNo() {
        var potentialUserNo = '';
        $('._sub_check:checked').each(function () {
            potentialUserNo += "&potentialUserNo=" + $(this).parents('._sub_ul').find('.potentialUserNo').attr('value');
        });
        return potentialUserNo;
    };

    // 잠재고객 체크 유지
    $('._sub_check:checked').each(function () {
        var f = $('._sub_check').index(this);
        $('.sub_first_txt > label').eq(f).css({
            background: '#304260'
        });
    });

    /* 정렬 기준에 따라 정렬 */
    /* 정렬 기준에 따라 정렬 */
    /* 정렬 기준에 따라 정렬 */ /* 정렬 기준에 따라 정렬 */ /* 정렬 기준에 따라 정렬 */
    // 정렬 기준에 따라 조회
    $('#potentialUserNo, #departmentName, #employeeName').on('click', function () {

        var orderBy = $(this).attr('id');

        // url parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'orderBy') item.urlVal = orderBy;
        });

        // url 문자열 세팅
        var url = settingUrl(urlArray);

        $(location).attr('href', "/potential/potentialManage?" + url);
    });

    /* 검색 구현 */
    /* 검색 구현 */
    /* 검색 구현 */ /* 검색 구현 */ /* 검색 구현 */ /* 검색 구현 */ /* 검색 구현 */ /* 검색 구현 */
    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchContractFortune();
    });

    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode == 13) {
            searchContractFortune();
        } else if (window.event.keyCode == 32) {
            var searchStr = $(this).val().replace(' ', '');
            $(this).val(searchStr);
        }
    });

    // 날짜 형식 체크를 위한 enum 의 날짜 형식들의 meaning 배열 세팅
    var dateArr = [];
    $.each($('._searchKey').children(), function () {
        if ($(this).data('isdate')) {
            dateArr.push($(this).text());
        }
    })

    // 날짜 형식으로 입력하도록 input type 변경 -> type="date"
    $('._searchKey').on('change', function () {
        var searchKey = $(this).val();
        var searchValue = $('._searchValue');

        changeDateType(searchKey, searchValue);
        searchValue.val('');
    });

    // 페이지 로드 시 타입 체크
    var searchKey = $('._searchKey').val();
    var searchValue = $('._searchValue');
    var dateValue = $('._searchValue').attr('value');

    changeDateType(searchKey, searchValue);
    $('._searchValue').val(dateValue);

    // 검색 type 변환
    function changeDateType(searchKey, searchValue) {
        if (dateArr.indexOf(searchKey) != -1) {
            searchValue.attr('type', 'date');
        } else {
            searchValue.attr('type', 'text');
        }
    }

    // 검색 실행 함수
    function searchContractFortune() {
        var searchValue = $('._searchValue').val();
        var searchKey = $('._searchKey').val();

        // 날짜형식 정규식 검사
        if (searchValue != '' && dateArr.indexOf(searchKey) != -1) {
            var dateRegex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
            if (!dateRegex.test(searchValue)) {
                alert('형식에 맞게 입력해 주세요. \n ex) 2022-01-01');
                $('._searchValue').focus();
                return false;
            }
        } else if (searchKey == '이자구분') {
            searchValue = searchValue.substring(0, 1);
            if (searchValue == '연') {
                searchValue = 'Y';
            } else if (searchValue == '월') {
                searchValue = 'M';
            } else {
                searchValue = '';
                searchKey = '';
            }
        }

        // 요청 parameter 값 변경
        $.each(urlArray, function (index, item) {
            if (item.urlKey == 'searchKey') {
                item.urlVal = searchKey;
            } else if (item.urlKey == 'searchValue') {
                item.urlVal = searchValue;
            }
        });

        // url 문자열 세팅
        var url = settingUrl(urlArray);
        $(location).attr('href', "/potential/potentialManage?" + url);
    }

    /* 잠재고객관리 관련 기타 스크립트 구현 START */
    /* 잠재고객관리 관련 기타 스크립트 구현 START */
    /* 잠재고객관리 관련 기타 스크립트 구현 START */

    // 처리 결과 메세지
    var message = $('#message').val();
    if (typeof message != 'undefined' && message != '' && message != null) alert(message);

    $('._top_left_menu').removeAttr('hidden');

    // url parameter 숨김 처리
    history.replaceState({}, null, location.pathname);

});

// url parameter 숨김 처리
// history.replaceState({}, null, location.pathname);