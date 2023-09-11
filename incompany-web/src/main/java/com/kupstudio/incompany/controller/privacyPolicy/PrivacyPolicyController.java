package com.kupstudio.incompany.controller.privacyPolicy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/privacyPolicy")
public class PrivacyPolicyController {

    @GetMapping("/privacyPolicy")
    public String privacyPolicy() {

        return "privacyPolicy/privacyPolicy";
    }
}
