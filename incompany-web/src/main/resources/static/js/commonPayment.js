/*
    결재 공통 부분에 대한 js 입니다.
    공통 html 은 아래와 같습니다.
    fragment/commonPayment/addForm.html             - 등록 및 수정 화면
    fragment/commonPayment/infoFormTop.html         - 상세 보기 > 화면 상단
    fragment/commonPayment/infoFormBottom.html      - 상세 보기 > 화면 하단

    - 참고사항 -
    상세보기에서 전체목록, 수정버튼, 삭제버튼은 경로 및 파라미터 문제 때문에 어려움이 있어
    각 게시글 상세보기 js 파일 에서 처리 해 주셔야 합니다. (개선필요)
    /vacation/vacationInfo.js 참고
*/
    var paymentTitle = $('#_paymentTitle').val();

// 결재자, 참조자 영역 클릭 시 사원리스트 노출
$('#searchApprEmployee, #searchRefEmployee').on('click', function () {
    const hasClass = $(this).hasClass('_searchApprEmployee');

    if(hasClass){
        $('._ref').removeClass('saved_on');
        $('._appr').toggleClass('saved_on');
    }else {
        $('._ref').toggleClass('saved_on');
        $('._appr').removeClass('saved_on');
    }
});

// 결제자 참조자 검색
$(document).on('keyup', '#searchApprEmployee, #searchRefEmployee', function () {
    var searchEmployee = $(this).val();
    var checkNumber = /^(?=.*?[0-9])/;
    var searchUrl = !checkNumber.test(searchEmployee) ? 'searchEmployeeByName' : 'searchEmployeeByCode';
    const hasClass = $(this).hasClass('_searchApprEmployee');
    const className = hasClass ? '_clickApproverEmployee' : '_clickRefEmployee';
    const htmlName = hasClass ? '._appr' : '._ref';

    $.ajax({
        type: "GET",
        url: "/companyChart/" + searchUrl,
        data: {
            "searchEmployee": searchEmployee
        },
        success: function (data) {
            $('.'+className).remove();
            var str = '';
            $.each(data, function (index, item) {
                str += '<li class="'+className+'">';
                str += '<div class="saved_icon">';
                if (item.imageUrl) {
                    str += '<img src ="'
                    str += item.imageUrl
                    str += '" class="_employeeImg">'
                } else {
                    str += '<img src="/images/img/quick_my.png" class="_employeeImg">';
                }
                str += '</div>';
                str += '<div class="saved_namebox">';
                str += '<div class="saved_name">';
                str += item.employeeName;
                str += '</div>';
                str += '<div class="saved_number">';
                str += item.employeeCode;
                str += '</div>';
                str += '</div>';
                str += '</li>';
            });
            $(htmlName).prepend(str);
        }
    }).fail(function () {
        alert("사원찾기에 실패하셨습니다");
        return false;
    });
});

// 노출 된 사원 리스트에서 검색하여 결재자 및 참조자 선택
$(document).on('click', '._clickApproverEmployee, ._clickRefEmployee', function () {

    const hasClass = $(this).hasClass('_clickApproverEmployee');

    if(hasClass){
        $('._ref').removeClass('saved_on');
        $('._appr').toggleClass('saved_on');
    } else {
        $('._ref').toggleClass('saved_on');
        $('._appr').removeClass('saved_on');
    }

    var selectEmployeeCode = $(this).find('.saved_number').text();
    var selectEmployeeName = $(this).find('.saved_name').text();

    var prevOrdering = hasClass ? Number($('._selectApprDiv').last().find('._ordering').text()) + 1 : '';

    // 유효성 검사
    if(!isSuccessForEmployeeSearch(selectEmployeeCode)) return false;

    var str = '';
    if(hasClass){
        str += '<div class="_selectApprDiv">';
        str += '<div style="float : left ;">';
        str += '<img src="/images/img/delete.png" class="_delApprEmployee" style="cursor: pointer">';
        str += '<span class="_ordering">';
        str += prevOrdering;
        str += '</span>';
        str += '<span  style="margin-top: 10px; margin-bottom: 10px; font-size: 15px; font-weight : bold">';
        str += selectEmployeeName;
        str += '</span>';
        str += '</div>';
        str += '<div class="_selectEmployeeTypeList" style="margin-left : 50px; padding-top:10px">';
        str += '<input class="_selectApprover" name="approverList" value="';
        str += selectEmployeeCode;
        str += '" style="margin-top : 8px;" readonly/>';
        str += '</div>';
        str += '<br>';
        str += '</div>';
        $('._selectApproverList').append(str);
    } else {
        str += ' <div class="_selectRegDiv">';
        str += '<div style="float : left ;">';
        str += ' <img src="/images/img/delete.png" class="_delRefEmployee" style="cursor: pointer">';
        str += ' <span  style="margin-top: 10px; margin-bottom: 10px; font-size: 15px; font-weight : bold">';
        str += selectEmployeeName;
        str += '</span>';
        str += '</div>';
        str += '<div class="_selectEmployeeTypeList" style="margin-left : 50px; padding-top:10px">'
        str += '<input class="_selectRef" name="referrerList" value="';
        str += selectEmployeeCode;
        str += '" style="margin-top : 8px;" readonly/>';
        str += '</div>';
        str += ' <br>';
        str += ' </div>';
        $('._selectRefEmployeeList').append(str);
    }
});

