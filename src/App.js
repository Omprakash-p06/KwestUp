"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Checkbox,
  FormControlLabel,
  Backdrop,
  LinearProgress,
} from "@mui/material"
import { styled, ThemeProvider, createTheme, useTheme } from "@mui/material/styles"
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Cake as CakeIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircle as CheckCircleIcon, // For completed daily tasks
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  NotificationsNone as NotificationsNoneIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon, // New import for edit icon
  ArrowBackIosNew as ArrowBackIosNewIcon, // New import for calendar navigation
  ArrowForwardIos as ArrowForwardIosIcon, // New import for calendar navigation
} from "@mui/icons-material"
import BookIcon from "@mui/icons-material/Book"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import LocalDrinkIcon from "@mui/icons-material/LocalDrink"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import HotelIcon from "@mui/icons-material/Hotel"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import LaptopMacIcon from "@mui/icons-material/LaptopMac"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { format, startOfWeek, endOfWeek, addDays, isSameDay, isWithinInterval } from "date-fns" // New date-fns imports
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker" // New MUI X import
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider" // New MUI X import
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns" // New MUI X import

// GitHub SVG icon
const GitHubIcon = (props) => (
  <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

// Styled components for better visual consistency
const RootBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  fontFamily: "Poppins, Inter, sans-serif",
  display: "flex",
  flexDirection: "column",
}))

const MainContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  container: "true", // For responsive sizing
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  display: "flex",
  flexDirection: "column",
  // Add margin-top if window control panel is present
  marginTop: window.electronAPI?.isElectron ? 32 : 0,
  backgroundColor: theme.palette.background.default,
}))

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Add at the top, after imports:
const LINUX_THEMES = [
  {
    key: "light",
    name: "Light",
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      background: { default: "#f5f6fa", paper: "#fff" },
      text: { primary: "#181A20", secondary: "#555" },
      divider: "#e0e0e0",
      action: {
        hover: "rgba(0, 0, 0, 0.04)",
        selected: "rgba(0, 0, 0, 0.08)",
        disabled: "rgba(0, 0, 0, 0.26)",
        disabledBackground: "rgba(0, 0, 0, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  },
  {
    key: "dark",
    name: "Dark",
    palette: {
      mode: "dark",
      primary: { main: "#88c0d0" }, // Nord blue
      secondary: { main: "#a3be8c" }, // Nord green
      background: { default: "#2e3440", paper: "#3b4252" }, // Nord dark
      text: { primary: "#eceff4", secondary: "#d8dee9" }, // Nord light
      divider: "#4c566a",
      action: {
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #2e3440 0%, #3b4252 100%)",
  },
  {
    key: "solarized-light",
    name: "Solarized Light",
    palette: {
      mode: "light",
      primary: { main: "#268bd2" },
      secondary: { main: "#2aa198" },
      background: { default: "#fdf6e3", paper: "#f5f2e7" },
      text: { primary: "#586e75", secondary: "#657b83" },
      divider: "#93a1a1",
      action: {
        hover: "rgba(0, 0, 0, 0.04)",
        selected: "rgba(0, 0, 0, 0.08)",
        disabled: "rgba(0, 0, 0, 0.26)",
        disabledBackground: "rgba(0, 0, 0, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #fdf6e3 0%, #e3eac2 100%)",
  },
  {
    key: "solarized-dark",
    name: "Solarized Dark",
    palette: {
      mode: "dark",
      primary: { main: "#268bd2" },
      secondary: { main: "#2aa198" },
      background: { default: "#002b36", paper: "#073642" },
      text: { primary: "#839496", secondary: "#93a1a1" },
      divider: "#586e75",
      action: {
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #002b36 0%, #073642 100%)",
  },
  {
    key: "dracula",
    name: "Dracula",
    palette: {
      mode: "dark",
      primary: { main: "#bd93f9" },
      secondary: { main: "#ff79c6" },
      background: { default: "#282a36", paper: "#44475a" },
      text: { primary: "#f8f8f2", secondary: "#6272a4" },
      divider: "#6272a4",
      action: {
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #282a36 0%, #44475a 100%)",
  },
  {
    key: "nord",
    name: "Nord",
    palette: {
      mode: "dark",
      primary: { main: "#88c0d0" },
      secondary: { main: "#a3be8c" },
      background: { default: "#2e3440", paper: "#3b4252" },
      text: { primary: "#eceff4", secondary: "#d8dee9" },
      divider: "#4c566a",
      action: {
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #2e3440 0%, #3b4252 100%)",
  },
  {
    key: "amoled-dark",
    name: "AMOLED Dark",
    palette: {
      mode: "dark",
      primary: { main: "#fff700" },
      secondary: { main: "#fff700" },
      background: { default: "#000000", paper: "#000000" },
      text: { primary: "#ffffff", secondary: "#b0b0b0" },
      divider: "#333333",
      action: {
        hover: "rgba(255, 247, 0, 0.08)",
        selected: "rgba(255, 247, 0, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
    },
    gradient: "linear-gradient(135deg, #000000 0%, #000000 100%)",
  },
]

const EVENT_COLORS = [
  { name: "Blue", value: "#61afef" }, // Nord blue
  { name: "Green", value: "#98c379" }, // Nord green
  { name: "Red", value: "#e06c75" }, // Nord red
  { name: "Purple", value: "#c678dd" }, // Nord purple
  { name: "Orange", value: "#d19a66" }, // Nord orange
  { name: "Yellow", value: "#e5c07b" }, // Nord yellow
  { name: "Teal", value: "#56b6c2" }, // Nord teal
  { name: "Pink", value: "#be5046" }, // Nord pink
]

const Sidebar = styled(Box)(({ theme }) => ({
  width: 80,
  background: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  minHeight: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 1200,
  padding: 0,
}))

const TopBar = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 64,
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `0 ${theme.spacing(4)}`,
  position: "fixed",
  left: 80, // sidebar width
  top: window.electronAPI?.isElectron ? 32 : 0, // Push down if window control panel is present
  zIndex: 1100,
  boxSizing: "border-box",
}))

const MainArea = styled(Box)(({ theme }) => ({
  marginLeft: 80,
  marginTop: 64,
  padding: theme.spacing(4),
  minHeight: "calc(100vh - 64px)",
  background: theme.palette.background.default,
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  color: theme.palette.text.primary,
}))

const GreetingCard = styled(Paper)(({ theme }) => ({
  flex: 2,
  borderRadius: 24,
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  minHeight: 260,
  transition: "box-shadow 0.3s, transform 0.2s",
  position: "relative",
  background: theme.palette.background.paper,
}))

const MascotBox = styled(Box)(({ theme }) => ({
  width: 180,
  height: 180,
  background: "#fff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: theme.spacing(4),
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
}))

const NotificationPanel = styled(Paper)(({ theme }) => ({
  flex: 1,
  borderRadius: 24,
  padding: theme.spacing(3),
  minWidth: 320,
  minHeight: 180,
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  transition: "box-shadow 0.3s, transform 0.2s",
  background: theme.palette.background.paper,
}))

const TaskCardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}))

// Main App Component
const App = () => {
  // State for navigation (which tab is active)
  const [activeTab, setActiveTab] = useState(0) // 0: Daily, 1: Birthdays, 2: Tasks, 3: Timer
  // State for daily tasks
  const [dailyTasks, setDailyTasks] = useState([])
  // State for birthdays
  const [birthdays, setBirthdays] = useState([])
  // State for general tasks
  const [tasks, setTasks] = useState([])
  // State for calendar events
  const [events, setEvents] = useState([]) // New state for calendar events
  const [showEventDialog, setShowEventDialog] = useState(false) // New state for event dialog visibility
  const [editingEvent, setEditingEvent] = useState(null) // New state for event being edited
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date()) // New state for selected date in calendar
  const [calendarView, setCalendarView] = useState("month") // New state for calendar view: 'month', 'week', 'day'
  // State for focus timer
  const [timerDuration, setTimerDuration] = useState(25 * 60) // Default 25 minutes in seconds
  const [timerRemaining, setTimerRemaining] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showTimerLockout, setShowTimerLockout] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [confirmationAction, setConfirmationAction] = useState(null)
  const [confirmationCancelAction, setConfirmationCancelAction] = useState(null) // For cancel button

  // Ref for timer interval
  const timerIntervalRef = useRef(null)

  // --- Theme state ---
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem("kwestup_theme") || "dark") // Default to dark theme for "cool" aesthetic

  const isAmoledDark = themeKey === "amoled-dark";

  const theme = React.useMemo(() => {
    const themeObj = LINUX_THEMES.find((t) => t.key === themeKey) || LINUX_THEMES[0];

    return createTheme({
      palette: themeObj.palette,
      shape: { borderRadius: 12 },
      typography: { fontFamily: "Inter, sans-serif" },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 10,
              ...(isAmoledDark && {
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 247, 0, 0.1)",
                },
              }),
            },
            containedPrimary: {
              background: isAmoledDark 
                ? "#fff700" 
                : `linear-gradient(45deg, ${themeObj.palette.primary.main} 30%, ${themeObj.palette.primary.main}AA 90%)`,
              color: isAmoledDark ? "#000" : themeObj.palette.primary.contrastText,
              boxShadow: isAmoledDark 
                ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
                : `0 4px 15px ${themeObj.palette.primary.main}44`,
              "&:hover": {
                background: isAmoledDark 
                  ? "#fff700DD" 
                  : `linear-gradient(45deg, ${themeObj.palette.primary.main} 40%, ${themeObj.palette.primary.main}DD 100%)`,
                boxShadow: isAmoledDark 
                  ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700" 
                  : `0 6px 20px ${themeObj.palette.primary.main}66`,
              },
            },
            outlinedPrimary: {
              borderColor: themeObj.palette.primary.main,
              color: themeObj.palette.primary.main,
              "&:hover": {
                backgroundColor: isAmoledDark 
                  ? "rgba(255, 247, 0, 0.1)" 
                  : `${themeObj.palette.primary.main}11`,
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                borderRadius: 10,
                "& fieldset": {
                  borderColor: themeObj.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: themeObj.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: themeObj.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeObj.palette.text.secondary,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: themeObj.palette.primary.main,
              },
              "& .MuiInputBase-input": {
                color: themeObj.palette.text.primary,
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: themeObj.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: themeObj.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: themeObj.palette.primary.main,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: isAmoledDark 
                ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
                : "0 4px 24px rgba(0,0,0,0.07)",
              background: themeObj.palette.background.paper,
              color: themeObj.palette.text.primary,
              ...(isAmoledDark && {
                border: "1px solid #fff700",
              }),
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 20,
              background: themeObj.palette.background.paper,
              color: themeObj.palette.text.primary,
              ...(isAmoledDark && {
                border: "2px solid #fff700",
                boxShadow: "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700",
              }),
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: themeObj.palette.text.secondary,
              "&:hover": {
                color: themeObj.palette.primary.main,
                backgroundColor: isAmoledDark 
                  ? "rgba(255, 247, 0, 0.1)" 
                  : themeObj.palette.action.hover,
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 500,
              ...(isAmoledDark && {
                border: "1px solid #fff700",
                "&:hover": {
                  backgroundColor: "rgba(255, 247, 0, 0.1)",
                },
              }),
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 5,
              backgroundColor: themeObj.palette.background.default,
              "& .MuiLinearProgress-bar": {
                backgroundColor: themeObj.palette.primary.main,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: isAmoledDark 
                ? "#000" 
                : themeObj.palette.mode === "dark"
                  ? "linear-gradient(45deg, #232526 30%, #414345 90%)"
                  : "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
              ...(isAmoledDark && {
                borderBottom: "2px solid #fff700",
                boxShadow: "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700",
              }),
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: themeObj.palette.text.secondary,
              "&.Mui-checked": {
                color: themeObj.palette.primary.main,
              },
              "&:hover": {
                backgroundColor: isAmoledDark 
                  ? "rgba(255, 247, 0, 0.1)" 
                  : themeObj.palette.action.hover,
              },
            },
          },
        },
      },
    });
  }, [themeKey]);

  useEffect(() => {
    localStorage.setItem("kwestup_theme", themeKey)
    document.body.setAttribute("data-theme", themeKey);
  }, [themeKey])

  // --- Local Storage Management ---
  // Function to load data from localStorage (simulating JSON files)
  const loadData = useCallback(() => {
    try {
      const storedData = localStorage.getItem("kwestup_data")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setDailyTasks(parsedData.dailyTasks || [])
        setBirthdays(parsedData.birthdays || [])
        setTasks(parsedData.tasks || [])
        // Parse event dates back to Date objects
        setEvents(
          parsedData.events
            ? parsedData.events.map((event) => ({
                ...event,
                startDateTime: event.startDateTime ? new Date(event.startDateTime) : null,
                endDateTime: event.endDateTime ? new Date(event.endDateTime) : null,
              }))
            : [],
        )
        // Restore timer state
        if (parsedData.timerState) {
          const { duration, remaining, isRunning, startTime } = parsedData.timerState
          setTimerDuration(duration)
          // If timer was running, calculate remaining time based on start time
          if (isRunning && startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            const newRemaining = Math.max(0, duration - elapsed)
            setTimerRemaining(newRemaining)
            if (newRemaining > 0) {
              setIsTimerRunning(true)
              setShowTimerLockout(true) // Re-show lockout if timer was active
            } else {
              setIsTimerRunning(false)
              setShowTimerLockout(false) // Timer finished while app was closed
            }
          } else {
            setTimerRemaining(remaining)
            setIsTimerRunning(false)
            setShowTimerLockout(false)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
    }
  }, [])

  // Function to save data to localStorage
  const saveData = useCallback(() => {
    const dataToSave = {
      dailyTasks,
      birthdays,
      tasks,
      // Convert event dates to ISO strings for storage
      events: events.map((event) => ({
        ...event,
        startDateTime: event.startDateTime ? event.startDateTime.toISOString() : null,
        endDateTime: event.endDateTime ? event.endDateTime.toISOString() : null,
      })),
      timerState: {
        duration: timerDuration,
        remaining: timerRemaining,
        isRunning: isTimerRunning,
        startTime: isTimerRunning ? Date.now() - (timerDuration - timerRemaining) * 1000 : null, // Calculate start time
      },
    }
    localStorage.setItem("kwestup_data", JSON.stringify(dataToSave))
  }, [dailyTasks, birthdays, tasks, events, timerDuration, timerRemaining, isTimerRunning]) // Add events to dependency array

  // Load data on initial component mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Save data whenever relevant state changes
  useEffect(() => {
    saveData()
  }, [dailyTasks, birthdays, tasks, events, timerDuration, timerRemaining, isTimerRunning, saveData]) // Add events to dependency array

  // --- Timer Logic ---
  useEffect(() => {
    if (isTimerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current)
            setIsTimerRunning(false)
            setShowTimerLockout(false)
            showModal("Focus session complete! Great job!", () => setShowConfirmationModal(false))
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (!isTimerRunning && timerRemaining === 0) {
      clearInterval(timerIntervalRef.current)
      setShowTimerLockout(false) // Ensure lockout is off if timer is 0
    } else if (!isTimerRunning && timerRemaining > 0) {
      clearInterval(timerIntervalRef.current)
    }

    // Cleanup on unmount or when timer stops
    return () => clearInterval(timerIntervalRef.current)
  }, [isTimerRunning, timerRemaining])

  // Handle browser tab/window close during focus session (warning only)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isTimerRunning) {
        event.preventDefault()
        event.returnValue = "" // Required for some browsers
        return "A focus session is active. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isTimerRunning])

  // --- Reminder Logic ---
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const nowDate = now.toISOString().slice(0, 10) // YYYY-MM-DD
      const nowTime = now.toTimeString().slice(0, 5) // HH:MM
      // Daily Tasks
      dailyTasks.forEach((task) => {
        if (task.time && task.lastCompletedDate !== nowDate && task.time === nowTime) {
          showModal(`Reminder: It's time to do your daily task: "${task.name}"`, () => setShowConfirmationModal(false))
        }
      })
      // General Tasks
      tasks.forEach((task) => {
        if (task.date && task.time && task.date === nowDate && task.time === nowTime && !task.completed) {
          showModal(`Reminder: It's time to do your task: "${task.name}"`, () => setShowConfirmationModal(false))
        }
      })
      // Calendar Events
      events.forEach((event) => {
        if (event.hasReminder && event.reminderTime) {
          const reminderDate = new Date(event.reminderTime)
          // Check if reminder is due within the current minute
          if (
            reminderDate.getFullYear() === now.getFullYear() &&
            reminderDate.getMonth() === now.getMonth() &&
            reminderDate.getDate() === now.getDate() &&
            reminderDate.getHours() === now.getHours() &&
            reminderDate.getMinutes() === now.getMinutes()
          ) {
            // To prevent multiple reminders for recurring events, we need a way to mark them as notified for the current instance.
            // For simplicity, we'll just show the modal for now. In a real app, you'd store a 'lastNotified' timestamp per event instance.
            showModal(`Event Reminder: "${event.title}" is starting soon!`, () => setShowConfirmationModal(false))
          }
        }
      })
    }
    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [dailyTasks, tasks, events]) // Add events to dependency array

  // --- Helper Functions ---
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const showModal = (message, confirmAction, cancelAction = null) => {
    setConfirmationMessage(message)
    setConfirmationAction(() => confirmAction)
    setConfirmationCancelAction(() => cancelAction)
    setShowConfirmationModal(true)
  }

  const closeModal = () => {
    setShowConfirmationModal(false)
    setConfirmationAction(null)
    setConfirmationCancelAction(null)
    setConfirmationMessage("")
  }

  const handleConfirmation = () => {
    if (confirmationAction) {
      confirmationAction()
    }
    closeModal()
  }

  const handleCancelConfirmation = () => {
    if (confirmationCancelAction) {
      confirmationCancelAction()
    }
    closeModal()
  }

  // --- Components for each tab ---

  // Avatars for tasks/goals
  const AVATAR_OPTIONS = [
    { label: "Default", value: "", icon: <AssignmentIcon sx={{ fontSize: 36 }} /> },
    { label: "Studying", value: "study", icon: <BookIcon sx={{ fontSize: 36 }} /> },
    { label: "Eating", value: "eat", icon: <RestaurantIcon sx={{ fontSize: 36 }} /> },
    { label: "Drinking Water", value: "water", icon: <LocalDrinkIcon sx={{ fontSize: 36 }} /> },
    { label: "Workout", value: "workout", icon: <FitnessCenterIcon sx={{ fontSize: 36 }} /> },
    { label: "Sleep", value: "sleep", icon: <HotelIcon sx={{ fontSize: 36 }} /> },
    { label: "Reading", value: "reading", icon: <MenuBookIcon sx={{ fontSize: 36 }} /> },
    { label: "Coding", value: "coding", icon: <LaptopMacIcon sx={{ fontSize: 36 }} /> },
  ]
  const getAvatarIcon = (item) => {
    const found = AVATAR_OPTIONS.find((opt) => opt.value === item.avatar)
    return found ? found.icon : <AssignmentIcon sx={{ fontSize: 36 }} />
  }

  // Component for Daily Tasks
  const DailyTasks = () => {
    const [newTaskName, setNewTaskName] = useState("")
    const [newTaskTime, setNewTaskTime] = useState("") // New: time field
    const [newAvatar, setNewAvatar] = useState("")
    const [subtasks, setSubtasks] = useState([])
    const [newSubtask, setNewSubtask] = useState("")
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    const addDailyTask = () => {
      if (newTaskName.trim()) {
        setDailyTasks([
          ...dailyTasks,
          {
            id: Date.now(),
            name: newTaskName.trim(),
            lastCompletedDate: null,
            time: newTaskTime || null,
            avatar: newAvatar,
            subtasks: subtasks.map((s) => ({ ...s })),
          },
        ])
        setNewTaskName("")
        setNewTaskTime("")
        setNewAvatar("")
        setSubtasks([])
      }
    }

    const addSubtask = () => {
      if (newSubtask.trim()) {
        setSubtasks([...subtasks, { name: newSubtask.trim(), completed: false }])
        setNewSubtask("")
      }
    }
    const removeSubtask = (idx) => setSubtasks(subtasks.filter((_, i) => i !== idx))
    const toggleSubtask = (idx) =>
      setSubtasks(subtasks.map((s, i) => (i === idx ? { ...s, completed: !s.completed } : s)))

    const markDailyTaskComplete = (id) => {
      setDailyTasks(dailyTasks.map((task) => (task.id === id ? { ...task, lastCompletedDate: today } : task)))
    }

    const deleteDailyTask = (id) => {
      showModal(
        "Are you sure you want to delete this daily task?",
        () => setDailyTasks(dailyTasks.filter((task) => task.id !== id)),
        () => closeModal(),
      )
    }

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Normal Daily Tasks
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          {/* Avatar selection */}
          <Select
            value={newAvatar}
            onChange={(e) => setNewAvatar(e.target.value)}
            displayEmpty
            sx={{ width: 120, background: "transparent", mb: 2 }}
          >
            {AVATAR_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {/* Remove subtask input and add subtask button here */}
        </Box>
        {/* Subtasks list */}
        {subtasks.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {subtasks.map((s, i) => (
              <Paper
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 2,
                  bgcolor: s.completed ? "success.light" : "grey.200",
                  minWidth: 100,
                }}
              >
                <Checkbox checked={s.completed} onChange={() => toggleSubtask(i)} size="small" />
                <Typography variant="body2" sx={{ textDecoration: s.completed ? "line-through" : "none" }}>
                  {s.name}
                </Typography>
                <IconButton size="small" onClick={() => removeSubtask(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            label="Add a new daily task..."
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addDailyTask()}
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
          <Button variant="contained" onClick={addDailyTask} startIcon={<AddIcon />} sx={{ p: 1.5, borderRadius: 2 }}>
            Add
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {dailyTasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No daily tasks added yet. Start by adding one!
            </Typography>
          ) : (
            dailyTasks.map((task) => {
              const isDue = task.lastCompletedDate !== today
              return (
                <Paper
                  key={task.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    border: `1px solid ${isDue ? theme.palette.error.main : theme.palette.success.main}`,
                    boxShadow: isDue ? `0px 0px 8px ${theme.palette.error.main}33` : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {isDue ? (
                      <NotificationsIcon color="error" sx={{ animation: "pulse 1.5s infinite" }} />
                    ) : (
                      <CheckCircleIcon color="success" />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: !isDue ? "line-through" : "none",
                        color: !isDue ? "text.secondary" : "text.primary",
                        fontSize: "1.1rem",
                      }}
                    >
                      {task.name}
                      {task.time && (
                        <span style={{ fontSize: "0.95em", color: theme.palette.primary.main, marginLeft: 8 }}>
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isDue && (
                      <IconButton
                        onClick={() => markDailyTaskComplete(task.id)}
                        color="success"
                        aria-label="mark as complete"
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    )}
                    {!isDue && (
                      <IconButton
                        onClick={() =>
                          setDailyTasks(
                            dailyTasks.map((t) => (t.id === task.id ? { ...t, lastCompletedDate: null } : t)),
                          )
                        }
                        color="warning"
                        aria-label="mark as incomplete"
                      >
                        <RefreshIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => deleteDailyTask(task.id)} color="error" aria-label="delete task">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              )
            })
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
            In a native app, these would trigger daily system notifications. Here, they are visual reminders.
          </Typography>
        </Box>
      </Box>
    )
  }

  // Component for Birthdays
  const Birthdays = () => {
    const [newBirthdayName, setNewBirthdayName] = useState("")
    const [newBirthdayDate, setNewBirthdayDate] = useState("") // YYYY-MM-DD format

    const addBirthday = () => {
      if (newBirthdayName.trim() && newBirthdayDate) {
        const [, month, day] = newBirthdayDate.split("-")
        setBirthdays([...birthdays, { id: Date.now(), name: newBirthdayName.trim(), date: `${month}-${day}` }])
        setNewBirthdayName("")
        setNewBirthdayDate("")
      }
    }

    const deleteBirthday = (id) => {
      showModal(
        "Are you sure you want to delete this birthday?",
        () => setBirthdays(birthdays.filter((b) => b.id !== id)),
        () => closeModal(),
      )
    }

    const todayMonthDay = new Date().toISOString().slice(5, 10) // MM-DD

    useEffect(() => {
      const hasNotified = localStorage.getItem(`kwestup_birthday_notified_${todayMonthDay}`)
      if (!hasNotified) {
        const todayBirthdays = birthdays.filter((b) => b.date === todayMonthDay)
        if (todayBirthdays.length > 0) {
          const names = todayBirthdays.map((b) => b.name).join(", ")
          showModal(`Happy Birthday to: ${names}! 🎉`, () => {
            localStorage.setItem(`kwestup_birthday_notified_${todayMonthDay}`, "true")
            setShowConfirmationModal(false)
          })
        }
      }
    }, [todayMonthDay])

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Birthdays
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
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
            sx={{ p: 1.5, borderRadius: 2, minWidth: { xs: "100%", sm: "auto" } }}
          >
            Add
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {birthdays.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No birthdays added yet. Add a special date!
            </Typography>
          ) : (
            birthdays.map((b) => {
              const isToday = b.date === todayMonthDay
              return (
                <Paper
                  key={b.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    border: `1px solid ${isToday ? theme.palette.secondary.main : theme.palette.divider}`,
                    boxShadow: isToday ? `0px 0px 8px ${theme.palette.secondary.main}33` : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CakeIcon
                      color={isToday ? "secondary" : "action"}
                      sx={isToday ? { animation: "bounce 1s infinite" } : {}}
                    />
                    <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "text.primary" }}>
                      {b.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (
                      {new Date(
                        new Date().getFullYear(),
                        Number.parseInt(b.date.split("-")[0]) - 1,
                        Number.parseInt(b.date.split("-")[1]),
                      ).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                      )
                    </Typography>
                  </Box>
                  <IconButton onClick={() => deleteBirthday(b.id)} color="error" aria-label="delete birthday">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              )
            })
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
            In a native app, this would trigger a system notification at 00:00 on the birthday. Here, it's an in-app
            pop-up.
          </Typography>
        </Box>
      </Box>
    )
  }

  // Component for General Tasks
  const GeneralTasks = () => {
    const [newTaskName, setNewTaskName] = useState("")
    const [newTaskDate, setNewTaskDate] = useState("") // New: date field
    const [newTaskTime, setNewTaskTime] = useState("") // New: time field
    const [newAvatar, setNewAvatar] = useState("")
    const [subtasks, setSubtasks] = useState([])
    const [newSubtask, setNewSubtask] = useState("")
    // Add state for priority in GeneralTasks
    const [newPriority, setNewPriority] = useState("Urgent")

    const addTask = () => {
      if (newTaskName.trim()) {
        setTasks([
          ...tasks,
          {
            id: Date.now(),
            name: newTaskName.trim(),
            completed: false,
            date: newTaskDate || null,
            time: newTaskTime || null,
            avatar: newAvatar,
            subtasks: subtasks.map((s) => ({ ...s })),
            priority: newPriority,
          },
        ])
        setNewTaskName("")
        setNewTaskDate("")
        setNewTaskTime("")
        setNewAvatar("")
        setSubtasks([])
      }
    }

    const deleteTask = (id) => {
      showModal(
        "Are you sure you want to delete this task?",
        () => setTasks(tasks.filter((task) => task.id !== id)),
        () => closeModal(),
      )
    }

    // Split tasks into incomplete and completed
    const incompleteTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    const addSubtask = () => {
      if (newSubtask.trim()) {
        setSubtasks([...subtasks, { name: newSubtask.trim(), completed: false }])
        setNewSubtask("")
      }
    }
    const removeSubtask = (idx) => setSubtasks(subtasks.filter((_, i) => i !== idx))
    const toggleSubtask = (idx) =>
      setSubtasks(subtasks.map((s, i) => (i === idx ? { ...s, completed: !s.completed } : s)))

    // Add state for editing a selected task
    const [selectedTask, setSelectedTask] = useState(null)
    const [editTaskName, setEditTaskName] = useState("")
    const [editTaskDate, setEditTaskDate] = useState("")
    const [editTaskTime, setEditTaskTime] = useState("")
    const [editTaskAvatar, setEditTaskAvatar] = useState("")
    const [editSubtasks, setEditSubtasks] = useState([])
    const [newEditSubtask, setNewEditSubtask] = useState("")

    // Add state for editing priority
    const [editTaskPriority, setEditTaskPriority] = useState("Urgent")

    const openEditTask = (task) => {
      setSelectedTask(task)
      setEditTaskName(task.name)
      setEditTaskDate(task.date || "")
      setEditTaskTime(task.time || "")
      setEditTaskAvatar(task.avatar || "")
      setEditSubtasks(task.subtasks || [])
      setEditTaskPriority(task.priority || "Urgent")
      setNewEditSubtask("")
    }
    const closeEditTask = () => setSelectedTask(null)
    const saveEditTask = () => {
      setTasks(
        tasks.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                name: editTaskName,
                date: editTaskDate,
                time: editTaskTime,
                avatar: editTaskAvatar,
                subtasks: editSubtasks,
                priority: editTaskPriority,
              }
            : t,
        ),
      )
      closeEditTask()
    }
    const addEditSubtask = () => {
      if (newEditSubtask.trim()) {
        setEditSubtasks([...editSubtasks, { name: newEditSubtask.trim(), completed: false }])
        setNewEditSubtask("")
      }
    }
    const removeEditSubtask = (idx) => setEditSubtasks(editSubtasks.filter((_, i) => i !== idx))
    const toggleEditSubtask = (idx) =>
      setEditSubtasks(editSubtasks.map((s, i) => (i === idx ? { ...s, completed: !s.completed } : s)))

    // Add state for editingTask in both GeneralTasks and DailyTasks
    const [editingTask, setEditingTask] = useState(null)

    const getAvatarIcon = (item) => {
      const found = AVATAR_OPTIONS.find((opt) => opt.value === item.avatar)
      return found ? found.icon : <AssignmentIcon sx={{ fontSize: 36 }} />
    }

    if (editingTask) {
      return (
        <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit {editingTask.name}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={editingTask.name}
            onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={editingTask.date || ""}
            onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="time"
            label="Time"
            value={editingTask.time || ""}
            onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl sx={{ minWidth: 120, mb: 2 }} size="small">
            <InputLabel id="edit-priority-label">Priority</InputLabel>
            <Select
              labelId="edit-priority-label"
              value={editingTask.priority || "Urgent"}
              label="Priority"
              onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
            >
              <MenuItem value="Urgent">Urgent</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <TextField
            select
            fullWidth
            label="Avatar"
            value={editingTask.avatar || ""}
            onChange={(e) => setEditingTask({ ...editingTask, avatar: e.target.value })}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            {AVATAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </TextField>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Subtasks
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              value={editingTask.newSubtask || ""}
              onChange={(e) => setEditingTask({ ...editingTask, newSubtask: e.target.value })}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                setEditingTask({
                  ...editingTask,
                  subtasks: [...(editingTask.subtasks || []), { name: editingTask.newSubtask, completed: false }],
                  newSubtask: "",
                })
              }
              sx={{ flex: 1 }}
              size="small"
              label="Add subtask"
            />
            <Button
              onClick={() =>
                setEditingTask({
                  ...editingTask,
                  subtasks: [...(editingTask.subtasks || []), { name: editingTask.newSubtask, completed: false }],
                  newSubtask: "",
                })
              }
              disabled={!(editingTask.newSubtask || "").trim()}
              size="small"
            >
              Add
            </Button>
          </Box>
          {(editingTask.subtasks || []).length > 0 && (
            <Box sx={{ pl: 2, borderLeft: "2px solid #e0e0e0" }}>
              {editingTask.subtasks.map((s, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Checkbox
                    checked={s.completed}
                    onChange={() =>
                      setEditingTask({
                        ...editingTask,
                        subtasks: editingTask.subtasks.map((sub, idx) =>
                          idx === i ? { ...sub, completed: !sub.completed } : sub,
                        ),
                      })
                    }
                    size="small"
                  />
                  <Typography variant="body2" sx={{ textDecoration: s.completed ? "line-through" : "none" }}>
                    {s.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setEditingTask({ ...editingTask, subtasks: editingTask.subtasks.filter((_, idx) => idx !== i) })
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...editingTask, newSubtask: undefined } : t)))
                setEditingTask(null)
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      )
    }

    return (
      <Box sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Tasks (Goals)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          {/* Avatar selection with icon */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 120 }}>
            <Typography variant="caption" sx={{ mb: 0.5, color: "text.secondary" }}>
              Avatar
            </Typography>
            <Select
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              displayEmpty
              sx={{ width: 120, background: "transparent", mb: 2 }}
            >
              {AVATAR_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {/* Remove subtasks input here */}
          <TextField
            fullWidth
            label="Add a new goal or task..."
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
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
          <FormControl sx={{ minWidth: 120, mb: 2 }} size="small">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={newPriority}
              label="Priority"
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <MenuItem value="Urgent">Urgent</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={addTask} startIcon={<AddIcon />} sx={{ p: 1.5, borderRadius: 2 }}>
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {incompleteTasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No general tasks added yet. What are your goals?
            </Typography>
          ) : (
            incompleteTasks.map((task) => (
              <Paper
                key={task.id}
                sx={{ p: 2, display: "flex", alignItems: "center", borderRadius: 2, mb: 2, background: "#32333a" }}
              >
                <Box sx={{ mr: 2, fontSize: 24 }}>{getAvatarIcon(task)}</Box>
                <Checkbox
                  checked={!!task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                  color="success"
                  sx={{ ml: 0, mr: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    fontWeight: "bold",
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "text.secondary" : "text.primary",
                    cursor: "pointer",
                  }}
                  onClick={() => setEditingTask(task)}
                >
                  {task.name}
                </Typography>
                <IconButton onClick={() => deleteTask(task.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))
          )}
        </Box>
        {completedTasks.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "success.main", mb: 2 }}>
              Completed Tasks
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {completedTasks.map((task) => (
                <Paper
                  key={task.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "success.main",
                    backgroundColor: "success.lighter",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox checked={task.completed} onChange={() => toggleTaskComplete(task.id)} color="success" />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          fontSize: "1.1rem",
                        }}
                      >
                        {task.name}
                        {(task.date || task.time) && (
                          <span style={{ fontSize: "0.95em", color: theme.palette.primary.main, marginLeft: 8 }}>
                            {task.date && <>📅 {task.date}</>}
                            {task.date && task.time && " "}
                            {task.time && <>⏰ {task.time}</>}
                          </span>
                        )}
                      </Typography>
                    }
                  />
                  <IconButton onClick={() => deleteTask(task.id)} color="error" aria-label="delete task">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
        {incompleteTasks.map((task) => (
          <Box key={task.id + "-subtasks"} sx={{ ml: 6, mt: -2, mb: 2 }}>
            {task.subtasks && task.subtasks.length > 0 && (
              <Box sx={{ pl: 2, borderLeft: "2px solid #e0e0e0" }}>
                {task.subtasks.map((s, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Checkbox checked={s.completed} disabled size="small" />
                    <Typography variant="body2" sx={{ textDecoration: s.completed ? "line-through" : "none" }}>
                      {s.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    )
  }

  // Component for Focus Study Timer
  const FocusTimer = () => {
    const startTimer = () => {
      if (!isTimerRunning && timerRemaining > 0) {
        setIsTimerRunning(true)
        setShowTimerLockout(true)
      }
    }

    const pauseTimer = () => {
      setIsTimerRunning(false)
    }

    const resetTimer = () => {
      showModal(
        "Are you sure you want to reset the timer?",
        () => {
          setIsTimerRunning(false)
          setTimerRemaining(timerDuration)
          setShowTimerLockout(false)
        },
        () => closeModal(),
      )
    }

    const handleDurationChange = (e) => {
      const minutes = Number.parseInt(e.target.value, 10)
      if (!isNaN(minutes) && minutes > 0) {
        const newDuration = minutes * 60
        setTimerDuration(newDuration)
        if (!isTimerRunning) {
          // Only reset remaining if timer is not running
          setTimerRemaining(newDuration)
        }
      }
    }

    const timerGradient = theme.gradient || theme.palette.background.default

    return (
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 4,
          background: timerGradient,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          Focus Study Timer
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            zIndex: 1,
            background: "rgba(255,255,255,0.1)",
            p: 2,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="body1" sx={{ color: "white", fontWeight: "medium" }}>
            Duration (minutes):
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: 1 }}
            value={timerDuration / 60}
            onChange={handleDurationChange}
            disabled={isTimerRunning}
            variant="outlined"
            size="small"
            sx={{
              width: 100,
              "& input": {
                textAlign: "center",
                fontSize: "1.2rem",
                color: "white",
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "&.Mui-focused .MuiInputLabel-root": {
                  color: "white",
                },
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: "monospace",
              color: "white",
              p: { xs: 4, md: 6 },
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              boxShadow: "0px 0px 30px rgba(0,0,0,0.2), inset 0px 0px 20px rgba(255,255,255,0.1)",
              border: "3px solid rgba(255,255,255,0.3)",
              fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem" },
              fontWeight: "bold",
              textShadow: "0 0 16px #00ffb3, 0 0 4px #00bfff",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease-in-out",
              ...(theme.palette.mode === "amoled-dark"
                ? {
                    textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                    color: "#fff",
                  }
                : {}),
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 0px 40px rgba(0,0,0,0.3), inset 0px 0px 25px rgba(255,255,255,0.15)",
              },
            }}
          >
            {formatTime(timerRemaining)}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "white",
              textAlign: "center",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              fontWeight: "medium",
            }}
          >
            {isTimerRunning ? "Focus Mode Active" : "Ready to Focus"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, zIndex: 1 }}>
          {!isTimerRunning ? (
            <Button
              variant="contained"
              onClick={startTimer}
              startIcon={<PlayArrowIcon />}
              disabled={timerRemaining === 0}
              sx={{
                p: 2,
                borderRadius: 3,
                fontSize: "1.2rem",
                background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                "&:hover": {
                  background: "linear-gradient(45deg, #43A047 30%, #4CAF50 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.6)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              Start Focus
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={pauseTimer}
              startIcon={<PauseIcon />}
              sx={{
                p: 2,
                borderRadius: 3,
                fontSize: "1.2rem",
                background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
                boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
                "&:hover": {
                  background: "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(255, 152, 0, 0.6)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              Pause
            </Button>
          )}
          <Button
            variant="contained"
            onClick={resetTimer}
            startIcon={<RefreshIcon />}
            sx={{
              p: 2,
              borderRadius: 3,
              fontSize: "1.2rem",
              background: "linear-gradient(45deg, #F44336 30%, #EF5350 90%)",
              boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)",
              "&:hover": {
                background: "linear-gradient(45deg, #D32F2F 30%, #F44336 90%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(244, 67, 54, 0.6)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Reset
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            zIndex: 1,
            background: "rgba(255,255,255,0.1)",
            p: 1.5,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
          }}
        >
          <InfoOutlinedIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.8)" }} />
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Focus mode prevents exiting until timer completes
          </Typography>
        </Box>
      </Box>
    )
  }

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
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography id="alert-dialog-slide-description" sx={{ fontSize: "1.1rem" }}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
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
    )
  }

  // Timer Lockout Overlay Component
  const TimerLockoutOverlay = ({ show, remainingTime, onExitAttempt }) => {
    const timerGradient = theme.gradient || theme.palette.background.default
    const isAmoledDark = theme.palette.mode === "amoled-dark"

    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: isAmoledDark ? "#000" : timerGradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          ...(isAmoledDark && {
            border: "2px solid #fff700",
            boxShadow: "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700",
          }),
        }}
        open={show}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            background: isAmoledDark ? "rgba(255, 247, 0, 0.1)" : "rgba(255,255,255,0.1)",
            boxShadow: isAmoledDark 
              ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700" 
              : "0px 0px 30px rgba(0,0,0,0.3)",
            backdropFilter: "blur(20px)",
            border: isAmoledDark ? "2px solid #fff700" : "1px solid rgba(255,255,255,0.2)",
            maxWidth: "90vw",
            width: "auto",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: isAmoledDark ? "#fff700" : "white",
              textShadow: isAmoledDark 
                ? "0 0 8px #fff700, 0 0 2px #fff700" 
                : "0 2px 4px rgba(0,0,0,0.3)",
              animation: "pulse 2s infinite ease-in-out",
            }}
          >
            🎯 Focus Mode Active!
          </Typography>

                      <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: "medium",
                color: isAmoledDark ? "#fff" : "rgba(255,255,255,0.9)",
                textShadow: isAmoledDark 
                  ? "0 0 4px #fff, 0 0 1px #fff700" 
                  : "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Stay focused. You cannot exit until the timer is complete.
            </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              my: 4,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "monospace",
                p: { xs: 4, md: 6 },
                borderRadius: "50%",
                background: isAmoledDark ? "rgba(255, 247, 0, 0.2)" : "rgba(255,255,255,0.15)",
                boxShadow: isAmoledDark 
                  ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700, inset 0px 0px 20px rgba(255, 247, 0, 0.1)" 
                  : "0px 0px 30px rgba(0,0,0,0.2), inset 0px 0px 20px rgba(255,255,255,0.1)",
                border: isAmoledDark ? "3px solid #fff700" : "3px solid rgba(255,255,255,0.3)",
                fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem" },
                fontWeight: "bold",
                textShadow: isAmoledDark 
                  ? "0 0 8px #fff700, 0 0 2px #fff700" 
                  : "0 2px 4px rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                color: isAmoledDark ? "#fff700" : "white",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              {formatTime(remainingTime)}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 2,
                color: isAmoledDark ? "#fff700" : "white",
                textShadow: isAmoledDark 
                  ? "0 0 4px #fff700, 0 0 1px #fff700" 
                  : "0 1px 2px rgba(0,0,0,0.3)",
                fontWeight: "medium",
              }}
            >
              ⭐ Keep going, you're doing great! ⭐
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={onExitAttempt}
            startIcon={<CloseIcon />}
            sx={{
              mt: 4,
              px: 4,
              py: 2,
              borderRadius: 4,
              fontSize: "1.2rem",
              background: isAmoledDark 
                ? "#fff700" 
                : "linear-gradient(45deg, #F44336 30%, #EF5350 90%)",
              color: isAmoledDark ? "#000" : "white",
              boxShadow: isAmoledDark 
                ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
                : "0px 4px 15px rgba(244, 67, 54, 0.4)",
              "&:hover": {
                background: isAmoledDark 
                  ? "#fff700DD" 
                  : "linear-gradient(45deg, #D32F2F 30%, #F44336 90%)",
                transform: "translateY(-2px)",
                boxShadow: isAmoledDark 
                  ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700" 
                  : "0px 6px 20px rgba(244, 67, 54, 0.6)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            ⚠️ Attempt Exit (Warning)
          </Button>
        </Box>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes glow {
            from { 
              box-shadow: ${isAmoledDark 
                ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700, inset 0px 0px 20px rgba(255, 247, 0, 0.1)" 
                : "0px 0px 30px rgba(0,0,0,0.2), inset 0px 0px 20px rgba(255,255,255,0.1)"}; 
            }
            to { 
              box-shadow: ${isAmoledDark 
                ? "0 0 30px 0 #fff70099, 0 0 8px 0 #fff700, inset 0px 0px 25px rgba(255, 247, 0, 0.2)" 
                : "0px 0px 40px rgba(255,255,255,0.3), inset 0px 0px 25px rgba(255,255,255,0.2)"}; 
            }
          }
        `}</style>
      </Backdrop>
    )
  }

  // Add state for user name and modal
  const [userName, setUserName] = useState(() => localStorage.getItem("kwestup_user_name") || "")
  const [showNameModal, setShowNameModal] = useState(!userName)
  const [tempName, setTempName] = useState("")

  // Function to handle name submission
  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim())
      localStorage.setItem("kwestup_user_name", tempName.trim())
      setShowNameModal(false)
    }
  }

  // Show modal if userName is empty
  useEffect(() => {
    if (!userName) setShowNameModal(true)
  }, [userName])

  // Add navigation state for tasks and goals
  const [currentPage, setCurrentPage] = useState("dashboard")

  // Settings Page Component
  const SettingsPage = () => (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        bgcolor: theme.palette.mode === "amoled-dark" ? "#000" : theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={theme.palette.mode === "amoled-dark" ? { textShadow: "0 0 8px #fff, 0 0 2px #fff700", color: "#fff" } : {}}
      >
        Settings
      </Typography>
      <Box sx={{ my: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={
            theme.palette.mode === "amoled-dark" ? { textShadow: "0 0 8px #fff, 0 0 2px #fff700", color: "#fff" } : {}
          }
        >
          Theme
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            value={themeKey}
            label="Theme"
            onChange={(e) => setThemeKey(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "amoled-dark" ? "#fff700" : theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {LINUX_THEMES.map((t) => (
              <MenuItem key={t.key} value={t.key}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ my: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={
            theme.palette.mode === "amoled-dark" ? { textShadow: "0 0 8px #fff, 0 0 2px #fff700", color: "#fff" } : {}
          }
        >
          About Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          KwestUp is a productivity dashboard app built with React and Electron.
          <br />
          Manage your tasks, goals, and focus sessions with a beautiful, modern UI.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<GitHubIcon />}
          onClick={() => window.open("https://github.com/Omprakash-p06/KwestUp", "_blank")}
          sx={{ borderRadius: 2 }}
        >
          View on GitHub
        </Button>
      </Box>
    </Box>
  )

  // Kanban Board for Dashboard
  const KanbanBoard = ({ onToggleTaskComplete }) => {
    // Ensure theme is available
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark" || theme.palette.mode === "amoled-dark"
    // Separate general tasks and daily tasks
    const generalTasks = tasks
    const dailyNormalTasks = dailyTasks
    const completedTasks = generalTasks.filter((t) => t.completed)
    const incompleteTasks = generalTasks.filter((t) => !t.completed)
    const completedDaily = dailyNormalTasks.filter((t) => t.lastCompletedDate)
    const incompleteDaily = dailyNormalTasks.filter((t) => !t.lastCompletedDate)

    // Accent colors for cards (use for border and tag backgrounds)
    const accentColors = [
      { border: "#88c0d0", tag: "#88c0d033", text: "#88c0d0" }, // Nord blue
      { border: "#a3be8c", tag: "#a3be8c33", text: "#a3be8c" }, // Nord green
      { border: "#bf616a", tag: "#bf616a33", text: "#bf616a" }, // Nord red
      { border: "#b48ead", tag: "#b48ead33", text: "#b48ead" }, // Nord purple
      { border: "#d08770", tag: "#d0877033", text: "#d08770" }, // Nord orange
    ]
    // Helper for pills
    const Pill = ({ label, colorIdx }) => {
      const style = accentColors[colorIdx % accentColors.length]
      const isAmoledDark = theme.palette.mode === "amoled-dark"
      return (
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 500,
            bgcolor: isAmoledDark ? "rgba(255, 247, 0, 0.2)" : style.tag,
            color: isAmoledDark ? "#fff700" : style.text,
            mr: 1,
            mb: 1,
            ...(isAmoledDark && {
              border: "1px solid #fff700",
            }),
          }}
        >
          {label}
        </Box>
      )
    }
    // Expansion state for cards
    const [expandedCardId, setExpandedCardId] = React.useState(null)
    // Card component
    const ModernCard = ({
      title,
      desc,
      tags,
      colorIdx,
      onClick,
      children,
      avatar,
      task,
      expanded,
      onExpandToggle,
      onToggleComplete,
    }) => {
      // Priority-based border color
      let borderColor = accentColors[colorIdx % accentColors.length].border
      if (task && task.priority) {
        if (task.priority === "Urgent")
          borderColor = "#bf616a" // Nord red
        else if (task.priority === "Low")
          borderColor = "#ebcb8b" // Nord yellow
        else if (task.priority === "High")
          borderColor = "#d08770" // Nord orange
        else if (task.priority === "Medium") borderColor = "#88c0d0" // Nord blue
      }
      
      // AMOLED theme adjustments
      const isAmoledDark = theme.palette.mode === "amoled-dark"
      const cardBg = isAmoledDark ? "#000" : isDark ? theme.palette.background.paper : "#fff"
      const border = isAmoledDark ? "#fff700" : borderColor
      const titleColor = isAmoledDark ? "#fff" : isDark ? theme.palette.text.primary : "#222"
      const descColor = isAmoledDark ? "#b0b0b0" : isDark ? theme.palette.text.secondary : "#444"
      const tagBg = isAmoledDark 
        ? "rgba(255, 247, 0, 0.2)" 
        : isDark
          ? accentColors[colorIdx % accentColors.length].tag
          : accentColors[colorIdx % accentColors.length].tag.replace("33", "FF")
      const tagText = isAmoledDark ? "#fff700" : isDark ? accentColors[colorIdx % accentColors.length].text : "#222"
      const arrowColor = isAmoledDark ? "#fff700" : isDark ? theme.palette.text.secondary : "#222"
      return (
        <Paper
          elevation={0}
          sx={{
            background: cardBg,
            borderRadius: 4,
            boxShadow: isAmoledDark 
              ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
              : "0 8px 32px rgba(0,0,0,0.1)",
            p: 3,
            minWidth: 260,
            maxWidth: 340,
            mb: 3,
            border: `2px solid ${border}`,
            cursor: onClick ? "pointer" : "default",
            transition: "box-shadow 0.2s, transform 0.2s",
            "&:hover": {
              boxShadow: isAmoledDark 
                ? "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700" 
                : "0 12px 40px rgba(0,0,0,0.15)",
              transform: onClick ? "translateY(-3px) scale(1.01)" : undefined,
            },
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
          onClick={onClick}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: tagBg,
              }}
            >
              {avatar}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: titleColor, fontSize: 22 }}>
              {title}
            </Typography>
            {onToggleComplete && (
              <Checkbox
                checked={!!task.completed}
                onChange={(e) => {
                  e.stopPropagation()
                  onToggleComplete()
                }}
                color="success"
                sx={{ ml: "auto" }}
              />
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onExpandToggle()
              }}
            >
              <svg
                width="22"
                height="22"
                style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                fill={arrowColor}
                viewBox="0 0 24 24"
              >
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </IconButton>
          </Box>
          {desc && (
            <Typography variant="body2" sx={{ color: descColor, mb: 1, fontSize: 15 }}>
              {desc}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
            {tags &&
              tags.map((t, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: 13,
                    fontWeight: 500,
                    bgcolor: tagBg,
                    color: tagText,
                    mr: 1,
                    mb: 1,
                  }}
                >
                  {t}
                </Box>
              ))}
          </Box>
          {children}
          {expanded && task && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: isDark ? theme.palette.background.default : "#f9f9f9",
                borderRadius: 2,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: titleColor, mb: 1 }}>
                Details
              </Typography>
              <Typography variant="body2" sx={{ color: descColor }}>
                <b>Name:</b> {task.name}
              </Typography>
              {task.date && (
                <Typography variant="body2" sx={{ color: descColor }}>
                  <b>Date:</b> {task.date}
                </Typography>
              )}
              {task.time && (
                <Typography variant="body2" sx={{ color: descColor }}>
                  <b>Time:</b> {task.time}
                </Typography>
              )}
              {task.priority && (
                <Typography variant="body2" sx={{ color: descColor }}>
                  <b>Priority:</b> {task.priority}
                </Typography>
              )}
              {task.status && (
                <Typography variant="body2" sx={{ color: descColor }}>
                  <b>Status:</b> {task.status}
                </Typography>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: descColor, mb: 0.5 }}>
                    <b>Subtasks:</b>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {task.subtasks.map((s, i) => (
                      <li key={i} style={{ color: descColor }}>
                        {s.name} {s.completed ? "(done)" : ""}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          )}
          {/* Removed Explore button and arrow */}
        </Paper>
      )
    }
    return (
      <Box>
        {/* Color palette legend */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#222', mr: 2 }}>UI Color Rule:</Typography>
          {paletteSwatches.map((sw, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: sw.color, border: '1.5px solid #bbb', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: isDark ? '#fff' : '#222' }}>{sw.label}</Typography>
            </Box>
          ))}
        </Box> */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            mt: 4,
            justifyContent: "center",
          }}
        >
          {/* General Tasks */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "left", color: isDark ? theme.palette.text.primary : "#222", fontWeight: "bold" }}
            >
              General Tasks
            </Typography>
            {incompleteTasks.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                No tasks
              </Typography>
            )}
            {incompleteTasks.map((item, idx) => (
              <ModernCard
                key={item.id}
                title={item.name}
                desc={item.date ? `Due: ${item.date}` : ""}
                tags={[
                  ...(item.subtasks?.length ? [item.subtasks.length + " subtasks"] : []),
                  ...(item.priority ? [item.priority] : []),
                  ...(item.status ? [item.status] : []),
                ]}
                colorIdx={idx}
                avatar={getAvatarIcon(item)}
                task={item}
                expanded={expandedCardId === item.id}
                onExpandToggle={() => setExpandedCardId(expandedCardId === item.id ? null : item.id)}
                onToggleComplete={() => onToggleTaskComplete(item.id)}
              >
                {/* Subtasks as pills */}
                {item.subtasks && item.subtasks.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {item.subtasks.map((s, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 13,
                          fontWeight: 500,
                          bgcolor: isAmoledDark 
                            ? "rgba(255, 247, 0, 0.2)" 
                            : isDark
                              ? accentColors[idx % accentColors.length].tag
                              : accentColors[idx % accentColors.length].tag.replace("33", "FF"),
                          color: isAmoledDark 
                            ? "#fff700" 
                            : isDark 
                              ? accentColors[idx % accentColors.length].text 
                              : "#222",
                          mr: 1,
                          mb: 1,
                          ...(isAmoledDark && {
                            border: "1px solid #fff700",
                          }),
                        }}
                      >
                        {s.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </ModernCard>
            ))}
          </Box>
          {/* Daily Tasks */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "left", color: isDark ? theme.palette.text.primary : "#222", fontWeight: "bold" }}
            >
              Daily Tasks
            </Typography>
            {incompleteDaily.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                No daily tasks
              </Typography>
            )}
            {incompleteDaily.map((item, idx) => (
              <ModernCard
                key={item.id}
                title={item.name}
                desc={item.time ? `Time: ${item.time}` : ""}
                tags={[...(item.subtasks?.length ? [item.subtasks.length + " subtasks"] : [])]}
                colorIdx={idx + 2}
                avatar={getAvatarIcon(item)}
                task={item}
                expanded={expandedCardId === item.id}
                onExpandToggle={() => setExpandedCardId(expandedCardId === item.id ? null : item.id)}
                // onToggleComplete intentionally omitted for daily tasks
              >
                {/* Subtasks as pills */}
                {item.subtasks && item.subtasks.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {item.subtasks.map((s, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 13,
                          fontWeight: 500,
                          bgcolor: isAmoledDark 
                            ? "rgba(255, 247, 0, 0.2)" 
                            : isDark
                              ? accentColors[(idx + 2) % accentColors.length].tag
                              : accentColors[(idx + 2) % accentColors.length].tag.replace("33", "FF"),
                          color: isAmoledDark 
                            ? "#fff700" 
                            : isDark 
                              ? accentColors[(idx + 2) % accentColors.length].text 
                              : "#222",
                          mr: 1,
                          mb: 1,
                          ...(isAmoledDark && {
                            border: "1px solid #fff700",
                          }),
                        }}
                      >
                        {s.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </ModernCard>
            ))}
          </Box>
        </Box>
      </Box>
    )
  }

  // 1. Add this to the top-level App component, after setTasks:
  const toggleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const today = new Date().toISOString().slice(0, 10)
          let completedDates = Array.isArray(task.completedDates) ? [...task.completedDates] : []
          if (!task.completed) {
            // Mark as complete: add today if not already present
            if (!completedDates.includes(today)) completedDates.push(today)
          } else {
            // Mark as incomplete: remove today if present
            completedDates = completedDates.filter((d) => d !== today)
          }
          return {
            ...task,
            completed: !task.completed,
            completedDates,
          }
        }
        return task
      }),
    )
  }

  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeOfDay, setTimeOfDay] = useState("night")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now)
      const hour = now.getHours()
      if (hour >= 5 && hour < 11) setTimeOfDay("morning")
      else if (hour >= 11 && hour < 17) setTimeOfDay("day")
      else if (hour >= 17 && hour < 20) setTimeOfDay("evening")
      else setTimeOfDay("night")
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Add these to the App component's state (after other useState hooks)
  const [newBirthdayName, setNewBirthdayName] = useState("")
  const [newBirthdayDate, setNewBirthdayDate] = useState("")

  // Add this function to the App component
  const addBirthday = () => {
    if (newBirthdayName.trim() && newBirthdayDate) {
      const [, month, day] = newBirthdayDate.split("-")
      setBirthdays([...birthdays, { id: Date.now(), name: newBirthdayName.trim(), date: `${month}-${day}` }])
      setNewBirthdayName("")
      setNewBirthdayDate("")
    }
  }

  // New EventList Component for Day/Week views
  const EventList = ({ events, selectedDate, view, onEdit, onDelete }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark" || theme.palette.mode === "amoled-dark"

    const filteredEvents = events
      .filter((event) => {
        if (!event.startDateTime || !event.endDateTime) return false

        if (event.isRecurring) {
          // For recurring events, check if any instance falls within the selected period
          const eventStart = new Date(event.startDateTime)
          const eventEnd = new Date(event.endDateTime)

          if (view === "day") {
            if (event.recurrencePattern === "daily") return true
            if (event.recurrencePattern === "weekly" && eventStart.getDay() === selectedDate.getDay()) return true
            if (event.recurrencePattern === "monthly" && eventStart.getDate() === selectedDate.getDate()) return true
            if (
              event.recurrencePattern === "yearly" &&
              eventStart.getMonth() === selectedDate.getMonth() &&
              eventStart.getDate() === selectedDate.getDate()
            )
              return true
            return false
          } else if (view === "week") {
            const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
            const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
            if (event.recurrencePattern === "daily") return true
            if (
              event.recurrencePattern === "weekly" &&
              isWithinInterval(eventStart, { start: weekStart, end: weekEnd })
            )
              return true
            if (
              event.recurrencePattern === "monthly" &&
              isWithinInterval(eventStart, { start: weekStart, end: weekEnd })
            )
              return true
            if (
              event.recurrencePattern === "yearly" &&
              isWithinInterval(eventStart, { start: weekStart, end: weekEnd })
            )
              return true
            return false
          }
        }
        // For non-recurring events, check if they fall within the selected period
        if (view === "day") {
          return isSameDay(event.startDateTime, selectedDate)
        } else if (view === "week") {
          const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
          const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
          return (
            isWithinInterval(event.startDateTime, { start: weekStart, end: weekEnd }) ||
            isWithinInterval(event.endDateTime, { start: weekStart, end: weekEnd }) ||
            (event.startDateTime < weekStart && event.endDateTime > weekEnd)
          ) // Event spans across the week
        }
        return false
      })
      .sort((a, b) => a.startDateTime - b.startDateTime) // Sort by start time

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filteredEvents.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No events for this {view}.
          </Typography>
        ) : (
          filteredEvents.map((event) => (
            <Paper
              key={event.id}
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderRadius: 2,
                borderLeft: `8px solid ${event.colorCategory}`,
                background: isAmoledDark ? "#000" : isDark ? theme.palette.background.paper : theme.palette.background.paper,
                color: isAmoledDark ? "#fff" : isDark ? theme.palette.text.primary : theme.palette.text.primary,
                boxShadow: isAmoledDark 
                  ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
                  : `0 4px 12px ${event.colorCategory}33`,
                ...(isAmoledDark && {
                  border: "1px solid #fff700",
                }),
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: isAmoledDark ? "#fff" : isDark ? theme.palette.text.primary : theme.palette.text.primary }}
                >
                  {event.title}
                </Typography>
                <Box>
                  <IconButton onClick={() => onEdit(event)} size="small" aria-label="edit event">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(event.id)} size="small" color="error" aria-label="delete event">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {event.startDateTime && format(event.startDateTime, "MMM dd, yyyy hh:mm a")} -{" "}
                {event.endDateTime && format(event.endDateTime, "hh:mm a")}
              </Typography>
              {event.description && (
                <Typography
                  variant="body2"
                  sx={{ color: isAmoledDark ? "#b0b0b0" : isDark ? theme.palette.text.secondary : theme.palette.text.secondary }}
                >
                  {event.description}
                </Typography>
              )}
              {event.isRecurring && (
                <Chip
                  label={`Recurring: ${event.recurrencePattern}`}
                  size="small"
                  sx={{ 
                    bgcolor: isAmoledDark ? "rgba(255, 247, 0, 0.2)" : event.colorCategory + "33", 
                    color: isAmoledDark ? "#fff700" : event.colorCategory, 
                    fontWeight: "bold",
                    ...(isAmoledDark && {
                      border: "1px solid #fff700",
                    }),
                  }}
                />
              )}
              {event.hasReminder && event.reminderTime && (
                <Chip
                  label={`Reminder: ${format(event.reminderTime, "MMM dd, hh:mm a")}`}
                  size="small"
                  icon={<NotificationsIcon />}
                  sx={{
                    bgcolor: isAmoledDark 
                      ? "rgba(255, 247, 0, 0.2)" 
                      : isDark 
                        ? theme.palette.secondary.main + "33" 
                        : theme.palette.secondary.main,
                    color: isAmoledDark ? "#fff700" : isDark ? theme.palette.secondary.main : theme.palette.text.primary,
                    fontWeight: "bold",
                    ...(isAmoledDark && {
                      border: "1px solid #fff700",
                    }),
                  }}
                />
              )}
            </Paper>
          ))
        )}
      </Box>
    )
  }

  // New Event Form Dialog Component
  const EventFormDialog = ({ open, onClose, onSave, event }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDateTime, setStartDateTime] = useState(null)
    const [endDateTime, setEndDateTime] = useState(null)
    const [colorCategory, setColorCategory] = useState(EVENT_COLORS[0].value)
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurrencePattern, setRecurrencePattern] = useState("daily") // daily, weekly, monthly, yearly
    const [hasReminder, setHasReminder] = useState(false)
    const [reminderTime, setReminderTime] = useState(null) // Date object for reminder

    useEffect(() => {
      if (event) {
        setTitle(event.title || "")
        setDescription(event.description || "")
        setStartDateTime(event.startDateTime || null)
        setEndDateTime(event.endDateTime || null)
        setColorCategory(event.colorCategory || EVENT_COLORS[0].value)
        setIsRecurring(event.isRecurring || false)
        setRecurrencePattern(event.recurrencePattern || "daily")
        setHasReminder(event.hasReminder || false)
        setReminderTime(event.reminderTime || null)
      } else {
        // Reset for new event
        setTitle("")
        setDescription("")
        setStartDateTime(null)
        setEndDateTime(null)
        setColorCategory(EVENT_COLORS[0].value)
        setIsRecurring(false)
        setRecurrencePattern("daily")
        setHasReminder(false)
        setReminderTime(null)
      }
    }, [event])

    const handleSave = () => {
      if (!title || !startDateTime || !endDateTime) {
        alert("Title, Start Date/Time, and End Date/Time are required.")
        return
      }
      if (startDateTime && endDateTime && startDateTime > endDateTime) {
        alert("End Date/Time cannot be before Start Date/Time.")
        return
      }

      onSave({
        id: event ? event.id : Date.now(),
        title,
        description,
        startDateTime,
        endDateTime,
        colorCategory,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
        hasReminder: hasReminder,
        reminderTime: hasReminder ? reminderTime : null,
      })
      onClose()
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              p: 2, 
              minWidth: { xs: "90%", sm: 500 },
              background: theme.palette.mode === "amoled-dark" ? "#000" : theme.palette.background.paper,
              color: theme.palette.mode === "amoled-dark" ? "#fff" : theme.palette.text.primary,
              ...(theme.palette.mode === "amoled-dark" && {
                border: "2px solid #fff700",
                boxShadow: "0 0 20px 0 #fff70077, 0 0 6px 0 #fff700",
              }),
            } 
          }}
        >
          <DialogTitle sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            color: theme.palette.mode === "amoled-dark" ? "#fff" : theme.palette.text.primary,
            ...(theme.palette.mode === "amoled-dark" && {
              textShadow: "0 0 8px #fff, 0 0 2px #fff700",
            }),
          }}>
            <Typography variant="h6" fontWeight="bold">
              {event ? "Edit Event" : "Create New Event"}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              label="Event Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <DateTimePicker
              label="Start Date & Time"
              value={startDateTime}
              onChange={(newValue) => setStartDateTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" sx={{ borderRadius: 2 }} />}
            />
            <DateTimePicker
              label="End Date & Time"
              value={endDateTime}
              onChange={(newValue) => setEndDateTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" sx={{ borderRadius: 2 }} />}
            />
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
              <InputLabel>Category Color</InputLabel>
              <Select value={colorCategory} onChange={(e) => setColorCategory(e.target.value)} label="Category Color">
                {EVENT_COLORS.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: color.value,
                          border: "1px solid #ccc",
                        }}
                      />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />}
              label="Recurring Event"
            />
            {isRecurring && (
              <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                <InputLabel>Recurrence Pattern</InputLabel>
                <Select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  label="Recurrence Pattern"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            )}
            <FormControlLabel
              control={<Checkbox checked={hasReminder} onChange={(e) => setHasReminder(e.target.checked)} />}
              label="Set Reminder"
            />
            {hasReminder && (
              <DateTimePicker
                label="Reminder Date & Time"
                value={reminderTime}
                onChange={(newValue) => setReminderTime(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" sx={{ borderRadius: 2 }} />
                )}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, py: 1.5 }}>
              {event ? "Save Changes" : "Create Event"}
            </Button>
            <Button onClick={onClose} variant="outlined" color="primary" sx={{ borderRadius: 2, px: 3, py: 1.5 }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <RootBox>
        {/* Linux-style window bar above AppBar - Only show in Electron */}
        {window.electronAPI?.isElectron && (
          <Box
            sx={{
              width: "100%",
              height: 32,
              display: "flex",
              alignItems: "center",
              background: theme.palette.mode === "amoled-dark" 
                ? "#000" 
                : theme.palette.mode === "dark" 
                  ? "#232526" 
                  : "#e0e0e0",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottom: theme.palette.mode === "amoled-dark" 
                ? "2px solid #fff700" 
                : "1px solid #ccc",
              justifyContent: "flex-end",
              pr: 2,
              userSelect: "none",
              position: "fixed", // Make it fixed
              top: 0,
              left: 0,
              zIndex: 1301, // Above AppBar (MUI AppBar default zIndex is 1100)
              boxSizing: "border-box",
              ...(theme.palette.mode === "amoled-dark" && {
                boxShadow: "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700",
              }),
            }}
          >
            {/* Linux window controls */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#ff5f56",
                  borderRadius: "50%",
                  border: "1.5px solid #e0443e",
                  mr: 0.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "#ff4444", transform: "scale(1.1)" },
                }}
                onClick={() => {
                  if (window.electronAPI?.isElectron) window.electronAPI.windowControl("close")
                }}
                title="Close"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ display: "block" }}>
                  <line x1="2" y1="2" x2="10" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="10" y1="2" x2="2" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#ffbd2e",
                  borderRadius: "50%",
                  border: "1.5px solid #dea123",
                  mr: 0.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "#ffaa00", transform: "scale(1.1)" },
                }}
                onClick={() => {
                  if (window.electronAPI?.isElectron) window.electronAPI.windowControl("minimize")
                }}
                title="Minimize"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ display: "block" }}>
                  <line x1="2" y1="6" x2="10" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#27c93f",
                  borderRadius: "50%",
                  border: "1.5px solid #13a10e",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "#22aa33", transform: "scale(1.1)" },
                }}
                onClick={() => {
                  if (window.electronAPI?.isElectron) window.electronAPI.windowControl("maximize")
                }}
                title="Maximize"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ display: "block" }}>
                  <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" />
                </svg>
              </Box>
            </Box>
          </Box>
        )}

        {/* Header */}
        <AppBar
          position="static"
          sx={{
            boxShadow: "none",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: window.electronAPI?.isElectron ? "32px" : 0, // Add margin-top if control panel is present
            background: theme.palette.mode === "amoled-dark" ? "#000" : "transparent",
            ...(theme.palette.mode === "amoled-dark" && {
              borderBottom: "2px solid #fff700",
              boxShadow: "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700",
            }),
          }}
        >
          <Toolbar sx={{ justifyContent: "center", position: "relative", minHeight: 56 }}>
            {/* Remove the AppBar title */}
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <MainArea>
          <Sidebar className="sidebar-centered">
            <IconButton
              color={currentPage === "dashboard" ? "primary" : "action"}
              onClick={() => setCurrentPage("dashboard")}
              title="Dashboard 🏠"
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main + "11",
                },
                "&:hover": {
                  bgcolor: theme.palette.primary.main + "08",
                },
              }}
            >
              <DashboardIcon fontSize="large" />
            </IconButton>
            <IconButton
              color={currentPage === "tasks" ? "primary" : "action"}
              onClick={() => setCurrentPage("tasks")}
              title="Tasks 📝"
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main + "11",
                },
                "&:hover": {
                  bgcolor: theme.palette.primary.main + "08",
                },
              }}
            >
              <ListAltIcon fontSize="large" />
            </IconButton>
            <IconButton
              color={currentPage === "goals" ? "primary" : "action"}
              onClick={() => setCurrentPage("goals")}
              title="Goals 🎯"
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main + "11",
                },
                "&:hover": {
                  bgcolor: theme.palette.primary.main + "08",
                },
              }}
            >
              <AssignmentIcon fontSize="large" />
            </IconButton>
            <IconButton
              color={currentPage === "settings" ? "primary" : "action"}
              onClick={() => setCurrentPage("settings")}
              title="Settings ⚙️"
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main + "11",
                },
                "&:hover": {
                  bgcolor: theme.palette.primary.main + "08",
                },
              }}
            >
              <SettingsIcon fontSize="large" />
            </IconButton>
            <IconButton
              color={currentPage === "calendar" ? "primary" : "action"}
              onClick={() => setCurrentPage("calendar")}
              title="Calendar 📅"
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main + "11",
                },
                "&:hover": {
                  bgcolor: theme.palette.primary.main + "08",
                },
              }}
            >
              <CalendarIcon fontSize="large" />
            </IconButton>
          </Sidebar>
          <TopBar>
            {/* Centered KwestUp title absolutely */}
            <Typography
              variant="h5"
              component="div"
              className="topbar-title-centered"
              sx={{
                fontWeight: "bold",
                fontFamily: "Poppins, Inter, sans-serif",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                width: "max-content",
                textAlign: "center",
                color: theme.palette.text.primary,
              }}
            >
              KwestUp
            </Typography>
            {/* Right-side content */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
              </Typography>
              <IconButton color="primary">
                <NotificationsNoneIcon />
              </IconButton>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.primary.contrastText,
                  fontWeight: "bold",
                }}
              >
                <Typography variant="subtitle2">U</Typography>
              </Box>
            </Box>
          </TopBar>
          <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 4 }}>
            {currentPage === "dashboard" && (
              <>
                <GreetingCard
                  sx={{
                    background: theme.palette.mode === "amoled-dark" 
                      ? "#000" 
                      : timeOfDay === "morning"
                        ? "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)"
                        : timeOfDay === "day"
                          ? "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
                          : timeOfDay === "evening"
                            ? "linear-gradient(135deg, #f7971e 0%, #ffd200 60%, #fcb045 100%)"
                            : "radial-gradient(ellipse at 60% 40%, #23243a 60%, #181A20 100%)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: theme.palette.mode === "amoled-dark" 
                      ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
                      : "0 8px 40px 0 #0008",
                    border: theme.palette.mode === "amoled-dark" 
                      ? "2px solid #fff700" 
                      : "1.5px solid #2d2e4a",
                    color: theme.palette.mode === "amoled-dark" ? "#fff" : undefined,
                  }}
                >
                  {/* Decorative elements by time of day */}
                  <Box sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
                    {timeOfDay === "morning" && (
                      <>
                        {/* Sun */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "70%",
                            top: "10%",
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #fffde4 60%, #ffe680 100%)",
                            boxShadow: "0 0 60px 10px #ffe68088",
                            opacity: 0.9,
                          }}
                        />
                        {/* Clouds */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "20%",
                            top: "30%",
                            width: 60,
                            height: 30,
                            bgcolor: "#fff8",
                            borderRadius: "50%",
                            filter: "blur(1px)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: "35%",
                            top: "20%",
                            width: 40,
                            height: 20,
                            bgcolor: "#fff6",
                            borderRadius: "50%",
                            filter: "blur(1px)",
                          }}
                        />
                      </>
                    )}
                    {timeOfDay === "day" && (
                      <>
                        {/* Sun */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "80%",
                            top: "10%",
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #fffde4 60%, #ffe680 100%)",
                            boxShadow: "0 0 80px 20px #ffe68088",
                            opacity: 0.95,
                          }}
                        />
                        {/* Clouds */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "15%",
                            top: "25%",
                            width: 70,
                            height: 35,
                            bgcolor: "#fff8",
                            borderRadius: "50%",
                            filter: "blur(1px)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: "40%",
                            top: "18%",
                            width: 50,
                            height: 25,
                            bgcolor: "#fff6",
                            borderRadius: "50%",
                            filter: "blur(1px)",
                          }}
                        />
                      </>
                    )}
                    {timeOfDay === "evening" && (
                      <>
                        {/* Sunset */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "70%",
                            top: "60%",
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #ffd89b 60%, #f7971e 100%)",
                            boxShadow: "0 0 60px 10px #f7971e88",
                            opacity: 0.8,
                          }}
                        />
                        {/* Faint stars */}
                        {[...Array(8)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              position: "absolute",
                              left: `${Math.random() * 90 + 2}%`,
                              top: `${Math.random() * 90 + 2}%`,
                              width: "2px",
                              height: "2px",
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.18)",
                              boxShadow: "0 0 6px 1px #fff8",
                              opacity: 0.5,
                            }}
                          />
                        ))}
                      </>
                    )}
                    {timeOfDay === "night" && (
                      <>
                        {/* Stars, orbit, planet (existing night theme) */}
                        {[...Array(18)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              position: "absolute",
                              left: `${Math.random() * 90 + 2}%`,
                              top: `${Math.random() * 90 + 2}%`,
                              width: `${Math.random() * 2 + 1}px`,
                              height: `${Math.random() * 2 + 1}px`,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.18)",
                              boxShadow: "0 0 6px 1px #fff8",
                              opacity: 0.7,
                              animation: `twinkle${i % 3} 3s linear infinite, floatStar${i % 5} 8s ease-in-out infinite`,
                              animationDelay: `${i * 0.3}s`,
                            }}
                          />
                        ))}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "10%",
                            top: "60%",
                            width: "120px",
                            height: "40px",
                            border: "1.5px dashed #fff3",
                            borderRadius: "50%",
                            transform: "rotate(-20deg)",
                            opacity: 0.3,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: "5%",
                            top: "80%",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #f7b733 60%, #ffecb3 100%)",
                            boxShadow: "0 0 24px 4px #f7b73388",
                            opacity: 0.7,
                          }}
                        />
                        <style>{`
                          @keyframes floatStar0 { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
                          @keyframes floatStar1 { 0% { transform: translateY(0); } 50% { transform: translateY(8px); } 100% { transform: translateY(0); } }
                          @keyframes floatStar2 { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
                          @keyframes floatStar3 { 0% { transform: translateY(0); } 50% { transform: translateY(12px); } 100% { transform: translateY(0); } }
                          @keyframes floatStar4 { 0% { transform: translateY(0); } 50% { transform: translateY(-14px); } 100% { transform: translateY(0); } }
                          @keyframes twinkle0 { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
                          @keyframes twinkle1 { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.3; } }
                          @keyframes twinkle2 { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.9; } }
                        `}</style>
                      </>
                    )}
                  </Box>
                  {/* Glassy text area */}
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      backdropFilter: "blur(8px)",
                      background: "rgba(30, 34, 60, 0.55)",
                      borderRadius: 6,
                      boxShadow: "0 2px 16px 0 #0004",
                      p: { xs: 2, md: 4 },
                      m: { xs: 1, md: 2 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        fontFamily: "Poppins, Inter, sans-serif",
                        color: "#fff",
                        textShadow: "0 0 12px #00ffb3, 0 0 4px #00bfff",
                        ...(theme.palette.mode === "amoled-dark"
                          ? {
                              textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                              color: "#fff",
                            }
                          : {}),
                      }}
                    >
                      Welcome, {userName || "there"}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="#b3c6ff"
                      gutterBottom
                      sx={{ fontFamily: "Poppins, Inter, sans-serif", fontWeight: 400 }}
                    >
                      {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setCurrentPage("tasks")}
                        startIcon={
                          <span role="img" aria-label="rocket">
                            🚀
                          </span>
                        }
                        sx={{ fontWeight: "bold", borderRadius: 3 }}
                      >
                        Manage Tasks
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => setCurrentPage("goals")}
                        startIcon={
                          <span role="img" aria-label="target">
                            🎯
                          </span>
                        }
                        sx={{ fontWeight: "bold", borderRadius: 3 }}
                      >
                        Set New Goals
                      </Button>
                    </Box>
                  </Box>
                </GreetingCard>
                <KanbanBoard onToggleTaskComplete={toggleTaskComplete} />
              </>
            )}
            {currentPage === "tasks" && <GeneralTasks />}
            {currentPage === "goals" && <DailyTasks />}
            {currentPage === "settings" && <SettingsPage />}
            {currentPage === "calendar" && (
              <Box
                sx={{
                  p: { xs: 0, md: 0 },
                  maxWidth: "100vw",
                  width: "100%",
                  minHeight: "calc(100vh - 64px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  background: theme.palette.background.default,
                  boxShadow: "none",
                  m: 0,
                  mt: 0,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    mt: 4,
                    mb: 2,
                    textShadow: "0 0 8px #00ffb3, 0 0 2px #00bfff",
                    ...(theme.palette.mode === "amoled-dark"
                      ? {
                          textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                          color: "#fff",
                        }
                      : {}),
                  }}
                >
                  Calendar
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 900,
                    mx: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
                    <Button
                      variant={calendarView === "month" ? "contained" : "outlined"}
                      onClick={() => setCalendarView("month")}
                    >
                      Month
                    </Button>
                    <Button
                      variant={calendarView === "week" ? "contained" : "outlined"}
                      onClick={() => setCalendarView("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={calendarView === "day" ? "contained" : "outlined"}
                      onClick={() => setCalendarView("day")}
                    >
                      Day
                    </Button>
                  </Box>

                  {calendarView === "month" && (
                    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", flex: 1 }}>
                      <Calendar
                        value={selectedCalendarDate}
                        onChange={setSelectedCalendarDate}
                        tileContent={({ date, view }) => {
                          if (view === "month") {
                            const dayEvents = events.filter((event) => {
                              if (event.isRecurring) {
                                // Simplified recurring event check
                                const eventStart = new Date(event.startDateTime)
                                if (event.recurrencePattern === "daily") return true
                                if (event.recurrencePattern === "weekly" && eventStart.getDay() === date.getDay())
                                  return true
                                if (event.recurrencePattern === "monthly" && eventStart.getDate() === date.getDate())
                                  return true
                                if (
                                  event.recurrencePattern === "yearly" &&
                                  eventStart.getMonth() === date.getMonth() &&
                                  eventStart.getDate() === date.getDate()
                                )
                                  return true
                                return false
                              }
                              return isSameDay(event.startDateTime, date)
                            })
                            return (
                              <Box
                                sx={{ display: "flex", justifyContent: "center", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}
                              >
                                {dayEvents.map((event, index) => (
                                  <span
                                    key={index}
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: event.colorCategory,
                                      display: "inline-block",
                                    }}
                                  />
                                ))}
                              </Box>
                            )
                          }
                          return null
                        }}
                        onClickDay={(date) => {
                          setSelectedCalendarDate(date)
                          setCalendarView("day") // Switch to day view when a day is clicked
                        }}
                        prev2Label={null}
                        next2Label={null}
                        tileClassName={({ date, view }) => {
                          const todayStr = new Date().toISOString().slice(0, 10)
                          const dateStr = date.toISOString().slice(0, 10)
                          return dateStr === todayStr ? "react-calendar__tile--active" : ""
                        }}
                      />
                    </Box>
                  )}

                  {(calendarView === "week" || calendarView === "day") && (
                    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", flex: 1, mt: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <IconButton
                          onClick={() =>
                            setSelectedCalendarDate(addDays(selectedCalendarDate, calendarView === "day" ? -1 : -7))
                          }
                        >
                          <ArrowBackIosNewIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">
                          {calendarView === "day"
                            ? format(selectedCalendarDate, "PPP")
                            : `${format(startOfWeek(selectedCalendarDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(selectedCalendarDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            setSelectedCalendarDate(addDays(selectedCalendarDate, calendarView === "day" ? 1 : 7))
                          }
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setEditingEvent(null)
                          setShowEventDialog(true)
                        }}
                        startIcon={<AddIcon />}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        Add New Event
                      </Button>
                      <EventList
                        events={events}
                        selectedDate={selectedCalendarDate}
                        view={calendarView}
                        onEdit={(event) => {
                          setEditingEvent(event)
                          setShowEventDialog(true)
                        }}
                        onDelete={(id) => {
                          showModal(
                            "Are you sure you want to delete this event?",
                            () => setEvents(events.filter((e) => e.id !== id)),
                            () => closeModal(),
                          )
                        }}
                      />
                    </Box>
                  )}

                  {/* Birthday section as a separate card below calendar */}
                  <Box
                    sx={{
                      mt: 4,
                      mb: 4,
                      p: 2,
                      borderRadius: 3,
                      width: "100%",
                      maxWidth: 900,
                      bgcolor: theme.palette.background.paper,
                      ...(theme.palette.mode === "amoled-dark"
                        ? {
                            border: "1.5px solid #fff700",
                            boxShadow: "0 0 16px 0 #fff70055, 0 0 4px 0 #fff",
                          }
                        : {}),
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        ...(theme.palette.mode === "amoled-dark"
                          ? {
                              textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                              color: "#fff",
                            }
                          : {}),
                      }}
                    >
                      Add Birthday
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}
                    >
                      <TextField
                        fullWidth
                        label="Person's Name"
                        variant="outlined"
                        value={newBirthdayName}
                        onChange={(e) => setNewBirthdayName(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          ...(theme.palette.mode === "amoled-dark"
                            ? {
                                textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                                color: "#fff",
                              }
                            : {}),
                        }}
                      />
                      <TextField
                        fullWidth
                        type="date"
                        label="Birthday Date"
                        variant="outlined"
                        value={newBirthdayDate}
                        onChange={(e) => setNewBirthdayDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          borderRadius: 2,
                          ...(theme.palette.mode === "amoled-dark"
                            ? {
                                textShadow: "0 0 8px #fff, 0 0 2px #fff700",
                                color: "#fff",
                              }
                            : {}),
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={addBirthday}
                        startIcon={<AddIcon />}
                        sx={{ p: 1.5, borderRadius: 2, minWidth: { xs: "100%", sm: "auto" } }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          {/* Right column with notification and activity tracker */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            <NotificationPanel>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📢 Notifications
              </Typography>
              {tasks.filter((task) => task.date && !task.completed && new Date(task.date) <= new Date()).length ===
              0 ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h4">🎉</Typography>
                  <Typography variant="body2" color="text.secondary">
                    All caught up! No notifications.
                  </Typography>
                </Box>
              ) : (
                tasks
                  .filter((task) => task.date && !task.completed && new Date(task.date) <= new Date())
                  .map((task) => (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : "yellow.100",
                        borderRadius: 2,
                      }}
                      key={task.id}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h5">⚠️</Typography>
                        <Typography variant="body2">Task "{task.name}" is due!</Typography>
                      </Box>
                    </Paper>
                  ))
              )}
            </NotificationPanel>
            {/* Activity/Task Tracker below NotificationPanel */}
            <Box
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                transition: "box-shadow 0.3s, transform 0.2s",
                ...(theme.palette.mode === "amoled-dark"
                  ? {
                      border: "1.5px solid #fff700",
                      boxShadow: "0 0 16px 0 #fff70055, 0 0 4px 0 #fff",
                    }
                  : {}),
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                📈 Activity Tracker
              </Typography>

              {/* Animated Graph */}
              <Box sx={{ width: "100%", height: 120, position: "relative", mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  Task Completion Trend (7 days)
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 80,
                    position: "relative",
                    background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Grid lines */}
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: `${(i + 1) * 20}px`,
                        height: "1px",
                        background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}

                  {/* Animated line graph */}
                  <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#81C784" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Area fill */}
                    <path
                      d={(() => {
                        // Calculate completed tasks per day for last 7 days
                        const data = Array.from({ length: 7 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() - (6 - i))
                          const dateStr = date.toISOString().slice(0, 10)
                          return tasks.filter(
                            (t) => Array.isArray(t.completedDates) && t.completedDates.includes(dateStr),
                          ).length
                        })
                        const width = 280
                        const height = 80
                        const maxVal = Math.max(1, ...data)
                        const stepX = width / 6
                        let pathData = `M 0 ${height - (data[0] / maxVal) * height}`
                        data.forEach((value, i) => {
                          const x = i * stepX
                          const y = height - (value / maxVal) * height
                          pathData += ` L ${x} ${y}`
                        })
                        pathData += ` L ${width} ${height} L 0 ${height} Z`
                        return pathData
                      })()}
                      fill="url(#lineGradient)"
                      opacity="0.3"
                      style={{ animation: "fadeIn 1s ease-out" }}
                    />

                    {/* Line */}
                    <path
                      d={(() => {
                        const data = Array.from({ length: 7 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() - (6 - i))
                          const dateStr = date.toISOString().slice(0, 10)
                          return tasks.filter(
                            (t) => Array.isArray(t.completedDates) && t.completedDates.includes(dateStr),
                          ).length
                        })
                        const width = 280
                        const height = 80
                        const maxVal = Math.max(1, ...data)
                        const stepX = width / 6
                        let pathData = `M 0 ${height - (data[0] / maxVal) * height}`
                        data.forEach((value, i) => {
                          const x = i * stepX
                          const y = height - (value / maxVal) * height
                          pathData += ` L ${x} ${y}`
                        })
                        return pathData
                      })()}
                      stroke="#4CAF50"
                      strokeWidth="3"
                      fill="none"
                      filter="url(#glow)"
                      style={{ animation: "drawLine 1.5s ease-out" }}
                    />

                    {/* Data points */}
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (6 - i))
                      const dateStr = date.toISOString().slice(0, 10)
                      const value = tasks.filter(
                        (t) => Array.isArray(t.completedDates) && t.completedDates.includes(dateStr),
                      ).length
                      const width = 280
                      const height = 80
                      const maxVal = Math.max(
                        1,
                        ...Array.from({ length: 7 }, (_, j) => {
                          const d = new Date()
                          d.setDate(d.getDate() - (6 - j))
                          const dStr = d.toISOString().slice(0, 10)
                          return tasks.filter((t) => Array.isArray(t.completedDates) && t.completedDates.includes(dStr))
                            .length
                        }),
                      )
                      const stepX = width / 6
                      const x = i * stepX
                      const y = height - (value / maxVal) * height
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#4CAF50"
                          stroke="#fff"
                          strokeWidth="2"
                          style={{ animation: `pulseDot 2s ease-out ${i * 0.2}s` }}
                        />
                      )
                    })}
                  </svg>

                  {/* Day labels */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -20,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (6 - i))
                      return (
                        <span key={i} style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s` }}>
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )
                    })}
                  </Box>
                </Box>
              </Box>

              {/* General Tasks Progress Bar */}
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  General Tasks Completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={tasks.length === 0 ? 0 : (tasks.filter((t) => t.completed).length / tasks.length) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    mt: 0.5,
                    background: theme.palette.mode === "dark" ? "#181A20" : "#e3e3e3",
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ float: "right", mt: 0.5 }}>
                  {tasks.filter((t) => t.completed).length} / {tasks.length}
                </Typography>
              </Box>
              {/* Daily Tasks Streak/Checklist */}
              <Box sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  Daily Task Streak
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  {/* Simple streak: count consecutive days with all daily tasks completed */}
                  {(() => {
                    // Calculate streak (consecutive days all daily tasks completed)
                    const today = new Date()
                    let streak = 0
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today)
                      date.setDate(today.getDate() - i)
                      const dateStr = date.toISOString().slice(0, 10)
                      const allDone =
                        dailyTasks.length > 0 && dailyTasks.every((task) => task.lastCompletedDate === dateStr)
                      if (allDone) streak++
                      else break
                    }
                    // Render 7-day streak as colored circles
                    return Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date(today)
                      date.setDate(today.getDate() - (6 - i))
                      const dateStr = date.toISOString().slice(0, 10)
                      const allDone =
                        dailyTasks.length > 0 && dailyTasks.every((task) => task.lastCompletedDate === dateStr)
                      return (
                        <Box
                          key={i}
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            bgcolor: allDone ? "success.main" : "grey.400",
                            border: allDone ? "2px solid #43a047" : "2px solid #bbb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: "#fff",
                          }}
                        >
                          {allDone ? "✓" : ""}
                        </Box>
                      )
                    })
                  })()}
                  <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                    {(() => {
                      // Calculate streak (consecutive days all daily tasks completed)
                      const today = new Date()
                      let streak = 0
                      for (let i = 0; i < 7; i++) {
                        const date = new Date(today)
                        date.setDate(today.getDate() - i)
                        const dateStr = date.toISOString().slice(0, 10)
                        const allDone =
                          dailyTasks.length > 0 && dailyTasks.every((task) => task.lastCompletedDate === dateStr)
                        if (allDone) streak++
                        else break
                      }
                      return streak > 0 ? `${streak} day streak!` : ""
                    })()}
                  </Typography>
                </Box>
              </Box>

              {/* CSS Animations */}
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes drawLine {
                  from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
                  to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
                }
                @keyframes pulseDot {
                  0% { transform: scale(0); opacity: 0; }
                  50% { transform: scale(1.2); opacity: 1; }
                  100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowAmoled {
                  0% { box-shadow: 0 0 32px #00ffb355, 0 0 8px #00bfff55; }
                  100% { box-shadow: 0 0 64px #00ffb399, 0 0 24px #00bfff99; }
                }
              `}</style>
            </Box>
          </Box>
        </MainArea>

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
          onExitAttempt={() =>
            showModal(
              "You are currently in a focus session. Exiting now will disrupt your focus. Are you sure you want to stop?",
              () => {
                setIsTimerRunning(false)
                setShowTimerLockout(false)
                setTimerRemaining(timerDuration) // Reset timer on forced exit
              },
              () => closeModal(), // Cancel action for this specific modal
            )
          }
        />

        {/* Name Modal */}
        <Dialog open={showNameModal} disableEscapeKeyDown disableBackdropClick>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              What's your name?
            </Typography>
            <TextField
              autoFocus
              fullWidth
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit()
              }}
              label="Your Name"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNameSubmit} variant="contained" disabled={!tempName.trim()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Event Form Dialog */}
        <EventFormDialog
          open={showEventDialog}
          onClose={() => setShowEventDialog(false)}
          onSave={(newEvent) => {
            if (editingEvent) {
              setEvents(events.map((e) => (e.id === newEvent.id ? newEvent : e)))
            } else {
              setEvents([...events, newEvent])
            }
            setEditingEvent(null)
          }}
          event={editingEvent}
        />
      </RootBox>
      <style>{`
        /* Custom styles for react-calendar */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background-color: ${theme.palette.background.paper};
          border: ${theme.palette.mode === "amoled-dark" ? "2px solid #fff700" : `1px solid ${theme.palette.divider}`};
          border-radius: 16px;
          font-family: 'Inter', sans-serif;
          line-height: 1.125em;
          box-shadow: ${theme.palette.mode === "amoled-dark" 
            ? "0 0 16px 0 #fff70055, 0 0 4px 0 #fff700" 
            : "0 8px 32px rgba(0,0,0,0.1)"};
          padding: 16px;
        }

        .react-calendar--doubleView {
          width: 700px;
        }

        .react-calendar--doubleView .react-calendar__viewContainer {
          display: flex;
          margin: -0.5em;
        }

        .react-calendar--doubleView .react-calendar__viewContainer > * {
          margin: 0.5em;
          width: 50%;
        }

        .react-calendar,
        .react-calendar *,
        .react-calendar *:before,
        .react-calendar *:after {
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }

        .react-calendar button {
          margin: 0;
          border: 0;
          outline: none;
          color: ${theme.palette.text.primary};
        }

        .react-calendar button:enabled:hover {
          cursor: pointer;
          background-color: ${theme.palette.mode === "amoled-dark" 
            ? "rgba(255, 247, 0, 0.1)" 
            : theme.palette.action.hover};
        }

        .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1.2em;
          font-weight: bold;
          color: ${theme.palette.text.primary};
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: ${theme.palette.mode === "amoled-dark" 
            ? "rgba(255, 247, 0, 0.1)" 
            : theme.palette.action.hover};
        }

        .react-calendar__navigation button[disabled] {
          background-color: ${theme.palette.action.disabledBackground};
          color: ${theme.palette.action.disabled};
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: ${theme.palette.text.secondary};
        }

        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__month-view__days__day--weekend {
          color: ${theme.palette.error.main};
        }

        .react-calendar__tile {
          max-width: 100%;
          text-align: center;
          padding: 0.7em 0.5em;
          background: none;
          border-radius: 8px;
          transition: background-color 0.2s;
          position: relative;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: ${theme.palette.mode === "amoled-dark" 
            ? "rgba(255, 247, 0, 0.1)" 
            : theme.palette.action.hover};
        }

        .react-calendar__tile--now {
          background: ${theme.palette.primary.light}33;
          border: 1px solid ${theme.palette.primary.main};
          font-weight: bold;
        }

        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: ${theme.palette.mode === "amoled-dark" 
            ? "rgba(255, 247, 0, 0.2)" 
            : `${theme.palette.primary.main}55`};
        }

        .react-calendar__tile--active {
          background: ${theme.palette.primary.main};
          color: ${theme.palette.primary.contrastText};
          border-radius: 8px;
        }

        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: ${theme.palette.primary.dark};
        }

        .react-calendar__tile--range {
          background: ${theme.palette.primary.light}55;
          color: ${theme.palette.text.primary};
          border-radius: 0;
        }

        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          border-radius: 8px;
        }

        .react-calendar__tile--hasActive {
          background: ${theme.palette.primary.light}55;
        }

        .react-calendar__year-view .react-calendar__tile,
        .react-calendar__decade-view .react-calendar__tile,
        .react-calendar__century-view .react-calendar__tile {
          padding: 2em 0.5em;
        }
      `}</style>
    </ThemeProvider>
  )
}

export default App
