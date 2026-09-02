package com.barbearia.barbershop_api.infra.config;

import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.UsuarioLoginRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InicializadorAdmin {
    @Bean
    public CommandLineRunner inicializacaoAdmin(UsuarioLoginRepository repository, PasswordEncoder passwordEncoder){
        return args -> {
            UserDetails userDetails = repository.findByLogin("admin@email.com");
            if (userDetails == null) {
                Usuario admin = new Usuario();
                admin.setLogin("admin@email.com");
                admin.setSenha(passwordEncoder.encode("123456"));
                admin.setPerfil(Perfil.ADMIN);
                admin.setAtivo(true);
                repository.save(admin);
            } else if (userDetails instanceof Usuario admin) {
                if (admin.getAtivo() == null || !admin.getAtivo()) {
                    admin.setAtivo(true);
                    repository.save(admin);
                }
            }

            System.out.println("==================================================");
            System.out.println("🚀 USUÁRIO MESTRE ATIVO E PRONTO!");
            System.out.println("📧 Login: admin@email.com");
            System.out.println("🔑 Senha: 123456");
            System.out.println("==================================================");
        };
    }
}
