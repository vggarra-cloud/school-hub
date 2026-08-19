// ============================================
// SCHOOL HUB
// Calendar reader
// ============================================

const CALENDAR_ENDPOINT = "https://aged-leaf-3b30.vggarra.workers.dev/";

let schoolCalendarEvents = [];
let schoolCalendarLoaded = false;


// ============================================
// LOAD CALENDAR
// ============================================

async function loadSchoolCalendar() {
    const response = await fetch(CALENDAR_ENDPOINT);

    if (!response.ok) {
        throw new Error(`Calendar request failed: ${response.status}`);
    }

    const calendarText = await response.text();

    schoolCalendarEvents = parseICS(calendarText);
    schoolCalendarLoaded = true;

    return schoolCalendarEvents;
}


// ============================================
// PARSE ICS
// ============================================

function parseICS(text) {
    // ICS allows continuation lines that begin
    // with a space or tab. Join those first.
    const unfolded = text.replace(/\r?\n[ \t]/g, "");

    const lines = unfolded.split(/\r?\n/);

    const events = [];
    let currentEvent = null;

    for (const line of lines) {

        if (line === "BEGIN:VEVENT") {
            currentEvent = {};
            continue;
        }

        if (line === "END:VEVENT") {
            if (currentEvent) {
                events.push(currentEvent);
            }

            currentEvent = null;
            continue;
        }

        if (!currentEvent) {
            continue;
        }

        const separator = line.indexOf(":");

        if (separator === -1) {
            continue;
        }

        const property = line.slice(0, separator);
        const value = line.slice(separator + 1);

        const propertyName = property.split(";")[0];

        if (propertyName === "UID") {
            currentEvent.uid = value;
        }

        if (propertyName === "SUMMARY") {
            currentEvent.summary = value;
        }

        if (propertyName === "DTSTART") {
            currentEvent.start = value;
            currentEvent.startProperty = property;
        }

        if (propertyName === "DTEND") {
            currentEvent.end = value;
            currentEvent.endProperty = property;
        }

        if (propertyName === "DESCRIPTION") {
            currentEvent.description = value;
        }

        if (propertyName === "LOCATION") {
            currentEvent.location = value;
        }

        if (propertyName === "STATUS") {
            currentEvent.status = value;
        }
    }

    return events;
}


// ============================================
// PARSE ICS DATE
// ============================================

function parseICSDate(value) {
    if (!value) {
        return null;
    }

    // All-day date: YYYYMMDD
    if (/^\d{8}$/.test(value)) {
        const year = Number(value.slice(0, 4));
        const month = Number(value.slice(4, 6)) - 1;
        const day = Number(value.slice(6, 8));

        return new Date(year, month, day);
    }

    // UTC date/time: YYYYMMDDTHHMMSSZ
    if (/^\d{8}T\d{6}Z$/.test(value)) {
        const year = Number(value.slice(0, 4));
        const month = Number(value.slice(4, 6)) - 1;
        const day = Number(value.slice(6, 8));
        const hour = Number(value.slice(9, 11));
        const minute = Number(value.slice(11, 13));
        const second = Number(value.slice(13, 15));

        return new Date(
            Date.UTC(
                year,
                month,
                day,
                hour,
                minute,
                second
            )
        );
    }

    // Local date/time: YYYYMMDDTHHMMSS
    if (/^\d{8}T\d{6}$/.test(value)) {
        const year = Number(value.slice(0, 4));
        const month = Number(value.slice(4, 6)) - 1;
        const day = Number(value.slice(6, 8));
        const hour = Number(value.slice(9, 11));
        const minute = Number(value.slice(11, 13));
        const second = Number(value.slice(13, 15));

        return new Date(
            year,
            month,
            day,
            hour,
            minute,
            second
        );
    }

    return null;
}


// ============================================
// NORMALIZE DATE TO MIDNIGHT
// ============================================

function startOfDay(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}


// ============================================
// DETERMINE WHETHER AN EVENT IS ALL-DAY
// ============================================

function isAllDayEvent(event) {
    return (
        event.start &&
        /^\d{8}$/.test(event.start)
    );
}


// ============================================
// GET EVENT DATE RANGE
// ============================================

function getEventRange(event) {
    const start = parseICSDate(event.start);

    if (!start) {
        return null;
    }

    let end = parseICSDate(event.end);

    // If there is no end, treat it as one day.
    if (!end) {
        end = new Date(start);
        end.setDate(end.getDate() + 1);
    }

    // For all-day ICS events, DTEND is exclusive.
    // For example:
    // DTSTART 20260817
    // DTEND   20260820
    // means Aug 17, 18, 19.
    if (isAllDayEvent(event)) {
        return {
            start: startOfDay(start),
            end: startOfDay(end)
        };
    }

    return {
        start,
        end
    };
}


// ============================================
// EVENT OCCURS ON DATE
// ============================================

function eventOccursOnDate(event, date) {
  const range = getEventRange(event);

  if (!range) {
    return false;
  }

  const dayStart = startOfDay(date);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return (
    dayStart < range.end &&
    dayEnd > range.start
  );
}


// ============================================
// EVENTS FOR A DATE
// ============================================

function getEventsForDate(date) {
    return schoolCalendarEvents.filter(event =>
        eventOccursOnDate(event, date)
    );
}


// ============================================
// DETERMINE NO-SCHOOL DAY
// ============================================

function isNoSchoolDay(date) {
    const events = getEventsForDate(date);

    return events.some(event => {

        const text = `
            ${event.summary || ""}
            ${event.description || ""}
        `.toLowerCase();

        return (
            text.includes("no school") ||
            text.includes("no-school") ||
            text.includes("student holiday") ||
            text.includes("school closed") ||
            text.includes("schools closed") ||
            text.includes("holiday") ||
            text.includes("teacher workday") ||
            text.includes("staff development")
        );
    });
}


// ============================================
// DISPLAY TODAY'S EVENTS
// ============================================

function displaySchoolEvents(date) {
    const element =
        document.getElementById("school-events");

    if (!element) {
        return;
    }

    const events =
        getEventsForDate(date);

    if (!events.length) {
        element.textContent =
            "No school events on the calendar today.";
        return;
    }

    let html = "";

    events.forEach(event => {

        html += `
            <p>
                <strong>
                    ${event.summary || "School event"}
                </strong>
        `;

        if (event.location) {
            html += `<br>${event.location}`;
        }

        html += `
            </p>
        `;
    });

    element.innerHTML = html;
}