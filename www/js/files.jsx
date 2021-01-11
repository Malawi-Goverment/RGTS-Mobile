let images_array = []
let application_of_focus
$(document).ready(()=>{
    $("#captureImageBtn").click(()=>{
        if($("#document_to_view").val() == ""){
            swal('Attention!', 'Please select the type of document you would like to capture!', 'error')
            return
        }
        //$("#imageActual").click()
        navigator.camera.getPicture(onSuccess,onFail,{
            quality:50,
            allowEdit:true,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType:Camera.DestinationType.DATA_URL
        });
    });

    $("#imageActual").change(function(){
        if (
      this.value != null &&
      this.value != "" &&
      this.value != typeof undefined
    ) {
      readURL2(document.getElementById("imageActual"));
    }
    })

})

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
          images_array.push(payload);
          renderImages();
          $("#imageActual").val('')
          //$(`#${canvas}`).css("background-image", `url(${e.target.result})`).transition("jiggle");
        };
        
        reader.readAsDataURL(input.files[i]);
      });
    }
  }

  function postImage(){

  }

function renderImages(){
    let imageDom = images_array.map(image=>{
        return `<div style="background-image:url('${image.file}')" class="col-4 mx-auto image_section img img-thumbnail"></div>`
    })
    
    imageDom = imageDom.join('')
    console.log(imageDom)
    $("#image_canvas").html(imageDom)
}

function onSuccess(Image){
    //saveCaptured();
   images_array.push({
        document_type: $("#document_to_view").val(),
        subtitle:$("#document_subtitle").val(),
        file:"data:image/jpeg;base64," + Image
      })
      renderImages()
}

function onFail(err){
    swal('','Failed to pick up image!','error');
}

function saveImages(){
  if(images_array.length > 0){
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documents: images_array,
        application: application_of_focus,
      }),
    };
  
    $("#capture_modal").addClass('loading')
    fetch(`${baseURL}/documents`, options)
      .then((res) => res.json())
      .then((res) => {
          $("#capture_modal").removeClass('loading')
          swal("", res.message, res.status);
          toast(res.message, res.status);
          if(res.status == 'success'){
            $("#closeModalBtn").click()
            
            images_array = [];
          }
      })
      .catch((err) => {
        $("#capture_modal").removeClass('loading')
        swal(
          "Connection Error!",
          "Failed to upload captured documents!",
          "error"
        );
      });
  }else{
    swal('Attention!', 'You are required to select image files first!', 'warning')
  }
}
