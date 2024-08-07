document.addEventListener('DOMContentLoaded', () => {
    
    
    const heroSection = document.getElementById('hero-section');
    const fullscreenModal = document.getElementById("fullscreenModal");
    const fullscreenImage = document.getElementById("fullscreenImage");
    const fullscreenRef = document.getElementById("fullscreenRef");
    const fullscreenCategory = document.getElementById("fullscreenCategory");
    const closeFullscreen = document.querySelector(".close-fullscreen");
    const prevFull = document.querySelector(".prevFull");
    const nextFull = document.querySelector(".nextFull");
    const photoModal = document.getElementById("photoModal");
    const prevButton = document.querySelector(".Prevbtn .prev");
    const nextButton = document.querySelector(".Nextbtn .next");
    const previewPrev = document.getElementById("previewPrev");
    const previewNext = document.getElementById("previewNext");

    const loadMoreButton = document.querySelector('#load-more');
    const catalogue = document.querySelector('#photo-catalogue');
    const modalImage = document.getElementById("photoImage");
    const modalTitle = document.getElementById("photoTitle");
    const modalRef = document.getElementById("photoRef");
    const modalCategory = document.getElementById("photoCategory");
    const modalYear = document.getElementById("photoYear");
    const modalFormat = document.getElementById("photoFormat");
    const spanPhoto = document.querySelector(".photo-modal .close");
    const photoRefField = document.querySelector("input[name='your-photo-ref']");

    let currentCategory = '';
    let currentFormat = '';
    let currentSortOrder = 'desc';
    let photos = [];
    let currentIndex = 0;

    const loadedPhotoRefs = new Set();

    console.log("Script loaded, initializing...");

    const fetchRandomPhoto = () => {
        if (heroSection) {
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
                    const img = document.createElement('img');
                    img.src = data.data;
                    img.alt = 'Photo du hero';
                    img.classList.add('hero-content-img');
            
                    const existingImg = heroSection.querySelector('.hero-content-img');
                    if (existingImg) {
                        heroSection.replaceChild(img, existingImg);
                    } else {
                        heroSection.appendChild(img);
                    }
                }
            });
        }
    };

    fetchRandomPhoto();
    
    const fetchPhotos = (page = 1) => {
        const params = new URLSearchParams({
            action: 'load_photos',
            category: currentCategory,
            format: currentFormat,
            sort_order: currentSortOrder,
            page
        });
        console.log("Fetching photos with params:", params.toString());
        console.log("AJAX URL:", photoGallery.ajaxUrl);
    
        fetch(photoGallery.ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(fetchedPhotos => {
            if (!Array.isArray(fetchedPhotos)) {
                throw new Error('Fetched data is not an array');
            }
            if (page === 1) {
                catalogue.innerHTML = '';
                photos = [];
                loadedPhotoRefs.clear();
            }
            fetchedPhotos.forEach(photo => {
                if (!loadedPhotoRefs.has(photo.ref)) {
                    photos.push(photo);
                    loadedPhotoRefs.add(photo.ref);
    
                    const photoItem = document.createElement('div');
                    photoItem.classList.add('photo-item');
                    photoItem.innerHTML = `
                        <div class="photo-container">
                            <img src="${photo.thumbnail}" alt="${photo.title}">
                            <div class="overlay">
                                <span class="overlay-icon-view"><img src="${photoGallery.galleryUrl}/Group.png" data-index="${photos.length - 1}" class="view-icon" data-ref="${photo.ref}"></span>
                                <span class="overlay-icon-full"><img src="${photoGallery.galleryUrl}/Icon_fullscreen.png" data-full="${photo.full}" data-ref="${photo.ref}" data-category="${photo.category}" class="fullscreen-icon"></span>
                            </div>
                        </div>`;
                    catalogue.appendChild(photoItem);
                }
            });
            loadMoreButton.dataset.page = page + 1;
        });
    };

    fetchPhotos();
    
    const showPrevPhotoFullscreen = () => {
        if (currentIndex > 0) {
            currentIndex--;
            showFullscreenPhoto(currentIndex);
        }
    };

    const showNextPhotoFullscreen = () => {
        if (currentIndex < photos.length - 1) {
            currentIndex++;
            showFullscreenPhoto(currentIndex);
        }
    };

    const showFullscreenPhoto = (index) => {
        if (index >= 0 && index < photos.length) {
            const photo = photos[index];
            fullscreenModal.style.display = "block";
            fullscreenImage.src = photo.full;
            fullscreenRef.innerText = `Référence : ${photo.ref}`;
            fullscreenCategory.innerText = `Catégorie : ${photo.category}`;
        }
    };

    const updateNavigationPrevNext = () => {
        const prevThumbnail = currentIndex > 0 ? photos[currentIndex - 1].thumbnail : '';
        const nextThumbnail = currentIndex < photos.length - 1 ? photos[currentIndex + 1].thumbnail : '';
    
        const prevNav = document.querySelector('.modal-navigation .prev img');
        const nextNav = document.querySelector('.modal-navigation .next img');
    
        if (prevNav) {
            prevNav.src = prevThumbnail;
        }
    
        if (nextNav) {
            nextNav.src = nextThumbnail;
        }
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
            loadSuggestions(photo.ref); // Charge les suggestions photos ici
            updateNavigationPrevNext();
        }
    };

   

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-icon')) {
            const photoRef = event.target.getAttribute('data-ref');
            if (photoRef && photoRef !== 'undefined') {
                const url = `wp-content/themes/Mota/photo-detail.php?photo_ref=${photoRef}`;
                console.log("Redirecting to:", url);
                window.location.href = url;
            } else {
                console.error('Photo ref is undefined or invalid');
            }
        }
    
        if (event.target.classList.contains('fullscreen-icon')) {
            const fullImageUrl = event.target.dataset.full;
            const photoRef = event.target.dataset.ref;
            const photoCategory = event.target.dataset.category;
            if (fullImageUrl) {
                currentIndex = Array.from(document.querySelectorAll('.fullscreen-icon')).findIndex(icon => icon.dataset.full === fullImageUrl);
                showFullscreenPhoto(currentIndex);
            }
        }
    });

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

    /*window.addEventListener('click', (event) => {
        if (event.target == modalPhoto) {
            modalPhoto.style.display = "none";
        }
        if (event.target == fullscreenModal) {
            fullscreenModal.style.display = "none";
        }
    });*/

    if (prevFull) {
        prevFull.onclick = showPrevPhotoFullscreen;
    }

    if (nextFull) {
        nextFull.onclick = showNextPhotoFullscreen;
    }

    if (closeFullscreen) {
        closeFullscreen.onclick = () => {
            fullscreenModal.style.display = "none";
        };
    }

    // Gestion de la modale de contact pour la navigation
    const navContactModal = document.getElementById("nav-contact-modal");
    const navContactLink = document.getElementById('contact-link');
    const spanNavContact = document.querySelector(".close-nav-contact");

    if (navContactLink) {
        navContactLink.addEventListener('click', (e) => {
            e.preventDefault();
            navContactModal.style.display = 'block';
        });
    }

    if (spanNavContact) {
        spanNavContact.onclick = function() {
            navContactModal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == navContactModal) {
            navContactModal.style.display = "none";
        }
    }

    let isDropdownClicked = false;

    // Fonction pour fermer tous les dropdowns
    const closeDropdowns = () => {
        if (isDropdownClicked) {
            isDropdownClicked = false;
            return;
        }
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
        });
    };
    
    // Ajout d'un événement sur document pour fermer les dropdowns quand on clique à l'extérieur
    document.addEventListener('click', (event) => {
        closeDropdowns();
    });
    
    // Empêcher la propagation des événements de clic sur les boutons des dropdowns
    const dropdownButtons = document.querySelectorAll('.dropbtn');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            isDropdownClicked = true;
            const dropdownId = button.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const wasShown = dropdown.classList.contains('show');
                console.log(`État précédent du dropdown ${dropdownId}:`, wasShown);
                closeDropdowns();
                if (!wasShown) {
                    dropdown.classList.add('show');
                    dropdown.style.display = 'block';
                }
                console.log(`Dropdown ${dropdownId} cliqué`);
            }
        });
    });
    
    // Empêche la propagation des événements de clic sur le contenu des dropdowns
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    dropdownContents.forEach(content => {
        content.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Clic sur le contenu du dropdown empêché');
        });
    });
    
    const loadFilters = () => {
        fetch(photoGallery.ajaxUrl + '?action=' + photoGallery.loadFiltersAction)
            .then(response => response.json())
            .then(data => {
                console.log('Données des filtres chargées:', data);
                if (data.success) {
                    const categoryFilter = document.getElementById('category-filter');
                    const formatFilter = document.getElementById('format-filter');
    
                    const defaultCategory = document.querySelector('button[data-dropdown="category-filter"]');
                    const defaultFormat = document.querySelector('button[data-dropdown="format-filter"]');
    
                    // Option "Tout" pour les catégories
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
                        console.log('Filtre catégorie: Tout');
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
                                console.log('Filtre catégorie:', category);
                            });
                            categoryFilter.appendChild(a);
                        });
                    } else {
                        console.log('Aucune catégorie trouvée');
                    }
    
                    // Option "Tout" pour les formats
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
                        console.log('Filtre format: Tout');
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
                                console.log('Filtre format:', format);
                            });
                            formatFilter.appendChild(a);
                        });
                    } else {
                        console.log('Aucun format trouvé');
                    }
                } else {
                    console.error('Échec du chargement des filtres');
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des filtres:', error);
            });
    };
    
    loadFilters();
    
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
        console.log('Tri par: Tout');
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
            console.log('Tri par:', e.target.innerText);
        });
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('open');
    });
});
