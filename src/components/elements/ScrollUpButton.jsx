import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

function ScrollUpButton() {
  const upBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  return (
    <>
      <BtnWrap>
        <Button
          onClick={upBtn}
          type='primary'
          shape='circle'
          icon={<ArrowUpOutlined />}
          size='large'
          style={{
            background:
              'linear-gradient(#00AFF0 0%, #00AFF0 50%, #8ECDDD 100%)',
            border: 'none',
            width: '100%',
            height: '100%',
          }}
        />
      </BtnWrap>
    </>
  );
}

const BtnWrap = styled.div`
  position: fixed;
  width: 50px;
  height: 50px;
  bottom: 100px;
  right: 30px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`;

export default ScrollUpButton;