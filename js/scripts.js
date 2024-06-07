document.addEventListener('DOMContentLoaded', () => {  
    const heroSection = document.getElementById('hero-section');

    const fetchRandomPhoto = () => {
        fetch(photoGallery.ajaxUrl)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    heroSection.style.backgroundImage = `url(${data.data})`;
                }
            });
    };

    fetchRandomPhoto();

    const dropdownButtons = document.querySelectorAll('.dropbtn');
    const categoryFilter = document.getElementById('category-filter');
    const formatFilter = document.getElementById('format-filter');
    const sortOrderFilter = document.getElementById('sort-order');
    const loadMoreButton = document.querySelector('#load-more');
    const catalogue = document.querySelector('#photo-catalogue');
    const modalPhoto = document.getElementById("photoModal");
    const modalImage = document.getElementById("photoImage");
    const modalTitle = document.getElementById("photoTitle");
    const modalRef = document.getElementById("photoRef");
    const modalCategory = document.getElementById("photoCategory");
    const modalYear = document.getElementById("photoYear");
    const modalFormat = document.getElementById("photoFormat");
    const spanPhoto = document.querySelector(".photo-modal .close");
    const prevButton = document.querySelector(".modal-navigation .prev");
    const nextButton = document.querySelector(".modal-navigation .next");
    const photoRefField = document.querySelector("input[name='your-photo-ref']");

    let currentCategory = '';
    let currentFormat = '';
    let currentSortOrder = 'desc';
    let photos = [];
    let currentIndex = -1;

    const fetchPhotos = (page = 1) => {
        const params = new URLSearchParams({
            action: 'load_photos',
            category: currentCategory,
            format: currentFormat,
            sort_order: currentSortOrder,
            page
        });

        fetch(photoGallery.ajaxUrl, { method: 'POST', body: params })
            .then(response => response.json())
            .then(fetchedPhotos => {
                if (page === 1) catalogue.innerHTML = '';
                fetchedPhotos.forEach(photo => {
                    photos.push(photo);
                    const photoItem = document.createElement('div');
                    photoItem.classList.add('photo-item');
                    photoItem.innerHTML = `<a href="${photo.full}" data-index="${photos.length - 1}" data-title="${photo.title}" data-ref="${photo.ref}" data-category="${photo.category}" data-year="${photo.year}" data-format="${photo.format}"><img src="${photo.thumbnail}" alt="${photo.title}"></a>`;
                    photoItem.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        currentIndex = parseInt(e.target.parentElement.dataset.index, 10);
                        showPhoto(currentIndex);
                    });
                    catalogue.appendChild(photoItem);
                });
                loadMoreButton.dataset.page = page + 1;
            });
    };

    const showPhoto = (index) => {
        if (index >= 0 && index < photos.length) {
            const photo = photos[index];
            modalPhoto.style.display = "block";
            modalImage.src = photo.full;
            modalTitle.innerText = photo.title;
            modalRef.innerText = `Référence : ${photo.ref}`;
            modalCategory.innerText = `Catégorie : ${photo.category}`;
            modalYear.innerText = `Année : ${photo.year}`;
            modalFormat.innerText = `Format : ${photo.format}`;
            if (photoRefField) {
                photoRefField.value = photo.ref;
            }
        }

    };

    dropdownButtons.forEach(button => button.addEventListener('click', () => {
        const dropdownId = button.getAttribute('data-dropdown');
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            console.log(`Liste vers ${dropdownId}`);

            dropdown.classList.toggle('show');

            const links = dropdown.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (dropdownId === 'category-filter') {
                        currentCategory = e.target.dataset.category;
                    } else if (dropdownId === 'format-filter') {
                        currentFormat = e.target.dataset.format;
                    } else if (dropdownId === 'sort-order') {
                        currentSortOrder = e.target.dataset.sort;
                    }
                    loadMoreButton.dataset.page = 1;
                    fetchPhotos();
                });
            });
        }
    }));

    loadMoreButton.addEventListener('click', () => {
        fetchPhotos(loadMoreButton.dataset.page);
    });
    fetchPhotos();

    if (spanPhoto) {
        spanPhoto.onclick = () => {
            modalPhoto.style.display = "none";
        };
    }

    const showPrevPhoto = () => {
        if (currentIndex > 0) {
            currentIndex--;
            showPhoto(currentIndex);
        }
    };

    const showNextPhoto = () => {
        if (currentIndex < photos.length - 1) {
            currentIndex++;
            showPhoto(currentIndex);
        }
    };

    if (prevButton) {
        prevButton.onclick = showPrevPhoto;
    }

    if (nextButton) {
        nextButton.onclick = showNextPhoto;
    }

    window.addEventListener('click', (event) => {
        if (event.target == modalPhoto) {
            modalPhoto.style.display = "none";
        }
    });

    const modalContact = document.getElementById("contact-modal");
    const btnContact = document.getElementById("contact-link");
    const spanContact = document.querySelector("#contact-modal .close-contact");

    if (modalContact && btnContact && spanContact) {
        btnContact.onclick = function() {
            modalContact.style.display = "block";
        }

        spanContact.onclick = function() {
            modalContact.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modalContact) {
                modalContact.style.display = "none";
            }
        }
    }
});