package com.kupstudio.incompany.controller.schedule;

import com.kupstudio.incompany.cacheService.schedule.GoogleCalendarCacheService;
import com.kupstudio.incompany.dto.CompanyChartDto;
import com.kupstudio.incompany.dto.schedule.CalendarDto;
import com.kupstudio.incompany.dto.schedule.ScheduleDto;
import com.kupstudio.incompany.enumClass.schedule.DefaultCalenderEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.schedule.CalendarFromScheduleService;
import com.kupstudio.incompany.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {


    private final String POTENTIAL_USER_DETAIL_TITLE = "스케줄 확인";

    private final ScheduleService scheduleService;

    private final CalendarFromScheduleService calendarService;

    private final CompanyChartService companyChartService;

    private final DepartmentSelectService departmentSelectService;

    private final GoogleCalendarCacheService googleCalendarCacheService;


    @SneakyThrows
    @GetMapping("/schedule")
    public String schedule(Model model, @RequestParam(required = false) String employeeCode,
                           @RequestParam(value = "departmentCode", required = false, defaultValue = "D") String departmentCode,
                           @AuthenticationPrincipal EmployeePrincipal employee
    ) {
        String employeeLoginCode = employee.getUsername();
        String companyCode = employee.getCompanyCode();
        List<ScheduleDto> todayScheduleList;


        if (employeeCode != null) {

            model.addAttribute("employeeCode", employeeCode);
        } else {
            employeeCode = employeeLoginCode;
            model.addAttribute("employeeCode", employeeLoginCode);
        }


        todayScheduleList = scheduleService.todayScheduleList(employeeCode);
        model.addAttribute("todayScheduleList", todayScheduleList);


        List<CompanyChartDto> getDepartmentOneDepth = companyChartService.getDepartmentOneDepth(companyCode, "D");

        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        List<String> defaultCalendarList = DefaultCalenderEnum.getAllDefaultCalendarList();
        List<String> counselingDefaultCalendarList = DefaultCalenderEnum.getCounselingDefaultCalendarList();

        model.addAttribute("getDepartmentOneDepth", getDepartmentOneDepth);
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);

        model.addAttribute("companyCode", companyCode);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        model.addAttribute("defaultCalendarList", defaultCalendarList);
        model.addAttribute("counselingDefaultCalendarList", counselingDefaultCalendarList);

        model.addAttribute("urlName", POTENTIAL_USER_DETAIL_TITLE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", POTENTIAL_USER_DETAIL_TITLE);      // 타이틀 명
        return "schedule/schedule";
    }

    @ResponseBody
    @GetMapping("/getScheduleItem")
    public List<CalendarDto> calender(String employeeCode) throws Exception {
        List<CalendarDto> calendar = calendarService.getCalendarList(employeeCode);

        return calendar;
    }


    @ResponseBody
    @GetMapping("/getSchedule")
    public Set<ScheduleDto> scheduleList(String employeeCode) throws Exception {

        Set<ScheduleDto> scheduleList = scheduleService.getScheduleList(employeeCode);

        return scheduleList;
    }

    @ResponseBody
    @PostMapping("/addSchedule")
    public ScheduleDto addSchedule(@RequestBody Map<String, Object> param) {

        return scheduleService.addSchedule(param);
    }

    @ResponseBody
    @PutMapping("/updateSchedule")
    public Integer updateSchedule(@RequestBody Map<String, Object> param) {
        Integer detailNo = scheduleService.updateSchedule(param);
        return detailNo;
    }


    @ResponseBody
    @DeleteMapping("/deleteSchedule")
    public void deleteSchedule(@RequestParam Integer id) {
        scheduleService.deleteSchedule(id);
    }

    @ResponseBody
    @PostMapping("/editCalendar")
    public void editCalendar(@RequestBody Map<String, Object> param) {

        calendarService.editCalendar(param);

    }

    @ResponseBody
    @GetMapping("/countSchedule")
    public int countSchedule(int calendarId) {

        return scheduleService.countSchedule(calendarId);

    }

    @ResponseBody
    @GetMapping("/koreaHoliday")
    public Map<String, String> koreaHoliday() {

        return googleCalendarCacheService.getKoreaHoliday();

    }


}
