$(document).ready(function(){
    history.replaceState({},null,location.pathname);

    /*파일업로드시 확장자 제한*/
    $('#fileName').on('change',function(){
        if($(this).val() != ''){
            //확장자 분리
            var ext = $(this).val().split('.').pop().toLowerCase();
            if($.inArray(ext,['csv']) == -1){
                alert('파일 확장자 csv를 확인해 주세요. csv파일만 업로드 가능합니다.');
                $(this).val('');
                return;
            }
        }
    });

    /*파일 업로드 시 형식에 맞지 않을 경우 예외 발생하며 alert*/
    $(document).ready(function () {
        var errorMessage = $('#errorMessage').attr('value');
        if($('#isSuccess').val() == 'false') alert(errorMessage);
    });

})