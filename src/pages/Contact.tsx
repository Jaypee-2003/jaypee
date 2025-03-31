import React, { useState, FormEvent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';
import { theme } from '../styles/theme';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  target?: string;
  rel?: string;
}

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
  position: relative;
  overflow: hidden;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at top left, ${theme.colors.highlightTransparent} 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const InfoSection = styled.div`
  text-align: left;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 3px;
    background: ${theme.gradients.neon};
    border-radius: ${theme.borderRadius.small};
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ContactInfo = styled.div`
  margin-top: 3rem;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.highlightTransparent};
  transition: ${theme.transitions.default};
  transform-style: preserve-3d;
  transform: translateZ(0);

  &:hover {
    transform: translateX(10px) translateZ(20px);
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
  }
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.circle};
  color: ${theme.colors.accent};
  font-size: 1.2rem;
  transform: translateZ(10px);
`;

const ContactText = styled.div`
  h3 {
    font-size: 1.1rem;
    color: ${theme.colors.textPrimary};
    margin-bottom: 0.2rem;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const Form = styled(motion.form)`
  background: ${theme.colors.bgCard};
  padding: 3rem;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.highlightTransparent};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, ${theme.colors.highlightTransparent}, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateZ(20px);
    box-shadow: ${theme.shadows.glow};

    &::before {
      transform: translateX(100%);
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.highlightTransparent};
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.bgGlass};
  color: ${theme.colors.textPrimary};
  font-size: 1rem;
  transition: ${theme.transitions.default};
  transform: translateZ(0);

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
    transform: translateZ(10px);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.highlightTransparent};
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.bgGlass};
  color: ${theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: ${theme.transitions.default};
  transform: translateZ(0);

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
    transform: translateZ(10px);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${theme.gradients.neon};
  color: ${theme.colors.textPrimary};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.default};
  position: relative;
  overflow: hidden;
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px) translateZ(20px);
    box-shadow: ${theme.shadows.glow};

    &::before {
      transform: translateX(100%);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
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

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-3px) translateZ(20px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, target, rel }) => (
  <StyledSocialLink
    href={href}
    target={target}
    rel={rel}
  >
    {icon}
  </StyledSocialLink>
);

const ContactItemComponent: React.FC<ContactItemProps> = ({ icon, title, content, delay }) => (
  <ContactItem
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <ContactIcon>{icon}</ContactIcon>
    <ContactText>
      <h3>{title}</h3>
      <p>{content}</p>
    </ContactText>
  </ContactItem>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Content>
        <InfoSection>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have a question or want to work together? Feel free to reach out!
          </Subtitle>

          <ContactInfo>
            <ContactItemComponent
              icon={<FaEnvelope />}
              title="Email"
              content="jaypeebehera@gmail.com"
              delay={0.3}
            />
            <ContactItemComponent
              icon={<FaGithub />}
              title="GitHub"
              content="github.com/Jaypee-2003"
              delay={0.4}
            />
            <ContactItemComponent
              icon={<FaLinkedin />}
              title="LinkedIn"
              content="linkedin.com/in/jayprakash-behera-69a212252"
              delay={0.5}
            />
          </ContactInfo>

          <SocialLinks
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
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
              href="https://twitter.com/Jaypee-2003"
              icon={<FaTwitter />}
              target="_blank"
              rel="noopener noreferrer"
            />
          </SocialLinks>
        </InfoSection>

        <Form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <InputGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="message">Message</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </SubmitButton>
        </Form>
      </Content>
    </Container>
  );
};

export default Contact; 