package com.lhwortfolio.service.Impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.lhwortfolio.service.TistoryService;
import com.lhwortfolio.util.CommonUtils;

@Service
public class TistoryServiceImpl implements TistoryService {

	@Value("${tistory.client_id}")
	String clientId;

	@Value("${tistory.client_secret}")
	String clientSecret;

	@Value("${tistory.code}")
	String code;

	@Value("${tistory.access_token}")
	String accessToken;

	@Value("${tistory.blog_name}")
	String blogName;

	private static final Logger LOGGER = LoggerFactory.getLogger(TistoryServiceImpl.class);

	@Override
	public List<Map<String, Object>> getPosts() throws Exception {
		List<Integer> postIds = this.getPostIds();
		return this.getPostDetail(postIds);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Integer> getPostIds() throws Exception {
		/**
			Tistory 블로그의 최신 10개 게시물의 ID를 가져오는 메소드
			@return List<Integer> 게시물 ID 리스트
			@throws Exception 예외 발생 시 처리
		 */
		// Create a GET request to the Tistory API
		String response = WebClient.create("https://www.tistory.com").get()
				.uri(uriBuilder -> uriBuilder.path("/apis/post/list").queryParam("access_token", accessToken)
						.queryParam("output", "json").queryParam("blogName", blogName).queryParam("page", 1).build())
				.retrieve().bodyToMono(String.class).block();

		// Log the response from the API
		LOGGER.info("getPostIds -- response:" + response);

		// Parse the response as JSON
		JSONParser jsonParser = new JSONParser();
		Object obj = jsonParser.parse(response);
		JSONObject jsonObj = (JSONObject) obj;

		// Extract the "posts" array from the JSON object
		JSONArray posts = (JSONArray) ((JSONObject) ((JSONObject) jsonObj.get("tistory")).get("item")).get("posts");

		List<Integer> postIds = new LinkedList<Integer>();
		if (posts != null && posts.size() > 0) {
			Iterator<JSONObject> iterator = posts.iterator();
			while (iterator.hasNext()) {
				JSONObject item = iterator.next();
				postIds.add(Integer.valueOf((String) item.get("id")));
				if (postIds.size() == 10)
					break;
			}
		}
		return postIds;
	}

	@Override
	public List<Map<String, Object>> getPostDetail(List<Integer> postIds) throws Exception {

		// 로그 출력
		LOGGER.info("getPostDetail -- postIds:" + postIds.toString());

		// 반환할 게시물 정보 목록
		List<Map<String, Object>> returnPostDetail = new LinkedList<Map<String, Object>>();

		// 주어진 게시물 ID 목록을 순회하며 Tistory API를 호출하여 게시물 정보를 가져옵니다.
		for (Integer id : postIds) {

			// Tistory API 호출 및 응답 받기
			String response = WebClient.create("https://www.tistory.com").get()
					.uri(uriBuilder -> uriBuilder.path("/apis/post/read").queryParam("access_token", accessToken)
							.queryParam("output", "json").queryParam("blogName", blogName).queryParam("postId", id)
							.build())
					.retrieve().bodyToMono(String.class).block();

			// 로그 출력
			LOGGER.info("getPostDetail -- response:" + response);

			// 응답 JSON 파싱
			JSONParser jsonParser = new JSONParser();
			Object obj = jsonParser.parse(response);
			JSONObject jsonObj = (JSONObject) obj;
			JSONObject posts = (JSONObject) ((JSONObject) jsonObj.get("tistory")).get("item");

			// 게시물 정보 추출
			Map<String, Object> item = new HashMap<String, Object>();
			item.put("title", (String) posts.get("title"));
			item.put("postUrl", (String) posts.get("postUrl"));
			String content = (String) posts.get("content");
			String textWithoutTag = CommonUtils.getText(content);
			item.put("content", textWithoutTag);
			String imgStart = content.substring(content.indexOf("<img src='") + 10);
			String imgPath = imgStart.substring(0, imgStart.indexOf("'"));
			item.put("img", imgPath);
			String dateStr = (String) posts.get("date");
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
			Date date = formatter.parse(dateStr);
			GregorianCalendar cal = new GregorianCalendar();
			cal.setTime(date);
			item.put("month", cal.get(Calendar.MONTH) + 1);
			item.put("day", cal.get(Calendar.DAY_OF_MONTH));

			// 게시물 정보 목록에 추가
			returnPostDetail.add(item);
		}
		// 게시물 정보 목록 반환
		return returnPostDetail;
	}

}
