$(document).ready(function () {

    $('.advice_click').click(function () {

        $(this).toggleClass('adclick');

        if ($(this).hasClass('adclick')) {
            $('.advice_wrap').css({
                display: 'block'
            }, 300);
        } else {
            $('.advice_wrap').css({
                display: 'none'
            }, 300);
        }
    });

    $('#next_btn_wrap>ul>li').click(function () {

        var on = $(this).index();

        $('#next_btn_wrap>ul>li').removeClass('on');
        $('#next_btn_wrap>ul>li').eq(on).addClass('on');
    });

    // TODAY 영역 날짜 설정
    $('#my_today_date').text(dateString());

    function dateString() {
        var now = new Date();
        var year = now.getFullYear(); // 연
        var month = ('0' + (now.getMonth() + 1)).slice(-2); // 월
        var date = ('0' + now.getDate()).slice(-2); // 일
        var day = now.getDay(); // 요일 - 0 ~ 6
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');

        var dateString = year + '-' + month + '-' + date + ' ' + week[day]; // 최종

        return dateString;
    }

    // 팝업 이벤트
    $('._deta').click(function () {

        $('.pop1').css({
            visibility: 'visible',
            opacity: '1'
        });

        $('.black_screen').css({
            visibility: 'visible',
            opacity: '.3'
        });
        // 그룹 추가
        $('.pop5').css({
            visibility: 'visible',
            opacity: '1'
        });

        $('.pop4').css({
            visibility: 'visible',
            opacity: '1'
        });

    });




    $('.close_btn_img').click(function () {
        $('.advice_save_visual').css({
            visibility: 'hidden',
            opacity: '0'

        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });
    });

    $('.cbt').click(function () {
        $('.advice_save_visual').css({
            visibility: 'hidden',
            opacity: '0'

        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });
    });


    $('.add').click(function () {

        $('.pop3').css({
            visibility: 'visible',
            opacity: '1'
        });

        $('.black_screen').css({
            visibility: 'visible',
            opacity: '.3'
        });

    });

    $('._notReady').click(function () {
      
        $('.pop4').css({
            visibility: 'visible',
            opacity: '1'
        });

        $('.black_screen').css({
            visibility: 'visible',
            opacity: '.3'
        });
        $('.my_pop1').removeClass('active');
        $('.my_pop1').removeClass('_active_pop');

        $('.my_pop2').removeClass('active2');
        $('.my_pop2').removeClass('_active_pop');
        
        $('.pop_wrap').show();
        $('._block').show();
        
        return false;

    });

    $('.pop4 span').click(function () {
        $('.pop4').css({
            visibility: 'hidden',
            opacity: '0'
        });

        $('.black_screen').css({
            visibility: 'hidden',
            opacity: '0'
        });
        $('.pop_wrap').hide();
        $('._block').hide();

    });

    $('.close').on('click', function () {
        $(this).toggleClass('close_on');

        if ($(this).hasClass('close_on')) {
            $(this).parents('.advice_txt_box').css({
                display: 'none'
            });
        }
    });

    $('.close').on('click', function () {
        $(this).toggleClass('close_on2');

        if ($(this).hasClass('close_on2')) {
            $(this).parents('.feed_box_txt').css({
                display: 'none'
            });
        } else {
            $(this).parents('.feed_box_txt').css({
                display: 'block'
            });
        }
    });


    $(document).on('click','#back', function(){
        window.history.back();
    });

    // top버튼 
    $(window).scroll(function(){

        if($(this).scrollTop() > 12){
            $('.scroll_btn').fadeIn(500);
        }else{
            $('.scroll_btn').fadeOut(500);
        }
    });

    $('.scroll_btn').on('click',function(){
        $('body,html').animate({
            scrollTop:0,
        },300);

        return false;   
    });


});