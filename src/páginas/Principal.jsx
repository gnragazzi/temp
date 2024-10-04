import { useState } from "react";
import Modal from "../componentes/Modal";

function Principal() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div>
      <h1 className="prueba">Principal</h1>
      {modalAbierto && <Modal />}
      <button onClick={setModalAbierto(!modalAbierto)}></button>
    </div>
  );
}

export default Principal;
