import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import overviewData from "../components/overviewData";
import { useStateValue } from "../helpers/StateProvider";
import banner from "../assets/vidhavani-farming-solutions-high-resolution-logo-color-on-transparent-background.png";

function HomePage() {
  const [{ user }] = useStateValue();

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  return (
    <Container>
      <BannerImage src={banner} alt="" />
      {overviewData.sections.map((section, index) => (
        <Section key={index}>
          <SectionImage src={section.image} alt="" />
          <SectionContent>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </SectionContent>
        </Section>
      ))}
      <SectionContent>
        <ContactUs to={!user ? "/login" : "/contact"}>
          Contact Us Today
        </ContactUs>
      </SectionContent>

      <ServicesSection>
        <ServicesHeading>Our Services</ServicesHeading>
        <ServicesGrid>
          {overviewData.services.map((service, index) => (
            <ServiceCard key={index}>
              <h2>{service.service_name}</h2>
              <p>{service.description}</p>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>

      <ServicesSection>
        <ServicesHeading>Plan Your Farm</ServicesHeading>
        <ServicesGrid>
          {overviewData.solutionsData.map((card, index) => (
            <ServiceCard key={index}>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <StyledLink to={!user ? "/login" : card.link}>Explore</StyledLink>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>
      <SectionContent>
        <ContactUs to={!user ? "/login" : "/contact"}>
          Contact Us Today
        </ContactUs>
      </SectionContent>
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  background-color: #cff2b5;
`;

const StyledLink = styled(Link)`
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
  margin-top: 1rem; /* Add margin-top for padding */

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

const ContactUs = styled(Link)`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  margin-top: 1rem;
  border: none;
  text-align: center;
  text-decoration: none;
  padding: 0.5rem 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.05);
  }

  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: ${({ theme }) => theme.media.mobile}) {
    flex-direction: row;
  }
`;

const SectionImage = styled.img`
  width: 100%;
  height: auto;

  @media (min-width: ${({ theme }) => theme.media.mobile}) {
    width: 50%;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 300px;

  @media (min-width: ${({ theme }) => theme.media.mobile}) {
    width: 50%;
  }
`;

const SectionContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #fff;
`;

const ServicesSection = styled.div`
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ServicesHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ServiceCard = styled.div`
  background-color: #f7f7f7;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #cff2b5;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px; /* Add a max-width to prevent overflow */
  margin: 0 auto; /* Center the card in mobile view */

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #555;
  }
`;

export default HomePage;
