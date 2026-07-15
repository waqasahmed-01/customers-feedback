const params = new URLSearchParams(window.location.search);

const token = params.get("token");

const customerInfo = document.getElementById("customerInfo");

const message = document.getElementById("message");

async function loadCustomer() {
  try {
    const response = await fetch(`${API_URL}/feedback/${token}`);

    const data = await response.json();

    if (!data.success) {
      message.innerHTML = `

            <div class="alert alert-danger">

            ${data.message}

            </div>

            `;

      document.getElementById("feedbackForm").style.display = "none";

      return;
    }

    customerInfo.innerHTML = `

        <h5>${data.customer.name}</h5>

        <p>${data.customer.email}</p>

        `;
  } catch {
    message.innerHTML = `

        <div class="alert alert-danger">

        Server Error

        </div>

        `;
  }
}

loadCustomer();

document
  .getElementById("feedbackForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const rating = document.getElementById("rating").value;

    const comment = document.getElementById("comment").value.trim();

    const response = await fetch(
      `${API_URL}/feedback/${token}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          rating,

          comment,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      window.location.href = "success.html";
    } else {
      message.innerHTML = `

<div class="alert alert-danger">

${data.message}

</div>

`;
    }
  });
