const daysDisplay = document.querySelector(".days-left");
const hoursDisplay = document.querySelector(".hours-left");
const minsDisplay = document.querySelector(".mins-left");
const secsDisplay = document.querySelector(".secs-left");
const start = document.querySelector(".start");
const modal = document.querySelector(".settings-page");
const background = document.querySelector(".background");
const settingsBtn = document.querySelector(".settings");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");

let duration;

const setLaunch = () => 
{
	const launchDate = dateInput.value;
	const launchTime = timeInput.value;
	const launch = moment(`${launchDate} ${launchTime}`);
	return launch;
};

const setDateAndTimeInputs = () => 
{
	const dateInput = document.querySelector("#date");
	const timeInput = document.querySelector("#time");

	const now = moment();
	dateInput.value = now.add(1, "d").format("YYYY-MM-DD");
	dateInput.setAttribute("min", now.format("YYYY-MM-DD"));
	dateInput.setAttribute("max", now.add(3, "months").format("YYYY-MM-DD"));
	timeInput.value = moment().format("HH:mm");
};

const handleModalAndbackground = (display) => 
{
	modal.style.display = display;
	background.style.display = display;
};

const formatTime = (time) => 
{
	let formattedTime = "0";
	if (time < 10) 
	{
		formattedTime += time;
		return formattedTime;
	} else {
		return time;
	}
};

const updateCountdown = (days, hours, mins, secs) => 
{
	daysDisplay.textContent = formatTime(days);
	hoursDisplay.textContent = formatTime(hours);
	minsDisplay.textContent = formatTime(mins);
	secsDisplay.textContent = formatTime(secs);
};

const manageCountdownDisplay = (display, titleText) => 
{
	const countdown = document.querySelector(".countdown");
	countdown.style.display = display;
	const title = document.querySelector(".title");
	title.innerText = titleText;
	if (display === "none") {
		title.classList.add("launch-over");
	} else {
		title.classList.remove("launch-over");
	}
};

const calculateDiff = (launch) => 
{
	const now = moment();

	duration = moment.duration(launch.diff(now));
	if (duration < 0) 
	{
		manageCountdownDisplay("none", "LAUNCH IS OVER!");
		return;
	}
	const daysLeft = launch.diff(now, "days");
	const hoursLeft = duration.hours();
	const minsLeft = duration.minutes();
	const secsLeft = duration.seconds();
	updateCountdown(daysLeft, hoursLeft, minsLeft, secsLeft);
};

const calculatePeriodLeft = () => 
{
	const localLaunch = localStorage.getItem("launchDate");
	const launch = setLaunch();

	if (localLaunch) {
		calculateDiff(moment(localLaunch));
	} else {
		calculateDiff(launch);
	}
};

const saveLocalLaunch = (launch) => 
{
	localStorage.setItem("launchDate", launch);
};

const CountDownInterval = () => 
{
	calculatePeriodLeft();

	const interval = setInterval(() => 
	{
		if (duration <= 0) 
		{
			clearInterval(interval);
		} else 
		{
			calculatePeriodLeft();
		}
	}, 1000);
};

document.addEventListener("DOMContentLoaded", () => 
{
	setDateAndTimeInputs();
	if (localStorage.getItem("launchDate") !== null) 
	{
		handleModalAndbackground("none");
		CountDownInterval();
	} else 
	{
		updateCountdown("0", "0", "0", "0");
	}
});

start.addEventListener("click", (e) => 
{
	e.preventDefault();

	const launch = setLaunch();
	saveLocalLaunch(launch);

	CountDownInterval();
	handleModalAndbackground("none");
	manageCountdownDisplay("flex", "WE'RE LAUNCHING SOON");
});

settingsBtn.addEventListener("click", () => 
{
	handleModalAndbackground("flex");
});