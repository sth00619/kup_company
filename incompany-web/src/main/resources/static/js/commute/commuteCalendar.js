document.addEventListener('DOMContentLoaded', function() {
    // ajax 에러 메시지
    const ajaxErrorMessage = "☢ Ajax ERROR, 담당자에게 문의하세요.";

    // 현재 시간
    function getCurrentTime() {
        var currentTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        return currentTime;
    }

    // yyyy-MM-dd 형식 예) 2022-12-13
    function commuteDateFormat(date){
       return date.slice(0, 10);
    }

    // yyyy-MM-dd HH:mm 형식으로 변경하는 함수 예) 2022-12-13 18:02
    function commuteDateTimeFormat(dateTime){
        return dateTime.replace('T', ' ');
    }

    // hh:mm:ss a 형식으로 변경 예) 13:27:34 PM
    function commuteTimeFormat(dateTime){
        // 요일 설정
        const timeName = ["am", "pm"];

        const hour = dateTime.getHours();
        const minute = dateTime.getMinutes();
        const second = dateTime.getSeconds();
        const hourFormat = (hour%12) == 0 ? "12" :
                           (hour%12) < 10 ? "0" + (hour%12) : (hour%12);
        const minuteFormat = minute < 10 ? "0" + minute : minute;
        const timeFormat = hour < 12 ? timeName[0] : timeName[1];

        return hourFormat + ":" + minuteFormat + " " + timeFormat;
    }

    // DB에서 출퇴근 기록 받아 Calendar Event 추가
    $.ajax({
        type: "GET",
        url: "/commute/getCommuteCalendarList",
        dataType: "json",
        success: function(data) { // 결과 받기
            if(data.length !== 0){
               for (i = 0; i < data.length; i++){
                   calendar.addEvent({
                       id: data[i]['commuteNo'],
                       title: data[i]['title'],
                       start: data[i]['startTime'],
                       end: data[i]['endTime'],
                       category_no: data[i]['categoryNo'],
                       category_name: data[i]['categoryName']
                   })
               }
            }else {
                alert("일지를 작성한 적이 없거나, 아무런 값도 받아오지 못 했습니다.");
                return false;
            }
        },
        error: function (){
            alert(ajaxErrorMessage);
            return false;
        }
    })

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',    // 캘런디 형식
        contentHeight: 800,             // 캘린더 크기 설정
        editable: false,                // 수정 가능 여부
        nowIndicator: true,             // 현재 시간 마크
        locale: 'ko',                   // 한국어 설정
        customButtons: {
            goToWork: {
                text: '출근',
                click: function() {
                    // 기본값 설정
                    const target = document.getElementById('commute-add-category');
                    target.options[0].selected = true;

                    // 기본값 조회
                    const commuteAddCategory = document.getElementById('commute-add-category');
                    const categoryNo = parseInt(commuteAddCategory.options[commuteAddCategory.selectedIndex].value);
                    let startTime = getCurrentTime();
                    let title = null;
                    let endTime = null;

                    $.ajax({
                        type: "POST",
                        url: "/commute/goToWork",
                        data: {
                            categoryNo : categoryNo,
                            title : title,
                            startTime : startTime,
                            endTime : endTime
                        },
                        success: function(data) {
                            if(data === true){
                                alert("출근이 완료되었습니다.");
                                location.reload();
                            } else {
                                alert("오늘은 이미 출근 버튼을 눌렀습니다.");
                                return false;
                            }
                        },
                        error: function (){
                            alert(ajaxErrorMessage);
                            return false;
                        }
                    })
                }
            },
            getOffWork: {
                text: '퇴근',
                click: function() {
                    let endTime = commuteDateTimeFormat(getCurrentTime()) + ":00";
                    $.ajax({
                        type: "POST",
                        url: "/commute/getOffWork",
                        data: {
                            endTime : endTime
                        },
                        success: function(data) {
                            alert(data.meaning);
                            if(data.name === "SUCCESS" && data.index === 4){
                                location.reload();
                            } else {
                                return false;
                            }
                        },
                        error: function (){
                            alert(ajaxErrorMessage);
                            return false;
                        }
                    })
                }
            },
            list: {
                text: '목록',
                click: function() {
                    location.href = '/commute/commute';
                }
            },
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'goToWork getOffWork list'
        },
        dateClick: function(info) {
            // 클릭한 날짜 오전 9시로 설정 에) 2023-01-25T09:00
            let clickDate = new Date(info.date);
            clickDate.setHours(clickDate.getHours() + 9);
            clickDate = new Date(clickDate.getTime() - clickDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

            let startDate = commuteDateTimeFormat(clickDate);
            $('#modal-add').addClass('active');

            // 값 초기화
            const target = document.getElementById('commute-add-category');
            target.options[0].selected = true;
            $("#commute-add-title").val("");
            $("#commute-add-start").val(startDate);
            $("#commute-add-end").val("");
        },
        eventClick: function(info) {
            // 일지의 startTime 과 endTime 설정
            const startStr = info.event.startStr;
            const endStr = info.event.endStr;

            $('#modal').addClass('active');
            var modalContent = document.getElementById('modal-content');

            // modal 내용 초기화
            modalContent.innerHTML = '';

            // 일지 시작 날짜
            const startDateTime = new Date(startStr);
            var startDate = commuteDateFormat(startStr);

            // 일지 시작 시간
            var startTime = commuteTimeFormat(startDateTime);

            if(endStr !== ""){
                // 일지 종료 날짜
                const endDateTime = new Date(endStr);
                var endDate = commuteDateFormat(endStr);

                // 일지 종료 시간
                var endTime = commuteTimeFormat(endDateTime);
            }

            // 일지 시작, 종료 날짜 확인 및 셋팅
            const commuteDate = endStr !== "" ?
            startDate === endDate ? startDate +" "+ startTime +" - "+ endTime : startDate +" "+ startTime +" - "+ endDate +" "+ endTime : startDate +" "+ startTime

            // modal 내용 설정
            modalContent.innerHTML += `<div class="modal-title">${info.event.extendedProps.category_name} ${info.event.title}</div>`;
            modalContent.innerHTML += `<div>${commuteDate}</div>`;
            const startStrFormat = startStr.slice(0, 19);
            const endStrFormat = endStr === "" ? "" : endStr.slice(0, 19);

            // 수정을 위한 데이터 설정
            modalContent.innerHTML += `<input type="hidden" id="commute-id" value="${info.event.id}">`;
            modalContent.innerHTML += `<input type="hidden" id="commute-title" value="${info.event.title}">`;
            modalContent.innerHTML += `<input type="hidden" id="commute-category" value="${info.event.extendedProps.category_no}">`;
            modalContent.innerHTML += `<input type="hidden" id="commute-start" value="${startStrFormat}">`;
            modalContent.innerHTML += `<input type="hidden" id="commute-end" value="${endStrFormat}">`;
        },
    });
    calendar.render();

});
