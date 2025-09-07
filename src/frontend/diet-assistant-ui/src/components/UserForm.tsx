import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents,
  Restaurant,
  FitnessCenter,
  Favorite,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FormState {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  dietaryRestrictions: string[];
  healthConditions: string[];
  goal: string;
}

interface UserFormData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  dietary_restrictions: string[];
  health_conditions: string[];
  preferred_cuisine: string;
  current_mood: string;
  health_goal: 'Weight Loss' | 'Weight Gain' | 'Maintain Weight';
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
}

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-Carb',
  'Low-Fat',
];

const healthConditions = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Celiac Disease',
  'Lactose Intolerance',
  'Food Allergies',
  'None',
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'very', label: 'Very Active', description: '6-7 days/week' },
  { value: 'extra', label: 'Extra Active', description: 'Very intense exercise daily' },
];

const goals = [
  { value: 'Weight Loss', label: 'Weight Loss', icon: <FitnessCenter />, description: 'Lose weight in a healthy way' },
  { value: 'Maintain Weight', label: 'Maintain Weight', icon: <Restaurant />, description: 'Keep current weight stable' },
  { value: 'Weight Gain', label: 'Weight Gain', icon: <EmojiEvents />, description: 'Gain healthy weight/muscle' },
];

export default function UserForm({ onSubmit }: UserFormProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    age: 25,
    gender: '',
    weight: 70,
    height: 170,
    activityLevel: '',
    dietaryRestrictions: [],
    healthConditions: [],
    goal: '',
  });

  const steps = ['Basic Info', 'Activity Level', 'Diet & Health', 'Goals'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submissionData: UserFormData = {
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      activity_level: formData.activityLevel,
      dietary_restrictions: formData.dietaryRestrictions,
      health_conditions: formData.healthConditions,
      preferred_cuisine: 'any',
      current_mood: 'neutral',
      health_goal: formData.goal as 'Weight Loss' | 'Weight Gain' | 'Maintain Weight',
    };
    onSubmit(submissionData);
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter((d) => d !== diet)
        : [...prev.dietaryRestrictions, diet],
    }));
  };

  const handleHealthToggle = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter((c) => c !== condition)
        : [...prev.healthConditions, condition],
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  Tell us about yourself ✨
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem'
                  }}
                >
                  We'll use this information to create your personalized diet plan
                </Typography>
              </Box>

              <FormControl fullWidth>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>

              <Box>
                <Typography gutterBottom>Age</Typography>
                <Slider
                  value={formData.age}
                  onChange={(_, value) => setFormData({ ...formData, age: value as number })}
                  min={15}
                  max={100}
                  marks={[
                    { value: 15, label: '15' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  fullWidth
                />
              </Stack>
            </Stack>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  What's your activity level? 🏃‍♂️
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem'
                  }}
                >
                  This helps us calculate your daily calorie needs
                </Typography>
              </Box>

              <Stack spacing={2}>
                {activityLevels.map((level) => (
                  <Paper
                    key={level.value}
                    onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.activityLevel === level.value ? 'primary.main' : 'transparent',
                      bgcolor: formData.activityLevel === level.value 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: formData.activityLevel === level.value 
                            ? 'primary.main'
                            : alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <FitnessCenter
                          sx={{
                            color: formData.activityLevel === level.value 
                              ? 'white'
                              : 'primary.main',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {level.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)'
                      : 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  Dietary Preferences & Health 🥗
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem'
                  }}
                >
                  Help us understand your dietary needs and health conditions
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Dietary Restrictions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dietaryOptions.map((diet) => (
                    <Chip
                      key={diet}
                      label={diet}
                      onClick={() => handleDietaryToggle(diet)}
                      color={formData.dietaryRestrictions.includes(diet) ? 'primary' : 'default'}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Health Conditions
                  <Tooltip title="This information helps us provide safer meal recommendations">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {healthConditions.map((condition) => (
                    <Chip
                      key={condition}
                      label={condition}
                      onClick={() => handleHealthToggle(condition)}
                      color={formData.healthConditions.includes(condition) ? 'primary' : 'default'}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                      : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  What's your primary goal? 🎯
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem'
                  }}
                >
                  We'll tailor your diet plan to help you achieve this goal
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
                {goals.map((goal) => (
                  <Paper
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.goal === goal.value ? 'primary.main' : 'transparent',
                      bgcolor: formData.goal === goal.value 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: formData.goal === goal.value 
                          ? 'primary.main'
                          : alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      {React.cloneElement(goal.icon, {
                        sx: {
                          fontSize: 32,
                          color: formData.goal === goal.value ? 'white' : 'primary.main',
                        },
                      })}
                    </Box>
                    <Typography variant="h6" align="center">
                      {goal.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      align="center" 
                      sx={{ 
                        color: 'text.secondary',
                        fontStyle: 'italic'
                      }}
                    >
                      {goal.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        position: 'relative',
        zIndex: 1,
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
            maxWidth: '800px',
            borderRadius: '24px',
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.3)'}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 45px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
            }
          }}
        >
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 2,
            '& .MuiStepLabel-root .Mui-completed': {
              color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
            },
            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
              color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
              fontWeight: 600,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#1e293b',
            },
            '& .MuiStepConnector-line': {
              borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.4)',
              borderTopWidth: '2px',
            },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
              borderColor: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
              borderTopWidth: '3px',
            },
            '& .MuiStepIcon-root': {
              fontSize: '1.8rem',
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.5)',
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
              fontSize: '2rem',
            },
            '& .MuiStepLabel-label': {
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ 
          mt: 3, 
          flex: 1,
          background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          p: 4,
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.2)'}`,
          backdropFilter: 'blur(10px)',
        }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          pt: 4,
          gap: 2,
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              visibility: activeStep === 0 ? 'hidden' : 'visible',
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.2)',
              border: `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.3)'}`,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#1e293b',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              },
              '&.MuiButton-root': { gap: 1 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                minWidth: 200,
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(79, 172, 254, 0.35)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
                    : 'linear-gradient(135deg, #4299e1 0%, #4facfe 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(79, 172, 254, 0.45)',
                },
                '&.MuiButton-root': { gap: 1 },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Create My Plan ✨
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                minWidth: 200,
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(79, 172, 254, 0.35)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
                    : 'linear-gradient(135deg, #4299e1 0%, #4facfe 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(79, 172, 254, 0.45)',
                },
                '&.MuiButton-root': { gap: 1 },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Continue →
            </Button>
          )}
        </Box>
        </Paper>
      </Box>
    </Box>
  );
} 