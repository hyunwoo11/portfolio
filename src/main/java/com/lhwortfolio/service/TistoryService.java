package com.lhwortfolio.service;

import java.util.List;
import java.util.Map;

public interface TistoryService {
	
	List<Map<String,Object>> getPosts() throws Exception;
	
	List<Map<String,Object>> getPostDetail(List<Integer> postIds) throws Exception;

	List<Integer> getPostIds() throws Exception;


}
