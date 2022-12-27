import React from "react";
import styled from "styled-components";

function NotFound() {
  return (
    <Container>
      <span>Not found</span>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  display: flex;
  span {
    margin: auto;
    font-weight: 500;
  }
`;
