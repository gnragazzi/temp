import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Formulario_Mantenimiento = () => {
  const navegar = useNavigate();
  const [pantalla, setPantalla] = useState(0);
  const [vehiculos, setVehiculos] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const [mecanicosSeleccionados, setmecanicosSeleccionados] = useState([]);
  const [esCamion, setEsCamion] = useState(false);

  const [datos, setDatos] = useState({
    trabajos_realizados: "",
    costo_repuestos: 0,
    costo_manodeobra: 0,
    fecha: new Date().toISOString().substring(0, 10),
  });
  const enviarFormulario = () => {
    const { trabajos_realizados, costo_manodeobra, costo_repuestos, fecha } =
      datos;
    const cuerpo = {
      trabajos_realizados,
      fecha,
      costo_repuestos,
      costo_manodeobra,
      vehiculo: {
        vehiculoSeleccionado,
        esCamion,
      },
      mecanicosSeleccionados,
    };

    axios
      .post("http://localhost:8080/mantenimiento", cuerpo, {
        headers: { "content-type": "application/json" },
      })
      .then((res) => console.log(res));
    navegar("/mantenimiento");
  };
  useEffect(() => {
    axios.create({ timeout: 1000 });
    axios
      .get("http://localhost:8080/vehiculos", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        setVehiculos(res.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:8080/mecanicos", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        setMecanicos(res.data);
      });
  }, []);
  return (
    <div className="cuerpo formulario">
      {/* elegir un vehículo de una lista */}
      {pantalla == 0 && (
        <>
          <h2>Seleccionar Vehículo</h2>
          <div className="container__table">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Patente</th>
                </tr>
              </thead>
              <tbody>
              {vehiculos.map((vehiculo) => {
              const { patente, marca } = vehiculo;
              return (
              <tr className={
                vehiculoSeleccionado == patente
                  ? "vehiculos_lista vehiculos_lista_seleccionado"
                  : "vehiculos_lista"
              }
              key={patente}
              onClick={() => {
                patente != vehiculoSeleccionado
                  ? setVehiculoSeleccionado(patente)
                  : setVehiculoSeleccionado("");
                //verificamos un atributo que solo un camión tendría para determinar si es camión o semiremolque
                vehiculo.cilindrada
                  ? setEsCamion(true)
                  : setEsCamion(false);
              }}>
                <td>
                  <p>{marca}</p>
                </td>
                <td>
                  <p>{patente}</p>
                </td>
              </tr>
              );
            })}
              </tbody>
        </table>
      </div>
        </>
      )}
      {pantalla == 1 && (
        <>
          <h2>Seleccionar Mecánico</h2>
          <div className="container__table">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                </tr>
              </thead>
              <tbody>
                {mecanicos.map((mecanico) => {
                  const { dni, nombre, apellido } = mecanico;
                  return (
                    <tr
                      className={
                        mecanicosSeleccionados.includes(dni)
                          ? "vehiculos_lista vehiculos_lista_seleccionado"
                          : "vehiculos_lista"
                      }
                      key={dni}
                      onClick={() => {
                        mecanicosSeleccionados.includes(dni)
                          ? setmecanicosSeleccionados(
                              mecanicosSeleccionados.filter((m) => m != dni)
                            )
                          : setmecanicosSeleccionados([
                              ...mecanicosSeleccionados,
                              dni,
                            ]);
                      }}
                    >
                      <td>
                        <p>{dni}</p>
                      </td>
                      <td>
                        <p>{nombre}</p>
                      </td> 
                      <td>
                        <p>{apellido}</p>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      </>
      )}
      {pantalla == 2 && (
        <>
          <h2>Algunos Datos Más...</h2>
          <form>
            <fieldset>
              <legend>Ingrese el trabajo</legend>
              <textarea
                placeholder="Ingrese el trabajo que se hizo"
                value={datos.trabajos_realizados}
                onChange={(e) =>
                  setDatos({ ...datos, trabajos_realizados: e.target.value })
                }
              />
            </fieldset>
            <fieldset>
              <legend>Costo de Repuesto</legend>
              <input
                placeholder="Costo de Repuesto"
                type="number"
                value={datos.costo_repuestos}
                onChange={(e) =>
                  setDatos({ ...datos, costo_repuestos: e.target.value })
                }
              />
            </fieldset>
            <fieldset>
              <legend>Costo de Mano de Obra</legend>
              <input
                placeholder="Costo de Mano de Obra"
                type="number"
                value={datos.costo_manodeobra}
                onChange={(e) =>
                  setDatos({ ...datos, costo_manodeobra: e.target.value })
                }
              />
            </fieldset>
            <fieldset>
              <legend>Fecha</legend>
              <input
                type="date"
                value={datos.fecha}
                onChange={(e) => {
                  setDatos({ ...datos, fecha: e.target.value });
                }}
              />
            </fieldset>
          </form>
        </>
      )}
      {pantalla == 3 && (
        <>
          <h2>Confirme Selección</h2>
          {vehiculos.map((v) => {
            return (
              v.patente == vehiculoSeleccionado && (
                <p key={v.patente}>
                  Marca: {v.marca} | Patente {v.patente}
                </p>
              )
            );
          })}
          {mecanicos.map((m) => {
            return (
              mecanicosSeleccionados.includes(m.dni) && (
                <p key={m.dni}>
                  Nombre: {m.nombre} {m.apellido} | DNI: {m.dni}
                </p>
              )
            );
          })}
          <p>Trabajo Realizado: {datos.trabajos_realizados}</p>
          <p>Costo Repuesto: {datos.costo_repuestos}</p>
          <p>Costo Mano de Obra: {datos.costo_manodeobra}</p>
          <p>Fecha: {datos.fecha}</p>
        </>
      )}

      <div className="botonera_formulario">
        {pantalla == 0 && (
          <button className="formulario__boton volver" onClick={() => navegar("/mantenimiento")}>
            Volver
          </button>
        )}
        {pantalla > 0 && (
          <button className="formulario__boton volver" onClick={() => setPantalla(pantalla - 1)}>Volver</button>
        )}
        {pantalla < 3 && (
          <button className="formulario__boton siguiente" 
            onClick={() => {
              if (
                (pantalla == 0 && vehiculoSeleccionado) ||
                (pantalla == 1 && mecanicosSeleccionados.length > 0) ||
                (pantalla == 2 &&
                  datos.costo_manodeobra &&
                  datos.costo_repuestos &&
                  datos.trabajos_realizados &&
                  datos.fecha)
              )
                setPantalla(pantalla + 1);
            }}
          >
            Siguiente
          </button>
        )}
        {pantalla == 3 && <button onClick={enviarFormulario}>Confirmar</button>}
      </div>
    </div>
  );
};
