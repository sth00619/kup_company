$(document).ready(function () {


    /* 프로젝트 > 참여인원 4명 이상일 경우 */
    $('.p_groupadd').each(function(){
        var peopleCount = $(this).children();
        if(peopleCount.length > 4){
            $(peopleCount).each(function (index) {
                $(this).eq(index).hide();
            })
            $(this).append('<div class="Excess"><img src="/images/img/plus.png"></div>');
        }
    });

});