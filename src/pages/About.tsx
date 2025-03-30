import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaAws } from 'react-icons/fa';
import { theme } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem;
  background: ${theme.gradients.primary};
  color: ${theme.colors.textPrimary};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: ${theme.colors.accent};
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  color: ${theme.colors.textMuted};
  font-family: 'Inter', sans-serif;
  font-weight: 400;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  background: ${theme.colors.bgCard};
  padding: 2rem;
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.highlightTransparent};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 242, 234, 0.1), transparent);
    z-index: 1;
  }
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin: 0 auto;
  border: 2px solid ${theme.colors.accent};
  box-shadow: ${theme.shadows.glow};
  position: relative;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const TextContent = styled(motion.div)`
  color: ${theme.colors.textMuted};
  font-size: 1.1rem;
  line-height: 1.8;
  font-family: 'Inter', sans-serif;
`;

const SkillsSection = styled.section`
  margin-top: 4rem;
`;

const SkillsTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.accent};
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const SkillCard = styled(motion.div)`
  background: ${theme.colors.bgCard};
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.highlightTransparent};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  transition: ${theme.transitions.default};
`;

const SkillIcon = styled.div`
  font-size: 2.5rem;
  color: ${theme.colors.accent};
`;

const SkillTitle = styled.h3`
  color: ${theme.colors.accent};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const SkillDescription = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`;

const ExperienceSection = styled.section`
  margin-top: 4rem;
`;

const ExperienceSectionTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.accent};
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const ExperienceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ExperienceCard = styled(motion.div)`
  background: ${theme.colors.bgCard};
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.highlightTransparent};
  transition: ${theme.transitions.default};
`;

const ExperienceCardTitle = styled.h3`
  color: ${theme.colors.accent};
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const ExperiencePeriod = styled.div`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const ExperienceDescription = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`;

const About: React.FC = () => {
  return (
    <Container>
      <Content>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Full Stack Developer & Tech Enthusiast
          </Subtitle>
        </Header>

        <Grid>
          <ImageContainer
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ProfileImage>
              <img src="/images/profile.jpg" alt="Developer Workspace" />
            </ProfileImage>
          </ImageContainer>

          <TextContent
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p>
              I'm a passionate Full Stack Developer with expertise in modern web technologies.
              My journey in software development started with a curiosity for creating
              impactful solutions that make a difference in people's lives.
            </p>
            <br />
            <p>
              I specialize in building scalable web applications using React, Node.js,
              and various cloud technologies. My approach combines technical excellence
              with user-centered design principles.
            </p>
          </TextContent>
        </Grid>

        <SkillsSection>
          <SkillsTitle>Technologies I Work With</SkillsTitle>
          <SkillsGrid>
            <SkillCard
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SkillIcon><FaReact /></SkillIcon>
              <SkillTitle>Frontend Development</SkillTitle>
              <SkillDescription>React, Next.js, TypeScript, and modern CSS</SkillDescription>
            </SkillCard>

            <SkillCard
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SkillIcon><FaNodeJs /></SkillIcon>
              <SkillTitle>Backend Development</SkillTitle>
              <SkillDescription>Node.js, Express, and RESTful APIs</SkillDescription>
            </SkillCard>

            <SkillCard
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SkillIcon><FaDatabase /></SkillIcon>
              <SkillTitle>Database Management</SkillTitle>
              <SkillDescription>MongoDB, PostgreSQL, and Redis</SkillDescription>
            </SkillCard>

            <SkillCard
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SkillIcon><FaAws /></SkillIcon>
              <SkillTitle>Cloud Services</SkillTitle>
              <SkillDescription>AWS, Docker, and CI/CD pipelines</SkillDescription>
            </SkillCard>
          </SkillsGrid>
        </SkillsSection>

        <ExperienceSection>
          <ExperienceSectionTitle>Experience</ExperienceSectionTitle>
          <ExperienceGrid>
            <ExperienceCard
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ExperienceCardTitle>Senior Full Stack Developer</ExperienceCardTitle>
              <ExperiencePeriod>2021 - Present</ExperiencePeriod>
              <ExperienceDescription>
                Leading development of enterprise-level web applications,
                mentoring junior developers, and implementing best practices.
              </ExperienceDescription>
            </ExperienceCard>

            <ExperienceCard
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ExperienceCardTitle>Full Stack Developer</ExperienceCardTitle>
              <ExperiencePeriod>2019 - 2021</ExperiencePeriod>
              <ExperienceDescription>
                Developed and maintained multiple web applications,
                collaborated with cross-functional teams, and optimized performance.
              </ExperienceDescription>
            </ExperienceCard>

            <ExperienceCard
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ExperienceCardTitle>Frontend Developer</ExperienceCardTitle>
              <ExperiencePeriod>2018 - 2019</ExperiencePeriod>
              <ExperienceDescription>
                Created responsive and interactive user interfaces,
                implemented modern design patterns, and improved user experience.
              </ExperienceDescription>
            </ExperienceCard>
          </ExperienceGrid>
        </ExperienceSection>
      </Content>
    </Container>
  );
};

export default About; 