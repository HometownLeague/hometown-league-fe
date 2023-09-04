import { message } from 'antd';
import { rest } from 'msw'
import { API_URL } from '../lib/constants'

const users = [
  {
    id: "test1@gmail.com",
    nickname: "JYJ",
    description: "테스트 소개글",
    team: [],
    image: ""
  },
  {
    id: "test2@gmail.com",
    nickname: "LKH",
    description: "테스트 소개글2",
    team: [0],
    image: ""
  },
]
const teams = [
  {
    id: 0,
    name: "test1Team",
    owner_id: "test2@gmail.com",
    logoUrl: "",
    description: "팀1 소개글",
    rank_score: 0,
    kind: 1,
    create_timestamp: "230812",
  }
]
//req: 매칭되는 요청에 대한 정보 res: 모의 응답을 만들 수 있는 유틸리티 ctx: 모의 응답의 HTTP 상태 코드, 헤더, 바디 등을 만들 수 있는 함수들
export const handlers = [
  //SECTION - 유저 api
  //SECTION - 로그인
  rest.post('/API_URL/user/login', (req, res, ctx) => {
    const isAuthenticated = localStorage.getItem("user");
    console.log(req.body[0])
    if (!isAuthenticated) {
      if (!req.body.password) {
        return res(ctx.status(400), ctx.json({ message: 'password required' }))
      }
      if (!req.body.id) {
        return res(ctx.status(400), ctx.json({ message: 'id required' }))
      }
      const uData = {
        id: "test1@gmail.com",
        nickname: "JYJ",
        description: "테스트 소개글",
        team: [],
        image: ""
      }

      localStorage.setItem("user", uData)
      return res(ctx.json([uData]))
    }
  }),
  //SECTION - 유저 정보 조회
  rest.get('/API_URL/user/:id', async (req, res, ctx) => {
    const { uId } = req.params;
    const uData = users.filter(e => { return e.id === uId })
    return res(
      ctx.json([uData])
    )
  }),
  //SECTION - 회원가입
  rest.post('/API_URL/user/register', (req, res, ctx) => {
    users.push(req.json.data);
    return res(ctx.status(201));
  }),
  //  SECTION - 아이디,닉네임 중복 체크
  rest.get('/API_URL/user/is-duplicate', async (req, res, ctx) => {
    const type = req.params.get("type");
    const value = req.params.get("value");
    return res(
      res(ctx.status(400), ctx.json("N"))
    )
  }),
  //SECTION - 소속팀 목록 조회
  rest.get('/user/team/', async (req, res, ctx) => {
    return res(
      ctx.json()
    )
  }),
  //SECTION 팀 api

]