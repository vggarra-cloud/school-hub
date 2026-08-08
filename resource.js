// ==========================================
// EDDIE — GAMBLE ROGERS MIDDLE SCHOOL
// 7TH GRADE
// ==========================================

// Eddie does NOT use the A/B/C/D/E rotation.
// His class schedule is the same every regular day.

const EDDIE_SCHEDULE = {
    regular: [
        {
            period: "1st",
            start: "7:30 AM",
            end: "8:21 AM",
            className: "Advanced ELA",
            teacher: "Ms. Parent",
            room: "460"
        },
        {
            period: "2nd",
            start: "8:24 AM",
            end: "9:10 AM",
            className: "Math 2",
            teacher: "Ms. Wilson",
            room: "475"
        },
        {
            period: "3rd",
            start: "9:13 AM",
            end: "9:59 AM",
            className: "Advanced Band",
            teacher: "Ms. Shaker",
            room: "890"
        },
        {
            period: "4th",
            start: "10:02 AM",
            end: "10:48 AM",
            className: "Advanced US History",
            teacher: "Mr. Pritikin",
            room: "430"
        },
        {
            period: "Lunch",
            start: "10:48 AM",
            end: "11:18 AM",
            className: "Lunch",
            teacher: "",
            room: ""
        },
        {
            period: "5th",
            start: "11:21 AM",
            end: "12:07 PM",
            className: "PE Team Sports",
            teacher: "Coach Steward",
            room: "810"
        },
        {
            period: "6th",
            start: "12:10 PM",
            end: "12:56 PM",
            className: "Comprehensive Science 2",
            teacher: "Mr. Matthews",
            room: "455"
        },
        {
            period: "7th",
            start: "12:59 PM",
            end: "1:48 PM",
            className: "Jazz Band",
            teacher: "Ms. Shaker",
            room: "890"
        }
    ],

    wednesday: [
        {
            period: "1st",
            start: "7:30 AM",
            end: "8:11 AM",
            className: "Advanced ELA",
            teacher: "Ms. Parent",
            room: "460"
        },
        {
            period: "2nd",
            start: "8:14 AM",
            end: "8:52 AM",
            className: "Math 2",
            teacher: "Ms. Wilson",
            room: "475"
        },
        {
            period: "3rd",
            start: "8:55 AM",
            end: "9:33 AM",
            className: "Advanced Band",
            teacher: "Ms. Shaker",
            room: "890"
        },
        {
            period: "4th",
            start: "9:36 AM",
            end: "10:14 AM",
            className: "Advanced US History",
            teacher: "Mr. Pritikin",
            room: "430"
        },
        {
            period: "Lunch",
            start: "10:14 AM",
            end: "10:44 AM",
            className: "Lunch",
            teacher: "",
            room: ""
        },
        {
            period: "5th",
            start: "10:47 AM",
            end: "11:25 AM",
            className: "PE Team Sports",
            teacher: "Coach Steward",
            room: "810"
        },
        {
            period: "6th",
            start: "11:28 AM",
            end: "12:06 PM",
            className: "Comprehensive Science 2",
            teacher: "Mr. Matthews",
            room: "455"
        },
        {
            period: "7th",
            start: "12:09 PM",
            end: "12:48 PM",
            className: "Jazz Band",
            teacher: "Ms. Shaker",
            room: "890"
        }
    ]
};


// Returns Eddie's schedule for the current day.
// Wednesday gets the early-release schedule.
// Every other school day gets the regular schedule.

function getEddieSchedule(date) {
    const day = date.getDay();

    if (day === 3) {
        return EDDIE_SCHEDULE.wednesday;
    }

    return EDDIE_SCHEDULE.regular;
}


// =====================================================
// ELENA - MASON ELEMENTARY SCHOOL
// =====================================================

const ELENA_RESOURCE_ROTATION = {
    A: "Music",
    B: "PE",
    C: "Media Center",
    D: "Learning Lab",
    E: "Art"
};

const ELENA_SCHEDULE = [
    { start: "8:05 AM", end: "8:25 AM", className: "Morning Procedures" },
    { start: "8:25 AM", end: "8:40 AM", className: "Teacher Lead PE" },
    { start: "8:40 AM", end: "9:10 AM", className: "Intervention Block" },
    { start: "9:10 AM", end: "10:50 AM", className: "Math & Science Block" },
    { start: "10:50 AM", end: "10:55 AM", className: "Switch" },
    { start: "10:55 AM", end: "11:25 AM", className: "Lunch" },
    { start: "11:30 AM", end: "11:50 AM", className: "Recess" },
    { start: "11:55 AM", end: "12:25 PM", className: "Intervention Block" },
    { start: "12:25 PM", end: "1:55 PM", className: "ELA & Social Studies Block" },
    { start: "2:00 PM", end: "2:40 PM", className: "Resource" },
    { start: "2:45 PM", end: "2:50 PM", className: "Dismissal Procedures" }
];

// Finds what Elena is doing right now
function getElenaCurrentAndNext(schedule, date) {
    const currentMinutes =
        date.getHours() * 60 + date.getMinutes();

    function timeToMinutes(timeString) {
        const parts = timeString.split(" ");
        const time = parts[0];
        const ampm = parts[1];

        let [hours, minutes] = time.split(":").map(Number);

        if (ampm === "PM" && hours !== 12) {
            hours += 12;
        }

        if (ampm === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    }

    let current = null;
    let next = null;

    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];

        const start = timeToMinutes(item.start);
        const end = timeToMinutes(item.end);

        if (currentMinutes >= start && currentMinutes < end) {
            current = item;
            next = schedule[i + 1] || null;
            break;
        }

        if (currentMinutes < start) {
            next = item;
            break;
        }
    }

    return {
        current: current,
        next: next
    };
}

function getElenaResource(rotationLetter) {
    return ELENA_RESOURCE_ROTATION[rotationLetter] || "";
}

function getElenaSchedule() {
    return ELENA_SCHEDULE;
}


// =====================================================
// ELENA RESOURCE ROTATION
// =====================================================

const ELENA_FIRST_SCHOOL_DAY = new Date("2026-08-10");

// Monday, August 10 is an A day.
const ELENA_FIRST_RESOURCE_DAY = "A";

const ELENA_ROTATION = ["A", "B", "C", "D", "E"];

function isElenaSchoolDay(date, events) {
    const day = date.getDay();

    // Saturday and Sunday
    if (day === 0 || day === 6) {
        return false;
    }

    const dateString =
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0");

    const dayEvents = events.filter(function(event) {
        return event.start === dateString;
    });

    const noSchool = dayEvents.some(function(event) {
        const title = event.title.toLowerCase();

        return (
            title.includes("no school") ||
            title.includes("holiday") ||
            title.includes("teacher planning") ||
            title.includes("teacher workday") ||
            title.includes("teacher pre-planning") ||
            title.includes("winter break") ||
            title.includes("spring break") ||
            title.includes("thanksgiving break")
        );
    });

    return !noSchool;
}

function getElenaResourceDay(events) {
    const today = new Date();

    let schoolDays = 0;
    const currentDate = new Date(ELENA_FIRST_SCHOOL_DAY);

    while (currentDate <= today) {
        if (isElenaSchoolDay(currentDate, events)) {
            schoolDays++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    const firstIndex = ELENA_ROTATION.indexOf(
        ELENA_FIRST_RESOURCE_DAY
    );

    const rotationIndex =
        (firstIndex + schoolDays - 1) %
        ELENA_ROTATION.length;

    return ELENA_ROTATION[rotationIndex];
}