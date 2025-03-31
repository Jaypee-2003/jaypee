import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter, FaReact, FaNodeJs, FaDatabase, FaLaravel, FaPython, FaJava, FaAws } from 'react-icons/fa';
import { theme } from '../styles/theme';

interface Project {
  title: string;
  description: string;
  github: string;
  live: string;
  tech: string[];
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  target?: string;
  rel?: string;
}

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
  position: relative;
  overflow: hidden;
  perspective: 1000px;
`;

const AnimatedBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: radial-gradient(circle at center, ${theme.colors.bgSecondary} 0%, ${theme.colors.bgPrimary} 100%);
  transform-style: preserve-3d;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled(motion.div)`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 4rem 0;
  text-align: center;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, ${theme.colors.highlightTransparent} 0%, transparent 70%);
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 3rem 0;
    min-height: auto;
  }

  @media (max-width: 505px) {
    padding: 2rem 0;
    margin-top: 1rem;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  transform-style: preserve-3d;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }

  @media (max-width: 505px) {
    padding: 0 1rem;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: ${theme.colors.textPrimary};
  transform: translateZ(30px);
  position: relative;
  display: inline-block;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 505px) {
    font-size: 2rem;
    margin-bottom: 0.8rem;
    padding: 0 0.5rem;
  }
`;

const HeroSubtitle = styled(motion.h2)`
  font-size: 1.8rem;
  color: ${theme.colors.accent};
  margin-bottom: 1.5rem;
  transform: translateZ(20px);
  position: relative;
  display: inline-block;
  font-weight: 600;
  letter-spacing: -0.01em;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: ${theme.gradients.neon};
    border-radius: ${theme.borderRadius.small};
  }

  @media (max-width: 1024px) {
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 505px) {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    padding: 0 0.5rem;
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${theme.colors.textSecondary};
  margin-bottom: 2.5rem;
  transform: translateZ(10px);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding: 1.5rem;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.large};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-weight: 400;
  box-shadow: ${theme.shadows.glow};

  &::before {
    content: '';
  position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, ${theme.colors.highlightTransparent}, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  @media (max-width: 1024px) {
    font-size: 1.05rem;
    padding: 1.25rem;
    max-width: 600px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    padding: 1.25rem;
    margin: 0 1rem 2rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 1rem;
    margin: 0 0.5rem 1.5rem;
  }
`;

const AnimatedText = styled(motion.span)`
  display: inline-block;
  position: relative;
  color: ${theme.colors.accent};
  font-weight: 700;
  margin-left: 0.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &::after {
    content: '';
  position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${theme.gradients.neon};
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  @media (max-width: 505px) {
    margin-left: 0.25rem;
    font-size: 0.9em;
  }
`;

const HeroStats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  transform: translateZ(15px);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }
`;

const StatItem = styled(motion.div)`
  background: ${theme.colors.bgGlass};
  padding: 1.5rem;
  border-radius: ${theme.borderRadius.large};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  text-align: center;

  &:hover {
    transform: translateY(-5px) translateZ(10px);
    box-shadow: ${theme.shadows.glow};
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const StatNumber = styled(motion.div)`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const StatLabel = styled(motion.div)`
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TechSection = styled(motion.div)`
  grid-column: 1 / -1;
  padding: 6rem 0;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, ${theme.colors.highlightTransparent} 0%, transparent 70%);
    opacity: 0.1;
    z-index: -1;
  }
`;

const TechContainer = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  transform-style: preserve-3d;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: translateZ(30px);
  position: relative;
  font-weight: 700;
  letter-spacing: -0.02em;

  &::after {
    content: '';
  position: absolute;
    bottom: -0.8rem;
  left: 50%;
  transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: ${theme.gradients.neon};
    border-radius: ${theme.borderRadius.small};
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TechGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  transform-style: preserve-3d;
`;

