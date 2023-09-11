
$(document).ready(function(){
    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });

    $(function () {
        $('#attacheFiles').MultiFile({
          max: 5,
        });
    });
});

// 휴가 종류 선택 시 우측에 휴가 정보 노출
$(document).on('change', '._vacation_type', function(){
    const selectVal = $(this).val();
    const category  = $('._vacation_type').children('option[value='+selectVal+']');

    let maxLeave    = category.data('maxleave');
    let minusLeave  = category.data('minusleave');
    let salaryY     = category.data('salaryy');
    let salaryN     = category.data('salaryn');
    let document    = category.data('document');

    // 날짜, 기간 초기화
    $('#_startDate').val('');
    $('#_endDate').val('');
    $('._day_diff').val(0);

    // 날짜 선택 가능하도록 변경
    $('#_startDate').prop('readonly', false);
    $('#_endDate').prop('readonly', false);
    $('#_startDate').addClass('_vacation_selected');
    $('#_endDate').addClass('_vacation_selected');

    if(selectVal == 40 && !confirm('둘 이상의 자녀를 임신하였습니까?\n확인(예) 또는 취소(아니오)를 선택해주세요.')) {
        maxLeave = '90.0';
        salaryY = '90.0';
    } else if(selectVal == 50) {
        let weeks = prompt('임신 한 날부터 유사산 한 날까지 몇 주 차인가요?', '');
        weeks = parseInt(weeks);
        let vacation_day = '';
        if(weeks <= 11){
            vacation_day = '5.0';
        } else if(weeks >= 12 && weeks <= 15) {
            vacation_day = '10.0';
        } else if(weeks >= 16 && weeks <= 21) {
            vacation_day = '30.0';
        } else if(weeks >= 22 && weeks <= 27) {
            vacation_day = '60.0';
        } else if(weeks >= 28) {
            vacation_day = '90.0';
        }

        maxLeave = vacation_day;
        salaryY = vacation_day;
    } else if(selectVal == 10) {
        // 연차 선택 시 신청 가능 일수, 연차 차감, 유급 == 신청자의 잔여 연차
        maxLeave    = $('._vacation_remaining').text();
        minusLeave  = $('._vacation_remaining').text();
        salaryY     = $('._vacation_remaining').text();
    }

    // 신청 가능 일 수 세팅
    $('._maxLeave').text('');
    $('._maxLeave').text(maxLeave);
    $('._maxLeave').val(maxLeave);

    // 연차 차감 일 수 세팅
    $('._minusLeave').text('');
    $('._minusLeave').text(minusLeave);
    $('._minusLeave').val(minusLeave);

    // 유급 휴기 일 수 세팅
    $('._salaryY').text('');
    $('._salaryY').text(salaryY);
    $('._salaryY').val(salaryY);

    // 무급 휴가 일 수 세팅
    $('._salaryN').text('');
    $('._salaryN').text(salaryN);
    $('._salaryN').val(salaryN);

    // 제출 서류 세팅
    $('._document').text('');
    $('._document').text(document);
    $('._document').val(document);

    // 기간이 1일 이내인 휴가 index
    const oneDayArr = [20, 30, 31, 70, 100, 110, 120, 130];

    // 선택한 휴가의 신청 가능일이 1일 이하 일 경우 endDate 변경 불가
    if(oneDayArr.includes(Number(selectVal))) {
        $('#_endDate').prop('readonly', true);
        $('#_endDate').addClass('_not_select');
    } else{
        $('#_endDate').prop('readonly', false);
        $('#_endDate').removeClass('_not_select');
    }

});

// 휴가 종류 선택 했는지 여부 (휴가 종류를 선택하지 않으면 disabled 처리가 되어있다.)
$(document).on('click', '#_startDate, #_endDate', function(){
    if(!$(this).hasClass('_vacation_selected')) {
        alert('휴가 종류를 선택해 주세요.');
    } else if($(this).hasClass('_not_select')) {
        alert('신청 가능한 휴가 일 수가 1일 이하일 경우 종료일을 변경 할 수 없습니다.');
    }
});

