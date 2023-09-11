$(document).ready(function(){

    $(document).on('click','._selfImprovementCostList', function(){
        const selfImprovementCostNo = $(this).attr('value');
        const url = "/worksheet/selfImprovementCost/selfImprovementCostInfo?selfImprovementCostNo=" + selfImprovementCostNo;
        $(location).attr('href', url);
    });


});
