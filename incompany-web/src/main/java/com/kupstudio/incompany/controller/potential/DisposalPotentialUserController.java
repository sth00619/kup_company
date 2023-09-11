package com.kupstudio.incompany.controller.potential;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.config.CommonEncryptConfig;
import com.kupstudio.incompany.dto.potential.DisposalPotentialUserDto;
import com.kupstudio.incompany.service.potential.DisposalPotentialUserService;
import com.kupstudio.incompany.service.potential.PotentialUserService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequiredArgsConstructor
@RequestMapping("/potential")
public class DisposalPotentialUserController {

    private final DisposalPotentialUserService disposalPotentialUserService;

    // 한 페이지당 게시글 갯수
    private final int COUNT_PER_PAGE = 10;

    private final String DEFAULT_PAGE_STR = "1";
    private final String DISPOSAL_LIST = "회수고객 리스트";
    @Autowired
    PotentialUserService potentialUserService;


    @GetMapping("/disposalUser")
    public String disposalUserList(Model model,
                                   @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                   @RequestParam(value = "searchValue", required = false) String searchValue,
                                   @RequestParam(value = "searchKey", required = false) String searchKey) throws Exception {

        PageInfo<DisposalPotentialUserDto> disposalUserList = PageInfo.of(disposalPotentialUserService.getDisposalPotentialUserList(pageNum, COUNT_PER_PAGE, searchKey, searchValue), COUNT_PER_PAGE);
        model.addAttribute("disposalUserList", disposalUserList);
        model.addAttribute("pageList", disposalUserList);
        model.addAttribute("searchValue", searchValue);
        disposalUserList = PageInfoUtil.setPageNation(disposalUserList, pageNum, COUNT_PER_PAGE);
        for (DisposalPotentialUserDto user : disposalUserList.getList()) {
            String decryptedMobile = user.getDecryptMobile(); // mobile 값을 복호화합니다
            user.setMobile(decryptedMobile); // 복호화된 mobile 값을 세팅합니다
        }

        model.addAttribute("originalSearchValue", searchValue);

        if (searchKey != null && searchKey.equals("mobile")) {
            searchValue = CommonEncryptConfig.encryptAes(searchValue, CommonEncryptConfig.ENCRYPT_KEY_POTENTIAL_USER);
        }

        model.addAttribute("pageNum", pageNum);
        // 검색
        model.addAttribute("searchKey", searchKey);

        model.addAttribute("urlName", DISPOSAL_LIST);
        model.addAttribute("title", DISPOSAL_LIST);
        return "potential/disposalUser";
    }

}
