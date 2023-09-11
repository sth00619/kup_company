$(document).ready(function () {
    // url 정규식
    var httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    // ajax 실패 메시지
    const failMessage = "저장에 실패하셨습니다. 담당자에게 문의하세요.";

    // 저장 버튼 클릭시
    $(document).on('click', '._addBtn', function () {

        const categoryNo = parseInt(document.getElementById('categoryNo').value);
        const imgName = document.getElementById('imgName').value.trim();
        const imgFile = document.getElementById('imgFile');
        const urlKey = document.getElementById('urlKey').value.trim();
        const ordering = document.getElementById('ordering').value;
        const departmentCode = document.getElementById('departmentCode').value.trim();
        console.log("departmentCode: " + departmentCode);
        const file = imgFile.files[0];

        // 유효성 검사
        if (categoryNo === 0) {
            alert("카테고리를 선택해 주세요.");
            return false;
        }
        if (imgName.length == 0) {
            alert("이미지 이름을 입력해 주세요.");
            return false;
        }
        if (typeof file == "undefined") {
            alert("파일을 선택해 주세요.");
            return false;
        }
        // urlKey의 값이 있을 경우 url 정규식
        if (urlKey.length != 0) {
            console.log(urlKey);
            console.log(typeof urlKey);
            if(httpRegex.test(urlKey) != true){
                console.log(httpRegex.test(urlKey));
                alert("입력하신 URL이 HTTP/HTTPS 형식으로 시작하지 않습니다.");
                return false;
            }
        }
        var flag = true;
        if (ordering.length == 0 || isNaN(ordering)) {
            alert("올바른 순서를 입력해 주세요.");
            return false;
        } else {
            if(ordering < 1 || ordering > 20) {
            alert("순서는 1~20 사이의 숫자만 가능합니다.");
            return false;
            } else {
                for(let i = 0; i < bannerImgList.length; i++){
                    let list = bannerImgList[i];
                    let checkImgNo = list["imgNo"];
                    let checkCategoryNo = list["categoryNo"];
                    let checkOrdering = list["ordering"];

                    if(categoryNo == checkCategoryNo && ordering == checkOrdering) {
                        flag = false;
                    }
                }
            }
        }
        if (flag == false) {
            alert("입력하신 순서는 이미 사용하고 있습니다, 다른 순서를 입력해 주세요.");
            return false;
        }

        var formData = new FormData();
        formData.append('categoryNo', categoryNo);
        formData.append('imgName', imgName);
        formData.append('imgFile', file);
        formData.append('urlKey', urlKey);
        formData.append('ordering', ordering);
        formData.append('departmentCode', departmentCode);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/banner/addBannerImg",
            processData: false,
            contentType: false,
            data : formData,
            success: function (data) {
                if (typeof data != 'undefined' && data != '' && data != 'null') {
                    alert("해당 "+data + "는 없습니다.");
                    return false;
                }
                location.reload();
            },
            error: function (){
                alert(failMessage);
                return false;
            }
        })
    });

    // 수정 버튼 클릭시
    $(document).on('click', '._writeBtn', function () {
        $('._writeBtn').not($(this)).hide();

        var imgTable = $('._imgTable')
        var imgInputList = imgTable.find('input');
        imgInputList.attr('readonly', true);
        imgInputList.removeClass('_selectInput');

        var updateBtn = imgTable.find('._updateBtn');
        updateBtn.text('수정');
        updateBtn.addClass('_writeBtn');
        updateBtn.removeClass('_updateBtn');
        var exitBtn = imgTable.find('._exitBtn');
        exitBtn.hide();

        var closetBylList = $(this).closest('._bilList');
        var updateInputList = closetBylList.find('input');

        updateInputList.attr('readonly', false);
        updateInputList.attr('disabled', false);

        updateInputList.addClass('_selectInput');
        $(this).next().show();
        $(this).text('저장');
        $(this).addClass('_updateBtn');
        $(this).removeClass('_writeBtn');

        closetBylList.find("._editReadCategoryNo").find("._editReadCategoryNo").addClass('_hide');
        closetBylList.find("._editReadCategoryNo").find('._editCategoryNo').removeClass("_hide");
        closetBylList.find("._editBannerImg").find("._editRead").addClass('_hide');
        closetBylList.find("._editBannerImg").find('._edit').removeClass("_hide");
    });

    // 취소했을때 기존 value로 다시
    $(document).on('click', '._exitBtn', function () {

        $('._imgTable').load(location.href + ' ._imgTable');
    });

    // 수정 - 저장 버튼 클릭시
    $(document).on('click', '._updateBtn', function () {

        const closetForm = $(this).closest('._bilList');
        const imgNo = parseInt(closetForm.find('._imgNo').val());
        const categoryNo = parseInt(closetForm.find('._editCategoryNo').val());
        const imgName = closetForm.find('._imgName').val().trim();
        const editReadImg = closetForm.find('._editRead').val();
        const editImg = document.querySelector('._edit._selectInput');
        const urlKey = closetForm.find('._urlKey').val().trim();
        const ordering = parseInt(closetForm.find('._ordering').val());
        const departmentCode = closetForm.find('._departmentCode').val().trim();
        console.log("departmentCode:"+departmentCode);
        console.log("length:"+departmentCode.length);
        console.log("type:"+typeof departmentCode);

        let file = editImg.files[0];

        // 유효성 검사
        if (categoryNo == 0) {
            alert("카테고리를 선택해 주세요.");
            return false;
        }
        if (imgName.length == 0) {
           alert("이미지 이름을 입력해 주세요.");
           return false;
        }
        if (typeof file === "undefined" ) {
           file = null;
        }
        // urlKey의 값이 있을 경우 url 정규식
        if (urlKey.length != 0) {
            console.log(urlKey);
            console.log(typeof urlKey);
            if(httpRegex.test(urlKey) != true){
                console.log(httpRegex.test(urlKey));
                alert("입력하신 URL이 HTTP/HTTPS 형식으로 시작하지 않습니다.");
                return false;
            }
        }
        var flag = true;
        if (ordering.length == 0 || isNaN(ordering)) {
           alert("올바른 순서를 입력해 주세요.");
           return false;
        } else {
            if(ordering < 1 || ordering > 20) {
                alert("순서는 1~20 사이의 숫자만 입력할 수 있습니다.");
                return false;
            }else {
                for(let i = 0; i < bannerImgList.length; i++){
                    let list = bannerImgList[i];
                    let checkImgNo = list["imgNo"];
                    let checkCategoryNo = list["categoryNo"];
                    let checkOrdering = list["ordering"];

                    if(imgNo == checkImgNo && categoryNo == checkCategoryNo && ordering == checkOrdering){
                        break;
                    }
                    if(categoryNo == checkCategoryNo && ordering == checkOrdering) {
                        flag = false;
                    }
                }
            }
        }
        if (flag == false) {
            alert("입력하신 순서는 이미 사용하고 있습니다, 다른 순서를 입력해 주세요.");
            return false;
        }

        var formData = new FormData();
        formData.append('imgNo', imgNo);
        formData.append('categoryNo', categoryNo);
        formData.append('imgName', imgName);
        formData.append('imgFile', file);
        formData.append('urlKey', urlKey);
        formData.append('ordering', ordering);
        formData.append('departmentCode', departmentCode);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/banner/updateBannerImg",
            processData: false,
            contentType: false,
            data : formData,
            success: function (data) {
                if (typeof data != 'undefined' && data != '' && data != 'null') {
                    alert("해당 "+data + "는 없습니다.");
                    return false;
                }
                location.reload();
            },
            error: function (request, status, error){
                alert("에러",failMessage);
                return false;
            }
        })
    });

    // 삭제 버튼 클릭시
    $(document).on('click', '._deleteBtn', function () {
        var imgNo = $(this).closest('._bilList').find('._imgNo').val();
        console.log("imgNo: " + imgNo);

        var result = confirm("삭제하시겠습니까?")
        if (!result) {
            return false;
        }
        $.ajax({
            url: "deleteBannerImg",
            type: "DELETE",
            data: {
                imgNo : imgNo
            },
            success: function () {
                location.reload();
            },
            error: function () {

                alert('이미지 삭제에 실패하셨습니다.');
                return false;

            }
        })
    });
});