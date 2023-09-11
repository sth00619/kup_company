package com.kupstudio.incompany.controller.writingFormat;

import com.kupstudio.incompany.dto.document.WriteFormatDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.BoardTypeEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.document.WorkLogService;
import com.kupstudio.incompany.service.writingFormat.WritingFormatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/writingFormat")
public class WritingFormatController {
    private static final String WRITING_FORMAT_NAME = "글쓰기양식";

    @Autowired
    WritingFormatService writingFormatService;
    @Autowired
    AuthService authService;
    @Autowired
    WorkLogService workLogService;

    @PostMapping("/addWritingFormat")
    public String addWritingFormat(WriteFormatDto writeFormatDto) {
        writingFormatService.addWritingFormat(writeFormatDto);
        return "redirect:/writingFormat/addWritingFormat";
    }

    @GetMapping("/addWritingFormat")
    public String addWritingFormatForm(Model model, RedirectAttributes reAttr,
                                       @RequestParam(value = "boardType", required = false) Integer boardType) {
        boolean isAuth = authService.hasAuth(AuthNameEnum.WRITING_FORMAT_BUTTON);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }
        // 전체 boardType 리스트 조회
        List<BoardTypeEnum> boardTypeEnumList = BoardTypeEnum.getAllBoardTypeEnum();
        model.addAttribute("boardTypeEnumList", boardTypeEnumList);
        model.addAttribute("boardType", boardType);

        model.addAttribute("urlName", WRITING_FORMAT_NAME);
        model.addAttribute("title", WRITING_FORMAT_NAME);
        return "writingFormat/addWritingFormat";
    }

    /**
     * 해당 boardType 별로 저장된 글쓰기 양식 불러오기 Ajax
     */
    @RequestMapping(value = "callWritingFormat", method = RequestMethod.GET)
    @ResponseBody
    public List<WriteFormatDto> callWritingFormat(@RequestParam(value = "boardType") int boardType) {
        // 양식 list
        return workLogService.getWriteFormList(boardType);
    }

    /**
     * 해당 글쓰기 양식에 따른 contents 가져오기 Ajax
     *
     * @param formatNo
     * @return
     */
    @RequestMapping(value = "getContentsOfWritingFormat", method = RequestMethod.GET)
    @ResponseBody
    public WriteFormatDto getContentsOfWritingFormat(@RequestParam(value = "formatNo") Integer formatNo) {
        return workLogService.getContentsOfWritingFormat(formatNo);
    }

    /**
     * 양식 제목 클릭 시 삭제 Ajax
     *
     * @param formatNo
     * @return
     */
    @RequestMapping(value = "deleteWritingFormatOfFormatNo", method = RequestMethod.GET)
    @ResponseBody
    public int deleteWritingFormatOfFormatNo(@RequestParam(value = "formatNo") Integer formatNo) {
        return workLogService.deleteWritingFormatOfFormatNo(formatNo);
    }
}