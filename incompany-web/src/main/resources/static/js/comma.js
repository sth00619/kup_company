$(document).ready(function(){

    /*  출력 페이지에
        콤마 추가
     */
    $.each($('._amount'),function(){
        var amount = $(this).text();
        if (amount != '' && amount != 0 && amount != null) {
            var str = comma(amount) + ' 원';
            $(this).text(str)
        }
    })


})

/*  입력 html 일 경우
    input 테그에
    onkeyup="inputNumberFormat(this)" 추가해주기
*/
function inputNumberFormat(obj) {
     obj.value = comma(unComma(obj.value));
 }

 function comma(str) {
     str = String(str);
     return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
 }

 function unComma(str) {
     str = String(str);
     return str.replace(/[^\d]+/g, '');
 }
