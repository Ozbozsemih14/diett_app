import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LanguageIcon from '@mui/icons-material/Language';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TimerIcon from '@mui/icons-material/Timer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import DirectionsIcon from '@mui/icons-material/Directions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNotification } from '../contexts/NotificationContext';
import { getMealAlternatives } from '../api/mockApi';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  unlocked: boolean;
  shown: boolean;
}

interface DietPlanProps {
  dietPlan: {
    meals: Array<{
      id?: string;
      name: string;
      time: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      ingredients: string[];
      dietary?: string[];
      cookTime?: number;
      prepTime?: number;
      difficulty?: string;
      instructions?: string[];
      alternatives?: Array<{
        id: string;
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        ingredients: string[];
        dietary: string[];
        cookTime: number;
        prepTime: number;
        difficulty: string;
        instructions: string[];
      }>;
    }>;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    shoppingList: string[];
    recommendation?: string;
    explanation?: string;
  } | null;
  onBack: () => void;
}

interface Restaurant {
  name: string;
  distance: string;
  rating: number;
  address: string;
  matchingDishes: string[];
  isOpen: boolean;
  priceLevel: string;
  phone: string;
  website: string;
}

interface Store {
  name: string;
  distance: string;
  inStockItems: string[];
  isOpen: boolean;
  rating: number;
  address: string;
  directions?: string;
}

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

