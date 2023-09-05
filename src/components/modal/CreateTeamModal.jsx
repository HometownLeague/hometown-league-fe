import React,{useCallback,useState} from "react";
import ReactModal from 'react-modal';
import Swal from "sweetalert2";
import styled from "styled-components";
import { useDispatch,useSelector } from "react-redux";
import { CloseOutlined ,UploadOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons';
import {
  Button,
  Cascader,
  Form,
  Input,
  Select,
  Upload,
  Space,
  TimePicker
} from 'antd';


import useInput from '../useInput';
import { actionCreators as teamAction } from "../../redux/teamApi";

function CreateTeamModal({onSubmit, onClose }) {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [teamname, onChangeTeamName] = useInput("");
  const [location,onChangeLocation]=useInput("");
  const [time,onChangeTime]=useInput("")
  // const [timeEnd,onChangeTimeEnd]=useInput("")
  const [timeList,onChangeTimeList]=useInput([])
  const [desc, onChangeDesc] = useInput("");
  const [teamLogo,onChangeTeamLogo]=useState("");

  const { TextArea } = Input;
  //파일 개수 제한
  const normFile = (e) => {
    console.log("Upload event:", e);
    let fileList = e.fileList;
    fileList = fileList.slice(-1);

    if (Array.isArray(e)) {
      return e;
    }
    return e && fileList;
  };

  //모달 열기 닫기 함수
  const handleClickSubmit = useCallback(({teamname,location,timeList,desc,teamLogo})=>{
    const data={
      name: teamname,
      location: location,
      description:desc,
      logo: teamLogo,
      time:timeList,
      //FIXME -  id =null captin: user.id
      rank: "unrank",
    }
    dispatch(teamAction.createTeamDB(data));
    window.location.reload();
  })
  const handleClickCancel = () => {
    onClose();
  };
  const addTime=(time, timeString) => {
    console.log(time, timeString);
  };

  return (

  <ReactModal isOpen>
    <header >
      <text>팀 만들기</text>
      <CloseOutlined onClick={handleClickCancel}/>
    </header>
    
    <Form
  labelCol={{
    span: 4,
  }}
  wrapperCol={{
    span: 14,
  }}
  layout="horizontal"
  style={{
    maxWidth: 600,
    maxHeight:400
  }}
  onFinish={handleClickSubmit}
>
    <Form.Item label="팀 명"  name="teamname" rules={[{ required: true, message: '팀 이름을 정해주세요!' }]}>
      <Input placeholder="팀 명" value={teamname} onChange={onChangeTeamName}/>
    </Form.Item>
    <Form.Item label="종목"  rules={[{ required: true }]}>
      <Select placeholder="종목">
        <Select.Option value="soccer">축구</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="활동 지역" name="location" onChange={onChangeLocation} rules={[{ required: true, message: '활동 지역을 설정해주세요' }]}>
      <Cascader value={location}
        options={[
          {
            value: '서울시',
            label: '서울시',
            children: [
              {
                value: '노원구',
                label: '노원구',
              },
              {
                value: '강남구',
                label: '강남구',
              },
            ],
          },
        ]}
      />
    </Form.Item>
    {/* //FIXME - 시간 하나 이상 설정*/}
    <Form.Item label="활동 시간대" name="timeList"  rules={[{ required: true, message: '시간대는 1개 이상 있어야 합니다.' }]}>
    <Form.List name='time'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name="time"

                >
                  <TimePicker.RangePicker  use12Hours format="a h:mm"  value={time}/>

                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              시간대 추가하기
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>

    <Form.Item label="팀 소개글">
      <TextArea rows={4} placeholder='팀 소개글을 작성해주세요' value={desc} onChange={onChangeDesc}/>
    </Form.Item>
    {/* //FIXME - 사진 url 지정 */}
    <Form.Item label="팀 로고" valuePropName="fileList" getValueFromEvent={normFile}>
    <Upload name="logo" action="/upload.do" listType="picture" onChange={onChangeTeamLogo}>
      <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
    </Form.Item>
    <Form.Item>
    <Button type="primary" htmlType="submit" >
      Submit
    </Button>
    </Form.Item>
  </Form>
  </ReactModal>
  );
}

export default CreateTeamModal;