$(document).ready(function(){

    /* ul 클릭 시 상세보기 페이지 이동동 */    $(document).on('click','._groupwareRequestList', function(){
        const groupwareRequestNo = $(this).attr('value');
        const url = "/groupware/requestInfo?groupwareRequestNo=" + groupwareRequestNo;
        $(location).attr('href', url);
    });
})