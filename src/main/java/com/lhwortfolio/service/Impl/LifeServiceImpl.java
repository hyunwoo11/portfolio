package com.lhwortfolio.service.Impl;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

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
}
