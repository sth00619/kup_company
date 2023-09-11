$(document).ready(function () {

    if ($('#isPasswordChange').val() === "false") {

        $('.black_screen').css({
            opacity: .3,
            visibility: 'visible'
        });
        $('.password_visual').css({
            opacity: 1,
            visibility: 'visible'
        });
        $('.password_close').hide();
        $('.my_pop1').removeClass('active');
        $('.my_pop1').removeClass('_active_pop');

        $('.my_pop2').removeClass('active2');
        $('.my_pop2').removeClass('_active_pop');
    }




    $('.password_btn').on('click', function () {
        $('.black_screen').css({
            opacity: .3,
            visibility: 'visible'
        });
        $('.password_visual').css({
            opacity: 1,
            visibility: 'visible'
        });

        $('.my_pop1').removeClass('active');
        $('.my_pop1').removeClass('_active_pop');

        $('.my_pop2').removeClass('active2');
        $('.my_pop2').removeClass('_active_pop');



    });

    $(document).on('click', '.password_close', function () {

        $('.black_screen').css({
            opacity: 0,
            visibility: 'hidden'
        });
        $('.password_visual').css({
            opacity: 0,
            visibility: 'hidden'
        });
        $('._beforPassword').val('');
        $('._afterPassword').val('');
        $('._afterPasswordRe').val('');

    });

    $(document).on('click', '#passwordComp', function () {
        location.reload();
    });

    $(document).on('click', '.change', function () {


        var employeeCode = $('#updatePwEmployeeCode').val();
        var password = $('._afterPassword').val();
        var beforePassword = $('._beforPassword').val();

        var passwordRe = $('._afterPasswordRe').val();
        var data = {
            'employeeCode': employeeCode,
            'beforePassword': beforePassword,
            'password': passwordRe
        }

        var regExp = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,16}$/;


        if (passwordRe.match(regExp) == null) {
            alert('영문 대소문자 / 숫자 / 특수문자 / 중 2가지 이상 조합, 10자 ~ 16자를 사용해 비밀번호를 변경해주세요');
            return false;
        } else {
            if (password != passwordRe) {
                alert('새 비밀번호가 일치하지 않습니다');
                return false;
            } else {
                $.ajax({
                    type: "PUT",
                    url: "/account/register",
                    data: data,
                    success: function (result) {

                        if (result) {
                            $('.black_screen').css({
                                opacity: .3,
                                visibility: 'visible'
                            });
                            $('.pop_wrap').css({
                                opacity: 1,
                                visibility: 'visible'
                            });
                            $('.password_visual').css({
                                opacity: 0,
                                visibility: 'hidden'
                            });
                            $('.pop4').css({
                                opacity: 1,
                                visibility: 'visible'
                            })
                        } else {
                            alert('현재 비밀번호가 일치하지 않습니다');
                            return false;
                        }


                    }

                }).fail(function () {
                    alert("비밀번호 변경에 실패하셨습니다");
                    return false;
                });

            }
        }


    });

});