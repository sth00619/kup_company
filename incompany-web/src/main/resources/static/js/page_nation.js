$(document).ready(function () {
    /* middle_page_nation.html 과 js 공유 중 - css 클래스명만 다름 */

    /* URL PARAMETER 세팅 *//* URL PARAMETER 세팅 *//* URL PARAMETER 세팅 *//* URL PARAMETER 세팅 *//* URL PARAMETER 세팅 */
    /*
     *  페이지 이동 시 유지 시켜야 할 데이터 세팅
     *  추가로 세팅해야할 값이 있다면 아래 배열에 객체 추가
     *  urlVal 에 값이 없으면 해당 urlKey 는 빼고 요청함
     */
    const urlArray = [{urlKey: 'orderBy', urlVal: $('#orderBy').val()}
        , {urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}
        , {urlKey: 'assignStatus', urlVal: $('#assignStatus').val()}];

    // url parameter 세팅
    function settingUrl(urlArray, pageNum) {
        let url = '';

        let startDate = $('._search_start_date').val();
        let endDate = $('._search_end_date').val();
        if(typeof startDate === 'undefined' || startDate === '' || startDate === null){
            startDate = $('#startDate').val();
            endDate = $('#endDate').val();
        }

        // url parameter 추가
        urlArray.push({ urlKey : 'pageNum', urlVal :  pageNum }
                    , { urlKey : 'employeeCode', urlVal : $('._employee_select').val() }
                    , { urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() }
                    , { urlKey : 'startDate', urlVal : startDate }
                    , { urlKey : 'endDate', urlVal : endDate }
                    , { urlKey : 'isResign', urlVal :  $('#isResign').val() }
                    , { urlKey : 'requestDate', urlVal : $('#requestDate').val() });

        // parameter 객체 중복 제거
        urlArray = [...new Set(urlArray.map(JSON.stringify))].map(JSON.parse);

        // 값이 있는 parameter 만 url 에 세팅
        $.each(urlArray, function (index, item) {
            if (typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null) {
                url += "&" + item.urlKey + "=" + item.urlVal;
            }
        });

        /*
         *  현제 경로 추출
         *  ex) /contractFortune/contractFortune
         */
        const pathName = $(location).attr('pathname');

        url = pathName + '?' + url.substring(1);

        return url;
    }

    /* 페이징 이벤트 *//* 페이징 이벤트 *//* 페이징 이벤트 *//* 페이징 이벤트 *//* 페이징 이벤트 *//* 페이징 이벤트 *//* 페이징 이벤트 */
    $("._page").children('a').on('click', function (e) {
        const thisPage = $(this);
        /*
         *  페이징에 필요한 값 세팅
         *  필수로 세팅 해야함
         */
        const nextPageNum = parseInt($('#nextPage').val());       // 다음 페이지
        const prePageNum = parseInt($('#prePage').val());         // 이전 페이지
        let pageNum = 1;                                        // 페이지 default

        //pageNum setting
        if (thisPage.hasClass('_a_page')) {
            pageNum = thisPage.text();
        } else if (thisPage.hasClass('_a_first')) {
            pageNum = 1;
        } else if (thisPage.hasClass('_a_pre')) {
            if (prePageNum === 1) {
                pageNum = prePageNum
            } else {
                pageNum = (prePageNum - 1);
            }
        } else if (thisPage.hasClass('_a_next')) {
            pageNum = (nextPageNum + 1);
        } else if (thisPage.hasClass('_a_last')) {
            pageNum = $('#pages').val();
        }

        // url 문자열 세팅
        const url = settingUrl(urlArray, pageNum);

        $(location).attr('href', url);
    });

    /* 페이징 관련 설정 *//* 페이징 관련 설정 *//* 페이징 관련 설정 *//* 페이징 관련 설정 *//* 페이징 관련 설정 *//* 페이징 관련 설정 */

    // <li> 영역 클릭 시 하위 <a> 강제 클릭
    $('._page').on('click', function () {
        $(this).children('a').get(0).click();
    });

    // 다음 or 이전 페이지 없을 때 버튼 숨김 및 class 삭제
    const disabled = $('.disabled');
    disabled.children('a').removeAttr('class');
    disabled.attr('hidden', true);
})