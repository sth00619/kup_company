package com.kupstudio.incompany.controller.additionalScore;

import com.kupstudio.incompany.cacheService.statistics.AdditionalScoreCacheService;
import com.kupstudio.incompany.dto.statistics.AdditionalScoreDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.util.TodayDateFormatUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class AdditionalScoreController {

    private static final String CONTENT_NAME = "상담, 로그인 점수";

    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";

    private final AdditionalScoreCacheService additionalScoreCacheService;

    private final DepartmentSelectService departmentSelectService;
    private final AuthService authService;

    private final String DATE_FORMAT = "yyyy-MM";

    @SneakyThrows
    @GetMapping("/additionalScore")
    public String scoreList(Model model,
                            @AuthenticationPrincipal EmployeePrincipal employee,
                            @RequestParam(required = false, value = "searchDate") String searchDate,
                            @RequestParam(value = "departmentCode", required = false) String departmentCode,
                            @RequestParam(value = "employeeCode", required = false) String employeeCode,
                            RedirectAttributes redirectAttributes
    ) {

        Collection<? extends GrantedAuthority> auths = employee.getAuthorities();
        if (!auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.ADDITIONAL_SCORE.getMeaning()))) {

            redirectAttributes.addAttribute("isSuccess", false);
            redirectAttributes.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }


        if (StringUtils.isEmpty(searchDate)) searchDate = TodayDateFormatUtil.getTodayFormatToDateTime(DATE_FORMAT);

        List<AdditionalScoreDto> additionalScoreList = additionalScoreCacheService.additionalScore(searchDate, departmentCode, employeeCode);

        model.addAttribute("additionalScoreList", additionalScoreList);


        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);
        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("employeeCode", employeeCode);

        model.addAttribute("searchDate", searchDate);
        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);


        return "statistics/additionalScore";
    }


}
