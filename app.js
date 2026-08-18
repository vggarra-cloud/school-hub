// ============================================
// SCHOOL HUB
// Main dashboard logic
// ============================================


// ============================================
// DATE / TIME HELPERS
// ============================================

function getToday() {
    return new Date();
}

function isWednesday(date) {
    return date.getDay() === 3;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function timeToMinutes(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
}


// ============================================
// TODAY'S SCHEDULE
// ============================================

function getEddieSchedule(date) {
    return isWednesday(date)
        ? EDDIE_WEDNESDAY_SCHEDULE
        : EDDIE_REGULAR_SCHEDULE;
}

function getElenaSchedule(date) {
    return isWednesday(date)
        ? ELENA_WEDNESDAY_SCHEDULE
        : ELENA_REGULAR_SCHEDULE;
}


// ============================================
// CURRENT + NEXT CLASS
// ============================================

function getCurrentAndNext(schedule, now) {
    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

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
        current,
        next
    };
}


// ============================================
// TEACHER LINKS
// ============================================

function teacherHTML(item) {
    if (!item || !item.teacher) {
        return "";
    }

    if (item.email) {
        return `<a href="mailto:${item.email}">${item.teacher}</a>`;
    }

    return item.teacher;
}


// ============================================
// CURRENT / NEXT DISPLAY
// ============================================

function displayClassInfo(elementId, item) {
    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    if (!item) {
        element.innerHTML = "—";
        return;
    }

    function formatTime(time) {
        if (!time) {
            return "";
        }

        // Already formatted
        if (/[AP]M/i.test(time)) {
            return time;
        }

        const parts = time.split(":");
        let hour = parseInt(parts[0], 10);
        const minute = parts[1] || "00";

        if (isNaN(hour)) {
            return time;
        }

        const suffix = hour >= 12 ? "PM" : "AM";

        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour -= 12;
        }

        return `${hour}:${minute} ${suffix}`;
    }

    let emoji = "📚";

    if (item.name && item.name.toLowerCase().includes("lunch")) {
        emoji = "🍎";
    }

    const timeStart = formatTime(item.start);
    const timeEnd = formatTime(item.end);

    let html = "";

    html += `<strong>${emoji} ${item.name}</strong>`;

    if (item.teacher) {
        html += `<br>${teacherHTML(item)}`;
    }

    if (item.room) {
        html += `<br>Room ${item.room}`;
    }

    if (timeStart && timeEnd) {
        html += `<br>${timeStart} – ${timeEnd}`;
    }

    element.innerHTML = html;
}

// ============================================
// FULL SCHEDULE DISPLAY
// ============================================