const TechCard = styled(motion.div)`
  background: ${theme.colors.bgGlass};
  padding: 2.5rem;
  border-radius: ${theme.borderRadius.large};
  text-align: center;
  transform-style: preserve-3d;
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, ${theme.colors.highlightTransparent}, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const TechIconWrapper = styled(motion.div)`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  transform-style: preserve-3d;
`;

const TechIcon = styled(motion.div)`
  font-size: 3.5rem;
  color: ${theme.colors.accent};
  transform-style: preserve-3d;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    background: ${theme.colors.accent};
    opacity: 0.1;
    filter: blur(10px);
    border-radius: 50%;
    z-index: -1;
  }
`;

const TechName = styled(motion.h3)`
  font-size: 1.2rem;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  transform: translateZ(10px);
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const TechDescription = styled(motion.p)`
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  transform: translateZ(5px);
  font-weight: 400;
`;

const TechLevel = styled(motion.div)`
  margin-top: 1rem;
  transform: translateZ(10px);
`;

const TechLevelBar = styled(motion.div)`
  height: 4px;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.small};
  overflow: hidden;
  margin-top: 0.5rem;
`;

const TechLevelFill = styled(motion.div)`
  height: 100%;
  background: ${theme.gradients.neon};
  border-radius: ${theme.borderRadius.small};
`;

const ProjectsSection = styled(motion.div)`
  grid-column: 1 / -1;
  padding: 4rem 0;
  transform-style: preserve-3d;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  transform-style: preserve-3d;
`;

const ProjectCard = styled(motion.div)`
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.large};
  padding: 2.5rem;
  transform-style: preserve-3d;
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, ${theme.colors.highlightTransparent}, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  &:hover {
    transform: translateY(-10px) translateZ(20px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const ProjectTitle = styled(motion.h3)`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: translateZ(10px);
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const ProjectDescription = styled(motion.p)`
  color: ${theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  transform: translateZ(5px);
  font-size: 0.95rem;
  font-weight: 400;
`;

const ProjectTech = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  transform: translateZ(10px);
`;

const TechTag = styled(motion.span)`
  padding: 0.3rem 0.8rem;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.85rem;
  color: ${theme.colors.accent};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(5px);
  transform: translateZ(5px);
  font-weight: 500;
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-2px) translateZ(10px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  transform: translateZ(10px);
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-top: 1.25rem;
  }
`;

const StyledSocialLink = styled(motion.a)`
  color: ${theme.colors.textSecondary};
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.circle};
  background: ${theme.colors.bgGlass};
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transform: translateZ(0);
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.35rem;
  }
