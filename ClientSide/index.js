function ajaxCall(method, api, data, successCB, errorCB) {
    $.ajax({
        type: method,
        url: api,
        data: data,
        cache: false,
        contentType: "application/json",
        dataType: "json",
        success: successCB,
        error: errorCB
    });
}

const apiMovies = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies";
const apiRating = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/rating/";
const apiDuration = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/GetByDuration?duration=";
const apiAddWish = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/AddToWishList";
const apiGetWish = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/GetWishList?id=";
const apiRemoveWish = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/RemoveFromWish"
const apiCast = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Casts";
const apiCastToMovie = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Casts/AddCastToMovie";
const apiCastOfMovie = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Casts/GetCastOfMovie?id=";
const apiUser = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Users";
const apiLogName = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Users/LogInName";
/*
const apiMovies = "https://localhost:7208/api/Movies";
const apiRating = "https://localhost:7208/api/Movies/rating/";
const apiDuration = "https://localhost:7208/api/Movies/GetByDuration?duration=";
const apiAddWish = "https://localhost:7208/api/Movies/AddToWishList";
const apiGetWish = "https://localhost:7208/api/Movies/GetWishList?id=";
const apiRemoveWish = "https://localhost:7208/api/Movies/RemoveFromWish";
const apiCast = "https://localhost:7208/api/Casts";
const apiCastToMovie = "https://localhost:7208/api/Casts/AddCastToMovie";
const apiCastOfMovie = "https://localhost:7208/api/Casts/GetCastOfMovie?id=";
const apiUser = "https://localhost:7208/api/Users";
const apiLogName = "https://localhost:7208/api/Users/LogInName";
*/
const admin = 60;

function init() {
    ajaxCall('Get', apiMovies, null, SuccessAllMovies, ErrorCallBack);
    ajaxCall('GET', apiCast, null, SuccessCBGetAllCast, ErrorCallBack);
    document.getElementById("bdC").max = new Date().toISOString().split('T')[0];
    $("#filter").hide();
    $("#castRow").hide();
    $("#movieRow").hide();
    $("#adminBtn").hide();

    if (localStorage["connectedUser"] != undefined) {
        connectedUser = parseInt(localStorage["connectedUser"]);
        updateAuthButton(localStorage["userName"]);
        remember = true;
        console.log(remember);
    }
    else {
        connectedUser = 0;
        remember = false;
        console.log(remember);
    }
}

