package com.kupstudio.incompany.controller.note;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.note.MyNoteSaveDto;
import com.kupstudio.incompany.dto.note.MyNoteToMeDto;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.note.MyNoteSaveService;
import com.kupstudio.incompany.service.note.MyNoteToMeService;
import com.kupstudio.incompany.service.note.NoteBundleService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/note/save")
public class MyNoteSaveController {

    private final MyNoteSaveService myNoteSaveService;

    private final NoteBundleService noteBundleService;



    private final String DEFAULT_PAGE_STR = "1";

    private final String NOTE_TITLE = "쪽지 보관함";

    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)


    @GetMapping("/list")
    public String getNoteSaveList(@AuthenticationPrincipal EmployeePrincipal employee,
                              @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                              Model model){

        String loginEmployeeCode = employee.getUsername();

        PageInfo<MyNoteSaveDto> myNoteSaveList = PageInfo.of(myNoteSaveService.getMyNoteSaveList(loginEmployeeCode,pageNum), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        myNoteSaveList = PageInfoUtil.setPageNation(myNoteSaveList, pageNum);



        model.addAttribute("myNoteSaveList", myNoteSaveList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", myNoteSaveList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("title", NOTE_TITLE);
        model.addAttribute("urlName", NOTE_TITLE);


        return "note/save/list";
    }

    @GetMapping("/contents")
    public String getNoteSaveContents(@AuthenticationPrincipal EmployeePrincipal employee,
                                      @RequestParam(value = "noteNo") int noteNo,
                                      Model model){
        String loginEmployeeCode = employee.getUsername();

        MyNoteSaveDto myNoteSaveDto = myNoteSaveService.getMyNoteSave(noteNo,loginEmployeeCode);

         model.addAttribute("n", myNoteSaveDto);
         model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        return "note/save/contents";
    }


    @DeleteMapping("/contents")
    @ResponseBody
    public void deleteNoteSaveContents(@AuthenticationPrincipal EmployeePrincipal employee,
                                          @RequestParam(value = "noteNo") int noteNo){
        String loginEmployeeCode = employee.getUsername();

        myNoteSaveService.deleteMyNoteSave(loginEmployeeCode,noteNo);
        noteBundleService.deleteNoteContentsAndStat(noteNo);

    }

}
