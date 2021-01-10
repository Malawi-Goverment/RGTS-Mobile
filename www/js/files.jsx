let images_array = []
$(document).ready(()=>{
    $("#captureImageBtn").click(()=>{
        if($("#document_to_view").val() == ""){
            swal('Attention!', 'Please select the type of document you would like to capture!', 'error')
            return
        }
        navigator.camera.getPicture(onSuccess,onFail,{
            quality:50,
            allowEdit:true,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType:Camera.DestinationType.DATA_URL
        });
    });

})

function renderImages(){
    let imageDom = images_array.map(image=>{
        return `<div style="background-image:url('${image.file}')" class="col-4 image_section img img-thumbnail"></div>`
    })
    imageDom = imageDom.join('')
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