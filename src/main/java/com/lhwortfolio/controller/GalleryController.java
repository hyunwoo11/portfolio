package com.lhwortfolio.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.lhwortfolio.service.LifeService;

@Controller
public class GalleryController {

	private final LifeService lifeService;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	public GalleryController(LifeService lifeService) {
		this.lifeService = lifeService;
	}
	
	@GetMapping("/gallery")
	public String gallery(HttpServletRequest request, Model model) {
		
		try {
			model.addAttribute("imgLists", lifeService.getLife());
		} catch (Exception e) {
			logger.error("Error occurred while fetching posts from Tistory.", e);
		}
		return "introduce/gallery";
	}
}
