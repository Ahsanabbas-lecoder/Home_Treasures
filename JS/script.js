$(document).ready(function() {
    // Set current year in footer
    $('#year').text(new Date().getFullYear());

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero animation
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // Load items from JSON
    $.getJSON('/data/items.json', function(data) {
        // Count items for stats
        $('#watch-count').text(data.watches.length);
        $('#shirt-count').text(data.shirts.length);
        $('#perfume-count').text(data.perfumes.length);

        // Animate stats counting
        gsap.to('#watch-count, #shirt-count, #perfume-count', {
            innerText: function(index) {
                return index === 0 ? data.watches.length : 
                       index === 1 ? data.shirts.length : data.perfumes.length;
            },
            duration: 2,
            ease: 'power1.out',
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: '.stats-box',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Load watches
        data.watches.forEach((watch, index) => {
            $('.watches-container').append(createItemCard(watch, 'watches'));
            
            // Animate each item with stagger
            gsap.to(`.watch-item-${index}`, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: `#watches`,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Load shirts
        data.shirts.forEach((shirt, index) => {
            $('.shirts-container').append(createItemCard(shirt, 'shirts'));
            
            gsap.to(`.shirt-item-${index}`, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: `#shirts`,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Load perfumes
        data.perfumes.forEach((perfume, index) => {
            $('.perfumes-container').append(createItemCard(perfume, 'perfumes'));
            
            gsap.to(`.perfume-item-${index}`, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: `#perfumes`,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Initialize item modal
        $('.item-detail-btn').click(function() {
            const itemId = $(this).data('id');
            const category = $(this).data('category');
            let item;
            
            if (category === 'watches') item = data.watches.find(w => w.id == itemId);
            if (category === 'shirts') item = data.shirts.find(s => s.id == itemId);
            if (category === 'perfumes') item = data.perfumes.find(p => p.id == itemId);
            
            if (item) {
                $('#modalItemTitle').text(item.name);
                $('#modalItemImage').attr('src', `images/${category}/${item.image}`);
                $('#modalItemDescription').text(item.description);
                $('#modalItemBrand').text(item.brand);
                $('#modalItemDate').text(item.acquisitionDate);
                $('#modalItemValue').text(`$${item.value.toLocaleString()}`);
                
                const modal = new bootstrap.Modal(document.getElementById('itemModal'));
                modal.show();
            }
        });
    });

    // Helper function to create item cards
    function createItemCard(item, category) {
        return `
            <div class="col-md-4 collection-item ${category}-item-${item.id}">
                <div class="card item-card">
                    <img src="images/${category}/${item.image}" class="card-img-top item-img" alt="${item.name}">
                    <div class="card-body item-body text-center">
                        <h5 class="card-title item-title">${item.name}</h5>
                        <p class="card-text item-brand">${item.brand}</p>
                        <p class="card-text item-price">$${item.value.toLocaleString()}</p>
                        <button class="btn btn-outline-primary item-detail-btn" data-id="${item.id}" data-category="${category}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Smooth scrolling for navigation
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate(
            {
                scrollTop: $($(this).attr('href')).offset().top - 70,
            },
            500,
            'linear'
        );
    });

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();
});