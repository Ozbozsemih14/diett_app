import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Restaurant as RestaurantIcon,
  LocalDrink as WaterIcon,
  Timer as TimerIcon,
  FitnessCenter as ExerciseIcon,
  Healing as HealthIcon,
  Nature as NaturalIcon,
  Psychology as MindIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface NutritionTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const nutritionTips: NutritionTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated Throughout the Day',
    description: 'Drink at least 8-10 glasses of water daily. Start your morning with a glass of warm water to kickstart your metabolism.',
    category: 'Hydration',
    icon: <WaterIcon />,
    color: '#2196F3'
  },
  {
    id: '2',
    title: 'Eat the Rainbow',
    description: 'Include colorful fruits and vegetables in every meal. Different colors provide different nutrients and antioxidants.',
    category: 'Nutrition',
    icon: <NaturalIcon />,
    color: '#4CAF50'
  },
  {
    id: '3',
    title: 'Portion Control is Key',
    description: 'Use smaller plates and bowls to naturally reduce portion sizes. Fill half your plate with vegetables, one quarter with protein, and one quarter with whole grains.',
    category: 'Portions',
    icon: <RestaurantIcon />,
    color: '#FF9800'
  },
  {
    id: '4',
    title: 'Don\'t Skip Breakfast',
    description: 'A healthy breakfast jumpstarts your metabolism and provides energy for the day. Include protein and fiber to stay full longer.',
    category: 'Timing',
    icon: <TimerIcon />,
    color: '#E91E63'
  },
  {
    id: '5',
    title: 'Exercise Before or After Meals',
    description: 'Light exercise like a 10-minute walk after eating can help with digestion and blood sugar control.',
    category: 'Exercise',
    icon: <ExerciseIcon />,
    color: '#9C27B0'
  },
  {
    id: '6',
    title: 'Read Food Labels Carefully',
    description: 'Check for hidden sugars, sodium, and trans fats. Choose foods with fewer and recognizable ingredients.',
    category: 'Awareness',
    icon: <LightbulbIcon />,
    color: '#FF5722'
  },
  {
    id: '7',
    title: 'Practice Mindful Eating',
    description: 'Eat slowly, chew thoroughly, and pay attention to hunger and fullness cues. Avoid distractions like TV or phones while eating.',
    category: 'Mindfulness',
    icon: <MindIcon />,
    color: '#607D8B'
  },
  {
    id: '8',
    title: 'Plan and Prep Meals',
    description: 'Spend time each week planning and preparing meals. This helps you make healthier choices and saves time during busy days.',
    category: 'Planning',
    icon: <RestaurantIcon />,
    color: '#795548'
  },
  {
    id: '9',
    title: 'Include Healthy Fats',
    description: 'Incorporate sources of healthy fats like avocados, nuts, seeds, and olive oil. They\'re essential for brain health and nutrient absorption.',
    category: 'Nutrition',
    icon: <HealthIcon />,
    color: '#009688'
  },
  {
    id: '10',
    title: 'Listen to Your Body',
    description: 'Pay attention to how different foods make you feel. Energy levels, mood, and digestion can all be affected by your food choices.',
    category: 'Awareness',
    icon: <MindIcon />,
    color: '#3F51B5'
  },
  {
    id: '11',
    title: 'Limit Processed Foods',
    description: 'Choose whole, unprocessed foods whenever possible. Fresh fruits, vegetables, lean proteins, and whole grains should make up the majority of your diet.',
    category: 'Food Quality',
    icon: <NaturalIcon />,
    color: '#8BC34A'
  },
  {
    id: '12',
    title: 'Get Enough Protein',
    description: 'Include a source of protein in every meal and snack. This helps maintain muscle mass, keeps you satisfied, and supports metabolism.',
    category: 'Nutrition',
    icon: <ExerciseIcon />,
    color: '#F44336'
  }
];

const categories = [
  'All',
  'Nutrition',
  'Hydration', 
  'Exercise',
  'Planning',
  'Awareness',
  'Mindfulness',
  'Portions',
  'Timing',
  'Food Quality'
];

export default function NutritionTips() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTips = selectedCategory === 'All' 
    ? nutritionTips 
    : nutritionTips.filter(tip => tip.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nutrition Tips
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#B0BEC5' : '#546E7A',
              mb: 1
            }}
          >
            Did you know? 💡
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#90A4AE' : '#607D8B',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Small changes in your eating habits can lead to big improvements in your health and wellbeing. 
            Here are some evidence-based tips to help you on your nutrition journey.
          </Typography>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{
                  px: 2,
                  py: 0.5,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  ...(selectedCategory === category && {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }),
                  ...(selectedCategory !== category && {
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  })
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Tips Grid */}
        <Grid container spacing={3}>
          {filteredTips.map((tip, index) => (
            <Grid item xs={12} sm={6} lg={4} key={tip.id}>
              <MotionCard
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(31,41,55,0.9) 0%, rgba(17,24,39,0.9) 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.3)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 40px rgba(0,0,0,0.4)'
                      : '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon and Category */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        background: `linear-gradient(135deg, ${tip.color}20 0%, ${tip.color}10 100%)`,
                        color: tip.color,
                      }}
                    >
                      {tip.icon}
                    </Box>
                    <Chip 
                      label={tip.category} 
                      size="small"
                      sx={{
                        backgroundColor: `${tip.color}20`,
                        color: tip.color,
                        fontSize: '0.75rem',
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 'bold',
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D3748',
                      lineHeight: 1.3
                    }}
                  >
                    {tip.title}
                  </Typography>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#B0BEC5' : '#4A5568',
                      lineHeight: 1.6,
                      flexGrow: 1
                    }}
                  >
                    {tip.description}
                  </Typography>

                  {/* Tip Indicator */}
                  <Box 
                    sx={{ 
                      mt: 2,
                      pt: 2,
                      borderTop: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255,255,255,0.1)' 
                        : '1px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: tip.color,
                        fontWeight: 'medium',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <LightbulbIcon sx={{ fontSize: 16 }} />
                      Tip #{tip.id}
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#78909C' : '#90A4AE',
              fontStyle: 'italic'
            }}
          >
            💡 Remember: These are general guidelines. Always consult with a healthcare professional for personalized nutrition advice.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}