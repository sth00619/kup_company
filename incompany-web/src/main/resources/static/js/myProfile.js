$(document).ready(function () {
    // 프로필 영역 이이지 클릭
    $('.my_today_img').on('click', function () {
        if (!$('.my_pop2').hasClass('active2')) $('.my_pop2').addClass('active2');
    });

    // 팝업 밖 다른 영역 클릭 시 팝업 닫힘
    $(document).on('click', function (e) {
        // 첫 번째 오픈인지 확인할 수 있는 새로운 '_active_pop' 클래스 활성화 (프로필 버튼은 영역 밖이라 누르자마자 꺼지는 경우가 있음)
        if (!$('.my_pop1').has(e.target).length && $('.my_pop1').hasClass('active')) $('.my_pop1').toggleClass('_active_pop');
        if (!$('.my_pop2').has(e.target).length && $('.my_pop2').hasClass('active2')) $('.my_pop2').toggleClass('_active_pop');

        // 위의 _active_pop 이 있으면 팝업이 띄워져 있다는 의미이므로 팝업 닫기
        if (!$('.my_pop1').hasClass('_active_pop') && $('.my_pop1').hasClass('active')) $('.my_pop1').removeClass('active');
        if (!$('.my_pop2').hasClass('_active_pop') && $('.my_pop2').hasClass('active2')) $('.my_pop2').removeClass('active2');
    });

    // 로그아웃 버튼 구현
    $('.logout').on('click', function () {
        $(location).attr('href', '/logout');
    });


    $(document).on('change', '#upload_img', function () {


        var form = $('#imgUploadForm')[0]; // FormData 객체 생성    
        var formData = new FormData(form);

        $.ajax({
            type: "POST",
            url: '/companyChart/imageUrl',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            data: formData,
            success: function () {

                location.reload();


            }

        }).fail(function () {
            alert("이미지 변경에 실패하셨습니다.");
            return false;
        });


    });
});

function onClickUpload() {
    let myInput = document.getElementById("upload_img");
    myInput.click();
}