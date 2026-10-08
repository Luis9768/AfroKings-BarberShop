package com.barbearia.barbershop_api;

import com.barbearia.barbershop_api.dto.agendamentoDto.DadosSaidaAgendamento;
import com.barbearia.barbershop_api.entity.Agendamento;
import com.barbearia.barbershop_api.entity.Barbeiro;
import com.barbearia.barbershop_api.entity.Cliente;
import com.barbearia.barbershop_api.entity.Servico;
import com.barbearia.barbershop_api.entity.StatusAgendamento;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class AgendamentoDtoTest {

    @Test
    @DisplayName("Deve mapear statusAgendamento CANCELADO corretamente para DadosSaidaAgendamento")
    void deveMapearStatusCanceladoCorretamente() {
        Cliente cliente = new Cliente();
        cliente.setNome("Carlos Silva");

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setNome("Lucas Mestre");

        Servico servico = new Servico();
        servico.setNome("Corte Fade");

        Agendamento agendamento = new Agendamento();
        agendamento.setId(1);
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);
        agendamento.setDataHoraInicio(LocalDateTime.of(2026, 10, 20, 10, 0));
        agendamento.setDataHoraFim(LocalDateTime.of(2026, 10, 20, 10, 40));
        agendamento.setStatusAgendamento(StatusAgendamento.CANCELADO);

        DadosSaidaAgendamento dto = new DadosSaidaAgendamento(agendamento);

        assertNotNull(dto);
        assertEquals(StatusAgendamento.CANCELADO, dto.statusAgendamento());
        assertEquals("Carlos Silva", dto.nome());
        assertEquals("Lucas Mestre", dto.nomeBarbeiro());
        assertEquals("Corte Fade", dto.nomeServico());
    }

    @Test
    @DisplayName("Deve atribuir AGENDADO por padrão quando status for nulo")
    void deveAtribuirAgendadoQuandoStatusNulo() {
        Cliente cliente = new Cliente();
        cliente.setNome("João");

        Barbeiro barbeiro = new Barbeiro();
        barbeiro.setNome("Marcos");

        Servico servico = new Servico();
        servico.setNome("Barba Terapia");

        Agendamento agendamento = new Agendamento();
        agendamento.setId(2);
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);
        agendamento.setDataHoraInicio(LocalDateTime.of(2026, 10, 20, 14, 0));
        agendamento.setDataHoraFim(LocalDateTime.of(2026, 10, 20, 14, 40));
        agendamento.setStatusAgendamento(null);

        DadosSaidaAgendamento dto = new DadosSaidaAgendamento(agendamento);

        assertNotNull(dto);
        assertEquals(StatusAgendamento.AGENDADO, dto.statusAgendamento());
    }
}
