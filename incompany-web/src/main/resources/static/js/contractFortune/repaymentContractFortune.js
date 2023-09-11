$(document).ready(function(){
    setRedemptionDate();
    setTotalAmount();
});

// 월 날짜 변경 > 해당 월의 상환 일 변경
$('._selectRepaymentDate').on('change', function(){
    const selectDate = $(this).val();
    const requestDate = $('#requestDate').val();
    if(isEmpty(selectDate) || isEmpty(requestDate)) return false;

    const repaymentMonth = getDt1(requestDate);
    const repaymentDate = selectDate;

    const request = $.ajax({
        url: "/contractFortune/addContractRepaymentDate",
        type: "GET",
        data: {
            repaymentMonth : repaymentMonth,
            repaymentDate : repaymentDate
        },
        dataType: "json"
    });

    request.done(function(data){
        const isReload = false;
        successCheck(data, isReload);

        $('._sub_ul').each(function(index, item){
            const thisUl = $(this);

            // 확인이 [상환]인 계약만 dayDif 적용한 총 금액 update
            const repaymentType = Number(thisUl.find('._select_repayment_type').val());
            if(repaymentType !== 1) return true;

            const dayDifNo = setDayDif(thisUl, repaymentDate);

            const contractCode = $(this).val() || $(this).attr('value');
            const amount = minusStr(thisUl.find('._amount').text());
            const interest = minusStr(thisUl.find('._interest').text());
            const interestPlus = Math.ceil((interest / 365) * dayDifNo);
            const note = thisUl.find('._note').val();

            const totalRepayment = (amount + interest + interestPlus);

            const contractRepaymentData = {
                'contractCode' : contractCode,
                'repaymentType' : repaymentType,
                'totalRepayment' : totalRepayment,
                'note' : note
            }

            addContractRepayment(contractRepaymentData, isReload);
        });
        location.reload();
    });
});

// 확인 select 변경 > contractRepayment insert
$('._select_repayment_type').on('change', function(){

    const thisUl = $(this).closest('._sub_ul');
    const contractCode = thisUl.attr('value');
    if(isEmpty(contractCode)) return false;

    let totalRepayment = 0;
    const amount = minusStr(thisUl.find('._amount').text());
    const interest = minusStr(thisUl.find('._interest').text());
    const interestPlus = minusStr(thisUl.find('._interestPlus').text());
    const note = thisUl.find('._note').val();

    const preRepaymentType = Number(thisUl.find('._preRepaymentType').val()) || Number(thisUl.find('._preRepaymentType').attr('value'));
    const repaymentType = Number($(this).val());

    if(preRepaymentType === 3 && repaymentType > 0 && repaymentType < 3){
        if(confirm("특이사항에서 입력 된 총 상환액이 변경 됩니다.\n정말 변경하시겠습니까?") == true){
            alert("변경 되었습니다.");
        }else {
            $(this).val(preRepaymentType);
            return;
        }
    }

    if (repaymentType === 1) {
        totalRepayment = (amount + interest + interestPlus);
    } else if(repaymentType === 2) {
        totalRepayment = interest;
    } else if(repaymentType === 0) {
        // 초기화일 경우 비고 유지, 값은 초기화! 삭제가 아님
        if(confirm("총 상환액이 초기화 됩니다.\n정말 초기화하시겠습니까?") == true){
            alert("초기화 되었습니다.");
        }else {
            $(this).val(preRepaymentType);
            return;
        }
    }

    const contractRepaymentData = {
        'contractCode' : contractCode,
        'repaymentType' : repaymentType,
        'totalRepayment' : totalRepayment,
        'note' : note
    }

    const isReload = true;
    addContractRepayment(contractRepaymentData, isReload);
});

// 총 상환액 수정
$('._editTotalRepayment').on('change', function(){
    const thisUl = $(this).closest('._sub_ul');
    const contractCode = thisUl.attr('value') || thisUl.val();
    const totalRepayment = minusStr($(this).val());

    const request = $.ajax({
        url: "/contractFortune/updateTotalRepayment",
        type: "GET",
        data: {
            contractCode : contractCode,
            totalRepayment : totalRepayment
        },
        dataType: "json"
    });

    request.done(function(data){
        const isReload = false;
        successCheck(data, isReload);
        thisUl.find('._totalRepaymentComma').val(totalRepayment);
        setTotalAmount();
    });
});

