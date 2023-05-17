package com.lhwortfolio.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lhwortfolio.service.EmailService;
import com.lhwortfolio.service.LifeService;
import com.lhwortfolio.service.TistoryService;

@Controller
public class HomeController {

	private final TistoryService tistoryService;

	private final EmailService emailService;

	private final LifeService lifeService;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	public HomeController(TistoryService tistoryService, EmailService emailService, LifeService lifeService) {
		this.tistoryService = tistoryService;
		this.emailService = emailService;
		this.lifeService = lifeService;
	}

	@GetMapping("/")
	public String index(HttpServletRequest request, Model model) {
		try {
			model.addAttribute("posts", tistoryService.getPosts());
//			model.addAttribute("imgLists", lifeService.getLife());
		} catch (Exception e) {
			logger.error("Error occurred while fetching posts from Tistory.", e);
		}
		return "introduce/index";
	}

	@PostMapping("/sendMail")
	public String sendMail(@RequestParam String email, @RequestParam String message, Model model) {
		try {
			emailService.sendEmail(email, message);
			model.addAttribute("msg", true);
		} catch (Exception e) {
			logger.error("Error occurred while sending email.", e);
		}
		return "introduce/index :: #msgSubmit";
	}
}
