package com.lhwortfolio.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class JsController {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	
//	@Autowired
//	public JsController(TistoryService tistoryService, EmailService emailService) {
//		this.tistoryService = tistoryService;
//		this.emailService = emailService;
//	}
	
	@GetMapping("/jQuerySyntax")
	public String index(HttpServletRequest request, Model model) throws InterruptedException {
		try {
			System.out.println("================== jQuerySyntax page 실행 ===============================================");
		} catch (Exception e) {
			logger.error("Error occurred while fetching posts from Tistory.", e);
		}
		return "introduce/jQuerySyntax";
	}
	
}
