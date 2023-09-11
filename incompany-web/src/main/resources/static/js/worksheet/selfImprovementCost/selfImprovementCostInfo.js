$(document).ready(function () {

    var selfImprovementCostNo = $('#selfImprovementCostNo').val();


    //삭제버튼 처리
    $(document).on('click', '._delete_payment', function () {
        var result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            var form = $('#selfImprovementCostInfo').attr("action", "/worksheet/selfImprovementCost/deleteSelfImprovementCost?selfImprovementCostNo=" + selfImprovementCostNo);
            form.submit();
        } else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click', '._update_payment', function () {
        var url = "/worksheet/selfImprovementCost/updateSelfImprovementCost?selfImprovementCostNo=" + selfImprovementCostNo;
        $(location).attr('href', url)
    });

    // 결재자 > 전체목록 버튼 클릭
    $(document).on('click', '._payment_list_button', function(){
        $(location).attr('href', '/worksheet/selfImprovementCost/payment/selfImprovementCostList');
    });

    // 참조자, 본인 > 전체목록 버튼 클릭
    $(document).on('click', '._my_list_button', function(){
        $(location).attr('href', '/worksheet/selfImprovementCost/selfImprovementCostList');
    });

})