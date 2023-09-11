package com.kupstudio.incompany.controller.myPage;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeAccountDto;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.document.WorkLogDto;
import com.kupstudio.incompany.dto.notification.NotificationDto;
import com.kupstudio.incompany.dto.schedule.ScheduleDto;
import com.kupstudio.incompany.dto.worksheet.ProjectDto;
import com.kupstudio.incompany.dto.worksheet.RequestDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.email.CompanyEmailService;
import com.kupstudio.incompany.service.myPage.MyPageService;
import com.kupstudio.incompany.service.notification.NotificationService;
import com.kupstudio.incompany.service.payment.PaymentModifyService;
import com.kupstudio.incompany.service.schedule.ScheduleService;
import com.kupstudio.incompany.util.PageInfoUtil;
import com.kupstudio.incompany.util.StringCustomUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.text.ParseException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/myPage")
@RequiredArgsConstructor
public class MyPageController {

    private final static Logger log = LoggerFactory.getLogger(MyPageController.class);


    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String NOT_OPEN = "케이업 스튜디오 직원만 사용 가능합니다.";
    private static final String LINK_FIRST = "사원 정보 페이지에서 사내 이메일 연동 후 사용 가능합니다.";

    private final String MY_PAGE_REQUEST_TITLE = "업무 지원";
    private final int FIRST_TODAY_SCHEDULE_SIZE = 4;
    private final int SECOND_TODAY_SCHEDULE_SIZE = 8;
    // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final int COUNT_PER_PAGE = 5;
    private final String DEFAULT_PAGE_STR = "1";
    private final ScheduleService scheduleService;
    private final MyPageService myPageService;
    private final NotificationService notificationService;
    private final PaymentModifyService paymentModifyService;
    private final EmployeeService employeeService;
    private final CompanyEmailService companyEmailService;

    @GetMapping("/myPage")
    public String getMyPage(@AuthenticationPrincipal EmployeePrincipal employee, Model model,
                            @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                            @RequestParam(value = "requestDate", required = false) String requestDate) throws ParseException {


        // 로그인한 사원 코드 추출
        String loginEmployeeCode = employee.getUsername();
        String loginDepartmentCode = employee.getDepartmentCode();
        model.addAttribute("employeeCode", loginEmployeeCode);
        // 계약 현황 관련 사원코드 (선택한 담당자가 없을 때 본인의 계약 현황 조회)
        model.addAttribute("reportEmployeeCode", loginEmployeeCode);

        model.addAttribute("countPayment", paymentModifyService.countPayment(loginEmployeeCode));
        model.addAttribute("countMyPayment", paymentModifyService.countMyPayment(loginEmployeeCode));

        // 알림 리스트
        PageInfo<NotificationDto> notificationList;
        notificationList = PageInfo.of(notificationService.getNotificationList(pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        /* 페이징 start, end 세팅 */
        notificationList = PageInfoUtil.setPageNation(notificationList, pageNum, COUNT_PER_PAGE);
        model.addAttribute("notificationList", notificationList);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", notificationList);
        model.addAttribute("pageNum", pageNum);

        // 업무요청 > state 별 갯수
        RequestDto countOfState = myPageService.getCountOfState();
        model.addAttribute("countOfState", countOfState);

        // 프로젝트 리스트 조회
        List<ProjectDto> projectList = myPageService.getProjectList();
        model.addAttribute("projectList", projectList);

        // 업무일지 리스트 조회
        List<WorkLogDto> workLogList = myPageService.getWorkLogList(loginEmployeeCode, loginDepartmentCode);
        model.addAttribute("workLogList", workLogList);

        // 계약현황
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(1, requestDate);
        if (StringUtils.isEmpty(requestDate)) requestDate = StringCustomUtil.getToday();
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        // 목돈
        int myRankingByContractFortune = myPageService.getMyRankingByContractFortune(startDate, endDate);
        model.addAttribute("myRankingByContractFortune", myRankingByContractFortune);
        // 보험
        int myRankingByInsurance = myPageService.getMyRankingByInsurance(startDate, endDate);
        model.addAttribute("myRankingByInsurance", myRankingByInsurance);

        //오늘 해야할 일 리스트 조회
        Collection<? extends GrantedAuthority> auth = employee.getAuthorities();
        List<ScheduleDto> todayScheduleList = scheduleService.getTodayScheduleList(employee.getUsername());
        if (auth.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.SALES_USER.getMeaning()))) {
            model.addAttribute("todayScheduleList", todayScheduleList);
            return "myPage/mypage_sales";
        } else {
            int end = Math.min(todayScheduleList.size(), FIRST_TODAY_SCHEDULE_SIZE);
            int sndEnd = Math.min(todayScheduleList.size(), SECOND_TODAY_SCHEDULE_SIZE);
            model.addAttribute("fstTodayScheduleList", todayScheduleList.subList(0, end));
            model.addAttribute("sndTodayScheduleList", todayScheduleList.subList(end, sndEnd));
            return "myPage/mypage_staff";

        }


    }

    @GetMapping("/mail/link_check")
    public String getEmailCheck(RedirectAttributes reAttr,
                                @AuthenticationPrincipal EmployeePrincipal employee) throws Exception {

        String employeeCode = employee.getUsername();
        EmployeeDto employeeDto = employeeService.getEmployeeInfoDto(employeeCode);
        EmployeeAccountDto employeeAccountDto = employeeService.employeeAuth(employeeCode);
        String companyEmail = employeeDto.getCompanyEmail();
        String password = employeeAccountDto.getPassword();

        log.debug("###########  getEmailCheck start ########################## ");
        log.debug("###   employeeCode : " + employeeCode);
        log.debug("###   password : " + password);


        companyEmailService.updateCompanyPassword(employeeCode, password);

        log.debug("###########  getEmailCheck finish ########################## ");


        if (employeeDto.getEmployeeCode().contains("K")) {
            if (companyEmail == null || companyEmail == "") {
                // 이메일이 존재하지 않는 경우 본인 정보 수정 페이지로 이동
                return "redirect:/companyChart/employeeInfo?employeeCode=" + employeeCode;
            } else if (companyEmail.contains("kupstudio")) {
                // 사내 이메일 연동한 경우
                String username = companyEmail.substring(0, companyEmail.indexOf("@"));
                companyEmail = username + "@kupstudio.com";
                String redirectUrl = "https://mail.kupstudio.com/roundcube/?_user=" + companyEmail + "&_pass=" + password;
                return "redirect:" + redirectUrl;
            } else {
                return "redirect:/companyChart/employeeInfo?employeeCode=" + employeeCode;
            }
        } else {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_OPEN);
            return "redirect:/index";
        }

    }

    @GetMapping("/myPageRequest")
    public String getMyPageRequest(Model model) {

        model.addAttribute("urlName", MY_PAGE_REQUEST_TITLE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", MY_PAGE_REQUEST_TITLE);
        return "myPage/mypage_request";
    }


}