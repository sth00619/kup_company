$(document).ready(function(){

    // 이벤트 범위에 따른 머리말 디폴트 세팅 및 수정 화면 페이지 로드 시 기존 데이터 디폴트 세팅
    setDefaultCategory();

    // 수정 화면 > 페이지 로드 시 > 적용 분야 디폴트 세팅
    setDefaultApplyField();

    // 수정 화면 > 페이지 로드 시 > 적용 조건 디폴트 세팅
    setDefaultApplyCondition();
});

// 적용 분야, 적용 조건은 각 값을 합쳐 10진수로 DB에 저장한다.
$(document).on('click','._submitBtn', function () {
    if ($("input:checkbox[name='fieldCheck']").is(":checked") == false) {
        alert("적어도 하나 이상의 분야를 선택하여 주십시오.");
        return false;
    }

    const decimalNum = getDecimalNum($("input:checkbox[name='fieldCheck']"));
    if(decimalNum > 0) $('#_applyField').val(decimalNum);
});

// 이벤트 범위 선택 > setCategoryOption() 호출
$(document).on('change', '._headType', function(){
    const headType = Number($(this).val());
    setCategoryOption(headType);
});

// 머리말 초기화 > 이벤트 범위에 따른 머리말 옵션 노출
function setCategoryOption(headType){
    $('._category').val('');

    const category = $('._category').children();
    category.each(function(index, item){
        const cateVal = Number($(this).val());
        const cateSign = headType === 1 ? cateVal < 2 : (cateVal < 1 || cateVal > 1);

        if(cateSign){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
}

// 체크 된 값는 합산하여 반환
function getDecimalNum(checkArr){
    let decimalNum = 0;
    checkArr.each(function(index, item){
        if($(this).is(":checked")){
            decimalNum += Number($(this).val());
        }
    });
    return decimalNum;
}

// 이벤트 범위에 따른 머리말 디폴트 세팅 및 수정 화면 페이지 로드 시 기존 데이터 디폴트 세팅
function setDefaultCategory(){
    // 페이지 로드 시 이벤트 범위에 따른 머리말 옵션 설정
    $('._headType').each(function(){
        if($(this).prop('checked')){
            let headType = Number($(this).val());
            setCategoryOption(headType);

            const cateVal = $('#_categoryVal').val();
            if(cateVal > 0) $('._category').val(cateVal);
            return;
        }
    });
}

// 수정 화면 페이지 로드 시 적용 분야 디폴트 세팅
function setDefaultApplyField(){
    const applyField = $('#_applyField').val();

    // checkbox 가 늘어날 수 록 조건 숫자를 2배수로 늘려야함
    // 1, 2, 4, 8, 16, 32, 64 ~~~
    const numArr = [1, 2, 4];   // 1 = 목돈 | 2 = 부동산 | 3 = 보험
    if(applyField < 1) return false;
    for(let i = 0; i < numArr.length; i++){
        const num = numArr[i];
        if((applyField & num) == num) {
            const applyCheckbox = $('._applyField').eq(i);
            applyCheckbox.attr('checked', 'checked');
            applyCheckbox.parent().find('._custom_label').addClass('_customCheck');
        }
    }
}

// 수정 화면 페이지 로드 시 적용 조건 디폴트 세팅
function setDefaultApplyCondition(){
    const applyCondition = $('#_applyCondition').val();
    if(applyCondition > 0) {
        // 신규
        if((applyCondition & 1) == 1) $('._applyCondition').eq(0).prop('checked', true);

        // 증액
        if((applyCondition & 2) == 2) $('._applyCondition').eq(1).prop('checked', true);
    }
}