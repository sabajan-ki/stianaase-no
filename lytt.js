/* To-klikk: Spotify-spilleren lastes først når den besøkende trykker «Hør», så siden henter ingenting
   fra Spotify før det (05.10.26). Uten JavaScript står lenkene til Spotify og Qobuz igjen på kortet. */
(function () {
  "use strict";
  document.querySelectorAll(".utdrag").forEach(function (boks) {
    var knapp = boks.querySelector(".spill");
    if (!knapp) return;
    knapp.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://open.spotify.com/embed/track/" + encodeURIComponent(boks.dataset.spor) + "?theme=0";
      f.title = "Spotify-spiller: " + knapp.textContent.replace(/^Hør /, "");
      f.width = "100%"; f.height = "152"; f.loading = "eager";
      f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      f.style.border = "0"; f.style.borderRadius = "12px";
      boks.replaceChildren(f);
    });
  });
})();