export default function DietPlanView({ dietPlan, onBack }: DietPlanProps) {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [currentMeals, setCurrentMeals] = useState(dietPlan?.meals || []);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [swapMealIndex, setSwapMealIndex] = useState<number | null>(null);
  const { showNotification } = useNotification();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, getUserData } = useUser();
  const { 
    mealProgress, 
    updateMealProgress, 
    updateNutritionProgress,
    checkAchievements,
    toggleMealCompletion,
    setSelectedMeal
  } = useProgress();
  const userData = getUserData();

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Get today's date in ISO format for consistency
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's progress from mealProgress
  const todayProgress = mealProgress.find(p => p.date === today) || {
    consumed: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: 0
    },
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false
    }
  };

  const handleMealComplete = async (index: number, meal: any) => {
    if (!dietPlan) return;
    
    const mealId = ['breakfast', 'lunch', 'dinner'][index];
    const currentlySelected = todayProgress.meals[mealId as keyof typeof todayProgress.meals];
    const newSelected = !currentlySelected;
    
    if (newSelected) {
      // Select meal for planning
      const selectedMeal = {
        id: mealId,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        time: meal.time || (index === 0 ? '8:00 AM' : index === 1 ? '1:00 PM' : '7:00 PM'),
        ingredients: meal.ingredients
      };
      
      setSelectedMeal(mealId as 'breakfast' | 'lunch' | 'dinner', selectedMeal);
      showNotification(`${meal.name} selected for ${mealId}!`, 'success');
    } else {
      // Unselect meal
      setSelectedMeal(mealId as 'breakfast' | 'lunch' | 'dinner', null);
      showNotification(`${meal.name} unselected.`, 'info');
    }
    
    // Only toggle meal selection (not nutrition progress)
    await toggleMealCompletion(today, mealId as 'breakfast' | 'lunch' | 'dinner', newSelected);
    
    // Check for new achievements
    checkAchievements();
  };

  // Handle meal swapping
  const handleSwapMeal = (mealIndex: number) => {
    setSwapMealIndex(mealIndex);
    setSwapDialogOpen(true);
  };

  // Replace meal with alternative
  const replaceMeal = (alternativeMeal: any) => {
    if (swapMealIndex !== null) {
      const newMeals = [...currentMeals];
      const mealType = ['breakfast', 'lunch', 'dinner'][swapMealIndex];
      
      // Create new meal object with same time but different content
      newMeals[swapMealIndex] = {
        ...alternativeMeal,
        time: currentMeals[swapMealIndex].time,
        alternatives: currentMeals[swapMealIndex].alternatives
      };
      
      setCurrentMeals(newMeals);
      setSwapDialogOpen(false);
      setSwapMealIndex(null);
      
      showNotification(`Switched to ${alternativeMeal.name}!`, 'success');
    }
  };

  const findNearbyStores = async () => {
    if (!userLocation) {
      setMapError('Location access is required to find nearby stores. Please enable location access in your browser.');
      showNotification('Please enable location access to find nearby stores', 'warning');
      return;
    }
    
    setMapError(null);
    try {
      showNotification('Finding nearby stores...', 'info');
      const response = await fetch(`${API_BASE_URL}/api/stores?lat=${userLocation.lat}&lng=${userLocation.lng}`);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Invalid response from server' }));
        throw new Error(data.error || 'Failed to fetch stores');
      }
      
      const data = await response.json();
      setNearbyStores(data.stores);
      setShoppingListOpen(true);
      showNotification(`Found ${data.stores.length} stores near you!`, 'success');
    } catch (error) {
      console.error('Error fetching stores:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to fetch stores');
      showNotification('Failed to find nearby stores. Please try again.', 'error');
    }
  };

  const calculateProgress = () => {
    if (!dietPlan) return { caloriesPercent: 0, proteinPercent: 0, carbsPercent: 0, currentNutrition: { calories: 0, protein: 0, carbs: 0 } };
    
    const totalCalories = dietPlan.nutrition.calories;
    const totalProtein = dietPlan.nutrition.protein;
    const totalCarbs = dietPlan.nutrition.carbs;
    
    // Calculate current nutrition from completed meals in the selected plan
    const completedMeals = dietPlan.meals.filter((_, index) => {
      const mealId = ['breakfast', 'lunch', 'dinner'][index];
      return todayProgress.meals[mealId as keyof typeof todayProgress.meals];
    });
    
    const currentCalories = completedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const currentProtein = completedMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const currentCarbs = completedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    
    return {
      caloriesPercent: Math.round((currentCalories / totalCalories) * 100),
      proteinPercent: Math.round((currentProtein / totalProtein) * 100),
      carbsPercent: Math.round((currentCarbs / totalCarbs) * 100),
      currentNutrition: { calories: currentCalories, protein: currentProtein, carbs: currentCarbs }
    };
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'success';
    if (percent >= 60) return 'primary';
    if (percent >= 30) return 'warning';
    return 'error';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const progress = calculateProgress();

  // If dietPlan is null, show loading state
  if (!dietPlan) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        p: 3,
        textAlign: 'center'
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Generating your personalized diet plan...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This may take a few moments
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Ensure dietPlan has all required properties
  if (!dietPlan.meals || !dietPlan.nutrition || !dietPlan.shoppingList) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        p: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error: Invalid diet plan data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please try refreshing the page
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      flex: 1,
      p: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            background: 'linear-gradient(45deg, #4A90E2 30%, #9B51E0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Your Personalized Diet Plan
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Based on your goals and preferences, here's your daily meal plan
        </Typography>
      </MotionBox>

      {/* Progress Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none'
            }}
          >
            <Typography variant="h6" gutterBottom>Today's Progress</Typography>
            <Grid container spacing={2}>
              {[
                { 
                  label: 'Calories', 
                  value: progress.currentNutrition.calories,
                  target: dietPlan.nutrition.calories,
                  percent: progress.caloriesPercent,
                  color: '#60A5FA'
                },
                { 
                  label: 'Protein', 
                  value: progress.currentNutrition.protein,
                  target: dietPlan.nutrition.protein,
                  percent: progress.proteinPercent,
                  color: '#34D399'
                },
                { 
                  label: 'Carbs', 
                  value: progress.currentNutrition.carbs,
                  target: dietPlan.nutrition.carbs,
                  percent: progress.carbsPercent,
                  color: '#FBBF24'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.value}/{item.target}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(item.percent, 100)}
                      color={getProgressColor(item.percent)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: theme.palette.mode === 'dark'
                          ? `${item.color}20`
                          : `${item.color}40`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.color
                        }
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </MotionPaper>

          {/* Meals List */}
          <List>
            {currentMeals.map((meal, index) => (
              <MotionListItem
                key={index}
                variants={itemVariants}
                sx={{
                  mb: 2,
                  p: 0,
                  borderRadius: 2,
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                    : 'white',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : 'none'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: todayProgress.meals[['breakfast', 'lunch', 'dinner'][index] as keyof typeof todayProgress.meals]
                            ? theme.palette.success.main
                            : theme.palette.grey[500]
                        }}
                      >
                        <RestaurantIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{meal.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {meal.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={`${meal.calories} cal`}
                        color={todayProgress.meals[['breakfast', 'lunch', 'dinner'][index] as keyof typeof todayProgress.meals] ? 'success' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <IconButton
                        onClick={() => handleMealComplete(index, meal)}
                        color={todayProgress.meals[['breakfast', 'lunch', 'dinner'][index] as keyof typeof todayProgress.meals] ? 'success' : 'default'}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      {meal.alternatives && meal.alternatives.length > 0 && (
                        <Tooltip title="Swap meal">
                          <IconButton
                            onClick={() => handleSwapMeal(index)}
                            color="primary"
                          >
                            <SwapHorizIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton onClick={() => setExpandedMeal(expandedMeal === index ? null : index)}>
                        {expandedMeal === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={expandedMeal === index}>
                    <Box sx={{ pl: 7 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                        Ingredients:
                      </Typography>
                      <List dense>
                        {meal.ingredients.map((ingredient, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <LocalDiningIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={ingredient} />
                          </ListItem>
                        ))}
                      </List>

                      {/* Recipe Details */}
                      {meal.cookTime && meal.prepTime && (
                        <>
                          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 2, mb: 2 }}>
                            Recipe Details:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TimerIcon fontSize="small" />
                              <Typography variant="body2">
                                Prep: {meal.prepTime} min
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <KitchenIcon fontSize="small" />
                              <Typography variant="body2">
                                Cook: {meal.cookTime} min
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <MenuBookIcon fontSize="small" />
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {meal.difficulty || 'Medium'}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}

                      {/* Dietary Tags */}
                      {meal.dietary && meal.dietary.length > 0 && (
                        <>
                          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 2, mb: 1 }}>
                            Dietary Info:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {meal.dietary.map((diet, dietIndex) => (
                              <Chip 
                                key={dietIndex}
                                label={diet} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            ))}
                          </Box>
                        </>
                      )}

                      {/* Cooking Instructions */}
                      {meal.instructions && meal.instructions.length > 0 && (
                        <>
                          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 2, mb: 2 }}>
                            Instructions:
                          </Typography>
                          <List dense>
                            {meal.instructions.map((instruction, idx) => (
                              <ListItem key={idx}>
                                <ListItemIcon>
                                  <Typography variant="body2" sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    width: 20, 
                                    height: 20, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '0.75rem'
                                  }}>
                                    {idx + 1}
                                  </Typography>
                                </ListItemIcon>
                                <ListItemText primary={instruction} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}

                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 2, mb: 2 }}>
                        Nutrition:
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { label: 'Protein', value: meal.protein, unit: 'g' },
                          { label: 'Carbs', value: meal.carbs, unit: 'g' },
                          { label: 'Fat', value: meal.fat, unit: 'g' }
                        ].map((nutrient, idx) => (
                          <Grid item xs={4} key={idx}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6">
                                {nutrient.value}{nutrient.unit}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {nutrient.label}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Collapse>
                </CardContent>
              </MotionListItem>
            ))}
          </List>
        </Grid>

        {/* Shopping List Section */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.1)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none'
            }}
          >
            <Typography variant="h6" gutterBottom>Shopping List</Typography>
            <List dense>
              {dietPlan.shoppingList.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LocalDiningIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              fullWidth
              onClick={findNearbyStores}
              startIcon={<LocalGroceryStoreIcon />}
              sx={{ mt: 2 }}
            >
              Find Nearby Stores
            </Button>
            {mapError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {mapError}
              </Typography>
            )}
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Nearby Stores Dialog */}
      <Dialog
        open={shoppingListOpen}
        onClose={() => setShoppingListOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nearby Grocery Stores</DialogTitle>
        <DialogContent>
          {nearbyStores.length > 0 ? (
            <List>
              {nearbyStores.map((store, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LocalGroceryStoreIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={store.name}
                    secondary={`${store.distance} km away • ${store.address}`}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DirectionsIcon />}
                    onClick={() => window.open(store.directions, '_blank')}
                  >
                    Directions
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No stores found nearby.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShoppingListOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Meal Swap Dialog */}
      <Dialog
        open={swapDialogOpen}
        onClose={() => setSwapDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Choose Alternative Meal
          {swapMealIndex !== null && (
            <Typography variant="subtitle2" color="text.secondary">
              Swapping: {currentMeals[swapMealIndex]?.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {swapMealIndex !== null && currentMeals[swapMealIndex]?.alternatives && (
            <Grid container spacing={2}>
              {currentMeals[swapMealIndex].alternatives!.map((alternative, altIndex) => (
                <Grid item xs={12} sm={6} key={altIndex}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => replaceMeal(alternative)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {alternative.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={`${alternative.calories} cal`} size="small" />
                        <Chip label={`${alternative.protein}g protein`} size="small" color="success" />
                        {alternative.dietary.map((diet, dietIndex) => (
                          <Chip 
                            key={dietIndex}
                            label={diet} 
                            size="small" 
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimerIcon fontSize="small" />
                          <Typography variant="body2">
                            {alternative.prepTime + alternative.cookTime} min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <KitchenIcon fontSize="small" />
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {alternative.difficulty}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Ingredients:
                      </Typography>
                      <Typography variant="body2">
                        {alternative.ingredients.slice(0, 3).join(', ')}
                        {alternative.ingredients.length > 3 && '...'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 