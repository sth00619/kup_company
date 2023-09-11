$(document).ready(function () {
    /* 왼쪽 드롭다운메뉴 이벤트 *//* 왼쪽 드롭다운메뉴 이벤트 *//* 왼쪽 드롭다운메뉴 이벤트 *//* 왼쪽 드롭다운메뉴 이벤트 */                 /* 왼쪽 드롭다운메뉴 이벤트 */
    $('.top_slide').click(function () {
        $(this).next().slideToggle('fast');
    });

    $('.top_slide_sub > li').click(function () {
        $(this).next().slideToggle('fast');
    });

    $('.top_slide_sub3').click(function () {
        $(this).next().slideToggle('fast');
    });

    $('.top_slide_sub6 > li').click(function () {
        $(this).next().slideToggle('fast');
    });

    $('.top_slide_sub7 > li').click(function () {
        $(this).next().slideToggle('fast');
    });

    $('.top_slide_sub9 > li').click(function () {
        $(this).next().slideToggle('fast');
    });
});

$(document).on('click', '.arrowOff h2', function () {
    if ($(this).parent().hasClass('arrowOff')) {
        $(this).toggleClass('arrowoff');
    }
});

$(document).on('click', '.arrowOff li', function () {
    if ($(this).parent().hasClass('arrowOff')) {
        $(this).toggleClass('arrowoff');
    }
});

$(document).on('click', '.arrowOn h2', function () {
    if ($(this).parent().hasClass('arrowOn')) {
        $(this).toggleClass('arrowon');
    }
});

$(document).on('click', '.arrowOn .sub_arrowOn', function () {
    if ($(this).parent().hasClass('arrowOn')) {
        $(this).toggleClass('arrowon');
    }
});