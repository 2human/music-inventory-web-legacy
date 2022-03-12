package com.toohuman.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
public class WebMainController {

    @RequestMapping(value = "/")
    public String home() {
        return "index.html";
    }
    
    @RequestMapping(value = "/guide")
    public String guide() {
        return "guide.html";
    }
    
    @RequestMapping(value = "/about")
    public String about() {
        return "about.html";
    }
    
    @RequestMapping(value = "login")
    public String login() {
		return "login.html";
    }
    
    @RequestMapping(value = "/editmode") 
    public String editMode() {
    	return "editmode.html";
    }
    
}