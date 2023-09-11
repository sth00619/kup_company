package com.kupstudio.incompany.controller.home;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dao.company.targetAmount.TargetAmountMapper;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.banner.BannerImgCategoryDto;
import com.kupstudio.incompany.dto.banner.BannerYoutubeDto;
import com.kupstudio.incompany.dto.board.BoardDto;
import com.kupstudio.incompany.dto.command.CommandDto;
import com.kupstudio.incompany.dto.document.WorkLogDto;
import com.kupstudio.incompany.dto.faq.FaqDto;
import com.kupstudio.incompany.dto.notice.NoticeDto;
import com.kupstudio.incompany.dto.potential.PotentialManageDto;
import com.kupstudio.incompany.dto.potential.PotentialUserCounselingDto;
import com.kupstudio.incompany.dto.question.QuestionDto;
import com.kupstudio.incompany.dto.statistics.SalesTargetAmountDto;
import com.kupstudio.incompany.dto.targetAmount.TargetAmountDto;
import com.kupstudio.incompany.dto.worksheet.ProjectDto;
import com.kupstudio.incompany.dto.worksheet.RequestDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.NoticeTypeEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.banner.BannerService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.command.CommandService;
import com.kupstudio.incompany.service.home.HomeService;
import com.kupstudio.incompany.service.statistics.SalesTargetAmountService;
import com.kupstudio.incompany.util.DepartmentCodeUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = {"/", "/index"})
@RequiredArgsConstructor
public class HomeController {
    private static final String CONTENT_NAME = "KH메인";
    private static final String BANNER_CATEGORY_DEFAULT = "전체(KH공지)";
    private static final Logger log = LoggerFactory.getLogger(HomeController.class);
    private final int NOTICE_TYPE = 0;
    private final int MONTHLY_TYPE = 1;
    private final int ARTICLE_TYPE = 2;
    private final int EDU_TYPE = 3;
    private final EmployeeService employeeService;
    private final SalesTargetAmountService salesTargetAmountService;

    @Autowired
    HomeService homeService;

    @Autowired
    AuthService authService;

    @Autowired
    BannerService bannerService;

    @Autowired
    CloudService cloudService;

    @Autowired
    SalesTargetAmountService targetAmountService;

    @Autowired
    CommandService commandService;

    @GetMapping("/mainSales")
    public String addDocumentForm(Model model,
                                  HttpServletRequest request) {

        // 게시판타입에 따른 양식을 출력하기위한 mainUrl 추출
        String requestUrl = request.getRequestURI();

        //로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);


        return "/index/";

    }

    @PostMapping("/mainSales")
    public String mainSales(@ModelAttribute TargetAmountDto targetAmountDto) {
        // SecurityContextHolder에서 Authentication 객체를 가져와서 UserDetails를 구현한 클래스에서 e_code 값을 얻어온다.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String e_code = ((UserDetails) auth.getPrincipal()).getUsername();

        // targetAmountDto에 로그인한 유저의 e_code 값을 설정한다.
        targetAmountDto.setECode(e_code);

        // targetAmountService를 주입받아서 targetAmountDto 객체를 이용하여 DB에 데이터를 삽입한다.
        TargetAmountMapper targetAmountService = null;
        targetAmountService.insertTargetAmount(targetAmountDto);

        // index 페이지로 리다이렉트한다.
        return "redirect:/index/";
    }


