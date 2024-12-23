//const userAPI = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Users/";
// const userAPI = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Users/";
// const wishlistApiforCertainUser = "https://proj.ruppin.ac.il/bgroup3/test2/tar1/api/Movies" + "/Wishlist"+ "/userId/" 
function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
    type: method,
    url: api,
    data: data,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: successCB,
    error: errorCB,
  });
}

const apiUser = "https://localhost:7208/api/Users";
const apiGetWish = "https://localhost:7208/api/Movies/GetWishList?id=";


$(document).ready(function () {
  // Initialize DataTable
  $("#usersTable").DataTable({
    paging: true,
    searching: true,
    info: false,
    lengthChange: false,
    pageLength: 5,
  });

  UploadUsers();
});

UploadUsers = () => {
    // Destroy existing datatable if it exists - common issuue with datatable
    if ($.fn.DataTable.isDataTable("#usersTable")) {
      $("#usersTable").DataTable().destroy();
    }
    ajaxCall("GET",apiUser,null,SuccessUsers, ErrorCB);
  };


  function SuccessUsers(data){
    console.log(data)
    const dataTable = $("#usersTable tbody");
    dataTable.empty();
    for (let i = 0; i< data.length; i++) {
      dataTable.append(
        `<tr>
        <td>${data[i].userName}</td>
        <td>${data[i].email || "Unknown"}</td>
        <td><button class="detail-btn detail-btn-info " 
        onclick="showWishList(${data[i].id})">View</button></td>
      </tr>`
      );      
    }
  }

  function ErrorCB(){
    Swal.fire({
      title: "Upload failed",
      text: "Something went wrong with the server!",
      icon: "error",
    });
  }

function showWishList(id){
  console.log(id);
  ajaxCall("GET", apiGetWish+id,null,SuccessWishList, ErrorCB);
}

function SuccessWishList(data){
  console.log(data)
  $("#wishlistItems").empty();

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      $("#wishlistItems").append(`
        <div class="wishlist-item">
          <p><strong>Title:</strong> ${data[i].title}</p>
          <p><strong>Genre:</strong> ${data[i].genre || "Unknown"}</p>
          <p><strong>Release Date:</strong> ${data[i].releaseYear || "Unknown"}</p>
          <hr>
        </div>
      `);
    }
    $("#wishlistModal").modal("show");
  } 
  else {
    Swal.fire({
      title: 'Error!',
      text: err.responseText,
      icon: 'error',
      timer: 2000
  });
  }
  
}
  
   