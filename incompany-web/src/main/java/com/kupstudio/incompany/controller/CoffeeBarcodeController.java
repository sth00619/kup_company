package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.CoffeeBarcodeService;
import com.kupstudio.incompany.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@Controller
@RequiredArgsConstructor
public class CoffeeBarcodeController {

    private final CoffeeBarcodeService coffeeBarcodeService;
    private final AuthService authService;

    @GetMapping("/coffeeBarcode/{barcode}")
    public String coffeeBarcode(@PathVariable( value = "barcode") String barcode){
            return "coffeeBarcode";
    }

    @GetMapping("/getIsUsableBarcode")
    @ResponseBody
    public boolean getIsUsableBarcode(String barcode){
        return coffeeBarcodeService.isUsableBarcode(barcode);
    }
    @GetMapping("/getUsedTime")
    @ResponseBody
    public String getUsedTime(String barcode){
        return coffeeBarcodeService.getUsedTime(barcode);
    }

    @GetMapping("/coffeeBarcodeInput")
    public String coffeeBarcodeInput(){
        if(authService.hasAuth(AuthNameEnum.CAFE_COFFEE_BARCODE_INPUT) == false)
            return "";
        return "coffeeBarcodeInput";
    }
    @PutMapping("/coffeeBarcodeInput")
    @ResponseBody
    public String usingCoffeeBarcode(String barcode){
        if(authService.hasAuth(AuthNameEnum.CAFE_COFFEE_BARCODE_INPUT) == false)
            return "";
        return coffeeBarcodeService.usingCoffeeBarcode(barcode);
    }

}
