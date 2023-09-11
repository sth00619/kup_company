'use strict';

/* eslint-disable require-jsdoc, no-unused-vars */

var CalendarList = [];


function CalendarInfo() {
    this.id = null;
    this.name = null;
    this.checked = true;
    this.isEditable = true;
    this.color = null;
    this.bgColor = null;
    this.borderColor = null;
    this.dragBgColor = null;
    this.editableEmployeeCode = null;
    this.departmentCode = null;
    this.companyCode = null;
}

function addCalendar(calendar) {
    CalendarList.push(calendar);
}

function findCalendar(id) {
    var found;

    CalendarList.forEach(function (calendar) {

    
        if (calendar.id == id) {
            found = calendar;
        }
    });

    return found || CalendarList[0];
}

function hexToRGBA(hex) {
    var radix = 16;
    var r = parseInt(hex.slice(1, 3), radix),
        g = parseInt(hex.slice(3, 5), radix),
        b = parseInt(hex.slice(5, 7), radix),
        a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
    var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

    return rgba;
}

(function () {
    var calendar;


    var schedultItemList = scheduleItemList();

    for (var i in schedultItemList) {
        
        calendar = new CalendarInfo();
        calendar.id = schedultItemList[i].calendarId;
        calendar.name = schedultItemList[i].name;
        calendar.bgColor = schedultItemList[i].bgColor;
        calendar.dragBgColor = schedultItemList[i].bgColor;
        calendar.borderColor = schedultItemList[i].bgColor;
        calendar.isEditable = schedultItemList[i].editable;
        calendar.editableEmployeeCode = schedultItemList[i].employeeCode;
        calendar.departmentCode = schedultItemList[i].departmentCode;
        calendar.companyCode = schedultItemList[i].companyCode;
        addCalendar(calendar);


    }




})();


function scheduleItemList() {
    const employeeCode = document.getElementById('getEmployeeCode').value;

    var result_data;

    $.ajax({
        url: "/schedule/getScheduleItem",
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