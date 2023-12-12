async function renderDataWithTooltip() {
  try {
    const response = await fetch("https://dpg.gg/test/calendar.json");
    const contributionsData = await response.json();

    const container = document.querySelector(".contribution--graph__greed");
    const tooltip = document.querySelector(".tooltip");
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const endDate = new Date();

    function calculateEndDate() {
      let sravn = endDate.toString().slice(0, 3);

      if (sravn === "Mon") {
        endDate.setDate(endDate.getDate() + 6);
        return endDate;
      }

      if (sravn === "Tue") {
        endDate.setDate(endDate.getDate() + 5);
        return endDate;
      }

      if (sravn === "Wed") {
        endDate.setDate(endDate.getDate() + 4);
        return endDate;
      }

      if (sravn === "Thu") {
        endDate.setDate(endDate.getDate() + 3);
        return endDate;
      }

      if (sravn === "Fri") {
        endDate.setDate(endDate.getDate() + 2);
        return endDate;
      }

      if (sravn === "Sat") {
        endDate.setDate(endDate.getDate() + 1);
        return endDate;
      } else {
        return endDate;
      }
    }

    calculateEndDate();

    endDate.setDate(endDate.getDate() - 50 * 7 + 1);

    for (let j = 0; j < 7; j++) {
      const weekColumn = document.createElement("div");
      weekColumn.classList.add("contribution--graph__column");

      for (let i = 0; i < 50; i++) {
        const currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() + (j + i * 7));

        const clone = document
          .querySelector(".contribution--graph__template")
          .content.cloneNode(true);
        const cell = clone.querySelector(".contribution--graph__cell");
        const dayOfWeek = daysOfWeek[j];
        const dateString = currentDate.toISOString().slice(0, 10);
        const contributions = contributionsData[dateString] || 0;

        cell.addEventListener("click", function (event) {
          const rect = cell.getBoundingClientRect();

          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;
          const cellWidth = cell.offsetWidth;

          const tooltipTop = rect.top - tooltipHeight - 60;
          const tooltipLeft = rect.left + (cellWidth - tooltipWidth) / 2 - 72;

          tooltip.style.top = `${tooltipTop + window.scrollY}px`;
          tooltip.style.left = `${tooltipLeft + window.scrollX}px`;

          const contributionText =
            contributions !== 1 ? "contributions" : "contribution";
          tooltip.innerHTML = `<span>${contributions} ${contributionText}</span><br><span>${dateString} (${dayOfWeek})</span>`;

          tooltip.style.display =
            tooltip.style.display === "none" ? "block" : "none";
        });

        if (contributions === 0) {
          cell.classList.add("no-contributions");
        } else if (contributions >= 1 && contributions <= 9) {
          cell.classList.add("low-contributions");
        } else if (contributions >= 10 && contributions <= 19) {
          cell.classList.add("medium-contributions");
        } else if (contributions >= 20 && contributions <= 29) {
          cell.classList.add("high-contributions");
        } else {
          cell.classList.add("very-high-contributions");
        }

        weekColumn.appendChild(clone);
      }

      container.appendChild(weekColumn);
    }

    function addAdditionalRow() {
      const additionalRow = document.createElement("div");
      additionalRow.classList.add("additional-row");

      const smallerText = document.createElement("span");
      smallerText.textContent = "Меньше";
      smallerText.classList.add("text");
      additionalRow.appendChild(smallerText);

      const cellClasses = [
        "no-contributions",
        "low-contributions",
        "medium-contributions",
        "high-contributions",
        "very-high-contributions",
      ];

      for (let i = 0; i < 5; i++) {
        const additionalCell = document.createElement("div");
        additionalCell.classList.add("additionalCellBlock");
        additionalCell.classList.add("contribution--graph__cell");
        additionalCell.classList.add(cellClasses[i]);
        additionalRow.appendChild(additionalCell);
      }

      const largerText = document.createElement("span");
      largerText.textContent = "Больше";
      largerText.classList.add("text");
      additionalRow.appendChild(largerText);

      container.appendChild(additionalRow);
    }

    addAdditionalRow();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

renderDataWithTooltip();
