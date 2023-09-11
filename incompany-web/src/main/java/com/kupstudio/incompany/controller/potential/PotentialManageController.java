package com.kupstudio.incompany.controller.potential;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.potential.PotentialManageDto;
import com.kupstudio.incompany.enumClass.AssignStatusEnum;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.potential.PotentialManageSearchCateEnum;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.potential.PotentialManageService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/potential")
public class PotentialManageController {
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String FAIL_MESSAGE = "처리 실패하였습니다.";
    private final String CONTENT_NAME = "DB 리스트";
    // 할당 및 회수 정상 처리 시 메세지
    private final String NOT_ALLOCATION_MESSAGE = "회수 처리 되었습니다.";
    private final String ALLOCATION_MESSAGE = "할당 처리 되었습니다.";

    // 총무가 아닐 때 메세지
//    private final String NOT_MANAGER = String.format("권한이 [ %s ] 가 아닙니다.", AuthNameEnum.MANAGER.meaning);
    /* 페이징 관련 상수 */
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)

    private final String DEFAULT_PAGE_STR = "1";

    @Autowired
    private PotentialManageService potentialManageService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CompanyChartService companyChartService;

    @Autowired
    private DepartmentSelectService departmentSelectService;

    @Autowired
    private AuthService authService;

    /**
     * 잠재 고객 리스트 조회
     */
    @GetMapping("/potentialManage")
    public String potentialManage(@RequestParam(value = "potentialUserNo", required = false) List<Integer> potentialUserNoList,
                                  @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                  @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                  @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                  @RequestParam(value = "assignStatus", required = false) String assignStatus,
                                  @RequestParam(value = "searchValue", required = false) String searchValue,
                                  @RequestParam(value = "searchKey", required = false) String searchKey,
                                  @RequestParam(value = "isSuccess", required = false) String isSuccess,
                                  @RequestParam(value = "orderBy", required = false) String orderBy,
                                  @RequestParam(value = "message", required = false) String message,
                                  RedirectAttributes reAttr,
                                  Model model) throws Exception {

        // 권한 없으면 고객 리스트로 이동
        if (!authService.hasAuth(AuthNameEnum.POTENTIAL_DB_LIST)) return "redirect:/potential/counseling";

        // 로그인한 사원에게 리더 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.SELECT_SALES_LEADER);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        // assignStatus(할당, 미할당, 전체조회) - ENUM 값으로 셋팅
        AssignStatusEnum assignStatusEnum = AssignStatusEnum.getAssignStatusEnum(assignStatus);

        try {
            // 잠재 고객 조회 리스트
            PageInfo<PotentialManageDto> potentialList = PageInfo.of(potentialManageService.getPotentialList(pageNum, assignStatusEnum, orderBy, searchKey, searchValue, COUNT_PER_PAGE), COUNT_PER_PAGE);

            // 잠재고객 체크 유지
            if (potentialUserNoList != null)
                potentialList = potentialManageService.isCheckPotentialUser(potentialList, potentialUserNoList);

            if (departmentCode == null && leaderDepartmentCode != null) departmentCode = leaderDepartmentCode;

            /* 페이징 start, end 세팅 */
            potentialList = PageInfoUtil.setPageNation(potentialList, pageNum);

            // 본부, 지점, 팀, 담당자 리스트 select box 세팅
            model.addAttribute("selectDepartmentMap", selectDepartmentMap);

            // 검색 조건 리스트 조회
            List<PotentialManageSearchCateEnum> searchCateList = PotentialManageSearchCateEnum.getAllMeaning();
            model.addAttribute("searchCateList", searchCateList);

            // 잠재고객 리스트
            model.addAttribute("potentialList", potentialList);
            model.addAttribute("orderBy", orderBy);

            // 영업부서, 팀, 담당자, 할당여부 select 유지
            model.addAttribute("assignStatus", assignStatusEnum.meaning);
            model.addAttribute("departmentCode", departmentCode);
            model.addAttribute("employeeCode", employeeCode);

            // 페이징에서 사용할 리스트 세팅
            model.addAttribute("pageList", potentialList);
            model.addAttribute("pageNum", pageNum);

            // 페이지 정보
            model.addAttribute("urlName", CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
            model.addAttribute("title", CONTENT_NAME);      // 타이틀 명

            // 검색
            model.addAttribute("searchValue", searchValue);
            model.addAttribute("searchKey", searchKey);

            // 처리 결과
            model.addAttribute("isSuccess", isSuccess);
            model.addAttribute("message", message);


            return "potential/potentialManage";
        } catch (Exception e) {
            e.printStackTrace();
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", FAIL_MESSAGE);
            return "redirect:/potential/potentialManage";
        }
    }

    /**
     * 할당
     *
     * @param pageNum
     * @param assignStatus
     * @param employeeCode
     * @param potentialUserNoList
     * @param departmentCode
     * @param reAttr
     * @return
     */
    @GetMapping(value = "/allocationPotentialUser")
    public String allocationPotentialUser(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                          @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                          @RequestParam(value = "assignStatus", required = false) String assignStatus,
                                          @RequestParam(value = "potentialUserNo") List<Integer> potentialUserNoList,
                                          @RequestParam(value = "searchValue", required = false) String searchValue,
                                          @RequestParam(value = "searchKey", required = false) String searchKey,
                                          @RequestParam(value = "orderBy", required = false) String orderBy,
                                          @RequestParam(value = "departmentCode") String departmentCode,
                                          RedirectAttributes reAttr) {

        try {
            if (authService.hasAuth(AuthNameEnum.POTENTIAL_ALLOCATION)) {
                potentialManageService.allocationPotentialUser(departmentCode, employeeCode, potentialUserNoList);
                reAttr.addAttribute("message", ALLOCATION_MESSAGE);
            } else {
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            }
            reAttr.addAttribute("isSuccess", true);
            reAttr.addAttribute("assignStatus", assignStatus);
            reAttr.addAttribute("departmentCode", departmentCode);
            reAttr.addAttribute("employeeCode", employeeCode);
            reAttr.addAttribute("searchValue", searchValue);
            reAttr.addAttribute("searchKey", searchKey);
            reAttr.addAttribute("pageNum", pageNum);
            reAttr.addAttribute("orderBy", orderBy);
            return "redirect:/potential/potentialManage";
        } catch (Exception e) {
            e.printStackTrace();
            reAttr.addAttribute("isSuccessAllocation", false);
            reAttr.addAttribute("isSuccess", false);
            return "redirect:/potential/potentialManage";
        }
    }

    /**
     * 회수
     *
     * @param pageNum
     * @param assignStatus
     * @param potentialUserNoList
     * @param reAttr
     * @return
     */
    @GetMapping(value = "/notAllocationPotentialUser")
    public String notAllocationPotentialUser(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                             @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                             @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                             @RequestParam(value = "assignStatus", required = false) String assignStatus,
                                             @RequestParam(value = "potentialUserNo") List<Integer> potentialUserNoList,
                                             @RequestParam(value = "searchValue", required = false) String searchValue,
                                             @RequestParam(value = "searchKey", required = false) String searchKey,
                                             @RequestParam(value = "orderBy", required = false) String orderBy,
                                             RedirectAttributes reAttr) {
        try {
            // 총무, 관리자 일 때만 회수 처리 가능
            if (authService.hasAuth(AuthNameEnum.POTENTIAL_NOT_ALLOCATION)) {
                potentialManageService.notAllocationPotentialUser(potentialUserNoList);
                reAttr.addAttribute("message", NOT_ALLOCATION_MESSAGE);
            } else {
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            }
            reAttr.addAttribute("isSuccess", true);
            reAttr.addAttribute("assignStatus", assignStatus);
            reAttr.addAttribute("departmentCode", departmentCode);
            reAttr.addAttribute("employeeCode", employeeCode);
            reAttr.addAttribute("searchValue", searchValue);
            reAttr.addAttribute("searchKey", searchKey);
            reAttr.addAttribute("pageNum", pageNum);
            reAttr.addAttribute("orderBy", orderBy);
            return "redirect:/potential/potentialManage";
        } catch (Exception e) {
            e.printStackTrace();
            reAttr.addAttribute("isSuccessAllocation", false);
            reAttr.addAttribute("isSuccess", false);
            return "redirect:/potential/potentialManage";
        }
    }
}