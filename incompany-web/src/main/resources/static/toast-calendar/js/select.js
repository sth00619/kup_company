$(document).ready(function () {
    // const COMPANY_START_CODE = 'C';
    var getEmployeeLoginCode = $('#employeeLoginCode').val();

    var getDepartmentCode = $('#getDepartmentCode').val();
    var getEmployeeCode = $('#getEmployeeCode').val();
    var departmentCode = getDepartmentCode;
    var belong_length = 3;
    var department_length = 5;
    var team_length = 7;


    // // 리더권한 Default setting
    // if ($('._department_select').hasClass('_leader_select') && $('._department_select').children().length == 1) {
    //     $('#getDepartmentCode').val($('._department_select').val());
    // }

    if (getDepartmentCode.length == 7) {
        // 팀이 선택되어 있을 경우 - 영업 부서 코드, 팀 코드 세팅
        var getTeamCode = getDepartmentCode;
        departmentCode = getDepartmentCode.substring(0, 5);
        var belongCode = getDepartmentCode.substring(0, 3);
        $('#getTeamCode').val(getTeamCode);
    } else if (getDepartmentCode.length == 5) {
        // 부서만 선택했을 경우 - 팀 리스트 세팅
        var belongCode = getDepartmentCode.substring(0, 3);
        departmentCode = getDepartmentCode;
        var departmentName = '팀';
        // getChileDepartment(departmentCode, departmentName, department_length, team_length);
    } else if (getDepartmentCode.length == 3) {
        var belongCode = getDepartmentCode;
        var departmentName = '지점';
        // getChileDepartment(belongCode, departmentName, department_length, team_length);
    }

    /*본부, 부서, 팀 select box */
    $(document).on('change', '._belong_select, ._department_select, ._team_select', function () {

        // 선택한 부서 코드
        let departmentCode = $(this).val();

        if ($(this).val() === 'cancel') {
            if ($(this).hasClass('_department_select')) {
                departmentCode = $('._belong_select').val();
            } else if ($(this).hasClass('_team_select')) {
                departmentCode = $('._department_select').val();
            } else {
                departmentCode = '';
            }
        }

        $('#getDepartmentCode').val(departmentCode);

        // 부서 변경 시
        // 팀 코드 초기화
        if (departmentCode.length == belong_length) {
            $('._team_select').children().remove();
            $('._team_select').append('<option disabled selected>팀</option>');
            $('._department_select').children().remove();
            $('._department_select').append('<option disabled selected>지점</option>');
        }


        // 부서 변경 시
        // 팀 코드 초기화
        if (departmentCode.length == department_length) {
            $('._team_select').children().remove();
            $('._team_select').append('<option disabled selected>팀</option>');
        }


        // 담당자 초기화
        $('._employee_select').children().remove();
        $('._employee_select').append('<option disabled selected>담당자</option>');

        // 1뎁스 하위 부서 및 담당자 데이터 요청
        var request = $.ajax({
            url: '/departments/getChildDepartment',
            method: 'GET',
            data: {
                departmentCode: departmentCode
            },
            dataType: 'json' // 리스트, 맵을 받는경우 json 형식을 사용하자
        });

        // 요청 성공
        request.done(function (data) {

            if (departmentCode.length == belong_length) {
                $('._department_select').append('<option value="cancel">선택취소</option>');
                $(data.childDepartmentList).each(function (index, item) {
                    var code = item.departmentCode;
                    var name = item.departmentName;
                    $('._department_select').append('<option value="' + code + '">' + name + '</option>');
                });
            }
            // 부서 변경 시
            if (departmentCode.length == department_length) {
                // 하위부서 -> 팀 셋팅
                $('._team_select').append('<option value="cancel">선택취소</option>');
                $(data.childDepartmentList).each(function (index, item) {
                    var teamCode = item.departmentCode;
                    var teamName = item.departmentName;
                    $('._team_select').append('<option value="' + teamCode + '">' + teamName + '</option>');
                })
            }

            // 해당 부서 사원 -> 담당자 셋팅
            $('._employee_select').append('<option value="cancel">선택취소</option>');
            $(data.employeeList).each(function (index, item) {
                var employeeCode = item.employeeCode;
                var employeeName = item.employeeName;
                $('._employee_select').append('<option value="' + employeeCode + '">' + employeeName + '</option>');
            });
        });

        // 요청 실패
        request.fail(function (jqXHR, textStatus) {
            alert('☢ Ajax ERROR ', jqXHR, textStatus);
        });

    });


    $(document).on('change', '._employee_select', function () {

        const employeeCode = $(this).val();
        const departmentCode = $(this).parents().find('#getDepartmentCode').val();

        let url;
        if (employeeCode === 'cancel') {
            url = 'departmentCode=' + departmentCode;
        } else {
            url = 'employeeCode=' + employeeCode + '&departmentCode=' + departmentCode;
        }

        location.href = '/schedule/schedule?' + url;
    });


    // 본부 selected 유지
    if (typeof belongCode != 'undefined' && belongCode != '' && belongCode != 'null') {
        $('._belong_select').val(belongCode).prop('selected', true);
    }

    // 부서 selected 유지
    if (typeof departmentCode != 'undefined' && departmentCode != '' && departmentCode != 'null' && departmentCode.length == department_length) {
        $('._department_select').val(departmentCode).prop('selected', true);
    }

    // 팀 selected 유지
    if (typeof getTeamCode != 'undefined' && getTeamCode != '' && getTeamCode != 'null') {
        $('._team_select').val(getTeamCode).prop('selected', true);
    }

    // 담당자 selected 유지
    if (typeof getEmployeeCode != 'undefined' && getEmployeeCode != '' && getEmployeeCode != 'null') {

        if (getEmployeeCode != getEmployeeLoginCode) {
            $('._employee_select').val(getEmployeeCode).prop('selected', true);
        }


    }


});