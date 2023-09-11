package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.dto.ReplyDto;
import com.kupstudio.incompany.service.ReplyService;
import com.kupstudio.incompany.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private static final int COUNT_PER_PAGE = 10;
    private static final String DEFAULT_PAGE_NO = "1";
    private static final int FALSE_NO = -1;
    private final ReplyService replyService;
    private final AuthService authService;

    /**
     * 댓글 리스트 조회 Ajax
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ReplyDto getReplyList(@ModelAttribute(value = "replyDto") ReplyDto replyDto,
                                 @RequestParam(value = "pageNum", defaultValue = DEFAULT_PAGE_NO) int pageNum) {
        return replyService.getReplyDtoList(replyDto, pageNum, COUNT_PER_PAGE);
    }

    /**
     * 답글 리스트 조회 Ajax
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/reReplyList", method = RequestMethod.GET)
    public List<ReplyDto> getReReplyList(@ModelAttribute(value = "replyDto") ReplyDto replyDto) {
        return replyService.getReReplyDtoList(replyDto);
    }

    /**
     * 댓글 내용 조회
     *
     * @param replyDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/content", method = RequestMethod.GET)
    public ReplyDto contentReply(@ModelAttribute("ReplyDto") ReplyDto replyDto) {
        ReplyDto resultReplyDto = replyService.getReply(replyDto);
        return resultReplyDto;
    }

    /**
     * 댓글 등록
     *
     * @param replyDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public int addReply(@ModelAttribute("ReplyDto") ReplyDto replyDto) {
        return replyService.addReply(replyDto);
    }

    /**
     * 댓글 수정
     *
     * @param replyDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public int updateReply(@ModelAttribute("ReplyDto") ReplyDto replyDto) {
        ReplyDto reply = replyService.getReply(replyDto);
        if (!authService.isLoginEmployee(reply.getEmployeeCode())) return FALSE_NO;
        return replyService.updateReply(replyDto);
    }

    /**
     * 댓글 삭제 (상태 변경)
     *
     * @param replyDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/delete", method = RequestMethod.PUT)
    public int deleteReply(@ModelAttribute("ReplyDto") ReplyDto replyDto) {
        ReplyDto reply = replyService.getReply(replyDto);
        if (!authService.isLoginEmployee(reply.getEmployeeCode())) return FALSE_NO;
        return replyService.deleteReply(replyDto);
    }

    /**
     * 게시글의 전체 댓글 개수 조회
     *
     * @param replyDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getBoardReplyCount", method = RequestMethod.GET)
    public int getBoardReplyCount(@ModelAttribute("ReplyDto") ReplyDto replyDto) {
        return replyService.getBoardReplyCount(replyDto);
    }
}