import React, { useState } from "react";
import styled from "styled-components";

const FollowUpQuestionsForm = ({ followUpQuestions, onSubmitAnswers, conversationContext }) => {
  const [responseType, setResponseType] = useState("questions");
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Prepare the follow-up response based on the responseType
    const followUpResponse = {
      responseType,
      questions: followUpQuestions.map((question, index) => ({
        id: question.id,
        type: question.type,
        question: question.question,
        answer: answers[index] || "", // Include the answer
      })),
    };

    const userQuestionsAndResponses = followUpResponse.questions.map((item) => ({
      id: item.id,
      type: item.type,
      question: item.question,
      answer: item.answer,
    }));

    const followUpPrompt = `User: ${JSON.stringify(userQuestionsAndResponses)}

    ${conversationContext ? `AI:${conversationContext}\n` : ""}

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
        // Add more relevant questions here
      ]
    }

    User: If you don't need any follow-up questions to arrive at the plan and estimates for the farm setup, then can you provide your response in this format
    {
      "responseType": "estimates",
      {"estimates": [
        {
          approach: "",
          prioritised backlog of features and requirements: "",
          major milestones: "",
          cost estimate 1: "INR ...",
          cost estimate 2: "INR ...",
          cost estimate 3: "INR ...",
          ..
          ...
          final cost estimate: "INR ...";      
        }
      ]}
    }
    `;

    // Pass the follow-up response to the parent component
    onSubmitAnswers(followUpResponse, followUpPrompt);
  };

  return (
    <Container>
      <h2>Follow-up Questions</h2>
      {followUpQuestions.map((question, index) => (
        <QuestionContainer key={question.id}>
          <Question>{question.question}</Question>
          <AnswerInput
            type="text"
            value={answers[index] || ""} // Show the answer if it exists
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        </QuestionContainer>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit Answers</SubmitButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Question = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const AnswerInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default FollowUpQuestionsForm;
