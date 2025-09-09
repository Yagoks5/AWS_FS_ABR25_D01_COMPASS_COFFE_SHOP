document.addEventListener("DOMContentLoaded", () => {
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");
  const messageEl = document.querySelector(".message");
  const nameEl = document.querySelector(".name");
  const professionEl = document.querySelector(".profession");
  const photoEl = document.querySelector(".photo");

  let feedbacks = [];
  let currentIndex = 0;

  fetch("../data/feedbacks 1.json")
    .then((res) => res.json())
    .then((data) => {
      feedbacks = data.data;
      showFeedback(currentIndex);
    });

  function showFeedback(index) {
    const feedback = feedbacks[index];
    messageEl.textContent = feedback.message;
    nameEl.textContent = feedback.full_name;
    professionEl.textContent = feedback.profession;
    photoEl.src = feedback.image_url;
  }

  leftBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + feedbacks.length) % feedbacks.length;
    showFeedback(currentIndex);
  });

  rightBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % feedbacks.length;
    showFeedback(currentIndex);
  });

  const coffeeCardsContainer = document.getElementById("coffeeCardsContainer");
  const filterContainer = document.querySelector(".filter-container");
  const tableBody = document.querySelector("tbody");
  const defaultImage = "../assets/cappuccino.jpg";
  const dataUrl = "../data/all-items.json";

  function createCoffeeCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");

    const coffeeCard = document.createElement("div");
    coffeeCard.classList.add("coffee-card");

    const img = document.createElement("img");
    img.src = item.imagem_url || defaultImage;
    img.alt = item.name;
    img.onerror = () => {
      img.src = defaultImage;
    };

    const h2 = document.createElement("h2");
    h2.textContent = item.name;

    const h3 = document.createElement("h3");
    h3.textContent = item.ingredients_ratio
      .map((ing) => `${ing.ingredient} ${ing.percentage}%`)
      .join(" | ");

    const p = document.createElement("p");
    p.textContent = `R$${item.price.toFixed(2)}`;

    const button = document.createElement("button");
    button.textContent = "Order Now";

    coffeeCard.append(img, h2, h3, p, button);
    card.appendChild(coffeeCard);

    return card;
  }

  function populateNewItems(items) {
    const newItems = items.filter((item) => item.is_new);
    newItems.forEach((item) => {
      const card = createCoffeeCard(item);
      coffeeCardsContainer.appendChild(card);
    });
  }

  function populateTable(items) {
    tableBody.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("tr");
      row.classList.add("item");
      row.dataset.type = normalizeType(item.type);
      row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.type}</td>
          <td>R$ ${item.price.toFixed(2)}</td>
        `;
      tableBody.appendChild(row);
    });
  }

  function normalizeType(type) {
    return type.toLowerCase().replace(/ /g, "-");
  }

  function createFilterButtons(items) {
    const types = ["all"];
    ("");
    for (const item of items) {
      if (!types.includes(item.type)) {
        types.push(item.type);
      }
    }

    types.forEach((type) => {
      const button = document.createElement("button");
      button.classList.add("filter-btn");
      button.dataset.filter = normalizeType(type);
      button.textContent = type === "all" ? "All items" : type;

      if (type === "all") {
        button.classList.add("active");
      }

      filterContainer.appendChild(button);
    });
  }

  function setupFilterListener(items) {
    filterContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("filter-btn")) {
        const filter = event.target.dataset.filter;

        document
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        event.target.classList.add("active");

        const filteredItems =
          filter === "all"
            ? items
            : items.filter((item) => normalizeType(item.type) === filter);

        populateTable(filteredItems);
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function setupSubscribeForm() {
    const subscribeForm = document.querySelector(".subscrive-form");
    if (!subscribeForm) return;
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const messageDiv = document.getElementById("subscribe-message");

    function updateLoginState() {
      const savedEmail = localStorage.getItem("subscribedEmail");
      if (savedEmail) {
        messageDiv.innerHTML = `Logado como <b>${savedEmail}</b>. <button id='logout-btn' style='margin-left:10px;padding:4px 12px;border-radius:5px;border:none;background:#d32f2f;color:#fff;cursor:pointer;'>Sair</button>`;
        messageDiv.style.color = "#388e3c";
        emailInput.value = savedEmail;
        emailInput.disabled = true;
        subscribeForm.querySelector('button[type="submit"]').disabled = true;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.onclick = function() {
            localStorage.removeItem("subscribedEmail");
            messageDiv.textContent = "Você saiu. Email removido.";
            messageDiv.style.color = "#d32f2f";
            emailInput.value = "";
            emailInput.disabled = false;
            subscribeForm.querySelector('button[type="submit"]').disabled = false;
          };
        }
      } else {
        messageDiv.textContent = "";
        emailInput.value = "";
        emailInput.disabled = false;
        subscribeForm.querySelector('button[type="submit"]').disabled = false;
      }
    }

    updateLoginState();

    subscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!validateEmail(email)) {
        messageDiv.textContent = "Digite um endereço de email válido!!";
        messageDiv.style.color = "#d32f2f";
        emailInput.focus();
        return;
      }

      const savedEmail = localStorage.getItem("subscribedEmail");
      if (savedEmail === email) {
        messageDiv.innerHTML = `Logado como <b>${savedEmail}</b>. <button id='logout-btn' style='margin-left:10px;padding:4px 12px;border-radius:5px;border:none;background:#d32f2f;color:#fff;cursor:pointer;'>Sair</button>`;
        messageDiv.style.color = "#388e3c";
        emailInput.disabled = true;
        subscribeForm.querySelector('button[type="submit"]').disabled = true;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.onclick = function() {
            localStorage.removeItem("subscribedEmail");
            messageDiv.textContent = "Você saiu. Email removido.";
            messageDiv.style.color = "#d32f2f";
            emailInput.value = "";
            emailInput.disabled = false;
            subscribeForm.querySelector('button[type="submit"]').disabled = false;
          };
        }
      } else {
        localStorage.setItem("subscribedEmail", email);
        messageDiv.innerHTML = `Logado como <b>${email}</b>. <button id='logout-btn' style='margin-left:10px;padding:4px 12px;border-radius:5px;border:none;background:#d32f2f;color:#fff;cursor:pointer;'>Sair</button>`;
        messageDiv.style.color = "#388e3c";
        emailInput.disabled = true;
        subscribeForm.querySelector('button[type="submit"]').disabled = true;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.onclick = function() {
            localStorage.removeItem("subscribedEmail");
            messageDiv.textContent = "Você saiu. Email removido.";
            messageDiv.style.color = "#d32f2f";
            emailInput.value = "";
            emailInput.disabled = false;
            subscribeForm.querySelector('button[type="submit"]').disabled = false;
          };
        }
      }
    });
  }

  function init() {
    fetch(dataUrl)
      .then((response) => response.json())
      .then(({ status, data }) => {
        if (status === "success" && data) {
          populateNewItems(data);
          createFilterButtons(data);
          populateTable(data);
          setupFilterListener(data);
          setupSubscribeForm();
        } else {
          throw new Error("Dados inválidos");
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        coffeeCardsContainer.innerHTML = "<p>Erro ao buscar os dados.</p>";
      });
  }

  init();
});
