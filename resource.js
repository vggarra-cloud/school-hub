// ============================================
// SCHOOL HUB
// Schedule + Contact Data
// ============================================


// ============================================
// EDDIE
// ============================================

const EDDIE_CLASSES = [
    {
        period: 1,
        name: "Advanced ELA",
        teacher: "Ms. Parent",
        email: "Madison.Parent@stjohns.k12.fl.us",
        room: "460"
    },
    {
        period: 2,
        name: "Math 2",
        teacher: "Ms. Wilson",
        email: "erika.wilson@stjohns.k12.fl.us",
        room: "475"
    },
    {
        period: 3,
        name: "Advanced Band",
        teacher: "Ms. Sekhar",
        email: "Neeraja.Chandrasekharan@stjohns.k12.fl.us",
        room: "890"
    },
    {
        period: 4,
        name: "Advanced History",
        teacher: "Mr. Pritikin",
        email: "Tamara.Serenita@stjohns.k12.fl.us",
        room: "430"
    },
    {
        period: 5,
        name: "Team Sports",
        teacher: "Coach Steward",
        email: "Tony.Steward@stjohns.k12.fl.us",
        room: "810"
    },
    {
        period: 6,
        name: "Comprehensive Science 2",
        teacher: "Mr. Matthews",
        email: "Michael.Matthews@stjohns.k12.fl.us",
        room: "455"
    },
    {
        period: 7,
        name: "Jazz Band",
        teacher: "Ms. Sekhar",
        email: "Neeraja.Chandrasekharan@stjohns.k12.fl.us",
        room: "890"
    }
];


// Eddie regular bell schedule
const EDDIE_REGULAR_SCHEDULE = [
    { name: "1st", start: "7:30 AM", end: "8:21 AM" },
    { name: "2nd", start: "8:24 AM", end: "9:10 AM" },
    { name: "3rd", start: "9:13 AM", end: "9:59 AM" },
    { name: "4th", start: "10:02 AM", end: "10:48 AM" },
    { name: "Lunch", start: "10:48 AM", end: "11:18 AM" },
    { name: "5th", start: "11:21 AM", end: "12:07 PM" },
    { name: "6th", start: "12:10 PM", end: "12:56 PM" },
    { name: "7th", start: "12:59 PM", end: "1:48 PM" }
];


// Eddie Wednesday / early-release bell schedule
const EDDIE_WEDNESDAY_SCHEDULE = [
    { name: "1st", start: "7:30 AM", end: "8:11 AM" },
    { name: "2nd", start: "8:14 AM", end: "8:52 AM" },
    { name: "3rd", start: "8:55 AM", end: "9:33 AM" },
    { name: "4th", start: "9:36 AM", end: "10:14 AM" },
    { name: "Lunch", start: "10:14 AM", end: "10:44 AM" },
    { name: "5th", start: "10:47 AM", end: "11:25 AM" },
    { name: "6th", start: "11:28 AM", end: "12:06 PM" },
    { name: "7th", start: "12:09 PM", end: "12:48 PM" }
];


// Eddie bus times
const EDDIE_BUS = {
    regular: {
        pickup: "6:55 AM",
        dropoff: "2:32 PM"
    },
    wednesday: {
        pickup: "6:55 AM",
        dropoff: "1:32 PM"
    }
};


// ============================================
// ELENA
// ============================================

