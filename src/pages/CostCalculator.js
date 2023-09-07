import React, { Component } from "react";
import styled from "styled-components";
import AutomationLevelData from "../assets/automationLevel.json";
import { Link } from 'react-router-dom';

class CostCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Initial state with default values
      farmingType: "Hydroponics",
      location: "Backyard",
      farmArea: 0,
      recycleNutrients: false,
      seedlingArea: 0,
      automationLevel: "Low",
      estimatedCost: 0,
    };

    // Define unit costs (you can replace these with actual values)
    this.unitCosts = {
      hydroponics: 2000, // Cost per square meter for hydroponics
      aeroponics: 4000, // Cost per square meter for aeroponics
      aquaponics: 8000, // Cost per square meter for aquaponics
      seedlingArea: 600, // Cost per square meter for seedling area
      backyardGreenhouseCost: 2000, // Updated additional cost for backyard setup in India
      properFarmGreenhouseCost: 4000, // Updated additional cost for greenhouse setup in India
      recycleNutrientsPerSqMtr: 100,
    };

    // Define automation costs for different combinations with components breakdown
    this.automationCosts = {
      Hydroponics: {
        Backyard: {
          Low: {
            FixedCost: {
              Hardware: 200000, // Fixed cost for hardware in Low in Backyard
              Software: 10000, // Fixed cost for software in Low in Backyard
            },
            VariableCost: 50, // Variable automation cost per sq meter for Low in Backyard
          },
          Moderate: {
            FixedCost: {
              Hardware: 300000, // Fixed cost for hardware in Moderate in Backyard
              Software: 15000, // Fixed cost for software in Moderate in Backyard
            },
            VariableCost: 150, // Variable automation cost per sq meter for Moderate in Backyard
          },
          High: {
            FixedCost: {
              Hardware: 400000, // Fixed cost for hardware in High in Backyard
              Software: 20000, // Fixed cost for software in High in Backyard
            },
            VariableCost: 250, // Variable automation cost per sq meter for High in Backyard
          },
        },
        Greenhouse: {
          Low: {
            FixedCost: {
              Hardware: 400000, // Fixed cost for hardware in Low in Greenhouse
              Software: 20000, // Fixed cost for software in Low in Greenhouse
            },
            VariableCost: 200, // Variable automation cost per sq meter for Low in Greenhouse
          },
          Moderate: {
            FixedCost: {
              Hardware: 500000, // Fixed cost for hardware in Moderate in Greenhouse
              Software: 25000, // Fixed cost for software in Moderate in Greenhouse
            },
            VariableCost: 300, // Variable automation cost per sq meter for Moderate in Greenhouse
          },
          High: {
            FixedCost: {
              Hardware: 600000, // Fixed cost for hardware in High in Greenhouse
              Software: 30000, // Fixed cost for software in High in Greenhouse
            },
            VariableCost: 400, // Variable automation cost per sq meter for High in Greenhouse
          },
        },
      },
      Aeroponics: {
        Backyard: {
          Low: {
            FixedCost: {
              Hardware: 250000, // Fixed cost for hardware in Low in Backyard
              Software: 12000, // Fixed cost for software in Low in Backyard
            },
            VariableCost: 100, // Variable automation cost per sq meter for Low in Backyard
          },
          Moderate: {
            FixedCost: {
              Hardware: 350000, // Fixed cost for hardware in Moderate in Backyard
              Software: 16000, // Fixed cost for software in Moderate in Backyard
            },
            VariableCost: 200, // Variable automation cost per sq meter for Moderate in Backyard
          },
          High: {
            FixedCost: {
              Hardware: 450000, // Fixed cost for hardware in High in Backyard
              Software: 20000, // Fixed cost for software in High in Backyard
            },
            VariableCost: 300, // Variable automation cost per sq meter for High in Backyard
          },
        },
        Greenhouse: {
          Low: {
            FixedCost: {
              Hardware: 500000, // Fixed cost for hardware in Low in Greenhouse
              Software: 22000, // Fixed cost for software in Low in Greenhouse
            },
            VariableCost: 250, // Variable automation cost per sq meter for Low in Greenhouse
          },
          Moderate: {
            FixedCost: {
              Hardware: 600000, // Fixed cost for hardware in Moderate in Greenhouse
              Software: 26000, // Fixed cost for software in Moderate in Greenhouse
            },
            VariableCost: 350, // Variable automation cost per sq meter for Moderate in Greenhouse
          },
          High: {
            FixedCost: {
              Hardware: 700000, // Fixed cost for hardware in High in Greenhouse
              Software: 30000, // Fixed cost for software in High in Greenhouse
            },
            VariableCost: 450, // Variable automation cost per sq meter for High in Greenhouse
          },
        },
      },
      Aquaponics: {
        Backyard: {
          Low: {
            FixedCost: {
              Hardware: 300000, // Fixed cost for hardware in Low in Backyard
              Software: 15000, // Fixed cost for software in Low in Backyard
            },
            VariableCost: 150, // Variable automation cost per sq meter for Low in Backyard
          },
          Moderate: {
            FixedCost: {
              Hardware: 400000, // Fixed cost for hardware in Moderate in Backyard
              Software: 18000, // Fixed cost for software in Moderate in Backyard
            },
            VariableCost: 250, // Variable automation cost per sq meter for Moderate in Backyard
          },
          High: {
            FixedCost: {
              Hardware: 500000, // Fixed cost for hardware in High in Backyard
              Software: 20000, // Fixed cost for software in High in Backyard
            },
            VariableCost: 350, // Variable automation cost per sq meter for High in Backyard
          },
        },
        Greenhouse: {
          Low: {
            FixedCost: {
              Hardware: 600000, // Fixed cost for hardware in Low in Greenhouse
              Software: 25000, // Fixed cost for software in Low in Greenhouse
            },
            VariableCost: 300, // Variable automation cost per sq meter for Low in Greenhouse
          },
          Moderate: {
            FixedCost: {
              Hardware: 700000, // Fixed cost for hardware in Moderate in Greenhouse
              Software: 28000, // Fixed cost for software in Moderate in Greenhouse
            },
            VariableCost: 400, // Variable automation cost per sq meter for Moderate in Greenhouse
          },
          High: {
            FixedCost: {
              Hardware: 800000, // Fixed cost for hardware in High in Greenhouse
              Software: 30000, // Fixed cost for software in High in Greenhouse
            },
            VariableCost: 500, // Variable automation cost per sq meter for High in Greenhouse
          },
        },
      },
    };
  }

  // Function to calculate the estimated cost and cost breakdown
  calculateCost = () => {
    const {
      farmingType,
      location,
      farmArea,
      seedlingArea,
      automationLevel,
      estimatedCost,
      recycleNutrients, // Include recycleNutrients in the calculation
    } = this.state;

    // Calculate cost based on user inputs and unit costs
    const farmingCost =
      (seedlingArea > 0 ? farmArea - seedlingArea : farmArea) *
      this.unitCosts[farmingType.toLowerCase()];
    const seedlingCost = seedlingArea * this.unitCosts.seedlingArea;
    const automationCostHardware =
      this.automationCosts[farmingType][location][automationLevel].FixedCost
        .Hardware;
    const automationCostSoftware =
      this.automationCosts[farmingType][location][automationLevel].FixedCost
        .Software;
    const automationVariableCost =
      (seedlingArea > 0 ? farmArea - seedlingArea : farmArea) *
      this.automationCosts[farmingType][location][automationLevel].VariableCost;
    const additionalLocationCost =
      location === "Backyard"
        ? farmArea * this.unitCosts.backyardGreenhouseCost
        : farmArea * this.unitCosts.properFarmGreenhouseCost;
    const locationCostDescription =
      location === "Backyard"
        ? "Shaded net Greenhouse Cost"
        : "Proper Greenhouse Cost";

    // Additional cost for recycling nutrients
    const recycleNutrientsCost = recycleNutrients
      ? farmArea * this.unitCosts.recycleNutrientsPerSqMtr
      : 0;

    // Calculate the total cost
    const totalCost =
      farmingCost +
      seedlingCost +
      automationCostHardware +
      automationCostSoftware +
      automationVariableCost +
      additionalLocationCost +
      recycleNutrientsCost;

    // Set the calculated costs and descriptions in the state
    this.setState({
      farmingCost,
      seedlingCost,
      automationCostHardware,
      automationCostSoftware,
      automationVariableCost,
      additionalLocationCost,
      locationCostDescription,
      recycleNutrientsCost, // Include recycleNutrientsCost in the state
      estimatedCost: totalCost,
    });
  };

  // Function to handle form input changes
  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle different input types
    const newValue = type === "checkbox" ? checked : value;

    this.setState({ [name]: newValue });
  };

  // Function to submit the form
  handleSubmit = (event) => {
    event.preventDefault();
    this.calculateCost();
  };

  // Function to print the cost details
  printCostDetails = () => {
    const {
      farmingType,
      location,
      farmArea,
      seedlingArea,
      automationLevel,
      estimatedCost,
      farmingCost,
      seedlingCost,
      automationCostHardware,
      automationCostSoftware,
      automationVariableCost,
      additionalLocationCost,
      locationCostDescription,
      recycleNutrientsCost,
      recycleNutrients,
    } = this.state;

    // Retrieve the Description and Components from your JSON data
    const automationDescription =
      AutomationLevelData[farmingType][location][automationLevel].Description;
    const automationComponents =
      AutomationLevelData[farmingType][location][automationLevel].Components;

    // Calculate cost breakdown as before
    const farmingCostBreakdown = `${farmingType} Cost = ${farmingType}/sq meter x area = ₹${
      this.unitCosts[farmingType.toLowerCase()]
    } x ${
      seedlingArea > 0 ? farmArea - seedlingArea : farmArea
    } = ₹${farmingCost}`;
    const seedlingCostBreakdown = `Seedling Area Cost = Seedling Area/sq meter x area = ₹${this.unitCosts.seedlingArea} x ${seedlingArea} = ₹${seedlingCost}`;
    const automationCostHardwareBreakdown = `Automation Hardware Cost = ₹${automationCostHardware}`;
    const automationCostSoftwareBreakdown = `Automation Software Cost = ₹${automationCostSoftware}`;
    const automationCostVariableBreakdown = `Automation Variable Cost = Automation Software/sq meter x area = ₹${this.automationCosts[farmingType][location][automationLevel].VariableCost} x ${farmArea} = ₹${automationVariableCost}`;
    const recycleNutrientsCostBreakdown = `Recycle Nutrients Cost = Recycle Nutrients/sq meter x area = ₹${this.unitCosts.recycleNutrientsPerSqMtr} x ${farmArea} = ₹${recycleNutrientsCost}`;
    const additionalLocationCostBreakdown = `${locationCostDescription} Cost = ${locationCostDescription}/sq meter x area = ₹${
      location === "Backyard"
        ? this.unitCosts.backyardGreenhouseCost
        : this.unitCosts.properFarmGreenhouseCost
    } x ${farmArea} = ₹${additionalLocationCost}`;

    // Total cost calculation as before
    const totalCost =
      farmingCost +
      seedlingCost +
      automationCostHardware +
      automationCostSoftware +
      additionalLocationCost +
      (recycleNutrients ? recycleNutrientsCost : 0);

    // Prepare a string with cost details, including Description and Components
    const costDetails = `
      Farming Type: ${farmingType}
      Location: ${location}
      Total Farm Area (sq meters): ${farmArea}
      Automation Level: ${automationLevel}
      ${farmingCostBreakdown}
      ${seedlingCostBreakdown}
      ${automationCostHardwareBreakdown}
      ${automationCostSoftwareBreakdown}
      ${automationCostVariableBreakdown}
      ${recycleNutrients ? recycleNutrientsCostBreakdown : ""}
      ${additionalLocationCostBreakdown}
      Total Estimated Cost (₹): ₹${totalCost}
      Automation Description: ${automationDescription}
      Included Automation Components: ${automationComponents}
    `;

    // Create a new window for printing
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Cost Details</title>
        </head>
        <body>
          <pre>${costDetails}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  render() {
    const {
      farmingType,
      location,
      farmArea,
      seedlingArea,
      automationLevel,
      estimatedCost,
      recycleNutrients,
    } = this.state;

    return (
      <Container>
        <Title>Farm Setup Estimator</Title>
        <Form onSubmit={this.handleSubmit}>
          <Label>
            What type of farming are you interested in?
            <Select
              name="farmingType"
              value={farmingType}
              onChange={this.handleInputChange}
            >
              <option value="Hydroponics">Hydroponics</option>
              <option value="Aeroponics">Aeroponics</option>
              <option value="Aquaponics">Aquaponics</option>
            </Select>
          </Label>
          <Label>
            Where do you plan to set up your farm?
            <Select
              name="location"
              value={location}
              onChange={this.handleInputChange}
            >
              <option value="Backyard">Backyard</option>
              <option value="Greenhouse">Greenhouse</option>
            </Select>
          </Label>
          <Label>
            Total farm area (in square meters):
            <Input
              type="number"
              name="farmArea"
              value={farmArea}
              onChange={this.handleInputChange}
            />
          </Label>
          <Label>
            Do you plan to recycle nutrients?
            <Checkbox
              type="checkbox"
              name="recycleNutrients"
              checked={recycleNutrients}
              onChange={this.handleInputChange}
            />
          </Label>
          <Label>
            Seedling area (in square meters):
            <Input
              type="number"
              name="seedlingArea"
              value={seedlingArea}
              onChange={this.handleInputChange}
            />
          </Label>
          <Label>
            Automation level:
            <Select
              name="automationLevel"
              value={automationLevel}
              onChange={this.handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </Select>
          </Label>
          <Button type="submit">Calculate Estimated Cost</Button>
          <PrintButton onClick={this.printCostDetails}>
            Print Cost Details
          </PrintButton>
        </Form>
        {estimatedCost > 0 && (
          <EstimatedCost>
            <h2>Estimated Cost:</h2>
            <p>{`₹${estimatedCost}`}</p>
          </EstimatedCost>
        )}
        <BackButton to="/">Go Back</BackButton>
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #cff2b5;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  margin-bottom: 1rem;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Input = styled.input`
  padding: 10px;
  margin-top: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  margin-top: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Checkbox = styled.input`
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PrintButton = styled(Button)`
  background-color: #333;
  margin-top: 0.5rem;

  &:hover {
    background-color: #555;
  }
`;

const EstimatedCost = styled.div`
  margin-top: 2rem;

  h2 {
    font-weight: bold;
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem;
    color: #333;
    margin-bottom: 1rem;
  }
`;

const BackButton = styled(Link)`
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: inline-block;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  margin-top: 2rem;
  display: block;
  max-width: 200px;
  text-align: center;
  margin: 2rem auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export default CostCalculator;
