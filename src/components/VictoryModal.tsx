import React, { Dispatch } from "react";
import "../styles/victoryModal.css";

interface VictoryModalProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
}

const VictoryModal = ({ setShowModal }: VictoryModalProps) => {

  const toggleModal = () => {
    setShowModal(false);
  };

  return (
      <div className="modal">
        <div className="modal-content">
          <p>Contratulations, you have completed the puzzle😄</p>
          <button className="modal-close" onClick={toggleModal}>
            CLOSE
          </button>
        </div>
      </div>
  );
};

export default VictoryModal;