    @GetMapping(value = {"/", "/index"})
    public String index(Model model, @AuthenticationPrincipal EmployeePrincipal employee,
                        @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                        @RequestParam(value = "message", required = false) String message,
                        @RequestParam(value = "bannerCategory", defaultValue = BANNER_CATEGORY_DEFAULT) String bannerCategory) throws Exception {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String employeeLoginCode = auth.getName();
        model.addAttribute("employeeCode", employeeLoginCode);
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        Collection<? extends GrantedAuthority> auths = employee.getAuthorities();
        String loginDepartmentCode = null;

        EmployeeDto employeeDto = employeeService.getEmployeeInfoDto(employeeLoginCode);
        model.addAttribute("employeeDto", employeeDto);

        if (!auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.KHNEWS_BRANCH.getMeaning()))) {

            loginDepartmentCode = employee.getDepartmentCode();

        }

        if (auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.VIETNAM.getMeaning()))) {
            return "redirect:/vietnam/maaden/vietnamDoc/list";

        } else if (auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.SI_COMPANY.getMeaning()))) {
            // 권한이 SI_COMPANY 일 경우 경로
            return "redirect:/potential/counseling";
        } else if (auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.FA_COMPANY.getMeaning()))) {
            // 권한이 FA_COMPANY 일 경우 경로
            return "redirect:/potential/counseling";
        } else {
            model.addAttribute("title", CONTENT_NAME);

            // 업무일지 리스트 조회
            List<WorkLogDto> workLogList = homeService.getWorkLogList(employeeLoginCode);
            model.addAttribute("workLogList", workLogList);

            // 게시판 카테고리
            NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(NOTICE_TYPE);
            NoticeTypeEnum monthlyTypeEnum = NoticeTypeEnum.valueOf(MONTHLY_TYPE);
            NoticeTypeEnum articleTypeEnum = NoticeTypeEnum.valueOf(ARTICLE_TYPE);
            NoticeTypeEnum eduTypeEnum = NoticeTypeEnum.valueOf(EDU_TYPE);


            String noticeTypeTitle = noticeTypeEnum.getMeaning();
            String monthlyTypeTitle = monthlyTypeEnum.getMeaning();
            String articleTypeTitle = articleTypeEnum.getMeaning();
            String eduTypeTitle = eduTypeEnum.getMeaning();

            model.addAttribute("noticeTypeTitle", noticeTypeTitle);
            model.addAttribute("monthlyTypeTitle", monthlyTypeTitle);
            model.addAttribute("articleTypeTitle", articleTypeTitle);
            model.addAttribute("eduTypeTitle", eduTypeTitle);

            // 게시판 리스트 조회
            List<NoticeDto> noticeList = homeService.getNoticeList(NOTICE_TYPE, null);
            List<NoticeDto> monthlyList = homeService.getNoticeList(MONTHLY_TYPE, loginDepartmentCode);
            List<NoticeDto> articleList = homeService.getNoticeList(ARTICLE_TYPE, null);
            List<NoticeDto> eduList = homeService.getNoticeList(EDU_TYPE, null);

            model.addAttribute("noticeList", noticeList);
            model.addAttribute("monthlyList", monthlyList);
            model.addAttribute("articleList", articleList);
            model.addAttribute("eduList", eduList);

            List<BoardDto> boardList = homeService.getBoardList(null, null);
            List<FaqDto> faqList = homeService.getFaqList(null, null);
            List<QuestionDto> questionList = homeService.getQuestionList(null, null);

            // 지점장 이상 공지사항
            model.addAttribute("commandList", commandService.getRecentCommandList());
            model.addAttribute("boardList", boardList);
            model.addAttribute("faqList", faqList);
            model.addAttribute("questionList", questionList);

            model.addAttribute("message", message);
            model.addAttribute("isSuccess", isSuccess);

            // 영상 배너
//            List<BannerYoutubeDto> youtubeList = bannerService.getYoutubeList();
//            model.addAttribute("youtubeList", youtubeList);

            // 이미지 배너 카테고리
//            List<BannerImgCategoryDto> bannerImgCategoryList = bannerService.getBannerImgCategoryList();
//            model.addAttribute("bannerImgCategoryList", bannerImgCategoryList);

            // 이미지 배너 카테고리가 있을경우 이미지 배너 리스트 셋팅
//            if (!CollectionUtils.isEmpty(bannerImgCategoryList)) {
//                LinkedHashMap<String, List> bannerImgMap = bannerService.getHomeBannerImgList(bannerImgCategoryList, departmentCode);
//                model.addAttribute("bannerImgMap", bannerImgMap);
//            }

            if ((authService.hasAuth(AuthNameEnum.GENERAL_USER) && authService.hasAuth(AuthNameEnum.SALES_USER))
                    || (authService.hasAuth(AuthNameEnum.GENERAL_USER))) {

                // 업무요청 업무 처리 현황 리스트 조회
                List<RequestDto> currentStateOfRequestList = homeService.getCurrentStateOfRequestList();
                model.addAttribute("currentStateOfRequestList", currentStateOfRequestList);

                // 업무요청 최신 요청권 리스트 조회
                List<RequestDto> requestList = homeService.getRequestList();
                model.addAttribute("requestList", requestList);

                // 프로젝트 리스트 조회
                List<ProjectDto> projectList = homeService.getProjectList();
                model.addAttribute("projectList", projectList);
                return "index/staff";

            } else if (authService.hasAuth(AuthNameEnum.SALES_USER)) {

                Map<String, SalesTargetAmountDto> salesTargetAmountDto = targetAmountService.targetAmount(employeeLoginCode);
                model.addAttribute("salesTargetAmountDto", salesTargetAmountDto);

                // 사원 코드 조회
                String employeeCode = authService.getEmployeeCode();
                model.addAttribute("employeeCode", employeeCode);


                // 계약 현황 관련 사원코드 (선택한 담당자가 없을 때 본인의 계약 현황 조회)
                String reportEmployeeCode = authService.getEmployeeCode();
                model.addAttribute("reportEmployeeCode", reportEmployeeCode);

                // 고객관리
                PageInfo<PotentialUserCounselingDto> potentialUserCounselingList = homeService.getPotentialUserList();
                model.addAttribute("potentialUserCounselingList", potentialUserCounselingList);

                PageInfo<PotentialManageDto> potentialManageList = homeService.getPotentialList();
                model.addAttribute("potentialManageList", potentialManageList);


                return "index/sales";
            }

        }
        return "index/staff";
    }


    @PostMapping("/targetAmount")
    @ResponseBody
    public void insertOrUpdateAmountTarget(String targetAmountString, String year, String week) {

        String employeeCode = authService.getEmployeeCode();

        int targetAmount = Integer.parseInt(targetAmountString.replaceAll(",", ""));

        targetAmountService.insertOrUpdateTargetAmount(employeeCode, targetAmount, year, week);
    }


}
