import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { theme } from '../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem;
  background: ${theme.gradients.primary};
  color: ${theme.colors.textPrimary};
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  background: ${theme.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  color: ${theme.colors.textSecondary};
  font-family: 'Inter', sans-serif;
  font-weight: 400;
`;

const Form = styled(motion.form)`
  background: ${theme.colors.bgCard};
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.card};
  margin-bottom: 4rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.small};
  background: transparent;
  color: ${theme.colors.textPrimary};
  font-family: 'Inter', sans-serif;
  transition: ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${theme.colors.bgGlass};
  border-radius: ${theme.borderRadius.small};
  background: transparent;
  color: ${theme.colors.textPrimary};
  font-family: 'Inter', sans-serif;
  min-height: 150px;
  resize: vertical;
  transition: ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.glow};
  }
`;

const Button = styled(motion.button)`
  background: ${theme.gradients.accent};
  color: ${theme.colors.textPrimary};
  border: none;
  padding: 1rem 2rem;
  border-radius: ${theme.borderRadius.medium};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.glow};

  &:hover {
    box-shadow: ${theme.shadows.neonGlow};
    transform: translateY(-2px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const SocialLink = styled(motion.a)`
  color: ${theme.colors.textMuted};
  font-size: 1.8rem;
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.accent};
    filter: drop-shadow(0 0 8px ${theme.colors.accentGlow});
  }
`;

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formState);
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
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
            Let's create something amazing together
          </Subtitle>
        </Header>

        <Form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Message</Label>
            <TextArea
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              required
            />
          </FormGroup>
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </Button>
        </Form>

        <SocialLinks>
          <SocialLink
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
          >
            <FaGithub />
          </SocialLink>
          <SocialLink
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
          >
            <FaLinkedin />
          </SocialLink>
          <SocialLink
            href="mailto:your.email@example.com"
            whileHover={{ y: -3 }}
          >
            <FaEnvelope />
          </SocialLink>
          <SocialLink
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
          >
            <FaTwitter />
          </SocialLink>
        </SocialLinks>
      </Content>
    </Container>
  );
};

export default Contact; 