package com.kupstudio.incompany.controller.salesTarget;

import com.kupstudio.incompany.cacheService.salesTarget.SalesTargetCacheService;
import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.dto.DepartmentSettingDto;
import com.kupstudio.incompany.dto.salesTarget.SalesTargetTeamDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import com.kupstudio.incompany.service.salesTarget.SalesTargetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/salesTarget")
public class SalesTargetController {

    private static final String CONTENT_NAME = "영업 목표 리스트";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String IS_NOT_SALES_MESSAGE = "영업부서에 속해 있지 않습니다. \n담당자에게 문의하세요.";

    private final AuthService authService;

    private final SalesTargetService salesTargetService;
    private final SalesTargetCacheService salesTargetCacheService;
    private final DepartmentSearchService departmentSearchService;

    @GetMapping("/salesTarget")
    public String getSalesTarget(@RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                                      @RequestParam(value = "message", required = false) String message,
                                      Model model, RedirectAttributes redirectAttributes) {

        // 영업 통계 접근 권한 체크
        if (!authService.hasAuth(AuthNameEnum.SALES_TARGET_ALL) && !authService.hasAuth(AuthNameEnum.SALES_TARGET_BRANCH) && !authService.hasAuth(AuthNameEnum.SALES_TARGET_TEAM) && !authService.hasAuth(AuthNameEnum.SALES_TARGET)) {
            redirectAttributes.addAttribute("isSuccess", false);
            redirectAttributes.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            String loginDepartmentCode = authService.getDepartmentCode();
            model.addAttribute("departmentCode", loginDepartmentCode);
            return "redirect:/contractFortune/contractFortune";
        }

        LocalDate date = LocalDate.now();
        List<LocalDate[]> weekRanges = salesTargetService.getWeekRanges(date);
        int weekRange = weekRanges.size();
        int year = date.getYear();
        int month = date.getMonthValue();
        int week = 0;
        int category = 1;

        model.addAttribute("year", year);
        model.addAttribute("month", month);
        model.addAttribute("week", week);
        model.addAttribute("weekRange", weekRange);
        model.addAttribute("category", category);

        if(authService.hasAuth(AuthNameEnum.SALES_TARGET_ALL)){
            List<DepartmentDto> salesBranchList = departmentSearchService.getAllSalesTwoDepthDepartment();
            model.addAttribute("salesBranchList", salesBranchList);
        } else {
            String departmentCode = authService.getDepartmentCode();

            if(authService.hasAuth(AuthNameEnum.SALES_TARGET_BRANCH)){
                departmentCode = departmentSearchService.getSalesTwoDepthByOneDepth(departmentCode);
                if(StringUtils.isEmpty(departmentCode)) {
                    redirectAttributes.addAttribute("isSuccess", false);
                    redirectAttributes.addAttribute("message", IS_NOT_SALES_MESSAGE);
                    String loginDepartmentCode = authService.getDepartmentCode();
                    model.addAttribute("departmentCode", loginDepartmentCode);
                    return "redirect:/contractFortune/contractFortune";
                }
            }

            DepartmentSettingDto departmentSettingDto = departmentSearchService.getDepthDepartmentByDCode(departmentCode);

            DepartmentDto departmentDto = new DepartmentDto();
            departmentDto.setDepartmentCode(departmentSettingDto.getSalesDepartmentCode());
            departmentDto.setDepartmentName(departmentSettingDto.getSalesDepartmentName());

            model.addAttribute("salesBranchList", departmentDto);
        }

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);

        model.addAttribute("active", false);

