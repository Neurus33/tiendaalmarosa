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
});
