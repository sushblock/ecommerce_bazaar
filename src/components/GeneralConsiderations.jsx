import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Import the JSON data (replace with the correct path)
import generalConsiderationsData from '../assets/generalConsiderations.json';

function GeneralConsiderations() {
  return (
    <Container>
      <h1>General Considerations</h1>
      {generalConsiderationsData.considerations.map((consideration, index) => (
        <ConsiderationSection key={index}>
          <h2>{consideration.section}</h2>
          <ul>
            {consideration.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </ConsiderationSection>
      ))}
      <Summary>
        <h2>Summary</h2>
        <p>{generalConsiderationsData.summary}</p>
      </Summary>

      <BackButton to="/">Go Back</BackButton>
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
`;

const ConsiderationSection = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 2rem 0;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.colors.shadowSupport};

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 2rem;
  }

  li {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }
`;

const Summary = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-top: 2rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.colors.shadowSupport};

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
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

export default GeneralConsiderations;
