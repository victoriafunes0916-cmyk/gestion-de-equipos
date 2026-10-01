let equipos = [];

let equipoEditando = null;

const STORAGE_KEY = "inventario_dispositivos";


/* ELEMENTOS DEL FORMULARIO */

const formulario = document.getElementById("equipo-form");

const tipo = document.getElementById("tipo");

const titular = document.getElementById("titular");

const marca = document.getElementById("marca");

const procesador = document.getElementById("procesador");

const ram = document.getElementById("ram");

const almacenamiento =
    document.getElementById("almacenamiento");

const video = document.getElementById("video");

const pulgadas = document.getElementById("pulgadas");

const estado = document.getElementById("estado");


/* BOTONES */

const btnGuardar =
    document.getElementById("btn-guardar");

const btnCancelar =
    document.getElementById("btn-cancelar");

const formTitle =
    document.getElementById("form-title");


/* BÚSQUEDA Y FILTROS */

const buscador =
    document.getElementById("buscador");

const filtroTipo =
    document.getElementById("filtro-tipo");

const filtroEstado =
    document.getElementById("filtro-estado");


/* TABLA */

const cuerpoTabla =
    document.getElementById("cuerpo-tabla");

const sinEquipos =
    document.getElementById("sin-equipos");

const contador =
    document.getElementById("contador");


/* CONTADORES */

const contadorTotal =
    document.getElementById("contador-total");

const contadorOperativo =
    document.getElementById("contador-operativo");

const contadorReparacion =
    document.getElementById("contador-reparacion");

const contadorDescartado =
    document.getElementById("contador-descartado");


/* IMPORTAR Y EXPORTAR */

const btnExportar =
    document.getElementById("btn-exportar");

const btnImportar =
    document.getElementById("btn-importar");

const inputImportar =
    document.getElementById("input-importar");


/* CLASE DEL ESTADO */

function claseEstado(valor) {

    if (valor === "Operativo") {
        return "estado-operativo";
    }

    if (valor === "En reparación") {
        return "estado-reparacion";
    }

    return "estado-descartado";
}


/* TEXTO DEL ESTADO */

function textoEstado(valor) {

    if (valor === "Operativo") {
        return "Disponible";
    }

    if (valor === "En reparación") {
        return "En mantenimiento";
    }

    return "Fuera de servicio";
}


/* ACTUALIZAR CONTADORES */

function actualizarContadores() {

    contadorTotal.textContent =
        equipos.length;


    contadorOperativo.textContent =
        equipos.filter(
            equipo => equipo.estado === "Operativo"
        ).length;


    contadorReparacion.textContent =
        equipos.filter(
            equipo => equipo.estado === "En reparación"
        ).length;


    contadorDescartado.textContent =
        equipos.filter(
            equipo => equipo.estado === "Descartado"
        ).length;
}


/* GUARDAR EN LOCALSTORAGE */

function guardarDatos() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(equipos)
    );
}


/* CARGAR DATOS */

function cargarDatos() {

    try {

        const datosGuardados =
            localStorage.getItem(STORAGE_KEY);


        if (datosGuardados) {

            const datos =
                JSON.parse(datosGuardados);


            if (Array.isArray(datos)) {

                equipos = datos;

            } else {

                equipos = [];

            }

        } else {

            equipos = [];

        }

    } catch (error) {

        console.error(
            "Error al cargar los datos:",
            error
        );

        equipos = [];
    }
}


/* CREAR FILA */

function crearFila(equipo, indice) {

    const fila =
        document.createElement("tr");


    fila.innerHTML = `

        <td>
            ${equipo.tipo}
        </td>

        <td>
            ${equipo.titular}
        </td>

        <td>
            ${equipo.marca}
        </td>

        <td>
            ${equipo.procesador}
        </td>

        <td>
            ${equipo.ram}
        </td>

        <td>
            ${equipo.almacenamiento}
        </td>

        <td>
            ${equipo.video || "-"}
        </td>

        <td>
            ${equipo.pulgadas || "-"}
        </td>

        <td>

            <span
                class="estado-badge ${claseEstado(
                    equipo.estado
                )}"
            >
                ${textoEstado(equipo.estado)}
            </span>

        </td>

        <td>

            <div class="acciones">

                <button
                    class="btn-edit"
                    onclick="editarEquipo(${indice})"
                >
                    Editar
                </button>


                <button
                    class="btn-delete"
                    onclick="eliminarEquipo(${indice})"
                >
                    Eliminar
                </button>

            </div>

        </td>

    `;


    return fila;
}


/* MOSTRAR TABLA */

function renderizar(lista = equipos) {

    cuerpoTabla.innerHTML = "";


    if (lista.length === 0) {

        sinEquipos.classList.remove("oculto");

    } else {

        sinEquipos.classList.add("oculto");


        lista.forEach(equipo => {

            const indiceReal =
                equipos.indexOf(equipo);


            cuerpoTabla.appendChild(
                crearFila(
                    equipo,
                    indiceReal
                )
            );

        });

    }


    contador.textContent =
        `${lista.length} ${
            lista.length === 1
                ? "dispositivo"
                : "dispositivos"
        }`;


    actualizarContadores();
}


/* GUARDAR O ACTUALIZAR */

