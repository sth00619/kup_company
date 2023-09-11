// YouTube > IFrame Player API 사용 선언
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// videoId 설정 함수
function getVideoId(n) {
    let list = youtubeList[i];
    let videoId = list["videoId"];
    return videoId;
}

// endSeconds 설정 함수
function getEndSeconds(n) {
    let list = youtubeList[i];
    let endSeconds = list["endSeconds"];
    return endSeconds;
}

// YouTube IFrame Player API
var player
var i = 0;
var videoId = getVideoId(i);
var endSeconds = getEndSeconds(i);

function onYouTubeIframeAPIReady(){
    player = new YT.Player('player', {
        videoId: videoId,
        playerVars: {
            end: endSeconds,
            autoplay: 1,
            mute: 1
        },
        events: {
        'onStateChange': nextVideo
        }
    });
}

// 영상의 상태를 감지하는 함수
var done = false; // 영상이 재생 중인데 체크할 때 사용하는 변수
function nextVideo(event) {
    // 영상이 재생 중일 경우 실행
    if(event.data == YT.PlayerState.PLAYING && !done){
        done = true;
    }
    // 영상이 끝났을 때 실행
    if (event.data == YT.PlayerState.ENDED && done) {
        if( i == (youtubeList.length - 1) ){
            i = 0;

        } else {
            i = i + 1;
        }

        videoId = getVideoId(i);
        endSeconds = getEndSeconds(i);

        player.loadVideoById({
            videoId: videoId,
            endSeconds: endSeconds
        });
        done = false;
    }
}