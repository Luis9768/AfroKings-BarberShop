package com.barbearia.barbershop_api.infra.config.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class MultiFormatLocalTimeDeserializer extends JsonDeserializer<LocalTime> {

    private static final DateTimeFormatter[] FORMATTERS = new DateTimeFormatter[]{
            DateTimeFormatter.ofPattern("HH:mm:ss"),
            DateTimeFormatter.ofPattern("HH:mm"),
            DateTimeFormatter.ISO_LOCAL_TIME
    };

    @Override
    public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String text = p.getText();
        if (text == null || text.trim().isEmpty() || "null".equalsIgnoreCase(text.trim())) {
            return null;
        }
        text = text.trim();
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalTime.parse(text, formatter);
            } catch (Exception ignored) {
            }
        }
        return LocalTime.parse(text);
    }
}
