import React,{useEffect, useRef,useCallback,useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

import styled from "styled-components";
import { useDispatch,useSelector } from "react-redux";
import { CloseOutlined ,UploadOutlined,MinusCircleOutlined,PlusOutlined, LoadingOutlined} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  TimePicker,
  Typography,
} from 'antd';

import useModals from '../modal/useModal';
import {modals} from '../modal/Modals';
import { Text } from "../elements";
import { actionCreators as teamAction } from "../../redux/teamApi";

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
const api = process.env.REACT_APP_API_URL;

function TeamForm({isCreating,onSubmit,onClose,isUpdate,teamId,teamData}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [initialFormValue,setInitialFormValue]=useState(teamData?teamData:{})
  const [locationList,setLocationList]=useState([]);
  const [logofile,setLogofile]=useState(null);
  const { TextArea } = Input;
  const [form] = Form.useForm();

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
    console.log(isUpdate)
    if (form.getFieldError('name').length === 0 && form.getFieldValue('name')) {
      axios({
        method: "get",
        url: `${api}/team/is-duplicate/${form.getFieldValue('name')}`,
      })
        .then((response) => {
          if (response.data.data === 'Y') {
            form.setFields([{
              name: 'name',
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
    openModal(modals.searchLocationModal, {onSubmit:()=>{
      const location=JSON.parse(localStorage.getItem("location"))
      const isDuplicate = locationList.some((l) => {
        return (
          location.latitude === l.latitude &&
          location.longitude === l.longitude
        );
      });
      if(!isDuplicate&&location!==null){
        setLocationList([...locationList, location]);
        form.setFieldsValue({'locationList':[...locationList,location]})}
      }
    });
  };
  const handleClickCancel = () => {
    onClose();
  };

//TODO - 장소 삭제
  const removeField = (index) => {
    handleChangeTimeFields();
    // 필드를 삭제하면 해당 인덱스의 값을 배열에서 제거
    const updatedList = [...locationList];
    updatedList.splice(index, 1);
    setLocationList(updatedList);
    // Form.List에도 반영
    form.setFieldsValue({
      locationList: locationList,
    });
  };
  //로고 이미지 업로드
  const onChangeImgFile =(e) => {
    e.preventDefault();
    if(e.target.files){
      const uploadFile = e.target.files[0]
      console.log(uploadFile)
      setLogofile(uploadFile);
    }
    
    // const formData = new FormData();
    // formData.append('img', img);
    // console.log(formData) // FormData {}
    // for (const keyValue of formData) console.log(keyValue); // ["img", File] File은 객체
}
const handleChangeTimeFields = ({dayOfWeek,playTimeFrom,playTimeTo},index) => {

  // 시작 시간이 종료 시간보다 늦은 경우, 값을 바꿉니다.
  if (playTimeFrom && playTimeTo && playTimeFrom >= playTimeTo) {
    form.setFieldsValue({
        'time[index].playTimeTo': playTimeTo,
        'time[index].playTimeFrom': playTimeFrom,
      });
    }
  if (playTimeFrom===playTimeTo) {
    return Promise.reject(new Error('시작 시간과 종료 시간은 30분 이상 차이나야 합니다.'));
  }
  return Promise.resolve();
}
  
  // submit함수
  const handleClickSubmit =(values) => {

    const formattedTime = values.time.map((item) => ({
      dayOfWeek: item.dayOfWeek,
      playTimeFrom: item.playTimeFrom.format('HHmm'),
      playTimeTo: item.playTimeTo.format('HHmm'),
    }));

    const formData = new FormData()
    formData.append('files',logofile);
    // 기본 데이터
    const basicData = {
      name: values.name,
      kind: 1,
      description: values.description,
    };

    // 시간 데이터
    const timeData = {
      time: formattedTime,
    };

    // 위치 데이터
    const locationData = {
      location: values.locationList,
    };
   
    if (isUpdate===true) {
      // 업데이트 요청
      dispatch(teamAction.updateTeamDB( basicData, timeData, locationData,formData));
      onClose();
    } else {
      // 새로운 팀 생성 요청
      const data = {
        ...basicData,
        location: values.locationList,
        time: formattedTime,
        owner: user.id,
      };
      console.log(data)
      dispatch(teamAction.createTeamDB(data,formData));
      onClose();
      //window.location.reload();
    }
    }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  
  return (
  <>
    <Form
    form={form}
    labelCol={{
      span: 4,
    }}
    wrapperCol={{
      span: 14,
    }}
    layout="horizontal"
    // style={{
    //   maxWidth: 600,
    //   maxHeight:400
    // }}
    onFinish={handleClickSubmit}
    onFinishFailed={onFinishFailed}
    initialValues={initialFormValue}
>
  {isUpdate===true?
  <Text  size="20px" title bold>팀 정보 수정하기</Text>:
  <Text  size="20px" title bold>새로운 팀 만들기</Text>}
    <Form.Item label="팀 명"  name="name"
     rules={[{ validator: validateTeamname }]} validateTrigger= 'onBlur' hasFeedback>
      <Input placeholder="팀 명" onBlur={onBlurTeamname}/>
    </Form.Item>
    <Form.Item label="종목"  name="kind" rules={[{ required: true }]}>
      <Select placeholder="종목">
        <Select.Option value="soccer">축구</Select.Option>
      </Select>
    </Form.Item>

    {/* //FIXME - 시간 하나 이상 설정*/}
    <Form.Item label="활동 시간대" >
      <Form.List name='time'
      rules={[
        {
          validator: async (_, timeArray) => {
            if (!timeArray || timeArray.length < 1) {
              return Promise.reject(new Error('활동 시간대는 하나 이상 있어야합니다. '));
            }
            const uniqueTimes = new Set();
            // 시작 시간이 종료 시간보다 늦은 경우, 값을 바꿉니다.
            timeArray.forEach((time, index) => {
              const dayOfWeek = time?.dayOfWeek;
              const playTimeFrom = time?.playTimeFrom;
              const playTimeTo = time?.playTimeTo;
              if (playTimeFrom && playTimeTo && playTimeFrom===playTimeTo) {
                return Promise.reject(new Error('시작 시간과 종료 시간은 30분 이상 차이나야 합니다.'));
              }
              // Check if playTimeFrom is later than playTimeTo
              if (playTimeFrom && playTimeTo && playTimeFrom >= playTimeTo) {
                // Swap values
                timeArray[index].playTimeFrom = playTimeTo;
                timeArray[index].playTimeTo = playTimeFrom;
              }
              // Generate a unique key for the time slot
              const timeKey = `${dayOfWeek}_${playTimeFrom}_${playTimeTo}`;
  
              // Check for duplicate time slots
              if (uniqueTimes.has(timeKey)) {
                return Promise.reject(new Error('중복된 시간대가 있습니다.'));
              }
  
              // Add the time to the set
              uniqueTimes.add(timeKey);
            });
          },
        },
      ]}
  >
        {(fields, { add, remove },{errors}) => (
          <>
            {fields.map(({ key, name, ...restField },index) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                }}
                align="baseline"
              >
                <Form.Item  {...restField}
                  name={[name,"dayOfWeek"]}  rules={[
                    {
                      required: true,
                      message: '활동 요일을 선택해주세요',
                    },
                  ]}>
                    <Select
                    placeholder="요일"
                    style={{
                      width: 100,
                    }}
                  >
                    <Select.Option value="1">월요일</Select.Option>
                    <Select.Option value="2">화요일</Select.Option>
                    <Select.Option value="3">수요일</Select.Option>
                    <Select.Option value="4">목요일</Select.Option>
                    <Select.Option value="5">금요일</Select.Option>
                    <Select.Option value="6">토요일</Select.Option>
                    <Select.Option value="7">일요일</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "playTimeFrom"]}
                  rules={[
                    {
                      required: true,
                      message: "활동 시작 시간을 선택해주세요",
                    },
                   
                  ]}
                >
                  <TimePicker format="HH:mm" use12Hours={false} minuteStep={30} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "playTimeTo"]}
                  rules={[
                    {
                      required: true,
                      message: "활동 종료 시간을 선택해주세요",
                    }
                  ]}
                >
                  <TimePicker format="HH:mm" use12Hours={false} minuteStep={30} />
                </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              시간대 추가하기
              </Button>
              <Form.ErrorList errors={errors} />

            </Form.Item>
          </>
          )}
        </Form.List>
      </Form.Item>
      {/* //FIXME - 지역 중복 제거, null값 제거 */}
      <Form.Item label="활동 지역">
        <Form.List name='locationList' rules={[{  validator: async (_, tl) => {
        if (!tl|| tl.length < 1) {
          return Promise.reject(new Error('활동 지역은 하나 이상 있어야합니다. '));
        }}}]} >
          {(fields, { add, remove },{errors}) => (
          <>
            {fields.map(({ key, name,...restField },index) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                }}
                align="baseline"
              >
                <Form.Item  {...restField}
                  name={[name,"spot"]} >
                    <Input  disabled="true"/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() =>{
                    remove(name)
                    removeField(index)
                  }}/>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => {
                openSearchMapModal()
                add()
              }} block icon={<PlusOutlined />}>
              활동 지역 추가하기
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

    </Form.Item>
    <Form.Item label="팀 소개글" name="description">
      <TextArea rows={4} placeholder='팀 소개글을 작성해주세요'/>
    </Form.Item>

    {/* //FIXME - 사진 url 지정 */}
    <Form.Item label="팀 로고" name="teamLogo">
     {/* <Upload  name="avatar" listType="picture-circle" action= '' beforeUpload={beforeUpload} maxCount={1} >
      uploadButton
      </Upload> */}
      <input type='file' 
      accept='image/*' 
      name='logoImg' 
      onChange={onChangeImgFile}>
  </input>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button><span>  </span>
      <Button type="primary" onClick={handleClickCancel}danger >
        Cancel
      </Button>
    </Form.Item>
    <Typography>
      <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
    </Typography>
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