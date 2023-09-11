$(document).ready(function () {
    // 최상단 > 기간에 따른 법인 별 모든 부서의 전체 통계 데이터 세팅
    setTotalStatisticsAction();

    // 팀별 통계 데이터 세팅 후 합산하여 지점 통계 데이터 세팅
    setStatisticsAction();

    // 부서 선택 > 라디오 그룹 체크 유지
    checkedDepartment();

    $('._weekly').hide();
});

// 부서 선택 > 라디오 버튼 > change 이벤트
$('input[type=radio][name=departmentCode]').on('change', function () {
    const departmentCode = $(this).val();
    if(isEmpty(departmentCode)) return false;

    changeDepartment(departmentCode);
});

// 부서 선택 > 라디오 버튼 > 옆 글자 클릭 이벤트
$('._check_department').on('click',function() {
    const departmentCode = $(this).parent().find('input').val();
    if(isEmpty(departmentCode)) return false;
    changeDepartment(departmentCode);
});

// 통계 데이터 세팅
function setStatisticsAction(){
    const fistDepartmentCode = $('._contract_sub_title').eq(0).attr('value');

    let departmentCode = '';
    let departmentCodeArr = [];

    // 부서 코드 배열로 세팅
    $('._contract_sub_title').each(function(index, item){
        const thisVal = $(this).attr('value');
        const isEquals = departmentCode === thisVal;

        // 부서 중복 삽입 방지
        if(!isEquals && thisVal.length >= 5) {
            departmentCode = thisVal;
            departmentCodeArr.push(thisVal);
        }
    });

    // 지점, 팀의 모든 합산 데이터 변수 -> 지점 세팅
    let totalCountEmployee = 0;
    let totalAmountCont = 0;
    let totalCountCont = 0;
    let totalAmountIns = 0;
    let totalCountIns = 0;
    let totalAvailablePeople = 0;
    let totalOperationPeople = 0;

    // 지점 및 팀 세팅 (지점은 빈값 - 나중에 총 합산해서 세팅)
    for(let i = 0; i < departmentCodeArr.length; i++){

        let countEmployee = 0;                  // 사원 수
        let sumAmountCont = 0;                  // 목돈 금액
        let sumCountCont = 0;                   // 목돈 계약 횟수
        let sumAmountIns = 0;                   // 보험 금액
        let sumCountIns = 0;                    // 보험 계약 횟수
        let availablePeople = 0;                // 가동인원 (목돈 500만원 이상 or 보험 3만원 이상)
        let operationPeople = 0;                // 실동인원 (목돈 1천만원 이상 or 보험 30만원 이상)
        let availableRate = 0;                  // 가동률
        let operationRate = 0;                  // 실동률
        let contractFortuneProductivity = 0;    // 목돈생산성
        let insuranceProductivity = 0;          // 보험생산성
        let departmentName = '';                // 부서 명
        let departmentCodeBySubUl = '';         // 부서 코드

        // 부서별 각 데이터 합산
        $('._contract_sub_title[value='+departmentCodeArr[i]+']').each(function(index, item){
            let amountCont = $(this).find('._totalAmountContractFortune').val();
            let amountIns = $(this).find('._totalAmountInsurance').val();

            // 부서 명
            if(index === 0) {
                departmentName = $(this).data('department');
                departmentCodeBySubUl = $(this).val() || $(this).attr('value');
            }

            // 금액
            if(isEmpty(amountCont)) amountCont = 0;
            if(isEmpty(amountIns)) amountIns = 0;

            // 가동인원 (목돈 500만원 이상 or 보험 3만원 이상)
            if(amountCont > 5000000 || amountIns > 30000) availablePeople++;

            // 실동인원 (목돈 1천만원 이상 or 보험 30만원 이상)
            if(amountCont > 10000000 || amountIns > 300000) operationPeople++;

            // 목돈 금액 팀별 총 합, 건 수 총합
            sumAmountCont += Number(amountCont);
            sumCountCont += $(this).data('count-cont');

            // 보험 금액 팀별 총 합, 건 수 총합
            sumAmountIns += Number(amountIns);
            sumCountIns += $(this).data('count-ins');

            // 팀의 총 사원 수
            countEmployee ++;
        });

        // 지점 세팅 변수에 조회된 모든 부서의 데이터 합산
        totalCountEmployee += countEmployee;
        totalAmountCont += sumAmountCont;
        totalCountCont += sumCountCont;
        totalAmountIns += sumAmountIns;
        totalCountIns += sumCountIns;
        totalAvailablePeople += availablePeople;
        totalOperationPeople += operationPeople;

        // 가동률, 실동률
        availableRate = Math.floor(availablePeople / countEmployee * 100) + '%';
        operationRate = Math.floor(operationPeople / countEmployee * 100) + '%';

        // 목돈생산성, 보험생산성
        contractFortuneProductivity = addComma(Math.floor(sumAmountCont / countEmployee).toString());
        insuranceProductivity = addComma(Math.floor(sumAmountIns / countEmployee).toString());

        // 금액 콤마 추가
        sumAmountCont = addComma(sumAmountCont.toString());
        sumAmountIns = addComma(sumAmountIns.toString());

        // 합산 된 데이터로 지점 및 팀 html 세팅
        // i =0 -> 지점 세팅, 부서 명만 세팅, 모든 부서 데이터 합산 후 지점 세팅
        // 그 외엔 팀 세팅
        let html = '';
        if(i === 0){
            html += '<div>';
            html += '<ul class="contract_main_title _contract_sub_title _sub_ul _total_statistics _total_department" value="'+departmentCodeBySubUl+'">';
            html += '<li style="width:100px;">'+departmentName+'</li>';
            html += '<li class="_countEmployee" style="width:100px;"></li>';
            html += '<li class="_sumAmountCont" style="width:120px;"></li>';
            html += '<li class="_sumCountCont" style="width:100px;"></li>';
            html += '<li class="_sumAmountIns" style="width:120px;"></li>';
            html += '<li class="_sumCountIns" style="width:100px;"></li>';
            html += '<li class="_availablePeople" style="width:100px;"></li>';
            html += '<li class="_operationPeople" style="width:100px;"></li>';
            html += '<li class="_availableRate" style="width:100px;"></li>';
            html += '<li class="_operationRate" style="width:100px;"></li>';
            html += '<li class="_contractFortuneProductivity" style="width:120px;"></li>';
            html += '<li class="_insuranceProductivity" style="width:120px;"></li>';
            html += '</ul>';
            html += '</div>';
        } else {
            html += '<div style="margin-top:100px;">'; // border-top:1px solid #304260;
            html += '<ul class="contract_main_title _total_department" value="'+departmentCodeBySubUl+'">';
            html += '<li style="width:100px;">팀</li>';
            html += '<li style="width:100px;">총인원</li>';
            html += '<li style="width:120px;">목돈</li>';
            html += '<li style="width:100px;">목돈계약횟수</li>';
            html += '<li style="width:120px;">보험</li>';
            html += '<li style="width:100px;">보험계약횟수</li>';
            html += '<li style="width:100px;">가동인원</li>';
            html += '<li style="width:100px;">실동인원</li>';
            html += '<li style="width:100px;">가동률(%)</li>';
            html += '<li style="width:100px;">실동률(%)</li>';
            html += '<li style="width:120px;">목돈생산성</li>';
            html += '<li style="width:120px;">보험생산성</li>';
            html += '</ul>';
            html += '</div>';
            html += '<div style="border-top:1px solid #304260;">';
            html += '<ul class="contract_main_title _contract_sub_title _sub_ul _total_statistics">';
            html += '<li style="width:100px;">'+departmentName+'</li>';
            html += '<li style="width:100px;">'+countEmployee+'</li>';
            html += '<li style="width:120px;">'+sumAmountCont+'</li>';
            html += '<li style="width:100px;">'+sumCountCont+'</li>';
            html += '<li style="width:120px;">'+sumAmountIns+'</li>';
            html += '<li style="width:100px;">'+sumCountIns+'</li>';
            html += '<li style="width:100px;">'+availablePeople+'</li>';
            html += '<li style="width:100px;">'+operationPeople+'</li>';
            html += '<li style="width:100px;">'+availableRate+'</li>';
            html += '<li style="width:100px;">'+operationRate+'</li>';
            html += '<li style="width:120px;">'+contractFortuneProductivity+'</li>';
            html += '<li style="width:120px;">'+insuranceProductivity+'</li>';
            html += '</ul>';
            html += '</div>';
        }

        // 각 부서 코드를 가진 요소 중 첫 번째 요소의 바로 이전 위치에 합산 한 html 을 세팅
        $('._contract_sub_title[value='+departmentCodeArr[i]+']').eq(0).before(html);
    }

    // 지점 데이터 세팅 (모든 팀, 지점의 데이터 합산)
    const totalStatistics = $('._total_statistics').eq(0);
    if(!isEmpty(totalStatistics)){
        totalStatistics.find('._countEmployee').text(totalCountEmployee);
        totalStatistics.find('._sumAmountCont').text(addComma(totalAmountCont.toString()));
        totalStatistics.find('._sumCountCont').text(totalCountCont);
        totalStatistics.find('._sumAmountIns').text(addComma(totalAmountIns.toString()));
        totalStatistics.find('._sumCountIns').text(totalCountIns);
        totalStatistics.find('._availablePeople').text(totalAvailablePeople);
        totalStatistics.find('._operationPeople').text(totalOperationPeople);
        totalStatistics.find('._availableRate').text(Math.floor(totalAvailablePeople / totalCountEmployee * 100) + '%');
        totalStatistics.find('._operationRate').text(Math.floor(totalOperationPeople / totalCountEmployee * 100) + '%');
        totalStatistics.find('._contractFortuneProductivity').text(addComma(Math.floor(totalAmountCont / totalCountEmployee).toString()));
        totalStatistics.find('._insuranceProductivity').text(addComma(Math.floor(totalAmountIns / totalCountEmployee).toString()));
    }
}