function displaySchedule(elementId, schedule) {
    const container = document.getElementById(elementId);

    if (!container) {
        return;
    }

    if (!schedule || schedule.length === 0) {
        container.innerHTML =
            "<p>Schedule information unavailable.</p>";
        return;
    }

    let html = "";

    schedule.forEach(item => {
        html += `
            <div class="schedule-row">
                <div class="schedule-time">
                    ${item.start}–${item.end}
                </div>

                <div>
                    <strong>${item.name}</strong>
        `;

        if (item.teacher) {
            html += `<br>${teacherHTML(item)}`;
        }

        if (item.room) {
            html += `<br>Room ${item.room}`;
        }

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


// ============================================
// EDDIE FULL SCHEDULE
// ============================================

function buildEddieSchedule(date) {
    const bellSchedule = getEddieSchedule(date);

    return bellSchedule.map(block => {

        if (block.name === "Lunch") {
            return {
                ...block
            };
        }

        const periodNumber = Number(
            block.name.replace(/\D/g, "")
        );

        const classInfo = EDDIE_CLASSES.find(
            course => course.period === periodNumber
        );

        return {
            ...block,
            ...(classInfo || {})
        };
    });
}


// ============================================
// ELENA FULL SCHEDULE
// ============================================

function buildElenaSchedule(date) {
    return getElenaSchedule(date);
}


// ============================================
// ELENA RESOURCE ROTATION
// ============================================
//
// Anchor:
// August 10, 2026 = A Day
//
// Rules:
// - Regular school days advance the rotation.
// - Wednesday does NOT advance.
// - Weekends do NOT advance.
// - Student holidays / no-school days do NOT advance.
// - Wednesday has no resource.
// - After E comes A.
//

function getElenaResourceLetter(date) {
    const anchor = new Date(2026, 7, 10);

    const current = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    if (current < anchor) {
        return null;
    }

    // Today itself cannot have a resource on Wednesday.
    if (isWednesday(current)) {
        return null;
    }

    // Count how many resource-advancing school days
    // have occurred after the anchor.
    let advancementCount = 0;

    const cursor = new Date(anchor);

    while (cursor < current) {
        const day = cursor.getDay();

        const weekend =
            day === 0 || day === 6;

        const wednesday =
            day === 3;

        const noSchool =
            isNoSchoolDay(cursor);

        if (!weekend && !wednesday && !noSchool) {
            advancementCount++;
        }

        cursor.setDate(cursor.getDate() + 1);
    }

    const letters = ["A", "B", "C", "D", "E"];

    return letters[advancementCount % letters.length];
}


function getElenaResource(date) {
    // No resource on weekends.
    if (isWeekend(date)) {
        return null;
    }

    // No resource on Wednesday.
    if (isWednesday(date)) {
        return null;
    }

    // No resource on a student holiday/no-school day.
    if (isNoSchoolDay(date)) {
        return null;
    }

    const letter = getElenaResourceLetter(date);

    if (!letter) {
        return null;
    }

    return ELENA_RESOURCE_ROTATION[letter] || null;
}


// ============================================
// RESOURCE DISPLAY
// ============================================

function displayElenaResource(date) {
    const element =
        document.getElementById("elena-resource");

    if (!element) {
        return;
    }

    const resource =
        getElenaResource(date);

    if (!resource) {
        element.innerHTML = "None";
        return;
    }

    let html =
        `<strong>${resource.name}</strong>`;

    if (resource.teacher) {
        html += "<br>";

        if (resource.email) {
            html += `
                <a href="mailto:${resource.email}">
                    ${resource.teacher}
                </a>
            `;
        } else {
            html += resource.teacher;
        }
    }

    element.innerHTML = html;
}


// ============================================
// BUS DISPLAY
// ============================================

function displayBusSchedule(elementId, busData, busNumbers, date) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    const times = isWednesday(date)
        ? busData.wednesday
        : busData.regular;

    const amBus =
        isWednesday(date)
            ? busNumbers.am
            : busNumbers.am;

    const pmBus =
        isWednesday(date)
            ? busNumbers.pm
            : busNumbers.pm;

    element.innerHTML = `
        <p>
            <strong>AM pickup:</strong>
            ${times.pickup}
        </p>

        <p>
            <strong>PM drop-off:</strong>
            ${times.dropoff}
        </p>

        <p>
            <strong>Bus:</strong>
            ${amBus}${amBus !== pmBus ? ` AM / ${pmBus} PM` : ""}
        </p>
    `;
}


// ============================================
// TODAY DISPLAY
// ============================================

function displayToday(date) {
    const dateElement =
        document.getElementById("today-date");

    const earlyReleaseElement =
        document.getElementById("early-release");

    if (!dateElement || !earlyReleaseElement) {
        return;
    }

   const dateText =
    date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "numeric",
        day: "numeric"
    }).replace(",", "");

dateElement.innerHTML = `<strong>${dateText}</strong>`;

    if (isWednesday(date)) {
        earlyReleaseElement.textContent =
            "Early Release Day";
    } else {
        earlyReleaseElement.textContent = "";
    }
}


// ============================================
// TODAY'S CALENDAR EVENTS
// ============================================

// ============================================================
// WEEKLY CALENDAR EVENTS
// ============================================================

function displaySchoolEvents(date) {
    const element = document.getElementById("school-events");

    if (!element) {
        return;
    }

    const dayOfWeek = date.getDay();

    // Find Monday of the current school week.
    // On Saturday/Sunday, show the upcoming Monday-Friday.
    let monday = new Date(date);

    if (dayOfWeek === 0) {
        monday.setDate(date.getDate() + 1);
    } else if (dayOfWeek === 6) {
        monday.setDate(date.getDate() + 2);
    } else {
        monday.setDate(date.getDate() - (dayOfWeek - 1));
    }

    monday.setHours(0, 0, 0, 0);

    const todayKey = date.toDateString();

    let html = "";

   // ========================================================
// TODAY'S EVENTS
// ========================================================

const todayEvents = getEventsForDate(date);
const todayNoSchool = isNoSchoolDay(date);
const todayWednesday = isWednesday(date);

html += `
    <div class="today-events">
`;
    if (todayNoSchool) {
        html += `
            <p><strong>🏫 Student Holiday</strong></p>
            <p>No school</p>
        `;
    } else {
        if (todayWednesday) {
            html += `
                <p>Early Release Day</p>
            `;
        }

        if (todayEvents.length) {
            todayEvents.forEach(event => {
                html += `
                    <p>
                        ${event.summary || "School event"}
                `;

                if (event.location) {
                    html += `<br>${event.location}`;
                }

                html += `</p>`;
            });
        } else if (!todayWednesday) {
            html += `
                <p>No events</p>
            `;
        }
    }

    html += `
        </div>

        <hr>

        <div class="week-events">
            <h2 class="school-events-section-title">This Week</h2>
    `;

    // ========================================================
    // REST OF WEEK
    // ========================================================

    for (let i = 1; i < 5; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);

        const events = getEventsForDate(currentDate);
        const noSchool = isNoSchoolDay(currentDate);
        const wednesday = isWednesday(currentDate);

        html += `
            <div class="week-day">
                <p>
                    <strong>${currentDate.toLocaleDateString("en-US", {
                        weekday: "long"
                    })} ${currentDate.getMonth() + 1}/${currentDate.getDate()}</strong>
                </p>
        `;

        if (noSchool) {
            html += `
                <p>🏫 Student Holiday — No school</p>
            `;
        } else {
            if (wednesday) {
                html += `
                    <p>Early Release Day</p>
                `;
            }

            if (events.length) {
                events.forEach(event => {
                    html += `
                        <p>
                            ${event.summary || "School event"}
                    `;

                    if (event.location) {
                        html += `<br>${event.location}`;
                    }

                    html += `</p>`;
                });
            } else if (!wednesday) {
                html += `
                    <p>No events</p>
                `;
            }
        }

        html += `
            </div>
        `;
    }

    html += `
        </div>
    `;

    element.innerHTML = html;
}

