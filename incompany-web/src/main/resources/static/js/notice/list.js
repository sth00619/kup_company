$(document).ready(function () {

    var keyword = $('#keyword').val();
    var searchType = $(".select_box option:selected").val();
    var type = $('#type').val();
    var DATE_TIME_CHECK = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;

    // 처리 결과 메세지
    var message = $('#message').val();
    if(typeof message != 'undefined' && message != '' && message != null) alert(message);

    if (searchType == 'createDate') {
        $('#keyword').attr('placeholder', 'yyyy-mm-dd')
    }
    $(document).on('change', '.select_box', function () {

        var searchType = $(".select_box option:selected").val();
        if (searchType == 'createDate') {
            $('#keyword').attr('placeholder', 'yyyy-mm-dd')
        }else{
            $('#keyword').attr('placeholder', '')

        }
    })

    // <li> 영역 클릭 시 하위 <a> 강제 클릭
    $('._page').on('click', function () {
        $(this).children('a').get(0).click();
    });

    // 다음 or 이전 페이지 없을 때 버튼 숨김 및 class 삭제
    $('.disabled').children('a').removeAttr('class');
    $('.disabled').attr('hidden', true);


    var page = $('._page').children('a');
    //    $('._a_first, ._a_pre, ._a_page, ._a_next, ._a_last').on('click', function(){

    page.on('click', function () {


        /*
         *  페이징에 필요한 값 세팅
         *  필수로 세팅 해야함
         */
        var nextPageNum = parseInt($('#nextPage').val()); // 다음 페이지
        var prePageNum = parseInt($('#prePage').val()); // 이전 페이지
        var pageNum = 1; // 페이지 default

        //pageNum setting
        if ($(this).hasClass('_a_page')) {
            pageNum = $(this).text();
        } else if ($(this).hasClass('_a_first')) {
            pageNum = 1;
        } else if ($(this).hasClass('_a_pre')) {
            if (prePageNum == 1) {
                pageNum = prePageNum
            } else {
                pageNum = (prePageNum - 1);
            }
        } else if ($(this).hasClass('_a_next')) {
            pageNum = (nextPageNum + 1);
        } else if ($(this).hasClass('_a_last')) {
            pageNum = $('#pages').val();
        }

        if(type == null){
            $(location).attr('href', "/notice/list?" +
            "pageNum=" + pageNum +
            "&searchType=" + searchType +
            '&keyword=' + keyword

        );
        }else{
            $(location).attr('href', "/notice/list?" +
            "pageNum=" + pageNum +
            "&type=" + type +
            "&searchType=" + searchType +
            '&keyword=' + keyword

        );
        }

    });

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function (e) {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();
        if (searchType == 'createDate') {
            if (!DATE_TIME_CHECK.test(keyword)) {
                alert("날짜는 yyyy-mm-dd 형식으로 입력해주세요.");
                return false;
            } else {
                location.href = '/notice/list?type=' + type + '&searchType=' + searchType + '&keyword=' + keyword;
            }
        } else {
            location.href = '/notice/list?type=' + type + '&searchType=' + searchType + '&keyword=' + keyword;
        }

    });

    // input에서 엔터 쳤을때 검색 실행
    $(document).on('keydown', '#keyword', function (keyNum) {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        if (keyNum.keyCode == 13) {
            if (searchType == 'createDate') {
                if (!DATE_TIME_CHECK.test(keyword)) {
                    alert("날짜는 yyyy-mm-dd 형식으로 입력해주세요.");
                    return false;

                } else {
                    location.href = '/notice/list?type=' + type + '&searchType=' + searchType + '&keyword=' + keyword;
                }
            } else {
                location.href = '/notice/list?type=' + type + '&searchType=' + searchType + '&keyword=' + keyword;
            }
        }

    })

});