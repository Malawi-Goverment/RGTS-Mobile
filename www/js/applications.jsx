$(document).ready(() => {
  getApplications({});
  getServices();

  $("#searchForm").submit((e) => {
    e.preventDefault();
    const sp = getFormData("searchForm");
    if (
      sp.ReferenceID == "" &&
      sp.ProgresStage == "" &&
      sp.ApplicantFullName == "" &&
      sp.ServiceAppliedFor == ""
    ) {
        toast('Fill at least one field to perform this search!', 'error')
        return
    }
    console.log(sp);

    getApplications(sp)
  });
});

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
                        <div onclick="prepareViewNavigation('${app.ReferenceID}')" class="row">
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

function prepareViewNavigation(ReferenceID) {
  localStorage.setItem("NavigationViewReference", ReferenceID);
  location.href = "viewapplication.html";
}
