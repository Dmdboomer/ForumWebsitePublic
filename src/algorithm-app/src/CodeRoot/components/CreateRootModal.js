import React from 'react';
import CreateTopic from './CreateTopic';

const CreateRootModal = ({ onClose, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <CreateTopic onClose={onClose} onCancel={onCancel} />
    </div>
  </div>
);

export default CreateRootModal;