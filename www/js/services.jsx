"use strict";
const baseURL = `http://172.20.10.2:5000`;

let current_view = "home_view";
$(document).ready(() => {
  
  $(".ui.selection.dropdown").dropdown();
  $(".phone-field").keyup(function (e) {
    var sliced = $(this).val().slice(0, 4);
    if (sliced != "+265" && sliced != "+255" && sliced != "+260") {
      $(this).val("+265");
    }
  });

  $(".phone-field").keydown(function (e) {
    if ($(this).val() == "+265") {
      var x = e.which || e.keycode;
      if (e.keyCode == 48) {
        try {
          Toastify({
            text: "Remember not to include zero (0) to the phone number!",
            duration: 4000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "rgb(11, 89, 134)",
            className: "info",
          }).showToast();
        } catch (e) {
          swal("Remember not to include zero (0) to the phone number");
        }
        e.preventDefault();
      }
    } else if (
      (x >= 48 && x <= 57) ||
      x == 8 ||
      (x >= 35 && x <= 40) ||
      x == 46
    ) {
      e.preventDefault();
    }
  });
});

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function getFormData(form) {
  let form_data = $("#" + form).serializeArray();
  let json_obj = {};
  $.each(form_data, function (i, v) {
    json_obj[v.name] = v.value;
  });
  return json_obj;
}



function toast(uthenga, status) {
  if (status == "error") {
    $("body").toast({
      title: "Error!",
      class: "error",
      showProgress: "top",
      classProgress: "blue",
      message: uthenga,
      displayTime: 5000,
    });
  } else if (status == "success") {
    $("body").toast({
      title: "Success!",
      class: "success",
      showProgress: "bottom",
      message: uthenga,
      displayTime: 5000,
    });
  } else if (status == "warning") {
    $("body").toast({
      title: "Attention!",
      class: "warning",
      showProgress: "bottom",
      message: uthenga,
      displayTime: 5000,
    });
  } else if (status == "default") {
    $("body").toast({
      title: "Hey!,",
      class: "blue",
      showProgress: "bottom",
      message: uthenga,
      displayTime: 5000,
    });
  }
}


const postOptions = {
  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:null
}

  
  let months = [
    { abbreviation: "Jan", name: "January" },
    { abbreviation: "Feb", name: "February" },
    { abbreviation: "Mar", name: "March" },
    { abbreviation: "Apr", name: "April" },
    { abbreviation: "May", name: "May" },
    { abbreviation: "Jun", name: "June" },
    { abbreviation: "Jul", name: "July" },
    { abbreviation: "Aug", name: "August" },
    { abbreviation: "Sep", name: "September" },
    { abbreviation: "Oct", name: "October" },
    { abbreviation: "Nov", name: "November" },
    { abbreviation: "Dec", name: "December" }
  ];

  function getMonth(key){
    let month
    for (let i = 0; i < months.length; i++) {
      if(months[i].abbreviation == key){
          month = months[i].name
          break
      }
    }
    return month
  }
 
function changeView(target, title, showBackButton) {
  $(".views").addClass("d-none");
  $(`#${target}`).removeClass("d-none");
  $("#headerTitle").html(toTitleCase(title));
  if (showBackButton) {
    $("#backButton").removeClass("d-none");
  } else {
    $("#backButton").addClass("d-none");
  }
  let current_view = target

  if(target != "home_view"){
    $("#backButton").removeClass('d-none')
  }else{
    $("#backButton").addClass('d-none')
  }
  
  if(target == 'applications_list_view'){
    getApplications({})
  }
}

function backButton(){
  if(current_view == 'home_view'){
      app.exit()
  }else if(current_view == 'application_view'){
    changeView('application_list_view', 'Applications List')
  }else{
    changeView('home_view', 'Home')
  }
}