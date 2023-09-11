$(document).ready(function () {
    // 부서 선택 > 라디오 그룹 체크 유지
    checkedCategory();
});

// 이벤트 삭제
$('._deleteEvent').on('click', function(){
    const title = $(this).parent().find('._title').attr('value');
    const message = '제목 : [ '+title+' ] 이벤트가 삭제 됩니다.\n정말 삭세 하시겠습니까?';

    if(!confirm(message)) return false;

    const eventCode = Number($(this).parent().find('._eventCode').text());
    $(location).attr('href', '/event/deleteEvent?eventCode='+eventCode);
});

// 부서 선택 > 라디오 버튼 > change 이벤트
$('input[type=radio][name=category]').on('change', function () {
    const category = Number($(this).val());
    if(category > 0) changeCategory(category);
});

// 부서 선택 > 라디오 버튼 > 옆 글자 클릭 이벤트
$('._check_category').on('click',function() {
    const category = $(this).parent().find('input').val();
    if(category > 0) changeCategory(category);
});

let urlArray = [{urlKey: 'orderBy', urlVal: $('#orderBy').val()}
        , {urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}];

// url parameter 세팅
function settingUrl(urlArray) {
    let url = '';

    const startDate = $('._search_start_date').val();
    const endDate   = $('._search_end_date').val();

    // url parameter 추가
    urlArray.push({ urlKey : 'startDate', urlVal : startDate }
                , { urlKey : 'endDate', urlVal : endDate });

    // parameter 객체 중복 제거
    urlArray = [...new Set(urlArray.map(JSON.stringify))].map(JSON.parse);

    // 값이 있는 parameter 만 url 에 세팅
    $.each(urlArray, function (index, item) {
        if (typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null) {
            url += "&" + item.urlKey + "=" + item.urlVal;
        }
    });

    const pathName = $(location).attr('pathname');

    url = pathName + '?' + url.substring(1);

    return url;
}

// 부서 선택 > 라디오 그룹 체크 유지
function checkedCategory(){
    const radioCategory = $('#_category').val();
    var checkIndex = $('input[type=radio][name=category]').index(radioCategory);
    if(Number(radioCategory) > 0){
        const checkedRadio = $('input[type=radio][name=category][value='+ radioCategory +']');

        checkedRadio.attr('checked','checked');

        checkIndex = $('input[type=radio][name=category]').index(checkedRadio);

        $('._check_box_category span').removeClass('onon');
        $('._check_box_category span').eq(checkIndex).addClass('onon');
        $('._check_box_category label').removeClass('onon2');
        $('._check_box_category label').eq(checkIndex).addClass('onon2');
    }
}

// 부서 선택 > 실행 함수
function changeCategory(category){

    urlArray.push({ urlKey : 'category', urlVal : category });

    const url = settingUrl(urlArray);

    $(location).attr('href', url);
}