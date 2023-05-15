package com.lhwortfolio.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lhwortfolio.service.LifeService;

@Controller
public class FileDownload {

	private String fileDownloadPath = "C:\\lee_hyunwoo\\workspace\\portfolio\\src\\main\\resources\\static\\assets\\file\\";
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private LifeService lifeService;

	// 취미생활
	@SuppressWarnings("unchecked")
	@GetMapping("/getLife")
	@ResponseBody // Ajax 요청에 대한 응답을 JSON 형태로 반환
	public Object getLife(@RequestParam Map<String, Object> params, Model model) {

		String lifeFileDownloadPath = "C:\\lee_hyunwoo\\workspace\\portfolio\\src\\main\\resources\\static\\assets\\img\\";
		
		Map<String, Object> resultMap = new HashMap<>();

		if (params.equals(params.get("type"))) {
			resultMap.put("success", false);
			resultMap.put("message", "Invalid parameter.");
			return resultMap;
		}
		
		String type = (String) params.get("type");
		
		try {
			// 전체
			if (params.get("type").equals("all")) {
				lifeFileDownloadPath = lifeFileDownloadPath + "all";
			}
			// 자전거
			else if (params.get("type").equals("bicycle")) {
				lifeFileDownloadPath = lifeFileDownloadPath + "bicycle";
			}
			// 여행
			else if (params.get("type").equals("travel")) {
				lifeFileDownloadPath = lifeFileDownloadPath + "travel";
			}
			// 물생활
			else {
				lifeFileDownloadPath = lifeFileDownloadPath + "fishbowl";
			}
			List<String> imgList = (List<String>) lifeService.getLife(lifeFileDownloadPath , type);
			resultMap.put("success", true);
			resultMap.put("imgList", imgList);
			resultMap.put("type", type);
		} catch (Exception e) {
			logger.error("Error occurred while fetching posts from Tistory.", e);
			resultMap.put("success", false);
			resultMap.put("message", "An error occurred while fetching data.");
		}
		return resultMap;
	}

	@RequestMapping(value = "/getCareerFiledown", method = RequestMethod.GET)
	public void getCareerFiledown(@RequestParam String careerFileNm, HttpServletRequest request,
			HttpServletResponse response) {

		if (!careerFileNm.equals(careerFileNm)) {
			logger.error("careerFileNm 값이 없습니다.");
			return;
		}

		String fileType = careerFileNm.equals("lhwCareer") ? "이현우_경력이력서" : "사림인_이력서";
		String fileNm = fileType + ".pdf";
		String encodedFileName = null;
		try {
			encodedFileName = encodeFileName("이현우 경력기술서.pdf", request.getHeader("User-Agent"));
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
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

	private String encodeFileName(String fileName, String header) throws UnsupportedEncodingException {
		String encodedFileName = "";
		if (header.contains("MSIE") || header.contains("Trident")) {
			encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
		} else if (header.contains("Chrome")) {
			encodedFileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		} else {
			encodedFileName = URLEncoder.encode(fileName, "UTF-8");
		}
		return encodedFileName;
	}

	@GetMapping("/getTest/")
	public String getMembers(Model model) throws Exception {
//		<ul id="hiList">
//	    <li>
//	    </li>
//	    <!-- viewmore 클릭시 목록 뿌려주는 부분 -->
//	    <th:block th:if="${memberList != null}" >
//	        <li id="moreList" th:fragment="moreList">
//	        </li>
//	    </th:block>
//	</ul>
//	<!-- 파일 목록 -->
//	<!-- viewmore -->
//	<div class="btnWrap">
//	    <a href="javascript:void(0);" class="btn more" id="hi">View more</a>
//	</div>
		Map<Integer, String> memberList = new HashMap<>(); // <번호, 이름>으로 구성된 가상의 멤버 리스트
		memberList.put(1, "가");
		memberList.put(10, "나");
		memberList.put(20, "다");
		memberList.put(200, "라");

		model.addAttribute("memberList", memberList);

		return "introduce/index :: #testId"; // template html 파일 이름 + '::' + fragment의 id

	}

}
