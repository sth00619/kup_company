package com.kupstudio.incompany.controller.vietnam.novelis;

import com.kupstudio.incompany.dto.vietnam.novelis.PdCostDto;
import com.kupstudio.incompany.service.vietnam.novelis.NovelisPdCostService;
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
@RequestMapping("vietnam/novelis/pdCost")
@RequiredArgsConstructor
public class NovelisPdCostController {

    private final NovelisPdCostService pdCostService;

    @GetMapping("/list")
    public String pdCostList(Model model) {

        List<PdCostDto> pdCostList = pdCostService.getPdCostList();
        model.addAttribute("pdCostList", pdCostList);

        return "vietnam/novelis/pdCost/list";

    }

    @GetMapping("/info")
    public String pdCostInfo(Model model, Integer poIdxNo) {

        PdCostDto pdCostDto = pdCostService.getPdCost(poIdxNo);
        model.addAttribute("pc", pdCostDto);


        return "vietnam/novelis/pdCost/info";

    }

    @ResponseBody
    @PostMapping("/info")
    public void updatePdCostInfo(PdCostDto pdCostDto) {
        pdCostService.updatePdCost(pdCostDto);
    }

    @ResponseBody
    @PostMapping("/update")
    public void updatePdCost(String columnName,
                             String value,
                             int poIdxNo,
                             String poNo,
                             String action) {
        pdCostService.updateAccountPart(columnName, value, poIdxNo, poNo, action);
    }
}
