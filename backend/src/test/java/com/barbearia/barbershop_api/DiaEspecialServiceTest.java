package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.dto.agendamentoDto.DadosEntradaDiaEspecial;
import com.barbearia.barbershop_api.dto.agendamentoDto.SaidaDiaEspecialDTO;
import com.barbearia.barbershop_api.entity.DiaEspecial;
import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.DiaEspecialRepository;
import com.barbearia.barbershop_api.service.DiaEspecialService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DiaEspecialServiceTest {

    @InjectMocks
    private DiaEspecialService service;

    @Mock
    private DiaEspecialRepository repository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveDesserializarJsonDoFrontendComSucesso() throws Exception {
        // Formato enviado pelo frontend
        String json = """
                {
                    "data": "2026-12-25",
                    "motivo": "Natal",
                    "diaFolga": true,
                    "horarioAbertura": "00:00:00",
                    "horarioFechamento": "00:00:00"
                }
                """;

        DadosEntradaDiaEspecial dto = objectMapper.readValue(json, DadosEntradaDiaEspecial.class);

        assertEquals(LocalDate.of(2026, 12, 25), dto.data());
        assertEquals("Natal", dto.descricao());
        assertTrue(dto.diaFolga());
        assertEquals(LocalTime.of(0, 0), dto.horaAbertura());
    }

    @Test
    void deveCadastrarDiaFolgaSemHorarios() {
        Usuario admin = new Usuario();
        admin.setPerfil(Perfil.ADMIN);

        DadosEntradaDiaEspecial dto = new DadosEntradaDiaEspecial(
                LocalDate.now().plusDays(5),
                null,
                null,
                "Feriado",
                true
        );

        when(repository.findByData(any())).thenReturn(Optional.empty());

        SaidaDiaEspecialDTO resultado = service.cadastro(dto, admin);

        assertNotNull(resultado);
        assertEquals("Feriado", resultado.descricao());
        assertTrue(resultado.diaFolga());
        assertNull(resultado.horarioAbertura());
        assertNull(resultado.horarioFechamento());
        assertEquals("É dia de folga!", resultado.mensagem());
        verify(repository, times(1)).save(any(DiaEspecial.class));
    }
}
