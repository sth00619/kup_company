$(document).ready(function () {

    const chartOfRequest = $('._chartOfRequest');
    chartOfRequest.each(function(){
        let percentNum = 0;
        const currentState = $(this).val();
        if(currentState == 0){
            $(this).parent().css({'width' : '25%'});
        }else if(currentState == 1){
            $(this).parent().css({'width' : '50%'});
        }else if(currentState == 2){
            $(this).parent().css({'width' : '75%'});
        }
        else if(currentState == 3){
            $(this).parent().css({'width' : '100%'});
        }

    });

})