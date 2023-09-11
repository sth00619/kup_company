/*******************************************************************
 * `reply.js` 는 댓글 및 댓글 페이징의 이벤트들만 모아놓았습니다.          *
 * 모든 함수들은 `/js/reply/reply_function.js` 에서 확인 할 수 있습니다. *
 ******************************************************************/

/**
 * 첫 페이지 로드 시 댓글 영역 세팅
 */
$(document).ready(function () {
    const pageNum = 0;
    setReply(pageNum);
});


/**
 * 댓글 페이징 기능 적용
 */
$(document).on('click', '._reply_firstPage, ._reply_previousPage, ._reply_currentPage, ._reply_nextPage, ._reply_lastPage', function () {

    /*
     *  페이징에 필요한 값 세팅
     *  필수로 세팅 해야함
     */
    const navigateFirstPage = parseInt($('#navigateFirstPage').val());   // 이전 페이지
    const navigateLastPage = parseInt($('#navigateLastPage').val()); // 다음 페이지
    const pages = parseInt($('#pages').val());          // 전체 페이지
    let pageNum = 1;                                    // 페이지 default

    //pageNum 세팅
    if ($(this).hasClass('_reply_currentPage')) {
        pageNum = $(this).text();
    } else if ($(this).hasClass('_reply_firstPage')) {
        pageNum = 1;
    } else if ($(this).hasClass('_reply_previousPage')) {
        if (navigateFirstPage === 1) {
            pageNum = navigateFirstPage
        } else {
            pageNum = (navigateFirstPage - 1);
        }
    } else if ($(this).hasClass('_reply_nextPage')) {
        pageNum = (navigateLastPage + 1);
    } else if ($(this).hasClass('_reply_lastPage')) {
        pageNum = pages;
    }

    // 페이징 후 제일 하단 ( 최신 댓글 ) 포커스
    // jQuery('._reply_page_nation_wrap')[0].scrollIntoView();

    // 댓글 리 세팅
    setReply(pageNum);
});


/**
 * 답글 보기 버튼 이벤트 및 답글 등록 폼
 */
$(document).on('click', '._comment_view, ._reply', function () {
    const this_reply = $(this);
    const reply_group = this_reply.closest('._replyGroup');
    const view_more_img = reply_group.find('._view_more_img');
    const reply_wrap = reply_group.find('._reply_wrap');
    const write_reply = reply_group.find('._writeReply');
    const update_reply = reply_group.find('._updateReplyForm');
    const className = 'view_on';

    // isCheck
    const is_view_img = view_more_img.hasClass(className);                      // 답글 보기 펼침여부
    const is_write_reply = write_reply.hasClass(className);                     // 답글 작성 칸 여부
    const is_comment_view = this_reply.hasClass('_comment_view');               // 현재 클릭한게 답글 보기 버튼인지 여부
    const is_update_reply = update_reply.length > 0;   // 수정 중 인지 여부

    // 클래스 추가 (show)
    const allAddClass = function (className) {
        view_more_img.addClass(className);
        reply_wrap.addClass(className);
        write_reply.addClass(className);
    }

    // 클래스 제거 (hide)
    const allRemoveClass = function (className) {
        view_more_img.removeClass(className);
        reply_wrap.removeClass(className);
        write_reply.removeClass(className);
        update_reply.removeClass(className);
    }

    if (is_view_img) {
        if (is_write_reply) {
            allRemoveClass(className);
        } else {
            if (is_comment_view) {
                allRemoveClass(className);
            } else if (is_update_reply) {
                allAddClass(className);
                update_reply.removeClass(className);
            } else {
                allRemoveClass(className);
            }
        }
    } else {
        allAddClass(className);
    }

    // 최초에 답글 작성 칸이 없다면 추가
    const isWriteForm = reply_group.find('._writeReply').length > 0;
    const isDelete = this_reply.closest('._deleted_group').length > 0;
    if (!isWriteForm && !isDelete) {
        // 답글 작성 칸 추가
        let replyHtml = '';
        replyHtml += '<div class="reply_wrap _writeReply ' + className + '">';
        replyHtml += '<div class="replyTxt _replyText">';
        replyHtml += '<textarea maxlength="300" placeholder="답글 작성하기" class="_content"></textarea>';
        replyHtml += '<div class="confirm_btn">';
        replyHtml += '<button class="con_btn1 _addReply_close" type="button">취소</button>';
        replyHtml += '<button class="con_btn2 _addReply _addReReply" type="button">등록</button>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        reply_group.append(replyHtml);

        // 추가 된 답글 작성 칸 포커스
        on_reply_focus(this_reply);
    }

    // 작성 칸 초기화
    write_reply.find('._content').val('');
});


/**
 * 댓글 수정 폼
 */
