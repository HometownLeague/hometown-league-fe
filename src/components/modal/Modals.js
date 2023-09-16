import React, { useContext } from 'react';
import { ModalsStateContext, ModalsDispatchContext } from './ModalsContext';
import LoginModal from './LoginModal';
import CreateTeamModal from './CreateTeamModal';
import SearchLocationModal from './SearchLocationModal';

export const modals = {
  loginModal: LoginModal,
  createTeamModal: CreateTeamModal,
  searchLocationModal: SearchLocationModal
};
const Modals = () => {
  const openedModals = useContext(ModalsStateContext);
  const { close } = useContext(ModalsDispatchContext);

  return openedModals.map((modal, index) => {
    const { Component, props } = modal;
    const onClose = () => {
      close(Component);
    };
    // onSubmit 빼고 나머지 props rest로 재정의
    const { onSubmit, ...restProps } = props;
    const handleSubmit = async () => {
      if (typeof onSubmit === 'function') {
        await onSubmit();
      }
      onClose();
    };
    return <Component  {...restProps} key={index} {...props} onClose={onClose} onSubmit={handleSubmit} />
  })
}
export default Modals;