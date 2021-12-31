let cerrar = document.querySelectorAll(".cerrar")[0];
let abrir = document.querySelectorAll(".btn-cambiar-contra")[0];
let modal = document.querySelectorAll(".modal")[0];
let modalC = document.querySelectorAll(".modal-contenedor")[0];
let mensaje = document.getElementById("message");
const formulario = document.getElementById("form-modificar");
const inputs = document.querySelectorAll("#form-modificar input");
let radios = document.querySelectorAll("[type='radio']");

const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
  apellidos: /^[a-zA-ZÀ-ÿ\s]{0,50}$/,
  password: /^.{4,10}$/,
  correo: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  direccion: /^[a-zA-ZÀ-ÿ0-9.#-_\s]{0,100}$/,
  celular: /^[0-9]{9}$/,
  usuario: /^[a-zA-Z0-9-_]{4,12}$/,
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;
    case "apellidoPaterno":
      validarCampo(expresiones.nombre, e.target, "apellidoPaterno");
      break;
    case "apellidoMaterno":
      validarCampo2(expresiones.apellidos, e.target, "apellidoMaterno");
      break;
    case "telefono":
      validarCampo2(expresiones.celular, e.target, "celular");
      break;
    case "usuario":
      validarCampo2(expresiones.usuario, e.target, "usuario");
      break;
    case "direccion":
      validarCampo2(expresiones.direccion, e.target, "direccion");
      break;
    case "correo_electronico":
      validarCampo(expresiones.correo, e.target, "correo");
      break;z
  }
};

const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value)) {
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
  } else {
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
  }
};

const validarCampo2 = (expresion, input, campo) => {
  if (input.value.length != 0) {
    if (expresion.test(input.value)) {
      document
        .getElementById(`grupo__${campo}`)
        .classList.remove("formulario__grupo-incorrecto");
      document
        .getElementById(`grupo__${campo}`)
        .classList.add("formulario__grupo-correcto");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.add("fa-check-circle");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.remove("fa-times-circle");
      document
        .querySelector(`#grupo__${campo} .formulario__input-error`)
        .classList.remove("formulario__input-error-activo");
    } else {
      document
        .getElementById(`grupo__${campo}`)
        .classList.add("formulario__grupo-incorrecto");
      document
        .getElementById(`grupo__${campo}`)
        .classList.remove("formulario__grupo-correcto");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.add("fa-times-circle");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.remove("fa-check-circle");
      document
        .querySelector(`#grupo__${campo} .formulario__input-error`)
        .classList.add("formulario__input-error-activo");
    }
  } else {
    if (
      document
        .getElementById(`grupo__${campo}`)
        .classList.contains("formulario__grupo-correcto")
    ) {
      document
        .getElementById(`grupo__${campo}`)
        .classList.remove("formulario__grupo-correcto");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.remove("fa-check-circle");
    } else if (
      document
        .getElementById(`grupo__${campo}`)
        .classList.contains("formulario__grupo-incorrecto")
    ) {
      document
        .getElementById(`grupo__${campo}`)
        .classList.remove("formulario__grupo-incorrecto");
      document
        .querySelector(`#grupo__${campo} i`)
        .classList.remove("fa-times-circle");
      document
        .querySelector(`#grupo__${campo} .formulario__input-error`)
        .classList.remove("formulario__input-error-activo");
    }
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

abrir.addEventListener("click", (e) => {
  e.preventDefault();
  modalC.style.opacity = "1";
  modalC.style.visibility = "visible";
  modal.classList.toggle("modal-close");
});

cerrar.addEventListener("click", (e) => {
  modal.classList.toggle("modal-close");
  setTimeout(() => {
    modalC.style.opacity = "0";
    modalC.style.visibility = "hidden";
  }, 500);
});

window.addEventListener("click", (e) => {
  if (e.target == modalC) {
    modal.classList.toggle("modal-close");
    setTimeout(() => {
      modalC.style.opacity = "0";
      modalC.style.visibility = "hidden";
    }, 500);
  }
});

if (mensaje != null) {
  setTimeout(() => {
    mensaje.classList.toggle("mensaje-activar");
  }, 5000);
}

radios.forEach((x) => {
  x.dataset.val = x.checked;

  x.addEventListener("click", (e) => {
    let element = e.target;

    if (element.dataset.val == "false") {
      element.dataset.val = "true";
    } else {
      element.dataset.val = "false";
      element.checked = false;
    }
  });
});




 



  
  

  


  

