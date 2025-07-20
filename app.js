// PWA Service Worker Registration (keep this from previous instructions)
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

// Setting the start date
// Assume you have some way to define your weekly schedule, e.g.:
const programStartDate = new Date('2025-07-14'); // Adjust to your actual program start
const WEEK_LENGTH = 7; // Days in a week
const PROGRAM_WEEKS = 8; // Total weeks in the program

// Define a default weekly routine pattern (0=Sun, 1=Mon, ..., 6=Sat)
// Example: Monday, Wednesday, Friday, Saturday are routine days
const DEFAULT_WEEKLY_ROUTINE_PATTERN = [1, 3, 5];

let currentDisplayWeek = 0; // 0-indexed for program weeks

// --- CORE APPLICATION LOGIC ---

// Exercise Data - Define all exercises with their details
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

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// DOM Elements
const dateDisplay = document.getElementById('date-display');
const currentWeekDisplay = document.getElementById('current-week-display');
const currentDayOfWeekDisplay = document.getElementById('current-day-of-week-display');
const exerciseList = document.getElementById('exercise-list');
const dailyProgressBarContainer = document.getElementById('daily-progress-container'); // NEW
const dailyProgressBar = document.getElementById('daily-progress-bar');
const dailyProgressText = document.getElementById('daily-progress-text');
const summaryContent = document.getElementById('summary-content');
const resetWeekButton = document.getElementById('reset-week-button');
const weekScheduleContent = document.getElementById('week-schedule-content');
const dailyNotesTextarea = document.getElementById('daily-notes-textarea');
const saveNotesBtn = document.getElementById('save-notes-btn');
const backExercisesList = document.getElementById('back-exercises-list'); 

// --- Helper Functions ---

// Get the date for thet header
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

/**
 * Gets the current week number (0-indexed from the start date) and day of the week.
 * Stores the start date in localStorage if not present or invalid.
 * @returns {object} { week: number, dayOfWeek: number (0=Mon, 6=Sun), totalWeeks: number, isRoutineFinished: boolean }
 */
function getCurrentRoutineProgress() {
    const totalDaysElapsed = getDaysSinceProgramStart();
    const currentWeekIndex = Math.floor(totalDaysElapsed / WEEK_LENGTH); // Assuming WEEK_LENGTH is 7
    const currentDayInWeek = totalDaysElapsed % WEEK_LENGTH; // Day index within the current week (0-6)

    console.log('getCurrentRoutineProgress - totalDaysElapsed:', totalDaysElapsed); 
    console.log('getCurrentRoutineProgress - currentWeekIndex:', currentWeekIndex);
    console.log('getCurrentRoutineProgress - currentDayInWeek:', currentDayInWeek);
    
    return {
        week: currentWeekIndex,
        day: currentDayInWeek, // This will be 0-indexed (Mon=0, Tue=1, etc. relative to program start day)
        totalDaysElapsed: totalDaysElapsed
    };
}

/**
 * Loads exercises for the current day based on the routine.
 */
