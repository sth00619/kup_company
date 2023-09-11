$(document).ready(function(){
    /*공백제거*/
    $(document).on('blur', '._fundTitle, ._fundAmount', function(){
        var trimStr = $(this).val().trim();
        $(this).val(trimStr);
    });


    /*추가버튼 클릭 시 html 생성*/
    $('#addBox').on('click',function(){
        var innerHtml = '';
        innerHtml += '  <ul class="_fund_info_box _nonInfoNo _sub_ul">';
        innerHtml += '      <li class="sub_first_txt _onlyCheckBox _sub_first_txt">';
        innerHtml += '          <label class="_sub_label" for="checkbox"></label>';
        innerHtml += '          <input class="_sub_check" id="checkbox" type="checkbox">';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_fundJoinDate" name="fundJoinDate" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <select class="keep_select _fundState" name="fundState">';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <select name="achieveCheck" class="Y_select _achieveCheck">';
        innerHtml += '              <option value="Y">Y</option>';
        innerHtml += '              <option value="N">N</option>';
        innerHtml += '              <option value="H">50%</option>';
        innerHtml += '              <option value="F">25%</option>';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="w_amend2">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_fundTitle" maxlength="100" name="fundTitle" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_accountOpenDate" name="accountOpenDate" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_fundPayTerm" name="fundPayTerm" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_fundPayDate" name="fundPayDate" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li>';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_fundAmount _numberOnly" maxlength="20" name="fundAmount" placeholder="숫자 입력" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '  </ul>';
        $('._fundInfo').prepend(innerHtml);

        // 추가 시 펀드 구분 세팅
        var fundState = $('._fundState').eq(1).children();
        $.each(fundState, function(index, item){
            var fundStateClone = $(this).clone();
            $('._fundState').eq(0).append(fundStateClone);
        });

        //추가 시 포커스 이동
        $('._fundJoinDate').eq(0).focus();
    });

    /*금액 더해서 총금액 만들기*/
    $(document).on('blur','._fundAmount', function(){
        minusAmount();
    });

    // 실적 변경 시
    $(document).on('change', '._achieveCheck', function(){
        minusAmount();
    });

    // 실적 인정 금액 및 총 금액 세팅
    function minusAmount(){
        let sumAmount = 0;
        let sumPerformance = 0;

        const _fundAmount = $('._fundAmount');
        $.each(_fundAmount, function(){
            if($(this).closest('._deleteInfoByAddForm').length) return true; //continue - 건너뛰기
            let amount = $(this).val();
            let type = $(this).closest('._fund_info_box').find('._achieveCheck').val();

            amount = Number(removeComma(amount));
            $(this).prop('value',amount.toLocaleString());

            // 총 금액 합산
            sumAmount += amount;

            // 실적 계산 후 합산
            amount = type === 'H' ? Math.floor(amount / 2) : amount;
            amount = type === 'F' ? Math.floor(amount / 4) : amount;
            amount = type === 'N' ? 0 : amount;

            sumPerformance += amount;
        });

        // 총 금액
        sumAmount = sumAmount.toLocaleString();
        $('._totalAmount').prop('value',sumAmount);
        $('#_totalAmount').text(sumAmount);

        // 실적
        sumPerformance = sumPerformance.toLocaleString();
        $('#_totalPerformance').text(sumPerformance);
    }

    //체크박스 체크 후 삭제 버튼 클릭 시 삭제
    $(document).on('click','#deleteBox', function(){
        //삭제
        const totalSub = $('._sub_check').length;
        const checkedSub = $('._sub_check:checked').length;

        if(totalSub === checkedSub){
            alert('한개 이상은 입력해주세요.');
        } else{
            $('._check').closest('._fund_info_box').addClass('_deleteInfoByAddForm');
            $('._check').closest('._deleteInfoByAddForm').hide();
            $('._check').closest('._nonInfoNo').remove();
            minusAmount();
        }
    });

    // 콤마추가
    function addComma(value){
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    }
    // 콤마제거
    function removeComma(value){
        var regExp = /[ \{\}\[\]\?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
        value = value.replaceAll(regExp, "");
        return value;
    }

    /*fund, fundInfo 값을 배열로 만들어 controller 전송*/
    $(document).on('click', '._submitBtn', function () {
        // 저장 버튼 클릭 시 공백 유효성 검사 1
        let isSuccess = true;
        $("._fund_guest_deta").each(function (index) {
            if ($(this).find('._employee_select_trans').val() == '') {
                alert("✔담당자를 입력해 주세요.✔");
                $(this).find('._employee_select_trans').focus();
                isSuccess =  false;
            }else if ($(this).find('.client_select').val() == '') {
                alert("✔고객을 입력해 주세요.✔");
                $(this).find('.client_select').focus();
                isSuccess =  false;
            }
        });

        // 저장 버튼 클릭 시 공백 유효성 검사 2
        $("._fund_info_box").each(function (index) {
            if($(this).closest('._deleteInfoByAddForm').length) return true;
            if(!isSuccess) return false;
            if ($(this).find('._fundJoinDate').val() == '') {
                alert("✔계약날짜를 입력해 주세요.✔");
                $(this).find('._fundJoinDate').focus();
                isSuccess =  false;
            }else if ($(this).find('._fundTitle').val() == '') {
                alert("✔종목을 입력해 주세요.✔");
                $(this).find('._fundTitle').focus();
                isSuccess =  false;
            }else if ($(this).find('._accountOpenDate').val() == '') {
                alert("✔계자개설일을 입력해 주세요.✔");
                $(this).find('._accountOpenDate').focus();
                isSuccess =  false;
            }else if ($(this).find('._fundPayTerm').val() == '') {
                alert("✔만기일을 입력해 주세요.✔");
                $(this).find('._fundPayTerm').focus();
                isSuccess =  false;
            }else if ($(this).find('._fundPayDate').val() == '') {
                alert("✔이체일을 입력해 주세요.✔");
                $(this).find('._fundPayDate').focus();
                isSuccess =  false;
            }else if ($(this).find('._fundAmount').val() == '' || $(this).find('._fundAmount').val() == '0') {
                alert("✔펀드 금액을 입력해 주세요.✔");
                $(this).find('._fundAmount').focus();
                isSuccess =  false;
            }
        });
        if(!isSuccess) return false;

        // ajax data 생성
        var insertFund = fundArray();
        var insertInfoOfFund = fundInfoArray();
        var data = {
            "insertFund" : insertFund,
            "insertInfoOfFund" : insertInfoOfFund,
        }

        $.ajax({
            type: "POST",
            url: "addFund",
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: function (data) {
                // 성공시 이동경로
                url = '/fund/checkFund';
                $(location).attr('href',url);
            },
            error: function (){
                alert("저장에 실패 하셨습니다.");
                return false;
            }
        });


    })

    function fundArray() {
        var jsonArray = new Array();
        var employeeCode = $('._select_employee_Code').val() || $('._select_employee_Code').attr('value');
        var potentialUserNo = $('#potentialUserNo').val();
        var totalAmount = $('#totalAmount').val();
        var note = $('#note').val();

        var json = {
            employeeCode : employeeCode,
            potentialUserNo : potentialUserNo,
            totalAmount : totalAmount,
            note : note
        }

        return json;
    }

    function fundInfoArray() {
        var jsonArray = new Array();

        $("._fund_info_box").each(function (index) {
            var fundJoinDate = $(this).find('._fundJoinDate').val();
            var fundState = $(this).find('._fundState').val();
            var achieveCheck = $(this).find('._achieveCheck').val();
            var fundTitle = $(this).find('._fundTitle').val();
            var accountOpenDate = $(this).find('._accountOpenDate').val();
            var fundPayTerm = $(this).find('._fundPayTerm').val();
            var fundPayDate = $(this).find('._fundPayDate').val();
            var fundAmount = $(this).find('._fundAmount').val();
            var totalAmount = $('#totalAmount').val();

            var json = new Object();
            json.fundJoinDate = fundJoinDate;
            json.fundState = fundState;
            json.achieveCheck = achieveCheck;
            json.fundTitle = fundTitle;
            json.accountOpenDate = accountOpenDate;
            json.fundPayTerm = fundPayTerm;
            json.fundPayDate = fundPayDate;
            json.fundAmount = fundAmount;
            json.totalAmount = totalAmount;

            jsonArray.push(json)
        });

        return jsonArray;
    }
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
    let employeeName = '';

    const startNum = employeeCode.indexOf('(');
    const lastNum = employeeCode.indexOf(')');

    if( startNum !== -1 && lastNum !== -1) {
        employeeName = employeeCode.substring(0, startNum).trim();
        employeeCode = employeeCode.substring(startNum + 1, lastNum).trim();
    } else {
       employeeName = '';
       employeeCode = '';
    }

    $('._employee_select_trans').val(employeeName);
    $('._select_employee_Code').val(employeeCode);

    // 부서 세팅
    setDepartment(employeeCode);

    // 직급 세팅
    setPosition(employeeCode);

    // 고객 세팅
    setPotentialUser(employeeCode);
});

/**
 * 담당자 변경 시 본부 세팅
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
    })
    request.fail(function() {
        alert("본부 셋팅에 실패 하셨습니다.");
        return false;
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
    })
    request.fail(function() {
        alert("직급 셋팅에 실패 하셨습니다.");
        return false;
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
    })
    request.fail(function() {
        alert("담당자의 고객 셋팅에 실패 하셨습니다.");
        return false;
    });
}