package com.barbearia.barbershop_api.dto.agendamentoDto;

import com.barbearia.barbershop_api.infra.config.deserializer.MultiFormatLocalDateDeserializer;
import com.barbearia.barbershop_api.infra.config.deserializer.MultiFormatLocalTimeDeserializer;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record DadosEntradaDiaEspecial(
        @NotNull(message = "A data é obrigatória!")
        @JsonDeserialize(using = MultiFormatLocalDateDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "[yyyy-MM-dd][dd/MM/yyyy]")
        @Schema(type = "string", example = "2026-12-24")
        LocalDate data,

        @JsonAlias({"horarioAbertura", "horaAbertura"})
        @JsonDeserialize(using = MultiFormatLocalTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
        @Schema(type = "string", example = "07:00")
        LocalTime horaAbertura,

        @JsonAlias({"horarioFechamento", "horaFechamento"})
        @JsonDeserialize(using = MultiFormatLocalTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
        @Schema(type = "string", example = "17:00")
        LocalTime horaFechamento,

        @JsonAlias({"motivo", "descricao"})
        String descricao,

        Boolean diaFolga
) {
}
