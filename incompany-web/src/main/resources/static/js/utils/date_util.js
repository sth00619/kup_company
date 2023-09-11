
// 오늘 날짜 yyyy-MM-dd
function getToday1(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

// 오늘 날짜 yyyyMMdd
function getToday2(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + month + day;
}

// 기준월 첫날
function getDt1(dt){
    var newDt = new Date(dt);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 기준월 말일
function getDt2(dt){
    var newDt = new Date(dt);
    newDt.setMonth(newDt.getMonth() + 1);
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 이전달 첫날
function getDt3(dt){
    var newDt = new Date(dt);
    newDt.setMonth(newDt.getMonth() - 1);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 이전달 말일
function getDt4(dt){
    var newDt = new Date(dt);
    newDt.setMonth(newDt.getMonth());
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 다음달 첫날
function getDt5(dt){
    var newDt = new Date(dt);
    newDt.setMonth(newDt.getMonth() + 1);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 다음달 말일
function getDt6(dt){
    var newDt = new Date(dt);
    newDt.setMonth(newDt.getMonth() + 2);
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 몇달 후 말일
function getDt7(s, i){
    var newDt = new Date(s);
    newDt.setMonth(newDt.getMonth() + i);
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 몇달 후 첫날
function getDt8(s, i){
    var newDt = new Date(s);
    newDt.setMonth(newDt.getMonth() + i);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 몇일 전
function getDt9(s, i){
    var newDt = new Date(s);
    newDt.setDate(newDt.getDate() - i);
    return convertDateString(newDt);
}

// 몇일 후
function getDt10(s, i){
    var newDt = new Date(s);
    newDt.setDate(newDt.getDate() + i);
    return convertDateString(newDt);
}

// 작년 첫날
function getDt11(dt){
    var newDt = new Date(dt);
    newDt.setYear(newDt.getFullYear() - 1);
    newDt.setMonth(0);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 작년 말일
function getDt12(dt){
    var newDt = new Date(dt);
    newDt.setYear(newDt.getFullYear());
    newDt.setMonth(0);
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 내년 첫날
function getDt13(dt){
    var newDt = new Date(dt);
    newDt.setYear(newDt.getFullYear() + 1);
    newDt.setMonth(0);
    newDt.setDate(1);
    return convertDateString(newDt);
}

// 내년 말일
function getDt14(dt){
    var newDt = new Date(dt);
    newDt.setYear(newDt.getFullYear() + 2);
    newDt.setMonth(0);
    newDt.setDate(0);
    return convertDateString(newDt);
}

// 연차이 (sdd = startDate, edd = endDate)
function yearDif(sdd, edd){
    const cDay = 24 * 60 * 60 * 1000;
    const cMonth = cDay * 30;
    const cYear = cMonth * 12;
    return getDateDif(sdd, edd, cYear);
}

// 월차이 (sdd = startDate, edd = endDate)
function monthDif(sdd, edd){
    const cDay = 24 * 60 * 60 * 1000;
    const cMonth = cDay * 30;
    return getDateDif(sdd, edd, cMonth);
}

// 일차이 (sdd = startDate, edd = endDate)
function dayDif(sdd, edd){
    const date1 = new Date(sdd);
    const date2 = new Date(edd);

    const diffDate = date1.getTime() - date2.getTime();

    let dateDays = Math.abs(diffDate / (1000 * 3600 * 24));

    // 종료일보다 상환일이 이전일 경우 (만일에 대비하여)
    dateDays = (date1.getTime() > date2.getTime() && dateDays * -1) || dateDays;

    return dateDays;
}

// 위의 날짜 차이에서 호출하는 함수
function getDateDif(sdd, edd, type){
    var ar1 = sdd.split('-');
    var ar2 = edd.split('-');
    var da1 = new Date(ar1[0], ar1[1], ar1[2]);
    var da2 = new Date(ar2[0], ar2[1], ar2[2]);
    var dif = da2 - da1;
    if(sdd && edd){
        return parseInt(dif/type);
    }
}

// yyyy-MM-dd 형식 세팅
function convertDateString(newDt){
    let year = newDt.getFullYear();
    let month = newDt.getMonth()+1;
    let day = newDt.getDate();

    if(month.toString().length === 1){
        month = '0' + month;
    }

    if(day.toString().length === 1){
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;
}