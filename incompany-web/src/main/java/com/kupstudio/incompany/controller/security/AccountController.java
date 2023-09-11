package com.kupstudio.incompany.controller.security;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dao.company.EmployeeMapper;
import com.kupstudio.incompany.security.EmployeeDetailService;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.email.CompanyEmailService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


@Controller
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final static Logger log = LoggerFactory.getLogger(DepartmentService.class);
    private final static String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private final String RESET_PASSWORD_TITLE = "비밀번호초기화";
    private final EmployeeDetailService employeeDetailService;
    private final EmployeeCacheService employeeCacheService;
    private final CompanyEmailService companyEmailService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeMapper employeeMapper;

    @GetMapping("login")
    public String loadExceptionPage(Model model) {


        return "account/login";
    }

    @GetMapping("/register")
    public String registerEmployee(String employeeCode, Model model) throws ParseException {
        UserDetails getEmployee = employeeDetailService.loadUserByUsername(employeeCode);
        model.addAttribute("employee", getEmployee);


        Date getEmailTime = employeeDetailService.getEmailTime(employeeCode);
        Date getCurrentTime = new Date();

        SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT);

        String emailTime = format.format(getEmailTime);
        String time = format.format(getCurrentTime);

        Date format1 = new SimpleDateFormat(DATE_FORMAT).parse(emailTime);
        Date format2 = new SimpleDateFormat(DATE_FORMAT).parse(time);


        log.debug("##등록날짜 -> " + emailTime);
        log.debug("##지금날짜 -> " + time);

        long diffMin = (format2.getTime() - format1.getTime()) / 60000;

        log.debug(diffMin + "분차이");
        log.debug("##이름->" + getEmployee.getUsername());
        log.debug("##비번->" + getEmployee.getPassword());


        if (diffMin <= 30) { // 30분 이전
            return "account/register";
        } else { // 30분 이후
            return "account/timeOut";
        }


    }

    public String encodePassword(String password) {
        if (StringUtils.isEmpty(password)) {
            return employeeService.DEFAULT_PASSWORD;
        } else {
            // 암호화 추가
            BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();
            return bCrypt.encode(password);
        }
    }

    public void updateEmployeePassword(String employeeCode, String password) {
        String updatePw = encodePassword(password);
        employeeMapper.updateEmployeePassword(employeeCode, updatePw);
    }

    @ResponseBody
    @PutMapping("/register")
    public Boolean updateEmployeePassword(String employeeCode, String beforePassword, String password) {
        log.debug("password 수정 ->" + password);
        String employeePw = employeeDetailService.loadUserByUsername(employeeCode).getPassword();

        if (encoder.matches(beforePassword, employeePw)) {
            log.debug("password 일치함");
            String updatePw = encodePassword(password);
            employeeDetailService.updateEmployeePassword(employeeCode, password);
            // 비밀번호 일치하는 경우 그룹웨어 비밀번호가 변경될 때 이메일 계정 비밀번호 동시에 변경
            companyEmailService.updateCompanyPassword(employeeCode, updatePw);
            return true;
        } else {
            log.debug("password 일치하지 않음");
            return false;
        }
    }


    @GetMapping("/reset")
    public String resetPassword(Model model) {
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("urlName", RESET_PASSWORD_TITLE);
        model.addAttribute("title", RESET_PASSWORD_TITLE);
        return "account/reset";
    }

    @ResponseBody
    @PutMapping("/reset")
    public void resetPassword(String employeeCode) {

        employeeDetailService.updateEmployeePassword(employeeCode, null);

    }


}