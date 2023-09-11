package com.kupstudio.incompany.controller.vacation;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.payment.PaymentDto;
import com.kupstudio.incompany.dto.vacation.VacationDto;
import com.kupstudio.incompany.dto.vacation.VacationRecordDto;
import com.kupstudio.incompany.enumClass.payment.PaymentBoardTypeEnum;
import com.kupstudio.incompany.enumClass.payment.PaymentStatusEnum;
import com.kupstudio.incompany.enumClass.vacation.VacationCategoryEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.payment.CommonPaymentService;
import com.kupstudio.incompany.service.vacation.VacationRecordService;
import com.kupstudio.incompany.service.vacation.VacationService;
import com.kupstudio.incompany.util.StringCustomUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/vacation")
@RequiredArgsConstructor
public class VacationController {

    // D.I
    private final VacationRecordService vacationRecordService;
    private final CommonPaymentService commonPaymentService;
    private final EmployeeCacheService employeeCacheService;
    private final VacationService vacationService;
    private final CloudService cloudService;
    private final AuthService authService;

    // 상수 세팅
    private static final PaymentBoardTypeEnum BOARD_ENUM = PaymentBoardTypeEnum.VACATION;
    private static final int BOARD_TYPE = BOARD_ENUM.getBoardType();
    private static final String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"};
    private static final String MY_VACATION_LIST = "나의 휴가 리스트";
    private static final String VACATION_INFO = "휴가 상세 보기";
    private static final String ADD_VACATION = "휴가 신청";
    private static final String UPDATE_VACATION = "휴가 수정";
    private static final String DATE_SEARCH_TYPE = "all";
    private static final String DEFAULT_DATE_TYPE = "3";
    private static final String DEFAULT_PAGE_STR = "1";
    private static final int COUNT_PER_PAGE = 10;

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    /**
     * 휴가 신청 화면
     * @param model
     * @return
     */
    @GetMapping("/addVacation")
    public String addVacation(Model model){

        // 현재 연도
        String year = StringCustomUtil.getToday().substring(0,4);

        // 휴가 신청 사원(본인)의 보유 휴가 정보
        model.addAttribute("vacationByEmployee", vacationService.getVacationByEmployee(year, authService.getEmployeeCode()));

        // 휴가 종류 ENUM LIST
        model.addAttribute("vacationCategoryEnumList", VacationCategoryEnum.getEnumList());

        // 결재자, 참조자 리스트를 위한 모든 사원 리스트
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("payment", new PaymentDto());

        // 페이지 정보
        model.addAttribute("urlName", ADD_VACATION);
        model.addAttribute("title", ADD_VACATION);
        return "vacation/addVacation";
    }

    /**
     * 휴가 신청 처리
     * @param vacationRecordDto
     * @return
     */
    @PostMapping("/addVacation")
    public String addVacation(@ModelAttribute(value = "vacationDto") VacationRecordDto vacationRecordDto,
                              @AuthenticationPrincipal EmployeePrincipal employee){

        String loginEmployeeCode = employee.getUsername();
        boolean isModify = false;
        String title = vacationRecordDto.getTitle();

        // 휴가 등록
        vacationRecordService.addVacationRecord(vacationRecordDto);

        // 결재자, 참조자 insert
        List<String> approverList   = vacationRecordDto.getApproverList();
        List<String> referrerList   = vacationRecordDto.getReferrerList();
        int vacationRecordNo        = vacationRecordDto.getVacationRecordNo();
        String employeeCode         = vacationRecordDto.getEmployeeCode();

//         결재자 참조자 등록 (INSERT - myPayment, paymentAction)
        commonPaymentService.addPayment(approverList, referrerList, vacationRecordNo, employeeCode, BOARD_ENUM, PaymentStatusEnum.PAYMENT_ADD, loginEmployeeCode, isModify, title);

        // 결재자 참조자 알림 기능 (@@@ 미구현)


        return "redirect:/vacation/myVacationList";
    }


    @GetMapping("/updateVacation")
    public String updateVacation(@RequestParam(value = "vacationRecordNo") int vacationRecordNo,
                                 Model model){

        // 휴가 상세 정보 조회
        VacationRecordDto vacationRecordDto = vacationRecordService.getVacationRecord(vacationRecordNo);
        model.addAttribute("vacationRecordDto", vacationRecordDto);

        String employeeCode = vacationRecordDto.getEmployeeCode();
        String year = vacationRecordDto.getYear();

        // 신청자 보유 휴가 정보 조회
        VacationDto vacationByEmployee = vacationService.getVacationByEmployee(year, employeeCode);
        model.addAttribute("vacationByEmployee", vacationByEmployee);

        // 휴가 종류 ENUM LIST
        model.addAttribute("vacationCategoryEnumList", VacationCategoryEnum.getEnumList());

        // 결재 > 결재자, 참조자 리스트를 위한 모든 사원 리스트
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());

