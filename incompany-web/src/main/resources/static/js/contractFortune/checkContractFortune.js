$(document).ready(function(){

    // AS-IS : 목돈 계약 클릭 -> 목돈 상세 페이지 진입 -> 뒤로가기 -> 계약확인 -> 계약확인 됨
    // TO-BE : 목돈 계약 클릭 -> 목돈 상세 페이지 진입 -> 뒤로가기 -> 계약확인 -> '목돈 계약을 선택해 주세요' 얼럿떠야함
    // 해결방법 : 페이지 로드 시 아래 함수 호출하여 리스트 영역만 새로고침 - 새로고침 하면 checked 가 해제 됨
    reloadList();

    function reloadList() {
        $('.contract_sub_txt').load(location.href+' .contract_sub_txt');
    }

    let getDepartmentCode = $('#getDepartmentCode').val();

    if(getDepartmentCode.length === 7){
        $('#getTeamCode').val(getDepartmentCode);
    }

    // 계약 선택 시 계약 상세 보기 이동
    $(document).on('click', '._contract_sub_title > li', function(){
        const contractCode = $(this).parent().attr('value');
        const isPublic = $('#isPublic').val();
        if(!$(this).hasClass('_checkbox_li') && typeof contractCode != 'undefined' && contractCode !== '' && contractCode != null){
            const url = "/contractFortune/contractFortuneInfo?contractCode=" + contractCode + "&isPublic=" + isPublic;
            $(location).attr('href',url);
        }
    });

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    const urlArray = [{urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}];

    // url parameter 세팅
    function settingUrl(urlArray){
        let url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        urlArray.push({ urlKey : 'employeeCode', urlVal : $('._employee_select').val() }
                    , { urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() });

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function(index, item){
            if(typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null){
                url += "&"+item.urlKey+"="+item.urlVal;
            }
        });

        // 맨 앞 '&' 제거
        return url.substring(1);
    }

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchContractFortune();
    });

    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode === 13) {
            searchContractFortune();
        }else if(window.event.keyCode === 32){
            const searchStr = $(this).val().replace(' ', '');
            $(this).val(searchStr);
        }
    });


    // 날짜 형식 체크를 위한 enum 의 날짜 형식들의 meaning 배열 세팅
    let dateArr = [];
    $.each($('._searchKey').children(), function(){
        if($(this).data('isdate')){
            dateArr.push($(this).text());
        }
    })

    // 날짜 형식으로 입력하도록 input type 변경 -> type="date"
    $('._searchKey').on('change', function(){
        let searchKey = $(this).val();
        let searchValue = $('._searchValue');

        if(dateArr.indexOf(searchKey) !== -1){
            searchValue.attr('type', 'date');
        }else {
            searchValue.attr('type', 'text');
        }

        searchValue.val('');
    });

    // 검색 실행 함수
    function searchContractFortune(){
        let searchValue = $('._searchValue').val();
        let searchKey = $('._searchKey').val();

        // 날짜형식 정규식 검사
        if(searchValue !== '' && dateArr.indexOf(searchKey) !== -1){
            const dateRegex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
            if(!dateRegex.test(searchValue)){
                alert('형식에 맞게 입력해 주세요. \n ex) 2022-01-01');
                $('._searchValue').focus();
                return false;
            }
        }else if(searchKey === '이자구분') {
            searchValue = searchValue.substring(0,1);
            if(searchValue === '연'){
                searchValue = 'Y';
            } else if(searchValue === '월') {
                searchValue = 'M';
            }else {
                searchValue = '';
                searchKey   = '';
            }
        }

        // 요청 parameter 값 변경
        $.each(urlArray, function(index, item){
            if(item.urlKey === 'searchKey') {
                item.urlVal = searchKey;
            }else if(item.urlKey === 'searchValue') {
                item.urlVal = searchValue;
            }
        });

        const startDate = $('._search_start_date').val();
        const endDate = $('._search_end_date').val();
        if(startDate !== '' ){
            if(endDate !== ''){
                urlArray.push({ urlKey : 'startDate', urlVal : startDate},
                              { urlKey : 'endDate', urlVal : endDate });
            }else{
                alert('마지막 날짜를 선택해 주세요.');
                return false;
            }
        }

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href',"/contractFortune/checkContractFortune?"+url);
    }

    // 계약 확인 버튼 구현
    $('._check_contract').on('click', function(){
        const contractCodeList = getCheckContractCodeList();

        if(typeof contractCodeList != 'undefined' && contractCodeList !== '' && contractCodeList != null) {
            // url parameter 추가
            urlArray.push({ urlKey : 'pageNum', urlVal : $('#pageNum').val()});

            // url 문자열 세팅
            const url = settingUrl(urlArray);
            $(location).attr('href',"/contractFortune/updateCheckContract?"+url+contractCodeList);

        } else {
            alert('목돈 계약을 선택해 주세요.');
        }
    });

    // 계약 확인 버튼 구현
    $('._check_private_contract').on('click', function(){
        const contractCodeList = getCheckContractCodeList();

        if(typeof contractCodeList != 'undefined' && contractCodeList !== '' && contractCodeList != null) {
            // url parameter 추가
            urlArray.push({ urlKey : 'pageNum', urlVal : $('#pageNum').val()});

            // url 문자열 세팅
            const url = settingUrl(urlArray);
            $(location).attr('href',"/contractFortune/updatePrivateCheckContract?"+url+contractCodeList);

        } else {
            alert('목돈 계약을 선택해 주세요.');
        }
    });

    function getCheckContractCodeList(){
        let contractCodeList = '';
        $('._sub_check:checked').each(function() {
            contractCodeList += "&contractCodeList="+$(this).parents('._sub_ul').attr('value');
        });
        return contractCodeList;
    }

    $('._top_left_menu').removeAttr('hidden');

    // 처리 실패 메세지
    if ($('#isSuccess').val() === 'false') {
        const message = $('#message').val();
        if(typeof message != 'undefined' && message != '' && message != null) alert(message);
    }

    // url parameter 숨김 처리
    // history.replaceState({}, null, location.pathname);
});



