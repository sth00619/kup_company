/**
 * `reply_function.js` 는 댓글 및 댓글페이징에 필요한 함수들만 모아놓았습니다.
 * 모든 함수호출 이벤트들은 `/js/reply/reply.js` 에서 확인 할 수 있습니다.
 */

/**
 * 댓글 및 페이징 전체 세팅 요청 (controller 역할?)
 * @param pageNum
 */
function setReply(pageNum) {

    const currentBoardNo = $('#_currentBoardNo').val();       // 게시글 번호
    const currentBoardUrl = $('#_currentBoardUrl').val();     // 어느 게시판
    if (pageNum === 0) pageNum = 1;

    // 댓글 리스트 조회 API 호출
    const data = getReplyData(pageNum, currentBoardNo, currentBoardUrl);

    if (data) {
        // 대댓글 리스트 조회 API 호출
        const re_data = getReReplyData(data);

        // 댓글 영역 HTML 세팅
        setReplyAction(data, re_data);
    }

    // 댓글 페이징 영역 세팅
    reply_page_nation(data);

    // 전체 댓글 개수 세팅
    setReplyCount(currentBoardNo, currentBoardUrl);
}



/**
 * 댓글 리스트 조회 API 호출
 * @param pageNum
 * @param currentBoardNo
 * @param currentBoardUrl
 * @returns {*}
 */
function getReplyData(pageNum, currentBoardNo, currentBoardUrl) {
    let data;
    // 댓글 리스트 조회 Ajax 요청
    const request = $.ajax({
        url: '/reply/list',
        method: 'GET',
        async: false,       // 비동기가 아닌 동기식으로 처리 (data 변수에 값을 담기 위함)
        data: {
            pageNum: pageNum,
            currentBoardNo: currentBoardNo,
            currentBoardUrl: currentBoardUrl
        },
        dataType: 'json'
    });

    request.done(function (replyData) {
        data = replyData;
    });

    request.fail(function () {
        failAlert();
    });

    return data;
}


/**
 * 대댓글 리스트 조회 API 호출
 * @param data
 * @returns {*}
 */
function getReReplyData(data) {
    if (!data.replyDtoList) {
        return null;
    }
    const replyDtoList = data.replyDtoList.list;
    let re_data;

    // 대댓글이 있는 댓글의 댓글 코드 조합
    let replyNoArray = [];
    $.each(replyDtoList, function (replyDtoListIndex, replyDtoListItem) {
        if (replyDtoListItem.cntReReply > 0) replyNoArray.push(replyDtoListItem.replyNo.toString());
    });

    if (!replyNoArray.length) return;

    // 답글 리스트 조회 Ajax 요청
    const request = $.ajax({
        url: '/reply/reReplyList',
        method: 'GET',
        async: false,       // 비동기가 아닌 동기식으로 처리 (data 변수에 값을 담기 위함)
        data: {
            replyNoArray: replyNoArray
        },
        dataType: 'json'
    });

    request.done(function (reData) {
        re_data = reData;
    });

    return re_data;
}


/**
 * 댓글 영역 세팅 실행 함수 (service 역할)
 * @param data
 * @param re_data
 */
function setReplyAction(data, re_data) {
    /*
     깜빡임 최소화 하도록 기존 생성된 _replyGroup 에 _removeWrap 클래스 추가
     _removeWrap 클래스가 있으면 모든 작업 후 삭제 됨
     */
    $('._countReply, ._replyGroup').addClass('_removeWrap');

    // API 호출하여 반환받은 댓글 리스트
    const replyDtoList = data.replyDtoList.list;

    // API 호출하여 반환받은 대댓글 리스트
    const reReplyDtoList = re_data;

    // 댓글과 대댓글을 순서에 맞게 재조합
    const replyList = [];
    $.each(replyDtoList, function (replyDtoListIndex, replyDtoListItem) {
        replyList.push(replyDtoListItem);
        $.each(reReplyDtoList, function (reReplyDtoListIndex, reReplyDtoListItem) {
            if (replyDtoListItem.replyNo === reReplyDtoListItem.parentReplyNo) {
                replyList.push(reReplyDtoListItem);
            }
        });
    });

    $.each(replyList, function (index, item) {

        // 삭제 된 댓글이면 "삭제된 댓글입니다." 노출
        const isDelete = item.isDelete;
        if (isDelete === 'Y') {
            getDeleteReplyHtml(item);
            return true;
        }

        // HTML 삽입
        addReplyHtml(item);
    });

    // 깜빡임 최소화 하기 위함
    $('._removeWrap').remove();
    $('._content').val('');
}


/**
 * 댓글 리스트 html 삽입
 * @param item
 */