`;

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, target, rel }) => (
  <StyledSocialLink
    href={href}
    target={target}
    rel={rel}
    whileHover={{
      color: theme.colors.accent,
      y: -3,
      z: 20,
      rotateY: 10,
      boxShadow: theme.shadows.glow,
    }}
  >
    {icon}
  </StyledSocialLink>
);

const Home: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 100 };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 20;
      const yPercent = (clientY / innerHeight - 0.5) * 20;
      mouseX.set(xPercent);
      mouseY.set(yPercent);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const projects: Project[] = [
    {
      title: 'KhojPandit',
      description: 'A dynamic platform connecting users with pandits for ceremonies and rituals. Features include a single admin panel for content management, responsive design, and user-friendly interface.',
      github: 'https://github.com/jaypeebehera/khojpandit',
      live: 'https://khojpandit.com',
      tech: ['React', 'Node.js', 'MongoDB', 'Bootstrap'],
    },
    {
      title: 'CleanDirty.ai',
      description: 'A subscription-based storytelling platform with mobile-first design. Features include personalized reading experience, engaging visuals, and user-centric design for long-form content.',
      github: 'https://github.com/jaypeebehera/cleandirty',
      live: 'https://cleandirty.ai',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
    },
    {
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing my work and skills with smooth animations and 3D effects.',
      github: 'https://github.com/jaypeebehera/portfolio',
      live: 'https://jaypeebehera.com',
      tech: ['React', 'TypeScript', 'Emotion', 'Framer Motion'],
    },
  ];

  const techStack = [
    {
      icon: <FaReact />,
      name: 'React',
      description: 'Frontend development with modern React practices',
      level: 90,
    },
    {
      icon: <FaNodeJs />,
      name: 'Node.js',
      description: 'Backend development and server-side solutions',
      level: 85,
    },
    {
      icon: <FaDatabase />,
      name: 'MongoDB',
      description: 'Database design and management',
      level: 80,
    },
    {
      icon: <FaLaravel />,
      name: 'Laravel',
      description: 'PHP framework for web applications',
      level: 75,
    },
    {
      icon: <FaPython />,
      name: 'Python',
      description: 'Scripting and automation solutions',
      level: 80,
    },
    {
      icon: <FaJava />,
      name: 'Java',
      description: 'Enterprise-level applications',
      level: 75,
    },
    {
      icon: <FaAws />,
      name: 'AWS',
      description: 'Cloud infrastructure and services',
      level: 70,
    },
  ];

  return (
    <Container>
      <AnimatedBackground
        style={{
          rotateX: useSpring(mouseY, springConfig),
          rotateY: useSpring(mouseX, springConfig),
        }}
      />

      <GridContainer>
        <HeroSection>
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Hi, I'm{' '}
              <AnimatedText
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Jayprakash Behera
              </AnimatedText>
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Web & Mobile App Developer
            </HeroSubtitle>
            <HeroDescription
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              A skilled developer with a B.Sc. in Computer Science and ongoing MCA studies. 
              I specialize in creating high-performing, scalable, and user-friendly solutions that help businesses thrive digitally.
            </HeroDescription>
            
            <HeroStats
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <StatItem
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>3+</StatNumber>
                <StatLabel>Years Experience</StatLabel>
              </StatItem>
              <StatItem
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>20+</StatNumber>
                <StatLabel>Projects Completed</StatLabel>
              </StatItem>
              <StatItem
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>15+</StatNumber>
                <StatLabel>Technologies</StatLabel>
              </StatItem>
            </HeroStats>

            <SocialLinks
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <SocialLink
                href="https://github.com/Jaypee-2003"
                icon={<FaGithub />}
                target="_blank"
                rel="noopener noreferrer"
              />
              <SocialLink
                href="https://www.linkedin.com/in/jayprakash-behera-69a212252"
                icon={<FaLinkedin />}
                target="_blank"
                rel="noopener noreferrer"
              />
              <SocialLink
                href="mailto:jaypeebehera@gmail.com"
                icon={<FaEnvelope />}
              />
              <SocialLink
                href="https://twitter.com/jaypeebehera"
                icon={<FaTwitter />}
                target="_blank"
                rel="noopener noreferrer"
              />
            </SocialLinks>
          </HeroContent>
        </HeroSection>

        <TechSection>
          <TechContainer>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Tech Stack
            </SectionTitle>
            <TechGrid>
              {techStack.map((tech, index) => (
                <TechCard
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    translateZ: 20,
                    boxShadow: theme.shadows.glow,
                  }}
                >
                  <TechIconWrapper>
                    <TechIcon
                      whileHover={{
                        scale: 1.1,
                        rotateY: 10,
                        color: theme.colors.accent,
                      }}
                    >
                      {tech.icon}
                    </TechIcon>
                  </TechIconWrapper>
                  <TechName>{tech.name}</TechName>
                  <TechDescription>{tech.description}</TechDescription>
                  <TechLevel>
                    <span style={{ fontSize: '0.8rem', color: theme.colors.textSecondary }}>
                      Proficiency: {tech.level}%
                    </span>
                    <TechLevelBar>
                      <TechLevelFill
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </TechLevelBar>
                  </TechLevel>
                </TechCard>
              ))}
            </TechGrid>
          </TechContainer>
        </TechSection>

        <ProjectsSection>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Featured Projects
          </SectionTitle>
          <ProjectsGrid>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectTech>
                  {project.tech.map((tech) => (
                    <TechTag key={tech} whileHover={{ scale: 1.05 }}>
                      {tech}
                    </TechTag>
                  ))}
                </ProjectTech>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </ProjectsSection>
      </GridContainer>
    </Container>
  );
};

export default Home; 