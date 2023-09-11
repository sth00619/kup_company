$(document).ready(function(){

    const dateType = $('#dateType').val();
    const departmentCode = $('#departmentCode').val();

    let maxValue = 0;   // y축 최대값

    /* 조건에 따른 labelName */
    let labelNameOfCf;
    let labelNameOfI;

    if (departmentCode == 'D') {
        if (dateType == 1){
            labelNameOfCf = '월간 목돈 총합계'
            labelNameOfI = '월간 보험 총합계'
        } else if (dateType == 2){
            labelNameOfCf = '주간 목돈 총합계'
            labelNameOfI = '주간 보험 총합계'
        }
    } else if(departmentCode == 'D0101') {
        if (dateType == 1){
            labelNameOfCf = '월간 경영지원 목돈 총합계'
            labelNameOfI = '월간 경영지원 목돈 총합계'
        } else if (dateType == 2){
            labelNameOfCf = '주간 경영지원 목돈 총합계'
            labelNameOfI = '주간 경영지원 목돈 총합계'
        }
    } else if(departmentCode == 'D0201') {
        if (dateType == 1){
            labelNameOfCf = '월간 오너지점 목돈 총합계'
            labelNameOfI = '월간 오너지점 보험 총합계'
        } else if (dateType == 2){
            labelNameOfCf = '주간 오너지점 목돈 총합계'
            labelNameOfI = '주간 오너지점 보험 총합계'
        }
    } else if(departmentCode == 'D0301') {
        if (dateType == 1){
            labelNameOfCf = '월간 선두지점 목돈 총합계'
            labelNameOfI = '월간 선두지점 보험 총합계'
        } else if (dateType == 2){
            labelNameOfCf = '주간 선두지점 목돈 총합계'
            labelNameOfI = '주간 선두지점 보험 총합계'
        }
    } else if(departmentCode == 'D0401') {
        if (dateType == 1){
            labelNameOfCf = '월간 위너지점 목돈 총합계'
            labelNameOfI = '월간 위너지점 보험 총합계'
        } else if (dateType == 2){
            labelNameOfCf = '주간 위너지점 목돈 총합계'
            labelNameOfI = '주간 위너지점 보험 총합계'
        }
    }  else if(departmentCode == 'D0501') {
         if (dateType == 1){
             labelNameOfCf = '월간 PB지점 목돈 총합계'
             labelNameOfI = '월간 PB지점 보험 총합계'
         } else if (dateType == 2){
             labelNameOfCf = '주간 PB지점 목돈 총합계'
             labelNameOfI = '주간 PB지점 보험 총합계'
         }
    }else if(departmentCode == 'D0502') {
          if (dateType == 1){
              labelNameOfCf = '월간 WM지점 목돈 총합계'
              labelNameOfI = '월간 WM지점 보험 총합계'
          } else if (dateType == 2){
              labelNameOfCf = '주간 WM지점 목돈 총합계'
              labelNameOfI = '주간 WM지점 보험 총합계'
          }
    }

    /* 목돈 그래프 */
    let cfDataList = $('._cfChartDataList');
    let xOfCfDataArr = [];  // x축 월 (ex 1,2,3,...,12)
    let totalOfCfArr = [];  // 데이터 배열


    if (dateType == 1){
        createMonthDataOfCf(cfDataList);
        maxValue = 4000000000;
    } else if (dateType == 2){
        createWeeklyDataOfCf(cfDataList);
        maxValue = 1000000000;
    }

    // 월간 별
    function createMonthDataOfCf (chartDataList) {
        for (var i = 1; i < 13; i++) {
            xOfCfDataArr.push(i);

            let total = 0;
            let data;

            $(chartDataList).each(function(index, item){

                date = $(this).attr('data-date');
                let subDate = date.substring(5,7);

                if (subDate == i) {
                    total = $(this).val();
                }
            });

            totalOfCfArr.push(total);
        }
    }

    // 주간 별
    function createWeeklyDataOfCf (chartDataList) {
        for (var i = 1; i < 53; i++) {
            xOfCfDataArr.push(i);

            let total = 0;
            let data;

            $(chartDataList).each(function(index, item){

                date = $(this).attr('data-date');
                let subDate = date;

                if (subDate == i) {
                    total = $(this).val();
                }
            });

            totalOfCfArr.push(total);
        }
    }

    // 목돈 그래프 (주간, 월간)
    const cfChartByCriteria = $('#contractFortuneChart');
    const cfChart = new Chart(cfChartByCriteria, {
        type: 'line',
        data: {
            labels: xOfCfDataArr,
            datasets: [{
                label: labelNameOfCf,
                data: totalOfCfArr,
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    max : maxValue
                }
            }
        }
    });


    /* 보험 그래프 */
    let iDataList = $('._iChartDataList');
    let xOfIDataArr = [];  // x축
    let totalOfIArr = [];  // 데이터 배열

    if (dateType == 1){
        createMonthDataOfI(iDataList);
        maxValue = 20000000;
    } else if (dateType == 2){
        createWeeklyDataOfI(iDataList);
        maxValue = 5000000;
    }

    // 월간 별
    function createMonthDataOfI (chartDataList) {

        for (var i = 1; i < 13; i++) {
            xOfIDataArr.push(i);

            let total = 0;
            let data;

            $(chartDataList).each(function(index, item){

                date = $(this).attr('data-date');
                let subDate = date.substring(5,7);

                if (subDate == i) {
                    total = $(this).val();
                }
            });

            totalOfIArr.push(total);
        }
    }

    // 주간 별
    function createWeeklyDataOfI (chartDataList) {

        for (var i = 1; i < 53; i++) {
            xOfIDataArr.push(i);

            let total = 0;
            let data;

            $(chartDataList).each(function(index, item){

                date = $(this).attr('data-date');
                let subDate = date;

                if (date == i) {
                    total = $(this).val();
                }
            });

            totalOfIArr.push(total);
        }
    }


    // 보험 그래프 (주간, 월간)
    const iChartByCriteria = $('#insuranceChart');
    const iChart = new Chart(iChartByCriteria, {
        type: 'line',
        data: {
            labels: xOfIDataArr,
            datasets: [{
                label: labelNameOfI,
                data: totalOfIArr,
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y : {
                    max : maxValue
                }
            }
        }
    });
})
