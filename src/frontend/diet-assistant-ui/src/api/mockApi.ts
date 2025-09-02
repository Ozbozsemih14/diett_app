import { UserData } from '../contexts/UserContext';

// Food database with real nutritional values
interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: number; // grams
  dietary: string[]; // dietary restrictions/tags
  cookTime: number; // minutes
  difficulty: string;
}

// Complete meal database with dietary info and instructions
interface MealOption {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  dietary: string[]; // vegetarian, vegan, gluten-free, dairy-free, etc.
  cookTime: number;
  prepTime: number;
  difficulty: string;
  instructions: string[];
}

const MEAL_OPTIONS = {
  breakfast: [
    {
      id: 'oat_berries',
      name: 'Oatmeal with Berries',
      calories: 350,
      protein: 12,
      carbs: 65,
      fat: 8,
      ingredients: ['Rolled oats', 'Mixed berries', 'Almonds', 'Honey'],
      dietary: ['vegetarian', 'gluten-free'],
      cookTime: 10,
      prepTime: 5,
      difficulty: 'easy',
      instructions: ['Cook oats with water/milk', 'Top with berries and almonds', 'Drizzle honey']
    },
    {
      id: 'greek_parfait',
      name: 'Greek Yogurt Parfait',
      calories: 280,
      protein: 20,
      carbs: 35,
      fat: 8,
      ingredients: ['Greek yogurt', 'Granola', 'Strawberries', 'Chia seeds'],
      dietary: ['vegetarian'],
      cookTime: 0,
      prepTime: 5,
      difficulty: 'easy',
      instructions: ['Layer yogurt with granola', 'Add fresh strawberries', 'Sprinkle chia seeds']
    },
    {
      id: 'avocado_toast',
      name: 'Avocado Toast',
      calories: 320,
      protein: 12,
      carbs: 30,
      fat: 18,
      ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Tomatoes'],
      dietary: ['vegetarian'],
      cookTime: 8,
      prepTime: 5,
      difficulty: 'easy',
      instructions: ['Toast bread', 'Mash avocado with seasoning', 'Fry eggs', 'Assemble with tomatoes']
    },
    {
      id: 'protein_smoothie',
      name: 'Protein Berry Smoothie',
      calories: 290,
      protein: 25,
      carbs: 35,
      fat: 6,
      ingredients: ['Protein powder', 'Banana', 'Berries', 'Almond milk'],
      dietary: ['vegetarian', 'dairy-free'],
      cookTime: 0,
      prepTime: 5,
      difficulty: 'easy',
      instructions: ['Blend all ingredients', 'Add ice if desired', 'Serve immediately']
    },
    {
      id: 'veggie_scramble',
      name: 'Vegetable Scramble',
      calories: 310,
      protein: 18,
      carbs: 15,
      fat: 20,
      ingredients: ['Eggs', 'Spinach', 'Mushrooms', 'Bell peppers', 'Cheese'],
      dietary: ['vegetarian'],
      cookTime: 10,
      prepTime: 5,
      difficulty: 'medium',
      instructions: ['Sauté vegetables', 'Scramble eggs', 'Combine and add cheese', 'Season to taste']
    }
  ],
  lunch: [
    {
      id: 'chicken_salad',
      name: 'Grilled Chicken Salad',
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 18,
      ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 15,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Grill chicken breast', 'Mix greens and tomatoes', 'Slice chicken', 'Dress with olive oil']
    },
    {
      id: 'turkey_wrap',
      name: 'Turkey Avocado Wrap',
      calories: 380,
      protein: 28,
      carbs: 35,
      fat: 15,
      ingredients: ['Turkey breast', 'Whole wheat tortilla', 'Avocado', 'Lettuce', 'Hummus'],
      dietary: ['dairy-free'],
      cookTime: 0,
      prepTime: 10,
      difficulty: 'easy',
      instructions: ['Spread hummus on tortilla', 'Layer turkey and vegetables', 'Roll tightly', 'Cut in half']
    },
    {
      id: 'quinoa_bowl',
      name: 'Mediterranean Quinoa Bowl',
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 12,
      ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Feta', 'Tahini'],
      dietary: ['vegetarian', 'gluten-free'],
      cookTime: 15,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Cook quinoa', 'Prepare vegetables', 'Combine ingredients', 'Drizzle with tahini']
    },
    {
      id: 'salmon_rice',
      name: 'Teriyaki Salmon Bowl',
      calories: 480,
      protein: 32,
      carbs: 40,
      fat: 20,
      ingredients: ['Salmon', 'Brown rice', 'Broccoli', 'Teriyaki sauce'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 20,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Cook salmon with teriyaki', 'Steam broccoli', 'Prepare rice', 'Assemble bowl']
    },
    {
      id: 'veggie_stir_fry',
      name: 'Tofu Vegetable Stir Fry',
      calories: 350,
      protein: 20,
      carbs: 45,
      fat: 12,
      ingredients: ['Tofu', 'Mixed vegetables', 'Brown rice', 'Soy sauce'],
      dietary: ['vegan', 'dairy-free'],
      cookTime: 15,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Press and cube tofu', 'Stir fry vegetables', 'Add tofu and sauce', 'Serve over rice']
    }
  ],
  dinner: [
    {
      id: 'salmon_quinoa',
      name: 'Baked Salmon with Quinoa',
      calories: 520,
      protein: 40,
      carbs: 35,
      fat: 22,
      ingredients: ['Salmon fillet', 'Quinoa', 'Asparagus', 'Lemon'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 25,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Season and bake salmon', 'Cook quinoa', 'Steam asparagus', 'Serve with lemon']
    },
    {
      id: 'chicken_stir_fry',
      name: 'Chicken Vegetable Stir Fry',
      calories: 450,
      protein: 38,
      carbs: 30,
      fat: 18,
      ingredients: ['Chicken breast', 'Mixed vegetables', 'Brown rice', 'Ginger'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 20,
      prepTime: 15,
      difficulty: 'medium',
      instructions: ['Slice chicken thin', 'Stir fry with ginger', 'Add vegetables', 'Serve over rice']
    },
    {
      id: 'lentil_curry',
      name: 'Red Lentil Curry',
      calories: 380,
      protein: 22,
      carbs: 50,
      fat: 12,
      ingredients: ['Red lentils', 'Coconut milk', 'Spinach', 'Curry spices'],
      dietary: ['vegan', 'gluten-free', 'dairy-free'],
      cookTime: 30,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Sauté spices', 'Add lentils and coconut milk', 'Simmer until tender', 'Add spinach']
    },
    {
      id: 'turkey_sweet_potato',
      name: 'Turkey Meatballs with Sweet Potato',
      calories: 410,
      protein: 35,
      carbs: 35,
      fat: 15,
      ingredients: ['Ground turkey', 'Sweet potato', 'Green beans', 'Herbs'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 35,
      prepTime: 15,
      difficulty: 'hard',
      instructions: ['Form turkey meatballs', 'Roast sweet potatoes', 'Steam green beans', 'Combine with herbs']
    },
    {
      id: 'cod_vegetables',
      name: 'Mediterranean Cod',
      calories: 360,
      protein: 30,
      carbs: 25,
      fat: 14,
      ingredients: ['Cod fillet', 'Zucchini', 'Tomatoes', 'Olives', 'Herbs'],
      dietary: ['gluten-free', 'dairy-free'],
      cookTime: 25,
      prepTime: 10,
      difficulty: 'medium',
      instructions: ['Season cod with herbs', 'Sauté vegetables', 'Bake cod with vegetables', 'Serve with olives']
    }
  ]
};

// Helper function to filter meals based on dietary restrictions
const filterMealsByDiet = (meals: MealOption[], restrictions: string[]): MealOption[] => {
  if (!restrictions || restrictions.length === 0) return meals;
  
  return meals.filter(meal => {
    // Check if meal meets all dietary restrictions
    return restrictions.every(restriction => 
      meal.dietary.includes(restriction.toLowerCase())
    );
  });
};

// Helper function to find meal alternatives
const findMealAlternatives = (mealType: 'breakfast' | 'lunch' | 'dinner', currentMealId: string, restrictions: string[] = []): MealOption[] => {
  let availableMeals = MEAL_OPTIONS[mealType].filter(meal => meal.id !== currentMealId);
  
  if (restrictions.length > 0) {
    availableMeals = filterMealsByDiet(availableMeals, restrictions);
  }
  
  return availableMeals;
};

export interface DietPlan {
  meals: Array<{
    id: string;
    name: string;
    time: string;
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
    alternatives?: MealOption[];
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
}

// Export meal alternatives function for Diet Plan component
export const getMealAlternatives = findMealAlternatives;
export const getAllMealOptions = () => MEAL_OPTIONS;

export const generateDietPlan = async (userData: UserData): Promise<DietPlan> => {
  // Add a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate BMR using Harris-Benedict equation
  const bmr = calculateBMR(userData);
  
  // Adjust calories based on activity level
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  
  const multiplier = activityMultipliers[userData.activity_level as keyof typeof activityMultipliers] || 1.2;
  let dailyCalories = Math.round(bmr * multiplier);
  
  // Adjust calories based on goal (+/- 20%)
  const goalAdjustments = {
    'lose_weight': 0.8,  // -20% for weight loss
    'maintain': 1.0,     // no change for maintenance
    'gain_weight': 1.2   // +20% for weight gain
  };
  
  const goalMultiplier = goalAdjustments[userData.goal as keyof typeof goalAdjustments] || 1.0;
  dailyCalories = Math.round(dailyCalories * goalMultiplier);
  
  // Get user's dietary restrictions
  const restrictions = userData.dietary_restrictions || [];
  
  // Smart meal selection based on calorie targets and dietary restrictions
  const targetCalories = {
    breakfast: Math.round(dailyCalories * 0.25),
    lunch: Math.round(dailyCalories * 0.35),
    dinner: Math.round(dailyCalories * 0.40)
  };
  
  // Find best matching meals for each meal type
  const findBestMeal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    let availableMeals = MEAL_OPTIONS[mealType];
    
    // Filter by dietary restrictions
    if (restrictions.length > 0) {
      const filteredMeals = filterMealsByDiet(availableMeals, restrictions);
      if (filteredMeals.length > 0) {
        availableMeals = filteredMeals;
      }
    }
    
    // Find meal closest to target calories
    const target = targetCalories[mealType];
    return availableMeals.reduce((best, meal) => {
      const currentDiff = Math.abs(meal.calories - target);
      const bestDiff = Math.abs(best.calories - target);
      return currentDiff < bestDiff ? meal : best;
    });
  };
  
  // Generate meals
  const breakfast = findBestMeal('breakfast');
  const lunch = findBestMeal('lunch');
  const dinner = findBestMeal('dinner');
  
  // Convert to DietPlan format with alternatives
  const meals = [
    {
      ...breakfast,
      time: '8:00 AM',
      alternatives: findMealAlternatives('breakfast', breakfast.id, restrictions)
    },
    {
      ...lunch,
      time: '1:00 PM',
      alternatives: findMealAlternatives('lunch', lunch.id, restrictions)
    },
    {
      ...dinner,
      time: '7:00 PM',
      alternatives: findMealAlternatives('dinner', dinner.id, restrictions)
    }
  ];
  
  // Calculate total nutrition
  const totalNutrition = meals.reduce((total, meal) => ({
    calories: total.calories + meal.calories,
    protein: total.protein + meal.protein,
    carbs: total.carbs + meal.carbs,
    fat: total.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Generate shopping list based on ingredients
  const shoppingList = Array.from(new Set(meals.flatMap(meal => meal.ingredients)));
  
  return {
    meals,
    nutrition: totalNutrition,
    shoppingList,
    recommendation: generateRecommendation(userData),
    explanation: generateExplanation(userData, dailyCalories)
  };
};


const calculateBMR = (userData: UserData): number => {
  const { age, gender, weight, height } = userData;
  
  // Validate required fields
  if (!age || !gender || !weight || !height) {
    console.error('Missing required user data for BMR calculation:', userData);
    throw new Error('Incomplete user data: age, gender, weight, and height are required');
  }
  
  if (gender.toLowerCase() === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

const generateMealSuggestion = (mealType: string, userData: UserData): string => {
  const suggestions = {
    breakfast: [
      "Oatmeal with berries and nuts, plus a protein shake",
      "Greek yogurt parfait with granola and honey",
      "Whole grain toast with avocado and eggs"
    ],
    lunch: [
      "Grilled chicken salad with quinoa",
      "Turkey and avocado wrap with vegetables",
      "Salmon with brown rice and steamed vegetables"
    ],
    dinner: [
      "Lean beef stir-fry with vegetables",
      "Baked fish with sweet potato and asparagus",
      "Tofu and vegetable curry with brown rice"
    ]
  };

  const mealSuggestions = suggestions[mealType as keyof typeof suggestions] || [];
  return mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)] || "Custom meal based on your preferences";
};

const generateRecommendation = (userData: UserData): string => {
  const recommendations = [
    "Based on your activity level and goals, focus on protein-rich foods to support muscle maintenance.",
    "Consider spreading your meals throughout the day to maintain stable energy levels.",
    "Stay hydrated by drinking water between meals and before exercising."
  ];

  return recommendations[Math.floor(Math.random() * recommendations.length)];
};

const generateExplanation = (userData: UserData, calories: number): string => {
  return `This personalized diet plan is designed for your ${userData.activity_level} activity level and takes into account your dietary preferences. The total daily calorie target of ${calories} calories is distributed across three meals to help you maintain a balanced and sustainable diet. Each meal is designed to provide a mix of proteins, carbs, and healthy fats while respecting your dietary restrictions.`;
}; 