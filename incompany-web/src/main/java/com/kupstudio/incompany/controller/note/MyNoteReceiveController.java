package com.kupstudio.incompany.controller.note;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.note.MyNoteReceiveDto;
import com.kupstudio.incompany.dto.note.MyNoteSaveDto;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.note.MyNoteReceiveService;
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
@RequestMapping("/note/receive")
public class MyNoteReceiveController {

    private final String DEFAULT_PAGE_STR = "1";

    private final String NOTE_TITLE = "받은 쪽지";

    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)

    private final MyNoteReceiveService myNoteReceiveService;

    private final NoteBundleService noteBundleService;

    @GetMapping("/list")
    public String noteReceiveList(@AuthenticationPrincipal EmployeePrincipal employee,
                                  @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                  Model model){


        String loginEmployeeCode = employee.getUsername();

        PageInfo<MyNoteReceiveDto> myNoteReceiveList = PageInfo.of(myNoteReceiveService.getMyNoteReceiveList(loginEmployeeCode,pageNum), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        myNoteReceiveList = PageInfoUtil.setPageNation(myNoteReceiveList, pageNum);



        model.addAttribute("myNoteSaveList", myNoteReceiveList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", myNoteReceiveList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);




        return "note/receive/list";
    }

    @GetMapping("/contents")
    public String getMyNoteReceiveContents(
            @AuthenticationPrincipal EmployeePrincipal employee,
            @RequestParam(value = "noteNo") int noteNo,
                                           @RequestParam(value = "pageNum", required = false) Integer pageNum,
                                           Model model){
        String loginEmployeeCode = employee.getUsername();

        MyNoteReceiveDto myNoteReceiveDto = noteBundleService.getMyNoteReceiveAndUpdateReadAt(loginEmployeeCode,noteNo);

        model.addAttribute("n",myNoteReceiveDto);
        model.addAttribute("pageNum",pageNum);
        model.addAttribute("loginEmployeeCode",loginEmployeeCode);
        return "note/receive/contents";
    }

    @PutMapping("/save")
    @ResponseBody
    public void moveToSave(  @AuthenticationPrincipal EmployeePrincipal employee,
                             @RequestParam(value = "noteNo") int noteNo,
                             Model model){

        String loginEmployeeCode = employee.getUsername();

        noteBundleService.moveNoteReceiveToSave(loginEmployeeCode,noteNo);

    }

    @DeleteMapping("/contents")
    @ResponseBody
    public void deleteMyNoteReceiveContents(@AuthenticationPrincipal EmployeePrincipal employee,
                                 @RequestParam(value = "noteNo") int noteNo){
        String loginEmployeeCode = employee.getUsername();

        myNoteReceiveService.deleteMyNoteReceive(noteNo,loginEmployeeCode);
        noteBundleService.deleteNoteContentsAndStat(noteNo);

    }
}
