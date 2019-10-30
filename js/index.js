$(document).ready(function() {
  const HOST = "https://mybinder.org/build/gh";

  $(".launch-item").click(function(event) {
    let name = $(event.currentTarget).data("example-name");
    let repoUrl = $(event.currentTarget).data("example-repo-url");
    let url = $(event.currentTarget).data("example-url");
    let ref = $(event.currentTarget).data("example-ref");

    // strip github.com from the repo url
    // TODO: handle other sources
    repoUrl = repoUrl.replace("https://github.com/", "");

    const buildUrl = `${HOST}/${repoUrl}/${ref}?urlpath=${url}`;

    console.log("Redirecting to", buildUrl);

    $("#loading_modal").modal({
      backdrop: "static", 
      keyboard: false,
      show: true
    });

    $("#loader_text").html("Launching " + name);

    const evtSource = new EventSource(buildUrl);
    evtSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      $("#loader_text").html(data.phase);
      console.log(data);
      if (data.phase === "ready") {
        const redirectUrl = data.url;
        const token = data.token;
        const redirect = `${redirectUrl}${url}?token=${token}`;
        $("#loader_text").html("Redirecting to " + redirect);
        console.log(redirect);
        window.location.href = redirect;
      }
    };

    return false;
  });
});
