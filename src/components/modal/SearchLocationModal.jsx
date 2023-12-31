import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, } from 'antd';

import KakaoMap from '../KakaoMap.jsx';
import useInput from '../useInput';

const customStyles = {
  // content: {
  //   top: '50%',
  //   left: '50%',
  //   right: 'auto',
  //   bottom: 'auto',
  //   marginRight: '-50%',
  //   transform: 'translate(-50%, -50%)',
  // },
};

function SearchLocationModal({ onSubmit,open, onClose}) {
  const [searchword,setSearchword]= useState("");
  const [value, onChangeValue] = useInput("");
  const [location,setLocation]=useState({})

  const handleClickCancel = () => {
    onClose();
  };
  const handleClickSubmit = async ()=>{ 
    localStorage.setItem("location",JSON.stringify(location))
    onSubmit()
  };
  const submitSearchword=()=>{
    setSearchword(value);
  }

  return (
  <ReactModal isOpen  onRequestClose={handleClickCancel} style={customStyles} shouldCloseOnOverlayClick={true} >
    <Input.Search placeholder='장소를 검색하세요.' value={value} onChange={onChangeValue} onSearch={submitSearchword} enterButton/>
    <KakaoMap searchplace={searchword} setLocation={setLocation}/>
    <Button type="primary" onClick={handleClickSubmit} >
      OK
    </Button><span>  </span>
    <Button type="primary" onClick={handleClickCancel}danger >
      Cancel
    </Button>
  </ReactModal>
  );
}

export default SearchLocationModal
