package com.barbearia.barbershop_api.repository;

import com.barbearia.barbershop_api.entity.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Integer>{
    Optional<Barbeiro> findByEmail(String email);
    Optional<Barbeiro> findByUsuarioId(Integer id);
    boolean existsByEmail(String email);

}