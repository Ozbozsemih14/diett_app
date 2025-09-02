import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  Alert,
  Slider,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  ArrowBack,
  ArrowForward,
  Restaurant,
  Schedule,
  LocalFireDepartment,
  FitnessCenter
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useDietPlan } from '../contexts/DietPlanContext';
import { mealOptions, getMealsByCategory, MealOption } from '../data/mealOptions';

const MotionCard = motion(Card);

interface SelectedMeals {
  breakfast: MealOption | null;
  lunch: MealOption | null;
  dinner: MealOption | null;
}

const DietPlanWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { generateNewPlan, currentPlan, isLoading } = useDietPlan();
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeals>({
    breakfast: null,
    lunch: null,
    dinner: null
  });
  
  const [targetCalories, setTargetCalories] = useState(2000);
  const [macroRatios, setMacroRatios] = useState({
    protein: 30,
    carbs: 45,
    fat: 25
  });

  const steps = ['Select Breakfast', 'Select Lunch', 'Select Dinner', 'Customize Plan', 'Review & Save'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  useEffect(() => {
    // Calculate target calories based on user profile
    if (user?.userData) {
      // Simple BMR calculation for demo
      const { weight, height, age, gender } = user.userData;
      if (weight && height && age) {
        let bmr;
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        // Add activity multiplier (assuming moderate activity)
        const targetCals = Math.round(bmr * 1.55);
        setTargetCalories(targetCals);
      }
    }
  }, [user]);

  const handleMealSelect = (meal: MealOption, category: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedMeals(prev => ({
      ...prev,
      [category]: meal
    }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSavePlan = async () => {
    if (!selectedMeals.breakfast || !selectedMeals.lunch || !selectedMeals.dinner) {
      return;
    }

    // Create custom plan with selected meals
    const customPlan = {
      id: `custom-plan-${Date.now()}`,
      userId: user?.email || 'user',
      createdAt: new Date().toISOString(),
      targetCalories,
      macroRatios,
      meals: {
        breakfast: {
          id: selectedMeals.breakfast.id,
          name: selectedMeals.breakfast.name,
          time: '08:00',
          calories: selectedMeals.breakfast.calories,
          protein: selectedMeals.breakfast.protein,
          carbs: selectedMeals.breakfast.carbs,
          fat: selectedMeals.breakfast.fat,
          ingredients: selectedMeals.breakfast.ingredients,
          recipe: selectedMeals.breakfast.recipe
        },
        lunch: {
          id: selectedMeals.lunch.id,
          name: selectedMeals.lunch.name,
          time: '13:00',
          calories: selectedMeals.lunch.calories,
          protein: selectedMeals.lunch.protein,
          carbs: selectedMeals.lunch.carbs,
          fat: selectedMeals.lunch.fat,
          ingredients: selectedMeals.lunch.ingredients,
          recipe: selectedMeals.lunch.recipe
        },
        dinner: {
          id: selectedMeals.dinner.id,
          name: selectedMeals.dinner.name,
          time: '19:00',
          calories: selectedMeals.dinner.calories,
          protein: selectedMeals.dinner.protein,
          carbs: selectedMeals.dinner.carbs,
          fat: selectedMeals.dinner.fat,
          ingredients: selectedMeals.dinner.ingredients,
          recipe: selectedMeals.dinner.recipe
        }
      },
      totalNutrition: {
        calories: selectedMeals.breakfast.calories + selectedMeals.lunch.calories + selectedMeals.dinner.calories,
        protein: selectedMeals.breakfast.protein + selectedMeals.lunch.protein + selectedMeals.dinner.protein,
        carbs: selectedMeals.breakfast.carbs + selectedMeals.lunch.carbs + selectedMeals.dinner.carbs,
        fat: selectedMeals.breakfast.fat + selectedMeals.lunch.fat + selectedMeals.dinner.fat
      }
    };

    // Save to DietPlan context
    localStorage.setItem('currentDietPlan', JSON.stringify(customPlan));
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const renderMealSelection = (category: 'breakfast' | 'lunch' | 'dinner') => {
    const meals = getMealsByCategory(category);
    const selectedMeal = selectedMeals[category];

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
          Choose Your {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
        
        <Grid container spacing={3}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <MotionCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  cursor: 'pointer',
                  border: selectedMeal?.id === meal.id ? '2px solid #10B981' : '2px solid transparent',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleMealSelect(meal, category)}
              >
                {/* Placeholder for meal image */}
                <CardMedia
                  sx={{
                    height: 160,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Restaurant sx={{ fontSize: 48, color: '#ccc' }} />
                  {selectedMeal?.id === meal.id && (
                    <CheckCircle 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        color: '#10B981', 
                        fontSize: 32,
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }} 
                    />
                  )}
                </CardMedia>
                
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {meal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {meal.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalFireDepartment sx={{ fontSize: 16, mr: 0.5, color: '#FF6B35' }} />
                      <Typography variant="body2" fontWeight={600}>{meal.calories} cal</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ fontSize: 16, mr: 0.5, color: '#6B7280' }} />
                      <Typography variant="body2">{meal.cookingTime} min</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">P: {meal.protein}g</Typography>
                    <Typography variant="body2">C: {meal.carbs}g</Typography>
                    <Typography variant="body2">F: {meal.fat}g</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {meal.dietaryTags.slice(0, 2).map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24,
                          backgroundColor: '#10B981',
                          color: 'white',
                          fontWeight: 500
                        }} 
                      />
                    ))}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderCustomization = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Customize Your Plan
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalFireDepartment sx={{ mr: 1, color: '#FF6B35' }} />
              Daily Calorie Target
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={targetCalories}
                onChange={(_, value) => setTargetCalories(value as number)}
                min={1200}
                max={3500}
                step={50}
                marks={[
                  { value: 1200, label: '1200' },
                  { value: 2000, label: '2000' },
                  { value: 2800, label: '2800' },
                  { value: 3500, label: '3500' }
                ]}
                valueLabelDisplay="on"
                sx={{
                  color: '#10B981',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#10B981'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current selection: {targetCalories} calories/day
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessCenter sx={{ mr: 1, color: '#6366F1' }} />
              Macro Ratios
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Protein: {macroRatios.protein}%</Typography>
              <Slider
                value={macroRatios.protein}
                onChange={(_, value) => {
                  const newProtein = value as number;
                  const remaining = 100 - newProtein;
                  const carbRatio = (macroRatios.carbs / (macroRatios.carbs + macroRatios.fat)) * remaining;
                  const fatRatio = remaining - carbRatio;
                  setMacroRatios({
                    protein: newProtein,
                    carbs: Math.round(carbRatio),
                    fat: Math.round(fatRatio)
                  });
                }}
                min={15}
                max={45}
                sx={{ color: '#EF4444' }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Carbs: {macroRatios.carbs}%</Typography>
              <Slider
                value={macroRatios.carbs}
                onChange={(_, value) => {
                  const newCarbs = value as number;
                  const remaining = 100 - newCarbs;
                  const proteinRatio = (macroRatios.protein / (macroRatios.protein + macroRatios.fat)) * remaining;
                  const fatRatio = remaining - proteinRatio;
                  setMacroRatios({
                    protein: Math.round(proteinRatio),
                    carbs: newCarbs,
                    fat: Math.round(fatRatio)
                  });
                }}
                min={25}
                max={65}
                sx={{ color: '#F59E0B' }}
              />
            </Box>
            
            <Box>
              <Typography gutterBottom>Fat: {macroRatios.fat}%</Typography>
              <Slider
                value={macroRatios.fat}
                onChange={(_, value) => {
                  const newFat = value as number;
                  const remaining = 100 - newFat;
                  const proteinRatio = (macroRatios.protein / (macroRatios.protein + macroRatios.carbs)) * remaining;
                  const carbRatio = remaining - proteinRatio;
                  setMacroRatios({
                    protein: Math.round(proteinRatio),
                    carbs: Math.round(carbRatio),
                    fat: newFat
                  });
                }}
                min={15}
                max={45}
                sx={{ color: '#10B981' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderReview = () => {
    const totalCalories = (selectedMeals.breakfast?.calories || 0) + 
                         (selectedMeals.lunch?.calories || 0) + 
                         (selectedMeals.dinner?.calories || 0);
    
    const totalProtein = (selectedMeals.breakfast?.protein || 0) + 
                        (selectedMeals.lunch?.protein || 0) + 
                        (selectedMeals.dinner?.protein || 0);
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
          Review Your Diet Plan
        </Typography>
        
        {/* Nutrition Summary */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#F0FDF4' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#065F46' }}>
            Daily Nutrition Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="h4" sx={{ color: '#059669', fontWeight: 700 }}>
                {totalCalories}
              </Typography>
              <Typography variant="body2" color="text.secondary">Calories</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4" sx={{ color: '#DC2626', fontWeight: 700 }}>
                {totalProtein}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Protein</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4" sx={{ color: '#D97706', fontWeight: 700 }}>
                {(selectedMeals.breakfast?.carbs || 0) + (selectedMeals.lunch?.carbs || 0) + (selectedMeals.dinner?.carbs || 0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Carbs</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4" sx={{ color: '#059669', fontWeight: 700 }}>
                {(selectedMeals.breakfast?.fat || 0) + (selectedMeals.lunch?.fat || 0) + (selectedMeals.dinner?.fat || 0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">Fat</Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Selected Meals */}
        <Grid container spacing={2}>
          {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
            const meal = selectedMeals[mealType];
            if (!meal) return null;
            
            return (
              <Grid item xs={12} md={4} key={mealType}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {mealType}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {meal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {meal.calories} cal • {meal.protein}g protein
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {meal.dietaryTags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderMealSelection('breakfast');
      case 1:
        return renderMealSelection('lunch');
      case 2:
        return renderMealSelection('dinner');
      case 3:
        return renderCustomization();
      case 4:
        return renderReview();
      default:
        return 'Unknown step';
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return selectedMeals.breakfast !== null;
      case 1:
        return selectedMeals.lunch !== null;
      case 2:
        return selectedMeals.dinner !== null;
      case 3:
        return true;
      case 4:
        return selectedMeals.breakfast && selectedMeals.lunch && selectedMeals.dinner;
      default:
        return false;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Create Your Diet Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose your favorite meals and customize your nutrition goals
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Box sx={{ mb: 4, minHeight: 400 }}>
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSavePlan}
              disabled={!canProceed() || isLoading}
              endIcon={isLoading ? <CircularProgress size={16} /> : undefined}
              sx={{
                backgroundColor: '#10B981',
                '&:hover': { backgroundColor: '#059669' },
                px: 4
              }}
            >
              {isLoading ? 'Saving...' : 'Save Plan & Start'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed()}
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#10B981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DietPlanWizard;