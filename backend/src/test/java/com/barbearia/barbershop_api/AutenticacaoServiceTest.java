package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.UsuarioLoginRepository;
import com.barbearia.barbershop_api.service.AutenticacaoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AutenticacaoServiceTest {

    @InjectMocks
    private AutenticacaoService service;

    @Mock
    private UsuarioLoginRepository repository;

    @Test
    @DisplayName("Deve carregar usuário por username com sucesso")
    void deveCarregarUsuarioComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        usuario.setLogin("admin@afrokings.com");
        usuario.setSenha("123456");
        usuario.setPerfil(Perfil.ADMIN);
        usuario.setAtivo(true);

        when(repository.findByLogin("admin@afrokings.com")).thenReturn(usuario);

        UserDetails userDetails = service.loadUserByUsername("admin@afrokings.com");

        assertNotNull(userDetails);
        assertEquals("admin@afrokings.com", userDetails.getUsername());
    }

    @Test
    @DisplayName("Deve lançar UsernameNotFoundException quando usuário não for encontrado")
    void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
        when(repository.findByLogin("inexistente@email.com")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("inexistente@email.com"));
    }
}
