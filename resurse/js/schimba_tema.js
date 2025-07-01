window.addEventListener("load", function() {
  const temaRadios = document.querySelectorAll('input[name="tema"]');

  function setTema(tema) {
    document.body.classList.remove("light", "dark", "red");

    document.body.classList.add(tema);

    localStorage.setItem("tema", tema);
  }

  const savedTema = localStorage.getItem("tema") || "light";

  setTema(savedTema);

  temaRadios.forEach((radio) => {
    radio.checked = radio.value === savedTema;

    radio.addEventListener("change", function() {
      if (this.checked) {
        setTema(this.value);
      }
    });
  });
});