document.addEventListener('DOMContentLoaded', () => {

    const heroSection = document.getElementById('hero-section');

    const fetchRandomPhoto = () => {
        fetch(photoGallery.ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: photoGallery.getRandomPhotoAction
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                heroSection.style.backgroundImage = `url(${data.data})`;
            }
        });
    };

    fetchRandomPhoto();

    const dropdownButtons = document.querySelectorAll('.dropbtn');

    dropdownButtons.forEach(button => button.addEventListener('click', (event) => {
        event.stopPropagation();
        const dropdownId = button.getAttribute('data-dropdown');
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            const wasShown = dropdown.classList.contains('show');

            closeDropdowns();

            if (wasShown) {
                dropdown.classList.remove('show');
                dropdown.style.display = 'none';
            } else {
                dropdown.classList.add('show');
                dropdown.style.display = 'block';
            }
            const links = dropdown.querySelectorAll('a');
        } else {
        }
    }));

    const closeDropdowns = () => {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
        });
    };

    document.addEventListener('click', closeDropdowns);

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

        fetch(photoGallery.ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(response => response.json())
        .then(fetchedPhotos => {
            if (page === 1) catalogue.innerHTML = '';
            fetchedPhotos.forEach(photo => {
                photos.push(photo);
                const photoItem = document.createElement('div');
                photoItem.classList.add('photo-item');
                photoItem.innerHTML = `
                <a href="${photo.full}" data-index="${photos.length - 1}" data-title="${photo.title}" data-ref="${photo.ref}" data-category="${photo.category}" data-year="${photo.year}" data-format="${photo.format}">
                    <img src="${photo.thumbnail}" alt="${photo.title}">
                    <div class="overlay">
                        <span class="overlay-icon-view"><img src="${photoGallery.galleryUrl}/Group.png"></span>
                        <span class="overlay-icon-full"><img src="${photoGallery.galleryUrl}/Icon_fullscreen.png"></span>
                    </div>
                </a>`;
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

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            fetchPhotos(loadMoreButton.dataset.page);
        });
    }

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

    const loadFilters = () => {
        fetch(photoGallery.ajaxUrl + '?action=' + photoGallery.loadFiltersAction)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const categoryFilter = document.getElementById('category-filter');
                    const formatFilter = document.getElementById('format-filter');

                    const defaultCategory = document.querySelector('button[data-dropdown="category-filter"]');
                    const defaultFormat = document.querySelector('button[data-dropdown="format-filter"]');

                    // option "Tout" pour les catégories
                    const allCategories = document.createElement('a');
                    allCategories.href = '#';
                    allCategories.dataset.category = '';
                    allCategories.innerText = 'Tout';
                    allCategories.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentCategory = '';
                        fetchPhotos();
                        closeDropdowns(); // Ferme le menu déroulant
                        defaultCategory.innerText = 'Catégorie';
                    });
                    categoryFilter.innerHTML = ''; 
                    categoryFilter.appendChild(allCategories);

                    if (data.data.categories && data.data.categories.length > 0) {
                        data.data.categories.forEach(category => {
                            const a = document.createElement('a');
                            a.href = '#';
                            a.dataset.category = category;
                            a.innerText = category;
                            a.addEventListener('click', (e) => {
                                e.preventDefault();
                                currentCategory = e.target.dataset.category;
                                fetchPhotos();
                                closeDropdowns();
                                defaultCategory.innerText = category;
                            });
                            categoryFilter.appendChild(a);
                        });
                    } else {
                        console.log('Aucune cat trouve');
                    }

                    // option "Tout" pour les formats
                    const allFormats = document.createElement('a');
                    allFormats.href = '#';
                    allFormats.dataset.format = '';
                    allFormats.innerText = 'Tout';
                    allFormats.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentFormat = '';
                        fetchPhotos();
                        closeDropdowns();
                        defaultFormat.innerText = 'Format';
                    });
                    formatFilter.innerHTML = '';
                    formatFilter.appendChild(allFormats);

                    if (data.data.formats && data.data.formats.length > 0) {
                        data.data.formats.forEach(format => {
                            const a = document.createElement('a');
                            a.href = '#';
                            a.dataset.format = format;
                            a.innerText = format;
                            a.addEventListener('click', (e) => {
                                e.preventDefault();
                                currentFormat = e.target.dataset.format;
                                fetchPhotos();
                                closeDropdowns();
                                defaultFormat.innerText = format;
                            });
                            formatFilter.appendChild(a);
                        });
                    } else {
                    }
                } else {
                }
            })
            .catch(error => {
            });
    };

    loadFilters();

    //écouteurs d'événements pour les options de tri
    const sortOrderLinks = document.querySelectorAll('#sort-order a');
    const defaultSortOrder = document.querySelector('button[data-dropdown="sort-order"]');
    const allSortOrder = document.createElement('a');
    allSortOrder.href = '#';
    allSortOrder.dataset.sort = '';
    allSortOrder.innerText = 'Tout';
    allSortOrder.addEventListener('click', (e) => {
        e.preventDefault();
        currentSortOrder = 'desc';
        fetchPhotos();
        closeDropdowns();
        defaultSortOrder.innerText = 'Trier par';
    });
    const sortOrderFilter = document.getElementById('sort-order');
    sortOrderFilter.prepend(allSortOrder);

    sortOrderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentSortOrder = e.target.dataset.sort;
            fetchPhotos();
            closeDropdowns();
            defaultSortOrder.innerText = e.target.innerText;
        });
    });

    const initLightbox = () => {
        const lightbox = new SimpleLightbox('.photo-gallery a', { });
    };

    initLightbox();
});
