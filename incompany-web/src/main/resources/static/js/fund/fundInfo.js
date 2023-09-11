$(document).ready(function(){

    const fundManageNo = $('#fundManageNo').val();

    setAchieveCheckText();

    // 실적 인정 금액 및 총 금액 세팅
    minusAmount();


    // 취소 버튼 이전 경로 이동
    $('._close_btn').on('click', function(){
        var preUrl = document.referrer;
        if(preUrl.match('addFund') || preUrl.match('updateFund')){
            preUrl = "/fund/fund";
        }
        $(location).attr('href',preUrl);
    });


    // 삭제버튼 처리
    $(document).on('click', '._deleteBtn', function(){
        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result) {
            var url = "/fund/deleteFundInfo?fundManageNo="+fundManageNo
            $(location).attr('href',url);
        }else {
            return false;
        }
    });

    // 구분 TEXT 세팅
    function setAchieveCheckText(){
        $('._achieveCheck').each(function(){
            const ACValue = $(this).attr('value') || $(this).val();

            let ACText;
            switch(ACValue){
                case 'H' :
                    ACText = '50%';
                    break;
                case 'F' :
                    ACText = '25%';
                    break;
                default :
                    ACText = ACValue;
                    break;
            }

            $(this).text(ACText);
        });
    }

    // 실적 인정 금액 및 총 금액 세팅
    function minusAmount(){
        let sumAmount = 0;
        let sumPerformance = 0;

        const _fundAmount = $('._fundAmount');
        $.each(_fundAmount, function(){
            let amount = $(this).text();
            let type = $(this).closest('._fund_info_box').find('._achieveCheck').attr('value');

            amount = minusStr(amount);

            // 총 금액 합산
            sumAmount += amount;

            // 실적 계산 후 합산
            amount = type === 'H' ? Math.floor(amount / 2) : amount;
            amount = type === 'F' ? Math.floor(amount / 4) : amount;
            amount = type === 'N' ? 0 : amount;

            sumPerformance += amount;
        });

        // 총 금액
        sumAmount = sumAmount.toLocaleString();
        $('._totalAmount').text(sumAmount);
        $('#_totalAmount').text(sumAmount);

        // 실적
        sumPerformance = sumPerformance.toLocaleString();
        $('#_totalPerformance').text(sumPerformance);
    }
});
