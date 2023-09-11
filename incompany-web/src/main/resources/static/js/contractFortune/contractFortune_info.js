$(document).ready(function () {
    const contractCode = $('#contractCode').val();

    const interest = $('._interest').text();
    if (typeof interest != 'undefined' && interest !== '' && interest != null) {
        $('._interest').removeAttr('hidden');
    }

    // 이전 페이지에 따른 취소 버튼 경로 설정
    $('._close_btn').on('click', function () {
        const referrer = document.referrer;
        if (referrer.indexOf('checkContractFortune') !== -1) {
            $(location).attr('href', '/contractFortune/checkContractFortune');
        } else if (referrer.indexOf('addContractFortune') !== -1) {
            $(location).attr('href', '/contractFortune/checkContractFortune');
        } else if (referrer.indexOf('updateContractFortune') !== -1) {
            $(location).attr('href', '/contractFortune/checkContractFortune');
        } else {
            $(location).attr('href', '/contractFortune/contractFortune');
        }
    });

    //삭제 버튼 처리
    $(document).on('click','._deleteBtn', function(){

        const contractCode = $(this).closest('._contractList').find('._contractCode').val();

        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result) {
            var url = "/contractFortune/deleteContractFortuneInfo?contractCode=" + contractCode;
            $(location).attr('href',url);
        } else {
            return false;
        }
    });

    //삭제 버튼 처리
    $(document).on('click','._deletePrivateBtn', function(){

        const contractCode = $(this).closest('._contractList').find('._contractCode').val();

        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result) {
            var url = "/contractFortune/deletePrivateContractFortuneInfo?contractCode=" + contractCode;
            $(location).attr('href',url);
        } else {
            return false;
        }
    });

    // 특이사항 팝업
    $('._noteBtn').click(function(){
        const note = $(this).parent().children('._noteText').text();
        const pop  = $('.pop5');

        pop.find('._contents').text(note);

        if(!pop.hasClass('active')) {
            pop.addClass('active');
            pop.css({
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

// 팝업 영역 밖 or 닫기 버튼 클릭 시 팝업 닫기
$(document).on('click', function(e) {
    const pop   = $('.pop5');
    const close = $('._close_div');

    if(!pop.has(e.target).length || close.has(e.target).length) {
        if(pop.hasClass('active')){
            pop.toggleClass('_active_pop');
        }
    }

    if(!pop.hasClass('_active_pop') && pop.hasClass('active')) {
        pop.removeClass('active');

        $('.advice_save_visual').css({
            visibility: 'hidden',
            opacity: '0'
        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });
    }
});

function stateBtn(thisBtn){
    const lastCont = $('._contractList').eq(0);
    let url = '/contractFortune/addContractFortune?';

    // 고객 번호
    const potentialUserNo = getVal($('._potentialUserNo'));
    url += 'potentialUserNo=' + potentialUserNo;

    // 담당자 코드
    const employeeCode = getVal($('._employeeCode'));
    url += '&employeeCode=' + employeeCode;

    const contractCode = getVal($('._contractCode'));
    url += '&contractCode=' + contractCode;

    const isPublic = getVal($('._isPublic'));
    url += '&isPublic=' + isPublic;

    // 계약 구분
    const isExtension = $(thisBtn).attr('class').indexOf('_extensionBtn') !== -1;
    const isIncrease = $(thisBtn).attr('class').indexOf('_increaseBtn') !== -1;
    let contractState = Number(getVal(lastCont.find('._contractState')));
    if(isExtension){
        contractState = contractState > 3 ? 5 : 1;
    } else if(isIncrease){
        contractState = contractState > 3 ? 7 : 3;
    }
    url += '&contractState='+contractState;

    console.log('contractFortune_info.js / line:111 - url : ', url);

    $(location).attr('href', url);
}

// 지점 운영비 여부 checkbox
const expensesYes = document.querySelector('.expensesYes');
const expensesNo = document.querySelector('.expensesNo');

expensesNo.addEventListener('click', () => {
    expensesYes.checked = false; // 운영비 checkbox의 체크를 풀어줌
    expensesNo.checked = true; // 비운영비 checkbox를 체크
});

expensesYes.addEventListener('click', () => {
    expensesNo.checked = false; // 비운영비 checkbox의 체크를 풀어줌
    expensesYes.checked = true; // 운영비 checkbox를 체크
});