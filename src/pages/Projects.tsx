import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaDatabase, FaAws, FaDocker } from 'react-icons/fa';
import { theme } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.gradients.primary};
  color: ${theme.colors.textPrimary};
  padding: 6rem 2rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${theme.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
  padding: 2rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.8rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
`;

const ProjectTech = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  background: ${theme.colors.bgGlass};
  color: ${theme.colors.accent};
  padding: 0.4rem 1rem;
  border-radius: ${theme.borderRadius.small};
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1rem;
  }
`;

const ProjectFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;

  li {
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: ${theme.colors.accent};
      position: absolute;
      left: 0;
    }
  }
`;

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'KhojPandit',
      description: 'A comprehensive platform connecting users with pandits for ceremonies and rituals.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/khojpandit',
      live: 'https://khojpandit.com',
      tech: [
        { icon: FaReact, name: 'React' },
        { icon: FaNodeJs, name: 'Node.js' },
        { icon: FaDatabase, name: 'MongoDB' },
        { icon: FaAws, name: 'AWS' },
      ],
      features: [
        'Real-time booking system',
        'Payment integration',
        'Admin dashboard',
        'Mobile responsive design',
      ],
    },
    {
      title: 'CleanDirty.ai',
      description: 'A subscription-based storytelling platform with AI-powered content generation.',
      image: 'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/cleandirty',
      live: 'https://cleandirty.ai',
      tech: [
        { icon: FaReact, name: 'Next.js' },
        { icon: FaNodeJs, name: 'TypeScript' },
        { icon: FaDatabase, name: 'PostgreSQL' },
        { icon: FaDocker, name: 'Docker' },
      ],
      features: [
        'AI-powered content generation',
        'Subscription management',
        'User analytics',
        'Content moderation',
      ],
    },
    {
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing projects and skills.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=800',
      github: 'https://github.com/yourusername/portfolio',
      live: 'https://yourportfolio.com',
      tech: [
        { icon: FaReact, name: 'React' },
        { icon: FaNodeJs, name: 'TypeScript' },
        { icon: FaDatabase, name: 'Emotion' },
        { icon: FaReact, name: 'Framer Motion' },
      ],
      features: [
        'Smooth animations',
        'Responsive design',
        'Dark mode',
        'Project showcase',
      ],
    },
  ];

  return (
    <Container>
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A collection of my work showcasing my skills and experience in web development.
        </Subtitle>
      </Header>

      <ProjectsGrid>
        {projects.map((project, index) => (
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
                  <TechTag key={tech.name}>
                    <tech.icon />
                    {tech.name}
                  </TechTag>
                ))}
              </ProjectTech>
              <ProjectFeatures>
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ProjectFeatures>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </Container>
  );
};

export default Projects; 