import React, { useState } from "react";
import styled from "styled-components";
import {
  InitialDetailsForm,
  FollowUpQuestionsForm,
  FinalResponse,
} from "../../components/aibasedcalc";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase";

function AIBasedCalc() {
  const [section, setSection] = useState("initial"); // initial, followUp, final
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [finalEstimates, setFinalEstimates] = useState(null);
  const [conversationContext, setConversationContext] = useState(null);

  const handleSubmitInitial = (data) => {
    // Handle initial form submission and response
    // If follow-up questions are received, update the state
    if (data.responseType === "questions") {
      setSection("followUp");
      setFollowUpQuestions(data.questions);
      setConversationContext(data.conversationContext); // Update conversation context
    } else if (data.responseType === "estimates") {
      setSection("final");
      setFinalEstimates(data.estimates);
    }
  };

  const handleSubmitFollowUp = async (responses) => {
    const userQuestionsAndResponses = responses.map((item) => ({
      id: item.id,
      type: item.type,
      question: item.question,
      answer: item.answer,
    }));

    const followUpPrompt = `User: ${JSON.stringify(userQuestionsAndResponses)}
   
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
      await generateTextFunction(
        JSON.stringify({ followUpPrompt, conversationContext })
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.responseType === "estimates") {
            setSection("final");
            setFinalEstimates(data.estimates);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Firebase function invocation failed:", error);
    }
  };

  return (
    <StyledApp>
      {section === "initial" && (
        <InitialDetailsForm
          onSubmit={handleSubmitInitial}
          conversationContext={conversationContext}
        />
      )}
      {section === "followUp" && (
        <FollowUpQuestionsForm
          followUpQuestions={followUpQuestions}
          onSubmitAnswers={handleSubmitFollowUp}
          conversationContext={conversationContext}
        />
      )}
      {section === "final" && <FinalResponse finalEstimates={finalEstimates} />}
    </StyledApp>
  );
}

const StyledApp = styled.div`
  background-color: #f7f7f7;
  padding: 20px;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AIBasedCalc;
