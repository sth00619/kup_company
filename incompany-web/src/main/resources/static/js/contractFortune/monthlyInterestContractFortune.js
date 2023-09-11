$(document).ready(function(){
    // 이번 회차 세팅
    const isSuccess = setTheCurrentPaymentCycle();
    if(isSuccess) $('._hidden').prop('hidden', false);
});

// 납입 부분 제외 계약 항목 선택 시 계약 상세 보기 이동
$('._contract_sub_title > li').not('._paymentCheck, ._alertMonth').on('click', function(){
    const contractCode = $(this).parent().attr('value');
    if(!$(this).hasClass('_checkbox_li') && typeof contractCode != 'undefined' && contractCode !== '' && contractCode != null){
        const url = "/contractFortune/contractFortuneInfo?contractCode=" + contractCode;
        $(location).attr('href',url);
    }
});

// 완료여부 확인버튼 클릭 이벤트
$(document).on('click', '._paymentCheck._check_false', function(){
    if($(this).parent('ul').hasClass('_finish')) {
        alert('종료된 계약입니다.');
        return false;
    }

    let paymentCycleNo = $(this).parent().find('._paymentCycle').text();
    paymentCycleNo = parseInt(paymentCycleNo);

    let contractCode = $(this).closest('._sub_ul').attr('value');
    contractCode = parseInt(contractCode);

    const paymentCycle = $(this).parent().find('._alertMonth').eq(paymentCycleNo - 1);
    const cycleText = paymentCycle.text();

    if(cycleText !== 'X') {
        alert('계약 기간 중 미확인된 계약만 확인 가능합니다.');
        return false;
    }

    const request = $.ajax({
        url: "/contractFortune/addPaymentCycle",
        type: "GET",
        data: {
            paymentCycleNo : paymentCycleNo,
            contractCode : contractCode
        },
        dataType: "json"
    });

    request.done(function(data){
        if(data === 0){
            alert('정상적으로 처리되지 않았습니다.\n'+'담당자에게 문의하세요.');
        } else if(data === 1){
            alert('정상 처리 되었습니다.');
            location.reload();
        } else if(data === 2){
            alert('이미 확인 완료된 계약입니다.\n'+'오류가 계속되면 담당자에세 문의하세요.');
        } else if(data === 3) {
            alert('권한이 없습니다.\n'+'담당자에세 문의하세요.');
        }
    });
});

// 월 별 납입 여부 ox 클릭 이벤트
$('._alertMonth').on('click', function() {
    const monthVal = $(this).attr('value');
    const monthText = $(this).text();
    if(monthText === 'O') {
        alert('납입 완료 확인 날짜 : ' + monthVal);
    } else if(monthText === 'X') {
        alert('완료 여부가 확인 되지 않은 계약입니다.');
    }else if(monthText === '-') {
        alert('계약 기간에 포함되지 않습니다.');
    }
});

// 각 계약 세팅
function setTheCurrentPaymentCycle(){
    let isSuccess = false;
    const contract = $('._sub_ul');
    const currentMonthDate = $('._search_month_date').val();
    const currentWeekDate = $('._search_start_date').val();

    // 현재 날짜
    let currentDate = currentMonthDate;
    if(isEmpty(currentDate)) currentDate = currentWeekDate;

    // 납입일(매 월 25일) 기준 회차 계산 (기준은 바뀔 수 있음)
    let paymentDate = currentDate.substring(0,7);
    paymentDate = paymentDate + '-01';

    // 회차 계산 하여 세팅 / 총 이자 세팅 / 완료 여부 세팅
    $.each(contract, function(){
        // 계약 일
        let contractDate = $(this).find('._contractDate').text();
        if(isEmpty(contractDate) || isEmpty(currentDate)) return false;

        contractDate = getDt1(contractDate);

        // 월 차이 계산 -> date_util.js > function monthDif();
        const paymentCycleDif = monthDif(contractDate, paymentDate);

        // 회차 세팅
        $(this).find('._paymentCycle').text(paymentCycleDif + ' 회차');
        const monthClassName = '._month'+paymentCycleDif;

        const paymentCheck = $(this).find('._paymentCheck');

        // 완료 여부 세팅
        const thisMonth = $(this).find(monthClassName);
        const thisMonthVal = thisMonth.attr('value');
        const thisMonthText = thisMonth.text();
        const thisPaymentCycle = $(this).find('._alertMonth').eq(paymentCycleDif - 1);

        thisPaymentCycle.addClass('_thisPaymentCycle');
        if(thisMonthText === 'O'){
            paymentCheck.text(thisMonthVal.substring(2, 13)+'시');
            paymentCheck.addClass('_check_true');
            thisPaymentCycle.addClass('_check_true');
        }else if(thisMonthText === 'X') {
            paymentCheck.text('미확인');
            paymentCheck.addClass('_on_mouse_payment_cycle');
            paymentCheck.addClass('_check_false');
            thisPaymentCycle.addClass('_check_false');

            // 확인버튼 이미지로 추가해야할 경우
            // paymentCheck.append('<img src="/images/img/check_icon.png"/>');
        }

        const periodNo = $(this).data('period');
        $(this).find('._alertMonth').each(function(index, item){
            if((index + 1) > periodNo) $(this).text('-');
        });

        // 총 이자 세팅(12개월)
        let interest = $(this).find('._interest').text();
        if(isEmpty(interest)) return true;
        interest = minusStr(interest);
        interest = Number(interest) * 12;
        interest = addComma(interest.toString());

        $(this).find('._totalInterest').text(interest);


        let paymentCycleNo = $(this).find('._paymentCycle').text();

        paymentCycleNo = parseInt(paymentCycleNo);

        console.log('paymentCycleNo : ', paymentCycleNo);

        const paymentCycle = $(this).find('._alertMonth').eq(paymentCycleNo - 1);
        const paymentText = paymentCycle.text();

        console.log('paymentText : ', paymentText);
        if(paymentText === '-') {
            $(this).addClass('_finish');
            $(this).find('._paymentCheck').text('계약종료');
            $(this).find('._paymentCycle').text('- 회차');
        }
    });

    isSuccess = true;
    return isSuccess;
}

// 빈 값 체크
function isEmpty(val){
    if (typeof val === 'string' && val === '') return true;
    if(typeof val === 'undefined' || val === null) return true;
    return false;
}

// 금액 천 단위 콤마 추가
function addComma(value) {
    var regex = /[^0-9]/g;
    value = value.replace(regex, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value;
}

// 문자 제거 Only 숫자
function minusStr(value) {
    value = value.replace(/[^\d]+/g, "");
    return value;
}