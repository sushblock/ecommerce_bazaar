import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import planningGuideData from "../assets/planningGuide.json";

function PlanningGuides() {
  const planningGuideKeys = Object.keys(planningGuideData);

  return (
    <Container>
      <h1>Planning Guides</h1>
      <Grid>
        {planningGuideKeys.map((key) => (
          <PlanningGuideCard key={key} data={planningGuideData[key]} title={key} />
        ))}
      </Grid>
      <BackButton to="/">Go Back</BackButton>
    </Container>
  );
}

function PlanningGuideCard({ data, title }) {
  return (
    <Card>
      <CardImage>
        <Link to={`/planning-guide/${title}`}>
          <img src={data.image} alt={data.title} />
        </Link>
      </CardImage>
      <CardContent>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <Link to={`/planning-guide/${title}`} className="btn">
          Learn more
        </Link>
      </CardContent>
    </Card>
  );
}

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.figure`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;

  h3 {
    font-weight: bold;
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
  }

  .btn {
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

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
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

export default PlanningGuides;
