package com.houttuynia.web.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * PublicController
 *
 * @author clp
 * @date 2023-9-5 15:30
 */
@RequestMapping("system/public")
@Controller
public class SysPublicController {

    @GetMapping("/icons")
    public String icons() {
        return "public/icons";
    }
}
