// School Hub
// Version 0.2

const today = getToday();

const hour = today.getHours();

let greeting = "";

if (hour < 12) {
    greeting = "☀️ Good Morning, Victoria";
}
else if (hour < 18) {
    greeting = "🌤️ Good Afternoon, Victoria";
}
else {
    greeting = "🌙 Good Evening, Victoria";
}

document.getElementById("welcomeMessage").innerHTML = greeting;

const todayCard = document.getElementById("todayCard");


const dayName = today.toLocaleDateString("en-US", {
    weekday: "long"
});

const fullDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
});

todayCard.innerHTML = `
<strong>${dayName}</strong><br><br>
📅 ${fullDate}<br><br>
🎒 Checking school calendar...
`;


getSchoolCalendar().then(function(calendarText) {
    console.log("District calendar loaded!");
    console.log(calendarText);
});

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);

    console.log("School events found:", events);
    console.log("Number of events:", events.length);
});

function formatCalendarDate(dateString) {
    return new Date(
        Number(dateString.substring(0, 4)),
        Number(dateString.substring(4, 6)) - 1,
        Number(dateString.substring(6, 8))
    );
}

function getTodaysSchoolEvents(events) {
    const today = new Date();

    const todayString =
        today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, "0") +
        String(today.getDate()).padStart(2, "0");

    return events.filter(function(event) {
        return event.start === todayString;
    });
}

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);
    const todaysEvents = getTodaysSchoolEvents(events);

    console.log("Today's school events:", todaysEvents);
});

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);

    events.forEach(function(event) {
        event.type = categorizeSchoolEvent(event.title);
    });

    console.log("Categorized school events:", events);
});

function updateTodayCard(events) {
    const todayEvents = getTodaysSchoolEvents(events);

    const today = new Date();

    const todayDisplay = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    const firstSchoolDay = new Date("2026-08-10");

    const daysUntilSchool = Math.ceil(
        (firstSchoolDay - today) / (1000 * 60 * 60 * 24)
    );

    let todayHTML = `
        <p>
            <strong>${todayDisplay}</strong><br>
    `;

    if (daysUntilSchool > 0) {
        todayHTML += `
            🎒 School starts in <strong>${daysUntilSchool} days</strong><br>
            Monday, August 10
        `;
    } else {
        todayHTML += `
            🏫 School is in session
        `;
    }

    todayHTML += `</p>`;

    if (todayEvents.length > 0) {
        todayHTML += `
            <p>
                <strong>🎉 Today's School Events:</strong><br>
                ${todayEvents.map(function(event) {
                    return "📌 " + event.title;
                }).join("<br>")}
            </p>
        `;
    }

    todayHTML += `
        <details>
            <summary>Transportation</summary>

            <p><strong>Eddie</strong><br>
            AM Pickup: <strong>6:55 AM</strong><br>
            PM Dropoff: <strong>${eddiePMDropoff}</strong><br>
            AM Bus: <strong>2447</strong><br>
            PM Bus: <strong>2646</strong>
            </p>

            <p><strong>Elena</strong><br>
            AM Pickup: <strong>7:47 AM</strong><br>
            PM Dropoff: <strong>${elenaPMDropoff}</strong><br>
            Bus: <strong>2456</strong>
            </p>

        </details>
    `;

    todayCard.innerHTML = todayHTML;
}

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);

    events.forEach(function(event) {
        event.type = categorizeSchoolEvent(event.title);
    });

    updateTodayCard(events);
});


// ==========================================
// EDDIE DASHBOARD
// ==========================================

