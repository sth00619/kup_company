package com.kupstudio.incompany.controller.note;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.note.NoteBundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/note")
public class NoteController {

    private final EmployeeCacheService employeeCacheService;

    public final NoteBundleService noteBundleService;

    private final String NOTE_FORM_TITLE = "쪽지 보내기";
    @GetMapping("/form")
    public String noteForm(Model model,
                           @RequestParam(value = "sendEmployeeCode", required = false) String sendEmployeeCode,
                           @RequestParam(value = "sendEmployeeName",required = false) String sendEmployeeName
                           ){

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("sendEmployeeCode",sendEmployeeCode);
        model.addAttribute("sendEmployeeName",sendEmployeeName);

        model.addAttribute("title", NOTE_FORM_TITLE);
        model.addAttribute("urlName", NOTE_FORM_TITLE);

        return "note/form";
    }

    @PostMapping("/form")
    @ResponseBody
    public int insertNote(@AuthenticationPrincipal EmployeePrincipal employee,
                              @RequestParam(value = "contents") String contents,
                              @RequestParam(value = "receiveEmployeeList[]", required = false) List<String> receiveEmployeeList){

        String loginEmployeeCode = employee.getUsername();

        return noteBundleService.insertNoteOverallNote(contents,loginEmployeeCode,receiveEmployeeList);
    }

    @GetMapping("/deleteOneMonth")
    @ResponseBody
    public void deleteNoteOverOneMonth(){
        noteBundleService.deleteNoteOverOneMonth();
    }

}
