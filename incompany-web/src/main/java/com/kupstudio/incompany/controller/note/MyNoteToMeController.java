package com.kupstudio.incompany.controller.note;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.note.MyNoteToMeDto;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.note.MyNoteToMeService;
import com.kupstudio.incompany.service.note.NoteBundleService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/note/toMe")
public class MyNoteToMeController {

    private final String DEFAULT_PAGE_STR = "1";

    private final String NOTE_TITLE = "내게쓴쪽지";

    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)

    private final MyNoteToMeService myNoteToMeService;

    private final NoteBundleService noteBundleService;

    @GetMapping("/list")
    public String getToMeList(@AuthenticationPrincipal EmployeePrincipal employee,
                              @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                              Model model) {

        String loginEmployeeCode = employee.getUsername();


        PageInfo<MyNoteToMeDto> myNoteToMeList = PageInfo.of(myNoteToMeService.getMyToMeList(loginEmployeeCode, pageNum), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        myNoteToMeList = PageInfoUtil.setPageNation(myNoteToMeList, pageNum);


        model.addAttribute("myNoteToMeList", myNoteToMeList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", myNoteToMeList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);

        return "note/toMe/list";
    }

    @PostMapping("")
    @ResponseBody
    public int insertMyNoteToMe(String contents,
                                @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();


        return noteBundleService.insertNoteAndToMe(contents, loginEmployeeCode);
    }


    @GetMapping("/contents")
    public String getMyNoteToMeContents(
            @AuthenticationPrincipal EmployeePrincipal employee,
            @RequestParam(value = "noteNo") int noteNo,
            @RequestParam(value = "pageNum", required = false) Integer pageNum,
            Model model) {
        String loginEmployeeCode = employee.getUsername();

        MyNoteToMeDto myNoteToMeDto = myNoteToMeService.getMyToMe(noteNo);

        model.addAttribute("n", myNoteToMeDto);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);

        return "note/toMe/contents";
    }

    @DeleteMapping("/contents")
    @ResponseBody
    public void deleteMyNoteReceiveContents(@RequestParam(value = "noteNo") int noteNo){

        noteBundleService.deleteNoteByToMe(noteNo);
    }
}
