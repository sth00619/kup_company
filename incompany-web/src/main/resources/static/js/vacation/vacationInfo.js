
// 첨부파일 클릭
$(document).on('click', '.file_click', function(){
    $('.file_viewbox').toggleClass('file_on');
});

// 파일 다운로드
$(document).on('click', '#downFile', function () {
    const cloudUrl = $('#cloudUrl').val();
    const fileName = $(this).text();
    const downloadFile = cloudUrl+fileName;
    location.href=downloadFile;
});

// 수정 버튼
$(document).on('click', '._update_payment', function() {
    let url = '/vacation/updateVacation';
    url += '?vacationRecordNo=' + $('#no').val();
    $(location).attr('href', url);
});

// 삭제 버튼
$(document).on('click', '._delete_payment', function() {

    if(!confirm('정말 삭제 하시겠습니까?')) return false;

    const request = $.ajax({
        url: '/vacation/deleteVacation',
        type: "DELETE",
        data: {vacationRecordNo : $('#no').val()},
        dataType: "json"
    });

    request.done(function(data){
        if(data) {
            alert('삭제 되었습니다.')
            $(location).attr('href', '/vacation/myVacationList');
        }
    });
});

// 결재자 > 전체목록 버튼 클릭
$(document).on('click', '._payment_list_button', function(){
    const referrer = document.referrer;
    if(referrer.includes('paymentVacationList') || referrer.includes('myVacationList')) {
        window.history.back();
    } else {
        $(location).attr('href', '/vacation/paymentVacationList');
    }
});

// 참조자, 본인 > 전체목록 버튼 클릭
$(document).on('click', '._my_list_button', function(){
    const referrer = document.referrer;
    if(referrer.includes('paymentVacationList') || referrer.includes('myVacationList')) {
        window.history.back();
    } else {
        $(location).attr('href', '/vacation/myVacationList');
    }
});