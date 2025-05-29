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
        let mensaje = `Has seleccionado pagar por ${metodo}.`;

        if (metodo === "Transferencia") {
            mensaje += "\n\nDatos para Transferencia:\nCBU: 0000003100000001234567\nAlias: alma.rosa.shop\nTitular: Alma Rosa S.R.L.";
        } else {
            mensaje += "\n\nSerá redirigido al sistema de pago con tarjeta (no implementado en esta demo).";
        }

        alert(mensaje);
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
        contenedorCarrito.style.display = visible ? "none" : "block";
        actualizarCarrito();
    });

    btnVaciarCarrito?.addEventListener("click", vaciarCarrito);
    btnCerrarCarrito?.addEventListener("click", () => {
        contenedorCarrito.style.display = "none";
    });

    actualizarCarrito();

    // Limpiar el contenedor de opciones de pago si existe
    const opcionesPago = document.getElementById("opciones-pago");
    if (opcionesPago) {
        opcionesPago.innerHTML = "";

        if (carrito.length > 0) {
            const linkPago = document.createElement("a");
            linkPago.href = "https://www.mercadopago.com.ar/cuenta?matt_tool=13868572&utm_source=google&utm_medium=search&gad_source=1&gad_campaignid=19024272361&gbraid=0AAAAACuOqt_p-GUpoSzOfcNZDze3G8VNz&gclid=CjwKCAjw6NrBBhB6EiwAvnT_rnkCA61ih9qKSqRTfA2xTU-qXm8TK0gPpEL5gVYFkTv12QV3_VEWcRoCFjEQAvD_BwE"; // tu link real de Mercado Pago
            linkPago.target = "_blank";

            const boton = document.createElement("button");
            boton.textContent = "Pagar con Mercado Pago";
            boton.style.backgroundColor = "#ee82ee";
            boton.style.color = "white";
            boton.style.padding = "10px 20px";
            boton.style.border = "none";
            boton.style.borderRadius = "10px";
            boton.style.fontSize = "1rem";
            boton.style.cursor = "pointer";
            boton.style.marginTop = "20px";

            linkPago.appendChild(boton);
            opcionesPago.appendChild(linkPago);
        }
    }

});
