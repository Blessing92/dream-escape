import styled, { css } from "styled-components"

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = styled.h1<HeadingProps>`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}

  line-height: 1.4;
`

export default Heading
