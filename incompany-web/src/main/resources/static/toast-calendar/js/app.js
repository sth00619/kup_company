'use strict';

/* eslint-disable */
/* eslint-env jquery */
/* global moment, tui, chance */
/* global findCalendar, CalendarList, ScheduleList, generateSchedule */

(function (window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = true;
    var useDetailPopup = true;
    var datePicker, selectedCalendar;



    const employeeCode = document.getElementById('getEmployeeCode').value;
    const employeeLoginCode = document.getElementById('employeeLoginCode').value;



    cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            milestone: function (model) {
                return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
            },
            allday: function (schedule) {
                return getTimeTemplate(schedule, true);
            },
            time: function (schedule) {
                return getTimeTemplate(schedule, false);
            }
        }
    });

    // event handlers
    cal.on({
        'clickMore': function (e) {
            // console.log('clickMore', e);
        },
        'clickSchedule': function (e) {
            // console.log('clickSchedule', e);

            var potentialUserNo = e.schedule.potentialUserNo;

            if (potentialUserNo != 0) {
                $.ajax({
                    url: "/potential/potentialUserInfoJson",
                    type: "GET",
                    data: {
                        potentialUserNo: potentialUserNo
                    },
                    success: function (data) {

                        if (data != null) {
                            $('.tui-full-calendar-section-detail').append("<p  style='margin-top: 5px;'> 고객정보 : " + data.combineNameAndMobileOfPotentialUser + " 생년월일 : " + data.birthday + "</p>")

                        }
                    },
                    error: function () {
                        alert("고객정보 가져오는데 실패하셨습니다");
                        return false;
                    }
                });



            }


        },
        'clickDayname': function (date) {
            // console.log('clickDayname', date);
        },
        'beforeCreateSchedule': function (e) {

            if (employeeCode == employeeLoginCode) {

                saveNewSchedule(e);

            } else {
                alert('본인만 추가가 가능합니다.');
                return false;
            }
        },
        'beforeUpdateSchedule': function (e) {

            // console.log('beforeUpdateSchedule', e);

            var beforePotentialUser = e.schedule.potentialUserNo;
            var potentialUserNo = $("#potentialUserListSel option:selected").val();
            var calendarName = $('#tui-full-calendar-schedule-calendar').text();
            if (e.calendar.editableEmployeeCode && (!e.calendar.editableEmployeeCode.includes(employeeLoginCode))) {

                alert('권한이 없습니다.');
                return false;
            }



            for (var i = 0; i < counselingDefaultCalendarList.length; i++) {

                if (counselingDefaultCalendarList[i] == calendarName) {
                    if (potentialUserNo == 0) {

                        var ans = confirm("고객이 선택되지 않았습니다. 고객없이 저장하겠습니까?")
                        if (!ans) {
                            return false;
                        }

                    }

                }

            }
            if (employeeCode == employeeLoginCode) {
                var schedule = e.schedule;
                var changes = e.changes;

                // console.log('beforeUpdateSchedule', e);

                if (changes && !changes.isAllDay && schedule.category === 'allday') {
                    changes.category = 'time';
                }

                cal.updateSchedule(schedule.id, schedule.calendarId, changes);

                var location = $('#tui-full-calendar-schedule-location').val();
                var body = $('#tui-full-calendar-schedule-body').val();

                schedule.body = body;
                schedule.location = location;

                updateScheduleData(changes, schedule, beforePotentialUser);

                refreshScheduleVisibility();

            } else {
                alert('수정할 수 없습니다');
                return false;
            }





        },
        'beforeDeleteSchedule': function (e) {
            var editableEmployeeCode;

            CalendarList.forEach(function (calendar) {

                if (calendar.id == e.schedule.calendarId) {

                    if ((calendar.companyCode || calendar.departmentCode) && calendar.editableEmployeeCode) {

                        editableEmployeeCode = calendar.editableEmployeeCode;

                    }

                }
            })

            if (editableEmployeeCode && (!editableEmployeeCode.includes(employeeLoginCode))) {

                alert('권한이 없습니다.');
                return false;
            }


            if (employeeCode == employeeLoginCode) {
                // console.log('beforeDeleteSchedule', e);
                cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
                deleteScheduleData(e.schedule.id);
            } else {
                alert("본인만 삭제할 수 있습니다.");
                return false;

            }
            koreaHoliday();

        },
        'afterRenderSchedule': function (e) {
            var schedule = e.schedule;
            var element = cal.getElement(schedule.id, schedule.calendarId);
            // console.log('afterRenderSchedule', element);
        },
        'clickTimezonesCollapseBtn': function (timezonesCollapsed) {
            // console.log('timezonesCollapsed', timezonesCollapsed);

            if (timezonesCollapsed) {
                cal.setTheme({
                    'week.daygridLeft.width': '77px',
                    'week.timegridLeft.width': '77px'
                });
            } else {
                cal.setTheme({
                    'week.daygridLeft.width': '60px',
                    'week.timegridLeft.width': '60px'
                });
            }

            return true;
        }
    });

    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            html.push(' ' + schedule.title);
        }

        return html.join('');
    }


    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
        koreaHoliday();

    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
        koreaHoliday();

    }

    function on(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
        koreaHoliday();

    }


    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var body = $('#new-schedule-body').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];


        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
            calendarId: calendar.id,
            title: title,
            body: body,
            isAllDay: isAllDay,
            location: location,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }

    function saveNewSchedule(scheduleData) {



        var body = document.getElementById('tui-full-calendar-schedule-body').value;
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        var potentialUserNo = $("#potentialUserListSel option:selected").val();
        var calendarName = $('#tui-full-calendar-schedule-calendar').text();

        for (var i = 0; i < counselingDefaultCalendarList.length; i++) {

            if (counselingDefaultCalendarList[i] == calendarName) {
                if (potentialUserNo == 0) {

                    var ans = confirm("고객이 선택되지 않았습니다. 고객없이 저장하겠습니까?")
                    if (!ans) {
                        return false;
                    }

                }

            }

        }



        if (scheduleData.calendarId == null) {
            alert('캘린더를 추가해주세요')
            return false;
        }

        if ((calendar.companyCode || calendar.departmentCode) && calendar.editableEmployeeCode) {
            if (!calendar.editableEmployeeCode.includes(employeeLoginCode)) {
                alert('권한이 없습니다.');
                return false;
            }

        }

        var localStart = moment(scheduleData.start._date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        var localEnd = moment(scheduleData.end._date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

        var localSchedule = {

            title: scheduleData.title,
            body: body,
            employeeCode: employeeLoginCode,
            isAllDay: scheduleData.isAllDay,
            start: localStart,
            end: localEnd,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            location: scheduleData.location,
            isPrivate: scheduleData.isPrivate,
            state: scheduleData.state,
            potentialUserNo: potentialUserNo,
            calendarName: calendarName

        };

        var schedule = {

            title: scheduleData.title,
            body: body,
            employeeCode: employeeLoginCode,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            location: scheduleData.location,
            isPrivate: scheduleData.isPrivate,
            state: scheduleData.state,
            potentialUserNo: potentialUserNo
        };

        if (calendar) {
            schedule.calendarId = calendar.id;
            localSchedule.calendarId = calendar.id;

        }

        $.ajax({
            url: "/schedule/addSchedule",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(localSchedule),
            success: function (data) {
                schedule.id = data.id;
                schedule.counselingDetailNo = data.counselingDetailNo;

                cal.createSchedules([schedule]);

                refreshScheduleVisibility();

                $("#today").load(window.location.href + " #today");


            },
            error: function () {
                alert("저장에 실패하셨습니다");
                return false;
            }
        });


    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function (input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function (calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function (input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function (calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function (input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });

        koreaHoliday();

    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;

    }

    function currentCalendarDate(format) {
        var currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

        return currentDate.format(format);
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();

        var html = [];
        if (viewName === 'day') {
            html.push(currentCalendarDate('YYYY.MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(currentCalendarDate('YYYY.MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }


        renderRange.innerHTML = html.join('');

    }



    function setSchedules() {

        cal.clear();
        generateScheduleList();
        cal.createSchedules(ScheduleList);


        refreshScheduleVisibility();
    }

    function updateScheduleData(changes, schedule, beforePotentialUser) {

        var potentialUserNo = $("#potentialUserListSel option:selected").val();
        var calendarName = $('#tui-full-calendar-schedule-calendar').text();
        var title = $('#tui-full-calendar-schedule-title').val();

        changes.potentialUserNo = potentialUserNo;
        changes.calendarName = calendarName;
        changes.title = title;
        changes.beforePotentialUser = beforePotentialUser;
        changes.id = schedule.id
        changes.body = schedule.body;
        changes.location = schedule.location;
        changes.start = schedule.start;
        changes.counselingDetailNo = schedule.counselingDetailNo;

        if (typeof changes.start != 'undefined' && changes.start != '' && changes.start != null) {
            var localStart = moment(changes.start._date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            changes.start = localStart;
        }
        if (typeof changes.end != 'undefined' && changes.end != '' && changes.end != null) {
            var localEnd = moment(changes.end._date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            changes.end = localEnd;

        }


        $.ajax({
            url: "/schedule/updateSchedule",
            type: "PUT",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(changes),
            success: function (data) {
                schedule.counselingDetailNo = data
                $("#today").load(window.location.href + " #today");
            },
            error: function () {

                alert('수정에 실패하셨습니다');
                return false;

            }
        });

    }


    function deleteScheduleData(id) {

        $.ajax({
            url: "/schedule/deleteSchedule",
            type: "DELETE",
            data: {
                "id": id
            },
            success: function () {
                $("#today").load(window.location.href + " #today");
            },
            error: function () {
                alert('삭제에 실패하셨습니다');
                return false;

            }

        });



    }



    function koreaHoliday() {


        $.ajax({
            url: '/schedule/koreaHoliday',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                var obj = Object(data);
                $('._holidayPicker').each(function (index, item) {

                    var key = $(this).attr('value').trim();
                    if (key) {
                        $(this).text(obj[key]);

                    }


                })
            },
            false: function () {
                console.log('holiday false');
            }
        })


    }


    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);


        window.addEventListener('resize', resizeThrottled);
    }


    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    resizeThrottled = tui.util.throttle(function () {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules();
    setEventListener();
    koreaHoliday();

})(window, tui.Calendar);

(function () {
    var calendarList = document.getElementById('calendarList');


    var html = [];

    CalendarList.forEach(function (calendar) {


        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );

    });
    calendarList.innerHTML = html.join('\n');
})();
(function () {

    var calenderEdit = document.getElementById('calenderEdit');
    var html = [];

    CalendarList.forEach(function (calendar) {

        if (calendar.isEditable) {

            var str = '';
            str += '<li class="_calendarList _noUpdateCalendar">'
            str += '<input class="_calendarId" value="'
            str += calendar.id
            str += '"hidden>'
            if (!calendar.departmentCode && !calendar.companyCode) {
                str += '<img class="_deleteCalendarBtn" src="/images/img/gray_icon1.png">'

            }
            str += '<img class="_updateCalendarBtn" src="/images/img/gray_icon2.png">'
            str += '<div class="amend_input">'
            str += '<span value="'
            str += calendar.name
            str += '"'
            str += 'class="_calendarName _name">'
            str += calendar.name
            str += '</span>'
            str += '</div>' + '<div class="color_red" style="background-color: '
            str += calendar.borderColor
            str += ';"></li>'

            html.push(str);
        }



    });
    calenderEdit.innerHTML = html.join('\n');
})();