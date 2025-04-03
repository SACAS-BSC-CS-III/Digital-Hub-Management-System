document.addEventListener("DOMContentLoaded", function () {
    const contactButtons = document.querySelectorAll(".contact-btn");
    const popup = document.getElementById("popup");
    const closeBtn = document.querySelector(".close-btn");
    const emailLink = document.getElementById("email-link");

    const popupName = document.getElementById("popup-name");
    const popupMobile = document.getElementById("popup-mobile");
    const popupEmail = document.getElementById("popup-email");

    const confirmDetails = document.getElementById("confirm-details");
    const urgentInquiry = document.getElementById("urgent-inquiry");

    // Function to update email button state
    function updateEmailButton() {
        if (confirmDetails.checked && urgentInquiry.checked) {
            emailLink.removeAttribute("disabled");
        } else {
            emailLink.setAttribute("disabled", "true");
        }
    }

    contactButtons.forEach(button => {
        button.addEventListener("click", function () {
            let name = this.dataset.name;
            let mobile = this.dataset.mobile;
            let email = this.dataset.email;

            popupName.textContent = name;  // Update name in the pop-up
            popupMobile.textContent = mobile;  // Update mobile number in the pop-up
            popupEmail.textContent = email;  // Update email in the pop-up

            emailLink.href = `mailto:${email}`;

            confirmDetails.checked = false;
            urgentInquiry.checked = false;
            updateEmailButton();

            popup.style.display = "flex";
        });
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    confirmDetails.addEventListener("change", updateEmailButton);
    urgentInquiry.addEventListener("change", updateEmailButton);
});