function addReplyHtml(item) {

    const replyNo = item.replyNo;               // 댓글 코드
    const parentReplyNo = item.parentReplyNo;   // 부모 코드
    const content = item.content;               // 댓글 내용
    const createDate = item.createDate;         // 작성 일자
    const createDateTime = item.createDateTime; // 작성 시간
    const reReplyCount = item.cntReReply;       // 답글 개수
    const employeeName = item.employeeName;     // 작성자 명
    const employeeCode = item.employeeCode;     // 작성자 코드
    const isMyReply = item.isMyReply;           // 본인 댓글 유무

    let replyHtml = '';
    // 부모코드 === 0 : 현재 댓글이 부모 댓글
    if (parentReplyNo === 0) {
        replyHtml += '<div class="write_visual _replyGroup">';
        replyHtml += '<div class="comment_write _parentReply" value="' + replyNo + '">';
        replyHtml += '<div class="comment_my"><img src="/images/img/quick_my.png"></div>';
        replyHtml += '<div class="comment_txt">';
        replyHtml += '<div class="comment_name">' + employeeName;
        replyHtml += '<span>' + createDate + '</span> <span>' + createDateTime + '</span></div>';
        replyHtml += '<p class="_content">' + content + '</p>';
        replyHtml += '</div>';
        replyHtml += '<div class="reply_close">';
        replyHtml += '<span class="_reply">답글</span>';

        // 본인만 수정, 삭제 가능
        if(isMyReply) {
            replyHtml += '<span class="_updateReply">수정</span>';
            replyHtml += '<span class="_deleteReply" value="' + replyNo + '">삭제</span>';
        }

        replyHtml += '</div>';
        replyHtml += '</div>';
        if (reReplyCount) {
            replyHtml += '<div class="comment_view _comment_view">';
            replyHtml += '<img src="/images/img/view_more.png" class="_view_more_img">';
            if(reReplyCount > 1){
                replyHtml += '<span>답글 ' + reReplyCount + '개보기</span>';
            } else {
                replyHtml += '<span>답글 보기</span>';
            }
            replyHtml += '</div>';
        }
        replyHtml += '</div>';
        $('._reloadWrap').append(replyHtml);
    } else {
        // 부모코드 !== 0 : 현재 댓글이 대댓글
        replyHtml += '<div class="reply_wrap _reply_wrap">';
        replyHtml += '<div class="comment_write reply _reReply" value="' + replyNo + '">';
        replyHtml += '<div class="comment_my"><img src="/images/img/quick_my.png"></div>';
        replyHtml += '<div class="comment_txt">';
        replyHtml += '<div class="comment_name">' + employeeName;
        replyHtml += '<span>' + createDate + '</span> <span>' + createDateTime + '</span></div>';
        replyHtml += '<p class="_content">' + content + '</p>';
        replyHtml += '</div>';
        replyHtml += '<div class="reply_close">';

        // 본인만 수정, 삭제 가능
        if(isMyReply) {
            replyHtml += '<span class="_updateReReply">수정</span>';
            replyHtml += '<span class="_deleteReply" value="' + replyNo + '">삭제</span>';
        }

        replyHtml += '</div>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        $('._replyGroup').last().append(replyHtml);
    }
}


/**
 * 삭제된 댓글
 * @param item
 */
function getDeleteReplyHtml(item) {

    const replyNo = item.replyNo;               // 댓글 코드
    const parentReplyNo = item.parentReplyNo;
    const reReplyCount = item.cntReReply;

    let replyHtml = '';
    if (parentReplyNo === 0) {
        replyHtml += '<div class="write_visual _replyGroup _deleted_group">';
        replyHtml += '<div class="comment_write _deleted_reply" value="' + replyNo + '">';
        replyHtml += '<p>삭제된 댓글 입니다.</p>';
        replyHtml += '</div>';
        if (reReplyCount) {
            replyHtml += '<div class="comment_view _comment_view">';
            replyHtml += '<img src="/images/img/view_more.png" class="_view_more_img">';
            replyHtml += '<span>답글 ' + reReplyCount + '개보기</span>';
            replyHtml += '</div>';
        }
        replyHtml += '</div>';
        $('._reloadWrap').append(replyHtml);
    } else {
        replyHtml += '<div class="reply_wrap _reply_wrap">';
        replyHtml += '<div class="comment_write _deleted_reply" value="' + replyNo + '">';
        replyHtml += '<p>삭제된 댓글 입니다.</p>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        $('._replyGroup').last().append(replyHtml);
    }
}

/**
 * 댓글 개수 API 조회하여 댓글 개수 영역 세팅
 * @param currentBoardNo
 * @param currentBoardUrl
 */
function setReplyCount(currentBoardNo, currentBoardUrl) {
    // 답글 리스트 조회 Ajax 요청
    const request = $.ajax({
        url: '/reply/getBoardReplyCount',
        method: 'GET',
        data: {
            currentBoardNo: currentBoardNo,
            currentBoardUrl: currentBoardUrl
        },
        dataType: 'json'
    });

    request.done(function (data) {
        let countReply = data;

        // 댓글 개수 노출
        $('#_replyWrap').prepend('<div class="comment_title _countReply">댓글' + countReply + '개</div>');

        // 댓글이 없을 경우 "작성 된 댓글이 없습니다." 노출
        let replyHtml = '';
        if (countReply === 0) {
            replyHtml += '<div class="write_visual _replyGroup">';
            replyHtml += '<div class="comment_write _deleted_reply">';
            replyHtml += '<p>작성 된 댓글이 없습니다.</p>';
            replyHtml += '</div>';
            replyHtml += '</div>';
            $('._reloadWrap').append(replyHtml);
        }
    });
}

