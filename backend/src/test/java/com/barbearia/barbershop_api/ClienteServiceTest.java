package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.dto.clienteDto.ClienteDTO;
import com.barbearia.barbershop_api.dto.clienteDto.DadosEntradaCadastroCliente;
import com.barbearia.barbershop_api.dto.clienteDto.DadosSaidaListaCLientes;
import com.barbearia.barbershop_api.dto.clienteDto.EntradaAtualizarCliente;
import com.barbearia.barbershop_api.entity.Cliente;
import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.ClienteRepository;
import com.barbearia.barbershop_api.repository.UsuarioLoginRepository;
import com.barbearia.barbershop_api.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClienteServiceTest {

    @InjectMocks
    private ClienteService service;

    @Mock
    private ClienteRepository repository;

    @Mock
    private UsuarioLoginRepository usuarioLoginRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private Usuario usuarioCliente;
    private Usuario usuarioAdmin;
    private Cliente cliente;

    @BeforeEach
    void setUp() {
        usuarioCliente = new Usuario();
        usuarioCliente.setId(10);
        usuarioCliente.setLogin("joao@email.com");
        usuarioCliente.setSenha("encoded_senha");
        usuarioCliente.setPerfil(Perfil.CLIENTE);
        usuarioCliente.setAtivo(true);

        usuarioAdmin = new Usuario();
        usuarioAdmin.setId(99);
        usuarioAdmin.setLogin("admin@afrokings.com");
        usuarioAdmin.setSenha("encoded_admin");
        usuarioAdmin.setPerfil(Perfil.ADMIN);
        usuarioAdmin.setAtivo(true);

        cliente = new Cliente();
        cliente.setId(1);
        cliente.setNome("João Silva");
        cliente.setCpf("123.456.789-00");
        cliente.setContato("(11) 98888-7777");
        cliente.setEmail("joao@email.com");
        cliente.setDataNascimento(LocalDate.of(1995, 5, 20));
        cliente.setAtivo(true);
        cliente.setUsuario(usuarioCliente);
    }

    private ClienteDTO criarClienteDTO(String nome, String cpf, String contato, String email, String senha) {
        ClienteDTO dto = new ClienteDTO();
        dto.setNome(nome);
        dto.setCpf(cpf);
        dto.setContato(contato);
        dto.setEmail(email);
        dto.setDataNascimento(LocalDate.of(2000, 1, 1));
        dto.setSenha(senha);
        return dto;
    }

    @Test
    @DisplayName("Deve cadastrar usuário e cliente com sucesso")
    void deveCadastrarUsuarioComSucesso() {
        ClienteDTO dto = criarClienteDTO("Carlos Souza", "111.222.333-44", "(11) 99999-8888", "carlos@email.com", "senha123");

        when(repository.existsByCpf(dto.getCpf().trim())).thenReturn(false);
        when(repository.existsByEmail(dto.getEmail().trim())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_senha");
        when(usuarioLoginRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(20);
            return u;
        });
        when(repository.save(any(Cliente.class))).thenAnswer(invocation -> {
            Cliente c = invocation.getArgument(0);
            c.setId(2);
            return c;
        });

        DadosEntradaCadastroCliente resultado = service.cadastroUsuario(dto);

        assertNotNull(resultado);
        assertEquals("Carlos Souza", resultado.nome());
        assertEquals("carlos@email.com", resultado.email());
        verify(usuarioLoginRepository, times(1)).save(any(Usuario.class));
        verify(repository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar cadastrar cliente com CPF já existente")
    void deveLancarExcecaoQuandoCpfJaExiste() {
        ClienteDTO dto = criarClienteDTO("Carlos Souza", "123.456.789-00", "(11) 99999-8888", "carlos@email.com", "senha123");

        when(repository.existsByCpf(dto.getCpf().trim())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.cadastroUsuario(dto));
        assertEquals("Já existe um cliente cadastrado com este CPF!", ex.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Deve listar todos os usuários quando solicitado por ADMIN")
    void deveListarUsuariosQuandoAdmin() {
        when(repository.findAll()).thenReturn(List.of(cliente));

        List<DadosSaidaListaCLientes> lista = service.listarUsuarios(usuarioAdmin);

        assertEquals(1, lista.size());
        assertEquals("João Silva", lista.get(0).nome());
    }

    @Test
    @DisplayName("Deve impedir listagem de usuários se o solicitante não for ADMIN")
    void deveBloquearListagemParaNaoAdmin() {
        assertThrows(IllegalArgumentException.class, () -> service.listarUsuarios(usuarioCliente));
    }

    @Test
    @DisplayName("Deve atualizar cliente com sucesso buscando pelo ID do cliente")
    void deveAtualizarClientePorIdCliente() {
        // EntradaAtualizarCliente(nome, email, contato, senha, cpf, dataNascimento)
        EntradaAtualizarCliente dto = new EntradaAtualizarCliente(
                "João da Silva Jr",
                "joao.novo@email.com",
                "(11) 91111-2222",
                "novaSenha123",
                "123.456.789-00",
                LocalDate.of(1995, 5, 20)
        );

        when(repository.findById(1)).thenReturn(Optional.of(cliente));
        when(repository.findByCpf("123.456.789-00")).thenReturn(Optional.of(cliente));
        when(passwordEncoder.encode("novaSenha123")).thenReturn("nova_senha_hash");
        when(repository.save(any(Cliente.class))).thenAnswer(i -> i.getArgument(0));

        EntradaAtualizarCliente resultado = service.atualizar(1, dto, usuarioCliente);

        assertNotNull(resultado);
        assertEquals("João da Silva Jr", resultado.nome());
        assertEquals("joao.novo@email.com", resultado.email());
        assertEquals("(11) 91111-2222", resultado.contato());
    }

    @Test
    @DisplayName("Deve atualizar cliente com sucesso buscando pelo ID do usuário (quando id do cliente diverge)")
    void deveAtualizarClientePorIdUsuario() {
        EntradaAtualizarCliente dto = new EntradaAtualizarCliente(
                "João da Silva Atualizado",
                "joao.novo@email.com",
                "(11) 91111-2222",
                null,
                null,
                null
        );

        when(repository.findById(10)).thenReturn(Optional.empty());
        when(repository.findByUsuarioId(10)).thenReturn(Optional.of(cliente));
        when(repository.save(any(Cliente.class))).thenAnswer(i -> i.getArgument(0));

        EntradaAtualizarCliente resultado = service.atualizar(10, dto, usuarioCliente);

        assertNotNull(resultado);
        assertEquals("João da Silva Atualizado", resultado.nome());
        verify(repository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Deve permitir que ADMIN atualize dados de qualquer cliente")
    void devePermitirAdminAtualizarCliente() {
        EntradaAtualizarCliente dto = new EntradaAtualizarCliente(
                "Nome Alterado por Admin",
                null,
                null,
                null,
                null,
                null
        );

        when(repository.findById(1)).thenReturn(Optional.of(cliente));
        when(repository.save(any(Cliente.class))).thenAnswer(i -> i.getArgument(0));

        EntradaAtualizarCliente resultado = service.atualizar(1, dto, usuarioAdmin);

        assertNotNull(resultado);
        assertEquals("Nome Alterado por Admin", resultado.nome());
    }

    @Test
    @DisplayName("Deve impedir atualização se o usuário não for o dono nem ADMIN")
    void deveImpedirAtualizacaoPorOutroUsuario() {
        Usuario outroCliente = new Usuario();
        outroCliente.setId(88);
        outroCliente.setPerfil(Perfil.CLIENTE);

        EntradaAtualizarCliente dto = new EntradaAtualizarCliente("Tentativa", null, null, null, null, null);

        when(repository.findById(1)).thenReturn(Optional.of(cliente));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.atualizar(1, dto, outroCliente));
        assertEquals("Você não pode alterar os dados de outra pessoa!", ex.getMessage());
    }

    @Test
    @DisplayName("Deve lançar erro quando cliente para atualizar não for encontrado")
    void deveLancarErroQuandoClienteNaoEncontrado() {
        when(repository.findById(999)).thenReturn(Optional.empty());
        when(repository.findByUsuarioId(999)).thenReturn(Optional.empty());

        EntradaAtualizarCliente dto = new EntradaAtualizarCliente("Teste", null, null, null, null, null);

        assertThrows(IllegalArgumentException.class, () -> service.atualizar(999, dto, usuarioCliente));
    }

    @Test
    @DisplayName("Deve obter dados do perfil do usuário autenticado")
    void deveObterPerfilComSucesso() {
        when(repository.findByUsuarioId(10)).thenReturn(Optional.of(cliente));

        DadosSaidaListaCLientes perfil = service.obterPerfil(usuarioCliente);

        assertNotNull(perfil);
        assertEquals("João Silva", perfil.nome());
        assertEquals("joao@email.com", perfil.email());
    }

    @Test
    @DisplayName("Deve desativar logicamente o usuário e cliente ao excluir")
    void deveExcluirUsuarioComSucesso() {
        when(usuarioLoginRepository.findById(10)).thenReturn(Optional.of(usuarioCliente));
        when(repository.findByUsuarioId(10)).thenReturn(Optional.of(cliente));

        service.excluirUsuarioId(10, usuarioCliente);

        assertFalse(usuarioCliente.getAtivo());
        assertFalse(cliente.getAtivo());
        verify(usuarioLoginRepository, times(1)).save(usuarioCliente);
        verify(repository, times(1)).save(cliente);
    }
}
