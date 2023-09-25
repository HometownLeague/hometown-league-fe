import { createGlobalStyle } from "styled-components";
//import reset from "styled-reset";
// ${reset}
const GlobalStyle = createGlobalStyle`
  :root{
    --yellow1:#FFFADD;
    --yellow2: #FFCC70;
    --blue1: #8ECDDD;    
    --blue2: #00AFF0;
    --blue3: #22668D;
  }
  html{
    scroll-behavior: smooth;
  }
  body{
    font-family: -apple-system, 
                BlinkMacSystemFont, 
                "Segoe UI", 
                Roboto,
                Oxygen-Sans, 
                Ubuntu, 
                Cantarell, 
                "Helvetica Neue", 
                sans-serif;
    background-color: #ffffff;
    display:flex;
    justify-content:center;
    position:relative;

    &::-webkit-scrollbar {
      width: 11px;
      height: 11px;
      background: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 7px;
      background-color: #787878;

      &:hover {
        background-color: #C0C0C0;
      }
      &:active{
        background-color: #C0C0C0;
      }
    }
    &::-webkit-scrollbar-track {
      background-color: #404040;
    }
  }
  #root.active::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100vh;
    background-color:rgba(0,0,0,0.6);
    z-index: 5;
  }
  button{
    border:none;
    outline:none;
    cursor: pointer;
    background-color:transparent;
    padding:0;
  }
  a{
    text-decoration:none;
  }
  a:focus, a:visited{
    /* color:inherit; */
  }
  aside.emoji-picker-react{
    position:absolute;
    top:40px;
  }

  @media (max-width:768px){
    #root{
      width:100%;
    }
  }
`;

export default GlobalStyle;