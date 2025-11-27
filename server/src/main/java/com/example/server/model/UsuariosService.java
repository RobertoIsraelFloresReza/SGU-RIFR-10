package com.example.server.model;

import com.example.server.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuariosService {

    private static final String EMAIL_EXISTS_MSG = "El correo electrónico ya existe";
    private static final String USER_EXISTS_MSG = "El usuario ya existe";
    private static final String TELEFONO_EXISTS_MSG = "El número telefónico ya existe";
    private static final String USER_NOT_FOUND_MSG = "Usuario no encontrado";
    private static final String ID_NOT_ALLOWED_ON_CREATE = "No incluir 'id' al crear un usuario. Enviar solo fullName, email y telefono.";

    private final UsuariosRepository repository;

    @Autowired
    public UsuariosService(UsuariosRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll() {
        return new ResponseEntity<>(new ApiResponse(repository.findAll(), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getUserById(Long id) {
        return repository.findById(id)
                .map(usuario -> new ResponseEntity<>(new ApiResponse(usuario, HttpStatus.OK), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(new ApiResponse(USER_NOT_FOUND_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST));
    }

    @Transactional
    public ResponseEntity<ApiResponse> createUser(Usuarios usuario) {
        if (usuario.getId() != null) {
            return new ResponseEntity<>(new ApiResponse(ID_NOT_ALLOWED_ON_CREATE, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            return new ResponseEntity<>(new ApiResponse(EMAIL_EXISTS_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        if (repository.findByFullName(usuario.getFullName()).isPresent()) {
            return new ResponseEntity<>(new ApiResponse(USER_EXISTS_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        if (repository.findByTelefono(usuario.getTelefono()).isPresent()) {
            return new ResponseEntity<>(new ApiResponse(TELEFONO_EXISTS_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        Usuarios savedUser = repository.save(usuario);
        return new ResponseEntity<>(new ApiResponse(savedUser, HttpStatus.OK), HttpStatus.OK);
    }


    @Transactional
    public ResponseEntity<ApiResponse> updateUser(Usuarios usuario) {
        return repository.findById(usuario.getId())
                .map(userExists -> {
                    if(usuario.getFullName() != null) userExists.setFullName(usuario.getFullName());
                    if(usuario.getEmail() != null) userExists.setEmail(usuario.getEmail());
                    if(usuario.getTelefono() != null) userExists.setTelefono(usuario.getTelefono());
                    if(!updateUserEmailIfValid(usuario, userExists)) {
                        return new ResponseEntity<>(new ApiResponse(EMAIL_EXISTS_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
                    }
                    Usuarios updatedUser = repository.save(userExists);
                    return new ResponseEntity<>(new ApiResponse(updatedUser, HttpStatus.OK), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(new ApiResponse(USER_NOT_FOUND_MSG, true, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST));
    }

    private boolean updateUserEmailIfValid(Usuarios updateUser, Usuarios existingUser) {
        if (!updateUser.getEmail().equals(existingUser.getEmail())) {
            if (repository.findByEmail(updateUser.getEmail()).isPresent()) {
                return false;
            } else {
                existingUser.setEmail(updateUser.getEmail());
            }
        }
        return true;
    }

    @Transactional
    public ResponseEntity<ApiResponse> deleteUserById(Long id) {
        if(!repository.existsById(id)) {
            return new ResponseEntity<>(new ApiResponse(USER_NOT_FOUND_MSG, true, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
        return new ResponseEntity<>(new ApiResponse("Usuario eliminado correctamente", HttpStatus.OK), HttpStatus.OK);
    }

}
