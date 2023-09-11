package com.kupstudio.incompany.controller.vietnam.maaden;

import com.kupstudio.incompany.dto.vietnam.maaden.PurchaseOrderDto;
import com.kupstudio.incompany.service.vietnam.maaden.MaadenPurchaseOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/maaden")
@RequiredArgsConstructor
public class MaadenPurchaseOrderController {

    private final MaadenPurchaseOrderService purchaseOrderService;

    @GetMapping("/purchaseOrder")
    public String purchaseOrderNoList(Model model) {

        List<PurchaseOrderDto> purchaseOrderNoList = purchaseOrderService.getPurchaseOrderNoList();
        model.addAttribute("purchaseOrderNoList", purchaseOrderNoList);

        return "vietnam/maaden/purchaseOrder";

    }

    @ResponseBody
    @PostMapping("/insertPurchaseOrderNo")
    public void insertPurchaseOrderNo(@RequestParam(value = "poNo") String poNo) {
        purchaseOrderService.insertPurchaseOrderNo(poNo);

    }

    @ResponseBody
    @PutMapping("/updateValue")
    public void updateValue(@RequestParam(value = "poIdxNo") int poIdxNo,
                            @RequestParam(value = "poNo") String poNo,
                            @RequestParam(value = "columnName") String columnName,
                            @RequestParam(value = "value") String value
    ) {

        purchaseOrderService.updateValue(poIdxNo, poNo, columnName, value);

    }

    @ResponseBody
    @GetMapping("/checkValIncluded")
    public String updateValue(@RequestParam(value = "poIdxNo") int poIdxNo) {

        return purchaseOrderService.checkValIncluded(poIdxNo);

    }

//
//    @ResponseBody
//    @DeleteMapping("/deletePurchaseOrderNo")
//    public void deletePurchaseOrderNo(@RequestParam(value = "poIdxNo") int poIdxNo) {
//        purchaseOrderService.deletePurchaseOrderNo(poIdxNo);
//
//    }


}
