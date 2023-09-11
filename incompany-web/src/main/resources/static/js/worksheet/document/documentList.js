$(document).ready(function(){
    // 처리 결과 메세지
    var message = $('#message').val();
    if(typeof message != 'undefined' && message != '' && message != null) alert(message);

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    let urlArray = [{ urlKey : 'searchKey', urlVal : $('#searchKey').val() }
                  , { urlKey : 'searchValue', urlVal : $('#searchValue').val() }
                  , { urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() }
                  , { urlKey : 'employeeCode', urlVal : $('#getEmployeeCode').val() }];


    // url parameter 세팅
    function settingUrl(urlArray){
        let url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        /*urlArray.push({ urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() });*/

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function(index, item){
            if(typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null){
                url += "&"+item.urlKey+"="+item.urlVal;
            }
        });

        // 맨 앞 '&' 제거
        return url.substring(1);
    }

    //ul 클릭 시 경로 이동
    $(document).on('click', '._documentList > li', function(){
        const workLogNo = $(this).parent().attr('value');
            const url = "/worksheet/document/documentInfo?workLogNo=" + workLogNo;
            $(location).attr('href',url);
    });
    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchCategory();
    });
    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode === 13) {
            searchCategory();
        }else if(window.event.keyCode === 32){
            const searchStr = $(this).val().replace(' ', '');
            $(this).val(searchStr);
        }
    });
    // 검색 조건 변경 시 적절한 타입으로 변경
    $('._searchKey').on('change', function(){
        $('._searchValue').val('');
        // 날짜 형식인 경우 date 타입으로 변경
        changeDateType($(this).val());
    });

    // 날짜 형식 체크를 위한 enum 의 날짜 형식들의 meaning 배열 세팅
    let dateArr = [];
    $.each($('._searchKey').children(), function(){
        if($(this).data('isdate')){
            dateArr.push($(this).text());
        }
    })
    // 첫 로드 시 검색 조건이 날짜 형식인 경우 date 타입으로 변경
    changeDateType($('._searchKey').val());

    // 날짜 형식으로 입력하도록 input type 변경 -> type="date"
    function changeDateType(searchKey){
        const searchValue = $('._searchValue');

        if(dateArr.indexOf(searchKey) !== -1){
            searchValue.attr('type', 'date');
        }else {
            searchValue.attr('type', 'text');
        }
    }

    // 검색 실행 함수
    function searchCategory(){
        let searchValue = $('._searchValue').val();
        let searchKey = $('._searchKey').val();

        // 날짜형식 정규식 검사
        if(searchValue !== '' && dateArr.indexOf(searchKey) !== -1){
            const dateRegex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
            if(!dateRegex.test(searchValue)){
                alert('형식에 맞게 입력해 주세요. \n ex) 2022-01-01');
                $('._searchValue').focus();
                return false;
            }else {
                $('#createDate').prop('value', searchValue);
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

        // url 문자열 세팅
        const url = settingUrl(urlArray);

        $(location).attr('href',"?"+url);
    }




})