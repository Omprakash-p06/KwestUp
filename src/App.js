import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Tabs, Tab,
  TextField, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Slide, Checkbox, FormControlLabel, Backdrop, Switch
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Cake as CakeIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Close as CloseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircle as CheckCircleIcon // For completed daily tasks
} from '@mui/icons-material';

// GitHub SVG icon
const GitHubIcon = (props) => (
  <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

// Styled components for better visual consistency
const RootBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[100],
  fontFamily: 'Inter, sans-serif',
  display: 'flex',
  flexDirection: 'column',
}));

const MainContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  container: 'true', // For responsive sizing
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  display: 'flex',
  flexDirection: 'column',
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Main App Component
const App = () => {
  // State for navigation (which tab is active)
  const [activeTab, setActiveTab] = useState(0); // 0: Daily, 1: Birthdays, 2: Tasks, 3: Timer
  // State for daily tasks
  const [dailyTasks, setDailyTasks] = useState([]);
  // State for birthdays
  const [birthdays, setBirthdays] = useState([]);
  // State for general tasks
  const [tasks, setTasks] = useState([]);
  // State for focus timer
  const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 minutes in seconds
  const [timerRemaining, setTimerRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerLockout, setShowTimerLockout] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationCancelAction, setConfirmationCancelAction] = useState(null); // For cancel button

  // Ref for timer interval
  const timerIntervalRef = useRef(null);

  // --- Dark mode state ---
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('kwestup_dark_mode');
    return stored ? JSON.parse(stored) : false;
  });
  useEffect(() => {
    localStorage.setItem('kwestup_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f6fa',
        paper: darkMode ? '#1e1e1e' : '#fff',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  // --- Local Storage Management ---
  // Function to load data from localStorage (simulating JSON files)
  const loadData = useCallback(() => {
    try {
      const storedData = localStorage.getItem('kwestup_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setDailyTasks(parsedData.dailyTasks || []);
        setBirthdays(parsedData.birthdays || []);
        setTasks(parsedData.tasks || []);
        // Restore timer state
        if (parsedData.timerState) {
          const { duration, remaining, isRunning, startTime } = parsedData.timerState;
          setTimerDuration(duration);
          // If timer was running, calculate remaining time based on start time
          if (isRunning && startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const newRemaining = Math.max(0, duration - elapsed);
            setTimerRemaining(newRemaining);
            if (newRemaining > 0) {
              setIsTimerRunning(true);
              setShowTimerLockout(true); // Re-show lockout if timer was active
            } else {
              setIsTimerRunning(false);
              setShowTimerLockout(false); // Timer finished while app was closed
            }
          } else {
            setTimerRemaining(remaining);
            setIsTimerRunning(false);
            setShowTimerLockout(false);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  // Function to save data to localStorage
  const saveData = useCallback(() => {
    const dataToSave = {
      dailyTasks,
      birthdays,
      tasks,
      timerState: {
        duration: timerDuration,
        remaining: timerRemaining,
        isRunning: isTimerRunning,
        startTime: isTimerRunning ? Date.now() - (timerDuration - timerRemaining) * 1000 : null, // Calculate start time
      },
    };
          localStorage.setItem('kwestup_data', JSON.stringify(dataToSave));
  }, [dailyTasks, birthdays, tasks, timerDuration, timerRemaining, isTimerRunning]);

  // Load data on initial component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data whenever relevant state changes
  useEffect(() => {
    saveData();
  }, [dailyTasks, birthdays, tasks, timerDuration, timerRemaining, isTimerRunning, saveData]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isTimerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            setShowTimerLockout(false);
            showModal("Focus session complete! Great job!", () => setShowConfirmationModal(false));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning && timerRemaining === 0) {
      clearInterval(timerIntervalRef.current);
      setShowTimerLockout(false); // Ensure lockout is off if timer is 0
    } else if (!isTimerRunning && timerRemaining > 0) {
      clearInterval(timerIntervalRef.current);
    }

    // Cleanup on unmount or when timer stops
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerRemaining]);

  // Handle browser tab/window close during focus session (warning only)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isTimerRunning) {
        event.preventDefault();
        event.returnValue = ''; // Required for some browsers
        return 'A focus session is active. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTimerRunning]);

  // --- Reminder Logic ---
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const nowDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const nowTime = now.toTimeString().slice(0, 5); // HH:MM
      // Daily Tasks
      dailyTasks.forEach(task => {
        if (task.time && task.lastCompletedDate !== nowDate && task.time === nowTime) {
          showModal(`Reminder: It's time to do your daily task: "${task.name}"`, () => setShowConfirmationModal(false));
        }
      });
      // General Tasks
      tasks.forEach(task => {
        if (
          task.date && task.time &&
          task.date === nowDate &&
          task.time === nowTime &&
          !task.completed
        ) {
          showModal(`Reminder: It's time to do your task: "${task.name}"`, () => setShowConfirmationModal(false));
        }
      });
    };
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dailyTasks, tasks]);

  // --- Helper Functions ---
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showModal = (message, confirmAction, cancelAction = null) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => confirmAction);
    setConfirmationCancelAction(() => cancelAction);
    setShowConfirmationModal(true);
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
    setConfirmationCancelAction(null);
    setConfirmationMessage('');
  };

  const handleConfirmation = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    closeModal();
  };

  const handleCancelConfirmation = () => {
    if (confirmationCancelAction) {
      confirmationCancelAction();
    }
    closeModal();
  };

  // --- Components for each tab ---

  // Component for Daily Tasks
  const DailyTasks = () => {
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskTime, setNewTaskTime] = useState(''); // New: time field
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const addDailyTask = () => {
      if (newTaskName.trim()) {
        setDailyTasks([
          ...dailyTasks,
          { id: Date.now(), name: newTaskName.trim(), lastCompletedDate: null, time: newTaskTime || null }
        ]);
        setNewTaskName('');
        setNewTaskTime('');
      }
    };

    const markDailyTaskComplete = (id) => {
      setDailyTasks(dailyTasks.map(task =>
        task.id === id ? { ...task, lastCompletedDate: today } : task
      ));
    };

    const deleteDailyTask = (id) => {
      showModal(
        "Are you sure you want to delete this daily task?",
        () => setDailyTasks(dailyTasks.filter(task => task.id !== id)),
        () => closeModal()
      );
    };

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Normal Daily Tasks
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Add a new daily task..."
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addDailyTask()}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            type="time"
            label="Time (optional)"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150, borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={addDailyTask}
            startIcon={<AddIcon />}
            sx={{ p: 1.5, borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dailyTasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No daily tasks added yet. Start by adding one!
            </Typography>
          ) : (
            dailyTasks.map(task => {
              const isDue = task.lastCompletedDate !== today;
              return (
                <Paper
                  key={task.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    border: `1px solid ${isDue ? 'red' : 'green'}`,
                    boxShadow: isDue ? '0px 0px 8px rgba(255, 0, 0, 0.2)' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isDue ? (
                      <NotificationsIcon color="error" sx={{ animation: 'pulse 1.5s infinite' }} />
                    ) : (
                      <CheckCircleIcon color="success" />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: !isDue ? 'line-through' : 'none',
                        color: !isDue ? 'text.secondary' : 'text.primary',
                        fontSize: '1.1rem'
                      }}
                    >
                      {task.name}
                      {task.time && (
                        <span style={{ fontSize: '0.95em', color: '#1976d2', marginLeft: 8 }}>
                          ⏰ {task.time}
                        </span>
                      )}
                    </Typography>
                    {task.lastCompletedDate && (
                      <Typography variant="body2" color="text.secondary">
                        (Last done: {new Date(task.lastCompletedDate).toLocaleDateString()})
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isDue && (
                      <IconButton
                        onClick={() => markDailyTaskComplete(task.id)}
                        color="success"
                        aria-label="mark as complete"
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => deleteDailyTask(task.id)}
                      color="error"
                      aria-label="delete task"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            In a native app, these would trigger daily system notifications. Here, they are visual reminders.
          </Typography>
        </Box>
      </Box>
    );
  };

  // Component for Birthdays
  const Birthdays = () => {
    const [newBirthdayName, setNewBirthdayName] = useState('');
    const [newBirthdayDate, setNewBirthdayDate] = useState(''); // YYYY-MM-DD format

    const addBirthday = () => {
      if (newBirthdayName.trim() && newBirthdayDate) {
        const [, month, day] = newBirthdayDate.split('-');
        setBirthdays([...birthdays, { id: Date.now(), name: newBirthdayName.trim(), date: `${month}-${day}` }]);
        setNewBirthdayName('');
        setNewBirthdayDate('');
      }
    };

    const deleteBirthday = (id) => {
      showModal(
        "Are you sure you want to delete this birthday?",
        () => setBirthdays(birthdays.filter(b => b.id !== id)),
        () => closeModal()
      );
    };

    const todayMonthDay = new Date().toISOString().slice(5, 10); // MM-DD

    useEffect(() => {
        const hasNotified = localStorage.getItem(`kwestup_birthday_notified_${todayMonthDay}`);
        if (!hasNotified) {
            const todayBirthdays = birthdays.filter(b => b.date === todayMonthDay);
            if (todayBirthdays.length > 0) {
                const names = todayBirthdays.map(b => b.name).join(', ');
                showModal(
                    `Happy Birthday to: ${names}! 🎉`,
                    () => {
                        localStorage.setItem(`kwestup_birthday_notified_${todayMonthDay}`, 'true');
                        setShowConfirmationModal(false);
                    }
                );
            }
        }
    }, [todayMonthDay]);

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Birthdays
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Person's Name"
            variant="outlined"
            value={newBirthdayName}
            onChange={(e) => setNewBirthdayName(e.target.value)}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Birthday Date"
            variant="outlined"
            value={newBirthdayDate}
            onChange={(e) => setNewBirthdayDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={addBirthday}
            startIcon={<AddIcon />}
            sx={{ p: 1.5, borderRadius: 2, minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {birthdays.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No birthdays added yet. Add a special date!
            </Typography>
          ) : (
            birthdays.map(b => {
              const isToday = b.date === todayMonthDay;
              return (
                <Paper
                  key={b.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    border: `1px solid ${isToday ? 'purple' : 'grey'}`,
                    boxShadow: isToday ? '0px 0px 8px rgba(128, 0, 128, 0.2)' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CakeIcon color={isToday ? 'secondary' : 'action'} sx={isToday ? { animation: 'bounce 1s infinite' } : {}} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                      {b.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({new Date(new Date().getFullYear(), parseInt(b.date.split('-')[0]) - 1, parseInt(b.date.split('-')[1])).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => deleteBirthday(b.id)}
                    color="error"
                    aria-label="delete birthday"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              );
            })
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            In a native app, this would trigger a system notification at 00:00 on the birthday. Here, it's an in-app pop-up.
          </Typography>
        </Box>
      </Box>
    );
  };

  // Component for General Tasks
  const GeneralTasks = () => {
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(''); // New: date field
    const [newTaskTime, setNewTaskTime] = useState(''); // New: time field

    const addTask = () => {
      if (newTaskName.trim()) {
        setTasks([
          ...tasks,
          {
            id: Date.now(),
            name: newTaskName.trim(),
            completed: false,
            date: newTaskDate || null,
            time: newTaskTime || null
          }
        ]);
        setNewTaskName('');
        setNewTaskDate('');
        setNewTaskTime('');
      }
    };

    const toggleTaskComplete = (id) => {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    };

    const deleteTask = (id) => {
      showModal(
        "Are you sure you want to delete this task?",
        () => setTasks(tasks.filter(task => task.id !== id)),
        () => closeModal()
      );
    };

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Tasks (Goals)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Add a new goal or task..."
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            type="date"
            label="Date (optional)"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150, borderRadius: 2 }}
          />
          <TextField
            type="time"
            label="Time (optional)"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150, borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={addTask}
            startIcon={<AddIcon />}
            sx={{ p: 1.5, borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No general tasks added yet. What are your goals?
            </Typography>
          ) : (
            tasks.map(task => (
              <Paper
                key={task.id}
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: task.completed ? 'success.main' : 'grey.300',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      color="success"
                    />
                  }
                  label={
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                        fontSize: '1.1rem'
                      }}
                    >
                      {task.name}
                      {(task.date || task.time) && (
                        <span style={{ fontSize: '0.95em', color: '#1976d2', marginLeft: 8 }}>
                          {task.date && <>📅 {task.date}</>}
                          {task.date && task.time && ' '}
                          {task.time && <>⏰ {task.time}</>}
                        </span>
                      )}
                    </Typography>
                  }
                />
                <IconButton
                  onClick={() => deleteTask(task.id)}
                  color="error"
                  aria-label="delete task"
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    );
  };

  // Component for Focus Study Timer
  const FocusTimer = () => {
    const startTimer = () => {
      if (!isTimerRunning && timerRemaining > 0) {
        setIsTimerRunning(true);
        setShowTimerLockout(true);
      }
    };

    const pauseTimer = () => {
      setIsTimerRunning(false);
    };

    const resetTimer = () => {
      showModal(
        "Are you sure you want to reset the timer?",
        () => {
          setIsTimerRunning(false);
          setTimerRemaining(timerDuration);
          setShowTimerLockout(false);
        },
        () => closeModal()
      );
    };

    const handleDurationChange = (e) => {
      const minutes = parseInt(e.target.value, 10);
      if (!isNaN(minutes) && minutes > 0) {
        const newDuration = minutes * 60;
        setTimerDuration(newDuration);
        if (!isTimerRunning) { // Only reset remaining if timer is not running
          setTimerRemaining(newDuration);
        }
      }
    };

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Focus Study Timer
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Set Duration (minutes):</Typography>
          <TextField
            type="number"
            inputProps={{ min: 1 }}
            value={timerDuration / 60}
            onChange={handleDurationChange}
            disabled={isTimerRunning}
            variant="outlined"
            size="small"
            sx={{ width: 100, '& input': { textAlign: 'center', fontSize: '1.2rem' } }}
          />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontFamily: 'monospace',
            color: 'primary.main',
            p: { xs: 4, md: 6 },
            borderRadius: '50%',
            backgroundColor: 'primary.light',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
            border: '4px solid',
            borderColor: 'primary.dark',
            fontSize: { xs: '4rem', sm: '5rem', md: '6rem' }
          }}
        >
          {formatTime(timerRemaining)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isTimerRunning ? (
            <Button
              variant="contained"
              color="success"
              onClick={startTimer}
              startIcon={<PlayArrowIcon />}
              disabled={timerRemaining === 0}
              sx={{ p: 2, borderRadius: 3, fontSize: '1.2rem' }}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="contained"
              color="warning"
              onClick={pauseTimer}
              startIcon={<PauseIcon />}
              sx={{ p: 2, borderRadius: 3, fontSize: '1.2rem' }}
            >
              Pause
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={resetTimer}
            startIcon={<RefreshIcon />}
            sx={{ p: 2, borderRadius: 3, fontSize: '1.2rem' }}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            In a native app, this feature would truly prevent exiting until the timer is up. Here, a full-screen overlay is used.
          </Typography>
        </Box>
      </Box>
    );
  };

  // Confirmation Modal Component
  const ConfirmationModal = ({ message, onConfirm, onCancel, show }) => {
    return (
      <Dialog
        open={show}
        TransitionComponent={Transition}
        keepMounted
        onClose={onCancel}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography id="alert-dialog-slide-description" sx={{ fontSize: '1.1rem' }}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pt: 2 }}>
          {onConfirm && (
            <Button onClick={onConfirm} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, py: 1.5 }}>
              OK
            </Button>
          )}
          {onCancel && (
            <Button onClick={onCancel} variant="outlined" color="primary" sx={{ borderRadius: 2, px: 3, py: 1.5 }}>
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  // Timer Lockout Overlay Component
  const TimerLockoutOverlay = ({ show, remainingTime, onExitAttempt }) => {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)', // Blue gradient
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          textAlign: 'center',
        }}
        open={show}
      >
        <Box sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', boxShadow: '0px 0px 30px rgba(0,0,0,0.3)' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'extrabold', mb: 3, animation: 'pulse 1.5s infinite' }}>
            Focus Mode Active!
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 'light' }}>
            Stay focused. You cannot exit until the timer is complete.
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'monospace',
              mt: 4,
              p: { xs: 4, md: 6 },
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
              border: '4px solid',
              borderColor: 'rgba(255,255,255,0.4)',
              fontSize: { xs: '4rem', sm: '5rem', md: '6rem' }
            }}
          >
            {formatTime(remainingTime)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Keep going, you're doing great!
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={onExitAttempt}
            startIcon={<CloseIcon />}
            sx={{
              mt: 6,
              px: 4,
              py: 2,
              borderRadius: 4,
              fontSize: '1.2rem',
              boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 20px rgba(0,0,0,0.4)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Attempt Exit (Warning)
          </Button>
        </Box>
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </Backdrop>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <RootBox>
        {/* Header */}
        <AppBar position="static" sx={{ background: darkMode ? 'linear-gradient(45deg, #232526 30%, #414345 90%)' : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)' }}>
          <Toolbar sx={{ justifyContent: 'center', position: 'relative' }}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
              KwestUp
            </Typography>
            {/* Dark mode toggle */}
            <Box sx={{ position: 'absolute', left: 16, top: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                color="default"
                inputProps={{ 'aria-label': 'toggle dark mode' }}
              />
            </Box>
            {/* GitHub logo button */}
            <Box sx={{ position: 'absolute', right: 16, top: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="GitHub Repository"
                onClick={() => window.open('https://github.com/Omprakash-p06/KwestUp', '_blank')}
                sx={{ p: 0.5 }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <MainContentBox>
          {/* Navigation Tabs */}
          <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="kwestup navigation tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontWeight: 'medium',
                  borderRadius: 3, // Apply border-radius to tabs
                  mx: 1, // Add horizontal margin between tabs
                  my: 0.5, // Add vertical margin
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none', // Hide default indicator as selected tab has background
                },
              }}
            >
              <Tab label="Daily Tasks" icon={<NotificationsIcon />} iconPosition="start" disabled={showTimerLockout} />
              <Tab label="Birthdays" icon={<CakeIcon />} iconPosition="start" disabled={showTimerLockout} />
              <Tab label="Tasks" icon={<AssignmentIcon />} iconPosition="start" disabled={showTimerLockout} />
              <Tab label="Focus Timer" icon={<TimerIcon />} iconPosition="start" disabled={showTimerLockout} />
            </Tabs>
          </Paper>

          {/* Content based on active tab */}
          <Paper elevation={3} sx={{ borderRadius: 3, flexGrow: 1 }}>
            <TabPanel value={activeTab} index={0}>
              <DailyTasks />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Birthdays />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <GeneralTasks />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <FocusTimer />
            </TabPanel>
          </Paper>
        </MainContentBox>

        {/* Confirmation Modal */}
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={handleConfirmation}
          onCancel={confirmationCancelAction ? handleCancelConfirmation : null}
          show={showConfirmationModal}
        />

        {/* Timer Lockout Overlay */}
        <TimerLockoutOverlay
          show={showTimerLockout}
          remainingTime={timerRemaining}
          onExitAttempt={() => showModal(
            "You are currently in a focus session. Exiting now will disrupt your focus. Are you sure you want to stop?",
            () => {
              setIsTimerRunning(false);
              setShowTimerLockout(false);
              setTimerRemaining(timerDuration); // Reset timer on forced exit
            },
            () => closeModal() // Cancel action for this specific modal
          )}
        />
      </RootBox>
    </ThemeProvider>
  );
};

export default App;
