$(document).ready(function(){
    // 실적 인정 금액 및 총 금액 세팅
    minusAmount();

    /*공백제거*/
    $(document).on('blur', '._fundTitle, ._fundCode, ._fundPayTerm, ._fundAmount', function(){
        var trimStr = $(this).val().trim()
        $(this).val(trimStr);
    });

    /*추가버튼 클릭 시 html 생성*/
        $('#addBox').on('click',function(){
            var innerHtml = '';
            innerHtml += '  <ul class="_fund_info_box _nonInfoNo">';
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

    // 콤마추가
    function addComma(value){
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    }

    // 콤마제거
    function removeComma(value){
        const regExp = /[ \{\}\[\]\?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
        value = value.replaceAll(regExp, "");
        return value;
    }

    //체크박스 체크 후 삭제 버튼 클릭 시 삭제
    $(document).on('click','#deleteBox', function(){
        //삭제
        const totalSub = $('._sub_check').length;
        const checkedSub = $('._sub_check:checked').length;

        if(totalSub === checkedSub){
            alert('한개 이상은 입력해주세요.');
        } else{
            $('._check').closest('._InfoByUpdateForm').addClass('_deleteInfoByUpdateForm');
            $('._check').closest('._deleteInfoByUpdateForm').hide();
            $('._check').closest('._nonInfoNo').remove();
            minusAmount();
        }
    });

    /*json 데이터를 ajax 이용해 controller 전송*/
    $(document).on('click', '._submitBtn', function () {

        // 저장 버튼 클릭 시 공백 유효성 검사
        let isSuccess = true;
        $("._fund_info_box").each(function (index) {
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

        // 저장 버튼 클릭 후 경로 이동
        var fundManageNo = $('#fundManageNo').val();

        // ajax data 생성
        var updateFund = updateFundArray();
        var updateInfoOfFund = updateInfoOfFundArray();
        var insertInfoOfFund = insertInfoOfFundArray();
        var deleteInfoOfFund = deleteInfoOfFundArray();
        var data = {
            "insertInfoOfFund" : insertInfoOfFund,
            "updateFund" : updateFund,
            "updateInfoOfFund" : updateInfoOfFund,
            "deleteInfoOfFund" : deleteInfoOfFund,
        }

        $.ajax({
            type: "POST",
            url: "updateFund",
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: function (data) {
                url = '/fund/fundInfo?fundManageNo='+fundManageNo;
                $(location).attr('href',url);
            },
            error: function (){
                alert('저장에 실패하였습니다. 담당자에게 문의하세요.');
                return false;
            }
        });
    })

    // delete - fundInfo
    function deleteInfoOfFundArray() {
        var jsonArray = new Array();
        $("._deleteInfoByUpdateForm").each(function (index) {
            var fundInfoNo = $(this).find('._fundInfoNo').val();
            var json = new Object();
            json.fundInfoNo = fundInfoNo;
            jsonArray.push(json);
        });
        return jsonArray;
    }

    //update - fund
    function updateFundArray() {
        var jsonArray = new Array();

        var fundManageNo = $('#fundManageNo').val();
        var loginEmployeeCode = $('#loginEmployeeCode').val();
        var totalAmount = $('#totalAmount').val();
        var note = $('#note').val();

        var json = new Object();
        json.fundManageNo = fundManageNo;
        json.loginEmployeeCode = loginEmployeeCode;
        json.totalAmount = totalAmount;
        json.note = note;
        jsonArray.push(json);

        return jsonArray;
    }
    // update - fundInfo
    function updateInfoOfFundArray() {
        var jsonArray = new Array();

        $("._InfoByUpdateForm").each(function (index) {
            var fundInfoNo = $(this).find('._fundInfoNo').val();
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
            json.fundInfoNo = fundInfoNo;
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

    // insert - fundInfo
    function insertInfoOfFundArray() {
        var jsonArray = new Array();
        $("._nonInfoNo").each(function (index) {
            var fundManageNo = $('#fundManageNo').val();
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
            json.fundManageNo = fundManageNo;
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

})