// 휴가 기간 변경
$(document).on('change', '#_startDate, #_endDate', function(){

    const isOneDay = $('#_endDate').prop('readonly');
    const selectVal = Number($('._vacation_type').val());
    const startDate = getVal($('#_startDate'));
    let endDate = getVal($('#_endDate'));

    // 1일만 가능한 휴가는 시작일만 지정 할 수 있도록 함 (시작일 == 종료일)
    if(isOneDay) {
        endDate = startDate;
        $('#_endDate').val(startDate);
    }

    // 시작일자, 종료일자 모두 선택 되어야 기간 세팅
    if(isEmpty(startDate) || isEmpty(endDate)) return false;
    
    // 기간 세팅 함수 호출
    const dayDiff = getDayDiffForVacation(startDate, endDate, selectVal);

    const maxLeave  = Number($('._maxLeave').text());
    const remaining = Number($('._vacation_remaining').text());

    // 연차, 월차, 반차(오전, 오후) 사용 일 경우 잔여 연차와 비교
    let isOver;
    let overMessage;
    const isAnnual = [10, 20, 30, 31];
    if(isAnnual.includes(selectVal)){
        isOver = dayDiff > remaining;
        overMessage = '잔여 연차를 확인 후 다시 선택 해 주세요.';

        // 연, 월, 반차 일 경우 연차 차감 세팅
        if(!isOver) $('._use_annual').val(dayDiff);

        // 유급, 무급 사용 일 세팅
        $('._use_salary_y').val(dayDiff);
        $('._use_salary_n').val('0.0');
    } else {
        isOver = dayDiff > maxLeave;
        overMessage = '신청 가능일 수를 확인 후 다시 선택 해 주세요.';

        // 연, 월 반차 가 아닐 경우 0으로 초기화
        $('._use_annual').val('0.0');

        // 유급, 무급 사용 일 세팅
        setSalaryYn(dayDiff);
    }

    // 신청 가능 일 수 보다 크면 종료일, 기간 초기화하여 다시 선택하도록 함
    if(isOver){
        alert(overMessage);

        // 날짜, 기간 초기화
        $('#_startDate').val(startDate);
        $('#_endDate').val('');
        $('._day_diff').val(0);

        return false;
    }

    // [?] 일간 세팅
    $('._day_diff').val(dayDiff);

    // 휴가 기간 세팅
    $('._vacation_day_diff').val(dayDiff);
});

// 휴가 별 주말 포함, 제외 한 기간 조회
function getDayDiffForVacation(startDate, endDate, selectVal){
    let dayDiff;
    let halfYn = 'N';
    if(selectVal == 30 || selectVal == 31) {
        halfYn = 'Y';
        dayDiff  = 0.5;
    } else if(selectVal == 90) {
        // 본인의 결혼 일 경우 주말(토, 일) 및 공휴일이 휴가에 포함됩니다.
        dayDiff = dayDif(startDate, endDate) + 1;
    } else {
        // 위 의 상황을 제외한 다른 휴가는 주말을 제외한다.
        let sDate = new Date(startDate.substring(0, 4), Number(startDate.substring(5, 7)) - 1, startDate.substring(8, 10))
        let eDate = new Date(endDate.substring(0, 4), Number(endDate.substring(5, 7)) - 1, endDate.substring(8, 10))

        dayDiff = 0;
        while(true) {
            let tDate = sDate;

            // tDate 가 마지막 날보다 클 경우 while 종료
            if(tDate.getTime() > eDate.getTime()) break;

            // 요일 index 0 ~ 6 (일, 월 ~ ~ ~ 금, 토)
            let tmp = tDate.getDay();

            // 주말(토,일)을 제외 한 평일 일 경우만 기간 count
            if(tmp > 0 && tmp < 6) dayDiff++;

            // 다음 날짜 세팅
            tDate.setDate(sDate.getDate() + 1);
        }
    }

    // 반차 여부
    $('._half_yn').val(halfYn);

    return dayDiff;
}

// 유급, 무급 사용일 세팅
function setSalaryYn(dayDiff){
    let useSalaryY = 0;
    let useSalaryN = 0;

    // 예시 ) 휴가의 사용 가능일 = 5일이고 이 중 유급 휴일 3일, 무급 휴일 2일 이다.
    // 휴가 신청 기간이 4일 일 경우 => 유급 휴일 3일, 무급 휴일 1일이 되도록 한다.
    for(let i = 1; i <= dayDiff; i++) {
        const salaryY = Number($('._salaryY').text());
        if(i > salaryY) {
            useSalaryN++;
        } else {
            useSalaryY++;
        }
    }
    $('._use_salary_y').val(useSalaryY);
    $('._use_salary_n').val(useSalaryN);
}