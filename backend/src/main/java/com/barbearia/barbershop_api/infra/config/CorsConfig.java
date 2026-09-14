package com.barbearia.barbershop_api.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origens liberadas: o domínio público do Easypanel e os ambientes locais
        configuration.setAllowedOrigins(List.of(
            "https://afro-kings-frontend.zlbyop.easypanel.host",
            "http://localhost:5173",
            "https://afrokings-front.duckdns.org",
            "http://localhost:3000"
        ));

        // Verbos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Permite todos os cabeçalhos (Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));

        // Permite envio de credenciais/cookies
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
