$(document).ready(function () {

    $('._contract_number').focus();

    // 이자 구분 선택
    $('._month_interest, ._year_interest').on('click', function () {
        var isMonth = $(this).hasClass('_month_interest');
        var isCheck = $(this).attr('checked');

        var interestRate = $('._interestRate').val();
        var amount = $('._amount').val();

        // 금액 천 단위 콤마 제거
        interestRate = interestRate.replace(/[^\d.]/g,'');
        amount = minusStr(amount);

        if (isCheck != 'checked' && !isNaN(amount) && !isNaN(interestRate)) {
            let interestVal = (parseInt(amount) * (parseFloat(interestRate).toFixed(2) * 100)) / 100 / 100;

            if (isMonth) {
                // 월 이자 계산
                interestVal = Math.ceil(interestVal / 12);
                $('._year_interest').attr('checked', false);
            } else {
                // 연 이자 계산
                interestVal = Math.ceil(interestVal);
                $('._month_interest').attr('checked', false);
            }

            $(this).attr('checked', true);

            // 금액 천 단위 콤마 추가
            interestVal = addComma(interestVal.toString());

            $('._interest').val(interestVal);
        }
    });

    // 공개, 비공개 여부 선택
    $('._public_contract, ._private_contract').on('click', function () {
        var isPublic = $(this).hasClass('_public_contract');
        var isCheck = $(this).prop('checked');

        if (isCheck != 'checked') {
            if (isPublic) {
                $('._private_contract').prop('checked', false);
                $(this).prop('checked', true);
            } else {
                if(confirm("비공개 계약은\n[비공개 계약 관리 권한]이 없을 경우\n조회 및 수정이 불가능합니다.\n정말 변경하시겠습니까?") === true){
                    console.log('예');
                    $('._public_contract').prop('checked', false);
                    $(this).prop('checked', true);
                }else {
                    console.log('아니오');
                    $('._private_contract').prop('checked', false);
                    $('._public_contract').prop('checked', true);
                }
            }
        }
    });

    // Only 숫자로 변환 후 천 단위 콤마 추가, 이자율은 퍼센트 특수문자 결합, 이자 계산 후 세팅
    $('._amount, ._interestRate').on('blur', function () {
        let amount = $('._amount').val();
        let interestRate = $('._interestRate').val();

        amount = minusStr(amount);
        interestRate = interestRate.replace(/[^\d.]/g,'');

        if (!isNaN(amount) && !isNaN(interestRate) && amount != 'NaN' && interestRate != 'NaN' && amount != '' && interestRate != '') {
            let isMonth = $('input[name=interestState]:checked').val() == 'M';
            let interest = (parseInt(amount) * (parseFloat(interestRate).toFixed(2) * 100)) / 100 / 100;

            interest = isMonth ? interest = Math.ceil(interest / 12) : interest = Math.ceil(interest);
            interest = addComma(interest.toString());
            $('._interest').val(interest);
        }

        if ($(this).hasClass('_amount') && amount != '' && !isNaN(amount)) {
            // 금액 천 단위 콤마 추가
            amount = addComma(amount.toString());
            $('._amount').val(amount);
        } else if ($(this).hasClass('_interestRate') && interestRate != '' && !isNaN(interestRate)) {
            // 이자율 퍼센트 결합
            interestRate = addPercent(interestRate.toString());
            $('._interestRate').val(interestRate);
        }
    });

    // 금액 포커스 시 콤마 및 기타 문자열 제거 Only 숫자
    $('._amount').on('focus', function () {
        const amount = minusStr($('._amount').val());
        $('._amount').val(amount);
    });

    // 이자율 포커스
    $('._interestRate').on('focus', function () {
        let interestRate = $('._interestRate').val();
        interestRate = interestRate.replace(/[^\d.]+/g,'');
        $('._interestRate').val(interestRate);
    });

    /**
     * 계약기간, 계약일 변경 시 종료 일 및 상환일 자동 변경
     */
    $('._contract_period, ._contractDate').on('change', function () {
        const contractPeriod = parseInt($('._contract_period').val());
        const contractDate = $('._contractDate').val();
        if (isNaN(contractPeriod) !== true && contractPeriod != null) {
            if (typeof contractDate != 'undefined' && contractDate !== '' && contractDate != null) {
                setDate(contractDate, contractPeriod);
            }
        }
    })

    /**
     * 종료일 및 상환일 변경 실행 함수
     * @param contractDate
     * @param contractPeriod
     */
    function setDate(contractDate, contractPeriod) {
        // 입금일 변경
        setPaymentDate(contractDate);

        // 종료일 변경
        const endDate = getEndDate(contractDate, contractPeriod);
        $('._endDate').attr('value', endDate);

        // 상환일 변경
        const redemptionDate = getRedemptionDate(endDate);
        $('._redemptionDate').attr('value', redemptionDate);
    }

    /**
     * 계약일 변경 시 입금날짜 세팅 Default = 계약일 = 입금일
     * @param contractDate
     */
    function setPaymentDate(contractDate){
        $('._paymentDate').val(contractDate);
    }

    /**
     * 종료 일자 계산 함수
     * @param contractDate
     * @param contractPeriod
     * @returns {string}
     */
    function getEndDate(contractDate, contractPeriod) {
        let year = contractDate.substring(0, 4);
        let month = contractDate.substring(5, 7);
        let day = contractDate.substring(8, 10);

        // Date 형식으로 변환 후 계약 기간 후 종료일 조회
        let date = new Date(year, month - 1, day);
        let endDate = new Date(date.setMonth(date.getMonth() + (contractPeriod)));

        // 형식이 yyyy. MM. dd. 오전 hh:mm:ss 라서 전체 공백 제거 후 . 으로 split
        let endDateAll = endDate.toLocaleString().replace(/\s/gi, "");

        // split 결과 예시 = ["yyyy","MM","dd","오전 hh:mm:ss"]
        let endDateArr = endDateAll.split('.');

        // [0] = year | [1] = month | [2] = day
        let endDay = endDateArr[2];         // 종료일 일

        // 타입 맞춰서 좀 더 정확히 조건 비교
        if (Number(day) !== Number(endDay)) {
            date = new Date(year, month - 1, day);

            // 해당 월의 마지막 날짜 조회
            return getLastDate(date, contractPeriod);
        }

        // 종료일 형식 변경 후 반환(yyyy-MM-dd)
        return endDate.toISOString().substring(0, 10);
    }

    /**
     * 해당 월의 마지막 날짜 조회
     * @param date
     * @param contractPeriod
     * @returns {string}
     */
    function getLastDate(date, contractPeriod) {
        // 특정 개월 후 1일
        let nextMonthFirstDate = new Date(
            date.getFullYear(),
            date.getMonth() + contractPeriod,
            1
        );

        // 위 1일 기준 해당 월의 말일
        let nextMonthLastDate = new Date(
            nextMonthFirstDate.getFullYear(),
            nextMonthFirstDate.getMonth() + 1,
            0
        );

        // 형식이 yyyy. MM. dd. 오전 hh:mm:ss 라서 공백으로 [날짜, 시간] 분리 못함 -> 전체 공백 제거 후 . 으로 split
        let endDateAll = nextMonthLastDate.toLocaleString().replace(/\s/gi, "");

        // split 결과 예시 = ["yyyy","MM","dd","오전 hh:mm:ss"]
        let endDateArr = endDateAll.split('.');
        let endYear = endDateArr[0];     // 종료일 연
        let endMonth = endDateArr[1];    // 종료일 월
        let endDay = endDateArr[2];      // 종료일 일

        if (endMonth.length < 2) endMonth = '0' + endMonth;
        if (endDay.length < 2) endDay = '0' + endDay;

        // yyyy-MM-dd 형식으로 반환
        return endYear + '-' + endMonth + '-' + endDay;
    }

    /**
     * 상환 일자 계산 함수
     * @param endDate
     * @returns {string}
     */
    function getRedemptionDate(endDate) {
        const endDay = new Date(
            endDate.substring(0, 4),
            endDate.substring(5, 7),
            0
        ).getDate();

        const year = endDate.substring(0, 4);
        const month = endDate.substring(5, 7);

        return year + '-' + month + '-' + endDay;
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

    // 이자율 퍼센트 추가
    function addPercent(value) {
        value = value + ' %';
        return value;
    }

    // 계약 기간 세팅 1 ~ 36개월
    for (var i = 1; i <= 36; i++) {
        $('._contract_period').append('<option value="' + i + '">' + i + ' 개월' + '</option>');


    }

    $(document).on('keydown', 'input', function () {

        // 입력바에서 엔터키 누를 시
        if (window.event.keyCode == 13) {
            // 강제 submit 방지
            event.preventDefault();
        }
    });

    $(document).on('keyup', 'input', function () {
        // 입력바에서 엔터키 누를 시
        if (window.event.keyCode == 13) {
            // 강제 저장 버튼 클릭
            $('._save').click();
        }
    });

    // 상세 정보에서 연장, 증액 클릭하여 접근한 경우
    setDefaultDate();

    function setDefaultDate(){

        // 이전 계약 정보 (계약기간, 이자율, 종료일)
        const contractPeriod = parseInt(getVal($('._contract_period_model')));
        const interestRate = getVal($('._interest_rate_model'));
        const preEndDate = getVal($('._end_date_model'));

        if (isNaN(contractPeriod) !== true && contractPeriod != null) {
            if (!isEmpty(preEndDate)) {
                // 이전 종료일 다음날을 계약일로 설정
                const contractDate = getDt10(preEndDate, 1);

                // 계약기간, 이자율, 계약일 세팅
                if (!isEmpty(interestRate)) $('._interestRate').val(interestRate);
                $('._contract_period').val(contractPeriod);
                $('._contractDate').val(contractDate);

                // 계약일 기준 입금날짜 상환날짜 종료일 세팅
                setDate(contractDate, contractPeriod);
            }
        }
    }

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

/**
 * 담당자 변경 이벤트
 * 담당자 변경 시 해당 담당자의 부서, 직급, 고객 리스트를 세팅 한다.
 * 담당자 정보 조회 API 호출   - "/companyChart/getEmployeeInfoForAddContract"
 * 담당자 직급 조회 API 호출   - "/companyChart/getEmployeeInfoForContractFortune"
 * 고객 리스트 조회 API 호출   - "/potential/getPotentialUserListByEmployeeCode"
 */
$('._employee_select_trans').on('change', function(){
    let employeeCode = $(this).val();

    const startNum = employeeCode.indexOf('(');
    const lastNum = employeeCode.indexOf(')');

    const employeeName = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(0, startNum).trim() : '';
    employeeCode = (startNum !== -1 && lastNum !== -1) ? employeeCode.substring(startNum + 1, lastNum).trim() : '';

    $('._employee_select_trans').val(employeeName);
    $('._select_employee_Code').val(employeeCode);

    // 부서 세팅
    setDepartment(employeeCode);

    // 직급 세팅
    setPosition(employeeCode);

    // 고객 세팅
    setPotentialUser(employeeCode);
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

/**
 * 담당자 변경 시 직급 세팅
 * @param employeeCode
 */
function setDepartment(employeeCode){
    const request = $.ajax({
        url: "/companyChart/getEmployeeInfoForAddContract",
        type: "GET",
        data: {
            employeeCode : employeeCode
        },
        dataType: "json"
    });

    request.done(function(data){
        $('._D1').text(data.d1);
        $('._D2').text(data.d2);
        $('._D3').text(data.d3);
    });
}


/**
 * 담당자 변경 시 직급 세팅
 * @param employeeCode
 */
function setPosition(employeeCode){
    const request = $.ajax({
        url: "/companyChart/getEmployeeInfoForContractFortune",
        type: "GET",
        data: {
            employeeCode : employeeCode
        },
        dataType: "json"
    });

    request.done(function(data){
        const positionName = data.positionName;
        $('._position_name').text(positionName);
    });
}

/**
 * 담당자 변경 시 해당 담당자의 고객 세팅
 * @param employeeCode
 */
function setPotentialUser(employeeCode){
    const request = $.ajax({
        url: "/potential/getPotentialUserListByEmployeeCode",
        type: "GET",
        data: {
            employeeCode : employeeCode
        },
        dataType: "json"
    });

    request.done(function(data){

        let html = '';
        html += '<option value="">고객선택(휴대폰뒷4자리)</option>';
        $.each(data, function(index, item){
            const userNo = item.potentialUserNo;
            const userName = item.combineNameAndMobileOfPotentialUser;
            html += '<option value="'+userNo+'">'+userName+'</option>';
        });

        const customerSelect = $('#customer_select');
        if(customerSelect.length){
            customerSelect.children().remove();
            customerSelect.append(html);
        }

        const clientSelect = $('.client_select');
        if(clientSelect.length){
            clientSelect.children().remove();
            clientSelect.append(html);
        }
    });
}

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

// 지점 운영비 여부 checkbox
const expensesYes = document.querySelector('.expensesYes');
const expensesNo = document.querySelector('.expensesNo');

expensesYes.checked = true; // 운영비 checkbox를 디폴트값으로 체크

expensesNo.addEventListener('click', () => {
    expensesYes.checked = false; // 운영비 checkbox의 체크를 풀어줌
    expensesNo.checked = true; // 비운영비 checkbox를 체크
});

expensesYes.addEventListener('click', () => {
    expensesNo.checked = false; // 비운영비 checkbox의 체크를 풀어줌
    expensesYes.checked = true; // 운영비 checkbox를 체크
});