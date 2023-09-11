$(document).ready(function () {





    $('#popUp').click(function () {
        if ($('.pop6').css('display') == 'none') {
            $('.pop6').fadeIn('fats');

            $('._clearblock').css({
                visibility: 'visible',
                opacity: '.3'
            });


        } else {
            $('.pop6').fadeOut('fats');

        }

    });




    $(document).on('click', '._deleteCalendarBtn', function () {
        var calendarList = $(this).closest('._calendarList');
        $('._edit').remove();

        if ($(this).closest('._calendarList').children().hasClass('_editColorForm')) {
            $('._editColorForm').removeClass('_editColorForm');

        }

        if (calendarList.hasClass('_addCalendar')) {
            calendarList.remove();
        } else {
            calendarList.attr('class', '_deleteCalendar');
        }

    });


    $(document).on('click', '.cbt', function () {
        const employeeCode = document.getElementById('getEmployeeCode').value;

        $.ajax({
            type: "GET",
            url: "getScheduleItem",
            contentType: 'application/json',
            data: {
                employeeCode: employeeCode
            },

            success: function (data) {

                $('.pop6').fadeOut();
                $('#addCalendarName').val('');
                $('#addColor').css('background-color', '#b93b4f');
                $('#calenderEdit').empty();
                $('._add').remove();
                $('._addColor').eq(0).append('<span class="check_on _add"></span>');

                $.each(data, function (index, calendar) {

                    if (calendar.editable) {
                        var str = '<li class="_calendarList _noUpdateCalendar">'
                        str += '<input class="_calendarId" value="' + calendar.id
                        str += '"hidden>'

                        if (!calendar.departmentCode && !calendar.companyCode) {
                            str += '<img class="_deleteCalendarBtn" src="/images/img/gray_icon1.png">'

                        }
                        str += '<img class="_updateCalendarBtn" src="/images/img/gray_icon2.png">'

                        str += '<div class="amend_input">'
                        str += '<span value="' + calendar.name + '"'
                        str += 'class="_calendarName _name">' + calendar.name + '</span>'
                        str += '</div>' + '<div class="color_red" style="background-color: ' + calendar.bgColor + ';"></li>'


                        $('#calenderEdit').append(str);
                    }


                });

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("저장에 실패하셨습니다.");
            }
        });
        $('._clearblock').css({
            visibility: 'hidden',
            opacity: '0'
        });


    });
    $(document).on('click', '._updateCalendarBtn', function () {

        var calendarList = $(this).closest('._calendarList');
        var calendarColor = calendarList.find('.color_red');
        var calendarSpan = calendarList.find('.amend_input').find('._calendarName');
        var calendarName = calendarSpan.text();
        var calendarInput = $('._calendarNameForm').val();

        $('._edit').remove();
        if (calendarList.hasClass('_noUpdateCalendar')) {
            calendarList.removeClass('_noUpdateCalendar');
            calendarList.addClass('_updateCalendar');
        }

        $('._calendarNameForm').replaceWith('<span class="_calendarName _name" value ="' + calendarInput + '">' + calendarInput + '</span>');
        calendarSpan.replaceWith('<input maxlength="15" class="_calendarNameForm _name" value="' + calendarName + '">');


        if ($(this).closest('._calendarList').children().hasClass('_editColorForm')) {
            $('._editColorForm').removeClass('_editColorForm');

        } else {
            $('._editColorForm').removeClass('_editColorForm');
            calendarColor.addClass('_editColorForm');
            var calendarColorName = $('._editColorForm').css('background-color');
            var calendarColorCount = $('._editColor').length;

            for (var i = 0; i < calendarColorCount; i++) {
                if ($('._editColor').eq(i).css('background-color') == calendarColorName) {
                    $('._editColor').eq(i).append('<span class="check_on _edit"></span>');
                }

            }
        }




    });

    $(document).on('click', '._editColor', function () {
        var editCalendarlength = $('._editColorForm').length;

        if (editCalendarlength != 0) {
            var color = $(this).css('background-color');
            $('._editColorForm').css('background-color', color);
            $('._edit').remove();
            $(this).append('<span class="check_on _edit"></span>');
        }
        $('._block').hide();
        $('.popblock').show();
    });



    $(document).on('click', '._addColor', function () {
        var color = $(this).css('background-color');


        $('#addColor').css('background', color);
        $('._add').remove();
        $(this).append('<span class="check_on _add"></span>');


    });

    $(document).on('click', '#editCalendar', function () {

        var calendar = $('._calendarNameForm').val();

        $('._calendarNameForm').replaceWith('<span class="_calendarName _name">' + calendar + '</span>');

        var insertForm = insertArray();
        var updateForm = updateArray();
        var deleteForm = deleteArray();

        var data = {
            "add": insertForm,
            "update": updateForm,
            "delete": deleteForm
        }


        var isOverlap = false;

        for (var i = 0; i < defaultCalendarList.length; i++) {

            $("._calendarName").each(function (index) {
                if (defaultCalendarList[i] == $(this).text().trim()) {
                    isOverlap = true;
                    return false;
                }
            });

        }




        if (isOverlap) {
            alert(defaultCalendarList + "을(를) 제외하고 캘린더 이름을 정해주세요");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "editCalendar",
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: function () {
                location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("저장에 실패하셨습니다.");
                return false;
            }
        })

    });


    $(document).on('click', '#addCalendar', function () {
        var calendarCount = $('._calendarList').length;
        var name = $('#addCalendarName').val();
        var color = $('#addColor').css('background-color');

        if (calendarCount >= 7) {
            alert('더이상 추가하실수 없습니다')
            return false;
        } else {
            var str = '';
            str += '<li class="_calendarList _addCalendar">';
            str += '<img class="_deleteCalendarBtn" src="/images/img/gray_icon1.png">';
            str += '<img class="_updateCalendarBtn" src="/images/img/gray_icon2.png">';
            str += '<div class="amend_input">';
            str += '<span class="_calendarName _name" value="';
            str += name;
            str += '">'
            str += name;
            str += '</span></div>';
            str += '<div class="color_red"  style="background-color:'
            str += color
            str += ';"></div>';
            str += '</li>';
            $('#calenderEdit').append(str);


            $('#addCalendarName').val('');
        }

    });


});




function insertArray() {
    var jsonArray = new Array();


    $("._addCalendar").each(function (index) {
        var bgColor = $(this).find('.color_red').css('background-color');
        var bgColorHex = rgb2hex(bgColor);
        var name = $(this).find('._name').text();


        var json = new Object();
        json.bgColor = bgColorHex;
        json.name = name;
        jsonArray.push(json)

    });

    return jsonArray;


};

function updateArray() {
    var jsonArray = new Array();


    $("._updateCalendar").each(function (index) {
        var calendarId = $(this).find('._calendarId').val();
        var bgColor = $(this).find('.color_red').css('background-color');
        var bgColorHex = rgb2hex(bgColor);
        var name = $(this).find('._name').text();

        var json = new Object();

        json.calendarId = calendarId;
        json.bgColor = bgColorHex;
        json.name = name;

        jsonArray.push(json)


    });

    return jsonArray;


};


function deleteArray() {

    var jsonArray = new Array();


    $('._deleteCalendar').each(function (index) {
        var calendarId = $(this).find('._calendarId').val();

        var json = new Object();
        json.calendarId = calendarId;
        jsonArray.push(json)


    });


    return jsonArray;

};

// rgb to hex (background-color)
function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
        return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}