// 최상단 > 전체 통계 > 가동률 실동률세팅
function setTotalStatisticsAction(){
    const countEmployee = $('._mainTotalCountEmployee').text();
    const availablePeople = $('._mainTotalAvailablePeople').text();
    const operationPeople = $('._mainTotalOperationPeople').text();

    // 가동률, 실동률
    const availableRate = Math.floor(availablePeople / countEmployee * 100) + '%';
    const operationRate = Math.floor(operationPeople / countEmployee * 100) + '%';

    $('._mainTotalAvailableRate').text(availableRate);
    $('._mainTotalOperationRate').text(operationRate);
}

// 부서 선택 > 라디오 그룹 체크 유지
function checkedDepartment(){
    const radioDepartmentCode = $('#departmentCode').val();
    var checkIndex = $('input[type=radio][name=departmentCode]').index(radioDepartmentCode);
    if(!isEmpty(radioDepartmentCode) && radioDepartmentCode != 'D'){
        const checkedRadio = $('input[type=radio][name=departmentCode][value='+ radioDepartmentCode +']');
        if(!isEmpty(checkedRadio)) {
            checkedRadio.attr('checked','checked');

            checkIndex = $('input[type=radio][name=departmentCode]').index(checkedRadio);

            $('._check_box_department span').removeClass('onon');
            $('._check_box_department span').eq(checkIndex).addClass('onon');
            $('._check_box_department label').removeClass('onon2');
            $('._check_box_department label').eq(checkIndex).addClass('onon2');
        }
    }
};

