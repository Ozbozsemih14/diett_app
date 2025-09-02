export interface MealOption {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  imageUrl: string;
  recipe?: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  emoji: string;
  gradient: string;
}

export const mealOptions: MealOption[] = [
  // BREAKFAST OPTIONS
  {
    id: 'breakfast-oatmeal-bowl',
    name: 'Protein-Rich Oatmeal Bowl',
    description: 'Steel-cut oats with Greek yogurt, mixed berries, almonds and honey',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    fiber: 8,
    ingredients: ['Steel-cut oats (50g)', 'Greek yogurt (150g)', 'Mixed berries (100g)', 'Almonds (20g)', 'Honey (15g)'],
    cookingTime: 15,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'High Protein', 'High Fiber'],
    imageUrl: '/images/meals/oatmeal-bowl.jpg',
    recipe: 'Cook steel-cut oats according to package instructions. Top with Greek yogurt, fresh berries, chopped almonds, and drizzle with honey.',
    category: 'breakfast',
    emoji: '🥣',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'breakfast-avocado-toast',
    name: 'Avocado Toast & Poached Eggs',
    description: 'Whole grain toast with smashed avocado, poached eggs, and cherry tomatoes',
    calories: 385,
    protein: 16,
    carbs: 28,
    fat: 24,
    fiber: 12,
    ingredients: ['Whole grain bread (2 slices)', 'Avocado (1 medium)', 'Eggs (2 large)', 'Cherry tomatoes (100g)', 'Lemon juice', 'Salt & pepper'],
    cookingTime: 10,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'High Fiber', 'Healthy Fats'],
    imageUrl: '/images/meals/avocado-toast.jpg',
    recipe: 'Toast bread. Mash avocado with lemon juice, salt, and pepper. Poach eggs. Assemble toast with avocado, eggs, and tomatoes.',
    category: 'breakfast',
    emoji: '🥑',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'breakfast-smoothie-bowl',
    name: 'Green Protein Smoothie Bowl',
    description: 'Banana, spinach, protein powder blend topped with chia seeds and coconut',
    calories: 340,
    protein: 25,
    carbs: 35,
    fat: 12,
    fiber: 9,
    ingredients: ['Banana (1 large)', 'Spinach (50g)', 'Protein powder (30g)', 'Almond milk (200ml)', 'Chia seeds (15g)', 'Coconut flakes (10g)'],
    cookingTime: 5,
    difficulty: 'Easy',
    dietaryTags: ['High Protein', 'Vegan Option', 'Antioxidant Rich'],
    imageUrl: '/images/meals/smoothie-bowl.jpg',
    recipe: 'Blend banana, spinach, protein powder, and almond milk. Pour into bowl and top with chia seeds and coconut flakes.',
    category: 'breakfast',
    emoji: '🍌',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'breakfast-yogurt-parfait',
    name: 'Berry Yogurt Parfait',
    description: 'Layered Greek yogurt with granola, mixed berries, and maple syrup',
    calories: 310,
    protein: 20,
    carbs: 42,
    fat: 8,
    fiber: 6,
    ingredients: ['Greek yogurt (200g)', 'Granola (30g)', 'Mixed berries (120g)', 'Maple syrup (10ml)', 'Vanilla extract'],
    cookingTime: 3,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'High Protein', 'Quick'],
    imageUrl: '/images/meals/yogurt-parfait.jpg',
    recipe: 'Layer yogurt, berries, and granola in a glass. Drizzle with maple syrup and vanilla.',
    category: 'breakfast',
    emoji: '🍓',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },

  // LUNCH OPTIONS
  {
    id: 'lunch-chicken-quinoa-bowl',
    name: 'Grilled Chicken Quinoa Bowl',
    description: 'Grilled chicken breast with quinoa, roasted vegetables, and tahini dressing',
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 18,
    fiber: 8,
    ingredients: ['Chicken breast (150g)', 'Quinoa (80g cooked)', 'Broccoli (100g)', 'Bell peppers (80g)', 'Tahini (15g)', 'Lemon juice', 'Olive oil (10ml)'],
    cookingTime: 25,
    difficulty: 'Medium',
    dietaryTags: ['High Protein', 'Gluten Free', 'Complete Meal'],
    imageUrl: '/images/meals/chicken-quinoa-bowl.jpg',
    recipe: 'Grill chicken breast. Cook quinoa. Roast vegetables. Mix tahini with lemon juice and olive oil for dressing. Combine in bowl.',
    category: 'lunch',
    emoji: '🍲',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'lunch-mediterranean-salad',
    name: 'Mediterranean Chickpea Salad',
    description: 'Mixed greens with chickpeas, feta cheese, olives, cucumber, and olive oil dressing',
    calories: 450,
    protein: 18,
    carbs: 35,
    fat: 28,
    fiber: 12,
    ingredients: ['Mixed greens (100g)', 'Chickpeas (120g)', 'Feta cheese (50g)', 'Kalamata olives (30g)', 'Cucumber (100g)', 'Red onion (30g)', 'Olive oil (20ml)', 'Lemon juice'],
    cookingTime: 10,
    difficulty: 'Easy',
    dietaryTags: ['Vegetarian', 'Mediterranean', 'High Fiber'],
    imageUrl: '/images/meals/mediterranean-salad.jpg',
    recipe: 'Combine all vegetables and chickpeas. Add feta and olives. Dress with olive oil and lemon juice.',
    category: 'lunch',
    emoji: '🥗',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
  },
  {
    id: 'lunch-salmon-sweet-potato',
    name: 'Baked Salmon & Sweet Potato',
    description: 'Herb-crusted salmon with roasted sweet potato and steamed broccoli',
    calories: 480,
    protein: 35,
    carbs: 32,
    fat: 22,
    fiber: 6,
    ingredients: ['Salmon fillet (150g)', 'Sweet potato (150g)', 'Broccoli (100g)', 'Herbs (dill, parsley)', 'Olive oil (15ml)', 'Garlic', 'Lemon'],
    cookingTime: 30,
    difficulty: 'Medium',
    dietaryTags: ['High Protein', 'Omega-3 Rich', 'Gluten Free'],
    imageUrl: '/images/meals/salmon-sweet-potato.jpg',
    recipe: 'Season salmon with herbs. Roast sweet potato cubes. Steam broccoli. Bake salmon 15-20 minutes at 400°F.',
    category: 'lunch',
    emoji: '🐟',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  },
  {
    id: 'lunch-turkey-wrap',
    name: 'Turkey & Hummus Wrap',
    description: 'Whole wheat wrap with sliced turkey, hummus, vegetables, and avocado',
    calories: 420,
    protein: 28,
    carbs: 35,
    fat: 18,
    fiber: 8,
    ingredients: ['Whole wheat tortilla (1 large)', 'Turkey breast (100g)', 'Hummus (40g)', 'Lettuce (50g)', 'Tomato (60g)', 'Avocado (60g)', 'Cucumber (40g)'],
    cookingTime: 5,
    difficulty: 'Easy',
    dietaryTags: ['High Protein', 'Quick', 'Portable'],
    imageUrl: '/images/meals/turkey-wrap.jpg',
    recipe: 'Spread hummus on tortilla. Add turkey and vegetables. Roll tightly and slice in half.',
    category: 'lunch',
    emoji: '🌯',
    gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)'
  },

  // DINNER OPTIONS
  {
    id: 'dinner-lean-beef-stir-fry',
    name: 'Lean Beef Stir-Fry',
    description: 'Lean ground beef with mixed vegetables over brown rice',
    calories: 550,
    protein: 32,
    carbs: 48,
    fat: 22,
    fiber: 6,
    ingredients: ['Lean ground beef (120g)', 'Brown rice (80g cooked)', 'Mixed stir-fry vegetables (150g)', 'Soy sauce (15ml)', 'Garlic', 'Ginger', 'Sesame oil (10ml)'],
    cookingTime: 20,
    difficulty: 'Easy',
    dietaryTags: ['High Protein', 'Complete Meal', 'Asian Inspired'],
    imageUrl: '/images/meals/beef-stir-fry.jpg',
    recipe: 'Cook brown rice. Brown beef in pan. Add vegetables and seasonings. Stir-fry until vegetables are tender.',
    category: 'dinner',
    emoji: '🥩',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'dinner-herb-crusted-cod',
    name: 'Herb-Crusted Cod',
    description: 'Baked cod with herb crust, quinoa pilaf, and roasted asparagus',
    calories: 465,
    protein: 38,
    carbs: 35,
    fat: 16,
    fiber: 7,
    ingredients: ['Cod fillet (180g)', 'Quinoa (70g cooked)', 'Asparagus (120g)', 'Fresh herbs (parsley, thyme)', 'Breadcrumbs (20g)', 'Olive oil (15ml)', 'Lemon'],
    cookingTime: 25,
    difficulty: 'Medium',
    dietaryTags: ['High Protein', 'Low Fat', 'Omega-3 Rich'],
    imageUrl: '/images/meals/herb-crusted-cod.jpg',
    recipe: 'Mix herbs with breadcrumbs. Coat cod and bake 15-20 minutes. Cook quinoa. Roast asparagus with olive oil.',
    category: 'dinner',
    emoji: '🌠',
    gradient: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)'
  },
  {
    id: 'dinner-chicken-sweet-potato',
    name: 'Baked Chicken & Sweet Potato Mash',
    description: 'Seasoned chicken thigh with sweet potato mash and green beans',
    calories: 485,
    protein: 35,
    carbs: 38,
    fat: 20,
    fiber: 8,
    ingredients: ['Chicken thigh (150g)', 'Sweet potato (180g)', 'Green beans (100g)', 'Greek yogurt (30g)', 'Herbs (rosemary, thyme)', 'Olive oil (10ml)'],
    cookingTime: 35,
    difficulty: 'Medium',
    dietaryTags: ['High Protein', 'Comfort Food', 'Balanced'],
    imageUrl: '/images/meals/chicken-sweet-potato.jpg',
    recipe: 'Season and bake chicken thigh. Boil and mash sweet potato with Greek yogurt. Steam green beans.',
    category: 'dinner',
    emoji: '🍗',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'dinner-vegetarian-lentil-curry',
    name: 'Coconut Lentil Curry',
    description: 'Red lentils in coconut curry sauce with basmati rice and naan',
    calories: 520,
    protein: 22,
    carbs: 68,
    fat: 18,
    fiber: 15,
    ingredients: ['Red lentils (100g)', 'Basmati rice (60g cooked)', 'Coconut milk (100ml)', 'Curry spices', 'Onion (60g)', 'Tomatoes (80g)', 'Spinach (50g)'],
    cookingTime: 30,
    difficulty: 'Medium',
    dietaryTags: ['Vegetarian', 'High Fiber', 'Indian Inspired'],
    imageUrl: '/images/meals/lentil-curry.jpg',
    recipe: 'Sauté onions and spices. Add lentils, tomatoes, and coconut milk. Simmer 20 minutes. Serve over rice.',
    category: 'dinner',
    emoji: '🍛',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
];

// Helper functions for filtering meals
export const getMealsByCategory = (category: 'breakfast' | 'lunch' | 'dinner'): MealOption[] => {
  return mealOptions.filter(meal => meal.category === category);
};

export const getMealsByDietaryTag = (tag: string): MealOption[] => {
  return mealOptions.filter(meal => meal.dietaryTags.includes(tag));
};

export const getMealById = (id: string): MealOption | undefined => {
  return mealOptions.find(meal => meal.id === id);
};