package com.ahucoding.rocket.mcpclient.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author 影子（关注公众号：硬核的子牙和周瑜；获取资料）
 * 2025/03/18/下午8:02
 */
@Controller
public class IndexController {

    @GetMapping("/")
    public String chat(Model model) {
        //model.addAttribute("name", "User");
        // 返回视图名称，对应 templates/index.html
        return "index";
    }

}
