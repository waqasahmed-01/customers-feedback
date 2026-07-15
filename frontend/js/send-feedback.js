const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");

  window.location.href = "login.html";
});

const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const message = document.getElementById("message");

  message.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/admin/send-feedback`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
        email,
      }),
    });

    const data = await response.json();

    if (data.success) {
      message.innerHTML = `

                <div class="alert alert-success">

                    Feedback invitation sent successfully.

                </div>

            `;

      form.reset();
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

                Server connection failed.

            </div>

        `;
  }
});
