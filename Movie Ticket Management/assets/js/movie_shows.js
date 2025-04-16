function loadMovieShows() {
    $.ajax({
        url: '/API/get_movie_shows.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("check here your show id :", response);
            if (response.success) {
                let rows = response.data.map((show, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${show.movie_name}</td>
                        <td>${show.theater_name}</td>
                        <td>${show.theater_location}</td>
                        <td>${show.show_time}</td>
                        <td>${show.price}</td>
                       <td>
                        <div class="d-flex flex-column flex-md-row align-items-start gap-2">
                        <button class="btn btn-sm btn-success update-btn" title="Edit" data-id="${show.show_id}">
                        <i class="fas fa-pencil-alt"></i> 
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" title="Delete" data-id="${show.show_id}">
                        <i class="fas fa-trash-alt"></i>
                        </button>
                        </div>
                        </td>

                    </tr>
                `);
                $('#showTableBody').html(rows.join(''));
            } else {
                $('#showTableBody').html('<tr><td colspan="7" class="text-danger text-center">Failed to load data.</td></tr>');
            }
        },
        error: function () {
            $('#showTableBody').html('<tr><td colspan="7" class="text-danger text-center">Error fetching data.</td></tr>');
        }
    });
}


$(document).ready(function () {
    loadMovieShows();
    $('#movieCategory').change(function () {
        const categoryId = $(this).val();
        if (categoryId) {
            $.ajax({
                url: '/API/get_movie.php',
                type: 'GET',
                data: { category_id: categoryId },
                success: function (response) {
                    const movieSelect = $('#movieSelect');
                    movieSelect.empty().append('<option value="">Select a movie</option>');

                    if (response.length > 0) {
                        response.forEach(function (movie) {
                            movieSelect.append('<option value="' + movie.id + '">' + movie.title + '</option>');
                        });
                    } else {
                        movieSelect.append('<option value="">No movies available</option>');
                    }
                },
                error: function () {
                    alert('Error fetching movie data');
                }
            });
        } else {
            $('#movieSelect').empty().append('<option value="">Select a movie</option>');
        }
    });

    // Load theaters
    $.ajax({
        url: '/API/get_theater.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success && response.data.length > 0) {
                console.log("Theater", response);
                const container = $('#theaterCheckboxes');
                container.empty();
                response.data.forEach((theater, index) => {
                    const id = `theater_${index}`;
                    const checkbox = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="theaters[]" id="${id}" value="${theater.id}"> <!-- Updated here -->
                            <label class="form-check-label" for="${id}">${theater.name} (${theater.location})</label>
                        </div>`;
                    container.append(checkbox);
                });
            } else {
                $('#theaterCheckboxes').html('<p>No theaters found</p>');
            }
        },
        error: function () {
            alert('Error fetching theater data');
        }
    });
    //show time
    $.ajax({
        url: '/API/get_shows_times.php',
        type: 'GET',
        success: function (response) {
            if (response.success && response.data.length > 0) {
                const container = $('#showTimeCheckboxes');
                container.empty();
                response.data.forEach(function (time) {
                    const checkbox = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="show_times[]" value="${time.id}" id="show_${time.id}">
                            <label class="form-check-label" for="show_${time.id}">${time.description}</label>
                        </div>`;
                    container.append(checkbox);
                });
            } else {
                $('#showTimeCheckboxes').html('<p class="text-danger">No show times found.</p>');
            }
        },
        error: function () {
            $('#showTimeCheckboxes').html('<p class="text-danger">Failed to load show times.</p>');
        }
    });

    $('#movieShowForm').submit(function (e) {
        e.preventDefault();

        const movie_id = $('#movieSelect').val();
        console.log("Movie_id is :", movie_id);
        const price = $('#price').val();
        console.log("Movie_show Price :", price);
        const theaters = $('#theaterCheckboxes input[type="checkbox"]:checked').map(function () {
            return $(this).val();
        }).get();
        console.log("Selected Theaters:", theaters);
        const show_times = $('#showTimeCheckboxes input[type="checkbox"]:checked').map(function () {
            return $(this).val();
        }).get();
        console.log("Selected show_time:", show_times);

        if (!movie_id || !price || theaters.length === 0 || show_times.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required.',
            });
            return;
        }

        const movie_shows = [];
        theaters.forEach(theater_id => {
            show_times.forEach(show_time_id => {
                movie_shows.push({
                    movie_id: movie_id,
                    theater_id: theater_id,
                    show_time_id: show_time_id,
                    price: price
                });
            });
        });

        $.ajax({
            url: '/API/insert_movie_show.php',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ movie_shows: movie_shows }),
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your data has been saved.',
                        icon: 'success',
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Okay'
                    }).then(() => {
                        $('#addMovieShow').modal('hide');
                        $('#movieShowForm')[0].reset();
                        $('#movieSelect').empty().append('<option value="">Select a movie</option>');
                        $('#theaterCheckboxes input[type="checkbox"]').prop('checked', false);
                        $('#showTimeCheckboxes input[type="checkbox"]').prop('checked', false);
                        loadMovieShows();
                    });
                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong',
                    text: 'There was an issue while submitting the form.',
                });
            }
        });
    });


    // Delete handler
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        console.log("delete btn show id is :", id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/API/delete_movie_shows.php?id=${id}`,
                    type: 'GET',
                    success: function (response) {
                        console.log("from delete :", response)
                        if (response.success) {
                            Swal.fire('Deleted!', response.message, 'success');
                            loadMovieShows();
                        } else {
                            Swal.fire('Error!', response.message, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    }
                });
            }
        });
    });

    $(document).on('click', '.update-btn', function () {
        const id = $(this).data('id');


        $.ajax({
            url: `/API/get_single_show.php?id=${id}`,
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    const data = response.data;

                    // Prepare the data for the update form
                    const theatersOptions = data.theaters.map(theater => {
                        return `<option value="${theater.id}" ${theater.id === data.theater_id ? 'selected' : ''}>${theater.name}</option>`;
                    }).join('');

                    const showTimesOptions = data.show_times.map(showTime => {
                        return `<option value="${showTime.id}" ${showTime.id === data.show_time_id ? 'selected' : ''}>${showTime.description}</option>`;
                    }).join('');

                    Swal.fire({
                        title: 'Update Show Details',
                        html: `
                        <input type="number" id="updatePrice" class="swal2-input" value="${data.price}" placeholder="Enter new price">
                        <select id="updateTheater" class="swal2-input">
                            <option value="">Select Theater</option>
                            ${theatersOptions}
                        </select>
                        <select id="updateShowTime" class="swal2-input">
                            <option value="">Select Show Time</option>
                            ${showTimesOptions}
                        </select>
                    `,
                        confirmButtonText: 'Update',
                        focusConfirm: false,
                        preConfirm: () => {
                            const price = Swal.getPopup().querySelector('#updatePrice').value;
                            const theater_id = Swal.getPopup().querySelector('#updateTheater').value;
                            const show_time_id = Swal.getPopup().querySelector('#updateShowTime').value;


                            if (!price || !theater_id || !show_time_id) {
                                Swal.showValidationMessage('All fields are required');
                                return false;
                            }

                            return {
                                id,
                                price,
                                theater_id,
                                show_time_id
                            };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {

                            $.ajax({
                                url: '/API/update_movie_show.php',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(result.value),
                                success: function (res) {
                                    if (res.success) {
                                        Swal.fire('Success!', res.message, 'success');
                                        loadMovieShows();
                                    } else {
                                        Swal.fire('Error!', res.message, 'error');
                                    }
                                },
                                error: function () {
                                    Swal.fire('Error!', 'Something went wrong.', 'error');
                                }
                            });
                        }
                    });
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            }
        });
    });





});
