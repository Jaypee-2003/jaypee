import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaReact, FaNodeJs, FaDatabase, FaExternalLinkAlt } from 'react-icons/fa';
import { theme } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.gradients.primary};
  color: ${theme.colors.textPrimary};
  padding-top: 70px;
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${theme.colors.bgGlass} 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ProfileImage = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: ${theme.borderRadius.circle};
  overflow: hidden;
  margin: 0 auto 2rem;
  border: 3px solid ${theme.colors.accent};
  position: relative;
  box-shadow: ${theme.shadows.glow};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  color: ${theme.colors.textSecondary};
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const Description = styled(motion.p)`
  font-size: 1.3rem;
  color: ${theme.colors.textMuted};
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`;

const TechStack = styled(motion.div)`
  display: flex;
  gap: 3rem;
  margin: 3rem 0;
  position: relative;
  z-index: 1;
`;

const TechIcon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.textMuted};
  font-size: 2.5rem;
  transition: ${theme.transitions.default};
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.bgGlass};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const TechLabel = styled.span`
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
`;

const SocialIcon = styled(motion.a)`
  color: ${theme.colors.textMuted};
  font-size: 1.8rem;
  transition: ${theme.transitions.default};
  padding: 1rem;
  border-radius: ${theme.borderRadius.circle};
  background: ${theme.colors.bgGlass};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const AboutSection = styled.section`
  padding: 6rem 2rem;
  background: ${theme.colors.bgSecondary};
  position: relative;
`;

const AboutContent = styled.div`
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

const AboutText = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.8;
  font-family: 'Inter', sans-serif;

  p {
    margin-bottom: 1.5rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const SkillItem = styled.div`
  background: ${theme.colors.bgCard};
  padding: 1.2rem;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.highlightTransparent};
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${theme.colors.accent};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
  }

  svg {
    font-size: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const ProjectsSection = styled.section`
  padding: 6rem 2rem;
  background: ${theme.colors.bgPrimary};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProjectCard = styled(motion.div)`
  background: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  border: 1px solid ${theme.colors.highlightTransparent};
  box-shadow: ${theme.shadows.card};
  transition: ${theme.transitions.default};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.neonGlow};
    border-color: ${theme.colors.accent};
  }
`;

const ProjectImage = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: ${theme.colors.bgSecondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    filter: brightness(0.9);
    transform-origin: center;
  }

  ${ProjectCard}:hover & img {
    transform: scale(1.05);
    filter: brightness(1);
  }
`;

const ProjectImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 25, 47, 0.2) 0%,
    rgba(10, 25, 47, 0.8) 100%
  );
  opacity: 0;
  transition: ${theme.transitions.default};

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectLinks = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 25, 47, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  opacity: 0;
  transition: ${theme.transitions.default};

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectLink = styled.a`
  color: ${theme.colors.textPrimary};
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.circle};
  background: ${theme.colors.bgGlass};
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const ProjectTech = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const TechTag = styled.span`
  background: ${theme.colors.bgGlass};
  color: ${theme.colors.accent};
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.borderRadius.small};
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const Home: React.FC = () => {
  const featuredProjects = [
    {
      title: 'KhojPandit',
      description: 'A platform connecting users with pandits for ceremonies and rituals.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/khojpandit',
      live: 'https://khojpandit.com',
      tech: ['React', 'Node.js', 'MongoDB'],
    },
    {
      title: 'CleanDirty.ai',
      description: 'A subscription-based storytelling platform with mobile-first design.',
      image: 'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/cleandirty',
      live: 'https://cleandirty.ai',
      tech: ['Next.js', 'TypeScript', 'Tailwind'],
    },
    {
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website with smooth animations.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/portfolio',
      live: 'https://yourportfolio.com',
      tech: ['React', 'TypeScript', 'Emotion'],
    },
  ];

  return (
    <Container>
      <HeroSection>
        <ProfileImage
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/images/profile.jpg" 
            alt="Profile" 
            loading="lazy"
            decoding="async"
          />
        </ProfileImage>

        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Hi, I'm Jaypee
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Full Stack Developer
        </Subtitle>

        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          I build modern web applications with cutting-edge technologies.
          Let's create something amazing together.
        </Description>

        <TechStack
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <TechIcon whileHover={{ scale: 1.1 }}>
            <FaReact />
            <TechLabel>React</TechLabel>
          </TechIcon>
          <TechIcon whileHover={{ scale: 1.1 }}>
            <FaNodeJs />
            <TechLabel>Node.js</TechLabel>
          </TechIcon>
          <TechIcon whileHover={{ scale: 1.1 }}>
            <FaDatabase />
            <TechLabel>MongoDB</TechLabel>
          </TechIcon>
        </TechStack>

        <SocialLinks
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SocialIcon
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
          >
            <FaGithub />
          </SocialIcon>
          <SocialIcon
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
          >
            <FaLinkedin />
          </SocialIcon>
        </SocialLinks>
      </HeroSection>

      <AboutSection id="about">
        <SectionTitle>About Me</SectionTitle>
        <AboutContent>
          <AboutText>
            <p>
              I'm a passionate Full Stack Developer with a strong foundation in web development.
              My journey in tech started with a curiosity for creating things that make a difference.
              I specialize in building modern web applications using React, Node.js, and MongoDB.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
              or sharing my knowledge through technical blog posts.
            </p>
          </AboutText>
          <SkillsGrid>
            <SkillItem>
              <FaReact /> React & Next.js
            </SkillItem>
            <SkillItem>
              <FaNodeJs /> Node.js & Express
            </SkillItem>
            <SkillItem>
              <FaDatabase /> MongoDB & SQL
            </SkillItem>
            <SkillItem>
              <FaReact /> TypeScript & JavaScript
            </SkillItem>
          </SkillsGrid>
        </AboutContent>
      </AboutSection>

      <ProjectsSection>
        <SectionTitle>Featured Projects</SectionTitle>
        <ProjectsGrid>
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ProjectImage>
                <img 
                  src={project.image} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />
                <ProjectImageOverlay />
                <ProjectLinks>
                  <ProjectLink href={project.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </ProjectLink>
                  <ProjectLink href={project.live} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt />
                  </ProjectLink>
                </ProjectLinks>
              </ProjectImage>
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectTech>
                  {project.tech.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </ProjectTech>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </ProjectsSection>
    </Container>
  );
};

export default Home; 