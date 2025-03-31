import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { theme } from '../styles/theme';

interface Project {
  title: string;
  description: string;
  image: string;
  github: string;
  live: string;
  tech: string[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at top right, ${theme.colors.highlightTransparent} 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: ${theme.gradients.neon};
    border-radius: ${theme.borderRadius.small};
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ProjectCard = styled(motion.div)`
  background: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  cursor: pointer;
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: ${theme.shadows.glow};
  }
`;

const ProjectImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  transform-style: preserve-3d;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
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
    transparent 0%,
    ${theme.colors.bgCard} 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateZ(20px);

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectLinks = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  transform: translateZ(30px);
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.circle};
  color: ${theme.colors.textPrimary};
  font-size: 1.2rem;
  transition: ${theme.transitions.default};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(5px);

  &:hover {
    background: ${theme.colors.accent};
    color: ${theme.colors.textPrimary};
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  transform: translateZ(10px);
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProjectDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ProjectTech = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechTag = styled.span`
  padding: 0.3rem 0.8rem;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.9rem;
  color: ${theme.colors.accent};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(5px);
  transform: translateZ(5px);
`;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <ProjectCard
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
          <ProjectLink 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub />
          </ProjectLink>
          <ProjectLink 
            href={project.live} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
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
  );
};

const Projects: React.FC = () => {
  const projects: Project[] = [
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
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Projects
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A collection of my work and personal projects
        </Subtitle>
      </Header>

      <ProjectsGrid>
        {projects.map((project, index) => (
          <ProjectCardComponent
            key={project.title}
            project={project}
            index={index}
          />
        ))}
      </ProjectsGrid>
    </Container>
  );
};

export default Projects; 