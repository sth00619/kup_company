package com.kupstudio.incompany.controller.schedule;

import com.kupstudio.incompany.cacheService.department.DepartmentCacheService;
import com.kupstudio.incompany.dto.schedule.teamFullSchedule.TeamDepartmentScheduleDto;
import com.kupstudio.incompany.enumClass.schedule.DefaultCalenderEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.schedule.TeamFullScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class TeamFullScheduleController {

    private final static String TEAM_SCHEDULE = "일자별 팀원 스케줄";
    private final DepartmentCacheService departmentCacheService;
    private final TeamFullScheduleService teamFullScheduleService;

    @GetMapping("/teamFullSchedule")
    public String TeamFullSchedule(@AuthenticationPrincipal EmployeePrincipal employee,
                                   @RequestParam(required = false) String searchDepartmentCode,
                                   @RequestParam(required = false) String searchDate,
                                   Model model) {

        Optional<String> optionalDepartmentCode = Optional.ofNullable(searchDepartmentCode);
        String departmentCode = optionalDepartmentCode.orElse(employee.getDepartmentCode());


        List<TeamDepartmentScheduleDto> teamFullScheduleList =
                teamFullScheduleService.getTeamDepartmentSchedule(departmentCode, searchDate);

        model.addAttribute("teamFullScheduleList", teamFullScheduleList);

        model.addAttribute("departmentList", departmentCacheService.getAllDepartmentList());
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("searchDate", searchDate);
        model.addAttribute("urlName", TEAM_SCHEDULE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", TEAM_SCHEDULE);
        model.addAttribute("defaultCalendar", DefaultCalenderEnum.getAllDefaultCalendarList());

        return "schedule/teamFullSchedule";
    }
}