/**
 * 페이징 영역 세팅
 * @param data
 */
function reply_page_nation(data) {
    const replyPageInfo = data.replyDtoList;                    // 페이징 적용되어있는 리스트
    const pageNum = replyPageInfo.pageNum;                      // 현재 페이지 번호
    const pages = replyPageInfo.pages;                          // 전체 페이지 수
    const total = replyPageInfo.total;                          // 전체 댓글 수 (삭제 댓글 포함)
    const navigateFirstPage = replyPageInfo.navigateFirstPage;  // 페이징 바에서 첫번쨰 페이지 번호
    const navigateLastPage = replyPageInfo.navigateLastPage;    // 페이징 바에서 마지막 페이지 번호


    // hidden 으로 값을 세팅하여 페이징 이동 시 사용 됩니다.
    let hiddenPage = "";
    hiddenPage += '<input type="hidden" id="navigateFirstPage" value="' + navigateFirstPage + '">';
    hiddenPage += '<input type="hidden" id="navigateLastPage" value="' + navigateLastPage + '">';
    hiddenPage += '<input type="hidden" id="pages" value="' + pages + '">';
    hiddenPage += '<input type="hidden" id="total" value="' + total + '">';
    $('#pageNum').val(pageNum);     // 기존의 히든 input 에 재 페이지 번호 세팅

    // 이전 페이지 또는 다음 페이지가 있는 경우 클릭 가능한 링크가 표시
    let prePage = "";
    if ((navigateFirstPage - 1) !== 0) {
        prePage += '<div class="s_double_prev_btn s_pn_btn _reply_firstPage"><span>처음</span></div>';
        prePage += '<div class="s_prev_btn s_pn_btn _reply_previousPage"><span>이전</span></div>';
    }

    let nextPage = "";
    if ((navigateLastPage % 10) === 0) {
        nextPage += '<div class="s_next_btn s_pn_btn _reply_nextPage"><span>다음</span></div>';
        nextPage += '<div class="s_double_next_btn s_pn_btn _reply_lastPage"><span>마지막</span></div>';
    }

    // 탐색 페이지 영역 링크 표시 ex : [1] [2] --- [9] [10]
    let currentPage = "";
    currentPage += "<ul>";
    for (let page = navigateFirstPage; page <= navigateLastPage; page++) {
        if (page === pageNum) {
            currentPage += "<li class='s_on _reply_currentPage'>" + page + "</li>"
        } else {
            currentPage += "<li class='_reply_currentPage'>" + page + "</li>"
        }
    }
    currentPage += "</ul>";

    // 전체 페이징 코드 조합
    let pageNationWrap = hiddenPage + prePage + currentPage + nextPage;

    // html 페이징 영역에 삽입
    $("._reply_page_nation_wrap").html(pageNationWrap);
}

/**
 * 작성 칸 포커스
 * @param thisReply
 */
function on_reply_focus(thisReply) {
    thisReply.closest('._replyGroup').find('._content').focus();
}

/**
 * 처리 실패 시 알림
 */
function failAlert() {
    alert('문제가 발생하였습니다.\n담당자에게 문의해 주세요.');
}

/**
 * 권한 없음 알림
 */
function notAuthAlert() {
    alert('권한이 없습니다.\n본인의 댓글만 수정, 삭제 할 수 있습니다.');
}

/**
 * 등록, 수정, 삭제 처리 후 댓글영역 리로드 시 해당 댓글 펼침
 * @param parentReplyNo
 */
function reloadSetting(parentReplyNo) {
    $('._replyGroup').each(function () {
        const thisValue = $(this).find('._parentReply').attr('value');
        if (typeof thisValue != 'undefined' && thisValue !== '' && thisValue != null) {
            if (thisValue === parentReplyNo) {

                $(this).find('._view_more_img').addClass('view_on');
                $(this).find('._reply_wrap').addClass('view_on');

                // 답글 작성 칸 추가
                let replyHtml = '';
                replyHtml += '<div class="reply_wrap _writeReply view_on">';
                replyHtml += '<div class="replyTxt _replyText">';
                replyHtml += '<textarea maxlength="300" placeholder="답글 작성하기" class="_content"></textarea>';
                replyHtml += '<div class="confirm_btn">';
                replyHtml += '<button class="con_btn1 _addReply_close" type="button">취소</button>';
                replyHtml += '<button class="con_btn2 _addReply _addReReply" type="button">등록</button>';
                replyHtml += '</div>';
                replyHtml += '</div>';
                replyHtml += '</div>';

                $(this).append(replyHtml);

                // 추가 된 답글 작성 칸 포커스
                on_reply_focus($(this));

                return false;
            }
        }
    });
}

/**
 * 빈 값 체크 (공백 제외 한 글자 수 체크)
 * @param content
 * @returns {boolean}
 */
function isContent(content) {
    const reDex = /\s/ig;
    return content.toString().replace(reDex, "").length > 0;
}