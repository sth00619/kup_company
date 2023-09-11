var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '450px',
    initialEditType: 'wysiwyg',
    initialValue: contents,
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});


$(document).ready(function () {


    // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function () {
        $(this).attr('id', i);
        $(this).next().attr('for', i);
        i++;
    });
    // 양식 라디오 버튼 클릭 시 해당 양식 contents에 출력
    $(document).on('change', '._writeForm', function () {
        var text = $(this).val()
        editor.setHTML(text);
    });
    // toast UI 에디터의 contents 부분 form테그와 함께 전송
    var form = $('#updateDocument');
    $(document).on('click', '._submitBtn', function () {
        var contents = editor.getHTML();
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });

    $(document).on('click', '#back', function () {
        window.history.back();
    });


    // 프로젝트 참여인원  
    $('#searchEmployee').on('click', function () {
        $('.saved_list').toggleClass('saved_on');
    });

    $(document).on('keyup', '#searchEmployee', function () {
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
                $('._clickEmployee').remove();
                var str = '';
                $.each(data, function (index, item) {
                    str += '<li class="_clickEmployee">';
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
                $('.saved_list').prepend(str);
            }

        }).fail(function () {
            alert("사원찾기에 실패하셨습니다");
            return false;
        });



    });
    $(document).on('click', '._clickEmployee', function () {

        $('.saved_list').toggleClass('saved_on');

        var createEmployeeCode = $('#createEmployeeCode').val();
        var selectEmployeeCode = $(this).find('.saved_number').text();
        var selectEmployeeName = $(this).find('.saved_name').text();
        var selectEmployeeImg = $(this).find('._employeeImg').attr('src');
        var isSuccess = true;

        if (selectEmployeeCode == createEmployeeCode) {
            alert("작성자는 추가 할 수 없습니다.");
            return false;
        }

        $('._selectEmployeeCode').each(function () {

            if ($(this).val() == selectEmployeeCode) {
                alert("이미 추가된 사원입니다");
                isSuccess = false;
                return false;

            }

        });

        if (isSuccess) {
            var str = '';
            str += ' <div class="p_people view03people">';

            str += ' <img src="'
            str += selectEmployeeImg
            str += '">';

            str += ' <img src="/images/img/delete.png" class="_delEmployee">';
            str += ' <p class="hover_name">';
            str += selectEmployeeName;
            str += '</p>';
            str += '<input class="_selectEmployeeCode" value="';
            str += selectEmployeeCode
            str += '" hidden/>'
            str += ' </div>';

            $('._selectEmployee').before(str);

        }
    });

    $(document).on('click', '._delEmployee', function () {
        $(this).closest('.view03people').remove();
    });


    $(document).on('click', '#updateBtn', function () {

        var participants = getSelectEmployee();
        var title = $('#title').val();
        var contents = editor.getHTML();
        var projectNo = $('#projectNo').val();

        var data = {
            "projectNo": projectNo,
            "participants": participants,
            "title": title,
            "contents": contents
        }


        $.ajax({
            type: "PUT",
            url: "updateProject",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
            success: function (result) {

                if (result) {

                    alert(result);
                    window.history.back();
                }

                location.href = "/worksheet/project/contents?projectNo=" + projectNo;

            }

        }).fail(function () {
            alert("수정에 실패하셨습니다");
            return false;
        });

    });


});

function getSelectEmployee() {

    var employeeList = [];

    $('._selectEmployeeCode').each(function () {

        employeeList.push($(this).val());

    });

    return employeeList;

};