// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/cross-legged-pwa/service-worker.js', { scope: '/cross-legged-pwa/' }) // ADJUST SCOPE HERE!
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ************************
// --- GLOBAL CONSTANTS ---
// ************************

// Ensure PROGRAM_START_DATE is defined before any function that uses it
const PROGRAM_START_DATE = new Date('2025-07-20T00:00:00Z'); // Adjust to your actual program start, ensure ISO format for consistency
const WEEK_LENGTH = 7; // Days in a week

// Define a default weekly routine pattern (0=Sun, 1=Mon, ..., 6=Sat) - currently unused but kept for context
const DEFAULT_WEEKLY_ROUTINE_PATTERN = [1, 3, 5];

// **********************
// --- EXERCISE DATA ---
// **********************

// Exercise Data
const exercises = {
    'Butterfly Stretch': 'Hold for 30-60 seconds, 2-3 repetitions. Focus: Inner thighs, hip external rotation.',
    'Figure Four Stretch': 'Hold for 30-60 seconds, 2-3 repetitions each side. Focus: Hip external rotation (glutes, piriformis).',
    'Low Lunge': 'Hold for 30-60 seconds, 2-3 repetitions each side. Focus: Hip flexor flexibility.',
    'Clamshells': '10-15 repetitions, 2-3 sets each side. Focus: Hip abductors, external rotators.',
    'Glute Bridges': '10-15 repetitions, 2-3 sets. Focus: Glutes and core.',
    'Seated Forward Fold': 'Hold for 30-60 seconds, 2-3 repetitions. Focus: Hamstrings, lower back.',
    'Frog Pose': '*Cautiously* hold for 30-60 seconds, 2-3 repetitions. Focus: Deep inner thigh stretch. Go slowly!',
    'Side-Lying Leg Lifts': '10-15 repetitions, 2-3 sets each side. Focus: Hip abductors.'
};

// Back Exercise Data
const backExercises = [
     {
        name: 'Assisted Trunk Rotation',
        reps: '2 sets of 10',
        instructions: 'Sit on a chair with your back in neutral position (slightly arched) and your chin tucked in. Turn your upper body to one side moving at the middle back. Increase the stretch by pulling yourself with the back of the chair. Return to the initial position and repeat.',
        type: 'Stretch'
    },
    {
        name: 'Active Trunk Rotation',
        reps: '2 sets of 10',
        instructions: 'Stand with a wall to your side, feet hip width apart, and your hands up in front of you. Turn your trunk 90 degrees, keeping your feet facing forward, and have your upper body facing the wall at the end of the rotation. Place your hands on a wall to help increase the rotation and slowly return to the initial position.',
        type: 'Stretch'
    },
    {
        name: 'Hamstring Stretch',
        reps: '2 sets of 10',
        instructions: 'Stand with one foot on a stool in front of you. Straighten your leg and stick your buttock out to arch your lower back. Lean your body forward until you feel a stretch behind your thigh. Maintain the stretch for the recommended time.',
        type: 'Stretch'
    },
    {
        name: 'Standing Calf Stretch On Wall',
        reps: '2 sets of 10',
        instructions: 'Put the leg to be stretched behind with the heel on the floor and toes pointing directly forward. Place both hands on the wall and extend the rear knee while pushing the hips forward without bending the back knee until you feel a stretch in your back calf. Hold the stretching position.',
        type: 'Stretch'
    },
    {
        name: 'Standing Soleus Stretch',
        reps: '2 sets of 10',
        instructions: 'Stand and place both hands on a wall, with your feet about half a meter from the wall. Place one leg behind the other and slowly bend the knees while keeping the heels on the floor until you feel a stretch in the calf of the back leg. Maintain the stretch and relax.',
        type: 'Stretch'
    },
    {
        name: 'Prone Hip Extension',
        reps: '2 sets of 10',
        instructions: 'Lie on your stomach on the floor and place your hands underneath your forehead. Keeping your knee straight, raise the leg off the floor and hold for the recommended time. Slowly lower and repeat.',
        type: 'Strength'
    },
    {
        name: 'Hip Extension',
        reps: '2 sets of 10',
        instructions: 'Lie face down while bending one knee as much as you can. Tighten your abdominals to keep the spine and pelvis neutral. Contract your buttocks to lift the leg off the ground without moving the pelvis. Hold a few moments and repeat on the other side.',
        type: 'Strength'
    },
    {
        name: 'Contralateral Extension',
        reps: '2 sets of 10',
        instructions: 'Lie on your stomach with your chin tucked in and your arms and legs stretched out making your body as long as possible. Activate your lower abdominals (transversus abdomini) by bringing your belly button inward and by activating your pelvic floor muscles (inner thigh) 20 to 30% of a maximal contraction. Maintain a steady abdominal breathing while you lift one arm and opposite leg up towards the ceiling keeping your chin tucked in. Return and repeat with the other arm and opposite leg.',
        type: 'Strength'
    },
    {
        name: 'Spine Extension',
        reps: '2 sets of 10',
        instructions: 'Lay down on your stomach with your hands together behind your back and your arms straight. Lift your head and trunk as high as possible, while pulling your shoulders back and tucking your chin. Hold for a few seconds. Then exhale while lowering your chest down on the floor. Repeat.',
        type: 'Strength'
    },
    {
        name: 'Glute Bridge With Ball Squeeze',
        reps: '2 sets of 10',
        instructions: 'Lay down on your back with your knees bent and a ball or pillow between them. Squeeze the glutes and contract the abdominals to lift the hips off the ground. As you lift, squeeze the ball between the legs. Hold for a few seconds on top, then release as you lower.',
        type: 'Strength'
    }
];
 

