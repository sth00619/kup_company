package com.kupstudio.incompany.controller.vietnam.maaden;

import com.kupstudio.incompany.dto.vietnam.maaden.KhSouthKoreaDto;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.vietnam.maaden.MaadenKhSouthKoreaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/maaden/khSouthKorea")
@RequiredArgsConstructor
public class MaadenKhSouthKoreaController {

    private final static String DIRECTORY_PATH = "vietnam/maaden/kh_south_korea_doc/";

    private final MaadenKhSouthKoreaService khSouthKoreaService;
    private final CloudService cloudService;
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/list")
    public String khSouthKoreaList(Model model) {


        List<KhSouthKoreaDto> khSouthKoreaList = khSouthKoreaService.getKhSouthKoreaList();

        model.addAttribute("khSouthKoreaList", khSouthKoreaList);

        return "vietnam/maaden/khSouthKorea/list";

    }


    @GetMapping("/info")
    public String khSouthKoreaInfo(Model model, Integer poIdxNo) {

        KhSouthKoreaDto khSouthKoreaDto = khSouthKoreaService.getKhSouthKorea(poIdxNo);
        model.addAttribute("ksk", khSouthKoreaDto);

        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);


        return "vietnam/maaden/khSouthKorea/info";

    }

    @GetMapping("/edit")
    public String khSouthKoreaForm(Model model, Integer poIdxNo) {
        KhSouthKoreaDto khSouthKoreaDto = khSouthKoreaService.getKhSouthKorea(poIdxNo);
        model.addAttribute("ksk", khSouthKoreaDto);
        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);


        return "vietnam/maaden/khSouthKorea/edit";
    }

    @PostMapping("/info")
    public String updateKhSouthKorea(KhSouthKoreaDto khSouthKoreaDto, MultipartHttpServletRequest request) {


        khSouthKoreaService.updateKhSouthKorea(khSouthKoreaDto, request);
        return "redirect:/vietnam/maaden/khSouthKorea/info?poIdxNo=" + khSouthKoreaDto.getPoIdxNo();

    }


    @ResponseBody
    @PostMapping("/update")
    public void updateKhSouthKoreaPart(String columnName,
                                       String value,
                                       int poIdxNo, String poNo, String action) {
        khSouthKoreaService.updateKhSouthKoreaPart(columnName, value, poIdxNo, poNo, action);
    }

    @ResponseBody
    @DeleteMapping("/deleteFile")
    public void deleteFile(String fileName) {
        cloudService.delete(DIRECTORY_PATH + fileName);

    }

}
