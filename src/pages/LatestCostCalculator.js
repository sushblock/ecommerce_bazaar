import React, { useState } from "react";
import styled from "styled-components";
import FarmingTechnique from "../components/FarmingTechnique";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ErrorMsg = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  width: 100px;
  font-size: 18px;
  text-align: left;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
`;

const ComponentContainer = styled.div`
  margin-top: 20px;
`;

function LatestCostCalculator() {
  const [farmSize, setFarmSize] = useState("");
  const [overallCost, setOverallCost] = useState(0);
  const [validationError, setValidationError] = useState("");

  // Function to update total cost
  const updateTotalCost = (cost) => {
    setOverallCost((prevTotalCost) => prevTotalCost + cost);
  };

  const resetOverallCost = () => {
    setOverallCost(0);
  }

  // Handle input changes and calculation
  const handleFarmSizeChange = (e) => {
    resetOverallCost();
    setFarmSize(e.target.value);
    setValidationError("");
  };

    // Handle "Let's Begin" button click
  const handleBeginClick = () => {
    if (!farmSize || farmSize <= 0) { 
      setValidationError(
        "Farm size should be greater than 0."
      );
    } else {
      // Clear the validation error and show the components
      setValidationError("");
    }
  };

  return (
    <Container>
      <Header>Soilless Farm Cost Estimation</Header>
      <InputContainer>
        <Label>Farm Size:</Label>
        <Input type="number" value={farmSize} onChange={handleFarmSizeChange} />
      </InputContainer>
      <Button onClick={handleBeginClick}>Let's Begin</Button>

      {validationError && <ErrorMsg>{validationError}</ErrorMsg>}

      {/* Container for components - Only visible when fields are populated */}
      {farmSize>0 && (
        <ComponentContainer>
          {/* Render the FarmingTechnique component and pass farmSize, length, breadth, and updateTotalCost */}
          <FarmingTechnique
            farmSize={farmSize}
            updateTotalCost={updateTotalCost}
          />

          {/* Add other components as needed */}
        </ComponentContainer>
      )}

      {/* Display the total cost */}
      {farmSize>0 && (
        <div>
          <h3>Total Cost:</h3>
          <p>${overallCost}</p>
        </div>
      )}
    </Container>
  );
}

export default LatestCostCalculator;
