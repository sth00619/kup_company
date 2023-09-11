package com.kupstudio.incompany.controller.potential;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.config.CommonEncryptConfig;
import com.kupstudio.incompany.dto.potential.PotentialCounselingAndDetailDto;
import com.kupstudio.incompany.dto.potential.PotentialCounselingDto;
import com.kupstudio.incompany.dto.potential.PotentialUserCounselingDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.CounselingTitleEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.potential.PotentialUserCounselingService;
import com.kupstudio.incompany.util.DepartmentCodeUtil;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;


@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/potential")
public class PotentialCounselingController {

    private final PotentialUserCounselingService potentialUserCounselingService;

    private final DepartmentSelectService departmentSelectService;

    private final AuthService authService;


    // 한 페이지당 게시글 갯수
    private final int COUNT_PER_PAGE = 10;

    private final String POTENTIAL_USER_DETAIL_TITLE = "고객 리스트";
    private final int NAVIGATE_PAGES = 10;

    private final String DEFAULT_PAGE_STR = "1";

    @GetMapping("/counseling")
    public String counselingList(Model model, @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                 @RequestParam(value = "searchType", required = false) String searchType,
                                 @RequestParam(value = "keyword", required = false) String keyword,
                                 @AuthenticationPrincipal EmployeePrincipal employee,
                                 @RequestParam(value = "isSuccess", required = false) String isSuccess,
                                 @RequestParam(value = "message", required = false) String message,
                                 RedirectAttributes reAttr) throws Exception {

        String employeeLoginCode = employee.getUsername();

        PageInfo<PotentialUserCounselingDto> counselingUserList;

        if (!authService.hasAuth(AuthNameEnum.SELECT_SALES_ALL) && !authService.hasAuth(AuthNameEnum.SELECT_SALES_LEADER)) {
            employeeCode = employeeLoginCode;
            departmentCode = employee.getDepartmentCode();
        }

        // 로그인한 사원에게 리더 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.SELECT_SALES_LEADER);

        if (!authService.hasAuth(AuthNameEnum.SELECT_SALES_ALL) && !DepartmentCodeUtil.isChild(leaderDepartmentCode, departmentCode)) {
            departmentCode = employee.getDepartmentCode();
        }

        model.addAttribute("originalKeyword", keyword);

        if (searchType != null && searchType.equals("mobile")) {
            keyword = CommonEncryptConfig.encryptAes(keyword, CommonEncryptConfig.ENCRYPT_KEY_POTENTIAL_USER);
        }

        counselingUserList = PageInfo.of(potentialUserCounselingService.getCounselingUserList(employeeCode, departmentCode, pageNum, searchType, keyword, COUNT_PER_PAGE), NAVIGATE_PAGES);
        model.addAttribute("employeeCode", employeeCode);

        counselingUserList = PageInfoUtil.setPageNation(counselingUserList, pageNum);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(employee.getDepartmentCode());

        if (StringUtils.isNotEmpty(leaderDepartmentCode) && StringUtils.isEmpty(departmentCode)) {
            departmentCode = leaderDepartmentCode;
        }

        try {
            // 본부, 지점, 팀, 담당자 리스트 select box 세팅
            model.addAttribute("selectDepartmentMap", selectDepartmentMap);
            // 검색
            model.addAttribute("searchType", searchType);
            model.addAttribute("keyword", keyword);
            // 잠재고객 리스트
            model.addAttribute("pageList", counselingUserList);
            model.addAttribute("employeeLoginCode", employeeLoginCode);
            model.addAttribute("potentialUserList", counselingUserList);
            model.addAttribute("pageNum", pageNum);

            // 영업부서, 팀, 담당자 리스트 select box 세팅
            model.addAttribute("urlName", POTENTIAL_USER_DETAIL_TITLE);    // 컨텐츠 상단 현재 페이지 명
            model.addAttribute("title", POTENTIAL_USER_DETAIL_TITLE);      // 타이틀 명

            model.addAttribute("departmentCode", departmentCode);

            model.addAttribute("isSuccess", isSuccess);
            model.addAttribute("message", message);

            return "potential/counseling";
        } catch (Exception e) {
            e.printStackTrace();
            reAttr.addAttribute("isSuccess", false);
            model.addAttribute("message", e.getMessage());
            return "redirect:/potential/counseling";
        }

    }


    @PostMapping("/addCounseling")
    public String addCounseling(Model model, @RequestBody Map<String, Object> param, @RequestParam(value = "isForm", required = false) String isForm) {


        int potentialUserNo = Integer.parseInt(String.valueOf(param.get("potentialUserNo")));

        potentialUserCounselingService.insertAndUpdateAndDeleteCounseling(param);


        List<PotentialCounselingDto> counselingList = potentialUserCounselingService.getPotentialUserDetail(potentialUserNo, isForm);
        model.addAttribute("counselingList", counselingList);

        return "potential/counseling :: #counselingList";
    }

    @GetMapping("/detail")
    public String getCounselingDetailList(Model model, @RequestParam(value = "potentialUserNo") int potentialUserNo, @RequestParam(value = "potentialUserName", required = false) String potentialUserName, @RequestParam(value = "isForm", required = false) String isForm) {

        List<PotentialCounselingDto> counselingList = potentialUserCounselingService.getPotentialUserDetail(potentialUserNo, isForm);


        model.addAttribute("potentialUserNo", potentialUserNo);
        model.addAttribute("potentialUserName", potentialUserName);

        model.addAttribute("counselingList", counselingList);

        if (isForm != null) {
            List<CounselingTitleEnum> counselingTitleList = CounselingTitleEnum.getCounselingTitleList();
            model.addAttribute("counselingTitleList", counselingTitleList);
            return "potential/counseling :: #counselingFormList";
        } else {

            return "potential/counseling :: #counselingList";
        }
    }

    @ResponseBody
    @PostMapping("/addFeedback")
    public void addFeedback(PotentialCounselingAndDetailDto potential) {

        if (!authService.hasAuth(AuthNameEnum.POTENTIAL_FEEDBACK)) return;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();
        potential.setEmployeeCode(employeeLoginCode);
        potentialUserCounselingService.addFeedback(potential);
    }

    @GetMapping("/counselingDetail")
    public String counselingDetail(int detailNo, Model model) {

        PotentialCounselingAndDetailDto counselingDetail = potentialUserCounselingService.getCounselingDetailByDetailNo(detailNo);
        model.addAttribute("cd", counselingDetail);
        return "potential/counselingDetail";


    }


}