function SuccessAllMovies(data) {
    movies = data;
    let strMovies = "";
    for (let i = 0; i < movies.length; i++) {
        console.log(movies[i].title);

        strMovies += `<div class="col-md-6 col-lg-4 card" id="m${movies[i].id}">
                <div class="row">
                    <div class="col-4 col-md-6 cardPart">
                        <img class="image-container" src="${movies[i].photoUrl}" onerror="handleImageError(this)">
                        <span class="rating"><i class="fas fa-star"></i> ${movies[i].rating}</span>
                    </div>
                    <div class="col-8 col-md-6 cardPart">
                        <h3 class="MovieName">${movies[i].title}</h3>
                        <p><i class="fa fa-clock-o"></i>${movies[i].duration} minutes</p>
                        <p><i class="fa fa-dollar"></i>${movies[i].income / 1000000}M$</p>
                        <span class="tag-cloud genre">${movies[i].genre}</span>
                        <span class="tag-cloud language">${movies[i].language}</span>
                    <div class="movieCastDiv">
                        <button class="movieCastBtn" onclick="showCast('${movies[i].id}')">Show Cast</button>
                    </div>
                    </div>
                    <div class="col-12 desc">
                        ${movies[i].description}
                    </div>
                    <div class="col-12 wishD">
                        <button class="btnATWish" onclick="AddToWishList(${movies[i].id})">Add to Wish List</button>
                    </div>
                    <div class="col-12 deleteWishD">
                        <button class="btnRFWish" onclick="RemoveFromWishList(${movies[i].id})">Remove from Wish List</button>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById("AllMovies").innerHTML = strMovies;
    if (connectedUser != 0) {
        $(".wishD").show();
        $(".deleteWishD").hide();
    }
    else {
        $(".deleteWishD").hide();
        $(".wishD").hide();
    }
}

function SuccessCBGetAllCast(data) {
    console.log(data);
    let allCasrStr = "";
    for (let i = 0; i < data.length; i++) {
        allCasrStr += `<div class="col-12 col-md-4 col-lg-3 player-card">
                        <img src="${data[i].photoUrl}">
                        <div class="player-info">
                            <span><strong>id:</strong> ${data[i].id}</span>
                            <span><strong>name:</strong> ${data[i].name}</span>
                            <span><strong>role:</strong> ${data[i].role}</span>
                            <span><strong>date of birth:</strong> ${data[i].dateOfBirth.toString().split('T')[0]}</span>
                            <span><strong>country:</strong> ${data[i].country}</span>
                        </div>
                         <div class="col-12">
                        <button class="AddCaToMo" onclick="openAddCastModal('${data[i].id}')">Add Cast To Movie</button>
                    </div>
                    </div>`;
    }
    document.getElementById("CMrow").innerHTML = allCasrStr;
}



function AddToWishList(id) {
    id2 = [connectedUser, id]
    console.log(id2);
    ajaxCall('POST', apiAddWish, JSON.stringify(id2), SuccessCBAddWL, ErrorCallBack);
}

function RemoveFromWishList(movieId) {
    id = {
        user: connectedUser,
        movie: movieId
    }
    ajaxCall('DELETE', apiRemoveWish, JSON.stringify(id), SuccessCBRemoveWL, ErrorCallBack);
}

function SuccessCBAddWL(data) {
    Swal.fire({
        title: 'Movie Added To WishList!',
        icon: 'success',
        timer: 1000, // המחווה תיסגר אוטומטית לאחר 2 שניות
        showConfirmButton: false // הסתרת כפתור "אישור"
    });
}

function SuccessCBRemoveWL(data) {
    ShowWishList();
}

function ErrorCallBack(err) {
    Swal.fire({
        title: 'Error!',
        text: err.responseText,
        icon: 'error'
    });
}

function ShowWishList() {
    $(".wishD").hide();
    $(".card").hide();
    $("#castRow").hide();
    $("#filter").show();
    $("#movieRow").hide();
    $(".deleteWishD").show();
    $("#filterRating").val('');
    $("#filterDuration").val('');
    ajaxCall('GET', apiGetWish + connectedUser, null, SuccessCBWish, ErrorCBWish);
}

function SuccessCBWish(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        $(`#m${data[i]}`).show();
    }
}

function ErrorCBWish(err) {
    Swal.fire({
        title: 'Error!',
        text: err.responseText,
        icon: 'error'
    });

}

function ShowAllMovies() {
    $(".card").show();
    if (connectedUser != 0) {
        $(".wishD").show();
    }
    else {
        $(".wishD").hide();
    }
    $("#filter").hide();
    $("#castRow").hide();
    $("#movieRow").hide();
    $(".deleteWishD").hide();

}

function FilterByDur() {
    duration = $("#filterDuration").val();
    $("#filterRating").val('');
    $(".card").hide();
    ajaxCall('GET', apiDuration + duration + "&u=" + connectedUser, null, SuccessCBWish, ErrorCallBack);

}

function FilterByRate() {
    rating = $("#filterRating").val();
    $("#filterDuration").val('');
    $(".card").hide();
    ajaxCall('GET', apiRating + rating + "/user/" + connectedUser, null, SuccessCBWish, ErrorCallBack);

}

function handleImageError(imgElement) {
    imgElement.src = "pics/Xpic.png";
}

function ShowCastForm() {
    $(".card").hide();
    $("#filter").hide();
    $("#castRow").show();
    $("#movieRow").hide();
    if (connectedUser != 0) {
        $(".AddCaToMo").show();
    }
    else
        $(".AddCaToMo").hide();
}