// ============================================
// SCHOOL INFORMATION
// ============================================

function displaySchoolInfo() {
    const mason = SCHOOLS.mason;
    const gamble = SCHOOLS.gamble;

    document.getElementById("mason-info").innerHTML = `
        <p>
            <strong>Website:</strong>
            <a href="${mason.website}" target="_blank">
                ${mason.website}
            </a>
        </p>

        <p>
            <strong>Email:</strong>
            <a href="mailto:${mason.email}">
                ${mason.email}
            </a>
        </p>

        <p>
            <strong>Phone:</strong>
            <a href="tel:${mason.phone}">
                ${mason.phone}
            </a>
        </p>

        <p>
            <strong>Address:</strong><br>
            207 Mason Manatee Way<br>
            St. Augustine, FL 32086
        </p>

        <p>
            <strong>School Hours</strong><br>
            Regular: ${mason.hours.regular}<br>
            Wednesday: ${mason.hours.wednesday}
        </p>

        <p>
            <strong>Drop-off / Tardy</strong><br>
            Drop-off: ${mason.arrival.dropoff}<br>
            Tardy: ${mason.arrival.tardy}
        </p>

        <p>
            <strong>Forms:</strong>
            <a href="${mason.forms}" target="_blank">
                ParentSquare Forms
            </a>
        </p>
    `;

    document.getElementById("gamble-info").innerHTML = `
        <p>
            <strong>Website:</strong>
            <a href="${gamble.website}" target="_blank">
                ${gamble.website}
            </a>
        </p>

        <p>
            <strong>Email:</strong>
            <a href="mailto:${gamble.email}">
                ${gamble.email}
            </a>
        </p>

        <p>
            <strong>Phone:</strong>
            <a href="tel:${gamble.phone}">
                ${gamble.phone}
            </a>
        </p>

        <p>
            <strong>Address:</strong><br>
            6250 US 1 South<br>
            St. Augustine, FL 32086
        </p>

        <p>
            <strong>School Hours</strong><br>
            Regular: ${gamble.hours.regular}<br>
            Wednesday: ${gamble.hours.wednesday}
        </p>

        <p>
            <strong>Drop-off / Tardy</strong><br>
            Drop-off: ${gamble.arrival.dropoff}<br>
            Tardy: ${gamble.arrival.tardy}
        </p>

        <p>
            <strong>Forms:</strong>
            <a href="${gamble.forms}" target="_blank">
                ParentSquare Forms
            </a>
        </p>
    `;
}


// ============================================
// INITIALIZE SCHOOL HUB
// ============================================

async function initSchoolHub() {

    // Calendar must load first because
    // Elena's resource rotation depends on
    // knowing school holidays.
    try {
        await loadSchoolCalendar();
    } catch (error) {
        console.error(
            "School calendar failed to load:",
            error
        );
    }

    const now = new Date();
    const today = getToday();

   const eddieSchedule =
    buildEddieSchedule(today);

    const elenaSchedule =
        getElenaSchedule(today);

    const eddieInfo =
        getCurrentAndNext(
            eddieSchedule,
            now
        );

    const elenaInfo =
        getCurrentAndNext(
            elenaSchedule,
            now
        );

    // Current / Next
    displayClassInfo(
        "eddie-current",
        eddieInfo.current
    );

    displayClassInfo(
        "eddie-next",
        eddieInfo.next
    );

    displayClassInfo(
        "elena-current",
        elenaInfo.current
    );

    displayClassInfo(
        "elena-next",
        elenaInfo.next
    );

    // Full schedules
    displaySchedule(
        "eddie-schedule",
        buildEddieSchedule(today)
    );

    displaySchedule(
        "elena-schedule",
        buildElenaSchedule(today)
    );

    // Resource
    displayElenaResource(today);

    // Bus
    displayBusSchedule(
        "eddie-bus",
        EDDIE_BUS,
        {
            am: "2447",
            pm: "2646"
        },
        today
    );

    displayBusSchedule(
        "elena-bus",
        ELENA_BUS,
        {
            am: "2456",
            pm: "2456"
        },
        today
    );

    // Today
    displayToday(today);
    displaySchoolEvents(today);

    // School info
    displaySchoolInfo();
}


// ============================================
// START AFTER PAGE LOAD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    initSchoolHub
);