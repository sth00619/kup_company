$(document).ready(function(){

    /* 취소 버튼 */
    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });
})