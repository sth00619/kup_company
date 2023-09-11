$(document).ready(function () {

    // 본부 및 지점 select
    $('._central_department, ._sales_department').on('change', function () {
        var departmentCode = $(this).val();
        var hasCentralClass = $(this).hasClass('_central_department');
        var centralDepartment = $('._central_department');
        var salesDepartment = $('._sales_department');
        var employeeSelect = $('._employee_select');
        var positionSelect = $('._position_select');
        var positionCode = positionSelect.val();

        // 선택 안함
        if (hasCentralClass == false && departmentCode == '') {
            // 지점 - 본부 선택
            departmentCode = $('._central_department').val();
        } else if (hasCentralClass == true && departmentCode == '') {
            // 본부 - 지점, 담당자 구분, 담당자 초기화
            salesDepartment.children().remove();
            salesDepartment.append('<option selected disabled>지점 선택</option>');

            employeeSelect.children().remove();
            employeeSelect.append('<option selected disabled>담당자 선택</option>');

            centralDepartment.val('default').prop('select', true);
            positionSelect.val('default').prop('select', true);
            $('#departmentCode').val('');
            return;
        }

        $('#departmentCode').val(departmentCode);
        selectChangeAjax(departmentCode, positionCode, hasCentralClass);
    });

    // 계약 기간 세팅
    setContractPeriod();

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

    // 담당자 구분(직급) select
    $('._position_select').on('change', function () {
        var positionCode = $(this).val();
        var departmentCode = $('#departmentCode').val();
        var hasCentralClass = false;

        if (departmentCode.length == 5) hasCentralClass = true;

        if (positionCode == '') $('._position_select').val('default').prop('select', true);

        if (typeof departmentCode != 'undefined' && departmentCode != '' && departmentCode != null) {
            selectChangeAjax(departmentCode, positionCode, hasCentralClass);
        }
    });

    // 담당자 선택 시 담당자 구분 자동 select
    $('._employee_select').on('change', function () {
        var data_position = $(this).find(':selected').attr('data-position');
        $('._position_select').val(data_position).prop('select', true);
    });

    // 1 - 본부         : 하위 부서(지점) 조회 = (hasCentralClass == true)
    // 2 - 본부 or 지점  : 해당 부서 및 하위 부서 전체의 담당자 조회
    // * - 본부 or 지점  : 직급이 선택 되어 있으면 해당 직급의 담당자만 조회
    // 3 - 담당자 구분   : 선택한 직급의 담당자만 조회
    function selectChangeAjax(departmentCode, positionCode, hasCentralClass) {
        var salesDepartment = $('._sales_department');
        var employeeSelect = $('._employee_select');

        var request = $.ajax({
            url: '/companyChart/getEmployeeByDepartmentOrPosition',
            method: 'GET',
            data: {departmentCode: departmentCode, positionCode: positionCode},
            dataType: 'json'
        });

        request.done(function (data) {
            if (hasCentralClass) {
                // 지점 초기화
                salesDepartment.children().remove();
                salesDepartment.append('<option selected disabled>지점 선택</option>');

                // 지점 세팅
                $(data.departmentList).each(function (index, item) {
                    salesDepartment.append('<option value="' + item.departmentCode + '">' + item.departmentName + '</option>');
                });
                salesDepartment.append('<option value="">선택 안함</option>');
            }

            // 담당자 초기화
            employeeSelect.children().remove();
            employeeSelect.append('<option selected disabled>담당자 선택</option>');

            // 담당자 세팅
            $(data.employeeList).each(function (index, item) {
                employeeSelect.append('<option value="' + item.employeeCode +
                    '" data-position="' + item.positionCode +
                    '">' + item.employeeName + '</option>');
            })
            employeeSelect.append('<option value="">선택 안함</option>');
        });

        request.fail(function (jqXHR, textStatus) {
            alert('☢ Ajax ERROR : ', jqXHR, textStatus, '\n 담당자에게 문의 하세요.');
        });
    };

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
        // 종료일 변경
        const endDate = getEndDate(contractDate, contractPeriod);
        $('._endDate').attr('value', endDate);

        // 상환일 변경
        const redemptionDate = getRedemptionDate(endDate);
        $('._redemptionDate').attr('value', redemptionDate);
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

    function setContractPeriod() {
        // 계약 기간 세팅 1 ~ 36개월
        for (var i = 1; i <= 36; i++) {
            $('._contract_period').append('<option value="' + i + '">' + i + ' 개월' + '</option>');
        }

        var periodVal = $('._contract_period_val').val();
        var periodChild = $('._contract_period').children();

        $.each(periodChild, function (index, item) {
            if (item.value == periodVal) {
                $(this).prop('selected', true);
            }
        })
    }

});

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