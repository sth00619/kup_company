$(document).ready(function () {

    const employeeCode = $('#reportEmployeeCode').val();

    const request = $.ajax({
        url: "/contractFortune/contractReport",
        type: "GET",
        data: {employeeCode: employeeCode},
        dataType: "json"
    });

    request.done(function(data){
        setChart(data);
    });

    request.fail(function(){
        $('._black_screen').hide();
        alert('☢ Ajax ERROR ');
    });

    // 금액 천 단위 콤마 추가
    function addComma(value){
        const regex = /[^0-9]/g;
        value = value.replace(regex, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    }

    function setChart(data){
        // 계약현황 사원 명 세팅
        const isNewEmployee = data["isNewEmployee"]

        // 계약 별, 계약 등급 별 퍼센트가 담긴 Dto
        const contractReportPercentDto = data["contractReportPercentDto"];

        // 목돈 계약 퍼센트 계산 ※ - 소수점 버림
        const contPercentA = contractReportPercentDto["contPercentA"];
        const contPercentB = contractReportPercentDto["contPercentB"];
        const contPercentC = contractReportPercentDto["contPercentC"];
        const contPercentD = contractReportPercentDto["contPercentD"];
        const contAmount = addComma(contractReportPercentDto["contAmount"].toString());

        const insPercentA = contractReportPercentDto["insPercentA"];
        const insPercentB = contractReportPercentDto["insPercentB"];
        const insPercentC = contractReportPercentDto["insPercentC"];
        const insPercentD = contractReportPercentDto["insPercentD"];
        const insAmount = addComma(contractReportPercentDto["insAmount"].toString());

        /* @@@ ACHIEVEMENT - 왼쪽 원형 그래프 영역 @@@ */
        // 적용 퍼센트 = (목돈 + 보험)
        const percentMap = {
            'percentA' : (contPercentA + insPercentA),
            'percentB' : (contPercentB + insPercentB),
            'percentC' : (contPercentC + insPercentC),
            'percentD' : (contPercentD + insPercentD),
            'isNewEmployee' : isNewEmployee
        }
        setAchievement(percentMap)

        /* @@@ MONTHLY REPORT - 오른쪽 카테고리 별 가로 그래프 @@@ */
        setMonthlyReport(contPercentD, contAmount, insPercentD, insAmount);

        /* @@@ 날짜 Default Setting - 해당 월의 1일 ~ 말일 @@@ */
        const startDate = data["startDate"];
        const endDate = data["endDate"];

        $('._start_date').val(startDate);
        $('._end_date').val(endDate);
        $('._search_date').text(startDate + ' ~ ' + endDate);
    }

    // ACHIEVEMENT - 왼쪽 원형 그래프 영역 세팅 실행함수
    function setAchievement(percentMap){
        // Default - 정직원
        let roundPercentMax = 180;
        let roundPercentStr = 2;

        // 3개월 미만 신입사원
        if(percentMap.isNewEmployee) {
            roundPercentMax = 360;
            roundPercentStr = 1;
        }

        // 1) 360도 퍼센트 바
        $('.chart_bar1').css('--background', 'conic-gradient(#304260 ' + Math.floor(roundPercentMax * percentMap.percentA / 100) + 'deg, #f4f6fa 50deg)');
        $('.chart_bar2').css('--background', 'conic-gradient(#42ceb5 ' + Math.floor(roundPercentMax * percentMap.percentB / 100) + 'deg, #f4f6fa 50deg)');
        $('.chart_bar3').css('--background', 'conic-gradient(#9199a6 ' + Math.floor(roundPercentMax * percentMap.percentC / 100) + 'deg, #f4f6fa 50deg)');
        $('.chart_bar4').css('--background', 'conic-gradient(#a9b5c7 ' + Math.floor(roundPercentMax * percentMap.percentD / 100) + 'deg, #f4f6fa 50deg)');

        const child_1 = $(".chart:nth-child(1)");
        const child_2 = $(".chart:nth-child(2)");
        const child_3 = $(".chart:nth-child(3)");
        const child_4 = $(".chart:nth-child(4)");

        // 2) 퍼센트 문자열 표기
        child_1.attr('data-after-content', Math.floor(percentMap.percentA / roundPercentStr) + '%');
        child_2.attr('data-after-content', Math.floor(percentMap.percentB / roundPercentStr) + '%');
        child_3.attr('data-after-content', Math.floor(percentMap.percentC / roundPercentStr) + '%');
        child_4.attr('data-after-content', Math.floor(percentMap.percentD / roundPercentStr) + '%');

        // 3) 클래스 명 표기 (A, B, C, D)
        child_1.attr('data-before-content', 'A');
        child_2.attr('data-before-content', 'B');
        child_3.attr('data-before-content', 'C');
        child_4.attr('data-before-content', 'D');
    }

    // MONTHLY REPORT - 오른쪽 카테고리 별 가로 그래프 세팅 실행 함수
    function setMonthlyReport(contPercentD, contAmount, insPercentD, insAmount){
        /* 목돈 영역 세팅 */
        // 1) 가로바 (D 클래스 퍼센트 기준)
        $('.money > .money_bar1').css('--width', contPercentD+'%');

        // 2) 총 금액 표기
        $('.money_bar1').parent('.money').attr('data-content', contAmount);


        /* 보험 영역 세팅 */
        // 1) 가로바 (D 클래스 퍼센트 기준)
        $('.money > .money_bar2').css('--width', insPercentD+'%');

        // 2) 총 금액
        $('.money_bar2').parent('.money').attr('data-content', insAmount);


        /* 펀드 영역 세팅 - 미구현 */
        // 1) 가로바
        $('.money_bar3').parent('.money').attr('data-content', '0');

        // 2) 총 금액
        $('.money > .money_bar3').css('--width', 0+'%');
    }

    /*오늘 날짜 가져오기*/
    date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let today = year + '.' + month + '.' + day;
    $('#today').text(today);
})