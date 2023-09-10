import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EstimatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const FinalResponse = ({ finalEstimates }) => {
  return (
    <Container>
      <h2>Final Estimates</h2>
      <EstimatesContainer>
        {finalEstimates.map((estimate, index) => (
          <div key={index}>
            {Object.entries(estimate).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ))}
      </EstimatesContainer>
    </Container>
  );
};

export default FinalResponse;
