package main.java.com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Hệ thống quản lý tiêm chủng");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "Giới thiệu");
        return "about";
    }

    @GetMapping("/services")
    public String services(Model model) {
        model.addAttribute("title", "Dịch vụ tiêm chủng");
        return "services";
    }

    @GetMapping("/prices")
    public String prices(Model model) {
        model.addAttribute("title", "Bảng giá dịch vụ");
        return "prices";
    }

    @GetMapping("/guide")
    public String guide(Model model) {
        model.addAttribute("title", "Cẩm nang tiêm chủng");
        return "guide";
    }

    @GetMapping("/contact")
    public String contact(Model model) {
        model.addAttribute("title", "Liên hệ");
        return "contact";
    }
}
