package com.barbearia.barbershop_api.infra.config;

import com.barbearia.barbershop_api.entity.Barbeiro;
import com.barbearia.barbershop_api.entity.Servico;
import com.barbearia.barbershop_api.repository.BarbeiroRepository;
import com.barbearia.barbershop_api.repository.ServicoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.math.BigDecimal;

@Configuration
public class InicializadorDados {

    private byte[] carregarImagem(String caminho) {
        try {
            ClassPathResource resource = new ClassPathResource("images/" + caminho);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    return is.readAllBytes();
                }
            }
        } catch (Exception e) {
            System.err.println("Aviso: Não foi possível carregar imagem " + caminho + ": " + e.getMessage());
        }
        return null;
    }

    @Bean
    public CommandLineRunner inicializarServicosEBarbeiros(
            ServicoRepository servicoRepository,
            BarbeiroRepository barbeiroRepository
    ) {
        return args -> {
            // Inicializa Serviços se não houver
            if (servicoRepository.count() == 0) {
                Servico s1 = new Servico();
                s1.setNome("Corte Afro Fade & Alinhamento");
                s1.setDescricao("Degradê perfeito, taper fade e alinhamento de alta precisão com navalha.");
                s1.setPreco(new BigDecimal("50.00"));
                s1.setDuracaoMinutos(40);
                s1.setAtivo(true);
                s1.setTipoImagem("image/jpeg");
                s1.setDadosImagem(carregarImagem("corte_fade.jpg"));
                servicoRepository.save(s1);

                Servico s2 = new Servico();
                s2.setNome("Corte Freestyle & Risco Artístico");
                s2.setDescricao("Design geométrico exclusivo navalhado, degradê na zero e finalização premium.");
                s2.setPreco(new BigDecimal("65.00"));
                s2.setDuracaoMinutos(50);
                s2.setAtivo(true);
                s2.setTipoImagem("image/jpeg");
                s2.setDadosImagem(carregarImagem("corte_freestyle.jpg"));
                servicoRepository.save(s2);

                Servico s3 = new Servico();
                s3.setNome("Tranças Nagô & Box Braids");
                s3.setDescricao("Tranças masculinas estilizadas com acabamento impecável e hidratação do couro cabeludo.");
                s3.setPreco(new BigDecimal("90.00"));
                s3.setDuracaoMinutos(75);
                s3.setAtivo(true);
                s3.setTipoImagem("image/jpeg");
                s3.setDadosImagem(carregarImagem("trancas_nago.jpg"));
                servicoRepository.save(s3);

                Servico s4 = new Servico();
                s4.setNome("Barboterapia & Toalha Quente");
                s4.setDescricao("Tratamento completo de barba, esfoliação facial, toalha quente aromática e alinhamento.");
                s4.setPreco(new BigDecimal("45.00"));
                s4.setDuracaoMinutos(35);
                s4.setAtivo(true);
                s4.setTipoImagem("image/jpeg");
                s4.setDadosImagem(carregarImagem("barboterapia.jpg"));
                servicoRepository.save(s4);

                System.out.println("💈 Serviços iniciais com fotos cadastrados com sucesso!");
            }

            // Inicializa Barbeiros se não houver
            if (barbeiroRepository.count() == 0) {
                Barbeiro b1 = new Barbeiro();
                b1.setNome("Marcus 'Rei do Fade'");
                b1.setContato("(11) 98888-1111");
                b1.setEmail("marcus.barber@afrokings.com");
                b1.setAtivo(true);
                barbeiroRepository.save(b1);

                Barbeiro b2 = new Barbeiro();
                b2.setNome("Lucas 'Mestre das Tranças'");
                b2.setContato("(11) 97777-2222");
                b2.setEmail("lucas.trancas@afrokings.com");
                b2.setAtivo(true);
                barbeiroRepository.save(b2);

                Barbeiro b3 = new Barbeiro();
                b3.setNome("André 'Navalha de Ouro'");
                b3.setContato("(11) 96666-3333");
                b3.setEmail("andre.navalha@afrokings.com");
                b3.setAtivo(true);
                barbeiroRepository.save(b3);

                System.out.println("✂️ Barbeiros da equipe AfroKings cadastrados com sucesso!");
            }
        };
    }
}
