$(document).ready(function(){
    // 기간 선택 변경 금지
    $('._search_start_date').prop('readonly', true);
    $('._search_end_date').prop('readonly', true);

    // 검색바 숨기기
    $('._searchArea').prop('hidden', true);
    $('._right_menu').prop('hidden', false);

    const _has_pre_request = $('#_has_pre_request').val();
    if(_has_pre_request == 'true'){
        $('#_side_operation').prop('hidden', false);
    }else {
        $('#_side_contract').prop('hidden', false);
    }
});