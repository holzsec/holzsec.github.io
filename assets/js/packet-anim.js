document.addEventListener("DOMContentLoaded", () => {
  const separator = document.querySelector(".packet-separator");
  const button = document.getElementById("run-ip-test");
  const packet = separator?.querySelector(".packet");
  const cable = separator?.querySelector(".cable");
  const resultBox = document.querySelector(".packet-result");

  if (!separator || !button || !packet || !cable || !resultBox) {
    console.warn("Packet separator elements not found.");
    return;
  }

  const API_URL = "https://ip.holzsec.at/";
  let isRunning = false;

  function formatValue(value) {
    if (value === null || value === undefined || value === "") {
      return "❌";
    }

    if (typeof value === "boolean") {
      return value ? "✅" : "❌";
    }

    return String(value);
  }

  function renderResult(data) {
    resultBox.innerHTML = `
      <dl>
        <dt>IP Address:</dt>
        <dd>${formatValue(data.current_ipv4)}</dd>

        <dt>IPv6 Address:</dt>
        <dd>${formatValue(data.current_ipv6)}</dd>

        <dt>IPv6 Pingable:</dt>
        <dd>${formatValue(data.ipv6_pingable)}</dd>

        <dt>ASN:</dt>
        <dd>${formatValue(data.asn)}</dd>

        <dt>Organization:</dt>
        <dd>${formatValue(data.org_name)}</dd>

        <dt>Operating System:</dt>
        <dd>${formatValue(data.os)}</dd>
      </dl>
    `;
  }

  function renderError(error) {
    resultBox.innerHTML = `
      <strong>Request failed:</strong>
      ${error.message || "Unknown error"}
    `;
  }

  function movePacketTo(position) {
    return new Promise((resolve) => {
      packet.style.transition = "left 1.8s ease-in-out";
      packet.style.left = `${position}px`;

      packet.addEventListener("transitionend", resolve, { once: true });
    });
  }

  async function runOnce() {
    if (isRunning) return;

    isRunning = true;
    button.disabled = true;
    button.textContent = "Pinging...";
    resultBox.innerHTML = "";

    const distance = cable.clientWidth - packet.clientWidth;

    packet.style.left = "0px";
    packet.textContent = "📦";

    let data = null;
    let error = null;

    await movePacketTo(distance);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      data = await response.json();
    } catch (err) {
      error = err;
    }

    packet.textContent = error ? "⚠️" : "↩️";

    await movePacketTo(0);

    packet.textContent = error ? "⚠️" : "✅";

    if (error) {
      renderError(error);
    } else {
      renderResult(data);
    }

    button.disabled = false;
    button.textContent = "Ping Me";
    isRunning = false;
  }

  packet.style.left = "0px";
  packet.textContent = "📦";

  button.addEventListener("click", runOnce);
});