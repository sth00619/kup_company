const endTimeErrorMessage = "종료 시각이 시작 시각과 같거나 시작 시각보다 빠릅니다.";

// yyyy-MM-dd HH:mm 형식으로 변경하는 함수 예) 2022-12-13 18:02
function commuteDateTimeFormat(dateTime){
    return dateTime.replace('T', ' ') + ':00';
}

// 닫기 버튼
$('#modal-close-btn').click(function(){
    $("#modal").removeClass('active');
})
$('#modal-add-close-btn').click(function(){
    $('#modal-add').removeClass('active');
})
$('#modal-modify-close-btn').click(function(){
    $('#modal-modify').removeClass('active');
})

// 작성 완료 버튼
$('#btn-add-save').click(function(){
    const title = document.getElementById('commute-add-title').value.trim();
    const commuteAddCategory = document.getElementById('commute-add-category');
    const categoryNo = parseInt(commuteAddCategory.options[commuteAddCategory.selectedIndex].value);
    let startTime = document.getElementById('commute-add-start').value;
    let endTime = document.getElementById('commute-add-end').value;
    const failMessage = "저장에 실패하셨습니다. 담당자에게 문의하세요.";

    // 사유 길이 검사
    if (title.length > 20) {
        alert('사유는 최대 20글자까지 입력 가능합니다.');
        return false;
    }

    let nullCheck = false;
    let dateCheck = false;

    // Date 형식으로 변경
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // 미입력값 및 시간 확인
    if(startTime !== "") {
        if(endTime === "" || startDate < endDate) {
            // DB DATETIME 형식으로 변경
            startTime = commuteDateTimeFormat(startTime);
            endTime = endTime === "" ? "" : commuteDateTimeFormat(endTime);
        } else{
            alert(endTimeErrorMessage);
            return false;
        }
    } else {
        alert('시작 시각이 입력되지 않았습니다.');
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/commute/addCommute",
        data: {
            title : title,
            categoryNo : categoryNo,
            startTime : startTime,
            endTime : endTime
        },
        success: function(data) {
            if(data === true){
                location.reload();
            } else {
                alert(failMessage);
                return false;
            }
        },
        error: function (){
            $('#modal-add').removeClass('active');
            alert(failMessage);
            return false;
        }
    })
})

// 수정하기 버튼
$('#btn-modify').click(function(){
    $('#modal').removeClass('active');
    $('#modal-modify').addClass('active');
    const modalModify = document.getElementById('modal-content-modify');

    const commuteNo = parseInt(document.getElementById('commute-id').value);
    const title = document.getElementById('commute-title').value;
    const categoryNo = parseInt(document.getElementById('commute-category').value) - 1;
    const startTime = document.getElementById('commute-start').value;
    const endTime = document.getElementById('commute-end').value;

    $("#commute-modify-id").val(commuteNo);
    $("#commute-modify-title").val(title);
    const target = document.getElementById('commute-modify-category');
    target.options[categoryNo].selected = true;
    $("#commute-modify-start").val(startTime);
    $("#commute-modify-end").val(endTime);
})


// 수정 완료 버튼
$('#btn-modify-save').click(function(){
    const commuteNo = parseInt(document.getElementById('commute-modify-id').value);
    const title = document.getElementById('commute-modify-title').value.trim();
    const categoryNo = parseInt(document.getElementById('commute-modify-category').value);
    let startTime = document.getElementById('commute-modify-start').value;
    let endTime = document.getElementById('commute-modify-end').value;
    const failMessage = "수정에 실패하셨습니다. 담당자에게 문의하세요.";

    // 사유 길이 검사
    if (title.length > 20) {
        alert('사유는 최대 20글자까지 입력 가능합니다.');
        return false;
    }

    let nullCheck = false;
    let dateCheck = false;

    // Date 형식으로 변경
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // 유효성 검사, 미입력값 체크
    if(startTime !== "") {
        if(endTime === "" || startDate < endDate) {
            // DB DATETIME 형식으로 변경
            startTime = commuteDateTimeFormat(startTime);
            endTime = endTime === "" ? "" : commuteDateTimeFormat(endTime);
        } else{
            alert(endTimeErrorMessage);
            return false;
        }
    } else {
        alert('시작 시각이 입력되지 않았습니다.');
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/commute/updateCommute",
        data: {
            commuteNo : commuteNo,
            title : title,
            categoryNo : categoryNo,
            startTime : startTime,
            endTime : endTime
        },
        success: function(data) {
            if(data === true){
                location.reload();
            } else {
                alert(failMessage);
                return false;
            }
        },
        error: function (){
            $('#modal-modify').removeClass('active');
            alert(failMessage);
            return false;
        }
    })
})

// 삭제하기 버튼
$('#btn-delete').click(function(){
    const commuteNo = document.getElementById('commute-id').value;
    const failMessage = "삭제에 실패하셨습니다. 담당자에게 문의하세요.";

    const deleteCheck = confirm("정말로 삭제 하시겠습니까?");

    if (deleteCheck === true){
        $.ajax({
            type: "POST",
            url: "/commute/deleteCommute",
            data: {
                commuteNo : commuteNo
            },
            success: function(data) {
                if(data === true){
                    location.reload();
                } else {
                    alert(failMessage);
                    return false;
                }
            },
            error: function (){
                $('#modal').removeClass('active');
                alert(failMessage);
                return false;
            }
        })
    }
})