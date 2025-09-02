import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DietPlan {
  id: string;
  userId?: string;
  createdAt: string;
  targetCalories: number;
  macroRatios: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  recipe?: string;
  alternatives?: Meal[];
}

interface DietPlanContextType {
  currentPlan: DietPlan | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  generateNewPlan: (userProfile: any) => Promise<void>;
  regenerateTodaysMeals: () => Promise<void>;
  updateMeal: (mealType: 'breakfast' | 'lunch' | 'dinner', newMeal: Meal) => void;
  savePlan: () => Promise<void>;
  loadPlan: (planId: string) => Promise<void>;
  
  // Getters
  getTodaysMeals: () => { breakfast: Meal; lunch: Meal; dinner: Meal } | null;
  getPlanSummary: () => { totalCalories: number; mealsCount: number; isComplete: boolean } | null;
}

const DietPlanContext = createContext<DietPlanContextType | undefined>(undefined);

export const useDietPlan = (): DietPlanContextType => {
  const context = useContext(DietPlanContext);
  if (!context) {
    throw new Error('useDietPlan must be used within a DietPlanProvider');
  }
  return context;
};

interface DietPlanProviderProps {
  children: ReactNode;
}

export const DietPlanProvider: React.FC<DietPlanProviderProps> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('currentDietPlan');
    if (savedPlan) {
      try {
        setCurrentPlan(JSON.parse(savedPlan));
      } catch (err) {
        console.error('Error loading saved diet plan:', err);
        setError('Failed to load saved diet plan');
      }
    }
  }, []);

  // Save plan to localStorage whenever currentPlan changes
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('currentDietPlan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  const generateMockMeal = (type: 'breakfast' | 'lunch' | 'dinner', targetCalories: number): Meal => {
    const mealTemplates = {
      breakfast: [
        {
          name: 'Protein-Rich Oatmeal Bowl',
          ingredients: ['Steel-cut oats', 'Greek yogurt', 'Mixed berries', 'Almonds', 'Honey'],
          time: '07:30'
        },
        {
          name: 'Avocado Toast & Eggs',
          ingredients: ['Whole grain bread', 'Avocado', 'Poached eggs', 'Cherry tomatoes'],
          time: '08:00'
        },
        {
          name: 'Smoothie Bowl',
          ingredients: ['Banana', 'Spinach', 'Protein powder', 'Chia seeds', 'Coconut flakes'],
          time: '07:45'
        }
      ],
      lunch: [
        {
          name: 'Grilled Chicken Quinoa Bowl',
          ingredients: ['Grilled chicken breast', 'Quinoa', 'Mixed vegetables', 'Olive oil dressing'],
          time: '12:30'
        },
        {
          name: 'Mediterranean Salad',
          ingredients: ['Mixed greens', 'Feta cheese', 'Olives', 'Chickpeas', 'Cucumber'],
          time: '13:00'
        },
        {
          name: 'Salmon & Sweet Potato',
          ingredients: ['Baked salmon', 'Roasted sweet potato', 'Steamed broccoli'],
          time: '12:45'
        }
      ],
      dinner: [
        {
          name: 'Lean Beef & Vegetables',
          ingredients: ['Lean ground beef', 'Brown rice', 'Mixed stir-fry vegetables'],
          time: '19:00'
        },
        {
          name: 'Herb-Crusted Fish',
          ingredients: ['White fish fillet', 'Quinoa', 'Roasted asparagus', 'Lemon'],
          time: '19:30'
        },
        {
          name: 'Chicken & Sweet Potato',
          ingredients: ['Baked chicken thigh', 'Mashed sweet potato', 'Green beans'],
          time: '18:45'
        }
      ]
    };

    const templates = mealTemplates[type];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Calculate nutrition based on target calories
    const proteinCalories = targetCalories * 0.3;
    const carbCalories = targetCalories * 0.45;
    const fatCalories = targetCalories * 0.25;

    return {
      id: `${type}-${Date.now()}`,
      name: selectedTemplate.name,
      time: selectedTemplate.time,
      calories: targetCalories,
      protein: Math.round(proteinCalories / 4), // 4 cal/g protein
      carbs: Math.round(carbCalories / 4), // 4 cal/g carbs
      fat: Math.round(fatCalories / 9), // 9 cal/g fat
      ingredients: selectedTemplate.ingredients,
      recipe: `Prepare ${selectedTemplate.name} using the listed ingredients. Cook according to your preference for optimal nutrition.`
    };
  };

  const generateNewPlan = async (userProfile: any): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate target calories based on user profile
      // Using a simple BMR calculation for demo
      const targetCalories = userProfile?.targetCalories || 2000;
      
      // Generate meals with target calories distributed across meals
      const breakfastCalories = Math.round(targetCalories * 0.25); // 25%
      const lunchCalories = Math.round(targetCalories * 0.35); // 35%  
      const dinnerCalories = Math.round(targetCalories * 0.4); // 40%
      
      const newPlan: DietPlan = {
        id: `plan-${Date.now()}`,
        userId: userProfile?.id,
        createdAt: new Date().toISOString(),
        targetCalories,
        macroRatios: {
          protein: 30,
          carbs: 45,
          fat: 25
        },
        meals: {
          breakfast: generateMockMeal('breakfast', breakfastCalories),
          lunch: generateMockMeal('lunch', lunchCalories),
          dinner: generateMockMeal('dinner', dinnerCalories)
        },
        totalNutrition: {
          calories: breakfastCalories + lunchCalories + dinnerCalories,
          protein: 0, // Will be calculated
          carbs: 0, // Will be calculated
          fat: 0 // Will be calculated
        }
      };
      
      // Calculate total nutrition
      const totalProtein = newPlan.meals.breakfast.protein + newPlan.meals.lunch.protein + newPlan.meals.dinner.protein;
      const totalCarbs = newPlan.meals.breakfast.carbs + newPlan.meals.lunch.carbs + newPlan.meals.dinner.carbs;
      const totalFat = newPlan.meals.breakfast.fat + newPlan.meals.lunch.fat + newPlan.meals.dinner.fat;
      
      newPlan.totalNutrition = {
        calories: newPlan.totalNutrition.calories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      };
      
      setCurrentPlan(newPlan);
    } catch (err) {
      setError('Failed to generate new diet plan. Please try again.');
      console.error('Error generating diet plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateTodaysMeals = async (): Promise<void> => {
    if (!currentPlan) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const targetCalories = currentPlan.targetCalories;
      const breakfastCalories = Math.round(targetCalories * 0.25);
      const lunchCalories = Math.round(targetCalories * 0.35);
      const dinnerCalories = Math.round(targetCalories * 0.4);
      
      const updatedPlan = {
        ...currentPlan,
        meals: {
          breakfast: generateMockMeal('breakfast', breakfastCalories),
          lunch: generateMockMeal('lunch', lunchCalories),
          dinner: generateMockMeal('dinner', dinnerCalories)
        }
      };
      
      // Recalculate total nutrition
      const totalProtein = updatedPlan.meals.breakfast.protein + updatedPlan.meals.lunch.protein + updatedPlan.meals.dinner.protein;
      const totalCarbs = updatedPlan.meals.breakfast.carbs + updatedPlan.meals.lunch.carbs + updatedPlan.meals.dinner.carbs;
      const totalFat = updatedPlan.meals.breakfast.fat + updatedPlan.meals.lunch.fat + updatedPlan.meals.dinner.fat;
      
      updatedPlan.totalNutrition = {
        calories: updatedPlan.totalNutrition.calories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      };
      
      setCurrentPlan(updatedPlan);
    } catch (err) {
      setError('Failed to regenerate meals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', newMeal: Meal): void => {
    if (!currentPlan) return;
    
    const updatedPlan = {
      ...currentPlan,
      meals: {
        ...currentPlan.meals,
        [mealType]: newMeal
      }
    };
    
    // Recalculate total nutrition
    const totalProtein = updatedPlan.meals.breakfast.protein + updatedPlan.meals.lunch.protein + updatedPlan.meals.dinner.protein;
    const totalCarbs = updatedPlan.meals.breakfast.carbs + updatedPlan.meals.lunch.carbs + updatedPlan.meals.dinner.carbs;
    const totalFat = updatedPlan.meals.breakfast.fat + updatedPlan.meals.lunch.fat + updatedPlan.meals.dinner.fat;
    const totalCalories = updatedPlan.meals.breakfast.calories + updatedPlan.meals.lunch.calories + updatedPlan.meals.dinner.calories;
    
    updatedPlan.totalNutrition = {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    };
    
    setCurrentPlan(updatedPlan);
  };

  const savePlan = async (): Promise<void> => {
    if (!currentPlan) return;
    
    try {
      // In a real app, this would save to a backend
      localStorage.setItem(`dietPlan-${currentPlan.id}`, JSON.stringify(currentPlan));
    } catch (err) {
      setError('Failed to save diet plan');
    }
  };

  const loadPlan = async (planId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const savedPlan = localStorage.getItem(`dietPlan-${planId}`);
      if (savedPlan) {
        setCurrentPlan(JSON.parse(savedPlan));
      }
    } catch (err) {
      setError('Failed to load diet plan');
    } finally {
      setIsLoading(false);
    }
  };

  const getTodaysMeals = () => {
    if (!currentPlan) return null;
    return currentPlan.meals;
  };

  const getPlanSummary = () => {
    if (!currentPlan) return null;
    
    return {
      totalCalories: currentPlan.totalNutrition.calories,
      mealsCount: 3,
      isComplete: Boolean(currentPlan.meals.breakfast && currentPlan.meals.lunch && currentPlan.meals.dinner)
    };
  };

  const value: DietPlanContextType = {
    currentPlan,
    isLoading,
    error,
    generateNewPlan,
    regenerateTodaysMeals,
    updateMeal,
    savePlan,
    loadPlan,
    getTodaysMeals,
    getPlanSummary
  };

  return (
    <DietPlanContext.Provider value={value}>
      {children}
    </DietPlanContext.Provider>
  );
};

export default DietPlanProvider;