$(document).on('click', '._updateReply', function () {
    const thisReply = $(this);
    const currentVal = thisReply.closest('._parentReply').attr('value');

    // 댓글 수정 Ajax 요청
    const request = $.ajax({
        url: '/reply/content',
        method: 'GET',
        data: {
            replyNo: currentVal
        },
        dataType: 'json'
    });

    request.done(function (data) {
        // DB에 엔터("\r\n") 대신 들어간 "<br>"을 다시 엔터("\r\n")로 변경하는 문자열 변환 정규식
        const currentText = data.content.replaceAll(/(<br>|<br\/>|<br \/>)/g, "\r\n");

        const reply_group = thisReply.closest('._replyGroup');
        const is_view_img = reply_group.find('._view_more_img').hasClass('view_on');
        const update_reply = reply_group.find('._updateReplyForm');
        const reply_wrap = reply_group.find('._reply_wrap');
        const write_reply = reply_group.find('._writeReply');

        if (is_view_img) {
            update_reply.removeClass('view_on');
            write_reply.removeClass('view_on');
            reply_wrap.addClass('view_on');
        }

        // 답글 작성 칸 추가
        let replyHtml = '';
        replyHtml += '<div class="comment_box _updateReplyForm">';
        replyHtml += '<div class="replyTxt">';
        replyHtml += '<textarea maxlength="300" placeholder="답글 작성하기" class="_content">' + currentText + '</textarea>';
        replyHtml += '<div class="confirm_btn">';                           // 임시 취소 버튼
        replyHtml += '<button class="con_btn1 _close_update" type="button">취소</button>';       // 임시 취소 버튼
        replyHtml += '<button class="con_btn2 _updateReplyAction" type="button" value="' + currentVal + '">수정</button>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        replyHtml += '</div>';

        thisReply.closest('._parentReply').after(replyHtml);
        thisReply.closest('._parentReply').hide();

        // 추가 된 답글 작성 칸 포커스
        on_reply_focus(thisReply);
    });

    request.fail(function () {
        failAlert();
    });
});


/**
 * 답글 수정 폼
 */
$(document).on('click', '._updateReReply', function () {
    const thisReply = $(this);
    const currentVal = thisReply.closest('._reply_wrap').find('._reReply').attr('value');

    // 댓글 등록 Ajax 요청
    const request = $.ajax({
        url: '/reply/content',
        method: 'GET',
        data: {
            replyNo: currentVal
        },
        dataType: 'json'
    });

    request.done(function (data) {
        const currentText = data.content.replaceAll(/(<br>|<br\/>|<br \/>)/g, "\r\n");

        const reply_group = thisReply.closest('._replyGroup');
        const update_reply = reply_group.find('._updateReplyForm');
        const reply_wrap = reply_group.find('._reply_wrap');
        const write_reply = reply_group.find('._writeReply');

        update_reply.removeClass('view_on');
        write_reply.removeClass('view_on');
        reply_wrap.addClass('view_on');

        // 답글 작성 칸 추가
        let replyHtml = '';
        replyHtml += '<div class="reply_wrap _updateReplyForm view_on">';
        replyHtml += '<div class="replyTxt">';
        replyHtml += '<textarea maxlength="300" placeholder="답글 작성하기" class="_content">' + currentText + '</textarea>';
        replyHtml += '<div class="confirm_btn">';                                    // 임시 취소 버튼
        replyHtml += '<button class="con_btn1 _close_update" type="button">취소</button>';          // 임시 취소 버튼
        replyHtml += '<button class="con_btn2 _updateReplyAction" type="button" value="' + currentVal + '">수정</button>';
        replyHtml += '</div>';
        replyHtml += '</div>';
        replyHtml += '</div>';

        thisReply.closest('._reply_wrap').after(replyHtml);
        thisReply.closest('._reply_wrap').removeClass('view_on');

        // 추가 된 답글 작성 칸 포커스
        on_reply_focus(thisReply);
    });

    request.fail(function () {
        failAlert();
    });
});


/**
 * 댓글 및 답글 등록 처리
 */
$(document).on('click', '._addReply', function () {
    const currentBoardNo = $('#_currentBoardNo').val();       // 게시글 번호
    const currentBoardUrl = $('#_currentBoardUrl').val();    // 어느 게시판
    const parentReplyNo = $(this).closest('._replyGroup').find('._parentReply').attr('value');  // 부모 댓글 코드 - 없을 수 있음
    const isAddReReply = $(this).hasClass('_addReReply');

    // 엔터 적용을 위한 문자열 변환 정규식 (DB 엔 엔터가 '<br>' 로 저장 됨)
    let content = $(this).closest('._replyText').find('._content').val();

    // 빈 값 체크 (공백 제외 한 글자 수 체크)
    if (!isContent(content)) {
        alert('내용을 입력해 주세요.');
        $(this).closest('._replyText').find('._content').focus();
        return;
    }

    // 엔터 <br>로 변환
    content = content.replaceAll(/(\n|\r\n)/g, "<br>");

    // 댓글 등록 Ajax 요청
    const request = $.ajax({
        url: '/reply/add',
        method: 'POST',
        data: {
            currentBoardNo: currentBoardNo,
            parentReplyNo: parentReplyNo,
            currentBoardUrl: currentBoardUrl,
            content: content,
        },
        dataType: 'json'
    });

    request.done(function (data) {
        if (data === 0) {
            failAlert();
            return;
        }

        let pageNum = $('#pageNum').attr('value');
        let pages = $('#pages').attr('value');

        if (pageNum === 0) pageNum = 1;

        if (pageNum === pages) pages++;

        if (!isAddReReply) pageNum = pages;

        setReply(pageNum);

        reloadSetting(parentReplyNo);
    });
    request.fail(function () {
        failAlert();
    });
});


