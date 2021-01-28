$(document).ready(()=>{
  $("#new_application_form").submit(e=>{
      e.preventDefault()
      registerNewApplication()
  })
})

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
          viewApplication(`${res.ReferenceID}`)
        } else {
          swal("", res.message, res.status);
        }
      })
      .catch((err) => {
        $("#new_application_form").removeClass("loading");
        //swal("Connection Error!", "Failed to submit application!", "error");
      });
  }
  
  
function getServices() {
    fetch(`${baseURL}/application/services`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status == "success") {
          let options = res.data.map((service) => {
            return `<option value="${service.id}">${service.ServiceName}</option>`;
          });
          options = `<option value=''>Service Applied</option>${options.join(
            ""
          )}`;
          $(".form-control.services").html(options);
        } else {
          console.log("Failed to fetch services!\nRetrying in 5 seconds...");
        }
      })
      .catch((err) => {
        $("#feedbackText").html(`  Failed to fetch services <br>
                     Retrying in <span id="countDown"></span> seconds...`);
        let wait = 5;
        let Interval = setInterval(() => {
          if (wait >= 0) {
            $("#countDown").html(wait);
          } else {
            $("#feedbackText").html("");
            clearInterval(Interval);
          }
          wait--;
        }, 1000);
      });
  }
  