function loadDailyRoutine() {
    const exerciseList = document.getElementById('exercise-list');
    const dailyProgressContainer = document.getElementById('daily-progress-container');
    const dailyNotesSection = document.getElementById('daily-notes-section'); // <--- Make sure you have an ID for your notes container
    
    const { week: currentRoutineWeekIndex, day: currentDayInWeekIndex } = getCurrentRoutineProgress();
    const todayKey = new Date().toISOString().split('T')[0];

    const currentDayData = routine[currentRoutineWeekIndex]?.days?.[currentDayInWeekIndex];

    // Always display the calculated week and day numbers/names
    if (currentWeekDisplay) {
        currentWeekDisplay.textContent = `Week ${currentRoutineWeekIndex + 1}`;
    }
    if (currentDayOfWeekDisplay) {
        // Using dayNames array for clarity (e.g., 'Friday')
        currentDayOfWeekDisplay.textContent = ` ${currentDayInWeekIndex + 1} (${dayNames[currentDayInWeekIndex]})`;  
        // Or if you prefer 'Day 5':
        // currentDayOfWeekDisplay.textContent = `Day ${currentDayInWeekIndex + 1}`;
    }
    
    if (!currentDayData) {
        // Fallback for days beyond the routine or undefined days
        exerciseList.innerHTML = '<p>No specific routine defined for today. Enjoy your day!</p>';
        dailyProgressContainer.style.display = 'none';
        dailyNotesSection.style.display = 'none';
        return;
    }

    const dailyWarmup = currentDayData.warmup || []; // Get warm-up exercises
    const dailyExercises = currentDayData.exercises || []; // Get main exercises

    let htmlContent = '';

    // NEW: Display Warm-up Exercises
    if (currentDayData.warmup && currentDayData.warmup.length > 0) {
        htmlContent += '<div class="warmup-section">'; // Added a div for styling the whole section
        htmlContent += '<h3>Warmup</h3>';
        htmlContent += '<ul>';
        currentDayData.warmup.forEach(warmupExercise => {
            htmlContent += `<li>${warmupExercise}</li>`;
        });
        htmlContent += '</ul>';
        htmlContent += '</div>'; // Close the warmup section div
    }

    // Display Main Exercises
    if (currentDayData.exercises && currentDayData.exercises.length > 0) {
        htmlContent += '<div class="main-routine-section">'; // Added a div for styling the whole section
        htmlContent += '<h3>Main Routine</h3>'; // Changed heading
        htmlContent += '<ul class="exercise-checklist">'; // Keep the class for checklist specific styling
        const completedExercises = getDailyProgress(todayKey);

        currentDayData.exercises.forEach((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise);
            const checkedAttribute = isCompleted ? 'checked' : '';

            const exerciseDetail = exercises[exercise] || 'No details available.'; 
            
            htmlContent += `
                <li>
                    <input type="checkbox" id="exercise-${index}" value="${exercise}" ${checkedAttribute} data-exercise="${exercise}">
                    <label for="exercise-${index}">${exercise}
                    <br>
                        <span class="exercise-detail">${exerciseDetail}</span></label>
                </li>
            `;
        });
        htmlContent += '</ul>';
        htmlContent += '</div>'; // Close the main routine section div
    } else {
        // This 'else' block ensures a message is displayed if there are no main exercises.
        // It might be redundant if the !currentDayData check handles "no workout day".
        // Consider if you want this message only if main exercises are missing but warmups exist.
        if ((!currentDayData.warmup || currentDayData.warmup.length === 0) && (!currentDayData.exercises || currentDayData.exercises.length === 0)) {
            htmlContent = '<p>No exercises planned for today.</p>';
        } else if (currentDayData.warmup && currentDayData.warmup.length > 0) {
            // If only warmups are present, and no main exercises, you might want a different message.
            // Or this could be implicitly handled by the sections above.
        }
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
    
    // Only show progress bar if there are main exercises
    if (dailyExercises.length > 0) {
        dailyProgressContainer.style.display = 'block';
    } else {
        dailyProgressContainer.style.display = 'none';
    }

    updateDailyProgressBar();
    updateWeeklyOverview();
    if (dailyNotesTextarea) {
        dailyNotesTextarea.value = loadDailyNotes(todayKey);
    }
}

