$(document).ready(function () {
    // 리스트 전체 선택
    var full = 0;
    $(document).on('click','._main_first_txt',function(e){
        // 이벤트 중복 방지
        e.preventDefault();

        $(this).toggleClass('check');
        // 클릭 시 전체 박스 선택 및 해제
        if($(this).hasClass('check')){
            $('._main_first_txt > label').removeClass('_unCheck');
            $('._main_first_txt > label').addClass('_check');
        }else{
            $('._main_first_txt > label').addClass('_unCheck');
            $('._main_first_txt > label').removeClass('_check');
        }

        $('._sub_check').parent('li').toggleClass('check');

        if(full == 0){
            $('._sub_ul').each(function(){
                const isNotAuth = $(this).find('._sub_first_txt').hasClass('_NOT_AUTH');
                if(isNotAuth){
                    return true;
                }else {
                    $(this).find('._sub_check').attr('checked',true);
                    $(this).find('._sub_first_txt > label').addClass('_check');
                    $(this).find('._sub_first_txt > label').removeClass('_unCheck');
                    $(this).find('._onlyCheckBox > label').addClass('_check');
                    $(this).find('._onlyCheckBox > label').removeClass('_unCheck');
                }
            });
            full++;
        }else if(full == 1){
            $('._sub_check').attr('checked',false);
            $('._sub_first_txt > label').addClass('_unCheck');
            $('._sub_first_txt > label').removeClass('_check');
            $('._onlyCheckBox > label').addClass('_unCheck');
            $('._onlyCheckBox > label').removeClass('_check');
            full --;
        }
    });

    // 리스트 개별 선택 - 해당 check box 클릭시
    $(document).on('click','._onlyCheckBox',function(e){
        // 이벤트 중복 방지
        e.preventDefault();

        // 개별 체크 및 디자인 적용
        var checkBox = $(this).parent().find('._sub_check');
        var checkLabel = $(this).parent().find('._sub_label');

        if(checkBox.attr('checked') == 'checked'){
            checkBox.attr('checked',false);
            checkLabel.addClass('_unCheck');
            checkLabel.removeClass('_check');
        }else {
            checkBox.attr('checked',true);
            checkLabel.addClass('_check');
            checkLabel.removeClass('_unCheck');
        }

        //리스트 개별 선택 - 전체 선택 및 전체 해제
        var totalSub = $('._sub_check').length;
        var checkedSub = $('._sub_check:checked').length;

        if(totalSub != checkedSub) {
            $('._main_first_txt > label').removeClass('_check');
            $('._main_first_txt > label').addClass('_unCheck');
        }
        else {
            $('._main_first_txt > label').addClass('_check');
            $('._main_first_txt > label').removeClass('_unCheck');
        }
    });

})