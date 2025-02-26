$(document).ready(function() {
    const url = 'https://repo-tech2edge.github.io/tasks/sample.json';
    let curr_epi = 0;
    let epi_data = [];

    // Toggle for mobile
    $('.navbar-toggler').click(function() {
        $('.navbar').toggleClass('show');
    });

    // Close menu 
    $(document).click(function(event) {
        if (!$(event.target).closest('.navbar').length) {
            $('.navbar').removeClass('show');
        }
    });

   $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            console.log('API Response:', response);
            epi_data = response.episodes || [];
            const s_data = response.series || {};

            if (!epi_data.length) {
                console.error('No episodes found');
                return;
            }

            // Updating
            $('.hero-section').css('background-image', `url('${s_data.img}')`);
            $('.series-title').text(s_data.title || 'MIRZAPUR');

            appy_html();
            set_event();
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });

    function appy_html() {
        const ep_row = $('.episode-row');
        ep_row.empty();

        epi_data.forEach((episode, index) => {
            const card = $(`
                <div class="episode-card">
                    <div class="episode-number">${index + 1}</div>
                    <img src="${episode.img}" alt="Episode ${index + 1}">
                    <div class="episode-info">
                        <h4>${episode.title || `Episode ${index + 1}`}</h4>
                        <span>${episode.duration || '45min'}</span>
                    </div>
                </div>
            `);

            card.click(() => open_modal(episode, index));
            ep_row.append(card);
        });

        
        const total_width = epi_data.length * (300 + 16); 
        ep_row.width(total_width);
    }

    function set_event() {
        // Slider navigation
        $('.slider-arrow.next').click(() => {
            const maxScroll = epi_data.length - 4; 
            if (curr_epi < maxScroll) {
                curr_epi++;
                update_slider();
            }
        });

        $('.slider-arrow.prev').click(() => {
            if (curr_epi > 0) {
                curr_epi--;
                update_slider();
            }
        });

        // Resume 
        $('.btn-resume').click(() => {
            console.log('Resuming episode...');
        });

        // My List 
        $('.btn-mylist').click(() => {
            console.log('Adding to my list...');
        });
    }

    function update_slider() {
        const cardWidth = 300 + 16; 
        const translation = -curr_epi * cardWidth;
        $('.episode-row').css('transform', `translateX(${translation}px)`);
    }

    function open_modal(episode, index) {
        const modal = $('#episodeModal');
        modal.find('.modal-title').text(episode.title || `Episode ${index + 1}`);
        modal.find('.preview-image').attr('src', episode.img);
        modal.find('.episode-info h4').text(episode.title || `Episode ${index + 1}`);
        modal.find('.episode-info p').text(episode.description || 'No description available');
        modal.modal('show');
    }

    
    $(window).resize(() => {
        update_slider();
    });
});