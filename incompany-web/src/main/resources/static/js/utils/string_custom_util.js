// 숫자만 입력되도록 설정 + 천 단위 콤마 추가
$(document).on("keyup",'._numberOnly', function() {
    let thisVal = $(this).val();
    thisVal = minusStr(thisVal);
    thisVal = thisVal.toLocaleString();
    $(this).val(thisVal);
});

// 빈 값 체크
function isEmpty(val){
    if (typeof val === 'string' && val === '') return true;
    if(typeof val === 'undefined' || val === null) return true;
    return false;
}

// 금액 천 단위 콤마 추가 -> 이거 말고 toLocaleString(); 사용하기
function addComma(value) {
    var regex = /[^0-9]/g;
    value = value.replace(regex, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value;
}

// 문자 제거 Only 숫자
function minusStr(value) {
    value = value.replace(/[^\d]+/g, "");
    value = Number(value);
    return value;
}

/**
 * API 요청 결과 체크
 * ※ 아래 방식은 올바른 방식이 아닙니다.
 * ※ 특정 문자열("NONE_AUTH" or "BAD_REQUEST" 등 http 상태 코드 참고)을 반환받거나 에러코드를 반환받아 비교할 수 있도록 해야합니다.
 * ※ 이 부분을 작업하시는 다음 분께 양도합니다.
 */
function successCheck(data, isReload){
    if(data === 0){
        alert('입력값이 올바르지 않습니다.\n'+'담당자에게 문의하세요.');
    } else if(data === 2){
        alert('오류가 발생하였습니다.\n'+'오류가 계속되면 담당자에세 문의하세요.');
    } else if(data === 3) {
        alert('권한이 없습니다.\n'+'담당자에세 문의하세요.');
    }

    if(data !== 1 || isReload) location.reload();
}

// 값 추출 (※ 어떤 방식을 우선 시 하냐에 따라 값이 다르게 추출이 될 수 있음)
// item.val()           우선 시 : 230,122,300 -> 230 을 반환
function getVal(item){
    return item.val() || item.attr('value');
}

// item.attr('value')   우선 시 : 230,122,300 -> 230,122,300 을 반환
function getAttrVal(item){
    return item.attr('value') || item.val();
}
