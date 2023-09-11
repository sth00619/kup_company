package com.kupstudio.incompany.controller.payment;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.payment.PaymentDto;
import com.kupstudio.incompany.enumClass.payment.PaymentBoardTypeEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.payment.PaymentAndMyPaymentService;
import com.kupstudio.incompany.service.payment.PaymentFormService;
import com.kupstudio.incompany.service.payment.PaymentModifyService;
import com.kupstudio.incompany.service.vacation.VacationService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

@Controller
@Slf4j
@RequestMapping("/myPage/payment")
@RequiredArgsConstructor
public class PaymentController {


    private final static PaymentBoardTypeEnum BOARD_ENUM = PaymentBoardTypeEnum.PAYMENT;
    private final static int BOARD_TYPE = BOARD_ENUM.getBoardType();
    private final String MY_PAGE_DOWN_TITLE = "내가 받은 결제";
    private final String MY_PAGE_UP_TITLE = "내가 올린 결제";
    private final String PAYMENT_FORM = "상신 작성하기";
    private final String DEFAULT_PAGE_STR = "1";
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final EmployeeCacheService employeeCacheService;

    private final PaymentAndMyPaymentService paymentAndMyPaymentService;

    private final CloudService cloudService;

    private final PaymentModifyService paymentModifyService;

    private final PaymentFormService paymentFormService;
    private final VacationService vacationService;

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/contents")
    public String getPayment(Integer paymentNo, Model model,
                             @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();

        PaymentDto payment = paymentModifyService.getPayment(paymentNo, loginEmployeeCode);

        List<String> fileList = cloudService.removeUrl(payment.getAttacheFiles());

        model.addAttribute("p", payment);
        model.addAttribute("fileList", fileList);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("boardType", BOARD_TYPE);

        return "myPage/payment/contents";
    }

    @GetMapping("/form")
    public String paymentForm(Model model, @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();
        String departmentCode = employee.getDepartmentCode();
        String companyCode = employee.getCompanyCode();
        model.addAttribute("paymentFormList", paymentFormService.getPaymentFormListFromPayment(loginEmployeeCode, companyCode, departmentCode));

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("urlName", PAYMENT_FORM);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", PAYMENT_FORM);
        return "myPage/payment/form";
    }

    @ResponseBody
    @PostMapping("/form")
    public Integer addPayment(MultipartHttpServletRequest request,
                              @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();
        boolean isModify = false;

        Integer paymentNo = paymentAndMyPaymentService.addPaymentAndMyPayment(request, loginEmployeeCode, isModify, BOARD_ENUM);

        return paymentNo;
    }


    @GetMapping("/edit")
    public String editPaymentForm(Integer paymentNo, Model model,
                                  @RequestParam(required = false) String isCopy,
                                  @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();
        String departmentCode = employee.getDepartmentCode();
        String companyCode = employee.getCompanyCode();

        PaymentDto payment = paymentModifyService.getPayment(paymentNo, loginEmployeeCode);
        List<String> fileList = cloudService.removeUrl(payment.getAttacheFiles());

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("p", payment);
        model.addAttribute("isCopy", isCopy);

        model.addAttribute("paymentFormList", paymentFormService.getPaymentFormListFromPayment(loginEmployeeCode, companyCode, departmentCode));

        model.addAttribute("fileList", fileList);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        return "myPage/payment/edit";
    }

    @ResponseBody
    @PutMapping("/edit")
    public Integer editPaymentForm(MultipartHttpServletRequest request,
                                   @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();

        Boolean isCopy = Boolean.valueOf(request.getParameter("isCopy"));
        if (isCopy) {
            boolean isModify = false;
            Integer paymentNo = paymentAndMyPaymentService.addPaymentAndMyPayment(request, loginEmployeeCode, isModify, BOARD_ENUM);

            return paymentNo;
        } else {
            boolean isModify = true;
            paymentAndMyPaymentService.updatePaymentAndMyPayment(request, loginEmployeeCode, isModify, BOARD_ENUM);

            return Integer.valueOf(request.getParameter("paymentNo"));
        }
    }

