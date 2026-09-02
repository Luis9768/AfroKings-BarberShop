package com.barbearia.barbershop_api.infra.Exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class TratadorDeErros {

    // Erros de validação do Bean Validation (@NotNull, @NotBlank, @CPF, @Email, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErroValidacao(MethodArgumentNotValidException ex) {
        String mensagens = ex.getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(". "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "mensagem", mensagens,
                "status", HttpStatus.BAD_REQUEST.value(),
                "erros", ex.getFieldErrors().stream().map(DadosErroValidacao::new).toList()
        ));
    }

    // Erros de parâmetro ou tipo de dado incorreto na URL
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> tratarErroTipoParametro(MethodArgumentTypeMismatchException ex) {
        String mensagem = "O parâmetro '" + ex.getName() + "' recebeu um valor inválido (" + ex.getValue() + ").";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "mensagem", mensagem,
                "status", HttpStatus.BAD_REQUEST.value()
        ));
    }

    // Regras de negócio violadas lançadas com IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> tratarRegrasNegocio(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "mensagem", ex.getMessage(),
                "status", HttpStatus.BAD_REQUEST.value()
        ));
    }

    // Violações de chave única ou integridade do banco de dados (PostgreSQL UNIQUE, FK)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> tratarConflitoBanco(DataIntegrityViolationException ex) {
        String msgOriginal = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
        String mensagemAmigavel = "Já existe um registro com estes dados no sistema!";

        if (msgOriginal.contains("cpf")) {
            mensagemAmigavel = "Já existe um cliente cadastrado com este CPF!";
        } else if (msgOriginal.contains("email") || msgOriginal.contains("login")) {
            mensagemAmigavel = "Já existe um usuário cadastrado com este E-mail!";
        } else if (msgOriginal.contains("foreign key") || msgOriginal.contains("violates foreign key")) {
            mensagemAmigavel = "Este registro não pode ser excluído pois possui dados e agendamentos vinculados!";
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "mensagem", mensagemAmigavel,
                "status", HttpStatus.CONFLICT.value()
        ));
    }

    // Erro de credenciais inválidas no Login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> tratarCredenciaisInvalidas(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "mensagem", "E-mail ou senha incorretos. Por favor, tente novamente.",
                "status", HttpStatus.UNAUTHORIZED.value()
        ));
    }

    // Usuário desabilitado no login
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> tratarUsuarioDesabilitado(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "mensagem", "Esta conta está inativa ou desabilitada. Entre em contato com o administrador.",
                "status", HttpStatus.FORBIDDEN.value()
        ));
    }

    // Acesso negado por falta de perfil/permissão
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> tratarAcessoNegado(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "mensagem", "Acesso negado: Você não tem permissão para realizar esta ação.",
                "status", HttpStatus.FORBIDDEN.value()
        ));
    }

    // Fallback genérico para RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> tratarErroGenerico(RuntimeException ex) {
        String mensagem = ex.getMessage() != null && !ex.getMessage().isBlank()
                ? ex.getMessage()
                : "Ocorreu um erro interno ao processar a requisição.";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "mensagem", mensagem,
                "status", HttpStatus.BAD_REQUEST.value()
        ));
    }

    // DTO padronizado para detalhar campos com erro
    public record DadosErroValidacao(String campo, String mensagem) {
        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }
}
