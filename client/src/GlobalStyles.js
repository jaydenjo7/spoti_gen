import { createGlobalStyle } from "styled-components";
import GothamMedium from "./fonts/GothamMedium.ttf";

export const COLORS = {
  green: "#1db954",
  darkerGrey: "#212121",
  black: "#121212",
  darkGrey: "#535353",
  lightGrey: " #b3b3b3",
};

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "Gotham Medium";
    src:url(${GothamMedium}) format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: "Gotham Medium", sans-serif;
margin: 0;
padding: 0;
  }
`;
