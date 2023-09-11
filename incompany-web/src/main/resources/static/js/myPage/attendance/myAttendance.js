$(document).ready(function () {
     let searchEmployeeCode = $('#searchEmployeeCode').val();

//   달력 생성
     const makeCalendar = (date) => {
          const dayStamp = [];
          let stampCnt = 0;
          // 현재 년도와 월 받아오기
          const currentYear = new Date(date).getFullYear();
          const currentMonth = new Date(date).getMonth() + 1;
          // 월 출석 현황 들고오기
          let dateFormat = "";
          if(currentMonth < 10 )
            dateFormat = "-0";
          else
            dateFormat = "-"
          $.ajax({
                url: "/myPage/attendance/getCalendar",
                type: "GET",
                async: false,
                data: {
                    "inputDate" : String(currentYear)+dateFormat+String(currentMonth)
                },
                success: function (data) {
                    dayStamp.push(...data);
                    return false;
                },
                error: function () {
                    alert('잠시 후 다시 시도해주세요.');
                    return false;
                }
          })

          // 첫날의 요일 구하기 - 초기 시작위치를 위해서
          const firstDay = new Date(date.setDate(1)).getDay();
          // 마지막 날짜 구하기
          const lastDay = new Date(currentYear, currentMonth, 0).getDate();

          // 달력 제작
          let htmlDummy = '';
          let dateCnt = 1;
          let firstWeek = '';
          for (let i = 0; i < 7; i++) {
            if(i < firstDay){
                firstWeek += `<li class="check_mypoint" style="visibility:hidden"><span class="check_stamp"></span></li>`;
                continue;
            }
            if(dateCnt === dayStamp[stampCnt]){
                firstWeek += `<li class="check_mypoint"><span class="check_stamp active">${dateCnt}</span></li>`;
                stampCnt++;
            }
            else
                firstWeek += `<li class="check_mypoint"><span class="check_stamp">${dateCnt}</span></li>`;
            dateCnt++;
          }
          htmlDummy += `<ul class="day_my_attendance">${firstWeek}</ul>`;
          let weeklyCnt = 0;
          let ulDummy = '';
          while(dateCnt <= lastDay) {
            if(weeklyCnt >= 7){
                htmlDummy += `<ul class="day_my_attendance">${ulDummy}</ul>`;
                weeklyCnt = 0;
                ulDummy = '';
            }
            if(dateCnt === dayStamp[stampCnt]){
                ulDummy += `<li class="check_mypoint"><span class="check_stamp active">${dateCnt}</span></li>`;
                stampCnt++;
            }
            else
                ulDummy += `<li class="check_mypoint"><span class="check_stamp">${dateCnt}</span></li>`;
            dateCnt++;
          }
          htmlDummy += `<ul class="day_my_attendance">${ulDummy}</ul>`;

          document.querySelector(`._weekly`).innerHTML = htmlDummy;
          document.querySelector(`._y_data`).innerText = `${currentYear}년`;
          document.querySelector(`._m_data`).innerText = `${currentMonth}월`;

    }

    const date = new Date();

    makeCalendar(date);

    // 이전달 이동
    document.querySelector(`._ym_btn_prev`).onclick = () => {
        makeCalendar(new Date(date.setMonth(date.getMonth() - 1)));
    }
    // 다음달 이동
    document.querySelector(`._ym_btn_next`).onclick = () => {
        makeCalendar(new Date(date.setMonth(date.getMonth() + 1)));
    }

    // 커피 교환하기
    $(document).on('click', '._coffee_change_btn', function (){
        $.ajax({
            url: "/myPage/attendance/changeCoffee",
            type: "GET",
            async: true,
            // 커피 교환 성공하면 새로고침
            success: function (data) {
                if (data === "커피 코드가 발급되었습니다.") {
                alert(data); // "커피 코드가 발급되었습니다."
                location.href = '/myPage/attendance/myAttendance';
            } else {
                alert(data); // "3,000P가 모여야 커피 교환이 가능합니다."
                return false;
            }
            },
            error: function () {
                alert('잠시 후 다시 시도해주세요.', searchEmployeeCode);
                return false;
            }
        })
    })




    
    $(document).on('click', '._barcodeBtn', function (){

        const barcode = $(this).attr('value');

            $.ajax({
                url: "/coffeeBarcodeInput",
                type: "PUT",
                async: true,
                data: {
                    "barcode" : barcode
                },
                success: function (data) {
                    if (data === "처리되었습니다") {
                        $('#attendanceList').load(location.href+' #attendanceList');
                } else {
                    alert(data); // "유효하지 않은 쿠폰입니다"
                    return false;
                }
                },
                error: function () {
                    alert('잠시 후 다시 시도해주세요.');
                    return false;
                }
            })
        })


});

