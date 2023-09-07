// FarmingTechnique.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import techniqueConfigurations from "../config/techniqueConfigurations.json"; // Load JSON file

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
`;

const Header = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
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

const TechniqueSection = styled.div`
  margin-top: 20px;
`;

const TechniqueButton = styled(Button)`
  background-color: ${({ selected }) => (selected ? "#333" : "#007bff")};
  margin-right: 10px;
`;

const SetupSection = styled.div`
  margin-top: 20px;
`;

const SetupButton = styled(Button)`
  background-color: ${({ selected }) => (selected ? "#333" : "#007bff")};
  margin-right: 10px;
`;

const CostSection = styled.div`
  margin-top: 20px;
`;

const CostLabel = styled.p`
  font-size: 18px;
  color: #333;
`;

const TotalCost = styled.p`
  font-size: 20px;
  color: #333;
`;

function FarmingTechnique({ farmSize, updateTotalCost }) {
  const [technique, setTechnique] = useState("");
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [adjustedFarmSize, setAdjustedFarmSize] = useState(null);
  const [discountRate, setDiscountRate] = useState(0);

  // Add a useEffect hook to reset component state when farmSize changes
  useEffect(() => {
    setTechnique("");
    setSelectedSetup(null);
    setTotalCost(0);
    setAdjustedFarmSize(null);
    setDiscountRate(0);
  }, [farmSize]);

  const handleTechniqueSelection = (selectedTechnique) => {
    setTechnique(selectedTechnique);
    setSelectedSetup(null);
    updateTotalCost(-totalCost);
    setTotalCost(0);
    setAdjustedFarmSize(null);
  };

  const handleSetupSelection = (selectedSetup) => {
    updateTotalCost(-totalCost);
    setSelectedSetup(selectedSetup);
    const areaCost = selectedSetup.areaCostPerSquareMeter;
    let totalAdditionalCost = 0;

    if (technique === "aquaponics") {
      const reductionFactor =
        techniqueConfigurations.techniques[technique].reductionFactor || 1.0;
      const originalFarmSize = parseFloat(farmSize);
      const reducedSize = originalFarmSize * reductionFactor;
      setAdjustedFarmSize(reducedSize);
    } else {
      setAdjustedFarmSize(null);
    }

    selectedSetup.additionalCosts.forEach((costItem) => {
      const cost = costItem.costPerSquareMeter * farmSize;
      totalAdditionalCost += cost;
    });

    const setupCost = areaCost * farmSize + totalAdditionalCost;

    // Apply discount based on farm size
    const discountSlabs = Object.values(
      techniqueConfigurations.discountRatesSlabs
    );
    const farmSizeFloat = parseFloat(farmSize);

    for (const slab of discountSlabs) {
      if (farmSizeFloat >= slab.minSize && farmSizeFloat < slab.maxSize) {
        setDiscountRate(slab.discountRate);
        break;
      }
    }

    // Calculate the discounted cost
    const discountedCost = setupCost * (1 - discountRate);

    // Set the discountRate
    setTotalCost(discountedCost);

    updateTotalCost(discountedCost);
  };

  return (
    <Container>
      <Header>Farming Technique Setup</Header>

      <TechniqueSection>
        <h3>Select Farming Technique:</h3>
        {Object.keys(techniqueConfigurations.techniques).map((tech) => (
          <TechniqueButton
            key={tech}
            selected={technique === tech}
            onClick={() => handleTechniqueSelection(tech)}
          >
            {techniqueConfigurations.techniques[tech].name}
          </TechniqueButton>
        ))}
      </TechniqueSection>

      {technique && (
        <SetupSection>
          <h3>Select Setup:</h3>
          {techniqueConfigurations.techniques[technique].setupOptions.map(
            (setup) => (
              <SetupButton
                key={setup.name}
                selected={selectedSetup === setup}
                onClick={() => handleSetupSelection(setup)}
              >
                {setup.name}
              </SetupButton>
            )
          )}
        </SetupSection>
      )}

      {selectedSetup && (
        <CostSection>
          <h3>Farming Technique Setup Total Cost:</h3>
          <CostLabel>
            {selectedSetup.name} Setup: ${selectedSetup.areaCostPerSquareMeter}{" "}
            per sq meter (Total for {farmSize} sq meters): $
            {selectedSetup.areaCostPerSquareMeter * farmSize}
          </CostLabel>
          {technique === "aquaponics" && adjustedFarmSize !== null ? (
            <CostLabel>
              Adjusted Farm Size (due to fish tanks): {adjustedFarmSize} sq
              meters
            </CostLabel>
          ) : null}
          {selectedSetup.additionalCosts.map((costItem) => (
            <CostLabel key={costItem.name}>
              {costItem.name}: ${costItem.costPerSquareMeter} per sq meter
              (Total for {farmSize} sq meters): $
              {costItem.costPerSquareMeter * farmSize}
            </CostLabel>
          ))}
          <CostLabel>
            Discount Rate: {(discountRate * 100).toFixed(2)}%
          </CostLabel>
          <TotalCost>
            Total Farming Technique Cost: ${totalCost} (Total for{" "}
            {technique === "aquaponics" ? adjustedFarmSize : farmSize} sq
            meters)
          </TotalCost>
        </CostSection>
      )}
    </Container>
  );
}

export default FarmingTechnique;
