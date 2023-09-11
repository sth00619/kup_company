package com.kupstudio.incompany.controller.vietnam.maaden;

import com.kupstudio.incompany.dto.vietnam.maaden.AccountDto;
import com.kupstudio.incompany.service.vietnam.maaden.MaadenAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/maaden/account")
@RequiredArgsConstructor
public class MaadenAccountController {

    private final MaadenAccountService accountService;


    @GetMapping("/list")
    public String accountList(Model model) {

        List<AccountDto> accountList = accountService.getAccountList();
        model.addAttribute("accountList", accountList);

        return "vietnam/maaden/account/list";

    }

    @GetMapping("/info")
    public String accountInfo(Model model, Integer poIdxNo) {

        AccountDto accountDto = accountService.getAccount(poIdxNo);
        model.addAttribute("a", accountDto);


        return "vietnam/maaden/account/info";

    }

    @ResponseBody
    @PostMapping("/info")
    public void updateAccount(AccountDto accountDto) {
        accountService.updateAccount(accountDto);
    }

    @ResponseBody
    @PostMapping("/update")
    public void updateAccount(String columnName,
                              String value,
                              int poIdxNo,
                              String poNo,
                              String action) {
        accountService.updateAccountPart(columnName, value, poIdxNo, poNo, action);
    }
}
