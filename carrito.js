document.addEventListener("DOMContentLoaded", function () {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const botonesAgregar = document.querySelectorAll(".items button");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total");
  const contadorCarrito = document.getElementById("cart-count");

  const contenedorCarrito = document.getElementById("carrito");
  const btnVerCarrito = document.getElementById("verCarrito");
  const btnVaciarCarrito = document.getElementById("vaciarCarrito");
  const btnCerrarCarrito = document.getElementById("cerrarCarrito");
  const linkWhatsapp = document.getElementById("whatsapp-link");
  const btnEnvio = document.getElementById("btnEnvio");
  const formulario = document.getElementById("formulario-envio");
  const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
  const envioForm = document.getElementById("envioForm");

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
      const li = document.createElement("li");
      li.textContent = `${producto.descripcion} - $${producto.precio.toLocaleString()}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "X";
      btnEliminar.style.marginLeft = "10px";
      btnEliminar.addEventListener("click", () => {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
      });

      li.appendChild(btnEliminar);
      listaCarrito.appendChild(li);
      total += producto.precio;
    });

    totalCarrito.textContent = total.toLocaleString();
    contadorCarrito.textContent = carrito.length;
  }

  function vaciarCarrito() {
    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }

  window.confirmarCompra = function () {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const metodoSeleccionado = document.querySelector('input[name="metodo-pago"]:checked');
    if (!metodoSeleccionado) {
      alert("Por favor, seleccioná un método de pago.");
      return;
    }

    const metodo = metodoSeleccionado.value;

    if (metodo === "mercadopago") {
      window.open("https://www.mercadopago.com.ar", "_blank");
    } else if (metodo === "banco") {
      alert("Datos para Transferencia o Tarjeta:\n\nBanco Nación\nCBU: 0110599502000001234567\nAlias: alma.rosa.tienda\nTitular: Alma Rosa S.A.\nEnviar comprobante a: contacto@almarosa.com");
    }

    vaciarCarrito();
  };

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".items");
      const descripcion = item.querySelector(".descripcion").textContent.trim();
      const precioTexto = item.querySelector(".precio").textContent;
      const precio = parseInt(precioTexto.replace(/[^\d]/g, ""), 10);

      carrito.push({ descripcion, precio });
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      alert("Producto agregado al carrito.");
    });
  });

  btnVerCarrito.addEventListener("click", () => {
    const visible = contenedorCarrito.style.display === "block";

    if (visible) {
      contenedorCarrito.classList.remove("fade-in");
      contenedorCarrito.classList.add("fade-out");
      setTimeout(() => {
        contenedorCarrito.style.display = "none";
      }, 400);
    } else {
      contenedorCarrito.style.display = "block";
      contenedorCarrito.classList.remove("fade-out");
      void contenedorCarrito.offsetWidth;
      contenedorCarrito.classList.add("fade-in");
      actualizarCarrito();
    }
  });

  btnCerrarCarrito?.addEventListener("click", () => {
    contenedorCarrito.classList.remove("fade-in");
    contenedorCarrito.classList.add("fade-out");
    setTimeout(() => {
      contenedorCarrito.style.display = "none";
    }, 400);
  });

  btnVaciarCarrito?.addEventListener("click", () => {
    vaciarCarrito();
    contenedorCarrito.classList.remove("fade-in");
    contenedorCarrito.classList.add("fade-out");
    setTimeout(() => {
      contenedorCarrito.style.display = "none";
    }, 400);
  });

  if (linkWhatsapp) {
    linkWhatsapp.addEventListener("click", function () {
      const totalTexto = document.getElementById("total")?.textContent || "0";
      const nombre = prompt("Ingresá tu nombre:");
      const mensaje = `Hola, te envío el comprobante de mi pago por transferencia.\nMonto: $${totalTexto}\nNombre: ${nombre}\nGracias.`;
      const telefono = "5491112345678";
      const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
      linkWhatsapp.href = url;
    });
  }

  btnEnvio?.addEventListener("click", () => {
    if (formulario && carrito.length > 0) {
      formulario.style.display = "block";
      formulario.scrollIntoView({ behavior: "smooth" });
      formulario.classList.remove("fadeSlideIn");
      void formulario.offsetWidth;
      formulario.classList.add("fadeSlideIn");

      btnConfirmarCompra.disabled = true;
    } else {
      alert("El carrito está vacío. Agregá productos antes de continuar.");
    }
  });

  // VALIDACIÓN VISUAL

  function mostrarError(input, mensaje) {
    const small = document.getElementById(`error-${input.id}`);
    input.classList.add("error-input");
    small.textContent = mensaje;
  }

  function limpiarError(input) {
    const small = document.getElementById(`error-${input.id}`);
    input.classList.remove("error-input");
    small.textContent = "";
  }

  function validarFormularioVisualmente() {
    let valido = true;

    const campos = [
      "nombre", "email", "telefono", "direccion",
      "ciudad", "codigoPostal", "tipoEnvio"
    ];

    campos.forEach(id => limpiarError(document.getElementById(id)));

    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    const nombre = document.getElementById("nombre");
    const ciudad = document.getElementById("ciudad");
    const codigoPostal = document.getElementById("codigoPostal");
    const tipoEnvio = document.getElementById("tipoEnvio");

    if (nombre.value.trim().length < 2) {
      mostrarError(nombre, "Nombre muy corto");
      valido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      mostrarError(email, "Correo inválido");
      valido = false;
    }

    if (!/^(\+54)?[0-9]{10,13}$/.test(telefono.value.trim())) {
      mostrarError(telefono, "Teléfono inválido (ej: +54911...)");
      valido = false;
    }

    if (direccion.value.trim().length < 5) {
      mostrarError(direccion, "Dirección muy corta");
      valido = false;
    }

    if (ciudad.value.trim().length < 2) {
      mostrarError(ciudad, "Ciudad inválida");
      valido = false;
    }

    if (!/^\d{4,8}$/.test(codigoPostal.value.trim())) {
      mostrarError(codigoPostal, "Código Postal inválido");
      valido = false;
    }

    if (!tipoEnvio.value) {
      mostrarError(tipoEnvio, "Seleccione un tipo de envío");
      valido = false;
    }

    return valido;
  }

  // ✳️ VALIDAR EL ENVÍO DEL FORMULARIO
  envioForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormularioVisualmente()) {
      alert("Formulario enviado correctamente.");
      envioForm.reset();
      formulario.style.display = "none";
      btnConfirmarCompra.disabled = false;
    } else {
      alert("Por favor, corregí los errores antes de enviar.");
    }
  });

  actualizarCarrito();
});
