$(document).ready(function(){

    $(document).on('click', '._chartBtn', function(){
        const selectBox = $('._selectBox').val()
        if(selectBox == ''){
            alert("시그니처 지점을 선택해 주세요.");
            $('.pop3').hide();
            $('.black_screen').hide();
            return false;
        }
    });
    /* 지점 이름 노출 */
    $('#signatureName').text($('#categoryMeaning').val());


    // x축 일자
    let accountDateArr = [];

    /* 총 매출 */
    let totalSalesArr = [];
    let cashSalesArr = [];
    let cardSalesArr = [];
    let deliverySalesArr = [];
    let accountTransferSalesArr = [];
    /* 총 지출 */
    let totalSpendArr = [];
    let cashSpendArr = [];
    let hallFoodSpendArr = [];
    let hallItemSpendArr = [];
    let kitchenFoodSpendArr = [];
    let kitchenItemSpendArr = [];

    let signatureSalesChart = $('#signatureSalesChart');
    /*let chart = new Chart(signatureSalesChart, {});*/

    /* 매출 현황 버튼 클릭 후 날짜 변경 시 ajax 요청 */
    $(document).on('change', '#chartDate', function(){

        // 이전 그래프 초기화
        resetCanvas();

        // 그래프 데이터 받아오기
        const chartData = $(this).val();
        const category = $('#category').val();
        const request = $.ajax({
                            url : "/worksheet/signature/signatureChart",
                            type : "POST",
                            data : {chartData : chartData,
                                    category : category},
                            dataType : "json"
                        })

        request.fail(function(){
            $('.pop3').hide();
            $('.black_screen').hide();
            alert('☢ Ajax ERROR ');
        });

        request.done(function(chartDataList) {

            /* 그래프에 노출시킬 데이터 생성 */
            createData(chartDataList);

            // 설정
            var data = {
                labels: accountDateArr,
                datasets :
                    [{
                        label : '총매출',
                        data : totalSalesArr,
                        backgroundColor :  'dodgerblue',
                        borderColor :  'dodgerblue'
                    },
                    {
                        label : '현금매출',
                        data : cashSalesArr,
                        backgroundColor :  'lightskyblue',
                        borderColor :  'lightskyblue',
                        hidden: true
                    },
                    {
                        label : '카드매출',
                        data : cardSalesArr,
                        backgroundColor :  'mediumturquoise',
                        borderColor :  'mediumturquoise',
                        hidden: true
                    },
                    {
                        label : '배달매출',
                        data : deliverySalesArr,
                        backgroundColor :  'lightslategray',
                        borderColor :  'lightslategray',
                        hidden: true
                    },
                    {
                        label : '계좌이체',
                        data : accountTransferSalesArr,
                        backgroundColor :  'yellowgreen',
                        borderColor :  'yellowgreen',
                        hidden: true
                    },


                    {
                        label : '총지출',
                        data : totalSpendArr,
                        backgroundColor :  'orangered',
                        borderColor :  'orangered'
                    },
                    {
                        label : '현금지출',
                        data : cashSpendArr,
                        backgroundColor :  'salmon',
                        borderColor :  'salmon',
                        hidden: true
                    },
                    {
                        label : '홀식재료',
                        data : hallFoodSpendArr,
                        backgroundColor :  'orangered',
                        borderColor :  'orangered',
                        hidden: true
                    },
                    {
                        label : '홀용품',
                        data : hallItemSpendArr,
                        backgroundColor :  'darkorange',
                        borderColor :  'darkorange',
                        hidden: true
                    },
                    {
                        label : '주방식재료',
                        data : kitchenFoodSpendArr,
                        backgroundColor :  'gold',
                        borderColor :  'gold',
                        hidden: true
                    },
                    {
                        label : '주방식재료',
                        data : kitchenItemSpendArr,
                        backgroundColor :  'darkgoldenrod',
                        borderColor :  'darkgoldenrod',
                        hidden: true
                    }
                    ]
            };

            // config
            var config = {
                type : 'line',
                data,
                options : {
                    legend: {
                        showCheckbox: false
                    },
                    scales : {
                        y: {
                            beginAtZero : true,
                            ticks: {
                                stepSize: 20000
                            }
                       }
                    }
                }
            };

            // 데이터 노출
            chart = new Chart(
                $('#signatureSalesChart'),
                config
            );

        });

    });

    /* 데이터 생성 */
    function createData (chartDataList) {

        for(var i=1; i < 32; i++) {
            accountDateArr.push(i);

            let totalSales = 0;
            let cashSales = 0;
            let cardSales = 0;
            let deliverySales = 0;
            let accountTransferSales = 0;


            let totalSpend = 0;
            let cashSpend = 0;
            let hallFoodSpend = 0;
            let hallItemSpend = 0;
            let kitchenFoodSpend = 0;
            let kitchenItemSpend = 0;

            $(chartDataList).each(function(){
                var subAccountDate = this.accountDate.substring(8,10);

                if (subAccountDate == i) {
                    totalSales = this.totalSales;
                    cashSales = this.cashSales;
                    cardSales = this.cardSales;
                    deliverySales = this.deliverySales;
                    accountTransferSales = this.accountTransferSales;

                    totalSpend = this.totalSpend;
                    cashSpend = this.cashSpend;
                    hallFoodSpend = this.hallFoodSpend;
                    hallItemSpend = this.hallItemSpend;
                    kitchenFoodSpend = this.kitchenFoodSpend;
                    kitchenItemSpend = this.kitchenItemSpend;
                }

            });

            totalSalesArr.push(totalSales);
            cashSalesArr.push(cashSales);
            cardSalesArr.push(cardSales);
            deliverySalesArr.push(deliverySales);
            accountTransferSalesArr.push(accountTransferSales);

            totalSpendArr.push(totalSpend);
            cashSpendArr.push(cashSpend);
            hallFoodSpendArr.push(hallFoodSpend);
            hallItemSpendArr.push(hallItemSpend);
            kitchenFoodSpendArr.push(kitchenFoodSpend);
            kitchenItemSpendArr.push(kitchenItemSpend);
        }
    }

    /* 차트 생성 */
    function resetCanvas  (){

        $('#signatureSalesChart').remove();
        $('._signatureSalesChart').append('<canvas id="signatureSalesChart"></canvas>');

        accountDateArr = [];
        totalSalesArr = [];
        cashSalesArr = [];
        cardSalesArr = [];
        deliverySalesArr = [];
        accountTransferSalesArr = [];

        totalSpendArr = [];
        cashSpendArr = [];
        hallFoodSpendArr = [];
        hallItemSpendArr = [];
        kitchenFoodSpendArr = [];
        kitchenItemSpendArr = [];

    }
})

