"use strict";
const poll = [
    { candidate: 'Lilian', votes: 0 },
    { candidate: 'Victor', votes: 0 },
];
const votedNames = new Set();
const nameInput = document.getElementById("voter-name");
const candidateMenu = document.querySelector("el-menu");
const countLilian = document.getElementById("count-lilian");
const countVictor = document.getElementById("count-victor");
const barLilian = document.getElementById("bar-lilian");
const barVictor = document.getElementById("bar-victor");
const modalCountLilian = document.getElementById("modal-count-lilian");
const modalCountVictor = document.getElementById("modal-count-victor");
const winnerText = document.getElementById("winner-text");
const getVotes = (candidate) => {
    const entry = poll.find(function (p) {
        return p.candidate === candidate;
    });
    return entry ? entry.votes : 0;
};
const getTotalVotes = (pollArray) => {
    return pollArray.reduce(function (sum, entry) {
        return sum + entry.votes;
    }, 0);
};
const getWinner = (pollArray) => {
    if (pollArray.length === 0)
        return undefined;
    return pollArray.reduce(function (winner, entry) {
        return entry.votes > winner.votes ? entry : winner;
    }, pollArray[0]);
};
const updateResults = () => {
    const totalVotes = getTotalVotes(poll);
    const lilianVotes = getVotes('Lilian');
    const victorVotes = getVotes('Victor');
    countLilian.textContent = lilianVotes.toString();
    countVictor.textContent = victorVotes.toString();
    modalCountLilian.textContent = lilianVotes + " votes";
    modalCountVictor.textContent = victorVotes + " votes";
    if (totalVotes === 0) {
        barLilian.style.width = "0%";
        barVictor.style.width = "0%";
    }
    else {
        barLilian.style.width = (lilianVotes / totalVotes) * 100 + "%";
        barVictor.style.width = (victorVotes / totalVotes) * 100 + "%";
    }
    const winner = getWinner(poll);
    if (!winner || totalVotes === 0) {
        winnerText.textContent = "No votes yet";
    }
    else if (lilianVotes === victorVotes) {
        winnerText.textContent = "It's currently a tie!";
    }
    else {
        winnerText.textContent = winner.candidate + " is currently winning with " + winner.votes + " votes!";
    }
};
// Guard: only attach the listener once, even if this script somehow runs more than once
if (candidateMenu.dataset.voteListenerAttached !== "true") {
    candidateMenu.dataset.voteListenerAttached = "true";
    candidateMenu.addEventListener("click", function (event) {
        const target = event.target;
        const link = target.closest("[data-candidate]");
        if (!link)
            return;
        event.preventDefault();
        // validating and casting the vote
        const voterName = nameInput.value.trim();
        const candidate = link.getAttribute("data-candidate");
        if (voterName === "") {
            alert("Please enter your name before voting.");
            return;
        }
        if (votedNames.has(voterName.toLowerCase())) {
            alert(voterName + " has already voted!");
            nameInput.value = "";
            return;
        }
        const entry = poll.find(function (p) {
            return p.candidate === candidate;
        });
        if (entry) {
            entry.votes = entry.votes + 1;
        }
        votedNames.add(voterName.toLowerCase());
        updateResults();
        nameInput.value = "";
    });
}
updateResults();