// Define the 8-week routine (Days are 0-indexed: Monday=0, Tuesday=1...Sunday=6)
// A null entry means no specific exercises planned for that day, giving you rest or free practice.
// Routine is for 3-4 times a week, so some days will be empty.
const routine = [
    // Week 1 (Overall Index 0) - Weeks 1-2
    {weekLabel: "Week 1", days: [
        { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 2 (Overall Index 1) - Weeks 1-2
    {weekLabel: "Week 2", days: [
        { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges']
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 3 (Overall Index 2) - Weeks 3-4
    {weekLabel: "Week 3", days: [
       { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 4 (Overall Index 3) - Weeks 3-4
    {weekLabel: "Week 4", days: [
      { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 5 (Overall Index 4) - Weeks 5-6
    {weekLabel: "Week 5", days: [
       { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 6 (Overall Index 5) - Weeks 5-6
    {weekLabel: "Week 6", days: [
       { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 7 (Overall Index 6) - Weeks 7-8
    {weekLabel: "Week 7", days: [
       { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 5
        null  // Day 6
    ]},
    // Week 8 (Overall Index 7) - Weeks 7-8
    {weekLabel: "Week 8", days: [
        { // Day 0 - Monday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 1 - Tuesday
        { // Day 2 - Wednesday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 3
        { // Day 4 - Friday        
            warmup: ["High Knees (30 seconds)",
                    "Leg Swings (Side-to-Side, 10 per leg)",
                    "Leg Swings (Front-to-Back, 10 per leg)",
                    "Deep Squat (hold 30 seconds)",
                    "Hip Circles (5 per direction, each hip)"
            ],
            exercises:['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        }, 
        null, // Day 5
        null  // Day 6
    ]}
    ];

const PROGRAM_WEEKS = routine.length; // Total weeks in the program - needs to come after routine
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// --- Global State Variables ---
let isShowingScheduledDay = false; // Flag to tell loadDailyRoutine what to display
let selectedScheduleWeekIndex = 0; // Stores the week index of the clicked schedule day
let selectedScheduleDayIndex = 0; // Stores the day index (routine-aligned) of the clicked schedule day
let currentDisplayWeek = 0; // 0-indexed for schedule week navigation


// DOM Elements
// --- DOM Elements (Declared globally, assigned in DOMContentLoaded) ---
let dateDisplay;
let currentWeekDisplay;
let currentDayOfWeekDisplay;
let exerciseList;
let dailyProgressBarContainer;
let dailyProgressBar;
let dailyProgressText;
let summaryContent;
let resetWeekButton;
let weekScheduleContent; // Assuming you have this for the schedule section
let dailyNotesTextarea;
let saveNotesBtn;
let backExercisesList; // For back exercises list container
let dailyNotesSection;

// *************************
// --- Helper Functions ---
// *************************

// Get the date for the header
function displayCurrentDate() {
    // Current date and day of the week
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options); // 'undefined' uses user's locale

    // Update the date display element
    if (dateDisplay) { // Check if the element was found
        dateDisplay.textContent = formattedDate;
    }
}

// Helper to get days since program start
function getDaysSinceProgramStart() {
    const today = new Date();
    // Normalize both dates to UTC midnight for accurate day difference
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const programStartUtc = Date.UTC(PROGRAM_START_DATE.getFullYear(), PROGRAM_START_DATE.getMonth(), PROGRAM_START_DATE.getDate());
    
    const diffTime = Math.abs(todayUtc - programStartUtc);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// In getDaysSinceProgramStart() function:
console.log('Value of PROGRAM_START_DATE in getDaysSinceProgramStart:', PROGRAM_START_DATE);
// ...
console.log('Days since program start (calculated):', diffDays);

// In loadDailyRoutine() function, after currentDayData is assigned:
console.log('Retrieved currentDayData:', currentDayData);

/**
 * Gets the current week number (0-indexed from the start date) and day of the week.
 * Stores the start date in localStorage if not present or invalid.
 * @returns {object} { week: number, dayOfWeek: number (0=Mon, 6=Sun), totalWeeks: number, isRoutineFinished: boolean }
 */
function getCurrentRoutineProgress() {
    const diffDays = getDaysSinceProgramStart();
    const currentWeekIndex = Math.floor(diffDays / WEEK_LENGTH);
    
    // JavaScript getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    // Your 'routine.days' array has Monday at index 0.
    let currentDayOfWeek = new Date().getDay(); 

    // Convert JS's standard day index to your routine's 0-indexed Monday system
    if (currentDayOfWeek === 0) { // If today is Sunday (JS index 0)
        currentDayOfWeek = 6; // Map to index 6 in your routine.days array (where Sunday's data would be)
    } else {
        currentDayOfWeek--; // Shift Monday (1) to 0, Tuesday (2) to 1, etc.
    }

    return {
        week: currentWeekIndex % PROGRAM_WEEKS, // Ensure week loops within your defined routine weeks
        day: currentDayOfWeek // This is the routine-aligned day index (0=Mon, 1=Tue, ..., 6=Sun)
    };
}

/**
 * Gets saved progress for a specific day from localStorage.
 * @param {string} dateKey - YYYY-MM-DD string.
 * @returns {Array<string>} List of completed exercise names.
 */
function getDailyProgress(dateKey) {
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    return progress[dateKey] || [];
}

/**
 * Saves/updates progress for a specific exercise on the current day.
 * @param {string} dateKey - The date string (e.g., 'YYYY-MM-DD') for which to save progress.
 * @param {string} exerciseName - Name of the exercise.
 * @param {boolean} isCompleted - True if completed, false if unchecked.
 */
function toggleExerciseComplete(dateKey, exerciseName, isCompleted) { 
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    let dailyCompleted = progress[dateKey] || []; // Use the passed-in dateKey

    if (isCompleted && !dailyCompleted.includes(exerciseName)) {
        dailyCompleted.push(exerciseName);
    } else if (!isCompleted) {
        dailyCompleted = dailyCompleted.filter(name => name !== exerciseName);
    }

    progress[dateKey] = dailyCompleted;
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
}

/**
 * Loads notes for the current day from localStorage.
 * @param {string} dateKey - The date key (e.g., 'YYYY-MM-DD').
 * @returns {string} The saved notes, or an empty string if none exist.
 */
function loadDailyNotes(dateKey) {
    return localStorage.getItem(`notes_${dateKey}`) || '';
}

/**
 * Saves notes for the current day to localStorage.
 * @param {string} dateKey - The date key (e.g., 'YYYY-MM-DD').
 * @param {string} notes - The notes to save.
 */
function saveDailyNotes(dateKey, notes) {
    localStorage.setItem(`notes_${dateKey}`, notes);
}


// *******************************
// ---- CORE LOGIC FUNCTIONS ----
// *******************************

// Load Daily Routine
// This loads the Today tab

function loadDailyRoutine() {
    // Ensure DOM elements are defined before accessing them
    if (!exerciseList || !currentWeekDisplay || !currentDayOfWeekDisplay || !dailyProgressBarContainer || !dailyNotesSection) {
        console.error("DOM elements not fully initialized for loadDailyRoutine.");
        return; // Exit if elements are missing
    }

    let weekIndexToLoad;
    let routineDayIndexToLoad; // This will hold the 0-indexed Monday day for routine lookup
    let displayDayName;       // This will hold the actual day name for the header (e.g., "Monday", "Sunday")
    let displayWeekNumber;    // For "Week X" in the header

    // Determine which day's routine to load: today's or a scheduled day's
    if (isShowingScheduledDay) {
        // If coming from schedule click, use the stored global indices
        weekIndexToLoad = selectedScheduleWeekIndex;
        routineDayIndexToLoad = selectedScheduleDayIndex; // This is already routine-aligned (Mon=0)
    } else {
        // If loading for "Today" tab directly or returning to it, get current progress
        const { week, day } = getCurrentRoutineProgress(); // 'day' here is already routine-aligned (Mon=0)
        weekIndexToLoad = week;
        routineDayIndexToLoad = day;
    }
    
    // Calculate display values based on the *determined* indices
    displayWeekNumber = weekIndexToLoad + 1;
    // Convert routine-aligned day index back to the standard dayNames index (0=Sun, 1=Mon...) for display
    displayDayName = dayNames[routineDayIndexToLoad === 6 ? 0 : routineDayIndexToLoad + 1];

    // Update the display elements based on what is being LOADED/DISPLAYED
    currentWeekDisplay.textContent = `Week ${displayWeekNumber}`;
    currentDayOfWeekDisplay.textContent = displayDayName;

    // Fetch the routine data using the CORRECTLY DETERMINED routine-aligned indices
    const currentDayData = routine[weekIndexToLoad]?.days?.[routineDayIndexToLoad];
    
    // The key for saving progress/notes is always based on *actual today's date*,
    // because you only complete exercises *today*, regardless of what day you're viewing.
    const todayKey = new Date().toISOString().split('T')[0];

    // HTML rendering
    let htmlContent = '';

    // Check if there's any valid routine data for this day to display
    if (!currentDayData || (currentDayData.warmup?.length === 0 && currentDayData.exercises?.length === 0)) {
        exerciseList.innerHTML = '<p>No specific routine defined for this day. Enjoy your day!</p>';
        dailyProgressContainer.style.display = 'none'; // Hide progress bar
        dailyNotesSection.style.display = 'block'; // Keep notes section visible even if no workout
        if (dailyNotesTextarea) {
             dailyNotesTextarea.value = loadDailyNotes(todayKey); // Load notes
        }
        return; // Exit function if no routine
    }

    // If there's a routine, ensure containers are visible
    dailyProgressContainer.style.display = 'block';
    dailyNotesSection.style.display = 'block';
    
    // Display Warm-up Exercises
    if (currentDayData.warmup && currentDayData.warmup.length > 0) {
        htmlContent += '<div class="warmup-section">';
        htmlContent += '<h3>Warmup</h3><ul>';
        currentDayData.warmup.forEach(warmupExercise => {
            htmlContent += `<li>${warmupExercise}</li>`;
        });
        htmlContent += '</ul></div>';
    }

    // Display Main Exercises
    if (currentDayData.exercises && currentDayData.exercises.length > 0) {
        htmlContent += '<div class="main-routine-section">';
        htmlContent += '<h3>Main Routine</h3>';
        htmlContent += '<ul class="exercise-checklist">';
        
        // Load completed exercises for TODAY's date for checkboxes
        const completedExercises = getDailyProgress(todayKey); 

        currentDayData.exercises.forEach((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise);
            const checkedAttribute = isCompleted ? 'checked' : '';
            const exerciseDetail = exercises[exercise] || 'No details available.'; 

            htmlContent += `
                <li class="${isCompleted ? 'completed' : ''}">
                    <input type="checkbox" id="exercise-${index}" value="${exercise}" ${checkedAttribute} data-exercise="${exercise}">
                    <label for="exercise-${index}">
                        <strong>${exercise}</strong>
                        <br>
                        <span class="exercise-detail">${exerciseDetail}</span>
                    </label>
                </li>
            `;
        });
        htmlContent += '</ul></div>';
    }
    
    exerciseList.innerHTML = htmlContent; // Update the display

    // Attach event listeners for checkboxes after rendering HTML
    document.querySelectorAll('#exercise-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const exerciseName = event.target.dataset.exercise;
            const isChecked = event.target.checked;
            toggleExerciseComplete(todayKey, exerciseName, isChecked); // Correct arguments
            updateDailyProgressBar(); // Update progress bar when an exercise is ticked
            
            // Update the list item class immediately for visual feedback
            const listItem = event.target.closest('li');
            if (listItem) {
                listItem.classList.toggle('completed', isChecked);
            }
        });
    });
    
    // Load notes for TODAY's date
    if (dailyNotesTextarea) {
        dailyNotesTextarea.value = loadDailyNotes(todayKey); 
        // Save notes on input change as well, not just on button click
        dailyNotesTextarea.removeEventListener('input', dailyNotesInputHandler); // Prevent duplicate listeners
        dailyNotesTextarea.addEventListener('input', dailyNotesInputHandler);
    }
    
    updateDailyProgressBar(); // Always update progress bar
}

// Handler for daily notes textarea input
function dailyNotesInputHandler() {
    const todayKey = new Date().toISOString().split('T')[0];
    saveDailyNotes(todayKey, dailyNotesTextarea.value);
}

/**
 * Updates the daily progress bar and text.
 */
function updateDailyProgressBar() {
    if (!dailyProgressBar || !dailyProgressText || !dailyProgressContainer) {
        console.error("Progress bar DOM elements not initialized.");
        return;
    }

    const { week: currentRoutineWeekIndex, day: currentDayInWeekIndex } = getCurrentRoutineProgress();
    const todayKey = new Date().toISOString().split('T')[0];

    // Get the specific day's data from the routine
    const currentDayData = routine[weekIndexToLoad]?.days?.[routineDayIndexToLoad];

    // Handle cases where there's no routine data for the day (e.g., rest day or null entry)
    if (!currentDayData || !currentDayData.exercises || currentDayData.exercises.length === 0) {
        dailyProgressContainer.style.display = 'none'; // Hide the progress bar
        return; // Exit the function as there's no workout to track progress for
    }

    const totalExercises = currentDayData.exercises.length;
    const completedExercises = getDailyProgress(todayKey); // This should return an array of completed exercises
    const completedCount = completedExercises.length;

    // Show the progress bar container if there's a routine
    dailyProgressContainer.style.display = 'block';

    // Update the <progress> element's value and max attributes
    dailyProgressBar.value = completedCount;
    
    // Crucial check to prevent non-finite 'max' values
    if (totalExercises > 0) {
        dailyProgressBar.max = totalExercises;
        let percentage = (completedCount / totalExercises) * 100;
        dailyProgressText.textContent = `${completedCount}/${totalExercises} exercises complete (${percentage.toFixed(0)}%)`;
    } else {
        dailyProgressBar.max = 1; // Set a default max to avoid errors
        dailyProgressBar.value = 0;
        dailyProgressText.textContent = `No exercises planned for today.`;
    }
}

/**
 * Loads and displays the list of back exercises.
 */
function loadBackExercises() {
    if (!backExercisesList) {
        console.error("Error: 'back-exercises-list' element not found in the DOM.");
        return;
    }

    let htmlContent = '';

    backExercises.forEach(exercise => {
        const { name, reps, instructions, type } = exercise;
        const typeClass = type.toLowerCase().replace(/\s/g, '-'); // e.g., "Strength" -> "strength"

        htmlContent += `
            <li>
                <div class="exercise-header">
                    <strong>${name}</strong>
                    <span class="exercise-type-badge ${typeClass}">${type}</span>
                </div>
                <p class="exercise-reps"><strong>Reps:</strong> ${reps}</p>
                <p class="exercise-instructions"><strong>Instructions:</strong> ${instructions}</p>
            </li>
        `;
    });
    backExercisesList.innerHTML = htmlContent;
}


// Weekly Schedule Logic
// PREV and NEXT Buttons
function showPreviousWeek() {
    if (currentDisplayWeek > 0) {
        currentDisplayWeek--;
        loadWeeklySchedule();
    }
}

function showNextWeek() {
    if (currentDisplayWeek < PROGRAM_WEEKS - 1) {
        currentDisplayWeek++;
        loadWeeklySchedule();
    }
}

// --- Weekly Schedule Logic (NEW) ---
function loadWeeklySchedule() {
    const weekScheduleGrid = document.getElementById('week-schedule-grid');
    if (!weekScheduleGrid) {
        console.error("Error: 'week-schedule-grid' element not found in the DOM.");
        return;
    }
    weekScheduleGrid.innerHTML = ''; // Clear previous content

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const scheduleWeekDisplay = document.getElementById('schedule-week-display');
    if (scheduleWeekDisplay) {
        scheduleWeekDisplay.textContent = `Week ${currentDisplayWeek + 1}`;
    }

    for (let i = 0; i < WEEK_LENGTH; i++) { // 'i' is the standard JS day index (0=Sun, 1=Mon, etc.)
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.dataset.dayIndex = i; // Store original JS day index for potential use, though routineDayIndex is used for logic
        dayCard.dataset.weekIndex = currentDisplayWeek;

        // Add 'current-day' class if it's today's day of the week AND this is the actual current program week
        if (i === currentDayOfWeek && currentDisplayWeek === Math.floor(getDaysSinceProgramStart() / WEEK_LENGTH)) {
            dayCard.classList.add('current-day');
        }

        // Convert the standard 'i' (0=Sun, 1=Mon) to your routine's day index (0=Mon, 1=Tue)
        let routineDayIndex;
        if (i === 0) { // If 'i' is 0 (Sunday)
            routineDayIndex = 6; // Map to the last day in your routine.days array
        } else { // For Monday (i=1) through Saturday (i=6)
            routineDayIndex = i - 1; // Shift by one: Mon (1) -> 0, Tue (2) -> 1, etc.
        }

        const weekRoutineData = routine[currentDisplayWeek];
        const dayData = weekRoutineData && weekRoutineData.days ? weekRoutineData.days[routineDayIndex] : null;

        let statusText;
        let statusClass;

        if (dayData && (dayData.warmup?.length > 0 || dayData.exercises?.length > 0)) {
            dayCard.classList.add('scheduled'); // Add a class for styling workout days
            statusText = 'Workout Day';
            statusClass = 'summary-workout';
        } else {
            statusText = dayData ? 'Rest Day' : 'No Routine Set';
            statusClass = dayData ? 'summary-rest' : 'summary-unset';
        }
        
        dayCard.innerHTML = `<h3>${dayNames[i]}</h3><p class="status ${statusClass}">${statusText}</p>`;

        // Add click listener to each day card
        dayCard.addEventListener('click', () => {
            const clickedWeekIndex = parseInt(dayCard.dataset.weekIndex);
            showExercisesForDay(clickedWeekIndex, routineDayIndex); 
        });

        weekScheduleGrid.appendChild(dayCard);
    }
    
    // Ensure event listeners are correctly assigned to buttons
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    if (prevWeekBtn) prevWeekBtn.onclick = showPreviousWeek;
    if (nextWeekBtn) nextWeekBtn.onclick = showNextWeek;
}

/**
 * Sets global state and switches to the daily routine tab to display exercises for a specific day.
 * @param {number} weekIndex - The 0-indexed week of the routine.
 * @param {number} dayIndex - The 0-indexed day of the week (Monday=0, Sunday=6).
 */
function showExercisesForDay(weekIndex, dayIndex) {
    isShowingScheduledDay = true;
    selectedScheduleWeekIndex = weekIndex;
    selectedScheduleDayIndex = dayIndex;

    showTab('daily-routine-section'); // This will call loadDailyRoutine with the new state
}


// *******************************
// ---- Weekly Summary Logic ----
// *******************************

/**
 * Initializes the weekly progress tracking in localStorage.
 * Called when a new routine starts or when the app is first opened.
 */
function initializeWeeklyProgress() {
    const weeklySummary = {
        lastCalculatedWeek: -1, // To ensure summary is run for Week 0 initially
        weekData: {}
    };
    localStorage.setItem('weeklySummary', JSON.stringify(weeklySummary));
    // Also, ensure routineStartDate is set if not already
    if (!localStorage.getItem('routineStartDate')) {
        localStorage.setItem('routineStartDate', PROGRAM_START_DATE.toISOString().split('T')[0]);
    }
}

// --- In updateWeeklyOverview() ---
/**
 * Updates and displays the weekly summary.
 * Clears old daily progress data when a new week starts.
 */
function updateWeeklySummary() {
    if (!summaryContent || !resetWeekButton) {
        console.error("Summary DOM elements not initialized.");
        return;
    }

    const today = new Date();
    const { week: currentRoutineWeekIndex } = getCurrentRoutineProgress();
    let weeklySummary = JSON.parse(localStorage.getItem('weeklySummary')) || { lastCalculatedWeek: -1, weekData: {} };
    let dailyProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};

    const lastCalculatedWeek = weeklySummary.lastCalculatedWeek;

    // Check if a new week has started and summary needs to be generated for the previous one
    // This logic ensures summary is generated for the week that *just ended*
    // And also handles initial run if lastCalculatedWeek is -1 (start of week 0)
    if (currentRoutineWeekIndex > lastCalculatedWeek) {
        // If it's the very first time, lastCalculatedWeek will be -1, don't summarize "previous" week
        if (lastCalculatedWeek >= 0) {
            const previousWeekData = calculateSummaryForWeek(lastCalculatedWeek, dailyProgress);
            weeklySummary.weekData[lastCalculatedWeek] = previousWeekData;
            console.log(`Summary calculated for Week ${lastCalculatedWeek + 1}`);
        }
        weeklySummary.lastCalculatedWeek = currentRoutineWeekIndex; // Update for the newly current week
        localStorage.setItem('weeklySummary', JSON.stringify(weeklySummary));

        // Clear daily progress for dates *before* the start of the newly current routine week
        // Only clear if routineStartDate is set
        const storedRoutineStartDate = localStorage.getItem('routineStartDate');
        if (storedRoutineStartDate) {
            const routineStartDate = new Date(storedRoutineStartDate);
            const currentWeekStartDate = new Date(routineStartDate);
            currentWeekStartDate.setDate(routineStartDate.getDate() + (currentRoutineWeekIndex * 7));
            currentWeekStartDate.setHours(0,0,0,0);

            for (const dateKey in dailyProgress) {
                const date = new Date(dateKey);
                // Only delete if the date is strictly BEFORE the start of the current week
                if (date < currentWeekStartDate) {
                    delete dailyProgress[dateKey];
                }
            }
            localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
        }
    }

    // Display summary for all completed weeks
    summaryContent.innerHTML = '';
    const summaryUl = document.createElement('ul');
    summaryUl.style.listStyleType = 'none';
    summaryUl.style.padding = '0';

    let hasSummary = false;
    for (let i = 0; i < currentRoutineWeekIndex; i++) { // Only show past weeks
        if (weeklySummary.weekData[i]) {
            const weekSummary = weeklySummary.weekData[i];
            const li = document.createElement('li');
            li.innerHTML = `<h3>Week ${i + 1} Summary:</h3>
                            <p><strong>Completed Sessions:</strong> ${weekSummary.completedSessions}/${weekSummary.totalSessions}</p>
                            <p><strong>Total Exercises Completed:</strong> ${weekSummary.totalExercisesCompleted}</p>
                            <p><strong>Total Exercises Missed:</strong> ${weekSummary.totalExercisesMissed}</p>`;
            summaryUl.appendChild(li);
            hasSummary = true;
        }
    }

    if (hasSummary) {
        summaryContent.appendChild(summaryUl);
        resetWeekButton.style.display = 'block'; // Show reset button if there's summary data
    } else {
        summaryContent.innerHTML = '<p>No past weekly summaries yet. Complete Week 1 to see your first report!</p>';
        resetWeekButton.style.display = 'none';
    }

    // Display placeholder for current week's progress
    const currentWeekPlaceholder = document.createElement('p');
    currentWeekPlaceholder.innerHTML = `<br><em>You are currently in Week ${currentRoutineWeekIndex + 1}. Your progress will be summarized here once this week is complete.</em>`;
    summaryContent.appendChild(currentWeekPlaceholder);
}

/**
 * Calculates summary data for a specific routine week.
 * @param {number} weekIndex - The 0-indexed routine week to summarize.
 * @param {object} dailyProgressData - The full daily progress object from localStorage.
 * @returns {object} Summary data for the week.
 */
function calculateSummaryForWeek(weekIndex, dailyProgressData) {
    const storedRoutineStartDate = localStorage.getItem('routineStartDate');
    if (!storedRoutineStartDate) {
        console.error("Routine start date not found in localStorage during summary calculation.");
        return { totalSessions: 0, completedSessions: 0, totalExercisesCompleted: 0, totalExercisesMissed: 0 };
    }
    const startDate = new Date(storedRoutineStartDate);
    
    // Ensure startDate is valid before proceeding
    if (isNaN(startDate.getTime())) {
        console.error("calculateSummaryForWeek called with invalid routineStartDate.");
        return { totalSessions: 0, completedSessions: 0, totalExercisesCompleted: 0, totalExercisesMissed: 0 };
    }

    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (weekIndex * WEEK_LENGTH)); // Start of the specific week
    weekStartDate.setHours(0,0,0,0);

    let totalSessions = 0;
    let completedSessions = 0;
    let totalExercisesInWeek = 0;
    let totalExercisesCompleted = 0;

    const weekRoutine = routine[weekIndex]; // Get the entire week's routine object
    if (!weekRoutine || !weekRoutine.days) {
        console.warn(`No routine data found for week index ${weekIndex}.`);
        return { totalSessions: 0, completedSessions: 0, totalExercisesCompleted: 0, totalExercisesMissed: 0 };
    }

    for (let d = 0; d < WEEK_LENGTH; d++) { // Iterate through 7 days of the week
        const currentDayDate = new Date(weekStartDate);
        currentDayDate.setDate(weekStartDate.getDate() + d);
        const dayKey = currentDayDate.toISOString().split('T')[0];

        // Convert standard JS day index 'd' to your routine's 0-indexed Monday system (Mon=0, Sun=6)
        let routineDayIndex;
        if (currentDayDate.getDay() === 0) { // If Sunday
            routineDayIndex = 6;
        } else {
            routineDayIndex = currentDayDate.getDay() - 1;
        }

        const dayRoutine = weekRoutine.days[routineDayIndex]; // Get the specific day's routine data

        if (dayRoutine && dayRoutine.exercises && dayRoutine.exercises.length > 0) { // If there were main exercises planned for this day
            totalSessions++;
            const completedForDay = dailyProgressData[dayKey] || [];
            
            totalExercisesInWeek += dayRoutine.exercises.length;
            totalExercisesCompleted += completedForDay.length;

            if (completedForDay.length === dayRoutine.exercises.length) {
                completedSessions++;
            }
        }
    }

    return {
        totalSessions: totalSessions,
        completedSessions: completedSessions,
        totalExercisesCompleted: totalExercisesCompleted,
        totalExercisesMissed: totalExercisesInWeek - totalExercisesCompleted
    };
}

/**
 * Resets all routine progress and reloads the daily routine.
 * This effectively starts the routine from Week 1, Day 1.
 */
function resetAllProgress() {
    if (confirm("Are you sure you want to reset all your progress? This will start the 8-week routine from the beginning.")) {
        localStorage.removeItem('routineStartDate');
        localStorage.removeItem('dailyProgress');
        localStorage.removeItem('weeklySummary');
        
        // Re-initialize the start date for the new beginning
        initializeRoutineStartDate(); 
        initializeWeeklyProgress(); // Re-initialize summary tracking

        isShowingScheduledDay = false; // Reset flag to show today's routine
        loadDailyRoutine(); // Re-initialize everything for the current day
        showTab('daily-routine-section'); // Go back to daily view
    }
}

/**
 * Ensures the routine start date is stored in localStorage.
 * If not present, it sets it to PROGRAM_START_DATE.
 */
function initializeRoutineStartDate() {
    if (!localStorage.getItem('routineStartDate')) {
        localStorage.setItem('routineStartDate', PROGRAM_START_DATE.toISOString().split('T')[0]);
        console.log('Routine start date initialized:', PROGRAM_START_DATE.toISOString().split('T')[0]);
    }
}


// ****************************
// --- Tab Switching Logic ---
// ****************************

/**
 * Handles switching between different application tabs.
 * @param {string} tabId - The ID of the tab content section to display.
 */
function showTab(tabId) {
    // Hide all tab content sections
    document.querySelectorAll('.tab-content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const targetSection = document.getElementById(tabId);
    if (!targetSection) {
        console.error(`Target section with ID '${tabId}' not found.`);
        return;
    }

    // Call content loading functions *before* displaying
    if (tabId === 'daily-routine-section') {
        // If coming from a schedule click, showExercisesForDay would have set isShowingScheduledDay = true
        // If coming from clicking the 'Today' tab directly, we want to reset it to false
        if (!isShowingScheduledDay) { // This check prevents overriding if we just navigated from schedule
            // isShowingScheduledDay = false; // This is now handled in the main tab click listener
        }
        loadDailyRoutine(); // Ensure daily routine is always fresh
    } else if (tabId === 'schedule-section') { // Changed from 'weekly-schedule-section' based on common HTML IDs
        loadWeeklySchedule();
        isShowingScheduledDay = false; // Reset when navigating to schedule directly
    } else if (tabId === 'summary-section') { // Changed from 'weekly-summary-section'
        updateWeeklySummary();
        isShowingScheduledDay = false; // Reset when navigating to summary directly
    } else if (tabId === 'back-exercises-section') {
        loadBackExercises();
        isShowingScheduledDay = false; // Reset when navigating to back exercises directly
    }
    // 'full-routine-details' is static, so no function call needed

    // Now, show the selected tab content
    targetSection.classList.add('active');

    // Activate the clicked tab button
    const activeTabElement = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeTabElement) {
        activeTabElement.classList.add('active');
    } else {
        console.warn(`No tab-button found with data-tab="${tabId}".`);
    }
}

// *****************************************
// --- Event Listeners and Initial Load ---
// *****************************************

document.addEventListener('DOMContentLoaded', () => {
    // --- Assign DOM Elements after DOM is loaded ---
    dateDisplay = document.getElementById('date-display');
    currentWeekDisplay = document.getElementById('current-week-display');
    currentDayOfWeekDisplay = document.getElementById('current-day-of-week-display');
    exerciseList = document.getElementById('exercise-list');
    dailyProgressBarContainer = document.getElementById('daily-progress-container');
    dailyProgressBar = document.getElementById('daily-progress-bar');
    dailyProgressText = document.getElementById('daily-progress-text');
    summaryContent = document.getElementById('summary-content');
    resetWeekButton = document.getElementById('reset-week-button');
    weekScheduleContent = document.getElementById('week-schedule-content'); // Assuming this exists for the schedule section
    dailyNotesTextarea = document.getElementById('daily-notes-textarea');
    saveNotesBtn = document.getElementById('save-notes-btn');
    backExercisesList = document.getElementById('back-exercises-list');
    dailyNotesSection = document.getElementById('daily-notes-section'); // Make sure this ID exists in your HTML

    // --- Initial Setup and Event Listeners ---

    // Initialize the routine start date if it's not set
    initializeRoutineStartDate();
    // Initialize weekly summary tracking on app load
    initializeWeeklyProgress();

    // Display current date immediately
    displayCurrentDate();

    // Add event listener for the reset week button
    if (resetWeekButton) {
        resetWeekButton.addEventListener('click', resetAllProgress);
    }

    // Add event listeners for navbar tabs
    document.querySelectorAll('.tab-button').forEach(button => { // Assuming class 'tab-button' for navigation
        button.addEventListener('click', (event) => {
            const tabId = event.target.closest('.tab-button').dataset.tab; // Get data-tab from the button

            if (tabId === 'daily-routine-section') {
                isShowingScheduledDay = false; // Reset the flag when user clicks 'Today' tab directly
            }
            showTab(tabId); // This handles loading content and activating the tab
        });
    });

    // Save notes on button click (if you prefer explicit save)
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', () => {
            const todayKey = new Date().toISOString().split('T')[0];
            saveDailyNotes(todayKey, dailyNotesTextarea.value);
            alert('Notes saved!');
        });
    }

    // Initial load for Today's Routine when the app starts
    isShowingScheduledDay = false; // Ensure flag is false on initial load
    showTab('daily-routine-section'); // This will trigger loadDailyRoutine() which updates content
});
