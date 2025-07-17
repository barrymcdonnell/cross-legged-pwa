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
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 0 (Monday)
        null, // Day 1
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 2
        null, // Day 3
        ['Butterfly Stretch', 'Figure Four Stretch', 'Low Lunge', 'Clamshells', 'Glute Bridges'], // Day 4
        null, // Day 5
        null  // Day 6
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

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


// DOM Elements
const dateDisplay = document.getElementById('date-display');
const currentWeekDisplay = document.getElementById('current-week-display');
const currentDayOfWeekDisplay = document.getElementById('current-day-of-week-display');
const exerciseListDiv = document.getElementById('exercise-list');
const dailyProgressBarContainer = document.getElementById('daily-progress-container'); // NEW
const dailyProgressBar = document.getElementById('daily-progress-bar');
const dailyProgressText = document.getElementById('daily-progress-text');
const summaryContent = document.getElementById('summary-content');
const resetWeekButton = document.getElementById('reset-week-button');
const weekScheduleContent = document.getElementById('week-schedule-content'); // NEW

// --- Helper Functions ---

/**
 * Gets the current week number (0-indexed from the start date) and day of the week.
 * Stores the start date in localStorage if not present or invalid.
 * @returns {object} { week: number, dayOfWeek: number (0=Mon, 6=Sun), totalWeeks: number, isRoutineFinished: boolean }
 */
function getCurrentRoutineProgress() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    let startDateISO = localStorage.getItem('routineStartDate');
    let startDate;

    if (!startDateISO) {
        // If no start date, set it to today and initialize weekly progress
        startDate = today;
        localStorage.setItem('routineStartDate', startDate.toISOString());
        initializeWeeklyProgress();
    } else {
        startDate = new Date(startDateISO);
        // Validate if startDate parsed correctly. If not, reset it.
        if (isNaN(startDate.getTime())) { // Check if date is "Invalid Date"
            console.warn("Invalid routineStartDate found in localStorage, resetting.");
            startDate = today;
            localStorage.setItem('routineStartDate', startDate.toISOString());
            initializeWeeklyProgress(); // Re-initialize weekly summary if startDate was invalid
        }
    }

    const diffTime = Math.abs(today.getTime() - startDate.getTime()); // Use getTime() for reliable difference
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Use floor for full days passed

    // Calculate current week (0-indexed)
    const currentWeekIndex = Math.floor(diffDays / 7);
    const currentDayOfWeek = (diffDays % 7); // 0 = Day 1 of the routine week, 6 = Day 7

    // Ensure we don't go beyond the routine length
    const totalWeeks = routine.length;
    let isRoutineFinished = false;
    let effectiveWeekIndex = currentWeekIndex;

    if (currentWeekIndex >= totalWeeks) {
        // Routine is complete, or we're past 8 weeks.
        effectiveWeekIndex = totalWeeks - 1; // Stick to the last defined week's routine
        isRoutineFinished = true;
    }

    return {
        week: effectiveWeekIndex,
        dayOfWeek: currentDayOfWeek,
        isRoutineFinished: isRoutineFinished,
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
    let dailyExercises = (weekRoutine && weekRoutine.days) ? weekRoutine.days[dayOfWeek] : null;

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

        // Show progress bar and text if exercises are scheduled
        dailyProgressBarContainer.style.display = 'block';

    } else {
        exerciseListDiv.innerHTML = '<p>No specific exercises planned for today. Enjoy your rest or free practice!</p>';
        // Hide progress bar and text if no exercises are scheduled
        dailyProgressBarContainer.style.display = 'none';
    }

    updateDailyProgressBar(); // Initial update
    updateWeeklySummary(); // Update summary on load
    loadWeeklySchedule(); // Load weekly schedule too
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
    // Ensure the array access is safe
    const currentDayExercises = routine[week]?.days?.[dayOfWeek] || [];
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


// --- Weekly Schedule Logic (NEW) ---
function loadWeeklySchedule() {
    const { week: currentRoutineWeekIndex } = getCurrentRoutineProgress();
    const currentWeekRoutine = routine[currentRoutineWeekIndex];

    weekScheduleContent.innerHTML = ''; // Clear previous schedule

    if (!currentWeekRoutine || !currentWeekRoutine.days) {
        weekScheduleContent.innerHTML = '<p>No routine defined for this week.</p>';
        return;
    }

    const ul = document.createElement('ul');
    currentWeekRoutine.days.forEach((dayExercises, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<h3>${dayNames[index]}</h3>`; // Use predefined day names

        if (dayExercises && dayExercises.length > 0) {
            const exerciseUl = document.createElement('ul');
            exerciseUl.style.listStyleType = 'none'; // Remove bullets for nested list
            exerciseUl.style.paddingLeft = '0'; // Remove padding for nested list
            dayExercises.forEach(exerciseName => {
                const exerciseLi = document.createElement('li');
                exerciseLi.textContent = exerciseName;
                exerciseUl.appendChild(exerciseLi);
            });
            li.appendChild(exerciseUl);
        } else {
            li.innerHTML += '<p>Rest Day / No Scheduled Exercises</p>';
        }
        ul.appendChild(li);
    });
    weekScheduleContent.appendChild(ul);
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


// --- Tab Switching Logic (NEW) ---
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // Deactivate all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).style.display = 'block';

    // Activate the clicked tab button
    document.querySelector(`.nav-tab[data-target="${tabId}"]`).classList.add('active');

    // Special handling for summary to ensure it's up-to-date when viewed
    if (tabId === 'weekly-summary-section') {
        updateWeeklySummary();
    }
    // Special handling for weekly schedule to ensure it's up-to-date when viewed
    if (tabId === 'weekly-schedule-section') {
        loadWeeklySchedule();
    }
}


// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
    loadDailyRoutine();
    resetWeekButton.addEventListener('click', resetAllProgress);

    // Add event listeners for navbar tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (event) => {
            const targetId = event.target.dataset.target;
            showTab(targetId);
        });
    });

    // Show the daily routine tab by default on load
    showTab('daily-routine-section');
});
