$(document).ready(function () {

    var getDepartmentCode = $('#getDepartmentCode').val();
    var getDepartmentName = $('#getDepartmentName').val();
    var getEmployeeCode = $('#getEmployeeCode').val();
    var getEmployeeName = $('#getEmployeeName').val();
    var assignStatus = $('#assignStatus').val();

    // 부서 selected
    if (typeof getDepartmentCode != 'undefined' && getDepartmentCode != '' && getDepartmentCode != null) {
        $('#departmentSelect').val(getDepartmentCode).prop('selected', true);
        $('#select2-departmentSelect-container').text(getDepartmentName);
    }

    // 담당자 selected
    if (typeof getEmployeeCode != 'undefined' && getEmployeeCode != '' && getEmployeeCode != null) {
        $('#employeeSelect').val(getEmployeeCode).prop('selected', true);
        $('#select2-employeeSelect-container').text(getEmployeeName);
    }

    // userCounseling select box

    $(document).on('change', '#departmentSelect', function () {

        var departmentCode = $(this).val();
        var departmentName = $('#select2-departmentSelect-container').text();
        var potentialUserNo = getPotentialUserNo();

        $(location).attr('href', "/potential/userCounseling?" +
            "assignStatus=" + assignStatus +
            "&departmentCode=" + departmentCode +
            "&departmentName=" + departmentName +
            potentialUserNo
        );
    });




    // 담당자 선택

    $(document).on('change', '#employeeSelect', function () {

        var employeeCode = $(this).val();
        var employeeName = $('#select2-employeeSelect-container').text();
        var potentialUserNo = getPotentialUserNo();

        var url = "/potential/userCounseling?" +
            "assignStatus=" + assignStatus +
            "&employeeCode=" + employeeCode +
            "&employeeName=" + employeeName +
            "&departmentName=" + getDepartmentName +
            potentialUserNo;
        window.open(url, "_blank");
    });

    function getPotentialUserNo() {
        var potentialUserNo = '';
        $('.checkedPotentialUser:checked').each(function () {
            potentialUserNo += "&potentialUserNo=" + $(this).parents('.bodyTr').find('.potentialUserNo').attr('value');
        });
        return potentialUserNo;
    };

    $('input[type=radio][name=inlineRadioOptions][value=' + $('#assignStatus').val() + ']').prop('checked', true);

    $('.select2').select2();

    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    // 총무 - 담당부서 select box 노출
    if ($('#departmentSelectForm').val() == 'true') {
        $('#notAllocationBtn').parent('.allocationBtn').attr('hidden', false);
    }
    $(document).on('click', '#showDetailBtn', function () {

        var myArticle = $(this).parents().next("tr");

        if ($(myArticle).hasClass('hide')) {
            $(myArticle).removeClass('hide').addClass('show');
        } else {
            $(myArticle).addClass('hide').removeClass('show');

        }
    })

    $(document).on('click','#userList',function(){
        var myArticle = $(this).next("tr");

        if ($(myArticle).hasClass('hide')) {
            $(myArticle).removeClass('hide').addClass('show');
        } else {
            $(myArticle).addClass('hide').removeClass('show');

        }

    })

});