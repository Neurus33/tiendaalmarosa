// carrito.js

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
    const linkWhatsapp = document.getElementById('whatsapp-link');

    if (linkWhatsapp) {
        linkWhatsapp.addEventListener("click", function () {
            const totalTexto = document.getElementById("total")?.textContent || "0";
            const nombre = prompt("Ingresá tu nombre:");

            const mensaje = `Hola, te envío el comprobante de mi pago por transferencia.\nMonto: $${totalTexto}\nNombre: ${nombre}\nGracias.`;
            const telefono = "5491112345678"; // ← cambiá esto por tu número sin espacios

            const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
            linkWhatsapp.href = url;
        });
    }

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

    // Mostrar carrito con animación
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

    // Cerrar carrito con animación
    btnCerrarCarrito?.addEventListener("click", () => {
        contenedorCarrito.classList.remove("fade-in");
        contenedorCarrito.classList.add("fade-out");

        setTimeout(() => {
            contenedorCarrito.style.display = "none";
        }, 400);
    });

    // Vaciar carrito con animación suave de cierre también
    btnVaciarCarrito?.addEventListener("click", () => {
        vaciarCarrito();

        contenedorCarrito.classList.remove("fade-in");
        contenedorCarrito.classList.add("fade-out");

        setTimeout(() => {
            contenedorCarrito.style.display = "none";
        }, 400);
    });

    actualizarCarrito();

    // Mostrar/ocultar opciones de pago con animación
    const radioMP = document.querySelector('input[value="mercadopago"]');
    const radioBanco = document.querySelector('input[value="banco"]');
    const divMP = document.getElementById('opcion-mercadopago');
    const divBanco = document.getElementById('opcion-banco');

    function actualizarVistaPago() {
        if (radioMP?.checked) {
            divBanco.style.display = 'none';
            divMP.style.display = 'block';
            divMP.classList.remove("fade-transition");
            void divMP.offsetWidth;
            divMP.classList.add("fade-transition");
        } else if (radioBanco?.checked) {
            divMP.style.display = 'none';
            divBanco.style.display = 'block';
            divBanco.classList.remove("fade-transition");
            void divBanco.offsetWidth;
            divBanco.classList.add("fade-transition");
        }
    }

    radioMP?.addEventListener('change', actualizarVistaPago);
    radioBanco?.addEventListener('change', actualizarVistaPago);
    actualizarVistaPago();
});
