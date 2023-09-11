package com.kupstudio.incompany.controller.note;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.note.MyNoteReceiveDto;
import com.kupstudio.incompany.dto.note.MyNoteSendDto;
import com.kupstudio.incompany.dto.note.MyNoteToMeDto;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.note.MyNoteSendService;
import com.kupstudio.incompany.service.note.MyNoteToMeService;
import com.kupstudio.incompany.service.note.NoteBundleService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Delete;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/note/send")
public class MyNoteSendController {

    private final String DEFAULT_PAGE_STR = "1";

    private final String NOTE_TITLE = "보낸 쪽지";

    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final MyNoteSendService myNoteSendService;

    private final NoteBundleService noteBundleService;

    @GetMapping("/list")
    public String getNoteSendList(@AuthenticationPrincipal EmployeePrincipal employee,
                                  @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                  Model model) {

        String loginEmployeeCode = employee.getUsername();


        PageInfo<MyNoteSendDto> myNoteSendList = PageInfo.of(myNoteSendService.getMyNoteSendList(loginEmployeeCode, pageNum), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        myNoteSendList = PageInfoUtil.setPageNation(myNoteSendList, pageNum);


        model.addAttribute("myNoteSendList", myNoteSendList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", myNoteSendList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);

        return "note/send/list";
    }

    @GetMapping("/contents")
    public String getMyNoteSendContents(
            @AuthenticationPrincipal EmployeePrincipal employee,
            @RequestParam(value = "noteNo") int noteNo,
            @RequestParam(value = "pageNum", required = false) Integer pageNum,
            Model model) {
        String loginEmployeeCode = employee.getUsername();

        MyNoteSendDto myNoteSendDto = myNoteSendService.getMyNoteSend(noteNo);

        model.addAttribute("n", myNoteSendDto);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);

        return "note/send/contents";
    }

    @PutMapping("/save")
    @ResponseBody
    public void moveToSave(@AuthenticationPrincipal EmployeePrincipal employee,
                           @RequestParam(value = "noteNo") int noteNo,
                           Model model) {

        String loginEmployeeCode = employee.getUsername();

        noteBundleService.moveNoteSendToSave(loginEmployeeCode, noteNo);

    }

    @DeleteMapping("/contents")
    @ResponseBody
    public void deleteMyNoteReceiveContents(@RequestParam(value = "noteNo") int noteNo) {

        myNoteSendService.deleteMyNoteSend(noteNo);
        noteBundleService.deleteNoteContentsAndStat(noteNo);
    }

    @DeleteMapping("/cancel")
    @ResponseBody
    public String cancelMessageSending(@RequestParam(value = "noteNo")int noteNo) {

       return noteBundleService.cancelNote(noteNo);
    }
}
