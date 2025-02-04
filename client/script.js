const button = document.getElementById("checkout");
button.addEventListener("click", () => {
//   fetch("/create-checkout-session", {
    fetch("http://localhost:5000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ],
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((json) => Promise.reject(json));
      }
    })
    .then(({ url }) => (window.location = url));
});
