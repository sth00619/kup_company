package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.service.CommonEncryptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
public class CommonEncryptController {

    private final CommonEncryptService commonEncryptService;

    @PostMapping("/commonEncrypt")
    public String commonEncrypt() throws Exception {

        commonEncryptService.getMobileOfEmployee();

        return "redirect:/commonEncrypt";
    }

    @GetMapping("/commonEncrypt")
    public String commonEncryptForm() {

        return "commonEncrypt";
    }

    @PostMapping("/potentialUserEncrypt")
    public String potentialUserEncrypt() throws Exception {

        commonEncryptService.getMobileOfPotentialUser();

        return "redirect:/potentialUserEncrypt";
    }

    @GetMapping("/potentialUserEncrypt")
    public String potentialUserEncryptForm() {

        return "potentialUserEncrypt";
    }

}
