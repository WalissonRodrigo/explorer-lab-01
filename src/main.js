import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const ccCVC = document.querySelector(".cc-security > .value")
const ccExpirationDate = document.querySelector(".cc-expiration > .value")
const ccHolder = document.querySelector(".cc-holder > .value")
const ccNumber = document.querySelector(".cc-number")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#FD3C1B", "#00BAFF"],
    bitcoin: ["#4D52C8", "#FF4242"],
    default: ["black", "gray"],
  }
  let color, _type
  if (
    typeof type === undefined ||
    typeof type === null ||
    type === "" ||
    (type !== "visa" &&
      type !== "mastercard" &&
      type !== "bitcoin" &&
      type !== "elo" &&
      type !== "default")
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

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMask = IMask(securityCode, securityCodePattern)
function onChangeCVC(event) {
  ccCVC.textContent =
    event.target.value.length === 0 ? "123" : event.target.value
}
securityCodeMask.on("accept", onChangeCVC)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 30).slice(2),
    },
  },
}
const expirationDateMask = IMask(expirationDate, expirationDatePattern)
function onChangeExpirationDate(event) {
  ccExpirationDate.textContent =
    event.target.value.length === 0 ? "02/32" : event.target.value
}
expirationDateMask.on("accept", onChangeExpirationDate)

const cardHolder = document.querySelector("#card-holder")
const cardHolderPattern = {
  mask: /^[a-zA-ZçÇãáàâäẽèéêëĩíìîïõòóôõöũúùûüÃÁÀÂÄẼÉÈÊËĨÍÌÎÏÕÓÒÔÖŨÚÙÛÜ~`´^¨ ]*$/,
}
const cardHolderMask = IMask(cardHolder, cardHolderPattern)
function onChangeHolderName(event) {
  ccHolder.textContent =
    event.target.value.length === 0 ? "Fulano da Silva" : event.target.value
}
cardHolderMask.on("accept", onChangeHolderName)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,12}(\d{0,3})/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}$/,
      cardtype: "mastercard",
    },
    {
      mask: /\w{18}/,
      regex: /\w{18}/,
      cardtype: "bitcoin",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find((item) =>
      number.match(item.regex)
    )
    setCardType(foundMask.cardtype)
    return foundMask
  },
}
const carNumberMask = IMask(cardNumber, cardNumberPattern)
function onChangeCardNumber(event) {
  ccNumber.textContent =
    event.target.value.length === 0 ? "0000 0000 0000 0000" : event.target.value
}
carNumberMask.on("accept", onChangeCardNumber)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  const card = {
    number: ccNumber.textContent,
    name: ccHolder.textContent,
    validate: ccExpirationDate.textContent,
    cvc: ccCVC.textContent,
  }
  if (carNumberMask.value.length === 0)
    return alert(
      "Preencha o campo NÚMERO DO CARTÃO antes de adicionar o cartão!"
    )
  if (cardHolderMask.value.length < 3)
    return alert("Preencha o campo NOME antes de adicionar o cartão!")
  if (expirationDateMask.value.length < 5)
    return alert("Preencha o campo EXPIRAÇÃO antes de adicionar o cartão!")
  if (securityCodeMask.value.length < 3)
    return alert("Preencha o campo CVC antes de adicionar o cartão!")
  alert(`Cartão adicionado!
    Confira os dados: 
    ${JSON.stringify(card)}
  `)
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
