$(document).ready(function () {

    var getEmployeeLoginCode = $('#getEmployeeLoginCode').val();
    var getDepartmentCode = $('#getDepartmentCode').val();
    var getEmployeeCode = $('#getEmployeeCode').val();

    var today = moment().format('YYYY-MM-DD');

    $(document).on('click', '._deleteClose', function () {

        $(this).closest('.advice_txt_box').attr('class', '_deleteForm');

    })


    //상담내용
    $(document).on('click', '._counseling_title', function () {


        var title = $(this).text();
        var titleCode = $(this).attr('value');

        var advice = $('#advice')
        var str = '';
        str += '<div class="advice_txt_box" id="addCounseling">';
        str += '<h3>';
        str += title;
        str += '</h3>';
        str += '<input class="_title" value="'
        str += titleCode;
        str += '" hidden>'
        str += '<p>';
        str += today;
        str += '</p>';
        str += '<div class="advice_txt">';
        str += '<textarea name="contents" class= "advice_box _contents">'
        str += '</textarea>'
        str += '<div class="close _addClose">'
        str += '</div>'
        str += '</div>'

        advice.prepend(str);

    })
    // 화살표 up down, 상담 contents 숨김처리
    $(document).on('click', '.advice_txt_box h3', function () {

        $(this).toggleClass('slide');

        if ($(this).hasClass('slide')) {
            $(this).nextAll('.advice_txt').slideUp();
        } else {
            $(this).nextAll('.advice_txt').slideDown();
        }

        $(this).toggleClass('ww');

    });

    // 상담 박스 삭제
    $(document).on('click', '._addClose', function () {

        $(this).closest('.advice_txt_box').remove();
    })



    //상담 저장 yeah
    $(document).on('click', '#counselingSaveBtn', function () {
        var potentialUserNo = $('._potentialUserNoForm').val();
        var potentialUserName = $('._potentialUserNameForm').val();

        var insertForm = insertArray();
        var updateForm = updateArray();
        var deleteForm = deleteArray();

        var data = {
            "potentialUserNo": potentialUserNo,
            "potentialUserName": potentialUserName,
            "insert": insertForm,
            "update": updateForm,
            "delete": deleteForm
        }


        $.ajax({
            url: "addCounseling",
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),

            success: function (fragment) {

                $('#counselingList').replaceWith(fragment);
                $('.advice_save_visual').css({
                    visibility: 'hidden',
                    opacity: '0'

                });

                $('.black_screen').css({
                    visibility: 'hidden',
                    opacity: '0'
                });

                $('.pop1').css({
                    visibility: 'visible',
                    opacity: '1'
                });

                $('.black_screen').css({
                    visibility: 'visible',
                    opacity: '.3'
                });

                $('#pUser').val(potentialUserNo);

                $('.feed_box').hide();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("상담 내용을 입력해주세요.");
            }
        });

    })


    $(document).on('click', '#counselingCancleBtn', function () {
        $('.advice_save_visual').css({
            visibility: 'hidden',
            opacity: '0'

        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });
        $('#counseling_pop').load(location.href + ' #counseling_form');
    })

    /////////////////////////////////////////////////////////////////////// 상담추가, 상담내역




    //상담추가 리스트 보이기 + 버튼
    $(document).on('click', '.advice_click', function () {

        // 본인의 고객 일 때만 상담 추가 가능
        if (!$(this).hasClass('_isTrue')) return;

        var sub_title = $(this).closest('.sub_title');
        var potentialUserNo = sub_title.find('._potentialUserNo').text();
        var potentialUserName = sub_title.find('._potentialUserName').text();

        var data = {
            'potentialUserNo': potentialUserNo,
            'potentialUserName': potentialUserName,
            
            'isForm': 'true'
        }

        var str = ''
        str += '<input id ="userNo" name="potentialUserNo" value ='
        str += potentialUserNo
        str += ' hidden>'

        $('.advice_txt_wrap').append(str);


        $.ajax({
            type: "GET",
            url: "detail",
            data: data,
            success: function (fragment) {
                $('#counselingFormList').replaceWith(fragment);



                $('.pop2').css({
                    visibility: 'visible',
                    opacity: '1'
                });

                $('.black_screen').css({
                    visibility: 'visible',
                    opacity: '.3'
                });
            }
        });



    })



    // 상담 내용 .deta 눌르면 해당 no ajax로 가져오기
    $(document).on('click', '.deta', function () {
        var potentialUserNo = $(this).closest('.sub_title').find('._potentialUserNo').text();
        var employeeCode = $(this).closest('.sub_title').find('._employee').attr('value');


        $.ajax({
            type: "GET",
            url: "detail",
            data: {
                'potentialUserNo': potentialUserNo
            },
            success: function (fragment) {

                $('#counselingList').replaceWith(fragment);


                if (employeeCode == getEmployeeLoginCode) {
                    $('.feed_box').hide();

                }


                var counselingCount = $('.advice_txt_box').length;

                if (counselingCount == 0) {
                    var str = '<p id="counselingZero">상담내역이 없습니다.</p>'

                    $('.advice_inner').prepend(str);
                }

                $('.pop1').css({
                    visibility: 'visible',
                    opacity: '1'
                });

                $('.black_screen').css({
                    visibility: 'visible',
                    opacity: '.3'
                });
            }
        });

        


    });

    // 닫기
    $(document).on('click', '#counselingClose', function () {
        $('.advice_save_visual').css({
            visibility: 'hidden',
            opacity: '0'

        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });

    });


    // 닫기
    $(document).on('click', '#counselginDetailClose', function () {

        location.reload();

    });


    var sign = 0;

    // 체결 슬라이드
    $(document).on('click', '#sign', function () {
        if (sign == 0) {
            $(this).next().css({
                opacity: 1,
                visibility: 'visible'
            });
            sign++;
        } else if (sign == 1) {
            $(this).next().css({
                opacity: 0,
                visibility: 'hidden'
            });

            sign = 0;
        }
    });


    $(document).on('click', '._no', function () {
        alert("서비스 준비중입니다.");
        return false;
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 피드백



    $(document).on('click', '._feedbackClose,#feedackCloseBtn', function () {
        var feedBox = $('.feed_box_txt')
        var save_none = $('.save_none');

        feedBox.removeClass('_on')
        feedBox.addClass('_off')


        save_none.removeClass('_on')
        save_none.addClass('_off')

        $('#feedback').val('');

    });

    $(document).on('click', '.feed_box', function () {
        var feedBox = $('.feed_box_txt');
        var save_none = $('.save_none');

        if (save_none.hasClass('_off')) {
            save_none.removeClass('_off')
            save_none.addClass('_on')
        } else {
            save_none.removeClass('_on')
            save_none.addClass('_off')
        }


        if (feedBox.hasClass('_off')) {
            feedBox.removeClass('_off')
            feedBox.addClass('_on')
        } else {
            feedBox.removeClass('_on')
            feedBox.addClass('_off')
        }

    });


    $(document).on('click', '#feedbackSaveBtn', function () {
        var feedback = $('#feedback').val();
        var potentialUserNo = $('#pUser').val();


        var data = {
            "contents": feedback,
            "potentialUserNo": potentialUserNo
        }

        $.ajax({
            type: "POST",
            url: "addFeedback",
            data: data,
            success: function () {
                $('#counselingZero').remove();
                $('#feedback').val('');

                var str = '';
                str += '<div>'
                str += '<div class="advice_txt_box">';
                str += '<h3>피드백</h3>'
                str += '<p>'
                str += today
                str += '</p>'
                str += '<div class="advice_txt">'
                str += '<span>'
                str += feedback
                str += '</span>'
                str += '</div>'
                str += '</div>'
                str += '</div>'

                $('.advice_inner').prepend(str);

            }
        })
    })

    ////////////////////////////////////////////////////////////////////////////////////////검색

    //검색실행 함수
    function searchPotentialUser() {
        var keyword = $('#keyword').val();
        var searchType = $(".select_box option:selected").val();

        if (searchType === 'mobile') {
            keyword = minusStr(keyword);
            var regEx = /(\d{3})(\d{3,4})(\d{4})/; // 하이픈 정규식
            keyword = keyword.replace(regEx, "$1-$2-$3");
        }
        if (getEmployeeCode == null || getEmployeeCode == '' || typeof getEmployeeCode == "undefined") {

            if (getDepartmentCode != null) {
                location.href = '/potential/counseling?departmentCode=' + getDepartmentCode + '&searchType=' + searchType + "&keyword=" + keyword;
            } else {
                location.href = '/potential/counseling?employeeCode=' + getEmployeeLoginCode + '&departmentCode=' + getDepartmentCode + '&searchType=' + searchType + "&keyword=" + keyword;
            }
        } else {
            location.href = '/potential/counseling?employeeCode=' + getEmployeeCode + '&departmentCode=' + getDepartmentCode + '&searchType=' + searchType + "&keyword=" + keyword;
        }
    }

    // 암호화
    function decryptAes(str, key) {
        var cipher = CryptoJS.AES.decrypt(str, key);
        return cipher.toString();
    }

    // 검색바 엔터키 입력시 검색 실행
    $(document).on('keydown', '#keyword', function (keyNum) {
        if (window.event.keyCode === 13) {
            searchPotentialUser();
        }
    });

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchPotentialUser();
    });

    // 문자 제거 Only 숫자
    function minusStr(value) {
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

    $(document).on('keydown', '._contentsForm', function () {
        $(this).closest('.advice_txt_box').addClass('_updateForm');
    })

    //////////////////////////////////////////

    function insertArray() {
        var jsonArray = new Array();


        $("#counselingFormList #addCounseling").each(function (index) {
            var title = $(this).find('._title').val();

            var contents = $(this).find('._contents').val();


            var json = new Object();
            json.title = title;
            json.contents = contents;
            jsonArray.push(json)


        });

        return jsonArray;


    }

    function updateArray() {
        var jsonArray = new Array();


        $("._updateForm").each(function (index) {
            var counselingNo = $(this).find('._counselingNo').val();
            var detailNo = $(this).find('._detailNo').val();
            var contents = $(this).find('._contentsForm').val();

            var json = new Object();

            json.counselingNo = counselingNo;
            json.detailNo = detailNo;
            json.contents = contents;

            jsonArray.push(json)


        });

        return jsonArray;


    }


    function deleteArray() {

        var jsonArray = new Array();


        $('._deleteForm').each(function () {
            var counselingNo = $(this).find('._counselingNo').val();
            var detailNo = $(this).find('._detailNo').val();

            var json = new Object();
            json.counselingNo = counselingNo;
            json.detailNo = detailNo;
            jsonArray.push(json)


        });


        return jsonArray;

    }

    // 처리 실패 메세지
    if ($('#isSuccess').val() == 'false') {
        var message = $('#message').val();
        alert(message);
    }
})

// 체결 > 목돈 클릭 시
$(document).on('click', '._sign_contract_fortune', function () {
    const potentialUserNo = $('._potentialUserNoForm').val();
    $(location).attr('href', '/contractFortune/addContractFortune?potentialUserNo=' + potentialUserNo);
});

// 체결 > 목돈 클릭 시
$(document).on('click', '._sign_insurance', function () {
    const potentialUserNo = $('._potentialUserNoForm').val();
    $(location).attr('href', '/insurance/addInsurance?potentialUserNo=' + potentialUserNo);
});