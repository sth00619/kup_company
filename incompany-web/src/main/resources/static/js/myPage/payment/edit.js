var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.getElementById('editor'),
    height: '450px',
    initialEditType: 'wysiwyg',
    initialValue: contents,
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});





$(document).ready(function () {

    var loginEmployeeCode = $('#loginEmployeeCode').val();


    // // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function () {
        $(this).attr('id', i);
        $(this).next().attr('for', i);
        i++;
    });

    $(document).on('click', '#cancelRadio', function () {

        $('input:radio[name=writeFormat]:checked').prop('checked', false);
        $('#title').val('');
        $('._companyCode').val('');
        $('._departmentCode').val('');
        editor.setHTML('');


    })

    $(document).on('change', '._writeForm', function () {


        var paymentFormNo = $(this).val()

        $.ajax({
            type: "GET",
            url: "/myPage/payment/paymentFormInfo",
            data: {
                "paymentFormNo": paymentFormNo
            },
            success: function (data) {


                $('#title').val(data.title);
                $('._companyCode').val(data.companyCode);
                $('._departmentCode').val(data.departmentCode);
                editor.setHTML(data.contents);

            }
        }).fail(function () {
            alert("error");
            return false;
        });




    });

    // 프로젝트 참여인원  
    $('#searchApprEmployee').on('click', function () {

        $('._ref').removeClass('saved_on');
        $('._appr').toggleClass('saved_on');


    });

    $('#searchRefEmployee').on('click', function () {

        $('._ref').toggleClass('saved_on');
        $('._appr').removeClass('saved_on');


    });






    $(document).on('keyup', '#searchApprEmployee', function () {
        var searchEmployee = $(this).val();
        var searchUrl;

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
                $('._clickApproverEmployee').remove();
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
                $('._appr').prepend(str);
            }

        }).fail(function () {
            alert("사원찾기에 실패하셨습니다");
            return false;
        });


    });




    $(document).on('keyup', '#searchRefEmployee', function () {
        var searchEmployee = $(this).val();
        var searchUrl;

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
                $('._clickRefEmployee').remove();
                var str = '';
                $.each(data, function (index, item) {
                    str += '<li class="_clickRefEmployee">';
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
                $('._ref').prepend(str);
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

        var prevOrdering = Number($('._selectApprDiv').last().find('._ordering').text()) + 1;


        var searchResult = true;

        if(loginEmployeeCode == selectEmployeeCode){
            alert("본인을 추가할수 없습니다");
            return false;
        }

        $('._selectRef').each(function () {

            if ($(this).val() == selectEmployeeCode) {
                alert("참조자로 이미 추가된 사원입니다!");
                searchResult = false;
                return false;
            }

        });

        $('._selectApprover').each(function () {

            if ($(this).val() == selectEmployeeCode) {
                alert("결재자로 이미 추가된 사원입니다!");
                searchResult = false;
                return false;
            }

        });

        if (searchResult) {
            var str = '';

            str += ' <div class="_selectApprDiv">';
            str += '<div style="float : left ;">'
            str += ' <img src="/images/img/delete.png" class="_delApprEmployee" style="cursor: pointer">';


            str += '<span class="_ordering">';
            str += prevOrdering
            str += '</span>'

            str += ' <span  style="margin-top: 10px; margin-bottom: 10px; font-size: 15px; font-weight : bold">';
            str += selectEmployeeName;
            str += '</span>';
            str += '</div>'
            str += '<div class="_selectEmployeeTypeList" style="margin-left : 50px; padding-top:10px">'
            str += '<input class="_selectApprover" value="';
            str += selectEmployeeCode
            str += '" style="margin-top : 8px;" readonly/>'
            str += '</div>'
            str += ' <br>';
            str += ' </div>';



            $('._selectApproverList').append(str);
        }

    });



    $(document).on('click', '._clickRefEmployee', function () {


        $('._ref').toggleClass('saved_on');
        $('._appr').removeClass('saved_on');

        var selectEmployeeCode = $(this).find('.saved_number').text();
        var selectEmployeeName = $(this).find('.saved_name').text();
        var searchResult = true;



        if(loginEmployeeCode == selectEmployeeCode){
            alert("본인을 추가할수 없습니다");
            return false;
        }

        $('._selectRef').each(function () {

            if ($(this).val() == selectEmployeeCode) {
                alert("참조자로 이미 추가된 사원입니다!");
                searchResult = false;
                return false;
            }

        });

        $('._selectApprover').each(function () {

            if ($(this).val() == selectEmployeeCode) {
                alert("결재자로 이미 추가된 사원입니다!");
                searchResult = false;
                return false;
            }

        });



        if (searchResult) {
            var str = '';

            str += ' <div class="_selectRegDiv">';
            str += '<div style="float : left ;">'
            str += ' <img src="/images/img/delete.png" class="_delRefEmployee" style="cursor: pointer">';

            str += ' <span  style="margin-top: 10px; margin-bottom: 10px; font-size: 15px; font-weight : bold">';
            str += selectEmployeeName;
            str += '</span>';
            str += '</div>'
            str += '<div class="_selectEmployeeTypeList" style="margin-left : 50px; padding-top:10px">'
            str += '<input class="_selectRef" value="';
            str += selectEmployeeCode
            str += '" style="margin-top : 8px;" readonly/>'
            str += '</div>'
            str += ' <br>';

            str += ' </div>';


            $('._selectRefEmployeeList').append(str);
        }

    });





    // 결재자 삭제
    $(document).on('click', '._delApprEmployee', function () {

        $(this).closest('._selectApprDiv').remove();

        $('._selectApprDiv').each(function (index) {

            $(this).find('._ordering').text(index + 1)

        });

    });



    // 참조자 삭제
    $(document).on('click', '._delRefEmployee', function () {

        $(this).closest('._selectRegDiv').remove();

    });



    $(document).on('click', '._addBtn', function (e) {

        var status = $(this).val();




        e.preventDefault();

        const approverStr = "approver";
        const referrerStr = "referrer";

        var approver = [];
        var referrer = [];


        $('._selectApprover').each(function () {

            approver.push($(this).val())

        });

        $('._selectRef').each(function () {

            referrer.push($(this).val())

        });

        if (!title) {
            alert('제목을 입력해주세요');
            return false;
        }


        if(approver.length ==0 ){
            alert('결재자를 한명이상 선택해주세요');
            return false;
        }


        var form = $('#form')[0]; // FormData 객체 생성    
        var formData = new FormData(form);

        var contents = editor.getHTML();


        formData.append("contents", contents);
        formData.append(approverStr, approver);
        formData.append(referrerStr, referrer);
        formData.append("status", status);



        $.ajax({
            type: "PUT",
            url: "/myPage/payment/edit",
            enctype: 'multipart/form-data', // 필수
            contentType: false,
            processData: false,
            data: formData,
            success: function (resultCode) {
                location.href = "/myPage/payment/contents?paymentNo=" + resultCode;
            }

        }).fail(function () {
            alert("저장에 실패하셨습니다");
            return false;
        });




    });


    $(document).on('click', '#dleFileListBtn', function () {
        var fileNameBef = $('.fileNameBef').length;
        $(this).parent().remove();
        if (fileNameBef < 1) {
            $('#fileListDiv').prepend('<div class="fileNameBef"><input type="file" class="selectFile"></div>')
        }
        $('#maxMsg').remove();

    })

    $(document).on('change', '.selectFile', function () {
        var maxMsg = $('#maxMsg').text()
        var fileLengths = $('.fileName').length;
        var fileNameBef = $('.fileNameBef').length;
        var fileValue = $(this).val().split("\\");
        var fileName = fileValue[fileValue.length - 1];

        var str = "";
        str += '<a  id="dleFileListBtn">x</a><span>';
        str += fileName
        str += '</span>';
        $(this).parent().prepend(str)
        $(this).attr('hidden', true)
        $('.fileNameBef').attr('class', 'fileName')
        $(this).attr('name', 'file')
        if (fileLengths + fileNameBef < 5) {
            $('#fileListDiv').prepend('<div  class="fileNameBef"><input type="file" class="selectFile"></div>')
        } else {
            if (!maxMsg) {
                $('#fileListDiv').prepend('<p id="maxMsg">파일은 최대 5개까지 업로드 가능합니다</p>')
            }
        }
    })




});