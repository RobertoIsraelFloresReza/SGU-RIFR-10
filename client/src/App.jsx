import React, { useEffect, useState } from "react";
import UsuarioController from "./modules/usuarios/usuario-controller";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", telefono: "" });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const result = await UsuarioController.getUsuarios();
    setUsuarios(result.data);
  };

  const openModal = (type, usuario = null) => {
    setModalType(type);
    setSelectedUsuario(usuario);
    setForm(
      usuario
        ? { fullName: usuario.fullName, email: usuario.email, telefono: usuario.telefono }
        : { fullName: "", email: "", telefono: "" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUsuario(null);
    setForm({ fullName: "", email: "", telefono: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let response;
    if (modalType === "add") {
      response = await UsuarioController.createUsuario(form);
    } else if (modalType === "edit") {
      response = await UsuarioController.updateUsuario({ ...selectedUsuario, ...form });
    }

    if (response.error) {
      console.error(response.message);
      Swal.fire("Error", response.message || "Ocurrió un error", "error");
      return;
    }

    Swal.fire(
      modalType === "add" ? "¡Usuario creado!" : "¡Usuario actualizado!",
      "",
      "success"
    );
    closeModal();
    fetchUsuarios();
  };

  const handleDelete = async (usuario) => {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Desea eliminar a ${usuario.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      const response = await UsuarioController.deleteUsuario(usuario.id);
      if (response.error) {
        Swal.fire("Error", response.message || "Ocurrió un error", "error");
        return;
      }
      Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      fetchUsuarios();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Usuarios</h2>
        <button
          className="btn btn-primary"
          onClick={() => openModal("add")}
        >
          <FaPlus className="me-2" />
          Nuevo Usuario
        </button>
        {/* <button onClick={() => testController.callAPI()} className='btn btn-success'>Checa que hace este botón</button> */}
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th style={{ width: 120 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.fullName}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      title="Editar"
                      onClick={() => openModal("edit", usuario)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(usuario)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSave}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "add" ? "Agregar Usuario" : "Editar Usuario"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalType === "add" ? "Agregar" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// 1. Configuración de redes
// #docker network create --driver bridge adj-net

// 2. Configuración de volúmenes
// #docker volume create adj-volume

// 3. Levantar los servicios
// #docker compose up --build -d

// 4. Apagar y eliminar contenedores
// #docker compose down

// 5. Crear otra red manualmente
// docker network create --driver bridge demo-net

// 6. Listar redes existentes
// docker network ls

// Comando para vincular git 
// git remote add origin https://<usuario>:<token>@github.com/<usuario>/<nombre_del_repositorio>.git

// docker compose up --build -d

// docker compose down

// docker compose build --no-cache

// docker compose up -d

export default App;