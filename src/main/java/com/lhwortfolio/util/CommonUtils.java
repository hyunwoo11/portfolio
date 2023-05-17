package com.lhwortfolio.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonUtils {

	//String content 에 포함된 HTML 태그 삭제
	public static String getText(String content) {
		
		/*
			Pattern SCRIPTS = Pattern.compile("<(no)?script[^>]*>.*?</(no)?script>", Pattern.DOTALL);
	
			<script> 또는 <noscript> 태그로 둘러싸인 스크립트 내용을 제거하기 위한 패턴입니다. Pattern.DOTALL 옵션은 개행 문자도 포함하여 매칭하기 위한 것입니다.
			Pattern STYLE = Pattern.compile("<style[^>]*>.*</style>", Pattern.DOTALL);
	
			<style> 태그로 둘러싸인 스타일 내용을 제거하기 위한 패턴입니다.
			Pattern TAGS = Pattern.compile("<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>");
	
			모든 태그를 제거하기 위한 패턴입니다. 이 패턴은 <로 시작하고 >로 끝나는 태그를 매칭합니다.
			Pattern nTAGS = Pattern.compile("<\\w+\\s+[^<]*\\s*>");
	
			일반 태그(속성이 있는 태그)를 제거하기 위한 패턴입니다.
			Pattern ENTITY_REFS = Pattern.compile("&[^;]+;");
	
			엔티티 참조를 제거하기 위한 패턴입니다. &로 시작하고 ;로 끝나는 엔티티 참조를 매칭합니다.
			Pattern WHITESPACE = Pattern.compile("\\s\\s+");
	
			연속된 공백을 하나의 공백으로 대체하기 위한 패턴입니다.
		*/
		
		Pattern SCRIPTS = Pattern.compile("<(no)?script[^>]*>.*?</(no)?script>",Pattern.DOTALL);
		Pattern STYLE = Pattern.compile("<style[^>]*>.*</style>",Pattern.DOTALL);
		Pattern TAGS = Pattern.compile("<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>");
		Pattern nTAGS = Pattern.compile("<\\w+\\s+[^<]*\\s*>");
		Pattern ENTITY_REFS = Pattern.compile("&[^;]+;");
		Pattern WHITESPACE = Pattern.compile("\\s\\s+");
		
		Matcher m;
		
		m = SCRIPTS.matcher(content);
		content = m.replaceAll("");
		m = STYLE.matcher(content);
		content = m.replaceAll("");
		m = TAGS.matcher(content);
		content = m.replaceAll("");
		m = ENTITY_REFS.matcher(content);
		content = m.replaceAll("");
		m = WHITESPACE.matcher(content);
		content = m.replaceAll(" "); 		
		
		return content;
	}
}
