
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

const apiUser = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Users";
const apiGetWish = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/GetWishList?id=";
const apiMovies = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies"

/*
const apiUser = "https://localhost:7208/api/Users";
const apiGetWish = "https://localhost:7208/api/Movies/GetWishList?id=";
const apiMovies = "https://localhost:7208/api/Movies";
*/

$(document).ready(function () {
  ajaxCall('Get', apiMovies, null, SuccessAllMovies, ErrorCB);
  // Initialize DataTable
  $("#usersTable").DataTable({
    paging: true,
    searching: true,
    info: false,
    lengthChange: false,
    pageLength: 5,
  });

  ShowUsers();
});

function SuccessAllMovies(data) {
  movies = data;
  let strMovies = "";
  for (let i = 0; i < movies.length; i++) {
    console.log(movies[i].title);

    strMovies += `<div class="container card" id="m${movies[i].id}">
              <div class="row">
                  <div class="col-4 col-md-6 cardPart">
                      <img class="image-container" src="${movies[i].photoUrl}" onerror="handleImageError(this)">
                  </div>
                  <div class="col-8 col-md-6 cardPart">
                      <h3 class="MovieName">${movies[i].title}</h3>
                      <p><i class="fa fa-clock-o"></i>${movies[i].duration} minutes</p>
                      <p><i class="fa fa-dollar"></i>${movies[i].income / 1000000}M$</p>
                      <span class="tag-cloud genre">${movies[i].genre}</span>
                      <span class="tag-cloud language">${movies[i].language}</span> </br>
                      <div id="ratediv">
                      <span class="rating"><i class="fas fa-star"></i> ${movies[i].rating}</span>
                      </div>
                  </div>
                  <div class="col-12 desc">
                      ${movies[i].description}
                  </div>
              </div>
          </div>`;
  }
  document.getElementById("modalBody").innerHTML = strMovies;
  $(".card").hide();
}

function ShowUsers() {
  // Destroy existing datatable if it exists - common issuue with datatable
  if ($.fn.DataTable.isDataTable("#usersTable")) {
    $("#usersTable").DataTable().destroy();
  }
  ajaxCall("GET", apiUser, null, SuccessUsers, ErrorCB);
};


function SuccessUsers(data) {
  console.log(data)
  const dataTable = $("#usersTable tbody");
  dataTable.empty();
  for (let i = 0; i < data.length; i++) {
    dataTable.append(
      `<tr>
        <td>${data[i].userName}</td>
        <td>${data[i].email}</td>
        <td><button class="userBtn" 
        onclick="ShowWishList(${data[i].id})">View</button></td>
      </tr>`
    );
  }
}

function ErrorCB() {
  Swal.fire({
    title: 'Error!',
    text: err.responseText,
    icon: 'error'
  });
}

function ShowWishList(id) {
  console.log(id);
  ajaxCall("GET", apiGetWish + id, null, SuccessWishList, ErrorCB);
}

function SuccessWishList(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    $(`#m${data[i]}`).show();
  }
  const modal = document.getElementById("showWish");
  modal.style.display = "flex";
}


function closeWishModal() {
  const modal = document.getElementById("showWish");
  modal.style.display = "none";
  $(".card").hide();
}