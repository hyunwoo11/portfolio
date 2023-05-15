package com.lhwortfolio.service.Impl;

import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.lhwortfolio.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	@Value("${spring.mail.username}")
	String from;

	@Autowired
	private JavaMailSender emailSender;

	private static final Logger LOGGER = LoggerFactory.getLogger(EmailServiceImpl.class);

	@Override
	public boolean sendEmail(String email, String content) throws Exception {
		if (email == null || email.equals("")) {
			throw new IllegalArgumentException("이메일과 내용은 필수 입력 항목입니다.");
		}
		MimeMessage m = emailSender.createMimeMessage();
		MimeMessageHelper h = new MimeMessageHelper(m, "UTF-8");
		h.setFrom(from);
		h.setTo(from);
		h.setSubject("[포트폴리오]를 통해 들어온 이메일 문의");
		h.setText("회신을 원하는 이메일 주소:" + email + "\n\n" + content);
		emailSender.send(m);
		LOGGER.info("sendEmail success -- " + email + "," + content);
		return true;
	}

}
