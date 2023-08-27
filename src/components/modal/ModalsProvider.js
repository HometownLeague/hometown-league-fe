
import React, { useMemo, useState } from 'react';
import { ModalsDispatchContext, ModalsStateContext } from './ModalsContext';
import Modals from './Modals';
const ModalsProvider = ({ children }) => {
  const [openedModals, setOpenedModals] = useState([]);

  //열고 싶은 모달 컴포넌트, 모달컴포넌트로 넘겨주고 싶은 props
  const open = (Component, props) => {
    setOpenedModals((modals) => {
      return [...modals, { Component, props }];
    });
  };

  const close = (Component) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  };
  //modalsDispatchContext에 넘겨주는 dispatch가 재생성되서 리렌더링 막기위해 usememo
  const dispatch = useMemo(() => ({ open, close }), []);


  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>
        {children}
        <Modals />
      </ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};

export default ModalsProvider;