// 비고 수정
$('._note').on('change', function(){
    const contractCode = $(this).closest('._sub_ul').attr('value');
    let note = $(this).val();

    const request = $.ajax({
        url: "/contractFortune/updateNoteRepayment",
        type: "GET",
        data: {
            contractCode : contractCode,
            note : note
        },
        dataType: "json"
    });

    request.done(function(data){
        const isReload = false;
        successCheck(data, isReload);
    });
});

// 계약 상세 보기
$('._sub_ul > ._contractCode').on('click', function(){
    console.log('contractCode : ', $(this).val());
    const contractCode = $(this).val();
    if(contractCode > 0){
        const url = '/contractFortune/contractFortuneInfo?contractCode=' + contractCode;
        $(location).attr('href', url);
    }
});

// 첫 로드 시 세팅
function setRedemptionDate(){
    const selectRepaymentDate = $('._selectRepaymentDate').val();
    const isManager = $('#_isManager').hasClass('_managerTrue');
    if(isEmpty(selectRepaymentDate)) return false;

    $('._sub_ul').each(function(){
        const thisUl = $(this);

        // 날짜 차이 계산 세팅 후 날짜 차이 반환
        const dayDifNo = setDayDif(thisUl, selectRepaymentDate);

        // 추가 이자 세팅
        setInterestPlus(thisUl, dayDifNo);

        if(!isManager) {
            const repaymentChild = thisUl.find('._select_repayment_type').children().eq(3);
            repaymentChild.prop('hidden', true);
        }
    });
}

// 상단 > 상환 총합, 연장 총합 세팅
function setTotalAmount(){
    let totalAmountByRepayment = 0;
    let totalAmountByExtension = 0;
    $('._sub_ul').each(function(){
        const thisUl = $(this);

        let totalRepayment = thisUl.find('._totalRepaymentComma').val() || thisUl.find('._select_repayment_type').attr('value');
        totalRepayment = minusStr(totalRepayment);

        let repaymentType = thisUl.find('._select_repayment_type').val() || thisUl.find('._select_repayment_type').attr('value');
        repaymentType = Number(repaymentType);
        if(repaymentType === 1 || repaymentType === 3) {
            totalAmountByRepayment += totalRepayment;
        }else if(repaymentType === 2){
            totalAmountByExtension += totalRepayment;
        }
    });

    $('#_total_amount_by_repayment').text(totalAmountByRepayment.toLocaleString());
    $('#_total_amount_by_extension').text(totalAmountByExtension.toLocaleString());
}

// 날짜 차이 계산 후 세팅
function setDayDif(thisUl, selectRepaymentDate){
    const endDate = thisUl.find('._endDate').text();
    if(isEmpty(endDate)) return true;

    const dayDifNo = dayDif(endDate, selectRepaymentDate);
    thisUl.find('._redemptionDate').text(dayDifNo);

    return dayDifNo;
}

// 추가 이자 세팅
function setInterestPlus(thisUl, dayDifNo){
    let interest = thisUl.find('._interest').text();
    interest = minusStr(interest);

    interest = Math.ceil((interest / 365) * dayDifNo);
    interest = Number(interest).toLocaleString();

    thisUl.find('._interestPlus').text(interest);
}

// 상환 정보 추가 및 수정
function addContractRepayment(contractRepaymentData, isReload){
    const request = $.ajax({
        url: "/contractFortune/addContractRepayment",
        type: "GET",
        data: contractRepaymentData,
        dataType: "json"
    });

    request.done(function(data){
        successCheck(data, isReload);
    });
}

// 상환 정보 삭제
function deleteRepayment(contractCode, isReload){
    const request = $.ajax({
        url: "/contractFortune/removeContractRepayment",
        type: "GET",
        data: {
            contractCode : contractCode
        },
        dataType: "json"
    });

    request.done(function(data){
        successCheck(data, isReload);
    });
}