function updateEddieCard() {
    const eddieCard = document.querySelector(".card.eddie");

    if (!eddieCard) {
        return;
    }

    const today = getToday();
    const schedule = getEddieSchedule(today);

    const dayName = today.toLocaleDateString("en-US", {
        weekday: "long"
    });

    // Determine whether today is Wednesday
    const isWednesday = today.getDay() === 3;

    // Get current time in minutes
    const currentMinutes =
        today.getHours() * 60 + today.getMinutes();

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

    // Find what Eddie is doing right now
    let currentPeriod = null;
    let nextPeriod = null;

    for (let i = 0; i < schedule.length; i++) {
        const period = schedule[i];

        const startMinutes = timeToMinutes(period.start);
        const endMinutes = timeToMinutes(period.end);

        if (
            currentMinutes >= startMinutes &&
            currentMinutes < endMinutes
        ) {
            currentPeriod = period;
            nextPeriod = schedule[i + 1] || null;
            break;
        }

        if (currentMinutes < startMinutes) {
            nextPeriod = period;
            break;
        }
    }


let statusHTML = "";

const firstSchoolDay = new Date("2026-08-10");
firstSchoolDay.setHours(0, 0, 0, 0);

const todayOnly = new Date(today);
todayOnly.setHours(0, 0, 0, 0);

// Before the first day of school
if (todayOnly < firstSchoolDay) {

    const firstPeriod = schedule[0];

    statusHTML =
        "<p><strong>🎒 School starts Monday, August 10</strong></p>" +
        "<p><strong>First class:</strong> " +
        firstPeriod.className +
        "<br>" +
       firstPeriod.teacher +
"<br>" +
"Room " + firstPeriod.room +
"<br>" +
firstPeriod.start +
" – " +
firstPeriod.end +
        "</p>";

} else if (currentPeriod) {

    if (currentPeriod.period === "Lunch") {

        statusHTML =
            "<p><strong>🍎 Right now:</strong> Lunch</p>";

    } else {

        statusHTML =
            "<p><strong>📚 Right now:</strong> " +
            currentPeriod.className +
            "<br>" +
            currentPeriod.teacher +
"<br>" +
"Room " + currentPeriod.room +
"<br>" +
currentPeriod.start +
" – " +
currentPeriod.end +
            "</p>";
    }

    if (nextPeriod) {

        if (nextPeriod.period === "Lunch") {

            statusHTML +=
                "<p><strong>Next:</strong> 🍎 Lunch<br>" +
                nextPeriod.start +
                " – " +
                nextPeriod.end +
                "</p>";

        } else {

            statusHTML +=
                "<p><strong>Next:</strong> " +
                nextPeriod.className +
                "<br>" +
               nextPeriod.teacher +
"<br>" +
"Room " + nextPeriod.room +
"<br>" +
nextPeriod.start +
" – " +
nextPeriod.end +
                "</p>";
        }

    } else {

        statusHTML +=
            "<p><strong>🏠 School day complete</strong></p>";
    }

} else if (nextPeriod) {

    if (nextPeriod.period === "Lunch") {

        statusHTML =
            "<p><strong>Next:</strong> 🍎 Lunch<br>" +
            nextPeriod.start +
            " – " +
            nextPeriod.end +
            "</p>";

    } else {

        statusHTML =
            "<p><strong>Next:</strong> " +
            nextPeriod.className +
            nextPeriod.teacher +
"<br>" +
"Room " + nextPeriod.room +
"<br>" +
nextPeriod.start +
" – " +
nextPeriod.end +
            "</p>";
    }

} else {

    statusHTML =
        "<p><strong>🏠 School day complete</strong></p>";
}


    // Build the full schedule for the dropdown
    const scheduleHTML = schedule.map(function(period) {

        if (period.period === "Lunch") {
            return (
                "<div>" +
                "<strong>Lunch</strong> — " +
                period.start +
                "–" +
                period.end +
                "</div>"
            );
        }

        return (
            "<div>" +
            "<strong>" +
            period.period +
            "</strong> — " +
            period.start +
            "–" +
            period.end +
            "<br>" +
            period.className +
            "<br>" +
            period.teacher +
            " · Room " +
            period.room +
            "</div>"
        );

    }).join("<br>");

    const scheduleLabel = isWednesday
        ? "Wednesday Early Release"
        : "Regular Schedule";

    eddieCard.innerHTML =
        "<h2>💛 Eddie</h2>" +
        "<p><strong>" +
        dayName +
        "</strong> · 7th Grade</p>" +
        "<p>🕐 " +
        scheduleLabel +
        "</p>" +
        statusHTML +
        "<details>" +
        "<summary>View full schedule</summary>" +
        "<div style='margin-top: 12px;'>" +
        scheduleHTML +
        "</div>" +
        "</details>";
}

updateEddieCard();


// =====================================================
// ELENA DASHBOARD
// =====================================================

