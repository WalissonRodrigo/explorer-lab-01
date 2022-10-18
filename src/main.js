import "./css/index.css"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")




function setCardType(type) {

  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#FD3C1B", "#00BAFF"],
    bitcoin: ["#4D52C8", "#FF4242"],
    default: ["black", "gray"],
  }
  let color, _type;
  if (
    typeof type === undefined || typeof type === null || type === "" ||
    (type !== "visa" && type !== "mastercard" && type !== "bitcoin" &&
      type !== "elo" && type !== "default")
  ) {
    color = "default"
    _type = "default"
  } else {
    color = colors[type]
    _type = type
  }
  ccBgColor01.setAttribute("fill", color[0])
  ccBgColor02.setAttribute("fill", color[1])
  ccLogo.setAttribute("src", `cc-${_type}.svg`)
}

setCardType("default")

globalThis.setCardType = setCardType