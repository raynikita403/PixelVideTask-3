$(document).ready(function () {
    
    $("#Movies").click(function (e) {
        e.preventDefault();
        $("#main-content").load("movie_list.html");
    });

    $("#Theater").click(function (e) {
        e.preventDefault();
        $("#main-content").load("theator.html");
    });

    $("#update-link").click(function (e) {
        e.preventDefault();
        $("#main-content").load("movie_shows.html");
    });

    $("#display-link").click(function (e) {
        e.preventDefault();
        $("#main-content").load("display.html");
    });

 
    fetchMovies();
    $("#all-category, #Movies").click(function (e) {
        e.preventDefault();
        $(".category-link").removeClass("active");
        $("#all-category").addClass("active");
        fetchMovies(); 
    });

 
    $(".category-link").click(function () {
        const categoryId = $(this).data("category-id");
        $(".category-link").removeClass("active");
        $(this).addClass("active");
        fetchMovies(categoryId);
    });

    // Fetch movie function
    function fetchMovies(categoryId = null) {
        $.ajax({
            url: "/API/get_movie.php",
            method: "GET",
            dataType: "json",
            data: categoryId ? { category_id: categoryId } : {},
            success: function (response) {
                $("#movieContainer").empty();

                if (Array.isArray(response) && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        const movie = response[i];
                        const card = `
                            <div class="card m-3 shadow" style="width: 18rem;">
                                <img src="${movie.banner}" class="card-img-top" alt="${movie.title}" style="width: 100%; height: 420px; object-fit: cover;">
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title text-primary font-weight-bold">${movie.title}</h5>
                                    <p class="card-text text-muted small mb-2">${movie.description}</p>
                                    <ul class="list-unstyled mb-3">
                                        <li class="mb-1"><strong>Rating:</strong> <span class="text-success"><i class="bi bi-star-fill"></i> ${movie.rating}</span></li>
                                        <li class="mb-1"><strong>Duration:</strong> ${movie.duration} mins</li>
                                        <li><strong>Release:</strong> ${movie.released_date}</li>
                                    </ul>
                                    <a href="#" class="btn btn-outline-primary btn-sm w-100"><i class="bi bi-eye-fill"></i> View</a>
                                </div>
                            </div>
                        `;
                        $("#movieContainer").append(card);
                    }
                } else {
                    $("#movieContainer").html("<p class='text-center'>No movies found.</p>");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", error);
                $("#movieContainer").html("<p class='text-danger'>Failed to load movies.</p>");
            }
        });
    }
});
