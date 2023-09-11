package com.kupstudio.incompany.controller.payment;

import com.kupstudio.incompany.cacheService.company.CompanyCacheService;
import com.kupstudio.incompany.cacheService.department.DepartmentCacheService;
import com.kupstudio.incompany.dto.payment.PaymentFormDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.payment.PaymentFormModifyService;
import com.kupstudio.incompany.service.payment.PaymentFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/myPage/payment")

@RequiredArgsConstructor
public class PaymentFormController {


    private final PaymentFormModifyService paymentFormModifyService;

    private final PaymentFormService paymentFormService;
    private final CompanyCacheService companyCacheService;
    private final DepartmentCacheService departmentSelectService;
    private final String PAYMENT_FORM_TITLE = "결재 양식";

    @GetMapping("/paymentForm")
    public String getPaymentForm(Model model, @AuthenticationPrincipal EmployeePrincipal employee) {
        String loginEmployeeCode = employee.getUsername();
        String loginCompanyCode = employee.getCompanyCode();

        String loginDepartmentCode = employee.getDepartmentCode();

        Collection<? extends GrantedAuthority> auths = employee.getAuthorities();
        Boolean hasAuth = false;
        if (auths.stream().anyMatch(role -> role.getAuthority().equals(AuthNameEnum.PAYMENT_FORM.getMeaning()))) {
            hasAuth = true;
        }
        List<PaymentFormDto> paymentFormList = paymentFormModifyService.getPaymentFormList(loginEmployeeCode, loginCompanyCode, loginDepartmentCode, hasAuth);


        model.addAttribute("title", PAYMENT_FORM_TITLE);
        model.addAttribute("urlName", PAYMENT_FORM_TITLE);    // 컨텐츠 상단 현재 페이지 명

        model.addAttribute("allCompany", companyCacheService.getAllCompanyList());
        model.addAttribute("allDepartment", departmentSelectService.getAllDepartmentList());
        model.addAttribute("paymentFormList", paymentFormList);

        return "myPage/payment/paymentForm";
    }


    @ResponseBody
    @GetMapping("/paymentFormInfo")
    public PaymentFormDto getPaymentFormInfo(Integer paymentFormNo) {

        return paymentFormService.getPaymentForm(paymentFormNo);

    }

    @ResponseBody
    @DeleteMapping("/paymentForm")
    public Integer deletePaymentForm(Integer paymentFormNo) {

        return paymentFormModifyService.deletePaymentForm(Integer.valueOf(paymentFormNo));
    }

    @ResponseBody
    @PostMapping("/paymentForm")
    public String updatePaymentForm(@RequestBody Map<String, Object> data,
                                    @AuthenticationPrincipal EmployeePrincipal employee) {
        String loginEmployeeCode = employee.getUsername();
        if (data.containsKey("paymentFormNo")) {
            return paymentFormModifyService.updatePaymentForm(data, loginEmployeeCode);

        } else {
            return paymentFormModifyService.addPaymentForm(data, loginEmployeeCode);
        }

    }
}
