// ===============================
// SCHOOL HUB CALENDAR ENGINE
// ===============================

// First day of school
const FIRST_DAY_OF_SCHOOL = new Date("2026-08-10");

// Resource rotation
const RESOURCE_ROTATION = [
    "A",
    "B",
    "C",
    "D",
    "E"
];

// Resource names
const RESOURCES = {
    A: "🎵 Music",
    B: "🏃 PE",
    C: "📚 Media Center",
    D: "💻 Learning Lab",
    E: "🎨 Art"
};

// Returns today's date
function getToday() {
    return new Date();
}


// Gets the district calendar file
async function getSchoolCalendar() {
    const response = await fetch("school-calendar.ics");
    const calendarText = await response.text();

    return calendarText;
}

function parseSchoolCalendar(calendarText) {
    const events = [];
    const blocks = calendarText.split("BEGIN:VEVENT");

    blocks.forEach(function(block) {
        if (!block.includes("END:VEVENT")) return;

        const summaryMatch = block.match(/SUMMARY:(.*)/);
        const startMatch = block.match(/DTSTART;VALUE=DATE:(\d{8})/);
        const endMatch = block.match(/DTEND;VALUE=DATE:(\d{8})/);

        if (summaryMatch && startMatch) {
            events.push({
                title: summaryMatch[1].trim(),
                start: startMatch[1],
                end: endMatch ? endMatch[1] : startMatch[1]
            });
        }
    });

    return events;
}

function categorizeSchoolEvent(title) {
    const text = title.toLowerCase();

    if (text.includes("no school") ||
        text.includes("holiday") ||
        text.includes("labor day") ||
        text.includes("thanksgiving") ||
        text.includes("winter break") ||
        text.includes("spring break")) {
        return "no-school";
    }

    if (text.includes("early release") ||
        text.includes("early dismissal")) {
        return "early-release";
    }

    if (text.includes("teacher planning") ||
        text.includes("teacher workday") ||
        text.includes("teacher pre-planning")) {
        return "teacher";
    }

    if (text.includes("report to class") ||
        text.includes("first day") ||
        text.includes("last day")) {
        return "school-day";
    }

    return "event";
}