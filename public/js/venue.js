$(document).ready(() => {

    for (rowNum = 1; rowNum <= 20; rowNum++) {

        $(".section").append(`
            <div class="section-row row-${rowNum}"></div>
        `);

        for (seatNum = 1; seatNum <= 30; seatNum++) {
            
            let id = (rowNum - 1) * 30 + seatNum;

            $(`.section.north .row-${rowNum}`).append(`
                <div class="seat" data-id="${id}"
                    data-section=""
                    data-row=""
                    data-seat=""
                    data-price="">
                </div>
            `);

            $(`.section.east .row-${rowNum}`).append(`
                <div class="seat" data-id="${id + 600}"
                    data-section=""
                    data-row=""
                    data-seat=""
                    data-price="">
                </div>
            `);

            $(`.section.south .row-${rowNum}`).append(`
                <div class="seat" data-id="${id + 1200}"
                    data-section=""
                    data-row=""
                    data-seat=""
                    data-price="">
                </div>
            `);

            $(`.section.west .row-${rowNum}`).append(`
                <div class="seat" data-id="${id + 1800}"
                    data-section=""
                    data-row=""
                    data-seat=""
                    data-price="">
                </div>
            `);
            
        }

    }

    $.ajax("api/venue", {
        type: "GET"
    })
    .then(allTickets => {
        for (const ticket of allTickets) {
            const ticketSquareElement = $(`[data-id="${ticket.ticket_id}"]`);

            ticketSquareElement.addClass("available");

            ticketSquareElement.attr("data-section", `${ticket.section_number}`);
            ticketSquareElement.attr("data-row", `${ticket.row_number}`);
            ticketSquareElement.attr("data-seat", `${ticket.seat_number}`);
            ticketSquareElement.attr("data-price", `${ticket.price}`);
            
            ticketSquareElement.on("click", seatClick);
        }
    })
    .catch((error) => {
        console.log(error);
    })

    $(".section").on("mouseenter", (event) => {
        $(event.currentTarget).find("h3").hide();
        $(event.currentTarget).find(".section-row").show();

    });

    $(".section").on("mouseleave", (event) => {
        $(".section h3").show();
        $(".section-row").hide();

        $(".stage h3").show();
        $(".stage p").remove();
        $(".stage button").remove();
    });

    $(".seat").on("mouseover", event => {
        
        // if data attributes populated
        if (event.target.dataset.row) {
            $(".stage h3").hide();

            $(".stage p").remove();
            $(".stage button").remove();

            $(".stage").append(`
                <p class="top">Section Number: ${event.target.dataset.section}</p>
                <p>Row Number: ${event.target.dataset.row}</p>
                <p>Seat Number: ${event.target.dataset.seat}</p>
                <p>Price: $${event.target.dataset.price}</p>
                <p class="purchase">Click seat to purchase!</p>
            `)
        }
    })


    function seatClick(event) {
        const ticketId = event.target.dataset.id;

        location.href = "/user-email"

        $.ajax("/api/delete/listing/" + ticketId, {
            type: "DELETE"
        })
        .then(() => {
            console.log("delete successful");
        })
        .catch(() => {
            console.log("there's been an error trying to delete from database");
        });
    }


});