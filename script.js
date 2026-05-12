let datos = [];

// LINK CSV GOOGLE SHEETS
const urlCSV =
    "https://docs.google.com/spreadsheets/d/1AfGBnYtxl53AiGHP6yLyhJUgenAgs7_VSUghYbZYsaY/gviz/tq?tqx=out:csv&gid=1449869612";



// CARGAR DATOS DESDE GOOGLE SHEETS


cargarDatos();

// Actualizar cada 30 segundos
setInterval(cargarDatos, 30000);

function cargarDatos(){

    Papa.parse(urlCSV, {

        download: true,
        header: true,

        complete: function(resultado){

            datos = resultado.data;

            console.log("Datos actualizados");
            console.log(datos);
        }
    });
}



// BUSCAR DIRECCIONES


function buscarDirecciones() {

    const fechaSeleccionada =
        document.getElementById("fecha").value;

    const tbody =
        document.querySelector("#tablaResultados tbody");

    tbody.innerHTML = "";

    const resultados = datos.filter(item => {

        const fechaExcel =
            item["FECHA INGRESO"];

        if (!fechaExcel)
            return false;

        const fecha =
            convertirFecha(fechaExcel);

        return fecha === fechaSeleccionada;
    });

    // Sin resultados
    if(resultados.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No se encontraron resultados
                </td>
            </tr>
        `;

        return;
    }

    // Mostrar resultados
    resultados.forEach(item => {

        const estado =
            obtenerEstado(item);

        tbody.innerHTML += `
            <tr>

                <td>
                    ${convertirFecha(item["FECHA INGRESO"])}
                </td>

                <td>
                    ${item["DIRECCIÓN"] || "Sin dirección"}
                </td>

                <td>
                    ${item["PROBLEMÁTICA"] || ""}
                </td>

                <td>
                    ${item["N° POSTE"] || ""}
                </td>

                <td>
                    ${estado}
                </td>

                <td>
                    ${item["FECHA SOLUCIÓN CONTRATISTA AP"] || ""}
                </td>

            </tr>
        `;
    });
}



// CONVERTIR FECHA


function convertirFecha(fechaTexto){

    if(!fechaTexto)
        return "";

    // Formato DD/MM/YYYY
    const partes =
        fechaTexto.split("/");

    if(partes.length === 3){

        const dia =
            partes[0].padStart(2, "0");

        const mes =
            partes[1].padStart(2, "0");

        const año =
            partes[2];

        return `${año}-${mes}-${dia}`;
    }

    return fechaTexto;
}



// OBTENER ESTADO


function obtenerEstado(item){

    const fechaInformada =
        item["FECHA INFORMADA A RESPONSABLE"]
        ?.trim();

    const fechaSolucion =
        item["FECHA SOLUCIÓN CONTRATISTA AP"]
        ?.trim();

    // Pendiente
    if(fechaInformada && !fechaSolucion){
        return "Pendiente";
    }

    // Solucionado
    if(fechaInformada && fechaSolucion){
        return "Solucionado";
    }

    // Sin gestionar
    return "Sin gestionar";
}