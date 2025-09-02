import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon,
  SelfImprovement as SelfImprovementIcon,
  Whatshot as WhatshotIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  SportsMartialArts as SportsMartialArtsIcon,
  Add as AddIcon2,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

export default function Workouts() {
  const theme = useTheme();
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [logData, setLogData] = useState({
    type: 'Cardio',
    duration: '',
    calories: ''
  });

  // Workout data
  const [todaysWorkout] = useState({
    type: 'Cardio',
    duration: 45,
    caloriesBurned: 320,
    completed: false,
    progress: 75
  });

  const [workoutHistory] = useState([
    { date: '2024-01-22', type: 'Strength', duration: 60, calories: 280, completed: true },
    { date: '2024-01-21', type: 'Cardio', duration: 30, calories: 200, completed: true },
    { date: '2024-01-20', type: 'HIIT', duration: 25, calories: 350, completed: true },
    { date: '2024-01-19', type: 'Yoga', duration: 45, calories: 120, completed: true },
    { date: '2024-01-18', type: 'Cardio', duration: 40, calories: 250, completed: true },
  ]);

  const [weeklyStats] = useState({
    totalWorkouts: 5,
    totalDuration: 200,
    totalCalories: 1200,
    avgCaloriesPerWorkout: 240
  });

  const exerciseTypes = [
    {
      name: 'Cardio',
      icon: <DirectionsRunIcon />,
      color: '#FF6B35',
      description: 'Running, cycling, swimming',
      avgCalories: '8-12 cal/min',
      exercises: ['Running', 'Cycling', 'Swimming', 'Elliptical', 'Walking']
    },
    {
      name: 'Strength',
      icon: <FitnessCenterIcon />,
      color: '#8B5CF6',
      description: 'Weight lifting, resistance training',
      avgCalories: '6-10 cal/min',
      exercises: ['Bench Press', 'Squats', 'Deadlifts', 'Push-ups', 'Pull-ups']
    },
    {
      name: 'HIIT',
      icon: <WhatshotIcon />,
      color: '#EF4444',
      description: 'High intensity interval training',
      avgCalories: '10-15 cal/min',
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Plank', 'Jumping Jacks']
    },
    {
      name: 'Yoga',
      icon: <SelfImprovementIcon />,
      color: '#10B981',
      description: 'Flexibility and mindfulness',
      avgCalories: '2-4 cal/min',
      exercises: ['Sun Salutation', 'Warrior Pose', 'Tree Pose', 'Downward Dog', 'Child Pose']
    }
  ];

  const handleLogWorkout = () => {
    console.log('Logging workout:', logData);
    setOpenLogDialog(false);
    setLogData({ type: 'Cardio', duration: '', calories: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <MotionPaper
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'primary.main',
              color: theme.palette.mode === 'dark' ? '#60A5FA' : 'white',
            }}
          >
            <FitnessCenterIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: theme.palette.mode === 'dark' ? '#F3F4F6' : 'white',
                fontWeight: 'bold',
              }}
            >
              Your Fitness Journey
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.mode === 'dark' ? '#D1D5DB' : 'rgba(255,255,255,0.9)'
              }}
            >
              Track workouts, build habits, achieve goals
            </Typography>
          </Box>
        </Box>
      </MotionPaper>

      <Grid container spacing={3}>
        {/* Today's Workout */}
        <Grid item xs={12} lg={6}>
          <MotionCard
            variants={itemVariants}
            sx={{
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.2) 0%, rgba(160, 82, 45, 0.2) 100%)'
                : 'linear-gradient(135deg, #FF6B35 30%, #F7931E 90%)',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Today's Workout
                </Typography>
                <Button
                  startIcon={<PlayArrowIcon />}
                  variant="contained"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Start
                </Button>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Type
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {todaysWorkout.type}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Duration
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {todaysWorkout.duration} min
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Calories
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {todaysWorkout.caloriesBurned} cal
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {todaysWorkout.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={todaysWorkout.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                />
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Weekly Stats */}
        <Grid item xs={12} lg={6}>
          <MotionCard
            variants={itemVariants}
            sx={{
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
              borderRadius: '16px',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Weekly Stats
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total Workouts', value: weeklyStats.totalWorkouts, icon: <FitnessCenterIcon /> },
                  { label: 'Total Duration', value: `${weeklyStats.totalDuration} min`, icon: <TimerIcon /> },
                  { label: 'Calories Burned', value: weeklyStats.totalCalories, icon: <WhatshotIcon /> },
                  { label: 'Avg per Workout', value: `${weeklyStats.avgCaloriesPerWorkout} cal`, icon: <TrendingUpIcon /> },
                ].map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Exercise Library */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '16px',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Exercise Library
              </Typography>
              <Button
                startIcon={<AddIcon2 />}
                variant="contained"
                onClick={() => setOpenLogDialog(true)}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Log Workout
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {exerciseTypes.map((exercise, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: exercise.color,
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {exercise.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {exercise.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {exercise.description}
                      </Typography>
                      <Chip
                        label={exercise.avgCalories}
                        size="small"
                        sx={{
                          bgcolor: `${exercise.color}20`,
                          color: exercise.color,
                          fontWeight: 600,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MotionPaper>
        </Grid>

        {/* Workout History */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{
              p: 3,
              borderRadius: '16px',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
                : 'white',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Workout History
            </Typography>
            <List>
              {workoutHistory.map((workout, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      borderRadius: '12px',
                      mb: 1,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: exerciseTypes.find(e => e.name === workout.type)?.color || '#666',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {workout.completed ? <CheckCircleIcon /> : exerciseTypes.find(e => e.name === workout.type)?.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {workout.type}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${workout.calories} cal`}
                            color="success"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(workout.date), 'MMM d, yyyy')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {workout.duration} minutes
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < workoutHistory.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Log Workout Dialog */}
      <Dialog
        open={openLogDialog}
        onClose={() => setOpenLogDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)'
              : 'white',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Log New Workout
          </Typography>
          <IconButton onClick={() => setOpenLogDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Exercise Type</InputLabel>
                <Select
                  value={logData.type}
                  label="Exercise Type"
                  onChange={(e) => setLogData({ ...logData, type: e.target.value })}
                >
                  {exerciseTypes.map((type) => (
                    <MenuItem key={type.name} value={type.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={logData.duration}
                onChange={(e) => setLogData({ ...logData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                value={logData.calories}
                onChange={(e) => setLogData({ ...logData, calories: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenLogDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLogWorkout}
            disabled={!logData.duration || !logData.calories}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Log Workout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}