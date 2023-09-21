import React,{useEffect, useRef,useCallback,useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

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
  TimePicker,Typography 
} from 'antd';
import useModals from '../modal/useModal';
import {modals} from '../modal/Modals';
import { Text } from "../elements";
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
function TeamForm({isCreating,onsubmit,onClose,isUpdate,teamId}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userTeam=useSelector((state) => state.team.userTeams);
  const [initialFormValue,setInitialFormValue]=useState({})
  const [teamname, onChangeTeamName] = useInput("");
  const [location,onChangeLocation]=useInput("");
  const [searchLocation,onChangeSearchLocation]=useInput("");
  const [time,SetTime]=useState("")
  const [description, onChangeDescription] = useInput("");
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
    if (form.getFieldError('name').length === 0 && form.getFieldValue('name')) {
      axios({
        method: "get",
        url: `/team/is-duplicate/${form.getFieldValue('name')}`,
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

  const handleChangeTimeFields = (playTimeFromValue, playTimeToValue, index) => {
    // 시작 시간이 종료 시간보다 늦은 경우, 값을 바꿉니다.
    if (playTimeFromValue && playTimeToValue && playTimeFromValue >= playTimeToValue) {
      form.setFieldsValue({
          'time[index].playTimeTo': playTimeToValue,
          'time[index].playTimeFrom': playTimeFromValue,
        });
      }
    return Promise.resolve();
  }
    
  const { openModal } = useModals();
  //TODO - kakomap으로 받아온 장소 파싱해서 넣기
  const openSearchMapModal = () => {
    openModal(modals.searchLocationModal, { onsubmit:(value)=>{console.log(value)}});
  };
  const handleClickCancel = () => {
    onClose();
  };
  // submit함수
  const handleClickSubmit =(values) => {
    console.log(values)
    const formattedTime = values.time.map((item) => ({
      dayOfWeek: item.dayOfWeek,
      playTimeFrom: item.playTimeFrom.format('HHmm'),
      playTimeTo: item.playTimeTo.format('HHmm'),
    }));

    // 기본 데이터
    const basicData = {
      name: values.teamname,
      kind: 1,
      description: values.description,
      // ciPath:values. teamLogo
    };

    // 시간 데이터
    const timeData = {
      time: formattedTime,
    };

    // 위치 데이터
    const locationData = {
      location: values.location,
    };
    console.log(basicData.timeData)
    if (isUpdate) {
      // 업데이트 요청
      dispatch(teamAction.updateTeamDB( basicData, timeData, locationData ));
      onClose();
    } else {
      // 새로운 팀 생성 요청
      const data = {
        ...basicData,
        location: values.location,
        time: formattedTime,
        owner: user.id,
      };
        dispatch(teamAction.createTeamDB(data));
      onClose();
      window.location.reload();
    }
    }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(()=>{
    //TODO - update일때 폼 초기값 설정
    if(isUpdate){
      axios({
        method: "get",
        url: `/team/${teamId}`,
      })
      .then((response) => {
        if (response.data.responseCode.code=== process.env.REACT_APP_API_RES_CODE_SUCESS) {
          const data=response.data.data;
          
          setInitialFormValue({
            name : data.name,
            ciPath : data.ciPath,
            description : data.description,
            kind : 1,
            time : data.time.map((timeItem) => ({
              ...timeItem,
              playTimeFrom:  dayjs(timeItem.playTimeFrom, 'HHmm'),
              playTimeTo:  dayjs(timeItem.playTimeTo, 'HHmm'),
            })),
            location : data.location.map((locationItem) => ({
              ...locationItem,
              // 추가적인 가공이 필요한 경우 여기에서 수행
            })),
          });
          console.log("initialForm",initialFormValue)
        }
      }).catch((e) => {
        console.error(e);
      });
    }else setInitialFormValue({});
  },[])
  const initialValues = {
    time: [
      {
        id: 1,
        dayOfWeek: '1',
        playTimeFrom: dayjs('1000', 'HHmm'),
        playTimeTo: dayjs('1200', 'HHmm'),
      },
      {
        id: 2,
        dayOfWeek: '2',
        playTimeFrom: dayjs('2000', 'HHmm'),
        playTimeTo: dayjs('2200', 'HHmm'),
      },
    ],
  };
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
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
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    initialValues={initialFormValue}
>
  {!isUpdate?<Text  size="20px" title bold>팀 정보 수정하기</Text>:<Text  size="20px" title bold>새로운 팀 만들기</Text>}
    <Form.Item label="팀 명"  name="name"
     rules={[{ validator: validateTeamname }]} validateTrigger= 'onBlur' hasFeedback>
      <Input placeholder="팀 명" value={teamname} onChange={onChangeTeamName}  onBlur={onBlurTeamname}/>
    </Form.Item>
    <Form.Item label="종목"  name="kind" rules={[{ required: true }]}>
      <Select placeholder="종목">
        <Select.Option value="soccer">축구</Select.Option>
      </Select>
    </Form.Item>

    {/* //FIXME - 시간 하나 이상 설정*/}
    <Form.Item label="활동 시간대" >
      <Form.List name='time' rules={[{  validator: async (_, t) => {
      if (!t|| t.length < 1) {
        return Promise.reject(new Error('활동 시간대는 하나 이상 있어야합니다. '));
      }
    }}]} >
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
                    },
                    // ({ getFieldValue }) => ({
                    //   validator(_, value) {
                    //     const playTimeFromValue = getFieldValue([name,'dayOfWeek']);
                    //     console.log(playTimeFromValue)
                    //     handleChangeTimeFields(playTimeFromValue, value, index); // index를 사용하여 i번째 요소 처리
                    //     if (value && playTimeFromValue && value.isSame(playTimeFromValue, 'minute')) {
                    //       return Promise.reject(new Error('시작 시간과 종료 시간은 30분 이상 차이나야 합니다.'));
                    //     }
                    //     return Promise.resolve();
                    //   },
                    // }),
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
      <Form.Item label="활동 지역">
        <Form.List name='location' rules={[{  validator: async (_, tl) => {
        if (!tl|| tl.length < 1) {
          return Promise.reject(new Error('활동 시간대는 하나 이상 있어야합니다. '));
        }}}]} >
          {(fields, { add, remove },{errors}) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: 'flex',
                }}
                align="baseline"
              >
                <Form.Item  {...restField}
                  name={[name,"spot"]}  rules={[
                    {
                      required: true,
                      message: 'Missing location',
                    },
                  ]}>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => {
                add()
                openSearchMapModal()
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
      <TextArea rows={4} placeholder='팀 소개글을 작성해주세요' value={description} onChange={onChangeDescription}/>
    </Form.Item>

    {/* //FIXME - 사진 url 지정 */}
    <Form.Item label="팀 로고" valuePropName="fileList" getValueFromEvent={normFile}>
    <Upload name="logo" action="/upload.do" listType="picture" onChange={onChangeTeamLogo}>
      <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
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