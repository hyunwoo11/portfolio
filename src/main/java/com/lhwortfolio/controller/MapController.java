package com.lhwortfolio.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.internal.LinkedTreeMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Api(value = "MapController", description = "내사진 관리")
@CrossOrigin(origins = "*")
@Slf4j
@RequestMapping("/api")
@RestController
public class MapController {

	Logger logger = Logger.getLogger("map 조회");
	
	//its api key
	private String apiKey = "5a8c3810428e4f609f67d115aa2cffd2";
	
	
	/**
	 * 
	 * its Api 호출
	 * 
	 * SCREEN ID	: 
	 * SCREEN NAME	: 
	 * PROGRAM ID	: 
	 * 
	 * @param	
	 * @return	resultList.toString();
	 * @throws	Exception
	 */
	@SuppressWarnings("unused")
	@ApiOperation(value = "rn-its")
	@GetMapping(value = "/rn-its", produces="application/json;charset=UTF-8")
	public String chngeInfoItsApi(HttpServletRequest request,
								  @RequestParam String type,
								  @RequestParam String eventType,
								  @RequestParam String minX,
								  @RequestParam String maxX,
								  @RequestParam String minY,
								  @RequestParam String maxY,
								  @RequestParam String getType) throws Exception {
		
		//기본 셋팅
		JsonArray resultList = new JsonArray();
		
		//api 관련
		String apiUrl	= "https://openapi.its.go.kr:9443/eventInfo?apiKey=" + apiKey + "&type=" + type + "&eventType=" + eventType + "&minX=" + minX + "&maxX=" + maxX + "&minY=" + minY + "&maxY=" + maxY + "&getType=" + getType;

		try {
			//url 객체 생성
			URL url = new URL(apiUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			
			//접속 성공 여부 코드
			int resCode = conn.getResponseCode();
			//System.out.println("resCode : " + conn.getResponseCode());
	
			if(resCode == HttpURLConnection.HTTP_OK) {
	
				StringBuilder sb = new StringBuilder();
				BufferedReader br = null;
				String line;
				
				try{
					//요청이 성공하면 입력 스트림을 읽음		- InputStream
					if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
						br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
		
					} else {
						//요청이 실패하면 입력 스트림을 읽음	- ErrorStream
						br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "utf-8"));
					}
					
					//스트림에서 읽은 데이터를 StringBuilder에 추가
					while ((line = br.readLine()) != null) {
						sb.append(line);
					}
					
					try {
						Gson gson = new Gson();
						JsonObject jsonObject = gson.fromJson(sb.toString(), JsonObject.class);
						
						//헤더와 바디를 JSON 객체로 변환하여 response 객체에 추가
						JsonObject header = jsonObject.getAsJsonObject("header");
						JsonObject body = jsonObject.getAsJsonObject("body");
						JsonArray items = body.getAsJsonArray("items");

						for (JsonElement itemElement : items) {
						    JsonObject res = new JsonObject();
						    JsonObject geometry = new JsonObject();
						    JsonObject properties = new JsonObject();

						    JsonObject item = itemElement.getAsJsonObject(); 

						    double coordX = item.get("coordX").getAsDouble();
						    double coordY = item.get("coordY").getAsDouble();
						    String eventDetailType = item.get("eventDetailType").getAsString();
						    String startDate = item.get("startDate").getAsString();
						    String linkId = item.get("linkId").getAsString();
						    String roadName = item.get("roadName").getAsString();
						    String roadNo = item.get("roadNo").getAsString();
						    String roadDrcType = item.get("roadDrcType").getAsString();
						    String lanesBlockType = item.get("lanesBlockType").getAsString();
						    String lanesBlocked = item.get("lanesBlocked").getAsString();
						    String message = item.get("message").getAsString();
						    String endDate = item.get("endDate").getAsString();

						    geometry.addProperty("type", "Point");
						    JsonArray coordinates = new JsonArray();
						    coordinates.add(coordX);
						    coordinates.add(coordY);
						    geometry.add("coordinates", coordinates);

						    properties.addProperty("type", "Feature");
						    properties.addProperty("eventDetailType", eventDetailType);
						    properties.addProperty("startDate", startDate);
						    properties.addProperty("linkId", linkId);
						    properties.addProperty("roadName", roadName);
						    properties.addProperty("roadNo", roadNo);
						    properties.addProperty("roadDrcType", roadDrcType);
						    properties.addProperty("lanesBlockType", lanesBlockType);
						    properties.addProperty("lanesBlocked", lanesBlocked);
						    properties.addProperty("message", message);
						    properties.addProperty("endDate", endDate);

						    res.add("geometry", geometry);
						    res.add("properties", properties);

						    resultList.add(res);
						}

					} catch(Exception e) {
						//e.printStackTrace();
						throw e;
					}
					
				}catch(Exception e) {
					throw e;
				} finally {				
					br.close();
				}
				conn.disconnect();
			} else {
				//System.out.println("No file to download. Server replied HTTP code : " + resCode);
			}
		} catch(Exception e) {
			//System.out.println("An error occurred while trying to api connect");
			//e.printStackTrace();
			throw e;
		}
		
		return resultList.toString();
	 }
	
	/**
	 * 
	 * its cctv Api 호출
	 * 
	 * SCREEN ID	: 
	 * SCREEN NAME	: 
	 * PROGRAM ID	: 
	 * 
	 * @param	
	 * @return	resultList.toString();
	 * @throws	Exception
	 */
	@SuppressWarnings("unused")
	@ApiOperation(value = "rn-its-cctv")
	@GetMapping(value = "/rn-its-cctv", produces="application/json;charset=UTF-8")
	public String rnItscctv(HttpServletRequest request,
			@RequestParam String type,
			@RequestParam String eventType,
			@RequestParam String cctvType,
			@RequestParam String minX,
			@RequestParam String maxX,
			@RequestParam String minY,
			@RequestParam String maxY,
			@RequestParam String getType) throws Exception {
		
		//기본 셋팅
		JsonArray resultList = new JsonArray();
		
		//api 관련
		StringBuilder urlBuilder = new StringBuilder("https://openapi.its.go.kr:9443/cctvInfo"); /*URL*/
		urlBuilder.append("?" + URLEncoder.encode("apiKey", "UTF-8") + "=" + URLEncoder.encode(apiKey, "UTF-8")); /*공개키*/
		urlBuilder.append("&" + URLEncoder.encode("type","UTF-8") + "=" + URLEncoder.encode("all", "UTF-8")); /*도로유형*/
		urlBuilder.append("&" + URLEncoder.encode("cctvType","UTF-8") + "=" + URLEncoder.encode(cctvType, "UTF-8")); /*CCTV유형*/
		urlBuilder.append("&" + URLEncoder.encode("minX","UTF-8") + "=" + URLEncoder.encode(minX, "UTF-8")); /*최소경도영역*/
		urlBuilder.append("&" + URLEncoder.encode("maxX","UTF-8") + "=" + URLEncoder.encode(maxX, "UTF-8")); /*최대경도영역*/
		urlBuilder.append("&" + URLEncoder.encode("minY","UTF-8") + "=" + URLEncoder.encode(minY, "UTF-8")); /*최소위도영역*/
		urlBuilder.append("&" + URLEncoder.encode("maxY","UTF-8") + "=" + URLEncoder.encode(maxY, "UTF-8")); /*최대위도영역*/
		urlBuilder.append("&" + URLEncoder.encode("getType","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8")); /*출력타입*/
		
		System.out.println(urlBuilder.toString());
		
		try {
			//url 객체 생성
			URL url = new URL(urlBuilder.toString());
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			
			//접속 성공 여부 코드
			int resCode = conn.getResponseCode();
			System.out.println("resCode : " + conn.getResponseCode());
			
			if(resCode == HttpURLConnection.HTTP_OK) {
				
				StringBuilder sb = new StringBuilder();
				BufferedReader br = null;
				String line;
				
				try{
					//요청이 성공하면 입력 스트림을 읽음		- InputStream
					if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
						br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
						
					} else {
						//요청이 실패하면 입력 스트림을 읽음	- ErrorStream
						br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "utf-8"));
					}
					
					//스트림에서 읽은 데이터를 StringBuilder에 추가
					while ((line = br.readLine()) != null) {
						sb.append(line);
					}
					
					try {
						
						Gson gson = new Gson();
						JsonObject jsonObject = gson.fromJson(sb.toString(), JsonObject.class);
						
						//헤더와 바디를 JSON 객체로 변환하여 response 객체에 추가
						JsonObject header = jsonObject.getAsJsonObject("response");
						JsonArray body = header.getAsJsonArray("data");
						
						for (JsonElement itemElement : body) {
							
							JsonObject res = new JsonObject();
							JsonObject geometry = new JsonObject();
							JsonObject properties = new JsonObject();
							
							JsonObject item = itemElement.getAsJsonObject();
							//System.out.println(item);

							
							double  coordX = item.get("coordx").getAsDouble();
							double  coordY = item.get("coordy").getAsDouble();
			                String cctvurl = item.get("cctvurl").getAsString();
			                String cctvname = item.get("cctvname").getAsString();
							
							geometry.addProperty("type", "Point");
							
							JsonArray coordinates = new JsonArray();
							coordinates.add(coordX);
				            coordinates.add(coordY);
				            
							geometry.add("coordinates", coordinates);
							properties.addProperty("type", "Feature");
							properties.addProperty("cctvurl", cctvurl);
							properties.addProperty("cctvname", cctvname);
							
							res.add("geometry", geometry);
							res.add("properties", properties);
							
							resultList.add(res);
						}
						
					} catch(Exception e) {
						//e.printStackTrace();
						throw e;
					}
					
				}catch(Exception e) {
					throw e;
				} finally {				
					br.close();
				}
				conn.disconnect();
			} else {
				//System.out.println("No file to download. Server replied HTTP code : " + resCode);
			}
		} catch(Exception e) {
			//System.out.println("An error occurred while trying to api connect");
			//e.printStackTrace();
			throw e;
		}
		
		return resultList.toString();
	}
	
}
