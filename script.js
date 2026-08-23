// Available job information
const jobs = [
    {
        title: "Web Developer Intern",
        company: "Tech Solutions",
        location: "Jaipur",
        type: "Internship",
        description:
            "Work on websites using HTML, CSS and JavaScript."
    },
    {
        title: "Python Developer",
        company: "Code World",
        location: "Remote",
        type: "Full Time",
        description:
            "Build Python applications and work with databases."
    },
    {
        title: "Frontend Developer Intern",
        company: "Digital India",
        location: "Delhi",
        type: "Internship",
        description:
            "Create responsive user interfaces using JavaScript."
    },
    {
        title: "Backend Developer",
        company: "Cloud Technologies",
        location: "Remote",
        type: "Full Time",
        description:
            "Develop APIs and server-side applications."
    },
    {
        title: "Java Developer",
        company: "Software Hub",
        location: "Bangalore",
        type: "Full Time",
        description:
            "Develop applications using Java and MySQL."
    },
    {
        title: "UI UX Designer",
        company: "Creative Studio",
        location: "Jaipur",
        type: "Internship",
        description:
            "Design attractive and user-friendly interfaces."
    }
];

// Required page elements
const loginPopup = document.getElementById("loginPopup");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const passwordInput =
    document.getElementById("loginPassword");

const showPassword =
    document.getElementById("showPassword");

const loginButton =
    document.querySelector(".login-button");

const searchInput =
    document.getElementById("searchInput");

const searchMessage =
    document.getElementById("searchMessage");

const jobsHeading =
    document.getElementById("jobsHeading");

const jobContainer =
    document.getElementById("jobContainer");

const noJobs =
    document.getElementById("noJobs");

// Display job cards
function displayJobs(jobList) {
    jobContainer.innerHTML = "";

    if (jobList.length === 0) {
        noJobs.style.display = "block";
        return;
    }

    noJobs.style.display = "none";

    jobList.forEach(function (job) {
        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <span class="job-type">
                ${job.type}
            </span>

            <h3>${job.title}</h3>

            <p>
                <strong>Company:</strong>
                ${job.company}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.location}
            </p>

            <p class="job-description">
                ${job.description}
            </p>

            <button type="button">
                Apply Now
            </button>
        `;

        const applyButton = card.querySelector("button");

        applyButton.addEventListener(
            "click",
            function () {
                applyJob(job.title);
            }
        );

        jobContainer.appendChild(card);
    });
}

// Search jobs
function searchJobs() {
    const searchValue =
        searchInput.value.trim().toLowerCase();

    if (searchValue === "") {
        searchMessage.textContent =
            "Please enter a job title.";

        jobsHeading.textContent =
            "Latest Opportunities";

        displayJobs(jobs);
        return;
    }

    const filteredJobs = jobs.filter(function (job) {
        const title = job.title.toLowerCase();
        const company = job.company.toLowerCase();
        const location = job.location.toLowerCase();
        const type = job.type.toLowerCase();
        const description =
            job.description.toLowerCase();

        return (
            title.includes(searchValue) ||
            company.includes(searchValue) ||
            location.includes(searchValue) ||
            type.includes(searchValue) ||
            description.includes(searchValue)
        );
    });

    jobsHeading.textContent =
        'Search Results for "' +
        searchInput.value.trim() +
        '"';

    if (filteredJobs.length === 0) {
        searchMessage.textContent =
            "No matching opportunities found.";
    } else {
        searchMessage.textContent =
            filteredJobs.length +
            " opportunity(s) found.";
    }

    displayJobs(filteredJobs);

    document
        .getElementById("jobs")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// Reset search and show all jobs
function clearSearch() {
    searchInput.value = "";
    searchMessage.textContent = "";

    jobsHeading.textContent =
        "Latest Opportunities";

    displayJobs(jobs);

    document
        .getElementById("jobs")
        .scrollIntoView({
            behavior: "smooth"
        });

    searchInput.focus();
}

// Search when Enter is pressed
searchInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            searchJobs();
        }
    }
);

// Open login popup
function openLogin() {
    loginPopup.classList.add("active");

    document
        .getElementById("loginEmail")
        .focus();
}

// Close login popup
function closeLogin() {
    loginPopup.classList.remove("active");

    loginMessage.textContent = "";
    loginMessage.className = "";
}

// Show or hide password
showPassword.addEventListener(
    "change",
    function () {
        if (showPassword.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }
);

// Login form submission
loginForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim();

        const password =
            passwordInput.value.trim();

        if (email === "" || password === "") {
            showLoginMessage(
                "Please enter your email and password.",
                "error-message"
            );

            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            showLoginMessage(
                "Please enter a valid email address.",
                "error-message"
            );

            return;
        }

        if (password.length < 6) {
            showLoginMessage(
                "Password must contain at least 6 characters.",
                "error-message"
            );

            return;
        }

        localStorage.setItem(
            "loggedInUser",
            email
        );

        showLoginMessage(
            "Login successful!",
            "success-message"
        );

        setTimeout(function () {
            closeLogin();

            loginButton.textContent =
                "Logged In";

            loginButton.disabled = true;

            loginForm.reset();
            passwordInput.type = "password";
        }, 1000);
    }
);

// Display login message
function showLoginMessage(message, className) {
    loginMessage.textContent = message;
    loginMessage.className = className;
}

// Close popup when clicking outside it
loginPopup.addEventListener(
    "click",
    function (event) {
        if (event.target === loginPopup) {
            closeLogin();
        }
    }
);

// Close popup using Escape key
document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Escape" &&
            loginPopup.classList.contains("active")
        ) {
            closeLogin();
        }
    }
);

// Apply for a job
function applyJob(jobTitle) {
    const savedUser =
        localStorage.getItem("loggedInUser");

    if (!savedUser) {
        alert(
            "Please login before applying for a job."
        );

        openLogin();
        return;
    }

    alert(
        "Your application for " +
        jobTitle +
        " has been started!"
    );
}

// Run when the page opens
window.addEventListener(
    "DOMContentLoaded",
    function () {
        // Initially display every job
        displayJobs(jobs);

        // Check previous login
        const savedUser =
            localStorage.getItem("loggedInUser");

        if (savedUser) {
            loginButton.textContent =
                "Logged In";

            loginButton.disabled = true;
        }
    }
);