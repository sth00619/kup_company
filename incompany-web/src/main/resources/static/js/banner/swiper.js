$(document).ready(function(){
    // 슬라이드
    var interleaveOffset = 0;
    var swiperOptions = {
        loop: true,
        speed: 1000,
        parallax: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            progress: function () {
                let swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                let slideProgress = swiper.slides[i].progress;
                let innerOffset = swiper.width * interleaveOffset;
                let innerTranslate = slideProgress * innerOffset;
                swiper.slides[i].querySelector(".slide-inner").style.transform =
                "translate3d(" + innerTranslate + "px, 0, 0)";
                }
            },
            touchStart: function () {
                let swiper = this;
                for (let i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = "";
                }
            },
            setTransition: function (speed) {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = speed + "ms";
                swiper.slides[i].querySelector(".slide-inner").style.transition =
                speed + "ms";
                }
            },
        },
    };

    var swiper = new Swiper(".swiper-container", swiperOptions);

    // 슬라이드가 기능 셋팅 함수
    function autoplay(imgList) {
        // 슬라이드가 여러개라면 자동 실행 및 1번 슬라이드로 이동
        if(imgList.length === 1){
            swiper.autoplay.stop();
            swiper.autoplay.running = false;
        } else {
            swiper.autoplay.running = true;
            swiper.slideTo(1, 0, false);
        }
    }

    // 기본 값 설정 부분
    // 카테고리 리스트
    var btSignList = [];
    btSignList.push(document.getElementById('btSign1'));
    btSignList.push(document.getElementById('btSign2'));
    btSignList.push(document.getElementById('btSign3'));
    btSignList.push(document.getElementById('btSign4'));
    btSignList.push(document.getElementById('btSign5'));
    btSignList.push(document.getElementById('btSign6'));

    // 카테고리가 비어있지 않다면 클래스 제거
    for(let i = 0; i < 6; i++){
        if(document.getElementById('bannerImgList' + (i+1)).value !== "[]"){
            btSignList[i].classList.remove('bt_not_content');
        }
    }

    // 선택된 카테고리 표시 (active)
    for(let i = 0; i < 6; i++){
        if(document.getElementById('bannerImgList' + (i+1)).value !== "[]"){
            btSignList[i].classList.add('active');
            break;
        }
    }
    // model 값 셋팅
    let imgMap = bannerImgMap;
    let count = Object.keys(imgMap).length;
    let imgList = null;

    let defaultSlideArr = [];
    for( let i = 0; i < count; i++){
        imgList = Object.values(imgMap)[i];
        if(imgList.length !== 0){
            for ( let i = 0; i < imgList.length; i++ ){
                let imgFile = imgList[i].imgUrl;
                let urlKey = imgList[i].linkUrl;
                defaultSlideArr.push(`<div class="swiper-slide"><a class="slide-inner slide-bg-image" href="${urlKey}"><img src="${imgFile}" alt="1"></a></div>`);
            }
            break;
        }
    }
    swiper.appendSlide(defaultSlideArr);   // 슬라이드 배열 추가
    swiper.update();                       // 슬라이드 업데이트

    // 슬라이드 기능 셋팅 (함수 호출)
    autoplay(imgList);

    // 카테고리 클릭 이벤트
    $('.bt_text').click(function(e) {
        const clickCategoryNo = e.target.id.charAt( e.target.id.length -1);
        let index = clickCategoryNo - 1;

        // 해당 카테고리가 슬라이드를 가지고 있는지 확인
        if(document.getElementById('bannerImgList' + clickCategoryNo).value === "[]"){
            return false;
        }

        // 선택된 카테고리 셋팅
        for(let i = 0; i < btSignList.length; i++){
            btSignList[i].classList.remove('active');
        }
        btSignList[index].classList.add('active');

        // model 값 셋팅
        let imgMap = bannerImgMap;
        let imgList = Object.values(imgMap)[index];

        // 슬라이더 새로 생성
        swiper.removeAllSlides();   // 모든 슬라이드 삭제
        let slideArr = [];          // 새로운 슬라이드가 들어갈 배열
        for ( let i = 0; i < imgList.length; i++ ){
            let imgFile = imgList[i].imgUrl;
            let urlKey = imgList[i].linkUrl;
            slideArr.push(`<div class="swiper-slide"><a class="slide-inner slide-bg-image" href="${urlKey}"><img src="${imgFile}" alt="1"></a></div>`);
        }
        swiper.appendSlide(slideArr);   // 슬라이드 배열 추가
        swiper.update();                // 슬라이드 업데이트

        // 슬라이드 기능 셋팅 (함수 호출)
        autoplay(imgList);
    });
});

