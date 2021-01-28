$(document).ready(() => {
    $("#login_form").submit((e) => {
        e.preventDefault();
        login();
      });
})


function login() {
    let credentials = getFormData("login_form");
    postOptions.body = JSON.stringify(credentials);
    $("#loginBtn").addClass("loading disabled");
    fetch(`${baseURL}/login`, postOptions)
      .then((res) => res.json())
      .then((res) => {
        toast(res.message, res.status);
        $("#loginBtn").removeClass("loading disabled");
        if (res.status == "success") {
            window.access_code = res.user
          $("#login_view").addClass("d-none");
          $("#main_view").removeClass("d-none");
          getServices();
        } else {
          $("#Password").val('')
        }
      })
      .catch((err) => {
        $("#loginBtn").removeClass("loading disabled");
        toast("Connection Error: Failed to Sign In!", "error");
      });
  }
  