$(document).ready(function(){

    /* 수정 버튼 경로 설정 */
    $('#_updateButton').on('click', function(){
        location.href=$(this).val();
    });

});