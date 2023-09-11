$(document).ready(function(){

    /* select box 유지*/
    const category = $('#category').val();
    $('._selectBox').val(category).prop('selected', true);

    /* select box 변경 시 해당 카테고리 리스트 페이지로*/
    $(document).on('change','._selectBox', function(){

        const selectBox = $(this).val();
        const url = "/worksheet/signature/signatureSalesList?category=" + selectBox;
        $(location).attr('href', url);

    });


    /* ul 클릭 시 상세보기*/
    $(document).on('click','._signatureUl > li', function(){

        const signatureSalesNo = $(this).parent().attr('value');
        const url = "/worksheet/signature/signatureSalesInfo?signatureSalesNo=" + signatureSalesNo;
        $(location).attr('href', url);

    });

})