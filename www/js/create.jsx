$(document).ready(() => {
  setUserData();
  getServices();

  $("#new_application_form").submit((e) => {
    e.preventDefault();
    registerNewApplication();
  });
});

function registerNewApplication() {
  let application_data = getFormData("new_application_form");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application_data),
  };
  $("#new_application_form").addClass("loading");
  fetch(`${baseURL}/applications`, options)
    .then((res) => res.json())
    .then((res) => {
      $("#new_application_form").removeClass("loading");
      toast(res.message, res.status);

      if (res.status == "success") {
        $("#new_application_form").trigger("reset");
        localStorage.setItem("NavigationViewReference", res.ReferenceID);
        //$("#launchSuccessModal").click()
        prepareNavigation();
      } else {
        swal("", res.message, res.status);
      }
    })
    .catch((err) => {
      $("#new_application_form").removeClass("loading");
      swal("Connection Error!", "Failed to submit application!", "error");
    });
}

function prepareNavigation() {
  window.location.href = "viewapplication.html";
}
