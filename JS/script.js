document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
    fetch('/data/items.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Count items for stats
            document.getElementById('watch-count').textContent = data.watches.length;
            document.getElementById('shirt-count').textContent = data.shirts.length;
            document.getElementById('perfume-count').textContent = data.perfumes.length;

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
                document.querySelector('.watches-container').insertAdjacentHTML('beforeend', createItemCard(watch, 'watches'));
                
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
                document.querySelector('.shirts-container').insertAdjacentHTML('beforeend', createItemCard(shirt, 'shirts'));
                
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
                document.querySelector('.perfumes-container').insertAdjacentHTML('beforeend', createItemCard(perfume, 'perfumes'));
                
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
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('item-detail-btn')) {
                    const itemId = e.target.dataset.id;
                    const category = e.target.dataset.category;
                    let item;
                    
                    if (category === 'watches') item = data.watches.find(w => w.id == itemId);
                    if (category === 'shirts') item = data.shirts.find(s => s.id == itemId);
                    if (category === 'perfumes') item = data.perfumes.find(p => p.id == itemId);
                    
                    if (item) {
                        document.getElementById('modalItemTitle').textContent = item.name;
                        document.getElementById('modalItemImage').src = `images/${category}/${item.image}`;
                        document.getElementById('modalItemDescription').textContent = item.description;
                        document.getElementById('modalItemBrand').textContent = item.brand;
                        document.getElementById('modalItemDate').textContent = item.acquisitionDate;
                        document.getElementById('modalItemValue').textContent = `$${item.value.toLocaleString()}`;
                        
                        const modal = new bootstrap.Modal(document.getElementById('itemModal'));
                        modal.show();
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();
});