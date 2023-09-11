$(document).ready(function () {

    const notExistAlert = "는 없는 코드입니다.";



    $(document).on('click', '._searchEmployee', function () {


        $(this).next().toggleClass('saved_on');


    });

    $(document).on('keyup', '._searchEmployee', function () {

        var searchEmployee = $(this).val();
        var searchUrl;
        let searchEmployeeList = $(this).next().children().first();


        let savedList = $(this).next();
        var checkNumber = /^(?=.*?[0-9])/;
        if (!checkNumber.test(searchEmployee)) {
            searchUrl = "searchEmployeeByName";
        } else {
            searchUrl = "searchEmployeeByCode";

        }


        $.ajax({
            type: "GET",
            url: "/companyChart/" + searchUrl,
            data: {
                "searchEmployee": searchEmployee
            },
            success: function (data) {

                searchEmployeeList.remove();

                var str = '';
                $.each(data, function (index, item) {
                    str += '<li class="_clickApproverEmployee">';

                    str += '<div class="saved_icon">';
                    if (item.imageUrl) {

                        str += '<img src ="'
                        str += item.imageUrl
                        str += '" class="_employeeImg">'
                    } else {

                        str += '<img src="/images/img/quick_my.png" class="_employeeImg">';

                    }
                    str += '</div>';

                    str += '<div class="saved_namebox">';
                    str += '<div class="saved_name">';
                    str += item.employeeName;
                    str += '</div>';
                    str += '<div class="saved_number">';
                    str += item.employeeCode;
                    str += '</div>';
                    str += '</div>';
                    str += '</li>';
                });
                savedList.prepend(str);
            }

        }).fail(function () {
            alert("사원찾기에 실패하셨습니다");
            return false;
        });


    });


    $(document).on('click', '._clickApproverEmployee', function () {



        $('._ref').removeClass('saved_on');
        $('._appr').toggleClass('saved_on');

        var selectEmployeeCode = $(this).find('.saved_number').text();
        var selectEmployeeName = $(this).find('.saved_name').text();


        var searchResult = true;




        $(this).closest('._selectEmployee').next().find('._selectApprover').each(function () {

            if ($(this).text() == selectEmployeeCode) {
                alert("수정 사원에 이미 추가된 사원입니다!");
                searchResult = false;
                return false;
            }

        });

        if (searchResult) {
            var str = '';

            str += ' <div class="_selectApprDiv">';
            str += '<div style="float : left ;">'
            str += ' <img src="/images/img/delete.png" class="_delEmployeeBtn" style="cursor: pointer">';

            str += '</div>'
            str += '<div class="_selectEmployeeTypeList" >'
            str += '<p class="_selectApprover">';
            str += selectEmployeeCode
            str += '</p>'
            str += '</div>'
            str += ' <br>';
            str += ' </div>';



            $(this).closest('._selectEmployee').next().prepend(str);
        }

    });



    // 결재자 삭제
    $(document).on('click', '._delEmployeeBtn', function () {


        $(this).closest('._selectApprDiv').remove();

        $('._selectApprDiv').each(function (index) {

            $(this).find('._ordering').text(index + 1)

        });

    });


    $(document).on('click', '._writeBtn', function () {


        $('._writeBtn').not($(this)).hide();

        var scheduleTable = $('._scheduleTable')
        var scheuleInputList = scheduleTable.find('input');
        scheuleInputList.attr('readonly', true);
        scheuleInputList.removeClass('_selectInput');



        var updateBtn = scheduleTable.find('._updateBtn');
        updateBtn.text('수정');
        updateBtn.addClass('_writeBtn');
        updateBtn.removeClass('_updateBtn');
        var exitBtn = scheduleTable.find('._exitBtn');
        exitBtn.hide();


        var closetOclList = $(this).closest('._oclList');
        var updateInputList = closetOclList.find('input');


        updateInputList.attr('readonly', false);
        updateInputList.attr('disabled', false);

        updateInputList.addClass('_selectInput');
        $(this).next().show();
        $(this).text('저장');
        $(this).addClass('_updateBtn');
        $(this).removeClass('_writeBtn');

        closetOclList.find("._editImgList").find("._editableEmployeeCode").addClass('_hide')

        closetOclList.find("._editImgList").find('._editEmployeeCodeDiv').removeClass("_hide")
    });




    // 취소했을때 기존 value로 다시
    $(document).on('click', '._exitBtn', function () {

        $('._scheduleTable').load(location.href + ' ._scheduleTable');
    });

    $(document).on('click', '._updateBtn', function () {

        
        var editEmployeeList = [];


        $(this).closest('._oclList').find("._editEmployeeList").find('._selectApproverList').find('._selectApprover').each(function () {

            editEmployeeList.push($(this).text())

        });


        var closetForm = $(this).closest('._oclList');
        var calendarId = closetForm.find('._calendarId').text().trim();
        var name = closetForm.find('._name').val().trim();
        var bgColor = closetForm.find('._bgColor').val().trim();
        var companyCode = closetForm.find('._companyCode').val().trim();
        var departmentCode = closetForm.find('._departmentCode').val().trim();


        var updateFormData = {
            "calendarId": calendarId,
            "name": name,
            "bgColor": bgColor,
            "companyCode": companyCode,
            "employeeCode": editEmployeeList,
            "departmentCode": departmentCode
        }
        if (name.length == 0) {
            alert("캘린더이름을 입력해주세요.");
            return false;
        }
        if (companyCode.length == 0 && editEmployeeList.length == 0 && departmentCode.length == 0) {
            alert("회사코드 혹은 수정 사원코드 혹은 부서코드를 하나이상 입력해주세요 ");
            return false;
        }
        if (bgColor.length == 0) {
            alert("색상을 입력해주세요.");
            return false;
        }

        if ((companyCode && departmentCode)) {
            alert("회사코드 혹은 부서코드중 하나만 입력해주세요");
            return false;
        }
        $.ajax({
            url: "updateCalendar",
            type: "PUT",
            data: updateFormData,
            success: function (data) {
                if (typeof data != 'undefined' && data != '' && data != 'null') {
                    alert(data + notExistAlert);
                    return false;
                }
                location.reload();
            },
            error: function () {

                alert('캘린더 수정에 실패하셨습니다.');
                return false;

            }
        })



    });
    $(document).on('click', '._addBtn', function () {

        

        var approver = [];


        $(this).closest("._addCalendarForm").find("._saveEmployeeCodeList").find('._selectApprover').each(function () {

            approver.push($(this).text())

        });

        var closetForm = $(this).closest('._addCalendarForm');
        var name = closetForm.find('._name').val().trim();
        var bgColor = closetForm.find('._bgColor').val().trim();
        var companyCode = closetForm.find('._companyCode').val().trim();

        var departmentCode = closetForm.find('._departmentCode').val().trim();

        var addFormData = {
            "name": name,
            "bgColor": bgColor,
            "companyCode": companyCode,
            "employeeCode": approver,
            "departmentCode": departmentCode
        }


        if (name.length == 0) {
            alert("캘린더이름을 입력해주세요.");
            return false;
        }
        if (companyCode.length == 0 && approver.length == 0 && departmentCode.length == 0) {
            alert("회사코드 혹은 수정 사원코드 혹은 부서코드를 하나이상 입력해주세요 ");
            return false;
        }
        if (bgColor.length == 0) {
            alert("색상을 입력해주세요.");
            return false;
        }

        if ((companyCode && departmentCode)) {
            alert("회사코드 혹은 부서코드중 하나만 입력해주세요");
            return false;
        }


        $.ajax({
            url: "addCalendar",
            type: "POST",
            data: addFormData,
            success: function (data) {
                if (typeof data != 'undefined' && data != '' && data != 'null') {
                    alert(data + notExistAlert);
                    return false;
                }
                location.reload();

            },
            error: function () {

                alert('캘린더 추가에 실패하셨습니다.');
                return false;

            }
        })




    });


    // 캘린더안에 스케줄 있는지 확인후 캘린더 삭제
    $(document).on('click', '._deleteBtn', function () {
        var calendarId = $(this).closest('._oclList').find('._calendarId').text();
        var calendarIdData = {
            "calendarId": calendarId
        }
        var result = confirm("삭제하시겠습니까?")
        if (!result) {
            return false;
        }

        var request = $.ajax({
            type: "GET",
            url: "/schedule/countSchedule",
            data: calendarIdData,

        }).fail(function () {
            alert("삭제에 실패하셨습니다");
            return false;
        });

        request.done(function (data) {
            if (data == 0) {
                $.ajax({
                    url: "deleteCalendar",
                    type: "DELETE",
                    data: calendarIdData,
                    success: function () {
                        location.reload();
                    },
                    error: function () {

                        alert('캘린더 삭제에 실패하셨습니다.');
                        return false;

                    }
                })


            } else {
                alert('해당 캘린더에 ' + data + '개의 스케줄이 있어 삭제할수 없습니다.');
                return false;
            }
        });

    });

    $(document).on('click', '#missingDefaultBtn', function () {



        $.ajax({
            url: "defaultCalendar",
            type: "POST",
            success: function () {
                $('html').css("cursor", "auto");
                alert("영업사원 기본캘린더 일괄추가에 성공했습니다");

                location.reload();
            },
            beforeSend: function () {
                $('.black_screen').css({
                    visibility: 'visible',
                    opacity: '.3'
                });
                $('html').css("cursor", "wait");
            },
            error: function () {

                alert('영업사원 기본캘린더 일괄추가에 실패하셨습니다.');
                return false;

            }
        })


    });

});