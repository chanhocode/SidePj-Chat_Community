import React, { FunctionComponent, useCallback } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FunctionComponent<Props> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
