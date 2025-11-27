package com.example.server.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    Optional<Usuarios> findByFullName(String fullName);
    Optional<Usuarios> findByEmail(String email);
    Optional<Usuarios> findByTelefono(String telefono);


}
