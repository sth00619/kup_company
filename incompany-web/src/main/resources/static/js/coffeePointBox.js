$(document).ready(function () {
        $.ajax({
            type: "GET",
            url: '/myPage/attendance/getAttendancePnt',
            success: function (data) {
                document.querySelector(`._point_data`).innerText = data + " P";
                return false;
            },
            error: function () {
                return false;
            }
        })
        $.ajax({
            type: "GET",
            url: '/myPage/attendance/isAlreadyAttendance',
            success: function (data) {
                if(data){
                    document.querySelector(`._attendance_btn`).classList.add("active");
                    document.querySelector(`._attendance_btn`).disabled = true;
                }
                return false;
            },
            error: function () {
                return false;
            }
        })
        $(document).on('click', '._attendance_btn', function (){
            $.ajax({
                url: "/myPage/attendance/checkAttendance",
                type: "GET",
                // 출석 체크 성공하면 새로고침
                success: function (data) {
                    if (data) {
                    alert("100P 적립되었습니다");
                    location.reload();
                } else {
                    alert("오늘 이미 출석 체크 했습니다");
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
