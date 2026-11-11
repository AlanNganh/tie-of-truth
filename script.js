"use strict";

const publishedProfileUrl = "https://alann.github.io/tie-of-truth/";

const qrContainer = document.getElementById("qr-code");
const qrLink = document.getElementById("qr-download");
const qrUrlLabel = document.getElementById("qr-url");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function initializeQrCode() {
  if (!publishedProfileUrl) {
    qrUrlLabel.textContent = "QR code available after publishing to a permanent URL";
    return;
  }

  const profileUrl = new URL(publishedProfileUrl);
  if (profileUrl.protocol !== "https:" || !window.QRCode) {
    throw new Error("The published profile URL must use HTTPS and the QR code library must load.");
  }

  qrContainer.replaceChildren();
  new QRCode(qrContainer, {
    text: profileUrl.href,
    width: 264,
    height: 264,
    colorDark: "#111311",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  qrUrlLabel.textContent = profileUrl.host + profileUrl.pathname;

  qrLink.href = getQrPngDataUrl();
  qrLink.setAttribute("aria-disabled", "false");
}

function getQrPngDataUrl() {
  const source = qrContainer.querySelector("canvas") || qrContainer.querySelector("img");
  if (!source) throw new Error("QR code image is not available.");

  const png = document.createElement("canvas");
  png.width = 304;
  png.height = 304;
  const context = png.getContext("2d");
  if (!context) throw new Error("Unable to create the QR code image.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, png.width, png.height);
  context.drawImage(source, 20, 20, 264, 264);
  return png.toDataURL("image/png");
}

qrLink.addEventListener("click", (event) => {
  if (qrLink.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    showToast("The QR code is ready when this profile has a public URL.");
    return;
  }
  showToast("Your profile QR code is downloading.");
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("This demonstration link can be updated with a real destination.");
  });
});

if (window.QRCode) {
  initializeQrCode();
} else {
  window.addEventListener("load", initializeQrCode, { once: true });
}