// Back exercises function
function loadBackExercises() {
    if (!backExercisesList) {
        console.error("Error: 'back-exercises-list' element not found in the DOM.");
        return;
    }

    let htmlContent = ''; // This will build the HTML for the list items

    // Loop through the backExercises object
    backExercises.forEach(exercise => {
        // --- MODIFIED DESTRUCTURING ---
        // Access 'reps' and 'instructions' directly
        const { name, reps, instructions, type } = exercise; 
        // --- END MODIFIED DESTRUCTURING ---

        // Generate a class name for the badge (e.g., "Strengthening" -> "strengthening")
        const typeClass = type.toLowerCase(); 

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
    backExercisesList.innerHTML = htmlContent; // Insert the generated HTML into the UL
}

// --- In updateWeeklyOverview() ---
function updateWeeklyOverview() {
    const currentWeekDisplay = document.getElementById('current-week-display');
    const currentDayOfWeekDisplay = document.getElementById('current-day-of-week-display');

    const { week, day } = getCurrentRoutineProgress(); // Gets current week and day indices

    console.log('updateWeeklyOverview - Displaying week:', week, 'day:', day); // ADD THIS

    // Update the display elements
    currentWeekDisplay.textContent = `Week ${week + 1}`; // Display as 1-indexed week
    currentDayOfWeekDisplay.textContent = day + 1; // Display as 1-indexed day
}

/**
 * Gets saved progress for a specific day from localStorage.
 * @param {string} dateKey - YYYY-MM-DD string.
 * @returns {Array<string>} List of completed exercise names.
 */
function getDailyProgress(dateKey) {
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    console.log('getDailyProgress - dateKey:', dateKey); // ADD THIS
    console.log('getDailyProgress - progress:', progress); // ADD THIS
    console.log('getDailyProgress - returning:', progress[dateKey] || []); // ADD THIS
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

    loadDailyRoutine();
}

/**
 * Updates the daily progress bar and text.
 */
function updateDailyProgressBar() {
    const dailyProgressBar = document.getElementById('daily-progress-bar');
    const dailyProgressText = document.getElementById('daily-progress-text');
    const dailyProgressContainer = document.getElementById('daily-progress-container'); // Get this element too for hiding/showing

    const { week: currentRoutineWeekIndex, day: currentDayInWeekIndex } = getCurrentRoutineProgress();
    const todayKey = new Date().toISOString().split('T')[0];

    // Get the specific day's data from the routine
    const currentDayData = routine[currentRoutineWeekIndex]?.days?.[currentDayInWeekIndex];

    // Handle cases where there's no routine data for the day (e.g., rest day)
    if (!currentDayData) {
        dailyProgressBarContainer.style.display = 'none'; // Hide the progress bar
        exerciseList.innerHTML = '<p>No specific routine defined for today. Enjoy your day!</p>';
        if (dailyNotesTextarea) {
             dailyNotesTextarea.value = loadDailyNotes(todayKey); // Still load notes if available
        }
        return; // Exit the function as there's no workout
    }

    // Safely get lengths of warmup and exercises arrays, defaulting to 0 if they don't exist
    const warmupCount = currentDayData.warmup ? currentDayData.warmup.length : 0;
    const exerciseCount = currentDayData.exercises ? currentDayData.exercises.length : 0;

    const totalExercises = currentDayData.exercises ? currentDayData.exercises.length : 0;
    const completedExercises = getDailyProgress(todayKey); // This should return an array of completed exercises
    const completedCount = completedExercises.length;

    // Show the progress bar container if there's a routine
    dailyProgressContainer.style.display = 'block';

    // NEW: Load and display notes
    if (dailyNotesTextarea) { // Ensure the element exists before trying to access it
        dailyNotesTextarea.value = loadDailyNotes(todayKey);
    }

    // Update the <progress> element's value and max attributes
    dailyProgressBar.value = completedCount;
    
    // Crucial check to prevent non-finite 'max' values
    if (totalExercises > 0) {
        dailyProgressBar.max = totalExercises;
        let percentage = (completedCount / totalExercises) * 100;
        dailyProgressText.textContent = `${completedCount}/${totalExercises} exercises complete (${percentage.toFixed(0)}%)`;
    } else {
        // If totalExercises is 0 (e.g., empty arrays, though your routine data has items)
        dailyProgressBar.max = 1; // Set a default max to avoid errors, effectively making it 0%
        dailyProgressBar.value = 0;
        dailyProgressText.textContent = `No exercises planned for today.`;
    }
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


// --- Weekly Schedule Logic (NEW) ---
function loadWeeklySchedule() {
    const weekScheduleGrid = document.getElementById('week-schedule-grid');
    weekScheduleGrid.innerHTML = ''; // Clear previous content

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday

    document.getElementById('schedule-week-display').textContent = `Week ${currentDisplayWeek + 1}`;

    for (let i = 0; i < WEEK_LENGTH; i++) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        
        // Add 'current-day' class if it's today's day of the week AND this is the actual current program week
        if (i === currentDayOfWeek && currentDisplayWeek === Math.floor(getDaysSinceProgramStart() / WEEK_LENGTH)) {
            dayCard.classList.add('current-day');
        }

        // --- CRITICAL ADJUSTMENT HERE ---
        // Convert the standard 'i' (0=Sun, 1=Mon) to your routine's day index (0=Mon, 1=Tue)
        let routineDayIndex;
        if (i === 0) { // If 'i' is 0 (Sunday)
            routineDayIndex = 6; // Map to the last day in your routine.days array (where Sunday's data would be, if any)
        } else { // For Monday (i=1) through Saturday (i=6)
            routineDayIndex = i - 1; // Shift by one: Mon (1) -> 0, Tue (2) -> 1, etc.
        }

        // Determine if it's a routine day based on your 'routine' data structure
        // Assuming 'routine' is an array of weeks, and each week has a 'days' array
        const weekRoutineData = routine[currentDisplayWeek];
        const dayExercises = weekRoutineData && weekRoutineData.days ? weekRoutineData.days[i] : [];

        if (dayExercises && dayExercises.length > 0) {
            dayCard.classList.add('scheduled');
            dayCard.innerHTML = `<h3>${dayNames[i]}</h3><p class="status">Routine Day</p>`;
            // Future: Add logic to display a checkmark if completed
        } else {
            dayCard.innerHTML = `<h3>${dayNames[i]}</h3><p class="status">Rest Day</p>`;
        }

        // Add click listener to each day card
        dayCard.addEventListener('click', () => {
            const clickedWeekIndex = parseInt(dayCard.dataset.weekIndex);
            const clickedDayIndex = parseInt(dayCard.dataset.dayIndex);
            showExercisesForDay(clickedWeekIndex, clickedDayIndex);
        });

        weekScheduleGrid.appendChild(dayCard);
    }

    // Add event listeners for week navigation
    document.getElementById('prev-week-btn').onclick = showPreviousWeek;
    document.getElementById('next-week-btn').onclick = showNextWeek;
}

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

// Helper to get days since program start
function getDaysSinceProgramStart() {
    const today = new Date();
    // Normalize dates to start of day to avoid time differences affecting calculation
    const start = new Date(programStartDate.getFullYear(), programStartDate.getMonth(), programStartDate.getDate());
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = current - start; // Difference in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

    return diffDays; // 0 for the start day, 1 for the next day, etc.
}

// A flag to indicate if daily-routine-section is currently showing a specific schedule day
let isShowingScheduledDay = false;

// --- New function to display exercises for a specific day ---
function showExercisesForDay(weekIndex, dayIndex) {
    isShowingScheduledDay = true; // Set flag when viewing a scheduled day

    const dailyRoutineSection = document.getElementById('daily-routine-section');
    const exerciseList = document.getElementById('exercise-list');
    const weeklyOverview = document.getElementById('weekly-overview');
    const dailyProgressContainer = document.getElementById('daily-progress-container');

    weeklyOverview.innerHTML = `Week ${weekIndex + 1} | ${dayNames[dayIndex]}`; // Update header
    exerciseList.innerHTML = ''; // Clear current exercises

    const weekRoutineData = routine[weekIndex];
    let exercisesToDisplay = [];

    if (weekRoutineData && weekRoutineData.days && weekRoutineData.days[dayIndex] && weekRoutineData.days[dayIndex].length > 0) {
        exercisesToDisplay = weekRoutineData.days[dayIndex];
    }

    if (exercisesToDisplay.length === 0) {
        exerciseList.innerHTML = '<p>No exercises planned for this day. Enjoy your rest!</p>';
    } else {
        const ul = document.createElement('ul');
        exercisesToDisplay.forEach(exerciseName => {
            const li = document.createElement('li');
            li.textContent = exerciseName; // No checkboxes for view-only historical/future days
            ul.appendChild(li);
        });
        exerciseList.appendChild(ul);
    }
    dailyProgressContainer.style.display = 'none'; // Always hide progress bar for scheduled day views

    showTab('daily-routine-section'); // Switch to the Today tab
}

// You would call loadWeeklySchedule() when the schedule tab is opened
// (This is already handled by the showTab() function)

// --- Weekly Summary Logic ---

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
}

/**
 * Updates and displays the weekly summary.
 * Clears old daily progress data when a new week starts.
 */
function updateWeeklySummary() {
    const today = new Date();
    const { week: currentRoutineWeekIndex, dayOfWeek } = getCurrentRoutineProgress();
    let weeklySummary = JSON.parse(localStorage.getItem('weeklySummary')) || { lastCalculatedWeek: -1, weekData: {} };
    let dailyProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};

    const lastCalculatedWeek = weeklySummary.lastCalculatedWeek;

    // Check if a new week has started and summary needs to be generated for the previous one
    // This logic ensures summary is generated for the week that *just ended*
    if (currentRoutineWeekIndex > lastCalculatedWeek && lastCalculatedWeek >= 0) {
        const previousWeekData = calculateSummaryForWeek(lastCalculatedWeek, dailyProgress);
        weeklySummary.weekData[lastCalculatedWeek] = previousWeekData;
        console.log(`Summary calculated for Week ${lastCalculatedWeek + 1}`);

        // After calculating summary for the previous week, update lastCalculatedWeek
        weeklySummary.lastCalculatedWeek = currentRoutineWeekIndex;
        localStorage.setItem('weeklySummary', JSON.stringify(weeklySummary));

        // Clear daily progress for dates *before* the start of the newly current routine week
        const routineStartDate = new Date(localStorage.getItem('routineStartDate'));
        const currentWeekStartDate = new Date(routineStartDate);
        currentWeekStartDate.setDate(routineStartDate.getDate() + (currentRoutineWeekIndex * 7));
        currentWeekStartDate.setHours(0,0,0,0);

        for (const dateKey in dailyProgress) {
            const date = new Date(dateKey);
            if (date < currentWeekStartDate) {
                delete dailyProgress[dateKey];
            }
        }
        localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
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
 * Calculates summary for a specific routine week.
 * @param {number} weekIndex - The 0-indexed routine week to summarize.
 * @param {object} dailyProgressData - The full daily progress object from localStorage.
 * @returns {object} Summary data for the week.
 */
function calculateSummaryForWeek(weekIndex, dailyProgressData) {
    const startDate = new Date(localStorage.getItem('routineStartDate'));
    // Ensure startDate is valid before proceeding
    if (isNaN(startDate.getTime())) {
        console.error("calculateSummaryForWeek called with invalid routineStartDate.");
        return {
            totalSessions: 0,
            completedSessions: 0,
            totalExercisesCompleted: 0,
            totalExercisesMissed: 0
        };
    }

    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (weekIndex * 7)); // Start of the specific week
    weekStartDate.setHours(0,0,0,0);

    let totalSessions = 0;
    let completedSessions = 0;
    let totalExercisesInWeek = 0;
    let totalExercisesCompleted = 0;

    for (let d = 0; d < 7; d++) {
        const currentDayDate = new Date(weekStartDate);
        currentDayDate.setDate(weekStartDate.getDate() + d);
        const dayKey = currentDayDate.toISOString().split('T')[0];

        const dayRoutine = routine[weekIndex]?.days?.[d]; // Use optional chaining for safety

        if (dayRoutine && dayRoutine.length > 0) { // If there were exercises planned for this day
            totalSessions++;
            const completedForDay = dailyProgressData[dayKey] || [];
            totalExercisesInWeek += dayRoutine.length;
            totalExercisesCompleted += completedForDay.length;

            if (completedForDay.length === dayRoutine.length) {
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
        loadDailyRoutine(); // Re-initialize everything
        showTab('daily-routine-section'); // Go back to daily view
    }
}


// --- Tab Switching Logic ---
function showTab(tabId) {
    // Hide all tab contents first
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // Deactivate all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetSection = document.getElementById(tabId);

    // Call content loading functions *before* displaying
    if (tabId === 'daily-routine-section') {
        loadDailyRoutine(); // Ensure daily routine is always fresh
    } else if (tabId === 'weekly-schedule-section') {
        loadWeeklySchedule();
    } else if (tabId === 'weekly-summary-section') {
        updateWeeklySummary();
    } else if (tabId === 'back-exercises-section') { 
        loadBackExercises();
    }
    // 'full-routine-details' is static, so no function call needed

    // Now, show the selected tab content
    targetSection.style.display = 'block';

    // Activate the clicked tab button
    // Ensure your nav-tabs have data-target matching your section IDs
    const activeTabElement = document.querySelector(`.nav-tab[data-target="${tabId}"]`);
    if (activeTabElement) {
        activeTabElement.classList.add('active');
    } else {
        console.warn(`No nav-tab found with data-target="${tabId}".`);
    }
}

// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
    // --- All your DOMContentLoaded code should go here, in ONE listener ---

    // Ensure dateDisplay is initialized *before* displayCurrentDate is called
    // (If dateDisplay is a global const, this is fine, otherwise initialize it here)
    // Example if it's not global: const dateDisplay = document.getElementById('date-display');

    // Call displayCurrentDate() here for initial load
    displayCurrentDate(); // <--- Correct place to call it for initial page load

    // Existing event listeners and initial setup
    resetWeekButton.addEventListener('click', resetAllProgress);

    // Add event listeners for navbar tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (event) => {
            const targetId = event.target.closest('.nav-tab').dataset.target;

            if (targetId === 'daily-routine-section') {
                isShowingScheduledDay = false; // Reset the flag when user clicks 'Today' tab
                loadDailyRoutine(); // Force load today's actual routine
                displayCurrentDate(); // <--- Also call here if you want date to refresh on tab switch
            }
            showTab(targetId); // This will handle visibility and active class for all tabs
        });
    });

    // NEW: Save notes on button click
    if (saveNotesBtn) { // Ensure the element exists
        saveNotesBtn.addEventListener('click', () => {
            const todayKey = new Date().toISOString().split('T')[0];
            saveDailyNotes(todayKey, dailyNotesTextarea.value);
            alert('Notes saved!'); // Simple confirmation
        });
    }

    // Initial load for Today's Routine
    isShowingScheduledDay = false; // Ensure flag is false on initial load
    showTab('daily-routine-section'); // This should trigger loadDailyRoutine() which updates content
});
