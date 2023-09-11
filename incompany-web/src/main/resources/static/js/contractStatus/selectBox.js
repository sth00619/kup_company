$(document).ready(function () {

    const belong_length = 3;
    const department_length = 5;
    /*  셀렉트 박스 구현 */
    $(document).on('change', '._belong_select_trans, ._department_select_trans, ._team_select_trans', function () {

        // 선택한 부서 코드
        let departmentCode = $(this).val();
        console.log("departmentCode : ", departmentCode);
        let departmentName;

        if ($(this).val() === 'cancel') {
            if ($(this).hasClass('_department_select_trans')) {
                departmentCode = $('._belong_select_trans').val();
            } else if ($(this).hasClass('_team_select_trans')) {
                departmentCode = $('._department_select_trans').val();
            } else {
                departmentCode = '';
            }

            if (typeof departmentCode == 'undefined' || departmentCode === '' || departmentCode == null) {
                departmentCode = $('#getDepartmentCode').val();
                if ($(this).hasClass('_department_select_trans')) {
                    $('._department_select_trans').val(departmentCode);
                } else if ($(this).hasClass('_team_select_trans')) {
                    $('._team_select_trans').val(departmentCode);
                }
            }
        }

        if (departmentCode.length === 3) {
            departmentName = '지점';
        } else if (departmentCode.length === 5) {
            departmentName = '팀';
        }

        getChileDepartment(departmentCode, departmentName, department_length);
    });

    function getChileDepartment(departmentCode, departmentName, department_length) {

        const team_select = $('._team_select_trans');
        const department_select = $('._department_select_trans');
        const employee_select = $('._employee_select_trans');

        if (departmentCode === 'team') {
            departmentCode = department_select.val();
        }

        // 부서 변경 시
        // 팀 코드 초기화
        if (departmentCode.length === department_length) {
            team_select.val('');
            team_select.children().remove();
            team_select.append('<option disabled selected>팀</option>');
        } else if (departmentCode.length === belong_length) {
            team_select.val('');
            team_select.children().remove();
            team_select.append('<option disabled selected>팀</option>');
            department_select.val('');
            department_select.children().remove();
            department_select.append('<option disabled selected>지점</option>');
        }
        // 담당자 초기화
        employee_select.val('');
        employee_select.children().remove();
        employee_select.append('<option disabled selected>담당자</option>');

        // 고객 초기화
        const userHtml = '<option value="">고객선택(휴대폰뒷4자리)</option>';

        const customerSelect = $('#customer_select');
        if(customerSelect.length){
            customerSelect.children().remove();
            customerSelect.append(userHtml);
        }

        const clientSelect = $('.client_select');
        if(clientSelect.length){
            clientSelect.children().remove();
            clientSelect.append(userHtml);
        }

        // 1뎁스 하위 부서 및 담당자 데이터 요청
        const request = $.ajax({
            url: '/departments/getChildDepartment'
            , method: 'GET'
            , data: {departmentCode: departmentCode, departmentName: departmentName}
            , dataType: 'json'   // 리스트, 맵을 받는경우 json 형식을 사용하자
        });

        // 요청 성공
        request.done(function ({childDepartmentList, employeeList}) {

            // 부서 변경 시
            if (departmentCode.length === department_length) {
                // 지점의 하위부서 -> 팀 셋팅
                team_select.append('<option value="cancel">선택취소</option>');
                $(childDepartmentList).each(function (index, item) {
                    team_select.append('<option value="' + item.departmentCode + '">' + item.departmentName + '</option>');
                });
            } else if (departmentCode.length === belong_length) {
                department_select.append('<option value="cancel">선택취소</option>');
                // 본부의 하위부서 -> 지점 셋팅
                $(childDepartmentList).each(function (index, item) {
                    department_select.append('<option value="' + item.departmentCode + '">' + item.departmentName + '</option>');
                });
            }

            // 해당 부서 사원 -> 담당자 셋팅
            $(employeeList).each(function (index, item) {
                const employeeCode = item.employeeCode;
                const employeeName = item.employeeName;
                if (employeeCode !== null) {
                    employee_select.append('<option value="' + employeeCode + '">' + employeeName + '</option>');
                } else {
                    employee_select.append('<option selected value="' + employeeCode + '">' + employeeName + '</option>');
                }
            });

            $('._position_name').text('');

            $('#getDepartmentCode').val(departmentCode);
        });

        // 요청 실패
        request.fail(function () {
            alert('☢ Ajax ERROR');
        });
    }
});


