$(document).ready(function () {

    var keyword = $('#keyword').val();
    var searchType = $(".select_box option:selected").val();
    var DATE_TIME_CHECK = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;

    var loginEmployee = $('#employeeLoginCode').val();
    var getDepartmentCode = $('#getDepartmentCode').val();
    var selectEmployeeCode = $('#selectEmployeeCode').val();

    var state = $('#state').val();

    console.log(state);

    // 참여인원 4명 이상일때 ... 출력
    $('.p_people_wrap').each(function () {
        var people = $(this).children();

        if (people.length > 4) {
            $(people).each(function (index) {
                $(this).eq(index).hide();

            })
            $(this).append('<div class="Excess"><img src="/images/img/plus.png"></div>');
        }

    });

    $(document).on('click', '.interest', function (e) {
        var state = $(this).children().first().val();

        if (state == 'all') {
            if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode );
            } else {
                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode);
            }
        } else{
            if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode +  '&state=' + state);
            } else {
                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode +  '&state=' + state);
            }
        }



    });

    $(document).on('click', '._stateVal', function () {

        var state = $(this).attr('value');
        var projectNo = $(this).closest('.state_viewbox').find('._projectNo').val();

        var data = {
            "projectNo": projectNo,
            "state": state
        }


        $.ajax({
            type: "PUT",
            url: "/worksheet/project/editState",
            data: data,
            success: function () {
                location.reload();
            }

        }).fail(function () {
            alert("수정에 실패하셨습니다");
            return false;
        });



    });

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

        if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

            $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode + '&pageNum=' + pageNum + '&state=' + state);
        } else {
            $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode + '&pageNum=' + pageNum+ '&state=' + state);
        }



    });

    ///////////////// 검색 /////////////

    if (searchType == 'createDate') {
        $('#keyword').attr('placeholder', 'yyyy-mm-dd')
    }

    $(document).on('change', '.select_box', function () {

        var searchType = $(".select_box option:selected").val();

        $('#keyword').val('');
        if (searchType == 'createDate') {
            $('#keyword').attr('placeholder', 'yyyy-mm-dd')
        } else {
            $('#keyword').attr('placeholder', '검색')

        }
    })


    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function (e) {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        if (searchType == 'createDate') {
            if (!DATE_TIME_CHECK.test(keyword)) {
                alert("날짜는 yyyy-mm-dd 형식으로 입력해주세요.");
                return false;
            } else {
                if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                    $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode, +'&state=' + state);
                } else {
                    $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode + '&state=' + state);
                }
            }
        } else {
            if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode + '&state=' + state);
            } else {
                $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode + '&state=' + state);
            }
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
                    if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                        $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode + '&state=' + state);
                    } else {
                        $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode + '&state=' + state);
                    }
                }
            } else {
                if (typeof selectEmployeeCode == 'undefined' && selectEmployeeCode == '' && selectEmployeeCode == 'null') {

                    $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + loginEmployee + '&departmentCode=' + getDepartmentCode + '&state=' + state);
                } else {
                    $(location).attr('href', '/worksheet/project/list?searchType=' + searchType + '&keyword=' + keyword + '&employeeCode=' + selectEmployeeCode + '&departmentCode=' + getDepartmentCode + '&state=' + state);
                }
            }
        }

    });

    $('.state_click').on('click', function () {
        var view = $(this).find('.state_viewbox');
        var createEmployee = $(this).find('._createEmployee').val();


        if (loginEmployee == createEmployee) {

            if (view.hasClass('state_on')) {

                view.removeClass('state_on')
            } else {
                $('.state_viewbox').removeClass('state_on');
                view.addClass('state_on')

            }
        }



    });
});