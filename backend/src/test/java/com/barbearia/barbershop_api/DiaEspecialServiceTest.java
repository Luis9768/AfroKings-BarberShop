package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.dto.agendamentoDto.DadosEntradaDiaEspecial;
import com.barbearia.barbershop_api.dto.agendamentoDto.SaidaDiaEspecialDTO;
import com.barbearia.barbershop_api.entity.DiaEspecial;
import com.barbearia.barbershop_api.entity.Perfil;
import com.barbearia.barbershop_api.entity.Usuario;
import com.barbearia.barbershop_api.repository.DiaEspecialRepository;
import com.barbearia.barbershop_api.service.DiaEspecialService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
    }

    @Test
    @DisplayName("Deve desserializar JSON de dia de folga total com horários nulos sem erro de LocalTime")
    void deveDesserializarJsonFolgaComHorariosNulos() throws Exception {
        // Formato exato enviado pelo frontend no caso de folga total
        String json = """
                {
                    "data": "2026-09-16",
                    "descricao": "folga pq sim",
                    "motivo": "folga pq sim",
                    "diaFolga": true,
                    "horaAbertura": null,
                    "horaFechamento": null
                }
                """;

        DadosEntradaDiaEspecial dto = objectMapper.readValue(json, DadosEntradaDiaEspecial.class);

        assertEquals(LocalDate.of(2026, 9, 16), dto.data());
        assertEquals("folga pq sim", dto.descricao());
        assertTrue(dto.diaFolga());
        assertNull(dto.horaAbertura());
        assertNull(dto.horaFechamento());
    }

    @Test
    @DisplayName("Deve desserializar JSON com horário especial no formato HH:mm")
    void deveDesserializarJsonComHorarioEspecial() throws Exception {
        String json = """
                {
                    "data": "2026-12-24",
                    "motivo": "Véspera de Natal",
                    "diaFolga": false,
                    "horaAbertura": "08:00",
                    "horaFechamento": "14:00"
                }
                """;

        DadosEntradaDiaEspecial dto = objectMapper.readValue(json, DadosEntradaDiaEspecial.class);

        assertEquals(LocalDate.of(2026, 12, 24), dto.data());
        assertEquals("Véspera de Natal", dto.descricao());
        assertFalse(dto.diaFolga());
        assertEquals(LocalTime.of(8, 0), dto.horaAbertura());
        assertEquals(LocalTime.of(14, 0), dto.horaFechamento());
    }

    @Test
    @DisplayName("Deve cadastrar dia de folga sem horários com sucesso")
    void deveCadastrarDiaFolgaSemHorarios() {
        Usuario admin = new Usuario();
        admin.setPerfil(Perfil.ADMIN);

        DadosEntradaDiaEspecial dto = new DadosEntradaDiaEspecial(
                LocalDate.now().plusDays(5),
                null,
                null,
                "folga pq sim",
                true
        );

        when(repository.findByData(any())).thenReturn(Optional.empty());

        SaidaDiaEspecialDTO resultado = service.cadastro(dto, admin);

        assertNotNull(resultado);
        assertEquals("folga pq sim", resultado.descricao());
        assertTrue(resultado.diaFolga());
        assertNull(resultado.horarioAbertura());
        assertNull(resultado.horarioFechamento());
        assertEquals("É dia de folga!", resultado.mensagem());
        verify(repository, times(1)).save(any(DiaEspecial.class));
    }
}
