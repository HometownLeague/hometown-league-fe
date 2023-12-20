import React,{useState,useEffect,useCallback} from 'react'
import styled from 'styled-components';
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Space,
  TimePicker,Typography 
} from 'antd';

import { Text } from "../elements";

const { Option } = Select;
const provinceData = [
  '시/도',
  '서울',
  '인천',
  '수원',
  '일산',
  '안양',
  '부천',
  '용인',
  '파주',
  '안산',
  '고양',
  '하남',
  '김포',
  '남양주',
  '시흥',
  '평택',
  '화성',
  '포천',
  '성남',
  '부산',
  '대구',
  '대전',
  '세종',
  '청주',
  '울산',
  '창원',
  '천안',
  '광주',
  '제주',
];
const cityData = {
  '시/도': ['상세지역'],
  서울: [
    '전체',
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구'
  ],
  인천: ['전체', 
  '중구',
  '동구',
  '미추홀구',
  '연수구',
  '남동구',
  '부평구',
  '계양구',
  '서구',
  '강화군',
  '옹진군'
],
  수원: ['전체',
  '장안구',
  '권선구',
  '팔달구',
  '영통구',
],
  일산: ['전체'],
  안양: ['전체'],
  부천: ['전체'],
  용인: ['전체'],
  파주: ['전체'],
  안산: ['전체'],
  고양: ['전체'],
  하남: ['전체'],
  김포: ['전체'],
  남양주: ['전체'],
  시흥: ['전체'],
  평택: ['전체'],
  화성: ['전체'],
  포천: ['전체'],
  성남: ['전체', '분당구', '수정구','중원구'],
  부산: [
    '전체',
    '동구', '영도구', '부산진구', '동래구', '서구', '남구', '북구', '해운대구', '금정구',
    '강서구', '연제구', '수영구', '사상구', '기장군', '중구', '사하구'
  ],
  대구: ['전체',
  '중구',
  '동구',
  '서구',
  '남구',
  '북구',
  '수성구',
  '달서구',
  '달성군',
  '군위군'
],
  대전: ['전체', 
  '동구',
  '중구',
  '서구',
  '유성구',
  '대덕구',
],
  세종: ['전체'],
  청주: ['전체',
  '상당구',
  '흥덕구',
  '서원구',
  '청원구',
],
  울산: ['전체',
  '중구',
  '남구',
  '동구',
  '북구',
  '울주군',  
],
충주: ['전체'],
전주: ['전체'],
  창원: ['전체'],
  천안: ['전체'],
  광주: ['전체',
  '동구',
  '서구',
  '남구',
  '북구',
  '광산구',
],
  제주: ['전체'],
};

function SearchFilterForm({ onSubmit,defaultValue }) {
//  // 지역 필터 박스
 const [cities, setCities] = useState(cityData[provinceData[0]]);
  const onChangeProvince = (value) => {
  setCities(cityData[value]);
  form.setFieldValue('city','전체')
  };
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const handleClickSubmit=(value) => {
    if(value.province==='시/도') value.province=''
    if(value.city==='전체') value.city=''
    onSubmit(value);
  }

  return (
    <Form
    form={form}
    onFinish={handleClickSubmit}
    layout="inline"
    initialtValues={defaultValue}
    >
      <div
        style={{ display: 'flex', marginRight: '22px' }}
      >
        <LocationDiv>
          <Form.Item name='province'>
            <Select
              onChange={onChangeProvince}
            placeholder='지역'

            style={{ width: '100%' }}
          >
            {provinceData.map((province) => (
              <Select.Option
                key={province}
                value={province}
                className='opt'
              >
                {province}
              </Select.Option>
            ))}
          </Select>
          </Form.Item>     
        </LocationDiv>
        <SecondLocationDiv>
          <Form.Item  name='city'  >
              <Select 
              style={{ width: '100%' }} 
              placeholder='상세 지역'>
            {cities.map((city) => (
              <Option
                key={city}
                value={city}
                className='opt'
              >
                {city}
              </Option>
            ))}
          </Select>
          </Form.Item>
        </SecondLocationDiv>
        
      <Form.Item label="요일" name="dayOfWeek" >
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

      <Form.Item  name="time" label="시간">
        <TimePicker format="HH:mm" use12Hours={false} minuteStep={30} />
      </Form.Item>
      </div>
      <div style={{ display: 'flex',}}>

      <Form.Item  name="fromScore" label='점수 제한'>
        <Input placeholder="최소" style={{
            width: 60,
          }}/>
    </Form.Item>
    <Text bold size="20px" margin="0 10px 0 0">~ </Text>
    <Form.Item  name="toScore">
        <Input placeholder="최대" style={{
            width: 60,
          }}/>
    </Form.Item>
      <Form.Item  name="keyword">
        <Input placeholder="이름으로 검색" />
    </Form.Item>
      <button>검색</button>
      </div>

    </Form>
  );
}

export default SearchFilterForm;
const SelectDiv = styled.div`
  display: flex;
  align-items: center;
`;

const SortWrap = styled.div`
  margin-left: 10px;
  max-width: 87%;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.is_responsive ? 'space-between' : 'flex-end'};
  @media only screen and (max-width: 1004px) {
    max-width: 100%;
  }
  @media only screen and (max-width: 414px) {
    margin: 0 10px 20px 10px;
  }
`;

const LocationDiv = styled.div`
  margin-right: 15px;
  max-width: 112px;
  min-width: 90px;
  @media only screen and (max-width: 414px) {
    & span {
      font-size: 10px;
    }
  }
`;

const SecondLocationDiv = styled.div`
  min-width: 94px;
  @media only screen and (max-width: 414px) {
    min-width: 78.81px;
    & span {
      font-size: 10px;
    }
  }
`;
