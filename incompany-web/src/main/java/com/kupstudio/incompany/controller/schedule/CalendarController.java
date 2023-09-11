package com.kupstudio.incompany.controller.schedule;

import com.kupstudio.incompany.cacheService.company.CompanyCacheService;
import com.kupstudio.incompany.cacheService.department.DepartmentCacheService;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.schedule.CalendarDto;
import com.kupstudio.incompany.service.schedule.CalendarFromOperationService;
import com.kupstudio.incompany.service.schedule.CalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    private final CalendarFromOperationService calendarFromOperationService;
    private final EmployeeCacheService employeeCacheService;
    private final CompanyCacheService companyCacheService;
    private final DepartmentCacheService departmentSelectService;

    @GetMapping("/operation")
    public String operationCalendar(Model model) {
        List<CalendarDto> operationCalendarList = calendarService.getOperationCalendarList();
        model.addAttribute("operationCalendarList", operationCalendarList);
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("allCompany", companyCacheService.getAllCompanyList());
        model.addAttribute("allDepartment", departmentSelectService.getAllDepartmentList());

        return "calendar/operation";
    }

    @ResponseBody
    @PutMapping("/updateCalendar")
    public String updateCalendar(CalendarDto calendarDto) {
        return calendarFromOperationService.updateCalendar(calendarDto);
    }

    @ResponseBody
    @DeleteMapping("/deleteCalendar")
    public void deleteCalendar(int calendarId) {

        calendarService.deleteCalendar(calendarId);

    }

    @ResponseBody
    @PostMapping("/addCalendar")
    public String addCalendar(CalendarDto calendarDto) {
        return calendarFromOperationService.addCalendar(calendarDto);
    }


    @ResponseBody
    @PostMapping("/defaultCalendar")
    public void updateDefaultCalendarForSales() {
        calendarFromOperationService.updateDefaultCalendarForSales();

    }


}
