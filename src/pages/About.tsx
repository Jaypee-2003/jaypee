import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaDatabase, FaTools } from 'react-icons/fa';
import { theme } from '../styles/theme';
import profileImage from '../assets/images/profile.jpg';

interface Skill {
  icon: React.ElementType;
  title: string;
  description: string;
  technologies: string[];
}

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
`;

const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
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

const Content = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    background: ${theme.gradients.neon};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: ${theme.colors.textSecondary};
    margin-bottom: 2rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const SkillCard = styled(motion.div)`
  background: ${theme.colors.bgCard};
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.highlightTransparent};
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const SkillIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: ${theme.colors.accent};
  font-size: 1.5rem;
  border: 1px solid ${theme.colors.highlightTransparent};
`;

const SkillTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${theme.colors.textPrimary};
`;

const SkillDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechItem = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.accent};
  background: ${theme.colors.bgGlass};
  padding: 0.25rem 0.75rem;
  border-radius: ${theme.borderRadius.small};
  border: 1px solid ${theme.colors.highlightTransparent};
`;

const About: React.FC = () => {
  const skills: Skill[] = [
    {
      icon: FaCode,
      title: 'Frontend Development',
      description: 'Creating responsive and interactive user interfaces with modern frameworks and libraries.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    },
    {
      icon: FaServer,
      title: 'Backend Development',
      description: 'Building scalable and efficient server-side applications with robust APIs.',
      technologies: ['Node.js', 'Express', 'REST APIs', 'GraphQL'],
    },
    {
      icon: FaDatabase,
      title: 'Database Management',
      description: 'Designing and implementing database solutions for optimal performance and scalability.',
      technologies: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'],
    },
    {
      icon: FaTools,
      title: 'Development Tools',
      description: 'Utilizing modern development tools and practices for efficient workflow.',
      technologies: ['Git', 'Docker', 'VS Code', 'Figma'],
    },
  ];

  return (
    <Container>
      <Grid>
        <ImageContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ProfileImage>
            <img src={profileImage} alt="Jaypee" />
          </ProfileImage>
        </ImageContainer>

        <Content>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I'm a passionate Full Stack Developer with a strong foundation in web development.
            My journey in tech started with a curiosity for creating things that make a difference.
            I specialize in building modern web applications that are both beautiful and functional.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            With a focus on clean code and best practices, I create scalable solutions that help businesses grow.
            I'm always learning and exploring new technologies to stay at the forefront of web development.
          </motion.p>
        </Content>
      </Grid>

      <SkillsGrid>
        {skills.map((skill, index) => (
          <SkillCard
            key={skill.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <SkillIcon>
              <skill.icon />
            </SkillIcon>
            <SkillTitle>{skill.title}</SkillTitle>
            <SkillDescription>{skill.description}</SkillDescription>
            <TechList>
              {skill.technologies.map((tech) => (
                <TechItem key={tech}>{tech}</TechItem>
              ))}
            </TechList>
          </SkillCard>
        ))}
      </SkillsGrid>
    </Container>
  );
};

export default About; 