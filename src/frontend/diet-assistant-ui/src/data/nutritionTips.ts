export interface NutritionTip {
  id: number;
  title: string;
  content: string;
  category: 'hydration' | 'protein' | 'workout' | 'general' | 'timing' | 'metabolism';
  icon: string;
  priority?: number; // For smart tip selection
}

export const nutritionTips: NutritionTip[] = [
  {
    id: 1,
    title: "Start with Water",
    content: "Drink a glass of water immediately after waking up to kickstart your metabolism and hydrate your body after hours of sleep.",
    category: "hydration",
    icon: "💧",
    priority: 1
  },
  {
    id: 2,
    title: "Protein Power Breakfast",
    content: "Include at least 20g of protein in your breakfast to maintain stable blood sugar and keep you full longer.",
    category: "protein",
    icon: "🥚",
    priority: 2
  },
  {
    id: 3,
    title: "Pre-Workout Fuel",
    content: "Eat a small snack with carbs 30-60 minutes before exercising for optimal energy and performance.",
    category: "workout",
    icon: "🏃‍♂️"
  },
  {
    id: 4,
    title: "Mindful Eating",
    content: "Eat slowly and without distractions. It takes 20 minutes for your brain to register fullness signals.",
    category: "general",
    icon: "🧠"
  },
  {
    id: 5,
    title: "Post-Workout Recovery",
    content: "Consume protein within 2 hours after your workout to help muscle recovery and growth.",
    category: "workout",
    icon: "💪"
  },
  {
    id: 6,
    title: "Fiber First",
    content: "Aim for 25-35g of fiber daily from vegetables, fruits, and whole grains to support digestive health.",
    category: "general",
    icon: "🥬"
  },
  {
    id: 7,
    title: "Timing Matters",
    content: "Try to eat your largest meal earlier in the day when your metabolism is most active.",
    category: "timing",
    icon: "⏰"
  },
  {
    id: 8,
    title: "Healthy Fats Daily",
    content: "Include sources like avocados, nuts, and olive oil to support hormone production and nutrient absorption.",
    category: "general",
    icon: "🥑"
  },
  {
    id: 9,
    title: "Stay Consistent",
    content: "Eat at regular intervals to maintain steady energy levels and prevent overeating later.",
    category: "timing",
    icon: "📅"
  },
  {
    id: 10,
    title: "Hydration Throughout",
    content: "Drink water consistently throughout the day, not just when you feel thirsty. Aim for pale yellow urine.",
    category: "hydration",
    icon: "🚰"
  },
  {
    id: 11,
    title: "Metabolism Boost",
    content: "Include metabolism-boosting foods like green tea, chili peppers, and lean proteins in your meals.",
    category: "metabolism",
    icon: "🔥"
  },
  {
    id: 12,
    title: "Listen to Your Body",
    content: "Pay attention to hunger and fullness cues. Eat when hungry, stop when satisfied, not when full.",
    category: "general",
    icon: "👂"
  }
];

// Utility function to get tip for specific day
export const getDailyTip = (date: Date = new Date()): NutritionTip => {
  // Calculate day of year (1-365/366)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Use modulo to cycle through tips
  return nutritionTips[dayOfYear % nutritionTips.length];
};

// Smart tip selection based on user activity (future enhancement)
export const getSmartTip = (userActivity?: {
  lowWaterIntake?: boolean;
  lowProtein?: boolean;
  hasWorkout?: boolean;
}): NutritionTip => {
  if (userActivity?.lowWaterIntake) {
    const hydrationTips = nutritionTips.filter(tip => tip.category === 'hydration');
    return hydrationTips[Math.floor(Math.random() * hydrationTips.length)];
  }
  
  if (userActivity?.lowProtein) {
    const proteinTips = nutritionTips.filter(tip => tip.category === 'protein');
    return proteinTips[Math.floor(Math.random() * proteinTips.length)];
  }
  
  if (userActivity?.hasWorkout) {
    const workoutTips = nutritionTips.filter(tip => tip.category === 'workout');
    return workoutTips[Math.floor(Math.random() * workoutTips.length)];
  }
  
  // Default to daily tip
  return getDailyTip();
};