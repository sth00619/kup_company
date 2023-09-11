$(document).ready(function(){

    // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function(){
        $(this).attr('id',i);
        $(this).next().attr('for',i);
        i++;
    });
    // 양식 라디오 버튼 클릭 시 해당 양식 contents에 출력
    $(document).on('change','._writeForm',function(){
        var text = $(this).val()
        editor.setHTML(text);
    });

    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });
})