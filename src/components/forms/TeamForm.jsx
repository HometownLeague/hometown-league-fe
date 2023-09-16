import React,{useEffect, useRef,useCallback,useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { SmileOutlined, UserOutlined } from '@ant-design/icons';
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
  TimePicker,  InputNumber,Typography 
} from 'antd';
import useModals from '../modal/useModal';
import {modals} from '../modal/Modals';


import useInput from '../useInput';
import { actionCreators as teamAction } from "../../redux/teamApi";
import KakaoMap from '../KaKaoMap.jsx';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
function TeamForm({stopEditing,isCreating,onsubmit,onClose,isUpdate,teamId}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [initialFormValue,setInitialFormValue]=useState({})
  const [teamname, onChangeTeamName] = useInput("");
  const [location,onChangeLocation]=useInput("");
  const [searchLocation,onChangeSearchLocation]=useInput("");
  const [time,onChangeTime]=useInput("")
  const [timeList,onChangeTimeList]=useInput([])
  const [desc, onChangeDesc] = useInput("");
  const [teamLogo,onChangeTeamLogo]=useState("");

  const { TextArea } = Input;
  const [form] = Form.useForm();

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

  // teamname 유효성 검사
  // length 2~20, english, korean, number
  const validateTeamname = useCallback((_, value) => {
    if (!value) {
      return Promise.reject(new Error('팀 이름을 입력해주세요.'));
    }
    let nicknameLength = 0;
    for (let i = 0; i < value.length; i += 1) {
      const char = value.charAt(i);
      if (escape(char).length > 4) {
        nicknameLength += 2;
      } else {
        nicknameLength += 1;
      }
    }
    if (nicknameLength < 2 || nicknameLength >= 20) {
      return Promise.reject(new Error('팀 이름 한글1~10자, 영문 및 숫자 2~20자까지 입력가능합니다.'));
    }

    const regExp = /[^a-zA-Z0-9가-힣_]+$/;
    if (regExp.test(value)) {
      return Promise.reject(new Error('팀 이름은 한글, 영문, 숫자, _ 만 사용할 수 있습니다.'));
    }
    return Promise.resolve();
  }, []);

  // teamname 중복 검사
  const onBlurTeamname =useCallback(() => {
    if (form.getFieldError('teamname').length === 0 && form.getFieldValue('teamname')) {
      axios({
        method: "get",
        url: `/team/is-duplicate/${form.getFieldValue('teamname')}`,
      })
        .then((response) => {
          if (response.data.data === 'Y') {
            form.setFields([{
              name: 'teamname',
              errors: ['이미 사용중인 팀 이름입니다.'],
            }]);
          }
        }).catch((e) => {
          console.error(e);
        });
    }
  }, []);

  const { openModal } = useModals();
  //TODO - kakomap으로 받아온 장소 파싱해서 넣기
  const openSearchMapModal = () => {
    openModal(modals.searchLocationModal, { onsubmit:(value)=>{console.log(value)}});
  };

  //모달 열기 닫기 함수
  const handleClickSubmit = useCallback(({teamname,location,timeList,desc,teamLogo})=>{
    const data={
      name: teamname,
      kind:1,
      description:desc,
      logo: teamLogo,
      location: location,
      time:timeList,
      owner: user.id
    }
    dispatch(teamAction.createTeamDB(data));
    window.location.reload();
  },[])

  const addTime=(time, timeString) => {
    console.log(time, timeString);
  };

  useEffect(()=>{
    //TODO - update일때 폼 초기값 설정
    if(isUpdate){
      axios({
        method: "get",
        url: `/team/${teamId}`,
      })
      .then((response) => {
        if (response.data.responseCode=== process.env.REACT_APP_API_RES_CODE_SUCESS) {
          setInitialFormValue(response.data.data);
        }
      }).catch((e) => {
        console.error(e);
      });
    }
  },[])
  return (
  <>
    <StyledCloseOutlined onClick={stopEditing}/>
    <Form
    form={form}
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
    initialValues={initialFormValue}
>
    <Form.Item label="팀 명"  name="teamname"  
     rules={[{ validator: validateTeamname }]}validateTrigger= 'onBlur' hasFeedback>
      <Input placeholder="팀 명" value={teamname} onChange={onChangeTeamName}  onBlur={onBlurTeamname}/>
    </Form.Item>
    <Form.Item label="종목"  rules={[{ required: true }]}>
      <Select placeholder="종목">
        <Select.Option value="soccer">축구</Select.Option>
      </Select>
    </Form.Item>
    {/* <Form.Item label="활동 지역" name="location" onChange={onChangeLocation} rules={[{ required: true, message: '활동 지역을 설정해주세요' }]}>
      <Form.Item  name="searchLocation">
        <Input placeholder="위치 검색" type="text" value={searchLocation} onSearch={onChangeSearchLocation}style={{
        width: 200,
      }}/>
      </Form.Item>
      <KakaoMap search={searchLocation}/>
    </Form.Item> */}
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        if (name === 'locationForm') {
          const { basicForm } = forms;
          const locations = basicForm.getFieldValue('location') || [];
          basicForm.setFieldsValue({
            locations: [...location, values],
          });
        }
      }}
    >
      <Form
        {...layout}
        name="locationForm"
        onFinish={onChangeLocation}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item name="locations" hidden />
        <Form.Item
          label="홛동 지역" rules={[
            {
              required: true,
            },
          ]}
          shouldUpdate={(prevValues, curValues) => prevValues.locations !== curValues.locations}
        >
          {({ getFieldValue }) => {
            const locations = getFieldValue('locations') || [];
            return locations.length ? (
              <ul>
                {locations.map((location) => (
                  <li key={location} className="location">
                    <Space>
                      {`${location}`}
                    </Space>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography.Text className="ant-form-text" type="secondary">
                ( 장소는 하나 이상 있어야 합니다.)
              </Typography.Text>
            );
          }}
        </Form.Item>
        <Form.Item {...tailLayout}>
          {/* <Button htmlType="submit" type="primary">
            Submit
          </Button> */}

          <Button  htmlType="button" type="dashed" onClick={openSearchMapModal} block icon={<PlusOutlined />}>
              장소 추가하기
              </Button>
        </Form.Item>
      </Form>
    </Form.Provider>
    {/* //FIXME - 시간 하나 이상 설정*/}
    <Form.Item label="활동 시간대" name="timeList" >
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
                  name={[name,"timeline"]}

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
  </>
  )
  
}

export default TeamForm


const StyledCloseOutlined=styled(CloseOutlined)`
  overflow: hidden;
	position: relative;
	border: none;
	padding: 0;
  right:40px;
  font-size:2em;
	width: 2em; height: 2em;
	border-radius: 50%;
	background: transparent;
	color: #1da1f2;
// 	font: inherit;
// 	text-indent: 100%;
	cursor: pointer;
	
	&:focus {
		outline: solid 0 transparent;
		box-shadow: 0 0 0 2px #8ed0f9
	}
	
	&:hover {
		background: rgba(29, 161, 142, .1)
	}
	
`