// 엑셀 다운로드
$('#_excel_download').on('click', function(){

    const isData = $('._sub_ul').length > 0;
    if(!isData) {
        alert('엑셀 다운로드를 위한 계약 데이터가 없습니다.');
        return false;
    }

    // 계약 데이터 추출 JsonArray 반환
    const repaymentExcelList = getJsonArrForExcel();

    if(!repaymentExcelList) {
        alert('확인이 선택된 계약이 없습니다.\n계약의 확인란을 선택해 주세요.');
        return false;
    }

    // 테이블 생성 및 데이터 세팅 > 스타일은 속성으로 적용가능, <head> 태그를 이용하여 전체 디자인 설정도 가능
    let html = '';
    html += '<table id="_repaymentExcelTable">';
    html += '<thead>';
    html += '<tr>';
    html += '<th align=center style="border : thin solid gray; width : 150px;">은행코드/은행명</th>';
    html += '<th align=center style="border : thin solid gray; width : 170px;">계좌</th>';
    html += '<th align=center style="border : thin solid gray; width : 120px;">이체금액</th>';
    html += '<th align=center style="border : thin solid gray; width : 150px;">출금표시</th>';
    html += '<th align=center style="border : thin solid gray; width : 120px;">이체메모</th>';
    html += '</tr>';
    html += '</thead>';

    html += '<tbody>';
    $.each(repaymentExcelList, function(index, excelData){
        const bankCode = excelData.bankCode;
        const accountNo = excelData.accountNo;
        const amount = excelData.amount;
        const userName = excelData.userName;
        const paymentMessage = excelData.paymentMessage;
        html += '<tr>';
        html += '<td align=center style="border : thin solid gray; width : 150px;">'+bankCode+'</td>';
        html += '<td align=center style="border : thin solid gray; width : 170px;">'+accountNo+'</td>';
        html += '<td align=center style="border : thin solid gray; width : 120px;">'+amount+'</td>';
        html += '<td align=center style="border : thin solid gray; width : 150px;">'+userName+'</td>';
        html += '<td align=center style="border : thin solid gray; width : 120px;">'+paymentMessage+'</td>';
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';

    $('#_repaymentExcelDiv').append(html);

    const table_id = '_repaymentExcelTable';
    const file_name = '상환_은행용엑셀';

    // excel_download.js > excelDownload();
    excelDownload(table_id, file_name);
});

function itoStr($num){
    $num < 10 ? $num = '0'+$num : $num;
    return $num.toString();
}

function getJsonArrForExcel(){
    const jsonArray = new Array();
    const startDate = getValue($('#startDate'));
    const month = Number(startDate.substring(5,7));

    // 이체 메모 (0월 상환)
    const paymentMessage = month.toString() + '월 상환';

    $('._sub_ul').each(function(){
        const type = Number(getValue($(this).find('._select_repayment_type')));

        if(type === 0) return true;

        // 이체 금액
        const amount = getValue($(this).find('._totalRepaymentComma'));

        // 은행 코드
        const bankCode = getValue($(this).find('._account'));

        // 계좌 번호
        const accountNo = getValue($(this).find('._accountNo'));

        /*
        - 고객 명 세팅
        상환    : 000 상환
        연장    : 000 이자상환
        특이사항 : 000
        ※ 000은 고객 명
        */
        let userName = $(this).find('._potentialUser').text();
        switch(type){
            case 1 :
                userName = userName + ' 상환';
                break;
            case 2 :
                userName = userName + ' 이자상환';
                break;
        }

        const json = new Object();
        json.userName       = userName;         // 고객 명
        json.amount         = amount;           // 이체 금액
        json.bankCode       = bankCode;         // 은행 코드
        json.accountNo      = accountNo;        // 계좌 번호
        json.paymentMessage = paymentMessage;   // 이체 메모
        jsonArray.push(json);
    });

    const isJsonData = jsonArray.length > 0;
    if(!isJsonData) return false;

    return jsonArray;
}


// 값 추출
function getValue(item){
    return item.attr('value') || item.val();
}