import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import planningGuideData from '../assets/planningGuide.json';

function PlanningGuideDetails() {
  const { title } = useParams();
  const guideData = planningGuideData[title];

  if (!guideData) {
    return <div>Data not found for {title}</div>;
  }

  return (
    <Container>
      <h2>{guideData.title}</h2>
      {guideData.steps.map((step) => (
        <Step key={step.step}>
          <StepTitle>Step {step.step}: {step.title}</StepTitle>
          {Array.isArray(step.description) ? (
            <ul>
              {step.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <StepDescription>{step.description}</StepDescription>
          )}
        </Step>
      ))}
      <BackButton to="/guides">Back to Planning Guide</BackButton> {/* Back button added */}
    </Container>
  );
}


const Container = styled.div`
  padding: 2rem;
  text-align: left;
`;

const Step = styled.div`
  margin-top: 2rem;
`;

const StepTitle = styled.h3`
  font-weight: bold;
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const StepDescription = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
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

export default PlanningGuideDetails;
