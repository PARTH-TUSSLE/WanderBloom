// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();


document.addEventListener("DOMContentLoaded", function () {
  const taxToggleLabel = document.querySelector(
    ".tax-toggle .form-check-label"
  );
  if (taxToggleLabel) {
    taxToggleLabel.textContent = "Taxes";
  }

  // Add a media query listener
  const mediaQuery = window.matchMedia(
    "(min-width: 389px) and (max-width: 844px)"
  );

  function handleMediaQueryChange(e) {
    if (e.matches) {
      // Change text when screen size is between 389px and 844px
      if (taxToggleLabel) {
        taxToggleLabel.textContent = "Taxes";
      }
    } else {
      // Revert to original text for other screen sizes
      if (taxToggleLabel) {
        taxToggleLabel.textContent = "Display total after taxes";
      }
    }
  }

  // Run the handler once at the start
  handleMediaQueryChange(mediaQuery);

  // Add the listener for future changes
  mediaQuery.addListener(handleMediaQueryChange);
});