function guardarEquipo(evento) {

    evento.preventDefault();


    const nuevoEquipo = {

        tipo: tipo.value,

        titular:
            titular.value.trim(),

        marca:
            marca.value.trim(),

        procesador:
            procesador.value.trim(),

        ram:
            ram.value.trim(),

        almacenamiento:
            almacenamiento.value.trim(),

        video:
            video.value.trim(),

        pulgadas:
            pulgadas.value.trim(),

        estado:
            estado.value
    };


    if (equipoEditando === null) {

        equipos.push(nuevoEquipo);

    } else {

        equipos[equipoEditando] =
            nuevoEquipo;

        equipoEditando = null;

        formTitle.textContent =
            "Agregar dispositivo";

        btnGuardar.textContent =
            "Guardar dispositivo";

        btnCancelar.classList.add(
            "oculto"
        );
    }


    guardarDatos();


    formulario.reset();


    estado.value =
        "Operativo";


    renderizar();
}


/* EDITAR */

function editarEquipo(indice) {

    const equipo =
        equipos[indice];


    if (!equipo) {
        return;
    }


    equipoEditando =
        indice;


    tipo.value =
        equipo.tipo;

    titular.value =
        equipo.titular;

    marca.value =
        equipo.marca;

    procesador.value =
        equipo.procesador;

    ram.value =
        equipo.ram;

    almacenamiento.value =
        equipo.almacenamiento;

    video.value =
        equipo.video;

    pulgadas.value =
        equipo.pulgadas;

    estado.value =
        equipo.estado;


    formTitle.textContent =
        "Editar dispositivo";


    btnGuardar.textContent =
        "Guardar cambios";


    btnCancelar.classList.remove(
        "oculto"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


/* ELIMINAR */

function eliminarEquipo(indice) {

    const equipo =
        equipos[indice];


    if (!equipo) {
        return;
    }


    const confirmar =
        confirm(
            `¿Querés eliminar el dispositivo de ${equipo.titular}?`
        );


    if (!confirmar) {
        return;
    }


    equipos.splice(
        indice,
        1
    );


    guardarDatos();


    renderizar();
}


/* BUSCAR */

function buscarEquipos() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    const tipoSeleccionado =
        filtroTipo.value;


    const estadoSeleccionado =
        filtroEstado.value;


    const resultados =
        equipos.filter(equipo => {


            const informacion = [

                equipo.tipo,

                equipo.titular,

                equipo.marca,

                equipo.procesador,

                equipo.ram,

                equipo.almacenamiento,

                equipo.video,

                equipo.pulgadas,

                equipo.estado

            ]
                .join(" ")
                .toLowerCase();


            const coincideTexto =
                informacion.includes(
                    texto
                );


            const coincideTipo =
                tipoSeleccionado === "" ||
                equipo.tipo === tipoSeleccionado;


            const coincideEstado =
                estadoSeleccionado === "" ||
                equipo.estado === estadoSeleccionado;


            return (
                coincideTexto &&
                coincideTipo &&
                coincideEstado
            );

        });


    renderizar(resultados);
}


/* CANCELAR EDICIÓN */

function cancelarEdicion() {

    equipoEditando = null;


    formulario.reset();


    estado.value =
        "Operativo";


    formTitle.textContent =
        "Agregar dispositivo";


    btnGuardar.textContent =
        "Guardar dispositivo";


    btnCancelar.classList.add(
        "oculto"
    );
}


/* EXPORTAR */

function exportarJSON() {

    if (equipos.length === 0) {

        alert(
            "No hay dispositivos para exportar."
        );

        return;
    }


    const contenido =
        JSON.stringify(
            equipos,
            null,
            2
        );


    const archivo =
        new Blob(
            [contenido],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            archivo
        );


    const enlace =
        document.createElement("a");


    enlace.href =
        url;


    enlace.download =
        "inventario_dispositivos.json";


    enlace.click();


    URL.revokeObjectURL(url);
}


/* IMPORTAR */

function importarJSON(evento) {

    const archivo =
        evento.target.files[0];


    if (!archivo) {
        return;
    }


    const lector =
        new FileReader();


    lector.onload =
        function(eventoLectura) {

            try {

                const datos =
                    JSON.parse(
                        eventoLectura.target.result
                    );


                if (!Array.isArray(datos)) {

                    throw new Error(
                        "Formato incorrecto"
                    );

                }


                equipos =
                    datos;


                guardarDatos();


                renderizar();


                alert(
                    "Los datos se importaron correctamente."
                );


            } catch (error) {

                alert(
                    "No se pudo importar el archivo. Verificá que sea un JSON válido."
                );

            }


            inputImportar.value = "";

        };


    lector.readAsText(
        archivo
    );
}


/* EVENTOS */

formulario.addEventListener(
    "submit",
    guardarEquipo
);


btnCancelar.addEventListener(
    "click",
    cancelarEdicion
);


buscador.addEventListener(
    "input",
    buscarEquipos
);


filtroTipo.addEventListener(
    "change",
    buscarEquipos
);


filtroEstado.addEventListener(
    "change",
    buscarEquipos
);


btnExportar.addEventListener(
    "click",
    exportarJSON
);


btnImportar.addEventListener(
    "click",
    function() {

        inputImportar.click();

    }
);


inputImportar.addEventListener(
    "change",
    importarJSON
);


/* INICIAR */

cargarDatos();

renderizar();
