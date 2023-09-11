'use strict';

/*eslint-disable*/

var ScheduleList = [];

var SCHEDULE_CATEGORY = [
    'milestone',
    'task'
];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;

    this.title = null;
    this.body = null;
    this.location = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;
    this.isPrivate = false;
    this.goingDuration = 0;
    this.comingDuration = 0;
    this.recurrenceRule = '';
    this.state = '';
    this.counselingDetailNo = '';
    this.potentialUserNo = 0;

}

function generateSchedule(schedultItemList) {


    for (var i in schedultItemList) {


        var start = new Date(schedultItemList[i].start);
        start.setHours(start.getHours() - 9);

        var end = new Date(schedultItemList[i].end);
        end.setHours(end.getHours() - 9);

        var schedule = new ScheduleInfo();

        schedule.id = schedultItemList[i].id;
        schedule.body = schedultItemList[i].body;

        schedule.title = schedultItemList[i].title;
        schedule.calendarId = schedultItemList[i].calendarId;
        schedule.start = start;
        schedule.end = end;
        schedule.category = schedultItemList[i].category;
        schedule.location = schedultItemList[i].location;
        schedule.isAllday = schedultItemList[i].isAllday;
        schedule.isPrivate = schedultItemList[i].isPrivate;
        schedule.state = schedultItemList[i].stateName;
        schedule.isReadOnly = schedultItemList[i].isReadOnly;
        schedule.counselingDetailNo = schedultItemList[i].counselingDetailNo
        schedule.potentialUserNo = schedultItemList[i].potentialUserNo


        if (schedultItemList[i].calendarId == 0) {
            schedule.bgColor = "white";
            schedule.dragBgColor = "white";
            schedule.borderColor = "red";
        }

        ScheduleList.push(schedule);



    }



}



function generateScheduleList() {

    const employeeCode = document.getElementById('getEmployeeCode').value;
    ScheduleList = [];

    function scheduleList() {
        var result_data;
        $.ajax({
            url: "/schedule/getSchedule",
            type: "GET",
            data: {
                employeeCode: employeeCode
            },
            async: false,
            success: function (data) {

                result_data = data;

            }
        });
        return result_data;
    }

    var schedultItemList = scheduleList();


    generateSchedule(schedultItemList);



}