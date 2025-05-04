document.addEventListener("DOMContentLoaded", () => {
  const coffeeCardsContainer = document.getElementById("coffeeCardsContainer");
  const defaultImage = "../assets/cappuccino.jpg";

  fetch("../data/all-items.json")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data) {
        const newItems = data.data.filter((item) => item.is_new);
        newItems.forEach((item) => {
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
          const ingredientsText = item.ingredients_ratio
            .map((ing) => `${ing.ingredient} ${ing.percentage}%`)
            .join(" | ");
          h3.textContent = ingredientsText;

          const p = document.createElement("p");
          p.textContent = `R$${item.price.toFixed(2)}`;

          const button = document.createElement("button");
          button.textContent = "Order Now";

          coffeeCard.appendChild(img);
          coffeeCard.appendChild(h2);
          coffeeCard.appendChild(h3);
          coffeeCard.appendChild(p);
          coffeeCard.appendChild(button);

          card.appendChild(coffeeCard);

          coffeeCardsContainer.appendChild(card);
        });
      }
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
      coffeeCardsContainer.innerHTML = "<p>Erro ao buscar os dados.</p>";
    });
});
