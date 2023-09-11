package com.kupstudio.incompany.controller.worksheet;

import com.amazonaws.util.CollectionUtils;
import com.kupstudio.incompany.dto.worksheet.CafeScheduleDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.worksheet.CafeScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("/worksheet/cafe")
@RequiredArgsConstructor
public class CafeScheduleController {

    private final AuthService authService;
    private final EmployeeService employeeService;
    private final CafeScheduleService cafeScheduleService;

    private final String CAFE_SCHEDULE_MONTH = "카페스케쥴표";
    private final String ADD_CAFE_SCHEDULE = "카페스케쥴 작성";
    private final String UPDATE_CAFE_SCHEDULE = "카페스케쥴 수정";



    @GetMapping("/updateCafeSchedule")
    public String updateCafeScheduleForm (Model model, RedirectAttributes reAttr,
                                          @RequestParam(value = "cafeScheduleNo") Integer cafeScheduleNo) throws Exception {

        // CAFE_SCHEDULE 권한 체크
        boolean isAuth = authService.hasAuth(AuthNameEnum.CAFE_SCHEDULE);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }

        CafeScheduleDto cafeScheduleInfo = cafeScheduleService.getCafeScheduleDuringMonth(cafeScheduleNo);
        model.addAttribute("cafeScheduleInfo", cafeScheduleInfo);

        String loginEmployeeCode = authService.getEmployeeCode();
        String loginEmployeeName = employeeService.getEmployeeInfoDto(loginEmployeeCode).getEmployeeName();
        model.addAttribute("loginEmployeeName", loginEmployeeName);


        model.addAttribute("urlName", UPDATE_CAFE_SCHEDULE);
        model.addAttribute("title", UPDATE_CAFE_SCHEDULE);

        return "worksheet/cafe/updateCafeSchedule";
    }

    @PostMapping("/updateCafeSchedule")
    public String updateCafeSchedule (@ModelAttribute(value = "CafeScheduleDto") CafeScheduleDto cafeScheduleDto,
                                      @RequestParam(value = "cafeScheduleNo") Integer cafeScheduleNo) {
        cafeScheduleService.updateCafeSchedule(cafeScheduleDto);
        return "redirect:/worksheet/cafe/cafeSchedule?cafeScheduleNo=" + cafeScheduleNo;
    }

    @GetMapping("/cafeSchedule")
    public String getCafeScheduleDuringMonth (Model model, RedirectAttributes reAttr,
                                              @RequestParam(value = "cafeScheduleNo", required = false) Integer cafeScheduleNo) {

        // CAFE_SCHEDULE 권한 체크
        boolean isAuth = authService.hasAuth(AuthNameEnum.CAFE_SCHEDULE);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }


        // 받을 cafeScheduleNo 없을 경우 최근 cafeScheduleNo 가져오기
        if(cafeScheduleNo == null){
           cafeScheduleNo = cafeScheduleService.getCafeScheduleNo();

           if (cafeScheduleNo == null) {

               reAttr.addAttribute("message", "생성된 게시글이 없습니다. 카페스케쥴 입력 페이지로 이동합니다.");
               return "redirect:/worksheet/cafe/addCafeSchedule";
           } else {

               CafeScheduleDto cafeScheduleInfo = cafeScheduleService.getCafeScheduleDuringMonth(cafeScheduleNo);
               model.addAttribute("cafeScheduleInfo", cafeScheduleInfo);
           }
        }

        CafeScheduleDto cafeScheduleInfo = cafeScheduleService.getCafeScheduleDuringMonth(cafeScheduleNo);
        model.addAttribute("cafeScheduleInfo", cafeScheduleInfo);

        model.addAttribute("urlName", CAFE_SCHEDULE_MONTH);
        model.addAttribute("title", CAFE_SCHEDULE_MONTH);

        return "worksheet/cafe/cafeSchedule";
    }


    @GetMapping("/addCafeSchedule")
    public String addCafeScheduleForm (Model model, RedirectAttributes reAttr,
                                       @RequestParam(value = "message", required = false) String message) throws Exception {

        // CAFE_SCHEDULE 권한 체크
        boolean isAuth = authService.hasAuth(AuthNameEnum.CAFE_SCHEDULE);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }

        String loginEmployeeCode = authService.getEmployeeCode(); //로그인한 사원코드
        model.addAttribute("loginEmployeeCode",loginEmployeeCode);
        String employeeName = employeeService.getEmployeeInfoDto(loginEmployeeCode).getEmployeeName(); //로그인한 사원이름
        model.addAttribute("employeeName",employeeName);

        model.addAttribute("urlName", ADD_CAFE_SCHEDULE);
        model.addAttribute("title", ADD_CAFE_SCHEDULE);

        model.addAttribute("message", message);

        return "worksheet/cafe/addCafeSchedule";
    }

    @PostMapping("/addCafeSchedule")
    public String addCafeSchedule (@ModelAttribute(value = "CafeScheduleDto") CafeScheduleDto cafeScheduleDto) {

        cafeScheduleService.addCafeSchedule(cafeScheduleDto);
        return "redirect:/worksheet/cafe/cafeSchedule";
    }

    @DeleteMapping("/deleteCafeSchedule")
    public String deleteCafeSchedule (RedirectAttributes reAttr,
                                      @RequestParam(value = "cafeScheduleNo") Integer cafeScheduleNo) {

        // CAFE_SCHEDULE 권한 체크
        boolean isAuth = authService.hasAuth(AuthNameEnum.CAFE_SCHEDULE);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }

        cafeScheduleService.deleteCafeSchedule(cafeScheduleNo);
        return "redirect:/worksheet/cafe/cafeSchedule";
    }
}
