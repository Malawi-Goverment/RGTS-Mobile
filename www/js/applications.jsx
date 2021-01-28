
function getApplications(searchParams) {
    console.log('Search started...')
  $("#applications_segment, #searchForm").addClass("loading");
  const URLParams = Object.keys(searchParams).filter(k => searchParams.hasOwnProperty(k)).map(
    k => encodeURIComponent(k) + '=' + encodeURIComponent(searchParams[k])).join('&')

  //console.log(URLParams)
  fetch(`${baseURL}/applications?${URLParams}`)
    .then((res) => res.json())
    .then((res) => {
      $("#applications_segment, #searchForm").removeClass("loading");

      if (res.status == "success") {
        window.apps = res.data;
        $("#closeModalBtn").click();
        $("#searchForm").trigger('reset')
        let DOM = res.data.map((app, index) => {
          return ` <div class="col-12 ui raised segment pr-0 mt-0">
                        <div onclick="viewApplication('${app.ReferenceID}')" class="row">
                            <div class="col-2">
                                <div class="ui image medium circular">
                                    <img class="img img-thumbnail" src="./assets/folder_48px.png" alt="AppIcon">
                                </div>
                            </div>
                            <div class="col-8 px-0 mx-0">
                                <div class="row p-0">
                                    
                                    <div class="col-12 text-right">
                                        <label class="_time">${app.Stamp}</label>
                                    </div>
                                    <div class="col-12"><a href="#"><i class="icon globe"></i> ${app.ReferenceID}</a></div>
                                    <div class="col-12"><h3 class="_applicant"><i class="icon user"></i>${app.ApplicantFullName}</h3></div>
                                    <div class="col-12">
                                        <hr class="p-0 m-0">
                                        <h3 class="text-danger my-0"><i class="icon folder open"></i> ${app.ServiceName}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });
        DOM = DOM.join("");

        $("#applications_segment").html(DOM);
      } else {
        toast(res.message, res.status);
      }
    })
    .catch((err) => {
        console.log(err)
      $("#applications_segment").removeClass("loading");
      toast("Applications list updated!", "info");
    });
}

function viewApplication(ReferenceID){
        changeView('application_view', `Viewing(${ReferenceID})`)
        $("#id_display").html(ReferenceID);
        $("#previewSegment").addClass('loading')
        fetch(`${baseURL}/applications?ReferenceID=${ReferenceID}`)
            .then(res => res.json())
            .then(res => {
                $("#previewSegment").removeClass('loading')
                console.log(res)
                if (res.status == 'success') {
                    application_of_focus = res.data[0].application_id
                    renderApplication(res.data[0])
                }
            })
            .catch(err => {
                $("#previewSegment").removeClass('loading')
                toast('Failed to fetched Application data!', 'error')
            })
    }

    function renderApplication(data) {
        console.log(data)

        let DOM = ` <tr>
                       <th style="color:red;">Applicant First Name:</th>
                       <th>${data.ApplicantFullName}</th>
                   </tr>
                   <tr>
                        <th style="color:red;>Gender:</th>
                        <th>${data.Gender}</th>
                    </tr>
                   <tr>
                       <th style="color:red;>Phone Number:</th>
                       <th>${data.ContactPhone}</th>
                   </tr>
                   <tr>
                        <th style="color:red;>Email Address:</th>
                        <th>${data.ContactEmail}</th>
                    </tr>
                    <tr>
                        <th style="color:red;>Service:</th>
                        <th>${data.ServiceName}</th>
                    </tr>
                    <tr>
                        <th style="color:red;>Assignment_Status</th>
                        <th>${data.AssignmentStatus}</th>
                    </tr>
                    <tr>
                        <th style="color:red;>Progress_Stage</th>
                        <th>${data.ProgressStage}</th>
                    </tr>
                    <tr>
                        <th style="color:red;>Total Files</th>
                        <th>${data.document_count}</th>
                    </tr>
                    <tr>
                        <th style="color:red;>Created At</th>
                        <th>${data.Stamp}</th>
                    </tr>`


        $("#previewSegment table").html(DOM)
    
}