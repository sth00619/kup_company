package com.kupstudio.incompany.controller.vietnam.novelis;

import com.kupstudio.incompany.dto.vietnam.novelis.DeliveryScheduleDto;
import com.kupstudio.incompany.service.vietnam.novelis.NovelisDeliveryScheduleService;
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
@RequestMapping("vietnam/novelis/deliverySchedule")
@RequiredArgsConstructor
public class NovelisDeliveryScheduleController {

    private final NovelisDeliveryScheduleService deliveryScheduleService;


    @GetMapping("/list")
    public String deliveryScheduleList(Model model) {

        List<DeliveryScheduleDto> deliveryScheduleList = deliveryScheduleService.getDeliveryScheduleList();
        model.addAttribute("deliveryScheduleList", deliveryScheduleList);


        return "vietnam/novelis/deliverySchedule/list";

    }

    @GetMapping("/info")
    public String deliveryScheduleInfo(Model model, Integer poIdxNo) {

        DeliveryScheduleDto deliverySchedule = deliveryScheduleService.getDeliverySchedule(poIdxNo);
        model.addAttribute("ds", deliverySchedule);


        return "vietnam/novelis/deliverySchedule/info";

    }

    @ResponseBody
    @PostMapping("/update")
    public void updateKhDeliverySchedule(String columnName,
                                         String value,
                                         int poIdxNo,
                                         String poNo,
                                         String action) {
        deliveryScheduleService.updateDeliverySchedulePart(columnName, value, poIdxNo);
    }

    @ResponseBody
    @PostMapping("/info")
    public void updateKhDeliverySchedule(DeliveryScheduleDto deliveryScheduleDto) {
        deliveryScheduleService.updateDeliverySchedule(deliveryScheduleDto);
    }
}
