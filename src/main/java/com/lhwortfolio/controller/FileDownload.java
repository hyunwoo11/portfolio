package com.lhwortfolio.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class FileDownload {

//	private String fileDownloadPath = "C:\\lee_hyunwoo\\workspace\\portfolio\\src\\main\\resources\\static\\assets\\file\\";
	private String fileDownloadPath = "/var/lib/tomcat9/webapps/file/";
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@RequestMapping(value = "/getCareerFiledown", method = RequestMethod.GET)
	public void getCareerFiledown(@RequestParam String careerFileNm, HttpServletRequest request,
			HttpServletResponse response) {

		if (careerFileNm.isEmpty()) {
			logger.error("careerFileNm 값이 없습니다.");
			return;
		}

		String fileType = careerFileNm.equals("lhwCareer") ? "이현우_경력이력서" : "사림인_이력서";
		String fileNm = fileType + ".pdf";
		String encodedFileName = null;
		
		try {
			encodedFileName = encodeFileName(fileNm);
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		File downFile = new File(fileDownloadPath + fileNm);

		logger.info("===== 이현우 경력기술서 다운로드 =====");
		logger.info("파일 생성 여부 확인 : {}", downFile.exists());

		if (!downFile.exists()) {
			logger.error("File not found: {}", downFile.getAbsolutePath());
			response.setStatus(HttpStatus.NOT_FOUND.value());
			return;
		}

		try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(downFile));
				BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream())) {
			response.setContentType("application/x-pdf");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFileName + "\"");
			response.setHeader("Content-Transfer-Encoding", "binary;");
			response.setHeader("Pragma", "no-cache;");
			response.setHeader("Expires", "-1;");
			response.setHeader("Set-Cookie", "fileDownload=true; path=/;HttpOnly");
			response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			response.setContentLengthLong(downFile.length());

			byte[] buffer = new byte[1024];
			int numRead = 0;
			while ((numRead = bis.read(buffer, 0, buffer.length)) != -1) {
				bos.write(buffer, 0, numRead);
			}
			bos.flush();
		} catch (IOException e) {
			logger.error("Failed to download file: {}", downFile.getAbsolutePath(), e);
			response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		}
	}

	private String encodeFileName(String fileName) throws UnsupportedEncodingException {
//		String encodedFileName = "";
		fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20"); 
//		if (header.contains("MSIE") || header.contains("Trident")) {
//			encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
//		} else if (header.contains("Chrome")) {
//			encodedFileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
//		} else {
//			encodedFileName = URLEncoder.encode(fileName, "UTF-8");
//		}
		return fileName;
	}
}