function SuccessCBCast(data) {
    console.log(data);
    Swal.fire({
        title: 'Cast Added successfully!',
        icon: 'success',
        timer: 2000, // המחווה תיסגר אוטומטית לאחר 2 שניות
        showConfirmButton: false // הסתרת כפתור "אישור"
    });
    $("#castForm")[0].reset();
    document.getElementById("CMrow").innerHTML +=
        `<div class="col-12 col-md-4 col-lg-3 player-card">
                        <img src="${data.photoUrl}">
                        <div class="player-info">
                            <span><strong>id:</strong> ${data.id}</span>
                            <span><strong>name:</strong> ${data.name}</span>
                            <span><strong>role:</strong> ${data.role}</span>
                            <span><strong>date of birth:</strong> ${data.dateOfBirth.toString().split('T')[0]}</span>
                            <span><strong>country:</strong> ${data.country}</span>      
                        </div> 
                         <div class="col-12">
                        <button class="AddCaToMo" onclick="openAddCastModal('${data.id}')">Add Cast To Movie</button>
                    </div>     
                    </div>`;
    $(".AddCaToMo").hide();
}

function ErrorCBCast(err) {
    Swal.fire({
        title: 'Error!',
        text: 'Something went wrong! Check if this ID is already taken!',
        icon: 'error'
    });
}

// Open Modal
function openModal() {
    document.getElementById("authModal").style.display = "flex";
}

// Close Modal
function closeModal() {
    $("#loginForm")[0].reset();
    $("#signupForm")[0].reset();
    $('#rememberBoxLog').prop('checked', false);
    $('#rememberBoxReg').prop('checked', false);
    document.getElementById("authModal").style.display = "none";
}

// Switch to Signup Form
function switchToSignup() {
    document.getElementById("loginFormDiv").style.display = "none";
    document.getElementById("signupFormDiv").style.display = "block";
    document.getElementById("modalTitle").innerText = "Signup";
}

// Switch to Login Form
function switchToLogin() {
    document.getElementById("signupFormDiv").style.display = "none";
    document.getElementById("loginFormDiv").style.display = "block";
    document.getElementById("modalTitle").innerText = "Login";
}

function SuccessCBReg(data) {
    Swal.fire({
        title: 'Congratulations!',
        text: 'You have successfully registered. Welcome aboard! 🎉',
        icon: 'success'
    });
    connectedUser = parseInt(data["id"]);
    remember = document.getElementById('rememberBoxReg').checked;
    closeModal();
    updateAuthButton(data["userName"]);  // עדכן את כפתור ההתנתקות עם שם המשתמש
    ShowAllMovies();
    if (remember) {
        localStorage["connectedUser"] = connectedUser;
        localStorage["userName"] = data["userName"];
    }
}


function SuccessCBUser(data) {

    Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back! We’re happy to see you 🎉',
        icon: 'success',
        confirmButtonText: 'Continue'
    });
    connectedUser = parseInt(data["id"]);
    remember = document.getElementById('rememberBoxLog').checked;
    closeModal();
    updateAuthButton(data["userName"]);  // עדכן את כפתור ההתנתקות עם שם המשתמש
    if (remember) {
        localStorage["connectedUser"] = connectedUser;
        localStorage["userName"] = data["userName"];
    }
}

