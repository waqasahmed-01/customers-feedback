const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("message");

  message.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);

      message.innerHTML = `
                <div class="alert alert-success">
                    Login Successful
                </div>
            `;

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.innerHTML = `
                <div class="alert alert-danger">
                    ${data.message}
                </div>
            `;
    }
  } catch (error) {
    message.innerHTML = `
            <div class="alert alert-danger">
                Unable to connect to server.
            </div>
        `;
  }
});
