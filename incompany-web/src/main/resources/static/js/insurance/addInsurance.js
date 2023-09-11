$(document).ready(function(){
    /*공백제거*/
    $(document).on('blur', '._insuranceTitle, ._insuranceCode, ._insurancePayTerm, ._insuranceAmount', function(){
        var trimStr = $(this).val().trim();
        $(this).val(trimStr);
    });

    /*문자사이 공백 및 특수문자 제거(/는 가능)*/
    $(document).on('blur', '._insurancePayTerm', function(){
        var checkStr = $(this).val();
        var regExp = /[ \{\}\[\]\?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
        if(regExp.test(checkStr) == true){
            alert(' /를 제외한 특수문자 또는 공백을 사용할 수 없습니다.');
            checkStr = checkStr.replace(regExp, "");
        }
        $(this).val(checkStr);
    });
    /*문자사이 공백 및 특수문자 제거(특수문자 사용 불가)*/
    $(document).on('blur', '._insuranceCode', function(){
        var checkStr = $(this).val();
        var regExp = /[ \{\}\[\]\/\?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
        if(regExp.test(checkStr) == true){
            alert('특수문자 또는 공백을 사용할 수 없습니다.');
            checkStr = checkStr.replace(regExp, "");
        }
        $(this).val(checkStr);
    });

    /*보험 구분에 따른 보험사 list 출력*/
    var insuranceCategory = $('._insuranceCategory').val();
    var insuranceCompanyName = $('._insuranceCompanyName').children();

    /* 히든 처리 되어있는 모든 보험사의 카테고리 번호들 중 보험구분 카테고리 번호와 일치하는 보험사는 히든 제거 */
    $.each(insuranceCompanyName, function(index, item){
        var insuranceJoinDate = $(this).find('._insuranceJoinDate').val();
        if($(this).data('category') == insuranceCategory){
            $(this).prop('hidden', false);
        }
    });

    /* 보험 구분 선택 시 */
    $('._insuranceCategory').on('change',function(){
        // 보험 구분의 카테고리 번호
        var insuranceCategories = $(this).val();

        // 보험사 전체
        var insuranceCompanyNames = $('._insuranceCompanyName').children();

        // 보험사 전체 중 보험구분 카테고리 번호와 일치하는 보험사 히든 제거 그 외 히든처리
        $.each(insuranceCompanyNames, function(index, item){
            if($(this).data('category') == insuranceCategories){
                $(this).prop('hidden', false);
            }else if(index != 0){
                $(this).prop('hidden', true);
            }
        });
    });

    /* 추가 한 보험 구분 선택 시 (위와 동일한 과정) */
    $(document).on('change', '._insuranceCategory', function(){
        var insuranceCategories = $(this).val();
        var insuranceCompanyNames = $(this).parents('ul').find('._insuranceCompanyName').children();
        $.each(insuranceCompanyNames, function(index, item){
            if($(this).data('category') == insuranceCategories){
                $(this).prop('hidden', false);
            }else if(index != 0){
                $(this).prop('hidden', true);
            }
        });
    });


    /*추가버튼 클릭 시 html 생성*/
    $('#addBox').on('click',function(){
        var innerHtml = '';
        innerHtml += '  <ul class="_insurance_info_box _nonInfoNo">';
        innerHtml += '      <li class="sub_first_txt _onlyCheckBox _li0">';
        innerHtml += '          <label class="_sub_label" for="checkbox"></label>';
        innerHtml += '          <input class="_sub_check" id="checkbox" type="checkbox">';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li1">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_insuranceJoinDate" name="insuranceJoinDate" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li2">';
        innerHtml += '          <select class="keep_select _insuranceState" name="insuranceState">';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li3">';
        innerHtml += '          <select class="Y_select _achieveCheck" name="achieveCheck">';
        innerHtml += '              <option value="Y">Y</option>';
        innerHtml += '              <option value="N">N</option>';
        innerHtml += '              <option value="H">50%</option>';
        innerHtml += '              <option value="F">25%</option>';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li4">';
        innerHtml += '          <select class="damage_select _insuranceCategory" name="insuranceCategoryCode">';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li5">';
        innerHtml += '          <select class="samsung_select _insuranceCompanyName" name="insuranceCompanyCode">';
        innerHtml += '          </select>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li6 w_amend">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_insuranceTitle" maxlength="100" name="insuranceTitle" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li7">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_insuranceCode" maxlength="35" name="insuranceCode" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li8">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_insurancePayDate" name="insurancePayDate" type="date">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li9">';
        innerHtml += '          <div class="insur_input">';
        innerHtml += '              <input class="_insurancePayTerm" maxlength="15" name="insurancePayTerm" placeholder="ex) 10년/99세" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="_li10">';
        innerHtml += '          <div class="insur_input _amount">';
        innerHtml += '              <input class="_insuranceAmount _numberOnly" maxlength="20" name="insuranceAmount" placeholder="숫자 입력" type="text">';
        innerHtml += '          </div>';
        innerHtml += '      </li>';
        innerHtml += '      <li class="sub_first_txt _li11 _custom_checkbox_li">';
        innerHtml += '          <label class="_custom_label" for="documentCheck1"></label>';
        innerHtml += '          <input class="_custom_check" name="documentCheck1" id="documentCheck1" type="checkbox">';
        innerHtml += '      </li>';
        innerHtml += '      <li class="sub_first_txt _li12 _custom_checkbox_li">';
        innerHtml += '          <label class="_custom_label" for="documentCheck2"></label>';
        innerHtml += '          <input class="_custom_check" name="documentCheck2" id="documentCheck2" type="checkbox">';
        innerHtml += '      </li>';
        innerHtml += '      <li class="sub_first_txt _li13 _custom_checkbox_li">';
        innerHtml += '          <label class="_custom_label" for="documentCheck3"></label>';
        innerHtml += '          <input class="_custom_check" name="documentCheck3" id="documentCheck3" type="checkbox">';
        innerHtml += '      </li>';
        innerHtml += '  </ul>';

        $('._insuranceInfo').prepend(innerHtml);

        // 추가 시 보험 구분 세팅
        var insuranceCategory = $('._insuranceCategory').eq(1).children();
        $.each(insuranceCategory, function(index, item){
            var insuranceCategoryClone = $(this).clone();
            $('._insuranceCategory').eq(0).append(insuranceCategoryClone);
        });

        // 추가 시 보험사 세팅
        var insuranceCompanyName = $('._insuranceCompanyName').eq(1).children();
        $.each(insuranceCompanyName, function(index, item){
            var insuranceCompanyClone = $(this).clone();
            $('._insuranceCompanyName').eq(0).append(insuranceCompanyClone);
        });

        // 추가 시 보험상태 구분 세팅
        var insuranceState = $('._insuranceState').eq(1).children();
        $.each(insuranceState, function(index, item){
            var insuranceStateClone = $(this).clone();
            $('._insuranceState').eq(0).append(insuranceStateClone);
        });

        //추가 시 포커스 이동
        $('._insuranceJoinDate').eq(0).focus();
    });

    /*금액 더해서 총금액 만들기*/
    $(document).on('blur','._insuranceAmount', function(){
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

        const _insuranceAmount = $('._insuranceAmount');
        $.each(_insuranceAmount, function(){
            if($(this).closest('._deleteInfoByAddForm').length) return true; //continue - 건너뛰기
            let amount = $(this).val();
            let type = $(this).closest('._insurance_info_box').find('._achieveCheck').val();

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
            $('._check').closest('._insurance_info_box').addClass('_deleteInfoByAddForm');
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

    /*insurance, insuranceInfo 값을 배열로 만들어 controller 전송*/
    $(document).on('click', '._submitBtn', function () {

        // 저장 버튼 클릭 시 공백 유효성 검사
        let isSuccess = true;

        if($("#potentialUserNo").val()== '') {
            alert("✔고객을 선택해 주세요.✔");
            isSuccess = false;
        };

        $("._insurance_info_box").each(function (index) {
            if($(this).closest('._deleteInfoByAddForm').length) return true;
            if(!isSuccess) return false;
            if ($(this).find('._insuranceJoinDate').val() == '') {
                alert("✔계약날짜를 입력해 주세요.✔");
                $(this).find('._insuranceJoinDate').focus();
                isSuccess =  false;
            }else if ($(this).find('._insuranceCompanyName').val() == null) {
                alert("✔보험사를 선택해 주세요.✔");
                isSuccess =  false;
            }else if ($(this).find('._insuranceTitle').val() == '') {
                alert("✔종목을 입력해 주세요.✔");
                $(this).find('._insuranceTitle').focus();
                isSuccess =  false;
            }else if ($(this).find('._insuranceCode').val() == '') {
                alert("✔증권번호를 입력해 주세요.✔");
                $(this).find('._insuranceCode').focus();
                isSuccess =  false;
            }else if ($(this).find('._insurancePayDate').val() == '') {
                alert("✔이체일을 입력해 주세요.✔");
                $(this).find('._insurancePayDate').focus();
                isSuccess =  false;
            }else if ($(this).find('._insurancePayTerm').val() == '') {
                alert("✔납입/만기기간을 입력해 주세요.✔");
                $(this).find('._insurancePayTerm').focus();
                isSuccess =  false;
            }else if ($(this).find('._insuranceAmount').val() == '') {
                alert("✔보험 금액을 입력해 주세요.✔");
                $(this).find('._insuranceAmount').focus();
                isSuccess =  false;
            }
        });
        if(!isSuccess) return false;


        // ajax data 생성
        var insertInsurance = insuranceArray();
        var insertInfoOfInsurance = insuranceInfoArray();
        var data = {
            "insertInsurance" : insertInsurance,
            "insertInfoOfInsurance" : insertInfoOfInsurance,
        }

        $.ajax({
            type: "POST",
            url: "addInsurance",
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: function (data) {
            }
        });

        //저장버튼 클릭 후 경로 이동
        url = '/insurance/checkInsurance';
        $(location).attr('href',url);
    })

    function insuranceArray() {
        var jsonArray = new Array();
        var employeeCode = $('._select_employee_Code').val() || $('._select_employee_Code').attr('value');
        var potentialUserNo = $('#potentialUserNo').val();
        var totalAmount = $('#totalAmount').val();
        var note = $('#note').val();

        var json = new Object();
        json.employeeCode = employeeCode;
        json.potentialUserNo = potentialUserNo;
        json.totalAmount = totalAmount;
        json.note = note;
        jsonArray.push(json);

        return jsonArray;
    }

    function insuranceInfoArray() {
        var jsonArray = new Array();

        $("._insurance_info_box").each(function (index) {
            var insuranceJoinDate = $(this).find('._insuranceJoinDate').val();
            var insuranceState = $(this).find('._insuranceState').val();
            var achieveCheck = $(this).find('._achieveCheck').val();
            var insuranceCategory = $(this).find('._insuranceCategory').val();
            var insuranceCompanyName = $(this).find('._insuranceCompanyName').val();
            var insuranceTitle = $(this).find('._insuranceTitle').val();
            var insuranceCode = $(this).find('._insuranceCode').val();
            var insurancePayDate = $(this).find('._insurancePayDate').val();
            var insurancePayTerm = $(this).find('._insurancePayTerm').val();
            var insuranceAmount = $(this).find('._insuranceAmount').val();

            // 서류 제출 여부
            const isDocument1 = $(this).find('#documentCheck1').prop('checked');
            const documentCheck1 = isDocument1 ? 'Y' : 'N';

            const isDocument2 = $(this).find('#documentCheck2').prop('checked');
            const documentCheck2 = isDocument2 ? 'Y' : 'N';

            const isDocument3 = $(this).find('#documentCheck3').prop('checked');
            const documentCheck3 = isDocument3 ? 'Y' : 'N';

            var json = new Object();
            json.insuranceJoinDate = insuranceJoinDate;
            json.insuranceState = insuranceState;
            json.achieveCheck = achieveCheck;
            json.insuranceCategory = insuranceCategory;
            json.insuranceCompanyName = insuranceCompanyName;
            json.insuranceTitle = insuranceTitle;
            json.insuranceCode = insuranceCode;
            json.insurancePayDate = insurancePayDate;
            json.insurancePayTerm = insurancePayTerm;
            json.insuranceAmount = insuranceAmount;
            json.documentCheck1 = documentCheck1;
            json.documentCheck2 = documentCheck2;
            json.documentCheck3 = documentCheck3;
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