// Elena regular schedule
const ELENA_REGULAR_SCHEDULE = [
    {
        name: "Morning Procedures",
        start: "8:05 AM",
        end: "8:25 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Teacher Led PE",
        start: "8:25 AM",
        end: "8:40 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "1st Intervention Block",
        start: "8:40 AM",
        end: "9:10 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Math & Science Block",
        start: "9:10 AM",
        end: "10:50 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Switch",
        start: "10:50 AM",
        end: "10:55 AM"
    },
    {
        name: "Lunch",
        start: "10:55 AM",
        end: "11:25 AM"
    },
    {
        name: "Recess",
        start: "11:30 AM",
        end: "11:50 AM"
    },
    {
        name: "2nd Intervention Block",
        start: "11:55 AM",
        end: "12:25 PM",
        teacher: "Mrs. Thompson",
        email: "Jocelyn.Thompson@stjohns.k12.fl.us"
    },
    {
        name: "ELA & Social Studies Block",
        start: "12:25 PM",
        end: "1:55 PM",
        teacher: "Mrs. Thompson",
        email: "Jocelyn.Thompson@stjohns.k12.fl.us"
    },
    {
        name: "Resource",
        start: "2:00 PM",
        end: "2:40 PM"
    },
    {
        name: "Dismissal Procedures",
        start: "2:45 PM",
        end: "2:50 PM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    }
];


// Elena Wednesday / early-release estimated schedule
// PROVISIONAL ESTIMATES — to be replaced if official times become available.
const ELENA_WEDNESDAY_SCHEDULE = [
    {
        name: "Morning Procedures",
        start: "8:05 AM",
        end: "8:25 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Teacher Led PE",
        start: "8:25 AM",
        end: "8:40 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "1st Intervention Block",
        start: "8:40 AM",
        end: "9:10 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Math & Science Block",
        start: "9:10 AM",
        end: "10:20 AM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    },
    {
        name: "Switch",
        start: "10:20 AM",
        end: "10:25 AM"
    },
    {
        name: "Lunch",
        start: "10:25 AM",
        end: "10:55 AM"
    },
    {
        name: "Recess",
        start: "11:00 AM",
        end: "11:20 AM"
    },
    {
        name: "2nd Intervention Block",
        start: "11:25 AM",
        end: "11:55 AM",
        teacher: "Mrs. Thompson",
        email: "Jocelyn.Thompson@stjohns.k12.fl.us"
    },
    {
        name: "ELA & Social Studies Block",
        start: "11:55 AM",
        end: "1:35 PM",
        teacher: "Mrs. Thompson",
        email: "Jocelyn.Thompson@stjohns.k12.fl.us"
    },
    {
        name: "Dismissal Procedures",
        start: "1:45 PM",
        end: "1:50 PM",
        teacher: "Mrs. Jaffa",
        email: "Danielle.Jaffa@stjohns.k12.fl.us"
    }
];


// Elena resource rotation
const ELENA_RESOURCE_ROTATION = {
    A: {
        name: "Music",
        teacher: "Mr. Cox",
        email: "James.Cox@stjohns.k12.fl.us"
    },
    B: {
        name: "PE",
        teacher: "Coach Hollister",
        email: "Donald.Hollister@stjohns.k12.fl.us"
    },
    C: {
        name: "Media Center",
        teacher: "Mrs. Snyder",
        email: null
    },
    D: {
        name: "Learning Lab",
        teacher: "Ms. Grossholz",
        email: null
    },
    E: {
        name: "Art",
        teacher: "Ms. Counts-Cacchione",
        email: "Kevanie.CountsCacchione@stjohns.k12.fl.us"
    }
};


// Elena bus times
const ELENA_BUS = {
    regular: {
        pickup: "7:47 AM",
        dropoff: "3:22 PM"
    },
    wednesday: {
        pickup: "7:47 AM",
        dropoff: "2:22 PM"
    }
};


// ============================================
// SCHOOLS
// ============================================

const SCHOOLS = {

    mason: {
        name: "Otis Mason Elementary School",
        website: "https://www-mes.stjohns.k12.fl.us/",
        email: "mes@stjohns.k12.fl.us",
        phone: "904-547-8440",
        hours: {
            regular: "8:25 AM–2:45 PM",
            wednesday: "8:25 AM–1:45 PM"
        },
        arrival: {
            dropoff: "8:00 AM",
            tardy: "8:25 AM"
        },
        forms: "https://www.parentsquare.com/schools/44945/signable_forms"
    },

    gamble: {
        name: "Gamble Rogers Middle School",
        website: "https://www-grms.stjohns.k12.fl.us/",
        email: "grms@stjohns.k12.fl.us",
        phone: "904-547-8700",
        hours: {
            regular: "7:30 AM–1:50 PM",
            wednesday: "7:30 AM–12:50 PM"
        },
        arrival: {
            dropoff: "7:00 AM",
            tardy: "7:30 AM"
        },
        forms: "https://www.parentsquare.com/schools/44946/signable_forms"
    }
};