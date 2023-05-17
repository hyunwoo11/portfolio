package com.lhwortfolio.service.Impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.lhwortfolio.service.LifeService;

@Service
public class LifeServiceImpl implements LifeService {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public Object getLife(String lifeFileDownloadPath, String type) {
		logger.info("개인 취미 생활 경로 : " + lifeFileDownloadPath);
		List<String> fileList = new ArrayList<>();
		String path = lifeFileDownloadPath + "\\";
		File directory = new File(path);
		// 디렉토리가 존재하면 Java 파일 목록 생성
		if (directory.exists() && directory.isDirectory()) {
			String[] filenames = directory.list();
			for (String filename : filenames) {
				fileList.add("/assets/img/" + type + "/" + filename);
			}
		}
		return fileList;
	}

	@Override
	public List<Map<String, Object>> getLife() {
		List<Map<String, Object>> resultList = new LinkedList<>();
		String[] paths = { "all", "bicycle", "travel", "fishbowl" };
		String lifeFileDownloadPath = "./src/main/resources/static/assets/img/";

		for (String path : paths) {
			String classType = getClassType(path);
			String realPath = lifeFileDownloadPath + path + "\\";
			File directory = new File(realPath);

			// 디렉토리가 존재하면 Java 파일 목록 생성
			if (directory.exists() && directory.isDirectory()) {
				String[] filenames = directory.list();
				for (int i = 0; i < filenames.length; i++) {
					String filename = filenames[i];
					if(i <= 1 ) {
						Map<String, Object> resultMap = createResultMap(path, filename, classType);
						resultList.add(resultMap);
					}
				}
			}
		}
		return resultList;
	}

	private String getClassType(String path) {
		String classType = null;
		if (path.equals("all")) {
			classType = "*";
		} else if (path.equals("bicycle")) {
			classType = "web-des";
		} else if (path.equals("travel")) {
			classType = "web-dev";
		} else if (path.equals("fishbowl")) {
			classType = "dig-mar";
		}
		return classType;
	}

	private Map<String, Object> createResultMap(String path, String filename, String classType) {
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("img", "/assets/img/" + path + "/" + filename);
		resultMap.put("class", classType);
		return resultMap;
	}
}
