package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.dto.barbeiroDto.BarbeiroDto;
import com.barbearia.barbershop_api.dto.barbeiroDto.DadosEntradaAtualizarBarbeiro;
import com.barbearia.barbershop_api.dto.barbeiroDto.DadosEntradaCadastroBarbeiro;
import com.barbearia.barbershop_api.entity.Barbeiro;
import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.BarbeiroRepository;
import com.barbearia.barbershop_api.repository.UsuarioLoginRepository;
import com.barbearia.barbershop_api.service.BarbeiroService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BarbeiroServiceTest {

    @InjectMocks
    private BarbeiroService service;

    @Mock
    private BarbeiroRepository repository;

    @Mock
    private UsuarioLoginRepository usuarioLoginRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Usuario usuarioAdmin;
    private Usuario usuarioBarbeiro;
    private Usuario usuarioCliente;
    private Barbeiro barbeiro;

    @BeforeEach
    void setUp() {
        usuarioAdmin = new Usuario();
        usuarioAdmin.setId(1);
        usuarioAdmin.setLogin("admin@afrokings.com");
        usuarioAdmin.setPerfil(Perfil.ADMIN);
        usuarioAdmin.setAtivo(true);

        usuarioBarbeiro = new Usuario();
        usuarioBarbeiro.setId(2);
        usuarioBarbeiro.setLogin("marcos@afrokings.com");
        usuarioBarbeiro.setPerfil(Perfil.ADMIN);
        usuarioBarbeiro.setAtivo(true);

        usuarioCliente = new Usuario();
        usuarioCliente.setId(3);
        usuarioCliente.setLogin("cliente@gmail.com");
        usuarioCliente.setPerfil(Perfil.CLIENTE);
        usuarioCliente.setAtivo(true);

        barbeiro = new Barbeiro();
        barbeiro.setId(10);
        barbeiro.setNome("Marcos Barbeiro");
        barbeiro.setContato("(11) 97777-6666");
        barbeiro.setEmail("marcos@afrokings.com");
        barbeiro.setAtivo(true);
        barbeiro.setUsuario(usuarioBarbeiro);
    }

    @Test
    @DisplayName("Deve cadastrar barbeiro com sucesso por um ADMIN")
    void deveAdicionarBarbeiroComSucesso() {
        // DadosEntradaCadastroBarbeiro: nome, email, contato, senha
        DadosEntradaCadastroBarbeiro dto = new DadosEntradaCadastroBarbeiro(
                "Felipe Santos",
                "felipe@afrokings.com",
                "(11) 98888-5555",
                "senha123"
        );

        when(repository.existsByEmail("felipe@afrokings.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_senha");
        when(usuarioLoginRepository.save(any(Usuario.class))).thenAnswer(i -> {
            Usuario u = i.getArgument(0);
            u.setId(5);
            return u;
        });
        when(repository.save(any(Barbeiro.class))).thenAnswer(i -> {
            Barbeiro b = i.getArgument(0);
            b.setId(20);
            return b;
        });

        BarbeiroDto resultado = service.adicionar(dto, usuarioAdmin);

        assertNotNull(resultado);
        assertEquals("Felipe Santos", resultado.nome());
        assertEquals("felipe@afrokings.com", resultado.email());
        verify(repository, times(1)).save(any(Barbeiro.class));
    }

    @Test
    @DisplayName("Deve impedir cadastro de barbeiro por usuário não-ADMIN")
    void deveImpedirCadastroPorNaoAdmin() {
        DadosEntradaCadastroBarbeiro dto = new DadosEntradaCadastroBarbeiro(
                "Felipe Santos",
                "felipe@afrokings.com",
                "(11) 98888-5555",
                "senha123"
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.adicionar(dto, usuarioCliente));
        assertEquals("Você não tem permissão para realizar esta ação!", ex.getMessage());
    }

    @Test
    @DisplayName("Deve impedir cadastro de barbeiro com email já cadastrado")
    void deveImpedirEmailDuplicado() {
        DadosEntradaCadastroBarbeiro dto = new DadosEntradaCadastroBarbeiro(
                "Felipe Santos",
                "marcos@afrokings.com",
                "(11) 98888-5555",
                "senha123"
        );

        when(repository.existsByEmail("marcos@afrokings.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.adicionar(dto, usuarioAdmin));
    }

    @Test
    @DisplayName("Deve atualizar barbeiro buscando pelo ID do barbeiro")
    void deveAtualizarBarbeiroPorIdBarbeiro() {
        // DadosEntradaAtualizarBarbeiro: nome, email, contato, senha
        DadosEntradaAtualizarBarbeiro dto = new DadosEntradaAtualizarBarbeiro(
                "Marcos Silva",
                "marcos.novo@afrokings.com",
                "(11) 91111-0000",
                "novaSenha123"
        );

        when(repository.findById(10)).thenReturn(Optional.of(barbeiro));
        when(passwordEncoder.encode("novaSenha123")).thenReturn("nova_senha_hash");
        when(repository.save(any(Barbeiro.class))).thenAnswer(i -> i.getArgument(0));

        BarbeiroDto resultado = service.atualizar(10, dto, usuarioBarbeiro);

        assertNotNull(resultado);
        assertEquals("Marcos Silva", resultado.nome());
        assertEquals("marcos.novo@afrokings.com", resultado.email());
        assertEquals("(11) 91111-0000", resultado.contato());
    }

    @Test
    @DisplayName("Deve atualizar barbeiro buscando pelo ID do usuário (quando id do barbeiro diverge)")
    void deveAtualizarBarbeiroPorIdUsuario() {
        DadosEntradaAtualizarBarbeiro dto = new DadosEntradaAtualizarBarbeiro(
                "Marcos Barbeiro Master",
                null,
                "(11) 92222-3333",
                null
        );

        // ID 2 é o ID do Usuario do barbeiro
        when(repository.findById(2)).thenReturn(Optional.empty());
        when(repository.findByUsuarioId(2)).thenReturn(Optional.of(barbeiro));
        when(repository.save(any(Barbeiro.class))).thenAnswer(i -> i.getArgument(0));

        BarbeiroDto resultado = service.atualizar(2, dto, usuarioBarbeiro);

        assertNotNull(resultado);
        assertEquals("Marcos Barbeiro Master", resultado.nome());
        assertEquals("(11) 92222-3333", resultado.contato());
    }

    @Test
    @DisplayName("Deve obter dados do perfil do barbeiro logado")
    void deveObterPerfilBarbeiroComSucesso() {
        when(repository.findByUsuarioId(2)).thenReturn(Optional.of(barbeiro));

        BarbeiroDto perfil = service.obterPerfil(usuarioBarbeiro);

        assertNotNull(perfil);
        assertEquals("Marcos Barbeiro", perfil.nome());
        assertEquals("marcos@afrokings.com", perfil.email());
    }

    @Test
    @DisplayName("Deve listar todos os barbeiros")
    void deveListarBarbeiros() {
        when(repository.findAll()).thenReturn(List.of(barbeiro));

        List<BarbeiroDto> lista = service.listarBarbeiros(usuarioAdmin);

        assertEquals(1, lista.size());
        assertEquals("Marcos Barbeiro", lista.get(0).nome());
    }

    @Test
    @DisplayName("Deve deletar barbeiro logicamente")
    void deveDeletarBarbeiroComSucesso() {
        when(repository.findById(10)).thenReturn(Optional.of(barbeiro));
        when(repository.save(any(Barbeiro.class))).thenAnswer(i -> i.getArgument(0));

        service.deletar(10, usuarioAdmin);

        assertFalse(barbeiro.getAtivo());
        assertFalse(usuarioBarbeiro.getAtivo());
        verify(repository, times(1)).save(barbeiro);
    }
}
