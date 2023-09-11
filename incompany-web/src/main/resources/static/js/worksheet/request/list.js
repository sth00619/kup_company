$(document).ready(function () {

    var keyword = $('#keyword').val();
    var searchType = $(".select_box option:selected").val();
    var loginEmployee = $('#employeeLoginCode').val();
    var DATE_TIME_CHECK = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    var state = $('#state').val();


    $('._state').each(function () {
        var state = $(this).val();
        switch (state) {
            case '0':
                $(this).closest('.state_click').addClass('expected');
                break;
            case '1':
                $(this).closest('.state_click').addClass('ing');
                break;
            case '2':
                $(this).closest('.state_click').addClass('finish');
                break;
            case '3':
                $(this).closest('.state_click').addClass('keep');
                break;

        };

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


        $(location).attr('href', "/worksheet/request/list?" +
            "pageNum=" + pageNum +
            "&searchType=" + searchType +
            '&keyword=' + keyword+
            '&state=' + state

        );


    });



    ///////////////// 검색 /////////////

    if (searchType == 'createDate') {
        $('#keyword').attr('placeholder', 'yyyy-mm-dd')
    }

    $(document).on('change', '.select_box', function () {

        var searchType = $(".select_box option:selected").val();
        $('#keyword').val('');
        if (searchType == 'requestDate') {
            $('#keyword').attr('placeholder', 'yyyy-mm-dd')
        }else{
            $('#keyword').attr('placeholder', '검색')

        }
    })


    $(document).on('click', '.interest', function (e) {
            var state = $(this).children().first().val();
            if(state == 'all'){
                location.href="/worksheet/request/list";

            }else{
                location.href="/worksheet/request/list?state="+state;

            }

    })

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function (e) {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        if (searchType == 'requestDate') {
            if (!DATE_TIME_CHECK.test(keyword)) {
                alert("날짜는 yyyy-mm-dd 형식으로 입력해주세요.");
                return false;
            } else {
                location.href = '/worksheet/request/list?searchType=' + searchType + '&keyword=' + keyword + '&state=' + state;
            }
        } else {
            location.href = '/worksheet/request/list?searchType=' + searchType + '&keyword=' + keyword + '&state=' + state;
        }

    });


    // input에서 엔터 쳤을때 검색 실행
    $(document).on('keydown', '#keyword', function (keyNum) {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        if (keyNum.keyCode == 13) {
            if (searchType == 'requestDate') {
                if (!DATE_TIME_CHECK.test(keyword)) {
                    alert("날짜는 yyyy-mm-dd 형식으로 입력해주세요.");
                    return false;

                } else {
                    location.href = '/worksheet/request/list?searchType=' + searchType + '&keyword=' + keyword + '&state=' + state;
                }
            } else {
                location.href = '/worksheet/request/list?searchType=' + searchType + '&keyword=' + keyword + '&state=' +state ;
            }
        }

    });




    $(document).on('click', '._stateVal', function () {

        var state = $(this).attr('value');
        var requestNo = $(this).closest('.state_viewbox').find('._requestNo').val();

        var data = {
            "requestNo": requestNo,
            "state": state
        }


        $.ajax({
            type: "PUT",
            url: "/worksheet/request/editState",
            data: data,
            success: function () {
                location.reload();
            }

        }).fail(function () {
            alert("수정에 실패하셨습니다");
            return false;
        });



    });
    $(document).on('click', '#allocationBtn', function () {

        var requestNo = getCheckedRequestNo();
        var responseEmployee = $('._employee_select').val();
        var mainUrl = $('#_currentBoardUrl').val();

        var data = {
            "responseEmployeeCode": responseEmployee,
            "requestNo": requestNo,
            "mainUrl" : mainUrl
        }

        if (typeof responseEmployee == 'undefined' || responseEmployee == '' || responseEmployee == null) {
            alert('담당자를 선택해 주세요.');
            return false;
        }
        if (typeof requestNo == 'undefined' || requestNo == '' || requestNo == null) {
            alert('업무요청을 선택해주세요');
            return false;
        }

        $.ajax({
            type: "PUT",
            url: "/worksheet/request/updateResponseEmployee",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
            success: function () {
                location.reload();
            }

        }).fail(function () {
            alert("담담자 할당에 실패하셨습니다");
            return false;
        });



    })

    function getCheckedRequestNo() {
        var requestNo = [];
        $('input:checked[name="checkRequest"]').each(function () {

            requestNo.push($(this).closest('._sub_ul').find('._pRequestNo').find('._requestNo').text());
        });
        return requestNo;
    };


    var full = 0;
    $(document).on('click', '._main_first_txt', function (e) {
        // 이벤트 중복 방지
        e.preventDefault();

        $(this).toggleClass('check');
        // 클릭 시 전체 박스 선택 및 해제
        if ($(this).hasClass('check')) {
            $('._main_first_txt > label').removeClass('_unCheck');
            $('._main_first_txt > label').addClass('_check');
        } else {
            $('._main_first_txt > label').addClass('_unCheck');
            $('._main_first_txt > label').removeClass('_check');
        }

        $('._sub_check').parent('li').toggleClass('check');

        if (full == 0) {
            $('._sub_check').attr('checked', true);
            $('._sub_first_txt > label').addClass('_check');
            $('._sub_first_txt > label').removeClass('_unCheck');
            $('._onlyCheckBox > label').addClass('_check');
            $('._onlyCheckBox > label').removeClass('_unCheck');
            full++;
        } else if (full == 1) {
            $('._sub_check').attr('checked', false);
            $('._sub_first_txt > label').addClass('_unCheck');
            $('._sub_first_txt > label').removeClass('_check');
            $('._onlyCheckBox > label').addClass('_unCheck');
            $('._onlyCheckBox > label').removeClass('_check');
            full--;
        }
    });

    // 리스트 개별 선택 - 해당 ul 클릭시
    $(document).on('click', '._sub_ul > ._sel', function (e) {
        // 이벤트 중복 방지
        e.preventDefault();

        var checkBox = $(this).parent().find('._sub_check');
        var checkLabel = $(this).parent().find('._sub_label');

        if (checkBox.attr('checked') == 'checked') {
            checkBox.attr('checked', false);
            checkLabel.addClass('_unCheck');
            checkLabel.removeClass('_check');
        } else {
            checkBox.attr('checked', true);
            checkLabel.addClass('_check');
            checkLabel.removeClass('_unCheck');
        }

        //리스트 개별 선택 - 전체 선택 및 전체 해제
        var totalSub = $('._sub_check').length;
        var checkedSub = $('._sub_check:checked').length;

        if (totalSub != checkedSub) {
            $('._main_first_txt > label').removeClass('_check');
            $('._main_first_txt > label').addClass('_unCheck');
        } else {
            $('._main_first_txt > label').addClass('_check');
            $('._main_first_txt > label').removeClass('_unCheck');
        }
    });

    // 리스트 개별 선택 - 해당 check box 클릭시
    $(document).on('click', '._onlyCheckBox', function (e) {
        // 이벤트 중복 방지
        e.preventDefault();

        // 개별 체크 및 디자인 적용
        var checkBox = $(this).parent().find('._sub_check');
        var checkLabel = $(this).parent().find('._sub_label');

        if (checkBox.attr('checked') == 'checked') {
            checkBox.attr('checked', false);
            checkLabel.addClass('_unCheck');
            checkLabel.removeClass('_check');
        } else {
            checkBox.attr('checked', true);
            checkLabel.addClass('_check');
            checkLabel.removeClass('_unCheck');
        }

        //리스트 개별 선택 - 전체 선택 및 전체 해제
        var totalSub = $('._sub_check').length;
        var checkedSub = $('._sub_check:checked').length;

        if (totalSub != checkedSub) {
            $('._main_first_txt > label').removeClass('_check');
            $('._main_first_txt > label').addClass('_unCheck');
        } else {
            $('._main_first_txt > label').addClass('_check');
            $('._main_first_txt > label').removeClass('_unCheck');
        }
    });






    $('.state_click').on('click', function () {
        var view = $(this).find('.state_viewbox');
        var responseEmployee = $(this).find('._responseEmployee').val();

        if (loginEmployee == responseEmployee) {

            if (view.hasClass('state_on')) {
                view.removeClass('state_on')


            } else {
                $('.state_viewbox').removeClass('state_on');
                view.addClass('state_on')

            }
        }
    });
});