function renderCsvTable(targetId, filterCategory) {
  const csvUrl = "https://docs.google.com/spreadsheets/d/1mLh8E5JEHP-HCrBgs42pVpiY4ZpP7LG-O__3Av2-MgY/export?format=csv&gid=884226509";

  fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
      const parsed = Papa.parse(csvText, { header: false });
      const rows = parsed.data;

      const filteredRows = rows.slice(1).filter(row => row[1] && row[1].trim() === filterCategory);

      const table = document.createElement("table");

      table.innerHTML = `
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Subject</th>
            <th>Download</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRows.map((row, i) => {
            const subject = row[2] || "";
            const cleanSubject = subject.replace(/_/g, " ").replace(/\.pdf/i, "");
            const downloadLink = row[5] || "";

            return `
              <tr>
                <td>${i + 1}</td>
                <td>${cleanSubject}</td>
                <td>
                  <a href="${downloadLink}" target="_blank">
                    <button class="download-btn">Download</button>
                  </a>
                </td>
                <td>
                  <a href="https://wa.me/?text=${encodeURIComponent("📄 " + cleanSubject + "\n🔗 " + downloadLink)}" target="_blank">
                    <button class="share-btn">Share</button>
                  </a>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      `;

      const container = document.getElementById(targetId);
      if (container) {
        container.innerHTML = ''; // Clear any existing content
        container.appendChild(table);
      }
    })
    .catch(err => console.error("CSV load error:", err));
}
