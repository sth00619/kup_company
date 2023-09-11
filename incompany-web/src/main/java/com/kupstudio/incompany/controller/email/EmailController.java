package com.kupstudio.incompany.controller.email;


import com.kupstudio.incompany.service.email.CompanyEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
public class EmailController {


    private final CompanyEmailService companyEmailService;

    // 사원 추가
    @GetMapping("/duplicate")
    public int duplicateCompanyEmail(String companyEmail) {
        return companyEmailService.isConfirmByCompanyEmail(companyEmail);
    }

}
