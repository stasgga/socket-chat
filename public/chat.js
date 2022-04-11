// Connection

const socket = io.connect("/");

//DOM

const usernameScreen = document.getElementById("username-screen");
const chat = document.getElementById("chat");
const enterMessageBlock = document.getElementById("enter-message");

const feedback = document.getElementById("feedback");

const messageInput = document.getElementById("input-message");
const output = document.getElementById("output");
const username = document.getElementById("inputMain");
const enterPortalButton = document.getElementById("enter-portal");
const sendMessageButton = document.getElementById("button-chat-room");

const error = document.getElementById("error");
let newUser = "";
let message = "";

//Event listener for entering portal
enterPortalButton.addEventListener("click", () => {
  newUser = username.value.trim();
  if (newUser) {
    socket.emit("username", newUser);
    usernameScreen.style.display = "none";
    chat.style.display = "block";
    enterMessageBlock.style.display = "flex";
    messageInput.focus();
  } else error.style.display = "block";
});

//Event listener for submiting username when enter portal via enter key
usernameScreen.addEventListener("keypress", e => {
  newUser = username.value.trim();
  if (!e.shiftKey && e.which === 13) {
    e.preventDefault();
    if (newUser) {
      socket.emit("username", newUser);
      usernameScreen.style.display = "none";
      chat.style.display = "block";
      enterMessageBlock.style.display = "flex";
      messageInput.focus();
    } else error.style.display = "block";
  }
});

//Event listener for sending a message from chat room
sendMessageButton.addEventListener("click", () => {
  message = messageInput.value.trim();
  if (message) {
    socket.emit("newMessage", {
      message: message,
      user: newUser
    });
    messageInput.value = "";
    messageInput.focus();
  } else {
    messageInput.focus();
    messageInput.value = "";
  }
});

//Event listener for sending a message via enter key

messageInput.addEventListener("keypress", e => {
  if (!e.shiftKey && e.which === 13) {
    message = messageInput.value.trim();
    e.preventDefault();
    if (message) {
      socket.emit("newMessage", {
        message: message,
        user: newUser
      });
      messageInput.value = "";
      messageInput.focus();
    } else {
      messageInput.value = "";
      messageInput.focus();
    }
  } else messageInput.focus();
});

//Event listener for typing a message
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", newUser);
});

//Event listener for focusing out from input field
messageInput.addEventListener("focusout", () => {
  socket.emit("stopTyping");
});

//Listen for events from server
socket.on("newMessage", data => {
  feedback.innerHTML = "";
  messageInput.focus();
  output.innerHTML += `<p><strong>${data.user}</strong>: ${data.message}</p>`;
  chat.scrollTop = chat.scrollHeight;
});

socket.on("typing", data => {
  feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});

socket.on("stopTyping", () => {
  feedback.innerHTML = "";
});
