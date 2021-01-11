let userdata, pictureSource, destinationType
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType,
    destinationType = navigator.camera.destinationType
}
const baseURL = "http://192.168.1.103:5000"
function setUserData(){
    try{
        userdata = JSON.parse(localStorage.getItem('userdata'))
        if(!userdata || userdata == "" || userdata == null || userdata == typeof undefined){
            localStorage.clear()
            location.href = "index.html"
        }
    }catch(e){
        localStorage.clear()
        location.href = "index.html"
    }
}

function getFormData(form) {
    let form_data = $("#" + form).serializeArray();
    let json_obj = {};
    $.each(form_data, function (i, v) {
      json_obj[v.name] = v.value;
    });
    return json_obj;
}


function logout(){
  localStorage.clear()
  location.href="index.html"
}


function readURL2(input) {
    if (input.files.length > 0 && input.files.length <= 4) {
      $.each(input.files, function (i, v) {
        var reader = new FileReader();
        reader.onload = function (e) {
          const payload = {
            document_type: $("#document_to_view").val(),
            subtitle:$("#document_subtitle").val(),
            file:e.target.result
          }
          application_images.push(payload);
          renderApplicationImages()
          $("#document_upload").val('')
          console.log(application_images)
          //$(`#${canvas}`).css("background-image", `url(${e.target.result})`).transition("jiggle");
        };
        
        reader.readAsDataURL(input.files[i]);
      });
    }
  }
  
  function renderApplicationImages(){
    if(application_images.length > 0){
      $("#saveDocumentsBtn").removeClass('d-none')
    }else{
      $("#saveDocumentsBtn").addClass('d-none')
    }
    let DOM = application_images.map((target, index)=>{
        return `<div class="col-2 img img-thumbnail image_section" id="app_image_${index+1}" style='background-image:url("${target.file}")' class="image_section"></div>`
    })
    DOM = DOM.join('')
    $("#images_canvas").html(DOM)
    $("#document_form").trigger('reset')
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
  
  
  function changePassword(){
    const pc = {
      old_password:$("#old_password").val(),
      new_password:$("#new_password").val(),
      confirm_password:$("#confirm_password").val()
    }
  
    if(pc.old_password == null || pc.old_password == "" || pc.old_password == typeof undefined){
      $("#pc_feedback").html('Please provide your old password!')
      return
    }
    if(pc.new_password == null || pc.new_password == "" || pc.new_password == typeof undefined){
      $("#pc_feedback").html('Please enter your new password!')
      return
    }
    if(pc.confirm_password != pc.new_password){
      $("#pc_feedback").html('Confirm password not matched!')
      return
    }
  
    const options = {
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(pc)
    }
  
    fetch(`${baseURL}/users/password`, options)
    .then(res=>res.json())
    .then(res=>{
      $("#settings_modal").removeClass('loading')
      toast(res.message, res.status)
      swal('', res.message, res.status)
      if(res.status == 'success'){
        $("#modal_close").click();
        $("#confirm_password").val('')
        $("#new_password").val('')
        $("#old_password").val('')
        $("#settings_menu").removeClass('d-none')
        $("#change_password").addClass('d-none')
        setTimeout(()=>{
          location.href = "logout"
        },2000)
      }
    })
    .catch(err=>{
      toast('Connection Error: Failed to update Password!', 'error')
      $("#settings_modal").removeClass('loading')
    })
  }

  $(".phone-field").keyup(function (e) {
    var sliced = $(this).val().slice(0, 4);
    if (sliced != "+265" && sliced != "+255" && sliced != "+260") {
      $(this).val("+265");
    }
  });

  function pushAside(){
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
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
        $("#services").html(options);
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
