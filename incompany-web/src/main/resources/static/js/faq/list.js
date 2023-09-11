//toast UI
const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

$(document).ready(function () {


    $('._viewer').each(function (index, item) {


        var tdContents = $('._contents').eq(index).text();


        Editor.factory({
            el: item,
            viewer: true,
            initialValue: tdContents,
            plugins: [tableMergedCell, colorSyntaxPlugin]
        });

    })


    // var searchTitle = $('#searchTitle').val();
    var searchTitle = "";

    var type = $('#type').val();



    // <li> 영역 클릭 시 하위 <a> 강제 클릭
    $('._page').on('click', function () {
        $(this).children('a').get(0).click();
    });

    // // 다음 or 이전 페이지 없을 때 버튼 숨김 및 class 삭제
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

        $(location).attr('href', "/faq/list?" +
            "pageNum=" + pageNum +
            "&type=" + type +
            "&title=" + searchTitle

        );
    });

    $(document).on('click', '#typeA', function () {
        $(location).attr('href', "/faq/list");
    })

    $(document).on('click', '#typeZ', function () {
        $(location).attr('href', "/faq/list?type=0");
    })
    $(document).on('click', '#typeF', function () {
        $(location).attr('href', "/faq/list?type=1");
    })
    $(document).on('click', '#typeS', function () {
        $(location).attr('href', "/faq/list?type=2");
    })
    $(document).on('click', '#typeL', function () {
        $(location).attr('href', "/faq/list?type=3");
    })

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        var searchTitle = $('#searchTitle').val();
        location.href = '/faq/list?type=' + type + '&title=' + searchTitle;
    });
    $(document).on('keydown', '#searchTitle', function (keyNum) {
        var searchTitle = $('#searchTitle').val();
        if (keyNum.keyCode == 13) {
            location.href = '/faq/list?type=' + type + '&title=' + searchTitle;
        }



    })


    $('.faq_txt span').click(function () {

        $('.faq_sub_txt').slideUp();

        if ($(this).next().css("display") == "none") {
            $(this).next().stop().slideDown(300);
        } else {
            $(this).next().stop().slideUp(300);
        }

    });


    $(document).on('click', '#deleteFaq', function () {

        var deleteFaqNo = $(this).next().val();
        var ans = confirm("삭제하시겠습니까?")
        if (ans) {
            $.ajax({
                type: "DELETE",
                url: "deleteFaq",
                data: {
                    "faqNo": deleteFaqNo
                },
                success: function () {
                    location.reload();
                }

            }).fail(function () {
                alert("삭제에 실패했습니다.");
                return false;
            })
        }


    });


});