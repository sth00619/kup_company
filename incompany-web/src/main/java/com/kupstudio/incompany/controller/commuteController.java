package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.dto.commute.CommuteDto;
import com.kupstudio.incompany.enumClass.commute.CommuteCategoryEnum;
import com.kupstudio.incompany.enumClass.commute.CommuteGetOffWorkEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.commute.CommuteService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/commute")
public class commuteController {
    private static final String CALENDAR_CONTENT_NAME = "병특 출퇴근 달력";
    private static final String COMMUTE_CONTENT_NAME = "병특 출퇴근 리스트";
    private static final String KUP_STUDIO = "D20";
    // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private final Integer RESIGN_NUM = 0;

    @Autowired
    CommuteService commuteService;
    @Autowired
    AuthService authService;
    @Autowired
    private DepartmentSelectService departmentSelectService;

    @GetMapping("/calendar")
    public String calendar(Model model) {
        //commuteCategory 가져오기
        List<CommuteCategoryEnum> commuteCategoryList = CommuteCategoryEnum.getAllCategoryEnum();
        model.addAttribute("commuteCategoryList", commuteCategoryList);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("urlName", CALENDAR_CONTENT_NAME);
        model.addAttribute("title", CALENDAR_CONTENT_NAME);
        return "commute/calendar";
    }

    @GetMapping("/commute")
    public String commute(Model model,
                          @RequestParam(value = "employeeCode", required = false) String employeeCode,
                          @RequestParam(value = "categoryNo", required = false) String categoryNo,
                          @RequestParam(value = "startDate", required = false) String startDate,
                          @RequestParam(value = "endDate", required = false) String endDate,
                          @AuthenticationPrincipal EmployeePrincipal employee) throws Exception {
        if (StringUtils.isEmpty(startDate) && StringUtils.isEmpty(endDate)) {
            LocalDate date = LocalDate.now();
            //해당 월의 첫째 날
            startDate = String.valueOf(date.withDayOfMonth(1));
            //해당 월의 마지막 날
            endDate = String.valueOf(date.withDayOfMonth(date.lengthOfMonth()));
        }

        // 병특 출퇴근일지 조회
        List<CommuteDto> commuteList = commuteService.getCommuteList(startDate, endDate, categoryNo, employeeCode);
        model.addAttribute("commuteList", commuteList);

        // KUP STUDIO 사원만 표시되도록 설정
        String departmentCode = KUP_STUDIO;

        // 담당자 리스트 select box 세팅 (근무자)
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);

        //commuteCategory 리스트 select box 셋팅
        List<CommuteCategoryEnum> commuteCategoryList = CommuteCategoryEnum.getAllCategoryEnum();
        model.addAttribute("commuteCategoryList", commuteCategoryList);

        // 선택된 작성자 셋팅
        model.addAttribute("employeeCode", employeeCode);
        // 선택된 카테고리 셋팅
        model.addAttribute("categoryNo", categoryNo);
        // 시작날짜 종료날짜 셋팅
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        model.addAttribute("urlName", COMMUTE_CONTENT_NAME);
        model.addAttribute("title", COMMUTE_CONTENT_NAME);

        return "commute/commute";
    }

    @ResponseBody
    @RequestMapping(value = "/getCommuteCalendarList", method = RequestMethod.GET)
    public List<CommuteDto> getCommuteList() {
        List<CommuteDto> commuteList = commuteService.getCommuteCalendarList();

        return commuteList;
    }

    // 출근 버튼 클릭 시
    @ResponseBody
    @RequestMapping(value = "/goToWork", method = RequestMethod.POST)
    public boolean goToWork(@RequestParam(value = "categoryNo") int categoryNo,
                            @RequestParam(value = "title") String title,
                            @RequestParam(value = "startTime") String startTime,
                            @RequestParam(value = "endTime") String endTime) {
        // 로그인 한 사원 코드
        String employeeCode = authService.getEmployeeCode();
        List<CommuteDto> commute = commuteService.getCommute(employeeCode);

        // 오늘 출근 버튼을 누른 적이 없으면 없을 경우에 출근 시간 저장
        if (CollectionUtils.isEmpty(commute)) {
            commuteService.addCommute(employeeCode, title, categoryNo, startTime, endTime);
            return true;
        } else {
            return false;
        }
    }

    // 퇴근 버튼 클릭 시
    @ResponseBody
    @RequestMapping(value = "/getOffWork", method = RequestMethod.POST)
    public Map<String, Object> getCommute(@RequestParam(value = "endTime") String endTime) {
        String employeeCode = authService.getEmployeeCode();
        List<CommuteDto> commute = commuteService.getCommute(employeeCode);

        CommuteGetOffWorkEnum commuteGetOffWorkEnum = CommuteGetOffWorkEnum.ERROR;

        // 출근 버튼을 누른 적이 있으면 퇴근 시간 저장
        if (CollectionUtils.isEmpty(commute)) {
            commuteGetOffWorkEnum = CommuteGetOffWorkEnum.BEFORE;
        } else if (!StringUtils.isEmpty(commute.get(0).getEndTime())) {
            commuteGetOffWorkEnum = CommuteGetOffWorkEnum.AFTER;
        } else if (commute.get(0).getStartTime().equals(endTime)) {
            commuteGetOffWorkEnum = CommuteGetOffWorkEnum.SAME_TIME;
        } else {
            int commuteNo = commute.get(0).getCommuteNo();
            commuteService.getOffWork(commuteNo, endTime);
            commuteGetOffWorkEnum = CommuteGetOffWorkEnum.SUCCESS;
        }

        return commuteGetOffWorkEnum.getInfo();
    }

    @ResponseBody
    @RequestMapping(value = "/addCommute", method = RequestMethod.POST)
    public boolean addCommute(@RequestParam(value = "title") String title,
                              @RequestParam(value = "categoryNo") int categoryNo,
                              @RequestParam(value = "startTime") String startTime,
                              @RequestParam(value = "endTime") String endTime) {
        try {
            String employeeCode = authService.getEmployeeCode();
            commuteService.addCommute(employeeCode, title, categoryNo, startTime, endTime);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @RequestMapping(value = "/updateCommute", method = RequestMethod.POST)
    public boolean updateCommute(@RequestParam(value = "commuteNo") int commuteNo,
                                 @RequestParam(value = "title") String title,
                                 @RequestParam(value = "categoryNo") int categoryNo,
                                 @RequestParam(value = "startTime") String startTime,
                                 @RequestParam(value = "endTime") String endTime) {
        try {
            commuteService.updateCommute(commuteNo, title, categoryNo, startTime, endTime);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @RequestMapping(value = "/deleteCommute", method = RequestMethod.POST)
    public boolean deleteCommute(@RequestParam(value = "commuteNo") int commuteNo) {
        try {
            commuteService.deleteCommute(commuteNo);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
