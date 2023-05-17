package com.lhwortfolio.service;

import java.util.List;
import java.util.Map;

public interface LifeService {

	Object getLife(String lifeFileDownloadPath, String type);
	
	List<Map<String, Object>> getLife();

}