        // 결재 > 결재자, 참조자 조회
        PaymentDto payment = commonPaymentService.getPaymentEmployee(vacationRecordNo, BOARD_TYPE);
        payment = payment != null ? payment : new PaymentDto();
        model.addAttribute("payment", payment);

        // 결재 > 필수 정보
        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());
        model.addAttribute("boardType", BOARD_TYPE);
        model.addAttribute("no", vacationRecordDto.getVacationRecordNo());

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(vacationRecordDto.getAttacheFiles());
        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("fileList", fileList);

        // 페이지 정보
        model.addAttribute("urlName", UPDATE_VACATION);
        model.addAttribute("title", UPDATE_VACATION);

        return "vacation/updateVacation";
    }

    @PostMapping("/updateVacation")
    public String updateVacation(@ModelAttribute(value = "vacationDto") VacationRecordDto vacationRecordDto,
                                 @AuthenticationPrincipal EmployeePrincipal employee) {
        String loginEmployeeCode = employee.getUsername();
        boolean isModify = true;
        String title = vacationRecordDto.getTitle();

        vacationRecordService.updateVacationRecord(vacationRecordDto, cloudUrl, loginEmployeeCode, isModify, title);

        return "redirect:/vacation/vacationInfo?vacationRecordNo=" + vacationRecordDto.getVacationRecordNo();
    }

    @ResponseBody
    @DeleteMapping("/deleteVacation")
    public boolean deleteVacation(@RequestParam(value = "vacationRecordNo") int vacationRecordNo){
        return vacationRecordService.deleteVacation(vacationRecordNo, BOARD_ENUM);
    }

    /**
     * 나의 휴가 리스트 조회
     * @param status
     * @param requestDate
     * @param dateType
     * @param model
     * @return
     * @throws ParseException
     */
    @GetMapping("/myVacationList")
    public String myVacationList(@RequestParam(value = "pageNum", defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(value = "dateType", defaultValue = DEFAULT_DATE_TYPE) int dateType,
                                 @RequestParam(value = "requestDate", required = false) String requestDate,
                                 @RequestParam(value = "status", defaultValue = "-1") int status,
                                 Model model) throws ParseException {

        // 기간 조회 data setting
        requestDate = StringUtils.isEmpty(requestDate) ? StringCustomUtil.getToday() : requestDate;
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = (int) dateMap.get("dateType");

        // 신청자 보유 휴가 정보 조회
        VacationDto vacationByEmployee = vacationService.getVacationByEmployee(startDate.substring(0, 4), authService.getEmployeeCode());
        model.addAttribute("vacationByEmployee", vacationByEmployee);

        // 쿼리 parameter setting
        VacationRecordDto vacationRecordDto = new VacationRecordDto();
        vacationRecordDto.setStartDate(startDate);
        vacationRecordDto.setEndDate(endDate);
        vacationRecordDto.setStatus(status);
        vacationRecordDto.setEmployeeCode(authService.getEmployeeCode());

        // 나의 휴가 리스트 조회
        PageInfo<VacationRecordDto> vacationRecordDtoList = PageInfo.of(vacationRecordService.getVacationRecordList(vacationRecordDto, pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("vacationRecordDtoList", vacationRecordDtoList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", vacationRecordDtoList);
        model.addAttribute("pageNum", pageNum);

        // 조회 구분 [-1 = 전체], [1 = 상신], [2 = 결재완료], [3 = 반려], [4 = 임시보관]
        model.addAttribute("status", status);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간, 3 = 연간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 연간 = yearly, 둘다 = all)
        model.addAttribute("dateSearchType", DATE_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜, 시작일, 종료일
        model.addAttribute("requestDate", requestDate);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 페이지 정보
        model.addAttribute("urlName", MY_VACATION_LIST);
        model.addAttribute("title", MY_VACATION_LIST);
        return "vacation/myVacationList";
    }


    /**
     * 휴가 결재 리스트 조회
     * @param status
     * @param requestDate
     * @param dateType
     * @param model
     * @return
     * @throws ParseException
     */
    @GetMapping("/paymentVacationList")
    public String paymentVacationList(@RequestParam(value = "pageNum", defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                      @RequestParam(value = "dateType", defaultValue = DEFAULT_DATE_TYPE) int dateType,
                                      @RequestParam(value = "requestDate", required = false) String requestDate,
                                      @RequestParam(value = "status", defaultValue = "1") int status,
                                      @RequestParam(value = "step", required = false) Integer step,
                                      @RequestParam(value = "type", required = false) Integer type,
                                      Model model) throws ParseException {

        // 기간 조회 data setting
        requestDate = StringUtils.isEmpty(requestDate) ? StringCustomUtil.getToday() : requestDate;
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = (int) dateMap.get("dateType");

        // 쿼리 parameter setting
        VacationRecordDto vacationRecordDto = new VacationRecordDto();
        vacationRecordDto.setStartDate(startDate);
        vacationRecordDto.setEndDate(endDate);
        vacationRecordDto.setStatus(status);
        vacationRecordDto.setStep(step);
        vacationRecordDto.setType(type);
        vacationRecordDto.setEmployeeCode(authService.getEmployeeCode());

        // 결재 요청 받은 휴가 리스트 조회
        PageInfo<VacationRecordDto> vacationRecordDtoList = PageInfo.of(vacationRecordService.getVacationRecordListFromPayment(vacationRecordDto, pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("vacationRecordDtoList", vacationRecordDtoList);
        model.addAttribute("step", step);
        model.addAttribute("type", type);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", vacationRecordDtoList);
        model.addAttribute("pageNum", pageNum);

        // 조회 구분 [-1 = 전체], [1 = 상신], [2 = 결재완료], [3 = 반려], [4 = 임시보관]
        model.addAttribute("status", status);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간, 3 = 연간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 연간 = yearly, 둘다 = all)
        model.addAttribute("dateSearchType", DATE_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜, 시작일, 종료일
        model.addAttribute("requestDate", requestDate);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 페이지 정보
        model.addAttribute("urlName", MY_VACATION_LIST);
        model.addAttribute("title", MY_VACATION_LIST);
        return "vacation/paymentVacationList";
    }

    /**
     * 휴가 상세 정보 조회
     * @param vacationRecordNo
     * @param model
     * @return
     */
    @GetMapping("/vacationInfo")
    public String vacationInfo(@RequestParam(value = "vacationRecordNo") int vacationRecordNo,
                               Model model){


        // 휴가 상세 정보 조회
        VacationRecordDto vacationRecordDto = vacationRecordService.getVacationRecord(vacationRecordNo);
        model.addAttribute("vacationRecordDto", vacationRecordDto);

        String employeeCode = vacationRecordDto.getEmployeeCode();
        String year = vacationRecordDto.getYear();

        // 신청자 보유 휴가 정보 조회
        VacationDto vacationByEmployee = vacationService.getVacationByEmployee(year, employeeCode);
        model.addAttribute("vacationByEmployee", vacationByEmployee);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(vacationRecordDto.getAttacheFiles());
        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("fileList", fileList);

        // 첨부파일 이미지 출력
        List<String> imgFileUrl = new ArrayList<>();
        for(String fileUrl : fileList) {
            //확장자 추출 후 특정 확장자 배열에 있는 확장자 일 경우 이미지 노출
            String ext = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
            if(Arrays.asList(IMAGE_EXTENSION).contains(ext)) {
                imgFileUrl.add(cloudUrl + fileUrl);
            }
        }
        model.addAttribute("imgFileUrl", imgFileUrl);

        // 결재 > 결재자, 참조자 조회 (결재 fragment 에서 사용할 데이터 세팅)
        PaymentDto payment = commonPaymentService.getPaymentEmployee(vacationRecordNo, BOARD_TYPE);
        payment = payment != null ? payment : new PaymentDto();
        payment.setPaymentNo(vacationRecordNo);
        payment.setDraftEmployeeCode(employeeCode);
        payment.setStatus(vacationRecordDto.getStatus());
        model.addAttribute("payment", payment);

        // 결재 > 필수 정보
        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());
        model.addAttribute("boardType", BOARD_TYPE);
        model.addAttribute("no", vacationRecordDto.getVacationRecordNo());

        // 페이지 정보
        model.addAttribute("urlName", VACATION_INFO);
        model.addAttribute("title", VACATION_INFO);

        return "vacation/vacationInfo";
    }
}