function getElenaCurrentAndNext(schedule, now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let current = null;
    let next = null;

    function toMinutes(timeString) {
        const parts = timeString.split(" ");
        const time = parts[0];
        const ampm = parts[1];

        const timeParts = time.split(":");
        let hours = Number(timeParts[0]);
        const minutes = Number(timeParts[1]);

        if (ampm === "PM" && hours !== 12) {
            hours += 12;
        }

        if (ampm === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    }

    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];

        const start = toMinutes(item.start);
        const end = toMinutes(item.end);

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
function updateElenaCard(events) {
    const elenaCard = document.querySelector(".card.elena");

    if (!elenaCard) {
        return;
    }

    const today = new Date();
    const dayOfWeek = today.getDay();

    // Wednesday = early release, no resource
    if (dayOfWeek === 3) {
        elenaCard.innerHTML = `
            <h2>💜 Elena</h2>
            <p><strong>Wednesday Early Release</strong></p>
            <p>🏫 School ends at <strong>1:45 PM</strong></p>
            <p>No Resource Class</p>

            <details>
                <summary>View regular schedule</summary>
                <div class="schedule-details">
                    ${getElenaSchedule().map(function(item) {
                        return `<p><strong>${item.start}–${item.end}</strong> — ${item.className}</p>`;
                    }).join("")}
                </div>
            </details>
        `;

        return;
    }

    // Regular school day
    let rotationLetter = "";

if (typeof getElenaResourceDay === "function") {
    rotationLetter = getElenaResourceDay(events);
}

  let resource = "";

if (rotationLetter) {
    resource = getElenaResource(rotationLetter);
} else {
    resource = "Starts Monday — Music (A Day)";
}

const elenaSchedule = getElenaSchedule();
const nowInfo = getElenaCurrentAndNext(elenaSchedule, new Date());

let currentHTML = "";

if (nowInfo.current) {
    currentHTML =
        "<p><strong>📚 Right now:</strong> " +
        nowInfo.current.className +
        "<br>" +
        nowInfo.current.start +
        " – " +
        nowInfo.current.end +
        "</p>";
} else if (nowInfo.next) {
    currentHTML =
        "<p><strong>📚 Next:</strong> " +
        nowInfo.next.className +
        "<br>" +
        nowInfo.next.start +
        " – " +
        nowInfo.next.end +
        "</p>";
} else {
    const firstSchoolDay = new Date("2026-08-10");
    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);

    if (todayOnly < firstSchoolDay) {
        currentHTML =
            "<p><strong>🎒 School starts Monday, August 10</strong></p>" +
            "<p>🎵 First resource: Music (A Day)</p>";
    } else {
        currentHTML =
            "<p><strong>🏠 School day complete</strong></p>";
    }
}

if (nowInfo.current && nowInfo.next) {
    currentHTML +=
        "<p><strong>Next:</strong> " +
        nowInfo.next.className +
        "<br>" +
        nowInfo.next.start +
        " – " +
        nowInfo.next.end +
        "</p>";
}

elenaCard.innerHTML = `
    <h2>💜 Elena</h2>

    <p><strong>Today's Resource:</strong> ${resource}</p>

    ${currentHTML}

    <details>
        <summary>View full schedule</summary>
        <div class="schedule-details">
            ${getElenaSchedule().map(function(item) {
                return "<p><strong>" + item.start + "–" + item.end +
                    "</strong> — " + item.className + "</p>";
            }).join("")}
        </div>
    </details>
`;
}

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);

    events.forEach(function(event) {
        event.type = categorizeSchoolEvent(event.title);
    });

    updateElenaCard(events);
});


// BUS INFORMATION
const busToday = new Date();
const isWednesday = busToday.getDay() === 3;

const eddiePMPickup = isWednesday ? "12:50 PM" : "1:50 PM";
const eddiePMDropoff = isWednesday ? "1:32 PM" : "2:32 PM";

const elenaPMPickup = isWednesday ? "1:45 PM" : "2:45 PM";
const elenaPMDropoff = isWednesday ? "2:22 PM" : "3:22 PM";

todayCard.innerHTML = `
<details>
<summary>Transportation</summary>

<p><strong>Eddie</strong><br>
AM Pickup: <strong>6:55 AM</strong><br>
PM Dropoff: <strong>${eddiePMDropoff}</strong><br>
AM Bus: <strong>2447</strong><br>
PM Bus: <strong>2646</strong>
</p>

<p><strong>Elena</strong><br>
AM Pickup: <strong>7:47 AM</strong><br>
PM Dropoff: <strong>${elenaPMDropoff}</strong><br>
Bus: <strong>2456</strong>
</p>

</details>
`;


const todayDate = new Date();

const todayDisplay = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});

const firstSchoolDay = new Date("2026-08-10");
const daysUntilSchool = Math.ceil(
    (firstSchoolDay - todayDate) / (1000 * 60 * 60 * 24)
);

let todayHeader = `
<p>
<strong>${todayDisplay}</strong><br>
🎒 School starts in <strong>${daysUntilSchool} days</strong><br>
Monday, August 10
</p>
`;

todayCard.innerHTML = todayHeader + todayCard.innerHTML;

getSchoolCalendar().then(function(calendarText) {
    const events = parseSchoolCalendar(calendarText);
    const todaysEvents = getTodaysSchoolEvents(events);

    if (todaysEvents.length > 0) {
        const eventList = todaysEvents.map(function(event) {
            return "🎉 " + event.title;
        }).join("<br>");

        todayCard.innerHTML += `
        <hr>
        <p><strong>🎉 Special Events</strong><br>
        ${eventList}</p>
        `;
    }
});