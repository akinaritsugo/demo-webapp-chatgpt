// Create User Message Box
var createUserMessageBox = (message) => {
  const $root = $(document.createElement("div"));
  const $icondiv = $(document.createElement("div"));
  const $iconimg = $(document.createElement("i"));
  const $msgdiv = $(document.createElement("div"));
  const $msgp = $(document.createElement("p"));

  // Set style
  $root.addClass("chat-row");
  $icondiv.addClass("chat-item-user-icon");
  $iconimg.addClass("fa-solid fa-user");
  $msgdiv.addClass("chat-item-user-balloon");

  // Construct DOM structure
  $icondiv.append($iconimg);
  $msgp.text(message);
  $msgdiv.append($msgp);
  $root.append($icondiv);
  $root.append($msgdiv);
  $("#chat-log").append($root);
};

// Craete Assistant Message Box
var createAssistantMessageBox = (message) => {
  const $root = $(document.createElement("div"));
  const $icondiv = $(document.createElement("div"));
  const $iconimg = $(document.createElement("i"));
  const $msgdiv = $(document.createElement("div"));
  const $msgp = $(document.createElement("p"));

  // Set style
  $root.addClass("chat-row");
  $icondiv.addClass("chat-item-bot-icon");
  $iconimg.addClass("fa-solid fa-robot");
  $msgdiv.addClass("chat-item-bot-balloon");

  // Construct DOM structure
  $icondiv.append($iconimg);
  $msgp.text(message);
  $msgdiv.append($msgp);
  $root.append($icondiv);
  $root.append($msgdiv);
  $("#chat-log").append($root);
};


var frmSendMessage_onsubmit = (event) => {
  const $txtMessage = $("#txtMessage");
  const message = $txtMessage.val();

  // Request to the server
  $.ajax({
    url: "/api/chat",
    method: "POST",
    data: { message },
    success: (data, textStatus, jqXHR) => {
      createAssistantMessageBox(data.content);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      alert("Error sending message!");
    }
  });

  // Create user message box
  createUserMessageBox(message);

  // Scroll to bottom chat log area
  $("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);

  // Clear the text box
  $txtMessage.val("");
  $txtMessage.focus();

  // Create assistant message box
  // createAssistantMessageBox("Hello, I'm the assistant!");

  // Prevent the form from submitting
  event.preventDefault();
  event.stopPropagation();
  return false;
};

var btnSend_onclick = (event) => {
};

var document_onready = (event) => {
  $("#frmSendMessage").on("submit", frmSendMessage_onsubmit);
  $("#btnSend").on("click", btnSend_onclick);
};

$(document).ready(document_onready);