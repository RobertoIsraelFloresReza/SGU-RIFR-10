package com.example.server.model;

import com.example.server.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuariosController {

    private final UsuariosService service;

    public UsuariosController(UsuariosService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createUser(@RequestBody Usuarios usuarios) {
        return service.createUser(usuarios);
    }

    @PutMapping
    public ResponseEntity<ApiResponse> updateUser(@RequestBody Usuarios usuarios) {
        return service.updateUser(usuarios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUserById(@PathVariable Long id) {
        return service.deleteUserById(id);
    }
}
