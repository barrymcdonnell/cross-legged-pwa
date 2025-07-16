// PWA Service Worker Registration (keep this from previous instructions)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

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

// Define the 8-week routine (Days are 0-indexed: Monday=0, Tuesday=1...Sunday=6)
// A null entry means no specific exercises planned for that day, giving you rest or free practice.
// Routine is for 3-4 times a week, so some days will be empty.
const routine = [
    // Week 1 (Overall Index 0) - Weeks 1-2
    {weekLabel: "Week 1", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 1 (e.g., Monday)
        null, // Day 2
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 3
        null, // Day 4
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 5
        null, // Day 6
        null  // Day 7
    ]},
    // Week 2 (Overall Index 1) - Weeks 1-2
    {weekLabel: "Week 2", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'],
        null,
        null
    ]},
    // Week 3 (Overall Index 2) - Weeks 3-4
    {weekLabel: "Week 3", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        null
    ]},
    // Week 4 (Overall Index 3) - Weeks 3-4
    {weekLabel: "Week 4", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Clamshells', 'Glute Bridges'],
        null,
        null
    ]},
    // Week 5 (Overall Index 4) - Weeks 5-6
    {weekLabel: "Week 5", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        null
    ]},
    // Week 6 (Overall Index 5) - Weeks 5-6
    {weekLabel: "Week 6", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        null
    ]},
    // Week 7 (Overall Index 6) - Weeks 7-8
    {weekLabel: "Week 7", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        null
    ]},
    // Week 8 (Overall Index 7) - Weeks 7-8
    {weekLabel: "Week 8", days: [
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Seated Forward Fold', 'Frog Pose', 'Clamshells', 'Glute Bridges', 'Side-Lying Leg Lifts'],
        null,
        null
    ]}
];


// DOM Elements
const dateDisplay = document.getElementById('date-display');
const currentWeekDisplay = document.getElementById('current-week-display');
const currentDayOfWeekDisplay = document.getElementById('current-day-of-week-display');
const exerciseListDiv = document.getElementById('exercise-list');
const dailyProgressBar = document.getElementById('daily-progress-bar');
const dailyProgressText = document.getElementById('daily-progress-text');
const summaryContent = document.getElementById('summary-content');
const resetWeekButton = document.getElementById('reset-week-button');

// --- Helper Functions ---

/**
 * Gets the current week number (0-indexed from the start date) and day of the week.
 * Stores the start date in localStorage if not present.
 * @returns {object} { week: number, dayOfWeek: number (0=Mon, 6=Sun), totalDaysInRoutine: number }
 */
function getCurrentRoutineProgress() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    let startDate = localStorage.getItem('routineStartDate');
    if (!startDate) {
        // If no start date, set it to today and initialize weekly progress
        startDate = today.toISOString();
        localStorage.setItem('routineStartDate', startDate);
        initializeWeeklyProgress();
    } else {
        startDate = new Date(startDate);
    }

    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate current week (0-indexed)
    const currentWeekIndex = Math.floor(diffDays / 7);
    const currentDayOfWeek = (diffDays % 7); // 0 = Day 1 of the routine week, 6 = Day 7

    // Ensure we don't go beyond the routine length
    const totalWeeks = routine.length;
    if (currentWeekIndex >= totalWeeks) {
        // Routine is complete, or we're past 8 weeks.
        // We can either loop back, or just show the last week's exercises.
        // For now, let's stick to the last week's routine.
        return {
            week: totalWeeks - 1, // Stay on the last defined week
            dayOfWeek: currentDayOfWeek,
            isRoutineFinished: true,
            totalWeeks: totalWeeks
        };
    }

    return {
        week: currentWeekIndex,
        dayOfWeek: currentDayOfWeek,
        isRoutineFinished: false,
        totalWeeks: totalWeeks
    };
}

/**
 * Loads exercises for the current day based on the routine.
 */
