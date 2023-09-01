import { rest } from 'msw'

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

export const handlers = [
  //SECTION - 유저 api
  //SECTION - 로그인
  rest.post('/login', (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem('username')
    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authenticated',
        }),
      )
    }
    return res(
      ctx.json({
        firstName: 'John',
      }),
    )
  }),
  //SECTION - 유저 정보 조회
  rest.get('/user', async (req, res, ctx) => {
    return res(
      ctx.json()
    )
  }),
  //SECTION - 회원가입
  rest.post('/login', (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem('username')

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authenticated',
        }),
      )
    }

    return res(
      ctx.json({
        firstName: 'John',
      }),
    )
  }),
  //SECTION - 아이디,닉네임 중복 체크
  rest.get('/user', async (req, res, ctx) => {
    return res(
      ctx.json()
    )
  }),
  //SECTION - 소속팀 목록 조회
  rest.get('/user', async (req, res, ctx) => {
    return res(
      ctx.json()
    )
  }),
  //SECTION 팀 api

]