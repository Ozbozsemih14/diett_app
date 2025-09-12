import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  CircularProgress,
  Button,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { useDietPlan } from '../contexts/DietPlanContext';
import { useNavigate } from 'react-router-dom';
import { getDailyTip, getSmartTip } from '../data/nutritionTips';

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useUser();
  const { mealProgress, selectedMeals, toggleMealCompletion } = useProgress();
  const { currentPlan, getTodaysMeals, generateNewPlan, regenerateTodaysMeals, isLoading } = useDietPlan();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [foodCategories, setFoodCategories] = useState<{
    [key: string]: { current: number; total: number; unit: string; }
  }>({
    protein: { current: 0, total: 5, unit: 'servings' },
    vegetables: { current: 0, total: 5, unit: 'cups' },
    fruits: { current: 0, total: 3, unit: 'servings' },
    grains: { current: 0, total: 4, unit: 'servings' },
    dairy: { current: 0, total: 3, unit: 'servings' }
  });
  const [waterIntake, setWaterIntake] = useState({ current: 0, target: 2000 });
  const [userWeight, setUserWeight] = useState(70);
  
  // Workout tracking state
  const [workoutData, setWorkoutData] = useState({
    type: 'Yoga',
    duration: 60, // minutes
    isCompleted: false,
    caloriesBurned: 0,
    progress: 0 // percentage
  });
  const [goalType, setGoalType] = useState<'weight_loss' | 'maintain' | 'gain'>('weight_loss');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Load food categories and water intake from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Load food categories for today
    const savedCategories = localStorage.getItem(`foodCategories_${today}`);
    if (savedCategories) {
      setFoodCategories(JSON.parse(savedCategories));
    }
    
    // Load water intake for today
    const savedWater = localStorage.getItem(`waterIntake_${today}`);
    if (savedWater) {
      setWaterIntake(JSON.parse(savedWater));
    }
    
    // Set user weight from user data
    if (user?.userData?.weight) {
      setUserWeight(user.userData.weight);
    }
    
    // Load workout data for today
    const savedWorkout = localStorage.getItem(`workoutData_${today}`);
    if (savedWorkout) {
      setWorkoutData(JSON.parse(savedWorkout));
    }
    
    // Set goal type from user data (fallback to weight_loss)
    if (user?.userData?.goal) {
      // Map user goal types to our goal types
      const goalMapping: { [key: string]: 'weight_loss' | 'maintain' | 'gain' } = {
        'lose_weight': 'weight_loss',
        'maintain_weight': 'maintain',
        'gain_weight': 'gain',
        'weight_loss': 'weight_loss',
        'maintain': 'maintain',
        'gain': 'gain'
      };
      const mappedGoal = goalMapping[user.userData.goal] || 'weight_loss';
      setGoalType(mappedGoal);
    }
  }, [user]);

  // Update water intake when workout data changes
  useEffect(() => {
    calculateWaterIntake();
  }, [workoutData.isCompleted, userWeight]);

  // Calculate recommended water intake based on weight and activity
  const calculateWaterIntake = () => {
    const baseIntake = userWeight * 35; // 35ml per kg (base recommendation)
    const activityLevel = user?.userData?.activity_level || 'sedentary';
    const activityMultiplier = {
      'sedentary': 1.0,
      'light': 1.1, 
      'moderate': 1.2,
      'active': 1.3,
      'very_active': 1.4
    }[activityLevel] || 1.0;
    
    let recommendedIntake = Math.round(baseIntake * activityMultiplier);
    
    // Simple workout bonus: +500ml if workout completed
    if (workoutData.isCompleted) {
      recommendedIntake += 500;
    }
    
    setWaterIntake(prev => ({ ...prev, target: recommendedIntake }));
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`waterIntake_${today}`, JSON.stringify({ 
      current: waterIntake.current, 
      target: recommendedIntake 
    }));
  };

  // Get current activity multiplier for display
  const getActivityMultiplier = () => {
    const activityLevel = user?.userData?.activity_level || 'sedentary';
    return {
      'sedentary': 1.0,
      'light': 1.1,
      'moderate': 1.2, 
      'active': 1.3,
      'very_active': 1.4
    }[activityLevel] || 1.0;
  };

  // Calculate what the target should be
  const getCurrentTarget = () => {
    let target = Math.round(userWeight * 35 * getActivityMultiplier());
    // Simple workout bonus: +500ml if workout completed
    if (workoutData.isCompleted) {
      target += 500;
    }
    return target;
  };

  // Add water intake (250ml per glass)
  const addWaterGlass = () => {
    const newCurrent = waterIntake.current + 250;
    const updated = { ...waterIntake, current: newCurrent };
    setWaterIntake(updated);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`waterIntake_${today}`, JSON.stringify(updated));
  };

  // Calculate calories burned based on workout type, duration, and user weight
  const calculateCaloriesBurned = (type: string, duration: number, weight: number) => {
    // MET (Metabolic Equivalent) values for different exercises
    const metValues: { [key: string]: number } = {
      'Yoga': 3.0,
      'Running': 8.0,
      'Cycling': 7.5,
      'Swimming': 6.0,
      'Weight Training': 6.0,
      'Walking': 3.8,
      'HIIT': 8.5,
      'Pilates': 3.5,
      'Dance': 5.0,
      'Boxing': 7.8
    };
    
    const met = metValues[type] || 4.0; // Default MET if exercise not found
    // Formula: (MET * weight in kg * duration in hours)
    return Math.round(met * weight * (duration / 60));
  };

  // Smart Adjustment: Calculate adjusted daily calorie goal
  const getAdjustedCalorieGoal = () => {
    const baseDietPlan = currentPlan?.targetCalories || user?.userData?.calorieGoal || 2000;
    const workoutCalories = workoutData.isCompleted ? workoutData.caloriesBurned : 0;
    
    // Smart adjustment based on goal type
    let adjustmentFactor = 1.0;
    switch (goalType) {
      case 'weight_loss':
        adjustmentFactor = 0.7; // Give back 70% of burned calories
        break;
      case 'maintain':
        adjustmentFactor = 1.0; // Give back all burned calories
        break;
      case 'gain':
        adjustmentFactor = 1.2; // Give back 120% of burned calories
        break;
    }
    
    return baseDietPlan + Math.round(workoutCalories * adjustmentFactor);
  };

  // Calculate net calorie balance
  const getNetCalorieBalance = () => {
    const consumedCalories = getTodaysMealsData()
      .filter(meal => meal.completed)
      .reduce((total, meal) => total + meal.calories, 0);
    
    const workoutCalories = workoutData.isCompleted ? workoutData.caloriesBurned : 0;
    const adjustedGoal = getAdjustedCalorieGoal();
    
    return {
      consumed: consumedCalories,
      burned: workoutCalories,
      remaining: adjustedGoal - consumedCalories,
      net: consumedCalories - adjustedGoal,
      adjustedGoal
    };
  };

  // Update food category progress
  const updateFoodCategory = (category: string, amount: number) => {
    setFoodCategories(prev => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          current: Math.min(prev[category].current + amount, prev[category].total)
        }
      };
      
      // Save to localStorage
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`foodCategories_${today}`, JSON.stringify(updated));
      
      return updated;
    });
  };

  // Update workout progress and recalculate calories
  const updateWorkoutProgress = (newProgress: number) => {
    const caloriesBurned = calculateCaloriesBurned(workoutData.type, workoutData.duration, userWeight);
    const actualBurned = Math.round((caloriesBurned * newProgress) / 100);
    
    const updatedWorkout = {
      ...workoutData,
      progress: newProgress,
      caloriesBurned: actualBurned,
      isCompleted: newProgress >= 100
    };
    
    setWorkoutData(updatedWorkout);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`workoutData_${today}`, JSON.stringify(updatedWorkout));
  };

  // Complete workout
  const completeWorkout = () => {
    const totalCaloriesBurned = calculateCaloriesBurned(workoutData.type, workoutData.duration, userWeight);
    
    const completedWorkout = {
      ...workoutData,
      isCompleted: true,
      progress: 100,
      caloriesBurned: totalCaloriesBurned
    };
    
    setWorkoutData(completedWorkout);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`workoutData_${today}`, JSON.stringify(completedWorkout));
  };

  // Change workout type
  const changeWorkoutType = (newType: string) => {
    const newCaloriesBurned = calculateCaloriesBurned(newType, workoutData.duration, userWeight);
    const actualBurned = Math.round((newCaloriesBurned * workoutData.progress) / 100);
    
    const updatedWorkout = {
      ...workoutData,
      type: newType,
      caloriesBurned: actualBurned
    };
    
    setWorkoutData(updatedWorkout);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`workoutData_${today}`, JSON.stringify(updatedWorkout));
  };

  // Change workout duration  
  const changeWorkoutDuration = (newDuration: number) => {
    const newCaloriesBurned = calculateCaloriesBurned(workoutData.type, newDuration, userWeight);
    const actualBurned = Math.round((newCaloriesBurned * workoutData.progress) / 100);
    
    const updatedWorkout = {
      ...workoutData,
      duration: newDuration,
      caloriesBurned: actualBurned
    };
    
    setWorkoutData(updatedWorkout);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`workoutData_${today}`, JSON.stringify(updatedWorkout));
  };

  // Get today's meals from selected meals or mock data
  const getTodaysMealsData = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = mealProgress.find(p => p.date === today);
    
    // Get meals from DietPlan context if available, otherwise use fallback data
    const dietPlanMeals = getTodaysMeals();
    
    if (dietPlanMeals) {
      // Use DietPlan context data
      return [
        {
          name: 'Breakfast',
          time: dietPlanMeals.breakfast.time,
          description: dietPlanMeals.breakfast.name,
          calories: dietPlanMeals.breakfast.calories,
          completed: todayProgress?.meals.breakfast || false,
          color: todayProgress?.meals.breakfast ? '#10B981' : '#9CA3AF'
        },
        {
          name: 'Lunch', 
          time: dietPlanMeals.lunch.time,
          description: dietPlanMeals.lunch.name,
          calories: dietPlanMeals.lunch.calories,
          completed: todayProgress?.meals.lunch || false,
          color: todayProgress?.meals.lunch ? '#10B981' : '#9CA3AF'
        },
        {
          name: 'Dinner',
          time: dietPlanMeals.dinner.time, 
          description: dietPlanMeals.dinner.name,
          calories: dietPlanMeals.dinner.calories,
          completed: todayProgress?.meals.dinner || false,
          color: todayProgress?.meals.dinner ? '#10B981' : '#9CA3AF'
        }
      ];
    } else {
      // No diet plan exists - show placeholder data
      return [
        {
          name: 'Breakfast',
          time: '8:00 AM',
          description: 'Plan your breakfast',
          calories: 0,
          completed: false,
          color: '#9CA3AF'
        },
        {
          name: 'Lunch', 
          time: '1:00 PM',
          description: 'Plan your lunch',
          calories: 0,
          completed: false,
          color: '#9CA3AF'
        },
        {
          name: 'Dinner',
          time: '7:00 PM', 
          description: 'Plan your dinner',
          calories: 0,
          completed: false,
          color: '#9CA3AF'
        }
      ];
    }
  };

  // Toggle meal completion and update overview
  const handleMealToggle = async (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = mealProgress.find(p => p.date === today);
    const currentStatus = todayProgress?.meals[mealType] || false;
    
    // If completing meal, auto-update food categories
    if (!currentStatus) {
      // Smart food category updates based on meal type
      updateFoodCategory('protein', 1);
      
      if (mealType === 'breakfast') {
        updateFoodCategory('fruits', 1);
        updateFoodCategory('dairy', 1);
        updateFoodCategory('grains', 1);
      } else if (mealType === 'lunch') {
        updateFoodCategory('vegetables', 2);
        updateFoodCategory('grains', 1);
      } else if (mealType === 'dinner') {
        updateFoodCategory('vegetables', 1);
        updateFoodCategory('protein', 1); // Extra protein for dinner
      }
    }
    
    await toggleMealCompletion(today, mealType, !currentStatus);
  };

  // Calculate overview statistics based on meal completion with Smart Adjustment
  const getOverviewStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = mealProgress.find(p => p.date === today);
    const meals = getTodaysMealsData();
    const calorieBalance = getNetCalorieBalance();
    
    // Calculate completed meals
    const completedMeals = meals.filter(meal => meal.completed).length;
    const totalMeals = meals.length;
    
    // Use Smart Adjustment calculations
    const adjustedGoal = calorieBalance.adjustedGoal;
    const remainingCalories = Math.max(0, calorieBalance.remaining);
    const consumedCalories = calorieBalance.consumed;
    const workoutCaloriesBurned = calorieBalance.burned;
    
    // Calculate progress against adjusted goal (includes workout bonus)
    const dailyGoalProgress = Math.round((consumedCalories / adjustedGoal) * 100);
    
    // Calculate streak (simplified)
    const streak = mealProgress.filter(day => 
      day.meals.breakfast && day.meals.lunch && day.meals.dinner
    ).length;
    
    // Net calorie balance (positive = surplus, negative = deficit)
    const netBalance = calorieBalance.net;
    
    return {
      remainingCalories,
      completedMeals,
      totalMeals,
      dailyGoalProgress,
      streak: Math.min(streak, 30), // Cap at 30 for display
      adjustedGoal,
      workoutCaloriesBurned,
      consumedCalories,
      netBalance
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      {/* Header */}
      <MotionBox
        variants={itemVariants}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
          p: 4,
          mb: 4,
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#FFFFFF',
              fontSize: '2rem',
              fontWeight: 700,
              mb: 1
            }}
          >
            Welcome back, {user?.displayName || 'test'}!
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {format(currentTime, 'EEEE, MMMM d • h:mm a')}
          </Typography>
        </Box>
      </MotionBox>
      
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* Today's Workout - Interactive */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(68, 46, 30, 0.95) 0%, rgba(41, 28, 19, 0.95) 100%)'
                : 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🔥</span>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Today's Workout
                </Typography>
              </Box>
              {workoutData.isCompleted && (
                <Chip 
                  label="Completed" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#10B981', 
                    color: 'white',
                    fontWeight: 500 
                  }} 
                />
              )}
            </Box>
            
            {/* Workout Type Selector */}
            <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
              <Select
                value={workoutData.type}
                onChange={(e) => changeWorkoutType(e.target.value)}
                disabled={workoutData.isCompleted}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiSelect-icon': { color: '#FFFFFF' },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '& .MuiSelect-select': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }
                }}
              >
                {['Yoga', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'Walking', 'HIIT', 'Pilates', 'Dance', 'Boxing'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Duration Slider */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Duration: {workoutData.duration} minutes
              </Typography>
              <Slider
                value={workoutData.duration}
                onChange={(_, value) => changeWorkoutDuration(value as number)}
                disabled={workoutData.isCompleted}
                min={15}
                max={180}
                step={15}
                marks={[
                  { value: 30, label: '30m' },
                  { value: 60, label: '60m' },
                  { value: 90, label: '90m' },
                  { value: 120, label: '2h' }
                ]}
                sx={{
                  color: '#FF6B35',
                  '& .MuiSlider-markLabel': {
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.7rem'
                  },
                  '& .MuiSlider-mark': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  }
                }}
              />
            </Box>

            {/* Calories Display */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Potential Calories: {calculateCaloriesBurned(workoutData.type, workoutData.duration, userWeight)} cal
              </Typography>
              <Typography variant="body2" sx={{ color: '#FF6B35', fontWeight: 600 }}>
                Burned: {workoutData.caloriesBurned} cal
              </Typography>
            </Box>

            {/* Progress Bar (Clickable) */}
            <Box 
              sx={{ cursor: workoutData.isCompleted ? 'default' : 'pointer', mb: 1 }}
              onClick={() => !workoutData.isCompleted && updateWorkoutProgress(Math.min(workoutData.progress + 25, 100))}
            >
              <LinearProgress 
                variant="determinate" 
                value={workoutData.progress} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: workoutData.isCompleted ? '#10B981' : '#FF6B35',
                    borderRadius: 6,
                  }
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textAlign: 'right' }}>
              {workoutData.progress}% {!workoutData.isCompleted && '(click to add +25%)'}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!workoutData.isCompleted ? (
                <>
                  <Button
                    variant="contained"
                    onClick={completeWorkout}
                    sx={{
                      backgroundColor: '#10B981',
                      '&:hover': { backgroundColor: '#0EA373' },
                      fontSize: '0.8rem',
                      flex: 1
                    }}
                  >
                    ✅ Complete Workout
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => updateWorkoutProgress(0)}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    🔄 Reset
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setWorkoutData({ ...workoutData, isCompleted: false, progress: 0, caloriesBurned: 0 })}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.8rem',
                    flex: 1,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  🔄 Start New Workout
                </Button>
              )}
            </Box>
          </MotionPaper>
        </Grid>


        {/* Today's Meal Suggestions */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🍽️</span>
              <Typography variant="h6" sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontWeight: 600
              }}>
                Today's Meal Suggestions
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {(() => {
                const dietPlanMeals = getTodaysMeals();
                
                // Use DietPlan data if available, otherwise fallback
                const mealSuggestions = dietPlanMeals ? [
                  {
                    title: 'Breakfast',
                    meal: dietPlanMeals.breakfast.name,
                    calories: `${dietPlanMeals.breakfast.calories} cal`,
                    protein: `${dietPlanMeals.breakfast.protein}g protein`,
                    time: '15min',
                    ingredients: dietPlanMeals.breakfast.ingredients || ['Various ingredients'],
                    color: '#8B5CF6'
                  },
                  {
                    title: 'Lunch',
                    meal: dietPlanMeals.lunch.name,
                    calories: `${dietPlanMeals.lunch.calories} cal`,
                    protein: `${dietPlanMeals.lunch.protein}g protein`,
                    time: '20min',
                    ingredients: dietPlanMeals.lunch.ingredients || ['Various ingredients'],
                    color: '#10B981'
                  },
                  {
                    title: 'Dinner',
                    meal: dietPlanMeals.dinner.name,
                    calories: `${dietPlanMeals.dinner.calories} cal`,
                    protein: `${dietPlanMeals.dinner.protein}g protein`,
                    time: '25min',
                    ingredients: dietPlanMeals.dinner.ingredients || ['Various ingredients'],
                    color: '#F59E0B'
                  }
                ] : [
                  {
                    title: 'Breakfast',
                    meal: 'Create Your Plan',
                    calories: '--- cal',
                    protein: '--g protein',
                    time: '--min',
                    ingredients: ['Plan your meals first'],
                    color: '#8B5CF6'
                  },
                  {
                    title: 'Lunch',
                    meal: 'Create Your Plan',
                    calories: '--- cal',
                    protein: '--g protein',
                    time: '--min',
                    ingredients: ['Plan your meals first'],
                    color: '#10B981'
                  },
                  {
                    title: 'Dinner',
                    meal: 'Create Your Plan',
                    calories: '--- cal',
                    protein: '--g protein',
                    time: '--min',
                    ingredients: ['Plan your meals first'],
                    color: '#F59E0B'
                  }
                ];
                
                return mealSuggestions;
              })().map((meal, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(55, 65, 81, 0.5)' 
                        : 'rgba(248, 250, 252, 0.8)',
                      borderRadius: '12px',
                      p: 3,
                      border: `2px solid ${meal.color}20`,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      color: meal.color, 
                      mb: 1, 
                      fontSize: '1.1rem',
                      fontWeight: 600 
                    }}>
                      {meal.title}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                      mb: 2,
                      fontSize: '1rem'
                    }}>
                      {meal.meal}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        fontWeight: 500
                      }}>
                        {meal.calories}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        fontWeight: 500
                      }}>
                        {meal.protein}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '14px', marginRight: '4px' }}>⏱️</span>
                        {meal.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {meal.ingredients.map((ingredient) => (
                        <Chip
                          key={ingredient}
                          label={ingredient}
                          size="small"
                          sx={{
                            backgroundColor: `${meal.color}20`,
                            color: meal.color,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" sx={{ 
              textAlign: 'center',
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
              mt: 3,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Total Daily Calories: 1320 cal
            </Typography>
          </MotionPaper>
        </Grid>


        {/* Health Goal Progress */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(67, 56, 202, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)'
                : 'linear-gradient(135deg, #EDE9FE 0%, #F3F4F6 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🏆</span>
              <Typography variant="h6" sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontWeight: 600,
              }}>
                Health Goal Progress
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ 
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
              fontWeight: 700,
              mb: 1
            }}>
              Weight Loss
            </Typography>
            
            <Typography variant="body1" sx={{ 
              color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
              mb: 3
            }}>
              Daily Calorie Goal
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                mb: 3,
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(139, 92, 246, 0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#8B5CF6',
                  borderRadius: 6,
                }
              }}
            />

            <Grid container spacing={4} sx={{ textAlign: 'center' }}>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontWeight: 700
                }}>
                  12
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                }}>
                  Days
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontWeight: 700
                }}>
                  -3.2
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                }}>
                  lbs change
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontWeight: 700
                }}>
                  75%
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                }}>
                  Goal Progress
                </Typography>
              </Grid>
            </Grid>
          </MotionPaper>
        </Grid>

        {/* Today's Overview Cards - Horizontal Layout */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ 
            mb: 3,
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
            fontWeight: 600,
          }}>
            Today's Overview
          </Typography>
          <Grid container spacing={3}>
            {(() => {
              const stats = getOverviewStats();
              return [
                {
                  icon: '🍽️',
                  value: `${stats.completedMeals}/${stats.totalMeals}`,
                  label: 'Meals Completed',
                  color: stats.completedMeals === stats.totalMeals ? '#10B981' : '#F59E0B',
                  bgColor: stats.completedMeals === stats.totalMeals ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                },
                {
                  icon: '🔥',
                  value: `${stats.remainingCalories}`,
                  label: 'Calories Remaining',
                  color: stats.remainingCalories > 0 ? '#3B82F6' : '#10B981',
                  bgColor: stats.remainingCalories > 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                },
                {
                  icon: '🎯',
                  value: `${stats.dailyGoalProgress}%`,
                  label: 'Daily Goal Progress',
                  color: stats.dailyGoalProgress >= 100 ? '#10B981' : stats.dailyGoalProgress >= 75 ? '#F59E0B' : '#EF4444',
                  bgColor: stats.dailyGoalProgress >= 100 ? 'rgba(16, 185, 129, 0.1)' : stats.dailyGoalProgress >= 75 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                },
                {
                  icon: '🏃‍♂️',
                  value: workoutData.isCompleted ? `${stats.workoutCaloriesBurned}` : '0',
                  label: 'Workout Calories',
                  color: workoutData.isCompleted ? '#FF6B35' : '#9CA3AF',
                  bgColor: workoutData.isCompleted ? 'rgba(255, 107, 53, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                },
                {
                  icon: '❤️',
                  value: `${stats.streak}`,
                  label: 'Perfect Days',
                  color: stats.streak > 7 ? '#8B5CF6' : stats.streak > 3 ? '#10B981' : '#EF4444',
                  bgColor: stats.streak > 7 ? 'rgba(139, 92, 246, 0.1)' : stats.streak > 3 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }
              ];
            })().map((item, index) => (
              <Grid item xs={12} sm={6} md={index < 3 ? 4 : 6} key={index}>
                <MotionPaper
                  variants={itemVariants}
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? item.bgColor 
                      : item.bgColor,
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: `1px solid ${item.color}30`,
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : item.color,
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.8rem', sm: '2rem' }
                  }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}>
                    {item.label}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Today's Meals - Clean List */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontWeight: 600,
              }}>
                Today's Meals
                {currentPlan && (
                  <Chip 
                    label="Diet Plan Active" 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      backgroundColor: '#10B981', 
                      color: 'white',
                      fontWeight: 500
                    }} 
                  />
                )}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!currentPlan ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/plan')}
                    sx={{
                      backgroundColor: '#10B981',
                      '&:hover': { backgroundColor: '#0EA373' },
                      fontSize: '0.75rem',
                      px: 2
                    }}
                  >
                    Plan My Meals
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={regenerateTodaysMeals}
                      disabled={isLoading}
                      sx={{
                        borderColor: '#10B981',
                        color: '#10B981',
                        fontSize: '0.75rem',
                        px: 2,
                        '&:hover': {
                          borderColor: '#0EA373',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)'
                        }
                      }}
                    >
                      {isLoading ? <CircularProgress size={16} /> : 'New Meals'}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => generateNewPlan(user?.userData)}
                      disabled={isLoading}
                      sx={{
                        backgroundColor: '#10B981',
                        '&:hover': { backgroundColor: '#0EA373' },
                        fontSize: '0.75rem',
                        px: 2
                      }}
                    >
                      {isLoading ? <CircularProgress size={16} /> : 'New Plan'}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Grid container spacing={2}>
              {getTodaysMealsData().map((meal, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      border: theme.palette.mode === 'dark'
                        ? `1px solid ${meal.color}40`
                        : `1px solid ${meal.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(16, 185, 129, 0.15)' 
                          : 'rgba(16, 185, 129, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: meal.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                        onClick={() => {
                          const mealType = meal.name.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
                          handleMealToggle(mealType);
                        }}
                      >
                        <span style={{ 
                          color: 'white', 
                          fontSize: '14px',
                          opacity: meal.completed ? 1 : 0.5
                        }}>
                          {meal.completed ? '✓' : '○'}
                        </span>
                      </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="h6" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontWeight: 600,
                          mr: 2
                        }}>
                          {meal.name}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                        }}>
                          {meal.time}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#4B5563',
                        mb: 0.5
                      }}>
                        {meal.description}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`${meal.calories} cal`}
                        sx={{
                          backgroundColor: `${meal.color}20`,
                          color: meal.color,
                          fontWeight: 600,
                        }}
                      />
                      {meal.completed && (
                        <Chip
                          label="Completed"
                          size="small"
                          sx={{
                            backgroundColor: '#10B981',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            {/* Meal Summary */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(16, 185, 129, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              {(() => {
                const stats = getOverviewStats();
                const meals = getTodaysMealsData();
                const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
                const completedCalories = meals
                  .filter(meal => meal.completed)
                  .reduce((sum, meal) => sum + meal.calories, 0);
                
                return (
                  <>
                    <Typography variant="h6" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                      fontWeight: 600,
                      mb: 2,
                      textAlign: 'center'
                    }}>
                      🍽️ Today's Meal Summary
                    </Typography>
                    <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                      <Grid item xs={3}>
                        <Typography variant="h4" sx={{ 
                          color: '#10B981',
                          fontWeight: 700
                        }}>
                          {stats.completedMeals}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                        }}>
                          Completed
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h4" sx={{ 
                          color: '#3B82F6',
                          fontWeight: 700
                        }}>
                          {completedCalories}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                        }}>
                          Calories Eaten
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h4" sx={{ 
                          color: stats.remainingCalories > 0 ? '#F59E0B' : '#10B981',
                          fontWeight: 700
                        }}>
                          {stats.remainingCalories}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                        }}>
                          Remaining
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h4" sx={{ 
                          color: '#8B5CF6',
                          fontWeight: 700
                        }}>
                          {totalCalories}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                        }}>
                          Total Planned
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                );
              })()
              }
            </Box>
            
            {/* Today's Progress Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 3,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                fontWeight: 600,
              }}>
                Today's Progress
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    {(() => {
                      const meals = getTodaysMealsData();
                      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
                      const completedCalories = meals
                        .filter(meal => meal.completed)
                        .reduce((sum, meal) => sum + meal.calories, 0);
                      
                      // Calculate macros from completed meals
                      const completedMeals = meals.filter(meal => meal.completed);
                      const totalProtein = completedMeals.reduce((sum, meal) => {
                        // Estimate protein from Diet Plan data if available
                        const dietPlanMeals = getTodaysMeals();
                        if (dietPlanMeals) {
                          const mealType = meal.name.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
                          return sum + (dietPlanMeals[mealType]?.protein || 0);
                        }
                        return sum + (meal.calories * 0.2 / 4); // Fallback: 20% calories from protein
                      }, 0);
                      
                      const totalCarbs = completedMeals.reduce((sum, meal) => {
                        const dietPlanMeals = getTodaysMeals();
                        if (dietPlanMeals) {
                          const mealType = meal.name.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
                          return sum + (dietPlanMeals[mealType]?.carbs || 0);
                        }
                        return sum + (meal.calories * 0.5 / 4); // Fallback: 50% calories from carbs
                      }, 0);
                      
                      const totalFat = completedMeals.reduce((sum, meal) => {
                        const dietPlanMeals = getTodaysMeals();
                        if (dietPlanMeals) {
                          const mealType = meal.name.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
                          return sum + (dietPlanMeals[mealType]?.fat || 0);
                        }
                        return sum + (meal.calories * 0.3 / 9); // Fallback: 30% calories from fat
                      }, 0);

                      // Calculate target macros from current plan with Smart Adjustment
                      const calorieBalance = getNetCalorieBalance();
                      const targetCalories = calorieBalance.adjustedGoal;
                      const targetProtein = targetCalories * 0.25 / 4; // 25% from protein
                      const targetCarbs = targetCalories * 0.45 / 4;   // 45% from carbs  
                      const targetFat = targetCalories * 0.3 / 9;      // 30% from fat

                      return [
                        { 
                          name: 'Calories', 
                          value: Math.min(Math.round((completedCalories / targetCalories) * 100), 100), 
                          color: '#3B82F6',
                          current: completedCalories,
                          target: targetCalories
                        },
                        { 
                          name: 'Protein', 
                          value: Math.min(Math.round((totalProtein / targetProtein) * 100), 100), 
                          color: '#10B981',
                          current: Math.round(totalProtein),
                          target: Math.round(targetProtein)
                        },
                        { 
                          name: 'Carbs', 
                          value: Math.min(Math.round((totalCarbs / targetCarbs) * 100), 100), 
                          color: '#F59E0B',
                          current: Math.round(totalCarbs),
                          target: Math.round(targetCarbs)
                        },
                        { 
                          name: 'Fat', 
                          value: Math.min(Math.round((totalFat / targetFat) * 100), 100), 
                          color: '#EF4444',
                          current: Math.round(totalFat),
                          target: Math.round(targetFat)
                        }
                      ];
                    })().map((nutrient, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                              fontWeight: 500
                            }}>
                              {nutrient.name}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                            }}>
                              {nutrient.current}/{nutrient.target}{nutrient.name === 'Calories' ? ' kcal' : 'g'} ({nutrient.value}%)
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={nutrient.value} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: theme.palette.mode === 'dark' 
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: nutrient.color,
                                borderRadius: 4,
                              }
                            }}
                          />
                          {nutrient.name === 'Protein' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                                fontSize: '0.75rem',
                                mr: 1
                              }}>
                                🎚️ Ratio: 30%
                              </Typography>
                              <Box sx={{ 
                                width: '200px',
                                height: '6px',
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.1)',
                                borderRadius: '3px',
                                position: 'relative'
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  left: '30%',
                                  top: '-2px',
                                  width: '10px',
                                  height: '10px',
                                  backgroundColor: nutrient.color,
                                  borderRadius: '50%',
                                  border: '2px solid white'
                                }} />
                              </Box>
                            </Box>
                          )}
                          {nutrient.name === 'Carbs' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                                fontSize: '0.75rem',
                                mr: 1
                              }}>
                                🎚️ Ratio: 45%
                              </Typography>
                              <Box sx={{ 
                                width: '200px',
                                height: '6px',
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.1)',
                                borderRadius: '3px',
                                position: 'relative'
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  left: '45%',
                                  top: '-2px',
                                  width: '10px',
                                  height: '10px',
                                  backgroundColor: nutrient.color,
                                  borderRadius: '50%',
                                  border: '2px solid white'
                                }} />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(59, 130, 246, 0.1)' 
                        : 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      p: 3,
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>💧</span>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                        fontWeight: 600
                      }}>
                        Water Calculator
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        mb: 1
                      }}>
                        Daily Water Intake
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '8px',
                        p: 2,
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          💡 Calculation:
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                          display: 'block',
                          mb: 0.5
                        }}>
                          Base: {userWeight}kg × 35ml = {userWeight * 35}ml
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                          display: 'block',
                          mb: 0.5
                        }}>
                          Activity ({user?.userData?.activity_level || 'sedentary'}): ×{getActivityMultiplier()}
                        </Typography>
                        {workoutData.isCompleted && (
                          <Typography variant="caption" sx={{ 
                            color: '#10B981',
                            display: 'block',
                            mb: 0.5,
                            fontWeight: 600
                          }}>
                            🏃‍♂️ Workout Bonus: +500ml
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ 
                          color: '#3B82F6',
                          fontWeight: 700
                        }}>
                          ➡️ Total: {getCurrentTarget()}ml ({Math.round(getCurrentTarget() / 250)} glasses)
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(waterIntake.current / waterIntake.target) * 100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 2,
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(59, 130, 246, 0.3)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#3B82F6',
                          borderRadius: 4,
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                      textAlign: 'right',
                      mb: 2
                    }}>
                      {waterIntake.current}ml / {waterIntake.target}ml ({Math.round(waterIntake.current / 250)} glasses)
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                      mb: 2
                    }}>
                      Your Weight (kg)
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2
                    }}>
                      <TextField
                        size="small"
                        type="number"
                        value={userWeight}
                        onChange={(e) => setUserWeight(Number(e.target.value))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                        sx={{
                          flexGrow: 1,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(75, 85, 99, 0.5)' 
                              : 'rgba(229, 231, 235, 0.8)',
                            '& fieldset': {
                              borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                              borderColor: '#3B82F6',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#3B82F6',
                            },
                          },
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontWeight: 600,
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={calculateWaterIntake}
                        sx={{
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#2563EB',
                          }
                        }}
                      >
                        🧮 Set Target to {getCurrentTarget()}ml
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={addWaterGlass}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          borderColor: '#3B82F6',
                          color: '#3B82F6',
                          '&:hover': {
                            borderColor: '#2563EB',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)'
                          }
                        }}
                      >
                        💧 +Glass
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Daily Nutrition Tip */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)'
                : 'linear-gradient(135deg, #F3E8FF 0%, #F8FAFC 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(139, 92, 246, 0.3)'
                : '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            {(() => {
              // Get today's tip (could be smart or daily)
              const todaysTip = getDailyTip();
              
              return (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <span style={{ fontSize: '32px', marginRight: '16px' }}>{todaysTip.icon}</span>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                        fontWeight: 600,
                        mb: 0.5
                      }}>
                        Today's Nutrition Tip
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        textTransform: 'capitalize'
                      }}>
                        {todaysTip.category} • Daily Wisdom
                      </Typography>
                    </Box>
                    <Chip 
                      label="Daily" 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#8B5CF6', 
                        color: 'white',
                        fontWeight: 500 
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(139, 92, 246, 0.1)' 
                      : 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '12px',
                    p: 3,
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
                      fontWeight: 600,
                      mb: 2
                    }}>
                      {todaysTip.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#D1D5DB' : '#4B5563',
                      lineHeight: 1.6
                    }}>
                      {todaysTip.content}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Get a new random tip
                        const randomTip = getDailyTip(new Date(Date.now() + Math.random() * 86400000));
                        window.location.reload(); // Simple way to get new tip - can be improved
                      }}
                      sx={{
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        fontSize: '0.9rem',
                        px: 3,
                        '&:hover': {
                          borderColor: '#7C3AED',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)'
                        }
                      }}
                    >
                      💡 Another Tip
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/tips')}
                      sx={{
                        backgroundColor: '#8B5CF6',
                        '&:hover': { backgroundColor: '#7C3AED' },
                        fontSize: '0.9rem',
                        px: 3
                      }}
                    >
                      📚 All Tips
                    </Button>
                  </Box>
                </>
              );
            })()}
          </MotionPaper>
        </Grid>
      </Grid>
    </MotionBox>
  );
};

export default Dashboard;