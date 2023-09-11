package com.kupstudio.incompany.controller.vietnam;

import com.kupstudio.incompany.dto.vietnam.OperatingCostDto;
import com.kupstudio.incompany.service.vietnam.OperatingCostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/operatingCost")
@RequiredArgsConstructor
public class OperatingCostController {

    private final OperatingCostService operatingCostService;


    @GetMapping("/list")
    public String operatingCostList(Model model) {
        List<OperatingCostDto> operatingList = operatingCostService.getOperatingList();
        model.addAttribute("operatingList", operatingList);
        return "vietnam/operatingCost/list";

    }

    @GetMapping("/info")
    public String operatingCost(Model model, @RequestParam(required = false) Integer no, String date) {

        if (no != null) {
            OperatingCostDto operatingCost = operatingCostService.getOperatingCost(no);
            model.addAttribute("oc", operatingCost);
        } else {
            OperatingCostDto operatingCost = new OperatingCostDto();
            model.addAttribute("oc", operatingCost);

        }
        model.addAttribute("date", date);
        return "vietnam/operatingCost/info";

    }


    @ResponseBody
    @PostMapping("/info")
    public void updateOperatingCost(OperatingCostDto operatingCostDto) {
        operatingCostService.updateOperatingCost(operatingCostDto);
    }


    @ResponseBody
    @PostMapping("/form")
    public Integer insertOperatingCost(OperatingCostDto operatingCostDto) {
        return operatingCostService.insertOperatingCost(operatingCostDto);
    }


}
