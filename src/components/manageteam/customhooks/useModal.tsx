import React, { useState } from "react";

const useModal = () => {
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setCurrentModal(modalName);
  const closeModal = () => setCurrentModal(null);

  return {
    currentModal,
    openModal,
    closeModal,
  };
};

export default useModal;