        return "salesTarget/salesTarget";
    }

    @RequestMapping(value = "getWeekRange", method = RequestMethod.GET)
    public String getWeekRange(@RequestParam(value = "date") int year,
                               @RequestParam(value = "month") int month,
                               @RequestParam(value = "week") int week,
                               @RequestParam(value = "id") String id,
                               Model model) {

        LocalDate date = LocalDate.of(year, month, 1);

        List<LocalDate[]> weekRanges = salesTargetService.getWeekRanges(date);

        int weekRange = weekRanges.size();

        if (week > weekRange) {
            week = 0;
        }

        model.addAttribute("weekRange", weekRange);
        model.addAttribute("week", week);

        return "salesTarget/salesTarget :: " + id;
    }

    @RequestMapping(value = "getSalesTargetList", method = RequestMethod.GET)
    public String getWeekRange(@RequestParam(value = "year") int year,
                               @RequestParam(value = "month") int month,
                               @RequestParam(value = "week") int week,
                               @RequestParam(value = "category") int category,
                               @RequestParam(value = "departmentCode") String departmentCode,
                               @RequestParam(value = "className") String className,
                               Model model) {

        LocalDate date = LocalDate.of(year, month, 1);

        List<LocalDate[]> weekRanges = salesTargetService.getWeekRanges(date);
        // 해당 달의 첫날과 마지막날
        LocalDate firstDayOfMonth = date.withDayOfMonth(1);
        LocalDate lastDayOfMonth = date.withDayOfMonth(date.lengthOfMonth());

        LocalDate startDate;
        LocalDate endDate;

        int weekRange = weekRanges.size();
        if (week > 0 && week <= weekRange) {
            LocalDate[] inputWeekRange = weekRanges.get(week - 1);
            startDate = inputWeekRange[0];
            endDate = inputWeekRange[1];
        } else {
            startDate = firstDayOfMonth;
            endDate = lastDayOfMonth;
        }

        String employeeCode = authService.getEmployeeCode();

        List<SalesTargetTeamDto> salesTargetDto = new ArrayList<>();
        // 전체, 지점 - 영업 목표 조회
        if (authService.hasAuth(AuthNameEnum.SALES_TARGET_ALL) || authService.hasAuth(AuthNameEnum.SALES_TARGET_BRANCH)) {
            salesTargetDto = salesTargetCacheService.getSalesTargetBranch(startDate, endDate, category, departmentCode);
        } else {
            // 팀 - 영업 목표 조회
            if (authService.hasAuth(AuthNameEnum.SALES_TARGET_TEAM)) {
                String loginDepartmentCode = authService.getDepartmentCode();
                salesTargetDto = salesTargetCacheService.getSalesTargetTeam(startDate, endDate, category, loginDepartmentCode);
            } else {
                // 개인 - 영업 목표 조회
                if (authService.hasAuth(AuthNameEnum.SALES_TARGET)) {
                    salesTargetDto = salesTargetCacheService.getSalesTargetIndividual(startDate, endDate, category, employeeCode);
                }
            }
        }

        model.addAttribute("active", true);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("category", category);
        model.addAttribute("salesTargetBranchList", salesTargetDto);

        return "salesTarget/salesTarget :: " + className;
    }

    @ResponseBody
    @RequestMapping(value = "/addEstimated", method = RequestMethod.POST)
    public boolean addEstimated(@RequestParam(value = "estimatedDate") String estimatedDate,
                                @RequestParam(value = "estimatedUserName") String estimatedUserName,
                                @RequestParam(value = "estimatedAmount") int estimatedAmount,
                                @RequestParam(value = "probability") int probability,
                                @RequestParam(value = "note") String note,
                                @RequestParam(value = "category") int category) {
        try {
            String employeeCode = authService.getEmployeeCode();
            salesTargetService.addEstimated(employeeCode, estimatedDate, estimatedUserName, estimatedAmount, probability, note, category);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @RequestMapping(value = "/updateEstimated", method = RequestMethod.PUT)
    public boolean updateEstimated(@RequestParam(value = "estimatedNo") int estimatedNo,
                                   @RequestParam(value = "estimatedDate") String estimatedDate,
                                   @RequestParam(value = "estimatedUserName") String estimatedUserName,
                                   @RequestParam(value = "estimatedAmount") int estimatedAmount,
                                   @RequestParam(value = "probability") int probability,
                                   @RequestParam(value = "note") String note) {
        try {
            salesTargetService.updateEstimated(estimatedNo, estimatedDate, estimatedUserName, estimatedAmount, probability, note);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @DeleteMapping("/deleteEstimated")
    public void deleteDeleteEstimated(int estimatedNo) {
        salesTargetService.deleteEstimated(estimatedNo);
    }
}