/**
 * 답글 수정 처리
 */
$(document).on('click', '._updateReplyAction', function () {

    const replyNo = $(this).attr('value');
    const parentReplyNo = $(this).closest('._replyGroup').find('._parentReply').attr('value');
    let content = $(this).closest('._updateReplyForm').find('._content').val();

    // 빈 값 체크 (공백 제외 한 글자 수 체크)
    if (!isContent(content)) {
        alert('내용을 입력해 주세요.');
        $(this).closest('._updateReplyForm').find('._content').focus();
        return;
    }

    content = content.replaceAll(/(\n|\r\n)/g, "<br>");

    // 댓글 수정 Ajax 요청
    const request = $.ajax({
        url: '/reply/update',
        method: 'PUT',
        data: {
            replyNo: replyNo,
            content: content,
        },
        dataType: 'json'
    });

    request.done(function (data) {
        if (data === 0) {
            failAlert();
        } else if(data === -1) {
            notAuthAlert();
        }
        let pageNum = $('#pageNum').attr('value');
        if (pageNum === 0) pageNum = 1;
        setReply(pageNum);
        reloadSetting(parentReplyNo);
    });
    request.fail(function () {
        failAlert();
    });
});


/**
 * 댓글 및 답글 삭제 처리
 */
$(document).on('click', '._deleteReply', function () {

    if(!confirm('해당 댓글을 정말 삭제 하시겠습니까?')) return false;

    const currentBoardNo = $('#_currentBoardNo').val();       // 게시글 번호
    const currentBoardUrl = $('#_currentBoardUrl').val();    // 어느 게시판
    let parentReplyNo = $(this).closest('._replyGroup').find('._parentReply').attr('value');  // 부모 댓글 코드 - 없을 수 있음
    const replyNo = $(this).attr('value');

    if (replyNo === parentReplyNo) {
        parentReplyNo = 0;
    }

    // 댓글 삭제 Ajax 요청
    const request = $.ajax({
        url: '/reply/delete',
        method: 'PUT',
        data: {
            replyNo: replyNo,
            parentReplyNo: parentReplyNo,
            currentBoardNo: currentBoardNo,
            currentBoardUrl: currentBoardUrl
        },
        dataType: 'json'
    });

    request.done(function (data) {
        if (data === 0) {
            failAlert();
        } else if(data === -1) {
            notAuthAlert();
        }
        let pageNum = $('#pageNum').attr('value');
        if (pageNum === 0) pageNum = 1;
        setReply(pageNum);
        reloadSetting(parentReplyNo);
    });
    request.fail(function () {
        failAlert();
    });
});


/**
 * 수정 취소 버튼
 */
$(document).on('click', '._close_update', function () {
    // 수정 중이던 입력 폼 제거 및 기존 댓글 복구
    $(this).closest('._updateReplyForm').prev().show();
    $(this).closest('._updateReplyForm').prev().addClass('view_on');
    $(this).closest('._replyGroup').find('._writeReply').addClass('view_on');
    $(this).parents('._updateReplyForm').remove();

    const reply_group = $(this).closest('._replyGroup');
    const is_view_img = reply_group.find('._view_more_img').hasClass('view_on');
    const update_reply = reply_group.find('._updateReplyForm');
    const reply_wrap = reply_group.find('._reply_wrap');
    const write_reply = reply_group.find('._writeReply');

    if (is_view_img) {
        update_reply.removeClass('view_on');
        write_reply.addClass('view_on');
        reply_wrap.addClass('view_on');
    }
});

/**
 * 댓글 등록 취소 버튼
 */
$(document).on('click', '._addReply_close', function () {
    $(this).closest('._writeReply').removeClass('view_on');
});


/**
 * textarea 에 탭키 적용
 */
$(document).on('keydown', 'textarea', function (e) {
    if (e.keyCode === 9) {
        const start = this.selectionStart;
        const end = this.selectionEnd;

        const $this = $(this);
        const value = $this.val();

        $this.val(value.substring(0, start)
            + "\t"
            + value.substring(end));

        this.selectionStart = this.selectionEnd = start + 1;

        e.preventDefault();
    }
});