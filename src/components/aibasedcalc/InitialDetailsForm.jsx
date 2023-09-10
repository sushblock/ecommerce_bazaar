import React, { useState } from "react";
import styled from "styled-components";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const HelpIcon = styled.span`
  font-size: 18px;
  color: #007bff;
  margin-left: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const InitialDetailsForm = ({ onSubmit }) => {
  const [location, setLocation] = useState("");
  const [objectives, setObjectives] = useState("");
  const [method, setMethod] = useState("");
  const [resources, setResources] = useState("");
  const [crops, setCrops] = useState("");
  const [scale, setScale] = useState("");
  const [experience, setExperience] = useState("");
  const [budget, setBudget] = useState("");
  const [products, setProducts] = useState("");
  const [timeframe, setTimeframe] = useState("");

  const handleSubmit = async () => {
    // Compile the user's responses into a prompt for ChatGPT
    const prompt = `User: I need expert advice on starting a soilless farming operation.
User: I'm located in ${location}.
User: My main objectives are ${objectives}.
User: I'm interested in ${method} as my preferred soilless farming method.
User: I have access to ${resources}.
User: The crops I plan to grow include ${crops}.
User: My farming operation will be at a ${scale} scale.
User: I have ${experience} experience in soilless farming.
User: My budget for the setup is ${budget} USD.
User: I'm interested in growing ${products}.
User: I'd like to start the operation within ${timeframe}.

User: Can you respond in the following JSON format with the set of follow-up questions which you need answers to so that you can plan and estimate the whole farm setup to arrive at approach, prioritized backlog of features and requirements, major milestones, cost breakup and total cost?
{
  "responseType": "questions",
  "questions": [
    {
      "id": "1",
      "type": "text",
      "question": "Please specify the number of levels for your chosen soilless farming method."
    },
    {
      "id": "2",
      "type": "text",
      "question": "What is the spacing (in inches) between plants in each level?"
    },
    ...
    ...
    ...
    ...
    {
      "id": "5",
      "type": "text",
      "question": "Will you require a water recirculation system for your chosen method? If yes, please describe your requirements."
    },
    ...
    ...
    ...
    ...
  ]
}

User: If you don't need any follow up questions to arrive at the plan and estimates for the farm setup, then can you provide your response in this format
{
  "responseType": "estimates",
  {"estimates": [
    {
      approach: "";
      prioritised backlog of features and requirements: "";
      major milestones: "";
      cost estimate 1: INR ...;
      cost estimate 2: INR ...;
      cost estimate 3: INR ...;
      ..
      ...
      final cost estimate: INR ...;      
    }
  ]}
}
`;

    const generateTextFunction = httpsCallable(functions,"generateText");

    try {
      await generateTextFunction(JSON.stringify({ prompt }))
        .then((response) => response.json())
        .then((data) => {
          onSubmit(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Firebase function invocation failed:", error);
    }
  };

  return (
    <Container>
      <h2>Initial Details Collection</h2>
      <InputContainer>
        <Label>
          Location or Region:
          <HelpIcon
            onClick={() =>
              alert(
                "Enter the location or region where you plan to set up your farming operation."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Objectives:
          <HelpIcon
            onClick={() =>
              alert(
                "Briefly describe your farming objectives. Are you aiming for sustainable food production, commercial farming, or home gardening?"
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <TextArea
          rows="4"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Preferred Soilless Farming Method:
          <HelpIcon
            onClick={() =>
              alert("Select the soilless farming method you prefer.")
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Select</option>
          <option value="hydroponics">Hydroponics</option>
          <option value="aquaponics">Aquaponics</option>
          <option value="aeroponics">Aeroponics</option>
        </Select>
      </InputContainer>
      <InputContainer>
        <Label>
          Access to Resources:
          <HelpIcon
            onClick={() =>
              alert(
                "Describe your access to essential resources like water and electricity."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="text"
          value={resources}
          onChange={(e) => setResources(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Crop Selection:
          <HelpIcon
            onClick={() =>
              alert(
                "Specify the types of crops you intend to grow in your soilless farming operation."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="text"
          value={crops}
          onChange={(e) => setCrops(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Scale of Farming:
          <HelpIcon
            onClick={() =>
              alert(
                "Determine the size or scale of your farming operation. Are you planning a small garden, a medium-sized commercial farm, or a large-scale operation?"
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Select value={scale} onChange={(e) => setScale(e.target.value)}>
          <option value="">Select</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Select>
      </InputContainer>
      <InputContainer>
        <Label>
          Experience Level:
          <HelpIcon
            onClick={() =>
              alert(
                "Tell us about your experience level in soilless farming. Are you a beginner, an experienced grower, or an expert?"
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="experienced">Experienced</option>
          <option value="expert">Expert</option>
        </Select>
      </InputContainer>
      <InputContainer>
        <Label>
          Budget (in your currency):
          <HelpIcon
            onClick={() =>
              alert(
                "Specify your budget for the soilless farming setup in your local currency."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Preferred Crops or Products:
          <HelpIcon
            onClick={() =>
              alert(
                "If you have specific crops or products in mind (e.g., organic herbs, exotic fruits), please provide details."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="text"
          value={products}
          onChange={(e) => setProducts(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>
          Timeframe:
          <HelpIcon
            onClick={() =>
              alert(
                "Determine your desired timeframe for setting up the soilless farming operation. Some may want to start immediately, while others may have a longer planning horizon."
              )
            }
          >
            ?
          </HelpIcon>
        </Label>
        <Input
          type="text"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        />
      </InputContainer>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default InitialDetailsForm;
