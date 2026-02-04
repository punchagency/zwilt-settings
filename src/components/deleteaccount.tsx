import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
}

interface DeleteMessageProps {
  message: Message;
  onDelete: (id: number) => void;
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({ message, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(message.id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <p>{message.text}</p>
      <button onClick={handleDelete}>Delete Message</button>
      {showConfirmation && (
        <div className="confirmation">
          <p>Are you sure you want to delete this message?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default DeleteMessage;
