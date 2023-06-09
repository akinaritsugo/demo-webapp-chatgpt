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
  $iconimg.addClass("fas fa-user");
  $msgdiv.addClass("chat-item-user-balloon");

  // Construct DOM structure
  $icondiv.append($iconimg);
  message && $msgp.text(message);
  $msgdiv.append($msgp);
  $root.append($icondiv);
  $root.append($msgdiv);
  $("#chat-log").append($root);

  return $msgp;
};

// Craete Assistant Message Box
var createAssistantMessageBox = (message) => {
  const $root = $(document.createElement("div"));
  const $icondiv = $(document.createElement("div"));
  const $iconimg = $(document.createElement("i"));
  const $msgdiv = $(document.createElement("div"));
  const $msgp = $(document.createElement("span"));

  // Set style
  $root.addClass("chat-row");
  $icondiv.addClass("chat-item-bot-icon");
  $iconimg.addClass("fas fa-robot");
  $msgdiv.addClass("chat-item-bot-balloon");

  // Construct DOM structure
  $icondiv.append($iconimg);
  // message && $msgp.text(message);
  if (message) {
    $msgp.text(message);
    $msgdiv.append($msgp);
  } else {
    // Create spinner icon
    const $spinner = $(document.createElement("i"));
    $spinner.addClass("fas fa-spinner fa-spin");
    $msgdiv.append($msgp);
    $msgdiv.append($spinner);
  }
  $root.append($icondiv);
  $root.append($msgdiv);
  $("#chat-log").append($root);

  return $msgp;
};

// Display Assistant Message gradually
var displayAssistantMessage = (events, $target) => {
  const event = events.shift();

  // Retrieve message from event
  const text = event.slice("data: ".length);
  if (text.toLowerCase().startsWith("[done]")) {
    $target.siblings("i").remove();
    return;
  }
  const data = JSON.parse(text);
  const message = data.choices[0]?.delta?.content;

  // Display message
  setTimeout(() => {
    message && $target.append(message);
    displayAssistantMessage(events, $target);
  }, 10);
};

var frmSendMessage_onsubmit = (event) => {
  const $txtMessage = $("#txtMessage");
  const message = $txtMessage.val();

  // Create message box
  const $usrMsg = createUserMessageBox(message);
  const $astMsg = createAssistantMessageBox();

  // Request to the server
  $.ajax({
    url: "/api/chat/stream",
    method: "POST",
    data: { message },
    success: (data, textStatus, jqXHR) => {
      // Split received data into event array
      const arr = data.split("\n\n");
      displayAssistantMessage(arr, $astMsg);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      alert("Error sending message!");
    }
  });

  // Scroll to bottom chat log area
  $("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);

  // Clear the input text box
  $txtMessage.val("");
  $txtMessage.focus();

  // Prevent the form from submitting
  event.preventDefault();
  event.stopPropagation();
  return false;
};

var btnNew_onclick = (event) => {
  $("#chat-log").empty();
  $("#txtChatId").val("");
};

var document_onready = (event) => {
  $("#frmSendMessage").on("submit", frmSendMessage_onsubmit);
  $("#btnNew").on("click", btnNew_onclick);
};

$(document).ready(document_onready);