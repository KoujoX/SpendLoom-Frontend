const tipsButton = document.getElementById("tips-button");
const tipsMessage = document.getElementById("tips-message");

tipsButton.addEventListener("click", function(){
    tipsMessage.textContent = "Your personalised AI tips will be available here soon.";
    tipsButton.textContent = "Tips coming soon";
});

