$(document).ready(function () {
    function loadTheaterCards() {
        $('#theaterCardContainer').show(); 
        $.ajax({
            url: '/API/get_theater.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    let cards = response.data.map(theater => `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 border-0 shadow-lg rounded" style="background: #f8f9fa;">
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 class="card-title text-primary font-weight-bold">${theater.name}</h5>
                                        <p class="card-text text-muted mb-2">
                                            <i class="bi bi-geo-alt-fill text-danger"></i>
                                            <strong>Location:</strong> ${theater.location}
                                        </p>
                                    </div>
                                    <div>
                                        <span class="badge badge-pill badge-${theater.status === 'Available' ? 'success' : 'danger'} p-2 px-3">
                                            ${theater.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);

                    $('#theaterCards').html(cards.join(''));
                } else {
                    $('#theaterCards').html('<p class="text-danger">Failed to fetch theaters.</p>');
                }
            },
            error: function () {
                $('#theaterCards').html('<p class="text-danger">Error loading data.</p>');
            }
        });
    }
    loadTheaterCards();
});
