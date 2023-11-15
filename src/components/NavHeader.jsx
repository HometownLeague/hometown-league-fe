import React, { useEffect } from 'react'
import styled from "styled-components";
import { Link,} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFutbol} from "@fortawesome/free-solid-svg-icons";
import {Grid} from "./elements"

function NavHeader() {
  //const isLoading = useSelector((state) => state.user.userLoading);
  return (
    <>
    <Grid
      is_flex
      width="1140px"
      margin="0 auto">
      <StyledUl>
        <StyledLi>
          <StyledLink to="/">
            <FontAwesomeIcon icon={faFutbol} size='2x'/>
          </StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/teamManagement">팀 관리</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/myMatching">매칭</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/searchTeam">이적 시장</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">커뮤니티</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/">랭킹</StyledLink>
        </StyledLi>
      </StyledUl>
    </Grid>
    </>
  )
}


const StyledLi = styled.li`
list-style: one;
position: relative;
display: inline-block;
height: 50px;
line-height: 50px;
text-aign: center;
font-size: 16px;
font-weight: bold, ;
`;
const StyledLink = styled(Link)`
height: 50px;
display: block;
padding: 0px 30px;
cursor: pointer;
text-decoration: none;
font-size: 20px;
color:black;
`;

const StyledUl = styled.ul`
display: inline-block;
margin: 0;
padding: 0;
font-weight: normal;
line-height: 160%;
list-style : none;
display: flex;
justify-content: space-between;
`
export default NavHeader