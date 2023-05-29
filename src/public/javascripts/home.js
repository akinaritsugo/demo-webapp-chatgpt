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
  message && $msgp.text(message);
  $msgdiv.append($msgp);
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
  if(text.toLowerCase().startsWith("[done]")) {
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
  createUserMessageBox(message);
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

  // Clear the text box
  $txtMessage.val("");
  $txtMessage.focus();

  // Prevent the form from submitting
  event.preventDefault();
  event.stopPropagation();
  return false;
};

var btnSend_onclick = (event) => {
};

/* -------------------------- */
var btntest_onclick = (event) => {
  // const sse = new EventSource("/api/chat/sse2");
  // sse.addEventListener("open", (event) => {
  //   console.log("Connection opened!");
  // });
  // sse.addEventListener("message", (event) => {
  //   const data = JSON.parse(event.data);
  //   console.log(data);
  // });
  $.ajax({
    url: "/api/chat/stream",
    method: "POST",
    data: { message: "Hello" },
    success: (data, textStatus, jqXHR) => {
      const arr = data.split("\n\n");
      for (const item of arr) {
        if (item.startsWith("data:")) {
          const text = item.slice("data: ".length);
          if (text.toLowerCase().startsWith("[DONE]")) {
            break;
          }
          const data = JSON.parse(text);
          const message = data.choices[0]?.delta?.content;
          message && setTimeout(() => {
            createAssistantMessageBox(message);
          }, 100);
        }
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      alert("Error sending message!");
    }
  });
};
var displayMessage = (messages, $target) => {
  const message = messages.shift();
  if (message) {
    setTimeout(() => {
      $target.append(document.createTextNode(message.toString() + " "));
      displayMessage(messages, $target);
    }, 30);
  }
};

var btntest_onclick2 = (event) => {
  const $test = $("#test");
  var arr = [10, 20, 30, 40];
  displayMessage(arr, $test);
  // for (const item of arr) {
  //   // var callback = (list) => {
  //   //   const item = list.shift();
  //   //   setTimeout(() => {
  //   //     $test.append(document.createTextNode(item.toString() + " "));
  //   //     callback(list);
  //   //   }, 100);
  //   // };
  //   // callback(arr);
  // }
};
/* -------------------------- */

var document_onready = (event) => {
  $("#frmSendMessage").on("submit", frmSendMessage_onsubmit);
  $("#btnSend").on("click", btnSend_onclick);
  $("#btntest").on("click", btntest_onclick2);
};

$(document).ready(document_onready);