function updateAuthButton(userName) {
    const authButton = document.getElementById("logInBtn");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const addMovieButton = document.getElementById("addMovieBtn");
    const addWishListButton = document.getElementById("btnWishList");
    const btnAllMovies = document.getElementById("btnAllMovies");
    const moviesDiv = btnAllMovies.parentElement;
    const btnCastForm = document.getElementById("btnCastForm");
    const castDiv = btnCastForm.parentElement;

    if (connectedUser != 0) {
        welcomeMessage.style.display = "inline";  // הצג את אלמנט ה-welcome
        welcomeMessage.textContent = `Welcome ${userName}`;  // הוסף את שם המשתמש
        authButton.textContent = "Logout"; // שנה את הטקסט להתנתקות
        addMovieButton.style.display = "inline-block"; // הצג את כפתור הוסף סרט
        addWishListButton.style.display = "inline-block";
        moviesDiv.classList.remove('col-6');
        moviesDiv.classList.add('col-3');
        castDiv.classList.remove('col-6');
        castDiv.classList.add('col-3');
        $(".wishD").show();
        $(".deleteWishD").hide();
        $(".AddCaToMo").show();
        if (connectedUser == admin) {
            $("#adminBtn").show();
        }
    } else {
        welcomeMessage.style.display = "none";  // הסתר את אלמנט ה-welcome אם לא מחובר
        authButton.textContent = "Login / Signup"; // שנה את הטקסט להתחברות
        addMovieButton.style.display = "none"; // הסתר את כפתור הוסף סרט
        addWishListButton.style.display = "none";
        moviesDiv.classList.remove('col-3');
        moviesDiv.classList.add('col-6');
        castDiv.classList.remove('col-3');
        castDiv.classList.add('col-6');
        $(".wishD").hide();
        $(".deleteWishD").hide();
        $(".AddCaToMo").hide();
        $("#adminBtn").hide();
    }
}


function CheckLogIn() {
    if (connectedUser != 0) {
        connectedUser = 0;
        localStorage.clear();
        ShowAllMovies();
        updateAuthButton();
        Swal.fire({
            title: 'Logged out successfully!',
            text: 'See you next time!',
            icon: 'info',
            timer: 2000, // המחווה תיסגר אוטומטית לאחר 2 שניות
            showConfirmButton: false // הסתרת כפתור "אישור"
        });
        remember = false;
    }
    else {
        openModal();
    }
}

function addMovie() {
    $(".card").hide();
    $("#filter").hide();
    $("#castRow").hide();
    $("#movieRow").show();
    $("#btnWishList").show();

}

$(document).ready(function () {
    $("#movieRow").submit(function (event) {
        event.preventDefault();

        movie = {
            id: 0,
            title: $("#titleM").val(),
            rating: $("#ratingM").val(),
            income: $("#incomeM").val(),
            releaseYear: $("#releaseYearM").val(),
            duration: $("#durationM").val(),
            language: $("#languageM").val(),
            description: $("#descriptionM").val(),
            genre: $("#genreM").val(),
            photoUrl: $("#photoUrlM").val(),
        }
        ajaxCall('POST', apiMovies, JSON.stringify(movie), SuccessCBMovie, ErrorCallBackMovie);
    });

    $("#castForm").submit(function (event) {
        event.preventDefault();

        cast = {
            Id: $("#idC").val(),
            Name: $("#nameC").val(),
            Role: $("#roleC").val(),
            DateOfBirth: $("#bdC").val(),
            Country: $("#countryC").val(),
            PhotoUrl: $("#phuC").val(),
        }
        ajaxCall('POST', apiCast, JSON.stringify(cast), SuccessCBCast, ErrorCBCast);
    });

    $("#loginForm").submit(function (event) {
        event.preventDefault();
        let user = [
            $("#userLogIn").val(),
            $("#passwordLogIn").val(),
        ]
        ajaxCall('POST', apiLogName, JSON.stringify(user), SuccessCBUser, ErrorCallBack);
    });

    $("#signupForm").submit(function (event) {
        event.preventDefault();

        let user = {
            UserName: $("#userNameReg").val(),
            Email: $("#emailReg").val(),
            Password: $("#passwordReg").val()
        };
        ajaxCall('POST', apiUser, JSON.stringify(user), SuccessCBReg, ErrorCallBack);
    });

    $("#addCastToMovieForm").submit(function (event) {
        event.preventDefault();
        let id = {
            castId: document.getElementById('castSelect').getAttribute('data-cast-id'),
            movieId: parseInt($("#castSelect").val())
        };
        ajaxCall('POST', apiCastToMovie, JSON.stringify(id), SuccessCBCastToMovie, ErrorCallBack);
    });

});

