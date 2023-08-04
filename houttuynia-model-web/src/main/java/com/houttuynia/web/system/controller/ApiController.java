package com.houttuynia.web.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

/**
 * ApiController
 *
 * @author clp
 * @date 2023-8-4 15:34
 */
@RequestMapping("system/api")
@Controller
public class ApiController {
    @GetMapping("list")
    public String list() {
        return "pages/system/api/list";
    }
}

