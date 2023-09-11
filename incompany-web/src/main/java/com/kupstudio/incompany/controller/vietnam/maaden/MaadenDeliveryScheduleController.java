package com.kupstudio.incompany.controller.vietnam.maaden;

import com.kupstudio.incompany.dto.vietnam.maaden.DeliveryScheduleDto;
import com.kupstudio.incompany.service.vietnam.maaden.MaadenDeliveryScheduleService;
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
@RequestMapping("vietnam/maaden/deliverySchedule")
@RequiredArgsConstructor
public class MaadenDeliveryScheduleController {

    private final MaadenDeliveryScheduleService deliveryScheduleService;


    @GetMapping("/list")
    public String deliveryScheduleList(Model model) {

        List<DeliveryScheduleDto> deliveryScheduleList = deliveryScheduleService.getDeliveryScheduleList();
        model.addAttribute("deliveryScheduleList", deliveryScheduleList);


        return "vietnam/maaden/deliverySchedule/list";

    }

    @GetMapping("/info")
    public String deliveryScheduleInfo(Model model, Integer poIdxNo) {

        DeliveryScheduleDto deliverySchedule = deliveryScheduleService.getDeliverySchedule(poIdxNo);
        model.addAttribute("ds", deliverySchedule);


        return "vietnam/maaden/deliverySchedule/info";

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