// 결재자 및 참조자 삭제
$(document).on('click', '._delApprEmployee, ._delRefEmployee', function () {
    const hasClass = $(this).hasClass('_delApprEmployee');
    if(hasClass){
        $(this).closest('._selectApprDiv').remove();
        $('._selectApprDiv').each(function (index) {
            $(this).find('._ordering').text(index + 1)
        });
    } else {
        $(this).closest('._selectRegDiv').remove();
    }
});


// 결재자 및 참조자 유효성 검사
function isSuccessForEmployeeSearch(selectEmployeeCode){
    var searchResult = true;
    var loginEmployeeCode = $('#loginEmployeeCode').val();
    if (loginEmployeeCode == selectEmployeeCode) {
        alert("본인을 추가할수 없습니다");
        return false;
    }

    $('._selectRef').each(function () {
        if ($(this).val() == selectEmployeeCode) {
            alert("참조자로 이미 추가된 사원입니다!");
            searchResult = false;
            return false;
        }
    });

    $('._selectApprover').each(function () {
        if ($(this).val() == selectEmployeeCode) {
            alert("결재자로 이미 추가된 사원입니다!");
            searchResult = false;
            return false;
        }
    });

    return searchResult;
}

// 결재 처리 버튼 (승인, 반려)
$(document).on('click', '._paymentBtn', function () {

    var draftEmployeeCode = $('#_draftEmployeeCode').val();


    const paymentVal = $(this).val();
    const paymentText = $(this).text();
    const no = $('#no').val();
    const loginEmployeeCode = $('#loginEmployeeCode').val();
    const firstOrdering = $('._paymentApprCode').first().text();
    const lastOrdering = $('._paymentApprCode').last().text();
    const boardType = $('#boardType').val();
    let step;
    let status;
    let nextApprover;

    // 다음 결재자 찾기
    $('._paymentApprCode').each(function (index, value) {
        if ($(this).text() === loginEmployeeCode) { //값 비교
            nextApprover = $('._paymentApprCode').eq(index + 1).text();
            return;
        }
    });

    // 반려버튼일때
    if (paymentVal == 3) {
        step = 3;
        status = 3
    }

    // 결재했을때
    if (paymentVal == 1) {
        step = 2;

        // 결재자가 처음일때
        if (firstOrdering == loginEmployeeCode) status = 1;

        // 결재자가 마지막 결재자일때
        if (lastOrdering == loginEmployeeCode) status = 2;
    }

    const data = {
        "nextApprover"  : nextApprover,
        "boardType"     : boardType,
        "status"        : status,
        "no"            : no,
        "step"          : step,
        "paymentTitle": paymentTitle,
        "draftEmployeeCode": draftEmployeeCode,

    }

    const request = $.ajax({
        url: "/myPage/payment/step",
        type: "PUT",
        data: data
    });

    request.done(function(data){
        alert(paymentText + " 완료되었습니다");
        window.location.reload();
    });

    request.fail(function(){
        alert("결재에 실패하셨습니다");
        return false;
    });
});