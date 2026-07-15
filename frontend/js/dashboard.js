// Check if the user is logged in.
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("token");

  window.location.href = "login.html";
});

//Load Statistics.
async function loadDashboardStatistics() {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);

      return;
    }

    document.getElementById("customersCount").textContent =
      data.statistics.totalCustomers;

    document.getElementById("invitationCount").textContent =
      data.statistics.totalInvitations;

    document.getElementById("completedCount").textContent =
      data.statistics.completedFeedback;

    document.getElementById("expiredCount").textContent =
      data.statistics.expiredInvitations;
  } catch (error) {
    console.error(error);
  }
}

loadDashboardStatistics();

//Load Invitation History.
async function loadInvitations() {
  try {
    const response = await fetch(`${API_URL}/admin/invitations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      return;
    }

    const table = document.getElementById("invitationTable");

    table.innerHTML = "";

    data.invitations.forEach((invitation) => {
      table.innerHTML += `

                <tr>

                    <td>${invitation.customer.name}</td>

                    <td>${invitation.customer.email}</td>

                    <td>${invitation.status}</td>

                    <td>${new Date(invitation.expiresAt).toLocaleDateString()}</td>

                </tr>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

loadInvitations();

//Feedback History.
async function loadFeedback() {
  try {
    const response = await fetch(`${API_URL}/admin/feedback`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      return;
    }

    const table = document.getElementById("feedbackTable");

    table.innerHTML = "";

    data.feedback.forEach((item) => {
      table.innerHTML += `

                <tr>

                    <td>${item.customer.name}</td>

                    <td>${item.customer.email}</td>

                    <td>${item.rating}</td>

                    <td>${item.comment}</td>

                </tr>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

loadFeedback();