// 부서 선택 > 실행 함수
function changeDepartment(departmentCode){
    let url = '/statistics/statistics?departmentCode='+departmentCode;

    const dateType = $('#dateType').val();
    url += '&dateType='+dateType;

    let requestDate;
    if(dateType === '1'){
        requestDate = $('._search_month_date').attr('value');
    } else {
        requestDate = $('._search_start_date').val();
    }
    url += '&requestDate=' + requestDate;

    $(location).attr('href', url);
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

// <li> 클릭 시 강제 <a> 클릭
$('._clickLi').on('click', function(){

    let url = 'none';
    const defaultVal = 0;
    if($(this).hasClass('_name')){
        // 이름 클릭 시 목돈 값이 있다면 목돈으로 이동 목돈 값이 없고 보험 값만 있다면 보험으로 이동
        const conVal = $(this).parent().find('._totalAmountContractFortune').val();
        const insVal = $(this).parent().find('._totalAmountInsurance').val();
        if(conVal === defaultVal && insVal > defaultVal){
            url = $(this).parent().find('._totalAmountInsurance').children('a').attr('href');
        } else {
            url = $(this).parent().find('._totalAmountContractFortune').children('a').attr('href');
        }
    } else {
        // 목돈, 보험 각각 이동
        const thisVal = $(this).val();
        if(thisVal > defaultVal) url = $(this).children('a').attr('href');
    }

    if(url !== 'none') $(location).attr('href', url);
});

// 지점, 팀의 목돈 및 보험 클릭 시 해당 부서 + 기간으로 조회
$(document).on('click', '._sumAmountCont, ._sumCountCont, ._sumAmountIns, ._sumCountIns', function(){
    const thisUl = $(this).closest('._total_department');

    let url = '/contractFortune/contractFortune';
    if($(this).hasClass('_sumAmountIns') || $(this).hasClass('_sumCountIns')) url = '/insurance/insurance';

    const departmentCode = thisUl.val() || thisUl.attr('value');
    const startDate = $('#startDate').val() || $('#startDate').attr('value');
    const endDate = $('#endDate').val() || $('#endDate').attr('value');

    $(location).attr('href', url + '?departmentCode='+departmentCode+'&startDate='+startDate+'&endDate='+endDate);
});