function loadDailyRoutine() {
    const { week, dayOfWeek, isRoutineFinished } = getCurrentRoutineProgress();
    const today = new Date();

    dateDisplay.textContent = today.toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    currentWeekDisplay.textContent = `Week ${week + 1}`;
    currentDayOfWeekDisplay.textContent = `${dayOfWeek + 1}`;


    const weekRoutine = routine[week];
    let dailyExercises = weekRoutine ? weekRoutine.days[dayOfWeek] : null;

    exerciseListDiv.innerHTML = ''; // Clear previous exercises

    if (dailyExercises && dailyExercises.length > 0) {
        const ul = document.createElement('ul');
        const todayKey = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const dailyProgress = getDailyProgress(todayKey);

        dailyExercises.forEach(exerciseName => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `exercise-${exerciseName.replace(/\s/g, '-')}`; // Unique ID
            checkbox.checked = dailyProgress.includes(exerciseName);
            checkbox.dataset.exerciseName = exerciseName; // Store name for easy retrieval

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.innerHTML = `<strong>${exerciseName}</strong><br><small>${exercises[exerciseName]}</small>`;

            if (checkbox.checked) {
                li.classList.add('completed');
            }

            li.appendChild(checkbox);
            li.appendChild(label);
            ul.appendChild(li);

            checkbox.addEventListener('change', (event) => {
                toggleExerciseComplete(exerciseName, event.target.checked);
                li.classList.toggle('completed', event.target.checked);
                updateDailyProgressBar();
            });
        });
        exerciseListDiv.appendChild(ul);
    } else {
        exerciseListDiv.innerHTML = '<p>No specific exercises planned for today. Enjoy your rest or free practice!</p>';
    }

    updateDailyProgressBar(); // Initial update
    updateWeeklySummary(); // Update summary on load
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
 * @param {string} exerciseName - Name of the exercise.
 * @param {boolean} isCompleted - True if completed, false if unchecked.
 */
function toggleExerciseComplete(exerciseName, isCompleted) {
    const todayKey = new Date().toISOString().split('T')[0];
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    let dailyCompleted = progress[todayKey] || [];

    if (isCompleted && !dailyCompleted.includes(exerciseName)) {
        dailyCompleted.push(exerciseName);
    } else if (!isCompleted) {
        dailyCompleted = dailyCompleted.filter(name => name !== exerciseName);
    }

    progress[todayKey] = dailyCompleted;
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
}

/**
 * Updates the daily progress bar and text.
 */
function updateDailyProgressBar() {
    const { week, dayOfWeek } = getCurrentRoutineProgress();
    const todayKey = new Date().toISOString().split('T')[0];
    const currentDayExercises = routine[week]?.days[dayOfWeek] || [];
    const completedExercises = getDailyProgress(todayKey);

    const totalExercises = currentDayExercises.length;
    const completedCount = completedExercises.length;

    let percentage = 0;
    if (totalExercises > 0) {
        percentage = (completedCount / totalExercises) * 100;
    }

    dailyProgressBar.style.width = `${percentage}%`;
    dailyProgressText.textContent = `${completedCount}/${totalExercises} exercises complete`;
}


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
    if (currentRoutineWeekIndex > lastCalculatedWeek) {
        // Calculate summary for the just-completed week (lastCalculatedWeek)
        if (lastCalculatedWeek >= 0) { // Don't calculate for week -1
            const previousWeekData = calculateSummaryForWeek(lastCalculatedWeek, dailyProgress);
            weeklySummary.weekData[lastCalculatedWeek] = previousWeekData;
            console.log(`Summary calculated for Week ${lastCalculatedWeek + 1}`);
        }

        // Clear daily progress for dates *before* the start of the current routine week
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

        weeklySummary.lastCalculatedWeek = currentRoutineWeekIndex; // Update last calculated week
        localStorage.setItem('weeklySummary', JSON.stringify(weeklySummary));
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
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (weekIndex * 7)); // Start of the specific week
    weekStartDate.setHours(0,0,0,0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // End of the specific week
    weekEndDate.setHours(23,59,59,999);


    let totalSessions = 0;
    let completedSessions = 0;
    let totalExercisesInWeek = 0;
    let totalExercisesCompleted = 0;

    for (let d = 0; d < 7; d++) {
        const currentDayDate = new Date(weekStartDate);
        currentDayDate.setDate(weekStartDate.getDate() + d);
        const dayKey = currentDayDate.toISOString().split('T')[0];

        const dayRoutine = routine[weekIndex]?.days[d];

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
    }
}


// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
    loadDailyRoutine();
    resetWeekButton.addEventListener('click', resetAllProgress);
});
