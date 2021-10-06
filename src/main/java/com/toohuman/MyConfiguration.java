//package com.toohuman;
//
//import javax.servlet.Filter;
//
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//import org.springframework.core.annotation.Order;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//@Order(Ordered.HIGHEST_PRECEDENCE)
//public class MyConfiguration {
//	
//    @Bean
//    public FilterRegistrationBean<Filter> corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("localhost:8088");
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("/**", config);
//        FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
//        bean.setOrder(Integer.MIN_VALUE);
//        return bean;
//    }
//	
////	@Bean
////	public WebMvcConfigurer corsConfigurer() {
////		return new WebMvcConfigurer() {
////			@Override
////			public void addCorsMappings(CorsRegistry registry) {
////                registry.addMapping("/**");
////			}
////		};
////	}
//
//}
