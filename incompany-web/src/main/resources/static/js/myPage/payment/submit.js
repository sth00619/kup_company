$(document).ready(function () {

    // 페이징
    var nextPageNum = parseInt($('#nextPage').val()); // 다음 페이지
    var prePageNum = parseInt($('#prePage').val()); // 이전 페이지
    var pageNum = 1; // 페이지 default
    var status = $('#status').val();
    var keyword = $('#keyword').val();
    var searchType = $(".select_box option:selected").val();



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


        $(location).attr('href', "/myPage/payment/submit?" +
            "pageNum=" + pageNum +
            '&status=' + status +
            '&searchType=' + searchType +
            '&keyword=' + keyword

        );


    });

    // 검색
    $(document).on('click', '._searchBtn', function () {

        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        location.href = '/myPage/payment/submit?searchType=' + searchType + '&keyword=' + keyword + "&status=" + status;
    });

    $(document).on('keydown', '#keyword', function (keyNum) {
        var keyword = $('#keyword').val()
        var searchType = $(".select_box option:selected").val();
        if (keyNum.keyCode == 13) {

            location.href = '/myPage/payment/submit?searchType=' + searchType + '&keyword=' + keyword + "&status=" + status;

        }

    })



    $('._paymentList').on('click', function () {

        var paymentNo = $(this).attr('value');
        location.href = "/myPage/payment/contents?paymentNo=" + paymentNo;

    });

    $(document).on('click', '._status', function (e) {
        var status = $(this).prev().val();

        console.log(status);

        if(status == 'all'){
            location.href="/myPage/payment/submit";

        }else{
            location.href="/myPage/payment/submit?status="+status;

        }
    });



})