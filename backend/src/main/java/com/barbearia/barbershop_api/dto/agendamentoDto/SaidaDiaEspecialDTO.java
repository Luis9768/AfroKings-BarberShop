package com.barbearia.barbershop_api.dto.agendamentoDto;

import com.barbearia.barbershop_api.entity.DiaEspecial;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDate;
import java.time.LocalTime;

@JsonPropertyOrder({"id", "descricao", "data", "diaFolga", "horarioAbertura", "horarioFechamento", "mensagem"})
public record SaidaDiaEspecialDTO(
        Integer id,
        LocalDate data,
        LocalTime horarioAbertura,
        LocalTime horarioFechamento,
        String descricao,
        Boolean diaFolga,
        String mensagem
) {
    public SaidaDiaEspecialDTO(DiaEspecial dia) {
        this(
                dia.getId(),
                dia.getData(),
                Boolean.TRUE.equals(dia.getDiaFolga()) ? null : dia.getHorarioAbertura(),
                Boolean.TRUE.equals(dia.getDiaFolga()) ? null : dia.getHorarioFechamento(),
                dia.getDescricao(),
                Boolean.TRUE.equals(dia.getDiaFolga()),
                Boolean.TRUE.equals(dia.getDiaFolga()) ? "É dia de folga!" : null
        );
    }
}
