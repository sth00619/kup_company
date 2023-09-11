package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.dto.attendance.AttendanceDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/myPage/attendance")
@RequiredArgsConstructor

public class AttendanceController {

    private final AttendanceService attendanceService;

    private final String ATTENDANCE_TITLE = "출석 체크";

    @ResponseBody
    @RequestMapping(value = "/checkAttendance", method = RequestMethod.GET)
//    @GetMapping(value = "/checkAttendance")
    public boolean checkAttendance() {
        return attendanceService.checkAttendance();
    }

    @RequestMapping(value = "/getAttendance", method = RequestMethod.GET)
    public AttendanceDto getAttendance(String employeeCode) {
        return attendanceService.getAttendance(employeeCode);
    }

    @ResponseBody
    @RequestMapping(value = "/changeCoffee", method = RequestMethod.GET)
    public String changeCoffee() {
        return attendanceService.changeCoffee();
    }

    @ResponseBody
    @RequestMapping(value = "/getCalendar", method = RequestMethod.GET)
    public List<Integer> getCalendar(String inputDate) {
        return attendanceService.getMonthAttendance(inputDate);
    }

    @ResponseBody
    @RequestMapping(value = "/getAttendancePnt", method = RequestMethod.GET)
    public String getAttendancePnt() {
        return attendanceService.getAttendanceCount();
    }

    @ResponseBody
    @RequestMapping(value = "/isAlreadyAttendance", method = RequestMethod.GET)
    public boolean isAlreadyAttendance() {
        return attendanceService.isAlreadyAttendance();
    }

    @RequestMapping(value = "/myAttendance", method = RequestMethod.GET)
    public String myAttendance(Model model, @AuthenticationPrincipal EmployeePrincipal employee) {
        Collection<? extends GrantedAuthority> auths = employee.getAuthorities();

        if (auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.CAFE_COFFEE_BARCODE_INPUT.getMeaning()))) {
            model.addAttribute("employeeAttendanceList", attendanceService.getAttendanceCoffeeBarcodeList());
        }
        model.addAttribute("myAttendanceList", attendanceService.getAttendanceCoffeeBarcodeListByLoginECode());
        model.addAttribute("attendance_pnt", attendanceService.getAttendanceCount());
        model.addAttribute("employeeCode", attendanceService.getEmployeeCode());
        model.addAttribute("urlName", ATTENDANCE_TITLE);
        model.addAttribute("title", ATTENDANCE_TITLE);
        return "myPage/attendance/myAttendance";
    }


}
