var qrcode = new QRCode(document.getElementById("qrcode"));


$(document).ready(function(){
    $('#qrcode').hide();

    $('#qrcodeText').on("change", function () {
        makeCode();
        $('#qrcode').show();
    });

})


function makeCode () {
    var qrcodeText = $('#qrcodeText').val();
    if (!qrcodeText) {
        alert("링크를 입력해 주세요.");
        qrcodeText.focus(); return;
    }
    qrcode.makeCode(qrcodeText);
}