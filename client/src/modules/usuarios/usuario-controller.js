const UsuarioController = {};
const ENV = import.meta.env;

const API_URL = `${ENV.VITE_API_PROTOCOL}://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

UsuarioController.getUsuarios = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
};

UsuarioController.getUsuarioById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
};

UsuarioController.createUsuario = async (usuario) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    });
    const data = await response.json();
    return data;
};

UsuarioController.updateUsuario = async (usuario) => {
    const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    });
    const data = await response.json();
    return data;
}

UsuarioController.deleteUsuario = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};

// TestController.callToAPI = async () => {
//     await fetch(`${API_URL}/test`, {
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json'
//         }
//     }).then(res => res.json()).then(res => {
//         console.log(res);
//     }).catch(console.log);
// }

export default UsuarioController;

