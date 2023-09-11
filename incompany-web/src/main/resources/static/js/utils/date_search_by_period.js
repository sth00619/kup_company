$(document).ready(function () {
    // 월간 조회 > 월 형식 변경 + 재 세팅 (yyyy-MM)
    setDateByType();

    // 기간 조회 타입 > 라디오 그룹 체크 유지
    checkedDateType();
});

// 기간 조회 타입 > 라디오 버튼 > change 이벤트
$('input[type=radio][name=dateType]').on('change', function () {
    const dateType = $(this).val();
    if(isEmpty(dateType)) return false;
    dateTypeChange(dateType);
});

// 기간 조회 타입 > 라디오 버튼 > 옆 글자 클릭 이벤트
$('._dateType').on('click',function() {
    const dateType = $(this).parent().find('input').val();
    if(isEmpty(dateType)) return false;
    dateTypeChange(dateType);
});

// 날짜 변경 > 이전 버튼, 다음 버튼
$('._prePage, ._nextPage').on('click', function(){
    const requestUrl = $('#requestUrl').val();
    if(isEmpty(requestUrl)) return;

    let url = requestUrl + '?';

    // dateType
    // 1 = 월간 조회
    // 2 = 주간 조회
    // 3 = 연간 조회
    let dateType = $('#dateType').val();
    if(!isEmpty(dateType)){
        url += 'dateType='+dateType;

        let requestDate = '';
        if(dateType === '1'){
            let month_date = $('#requestDate').val();
            if($(this).hasClass('_prePage')){
                month_date = getDt1(month_date);
                requestDate = getDt3(month_date);
            }else if($(this).hasClass('_nextPage')){
                month_date = getDt1(month_date);
                requestDate = getDt5(month_date);
            }
        }else if(dateType === '2'){
            const weekDay = 7;
            const week_date = $('._search_start_date').val();
            if($(this).hasClass('_prePage')){
                requestDate = getDt9(week_date, weekDay);
            }else if($(this).hasClass('_nextPage')){
                requestDate = getDt10(week_date, weekDay);
            }
        }else if(dateType === '3') {
            let year_date = $('#requestDate').val();
            year_date = getDt1(year_date);
            if($(this).hasClass('_prePage')){
                year_date = getDt1(year_date);
                requestDate = getDt11(year_date);
            }else if($(this).hasClass('_nextPage')){
                year_date = getDt1(year_date);
                requestDate = getDt13(year_date);
            }
        }

        if(!isEmpty(requestDate)){
            url += '&requestDate='+requestDate;
        }

        const departmentCode = $('#departmentCode').val();
        if(!isEmpty(departmentCode)){
            url += '&departmentCode='+departmentCode;
        } else {
            const getDepartmentCode = $('#getDepartmentCode').val();
            if(!isEmpty(getDepartmentCode)) url += '&departmentCode='+getDepartmentCode;
        }

        const employeeCode = $('#getEmployeeCode').val();
        if(!isEmpty(employeeCode)) url += '&employeeCode='+employeeCode;

        $(location).attr('href', url);
    }
});

// 기간 조회 타입 > 실행 함수
function dateTypeChange(dateType){
    const requestUrl = $('#requestUrl').val();
    if(isEmpty(requestUrl)) return;

    let departmentCode = $('#departmentCode').val();
    let url = '';

    if(!isEmpty(departmentCode)){
        url = 'departmentCode='+departmentCode+'&dateType='+dateType;
    } else {
        url = 'dateType='+dateType;

        const getDepartmentCode = $('#getDepartmentCode').val();
        if(!isEmpty(getDepartmentCode)) url += '&departmentCode='+getDepartmentCode;
    }

    url = requestUrl + '?' + url;
    $(location).attr('href', url);
}

// 기간 조회 타입 > 라디오 그룹 체크 유지
function checkedDateType(){
    const dateType = $('#dateType').val();
    var checkIndex = $('input[type=radio][name=dateType]').index(dateType);
    if(!isEmpty(dateType)){
        var checkedRadio = $('input[type=radio][name=dateType][value='+ dateType +']');
        if(checkedRadio.length) {
            checkedRadio.attr('checked','checked');

            checkIndex = $('input[type=radio][name=dateType]').index(checkedRadio);

            $('._check_box_date span').removeClass('onon');
            $('._check_box_date span').eq(checkIndex).addClass('onon');
            $('._check_box_date label').removeClass('onon2');
            $('._check_box_date label').eq(checkIndex).addClass('onon2');
        }
    }
}

// 월간 조회 > 월 형식 변경 및 재 세팅 (yyyy-MM)
function setDateByType() {
    let monthDate = $('._search_month_date').val();
    let yearDate = $('._search_year_date').val();
    if(!isEmpty(monthDate)){
        $('._search_month_date').val(monthDate.substring(0, 7));
        $('._search_month_date').prop('hidden', false);
    }else if(!isEmpty(yearDate)) {
        $('._search_year_date').val(yearDate.substring(0, 4));
        $('._search_year_date').prop('hidden', false);
    }
}

// 빈 값 체크
function isEmpty(val){
    if (typeof val === 'string' && val === '') return true;
    if(typeof val === 'undefined' || val === null) return true;
    return false;
}