    @DeleteMapping("/contents")
    public String deletePaymentNo(Integer paymentNo) {

        paymentAndMyPaymentService.deletePaymentAndMyPayment(paymentNo);

        return "redirect:/myPage/payment/submit";
    }

    @GetMapping("/received")
    public String paymentReceivedList(Model model,
                                      @AuthenticationPrincipal EmployeePrincipal employee,
                                      @RequestParam(required = false) Integer step,
                                      @RequestParam(required = false) Integer type,
                                      @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                      @RequestParam(required = false) String searchType,
                                      @RequestParam(required = false) String keyword) {

        String loginEmployeeCode = employee.getUsername();
        PageInfo<PaymentDto> paymentList = PageInfo.of(paymentModifyService.getPaymentListFromApprOrRef(loginEmployeeCode, step, type, pageNum, searchType, keyword), COUNT_PER_PAGE);
        paymentList = PageInfoUtil.setPageNation(paymentList, pageNum);

        model.addAttribute("paymentList", paymentList);
        model.addAttribute("urlName", MY_PAGE_UP_TITLE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", MY_PAGE_UP_TITLE);
        model.addAttribute("step", step);
        model.addAttribute("type", type);

        model.addAttribute("pageList", paymentList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("urlName", MY_PAGE_DOWN_TITLE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", MY_PAGE_DOWN_TITLE);

        return "myPage/payment/received";
    }

    @GetMapping("/submit")
    public String paymentSubmitList(Model model, @AuthenticationPrincipal EmployeePrincipal employee,
                                    @RequestParam(required = false) Integer status,
                                    @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                    @RequestParam(required = false) String searchType,
                                    @RequestParam(required = false) String keyword
    ) {

        String loginEmployeeCode = employee.getUsername();
        PageInfo<PaymentDto> paymentList = PageInfo.of(paymentModifyService.getPaymentList(loginEmployeeCode, status, pageNum, searchType, keyword), COUNT_PER_PAGE);
        paymentList = PageInfoUtil.setPageNation(paymentList, pageNum);

        model.addAttribute("paymentList", paymentList);
        model.addAttribute("urlName", MY_PAGE_UP_TITLE);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", MY_PAGE_UP_TITLE);
        model.addAttribute("status", status);
        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("pageList", paymentList);
        model.addAttribute("pageNum", pageNum);

        return "myPage/payment/submit";
    }


    @ResponseBody
    @PutMapping("/step")
    public void updatePaymentStep(@RequestParam(value = "nextApprover", required = false) String nextApprover,
                                  @AuthenticationPrincipal EmployeePrincipal employee,
                                  @RequestParam(value = "boardType") Integer boardType,
                                  @RequestParam(value = "status", required = false) Integer status,
                                  @RequestParam(value = "no") Integer no,
                                  @RequestParam(value = "paymentTitle") String paymentTitle,
                                  @RequestParam(value = "step") Integer step,
                                  @RequestParam(value = "draftEmployeeCode") String draftEmployeeCode) {

        String loginEmployeeCode = employee.getUsername();

        // 결재 처리
        paymentAndMyPaymentService.updatePaymentStatusAndStep(no, status, step, loginEmployeeCode, nextApprover, PaymentBoardTypeEnum.getEnumByBoardType(boardType), paymentTitle, draftEmployeeCode);

        // 최종 승인 시 추가 작업
        if (StringUtils.isEmpty(nextApprover) && step == 2 && status == 2) {
            if (PaymentBoardTypeEnum.getEnumByBoardType(boardType) == PaymentBoardTypeEnum.VACATION) {
                // 휴가 결재 > 최종 승인 시 > 휴가 신청 사원의 보유 연차에서 신청한 휴가 일 수 만큼 증감 (잔여 연차, 유급 일 수, 무급 일 수)
                vacationService.updateVacationOfAddRecord(no);
            }
        }
    }
}
