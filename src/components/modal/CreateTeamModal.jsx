import React,{useEffect, useRef,useCallback,useState} from "react";
import ReactModal from 'react-modal';
import useModals from './useModal';
import {modals} from './Modals';
import TeamForm from '../forms/TeamForm';

function CreateTeamModal({onSubmit, onClose,teamId,teamData}) {
  const handleClickCancel = () => {
    onClose();
  };

  return (
  <ReactModal isOpen onRequestClose={handleClickCancel}>
    <TeamForm onSubmit={onSubmit} onClose={onClose} isUpdate={true}  teamId={teamId} teamData={teamData}/>
  </ReactModal>
  );
}

export default CreateTeamModal;
