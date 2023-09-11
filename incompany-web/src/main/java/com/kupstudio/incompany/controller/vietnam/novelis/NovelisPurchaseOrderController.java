package com.kupstudio.incompany.controller.vietnam.novelis;

import com.kupstudio.incompany.dto.vietnam.novelis.PurchaseOrderDto;
import com.kupstudio.incompany.service.vietnam.novelis.NovelisPurchaseOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/novelis")
@RequiredArgsConstructor
public class NovelisPurchaseOrderController {

    private final NovelisPurchaseOrderService purchaseOrderService;

    @GetMapping("/purchaseOrder")
    public String purchaseOrderNoList(Model model) {

        List<PurchaseOrderDto> purchaseOrderNoList = purchaseOrderService.getPurchaseOrderNoList();
        model.addAttribute("purchaseOrderNoList", purchaseOrderNoList);

        return "vietnam/novelis/purchaseOrder";

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
