package com.kupstudio.incompany.controller.schedule;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.schedule.CalendarDto;
import com.kupstudio.incompany.service.schedule.CalendarAppendixService;
import com.kupstudio.incompany.service.schedule.CalendarService;
import io.micrometer.core.instrument.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/calendar")
public class CalendarAppendixController {

    private final CalendarAppendixService calendarAppendixService;

    private final EmployeeCacheService employeeCacheService;


    private final CalendarService calendarService;


    @GetMapping("/appendix")
    public String calendarOtherList(Model model,
                                    @RequestParam(value = "employeeCode", required = false) String employeeCode) {
        if (StringUtils.isNotEmpty(employeeCode)) {
            List<CalendarDto> appendixCalendarList = calendarAppendixService.getCalendarAppendixListByECode(employeeCode);
            model.addAttribute("appendixCalendarList", appendixCalendarList);
            model.addAttribute("employeeCode", employeeCode);
        }

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("allCalendar", calendarService.getAllCalendarList());

        return "calendar/appendix";

    }

    @ResponseBody
    @PostMapping("/appendix")
    public String insertCalendarOther(String employeeCode, Integer calendarId) {
        return calendarAppendixService.addCalendarOther(employeeCode, calendarId);
    }

    @DeleteMapping("/appendix")
    public void deleteCalendarOther(String employeeCode, Integer calendarId) {
        calendarAppendixService.deleteCalendarOther(employeeCode, calendarId);
    }
}
