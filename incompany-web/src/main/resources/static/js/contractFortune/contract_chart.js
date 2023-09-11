$(document).ready(function () {
    $('._start_date, ._end_date').on('change', function (){
        // 선택한 담당자
        let employeeCode = $('._employee_select').val();

        // 선택한 담당자가 없을 경우 로그인 한 본인의 계약 현황 조회를 위한 본인 코드 세팅
        if(typeof employeeCode == 'undefined' || employeeCode === '' || employeeCode == null){
            employeeCode = $('#reportEmployeeCode').val();
        }

        const startDate = $('._start_date').val();
        const endDate = $('._end_date').val();

        if(typeof startDate != 'undefined' && startDate !== '' && startDate != null){
            if(typeof endDate != 'undefined' && endDate !== '' && endDate != null){
                const request = $.ajax({
                    url: "/contractFortune/contractReport",
                    type: "GET",
                    data: {
                        employeeCode: employeeCode,
                        startDate: startDate,
                        endDate: endDate
                    },
                    dataType: "json"
                });

                request.done(function(data){
                    setChart(data);
                });

                request.fail(function(){
                    $('._pop3').hide();
                    $('._black_screen').hide();
                    alert('☢ Ajax ERROR');
                });
            }
        }
    });

    $('._contract_chart').on('click', function(){

        // 선택한 담당자의 코드로 계약 현황 조회
        let employeeCode = $('._employee_select').val();

        // 일반 사원이 계약현황을 클릭 할 경우 자기 자신의 코드로 계약 현황 조회하도록 설정(담당자 선택을 못하는 상황)

        if(typeof employeeCode == 'undefined' || employeeCode === '' || employeeCode == null) {
            employeeCode = $('#reportEmployeeCode').val();
        }

        console.log('employeeCode : ', employeeCode);

        // LEADER, ALL 권한인데 담당자 선택을 안한 경우 employeeCode 가 빈 값 인데 이걸 체크하기 위함
        if(typeof employeeCode != 'undefined' && employeeCode !== '' && employeeCode != null){

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
                $('._pop3').hide();
                $('._black_screen').hide();
                alert('☢ Ajax ERROR ');
            });
        }
    })

    // 금액 천 단위 콤마 추가
    function addComma(value){
        const regex = /[^0-9]/g;
        value = value.replace(regex, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    }

    function setChart(data){

        // 계약현황 사원 명 세팅
        const employeeName = data["employeeDto"]["employeeName"];
        const isNewEmployee = data["isNewEmployee"];

        // 계약 별, 계약 등급 별 퍼센트가 담긴 Dto
        const contractReportPercentDto = data["contractReportPercentDto"];

        $('._contract_employee_name').text(employeeName);
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
        setAchievement(percentMap);

        /* @@@ MONTHLY REPORT - 오른쪽 카테고리 별 가로 그래프 @@@ */
        setMonthlyReport(contPercentD, contAmount, insPercentD, insAmount);

        /* @@@ 날짜 Default Setting - 해당 월의 1일 ~ 말일 @@@ */
        const startDate = data["startDate"];
        const endDate = data["endDate"];

        $('._start_date').val(startDate);
        $('._end_date').val(endDate);
        $('._search_date').text(startDate + ' ~ ' + endDate);

        /* 모두 세팅 된 계약 현황 팝업 노출 */
        $('._pop3').show();
        $('._black_screen').show();
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
        $('.ct_chart_bar1').css('--background', 'conic-gradient(#304260 ' + Math.floor(roundPercentMax * percentMap.percentA / 100) + 'deg, #f4f6fa 50deg)');
        $('.ct_chart_bar2').css('--background', 'conic-gradient(#42ceb5 ' + Math.floor(roundPercentMax * percentMap.percentB / 100) + 'deg, #f4f6fa 50deg)');
        $('.ct_chart_bar3').css('--background', 'conic-gradient(#9199a6 ' + Math.floor(roundPercentMax * percentMap.percentC / 100) + 'deg, #f4f6fa 50deg)');
        $('.ct_chart_bar4').css('--background', 'conic-gradient(#a9b5c7 ' + Math.floor(roundPercentMax * percentMap.percentD / 100) + 'deg, #f4f6fa 50deg)');

        const ct_child_1 = $(".ct_chart:nth-child(1)");
        const ct_child_2 = $(".ct_chart:nth-child(2)");
        const ct_child_3 = $(".ct_chart:nth-child(3)");
        const ct_child_4 = $(".ct_chart:nth-child(4)");

        // 2) 퍼센트 문자열 표기
        ct_child_1.attr('data-after-content', Math.floor(percentMap.percentA / roundPercentStr) + '%');
        ct_child_2.attr('data-after-content', Math.floor(percentMap.percentB / roundPercentStr) + '%');
        ct_child_3.attr('data-after-content', Math.floor(percentMap.percentC / roundPercentStr) + '%');
        ct_child_4.attr('data-after-content', Math.floor(percentMap.percentD / roundPercentStr) + '%');

        // 3) 클래스 명 표기 (A, B, C, D)
        ct_child_1.attr('data-before-content', 'A');
        ct_child_2.attr('data-before-content', 'B');
        ct_child_3.attr('data-before-content', 'C');
        ct_child_4.attr('data-before-content', 'D');
    }

    // MONTHLY REPORT - 오른쪽 카테고리 별 가로 그래프 세팅 실행 함수
    function setMonthlyReport(contPercentD, contAmount, insPercentD, insAmount){
        /* 목돈 영역 세팅 */
        // 1) 가로바 (D 클래스 퍼센트 기준)
        $('.ct_money > .ct_money_bar1').css('--width', contPercentD+'%');

        // 2) 총 금액 표기
        $('.ct_money_bar1').parent('.ct_money').attr('data-content', contAmount);


        /* 보험 영역 세팅 */
        // 1) 가로바 (D 클래스 퍼센트 기준)
        $('.ct_money > .ct_money_bar2').css('--width', insPercentD+'%');

        // 2) 총 금액
        $('.ct_money_bar2').parent('.ct_money').attr('data-content', insAmount);


        /* 펀드 영역 세팅 - 미구현 */
        // 1) 가로바
        $('.ct_money_bar3').parent('.ct_money').attr('data-content', '0');

        // 2) 총 금액
        $('.ct_money > .ct_money_bar3').css('--width', 0+'%');
    }
})