function SuccessCBCastToMovie(data) {
    Swal.fire({
        title: "Cast Added To Movie!",
        text: "The cast was successfully added to the movie!",
        icon: "success",
        confirmButtonText: "OK"
    });
}

function SuccessCBMovie(data) {
    Swal.fire({
        title: "Movie Added!",
        text: "The movie was successfully added to the database!",
        icon: "success",
        confirmButtonText: "OK"
    });
    console.log("Movie added successfully");
    document.getElementById("AllMovies").innerHTML += `<div class="col-md-6 col-lg-4 card" id="m${data.id}">
    <div class="row">
        <div class="col-4 col-md-6 cardPart">
            <img class="image-container" src="${data.photoUrl}" onerror="handleImageError(this)">
            <span class="rating"><i class="fas fa-star"></i> ${data.rating}</span>
        </div>
        <div class="col-8 col-md-6 cardPart">
            <h3 class="MovieName">${data.title}</h3>
            <p><i class="fa fa-clock-o"></i>${data.duration} minutes</p>
            <p><i class="fa fa-dollar"></i>${data.income / 1000000}M$</p>
            <span class="tag-cloud genre">${data.genre}</span>
            <span class="tag-cloud language">${data.language}</span>
            <div class="movieCastDiv">
                <button class="movieCastBtn" onclick="showCast('${data.id}">Show Cast</button>
            </div>
        </div>
        <div class="col-12 desc">
            ${data.description}
        </div>
        <div class="col-12 wishD">
            <button class="btnATWish" onclick="AddToWishList(${data.id})">Add to Wish List</button>
        </div>
         <div class="col-12 deleteWishD">
             <button class="btnRFWish" onclick="RemoveFromWishList(${movies[i].id})">Remove from Wish List</button>
        </div>
    </div>
</div>`;
    $(`#m${data.id}`).hide();
    movies.push(data);
    // אופציונלי: אפס את הטופס לאחר הצלחה
    document.getElementById("movieForm").reset();
}

function ErrorCallBackMovie(err) {
    Swal.fire({
        title: "Failed to Add Movie",
        text: "There was an error while adding the movie. Please try again later.",
        icon: "error",
        confirmButtonText: "OK"
    });
    console.error("Error adding movie:", err);
}

// Open the Add Cast Modal
function openAddCastModal(castId) {
    document.getElementById('castSelect').setAttribute('data-cast-id', castId);
    GenerateOptions();
    document.getElementById('addCastModal').style.display = 'flex';
}

// Close the Add Cast Modal
function closeAddCastModal() {
    document.getElementById('addCastModal').style.display = 'none';
}


function GenerateOptions() {
    let optionsStr = "";
    for (let i = 0; i < movies.length; i++) {
        optionsStr += `<option value="${movies[i].id}">${movies[i].title}</option>`;
    }
    console.log(optionsStr);
    document.getElementById("castSelect").innerHTML += optionsStr;

}

function showCast(movieId) {
    console.log(movieId);
    ajaxCall('GET', apiCastOfMovie + movieId, null, SuccessCBCastOfMovie, ErrorCallBack)
}

function SuccessCBCastOfMovie(data) {
    const modal = document.getElementById("showMovieCast");
    modal.style.display = "flex";
    let castStr = "";
    for (let i = 0; i < data.length; i++) {
        castStr += `<div class="player-card castMcard">
                        <div>
                            <img src="${data[i].photoUrl}">
                        </div>  
                        <div class="player-info">
                            <span><strong>name:</strong> ${data[i].castName}</span>
                            <span><strong>role:</strong> ${data[i].role}</span>
                        </div>
                    </div>`;
    }
    document.getElementById("modalBody3").innerHTML = castStr;
}

function closeMovieCastModal() {
    const modal = document.getElementById("showMovieCast");
    modal.style.display = "none";
}