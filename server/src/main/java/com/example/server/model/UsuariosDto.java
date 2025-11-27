package com.example.server.model;

public class UsuariosDto {

    private String fullName;
    private String email;
    private String telefono;

    public UsuariosDto(String fullName, String email, String telefono) {
        this.fullName = fullName;
        this.email = email;
        this.telefono = telefono;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
