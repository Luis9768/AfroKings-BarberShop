package com.barbearia.barbershop_api.service;

import com.barbearia.barbershop_api.dto.barbeiroDto.BarbeiroDto;
import com.barbearia.barbershop_api.dto.barbeiroDto.DadosEntradaAtualizarBarbeiro;
import com.barbearia.barbershop_api.dto.barbeiroDto.DadosEntradaCadastroBarbeiro;
import com.barbearia.barbershop_api.entity.Barbeiro;
import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.BarbeiroRepository;
import com.barbearia.barbershop_api.repository.UsuarioLoginRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarbeiroService {
    @Autowired
    private BarbeiroRepository repository;
    @Autowired
    private UsuarioLoginRepository usuarioLoginRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public BarbeiroDto adicionar(DadosEntradaCadastroBarbeiro barbeiroDto, Usuario usuarioLogado) {
        if (usuarioLogado.getPerfil() != Perfil.ADMIN) {
            throw new IllegalArgumentException("Você não tem permissão para realizar esta ação!");
        }
        if (repository.existsByEmail(barbeiroDto.email())) {
            throw new IllegalArgumentException("Email já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setLogin(barbeiroDto.email());
        usuario.setSenha(passwordEncoder.encode(barbeiroDto.senha()));
        usuario.setPerfil(Perfil.ADMIN);
        Usuario usuarioSalvo = usuarioLoginRepository.save(usuario);

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setUsuario(usuario);
        barbeiro.setNome(barbeiroDto.nome());
        barbeiro.setContato(barbeiroDto.contato());
        barbeiro.setEmail(barbeiroDto.email());
        barbeiro.setAtivo(true);
        repository.save(barbeiro);

        return new BarbeiroDto(barbeiro);
    }

    @Transactional
    public BarbeiroDto atualizar(int id, DadosEntradaAtualizarBarbeiro dto, Usuario usuarioLogado) {
        boolean ehAdmin = usuarioLogado != null && usuarioLogado.getPerfil() == Perfil.ADMIN;
        Barbeiro barbeiro = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Barbeiro não encontrado!"));
        boolean ehDono = barbeiro.getUsuario() != null && usuarioLogado != null && barbeiro.getUsuario().getId().equals(usuarioLogado.getId());
        if (!ehAdmin && !ehDono) {
            throw new IllegalArgumentException("Você não pode alterar os dados de outro Barbeiro!");
        }
        if (dto.nome() != null && !dto.nome().isBlank()) {
            barbeiro.setNome(dto.nome());
        }
        if (dto.contato() != null && !dto.contato().isBlank()) {
            barbeiro.setContato(dto.contato());
        }
        if (dto.email() != null && !dto.email().isBlank()) {
            barbeiro.setEmail(dto.email());
            if (barbeiro.getUsuario() != null) {
                barbeiro.getUsuario().setLogin(dto.email());
            }
        }
        if (dto.senha() != null && !dto.senha().isBlank()) {
            barbeiro.setSenha(passwordEncoder.encode(dto.senha()));
            if (barbeiro.getUsuario() != null) {
                barbeiro.getUsuario().setSenha(passwordEncoder.encode(dto.senha()));
            }
        }
        repository.save(barbeiro);
        return new BarbeiroDto(barbeiro);
    }

    public List<BarbeiroDto> listarBarbeiros(Usuario usuarioLogado) {
        List<BarbeiroDto> lista = repository.findAll().stream()
                .map(BarbeiroDto::new)
                .toList();
        return lista;
    }

    @Transactional
    public void deletar(int id, Usuario usuarioLogado) {
        boolean ehAdmin = usuarioLogado != null && usuarioLogado.getPerfil() == Perfil.ADMIN;
        Barbeiro barbeiro = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Barbeiro não encontrado!"));
        boolean ehDono = barbeiro.getUsuario() != null && usuarioLogado != null && barbeiro.getUsuario().getId().equals(usuarioLogado.getId());
        if (!ehAdmin && !ehDono) {
            throw new IllegalArgumentException("Você não tem permissão para deletar este usuário!");
        }
        barbeiro.setAtivo(false);
        if (barbeiro.getUsuario() != null) {
            barbeiro.getUsuario().setAtivo(false);
        }
        repository.save(barbeiro);
    }

    public BarbeiroDto buscarPorId(int id, Usuario usuarioLogado){
        boolean ehAdmin = usuarioLogado != null && usuarioLogado.getPerfil() == Perfil.ADMIN;
        Barbeiro barbeiro = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Barbeiro não encontrado!"));
        boolean ehDono = barbeiro.getUsuario() != null && usuarioLogado != null && barbeiro.getUsuario().getId().equals(usuarioLogado.getId());
        if (!ehAdmin && !ehDono) {
            throw new IllegalArgumentException("Você não tem permissão para realizar esta ação!");
        }
        return new BarbeiroDto(barbeiro);
    }


}
