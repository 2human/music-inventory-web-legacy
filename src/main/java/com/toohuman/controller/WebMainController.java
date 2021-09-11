package com.toohuman.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebMainController {

    @RequestMapping(value = "/")
    public String home() {
        return "index.html";
    }
}

