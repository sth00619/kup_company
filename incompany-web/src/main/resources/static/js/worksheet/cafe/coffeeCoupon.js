$(document).ready(function(){

    $(function() {
        let query = window.location.search;
        let param = new URLSearchParams(query);
        let setValue;
        // 기본값 == -1 (전체 검색) , 0 == 사용 가능, 1 == 사용 완료
        if(param.get('isUsed') === null)
            setValue = "-1";
        else
            setValue = param.get('isUsed');
        $("#select_box").val(setValue);
    })

    $(document).on('click','._coffeeCouponList', function(){
        const barcode = $(this).attr('value');
        const url = "/coffeeBarcode/" + barcode;
        $(location).attr('href', url);
    });

    $(document).on('change','._select_box', function(){
         const is_used =  $(this).val();
         const url = "/worksheet/cafe/coffeeCoupon?isUsed=" + is_used;
         $(location).attr('href', url);
     })
});
