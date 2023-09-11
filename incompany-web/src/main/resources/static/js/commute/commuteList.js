$(document).ready(function () {
    function settingUrl() {
        let url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        const urlArray = [{ urlKey : 'employeeCode', urlVal : $('._employee_select').val() }
                    , { urlKey : 'categoryNo', urlVal : $('._category_select').val() }];

        const startDate = $('._search_start_date').val();
        const endDate = $('._search_end_date').val();

        if (typeof startDate != 'undefined' && startDate !== '' && startDate != null) {
            if (typeof endDate != 'undefined' && endDate !== '' && endDate != null) {
                urlArray.push({urlKey: 'startDate', urlVal: startDate},
                    {urlKey: 'endDate', urlVal: endDate});
            } else {
                alert('마지막 날짜를 선택해 주세요.');
                return false;
            }
        }

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

    // 작성자, 카테고리 선택 시 list 조회
    $(document).on('change', '._employee_select, ._category_select', function(){
        let url = settingUrl();
        if (typeof url === 'string'){
            $(location).attr('href', url);
        }
    });

    $('._searchTime').click(function(){
        let url = settingUrl();
        if (typeof url === 'string'){
            $(location).attr('href', url);
        }
    });
});