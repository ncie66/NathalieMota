document.addEventListener('DOMContentLoaded', () => {
    console.log("photo-detail.js laoded");

    const prevButton = document.querySelector(".Prevbtn .prev");
    const nextButton = document.querySelector(".Nextbtn .next");
    const previewPrev = document.getElementById("previewPrev");
    const previewNext = document.getElementById("previewNext");
    const modalImage = document.getElementById("photoImage");
    const modalTitle = document.getElementById("photoTitle");
    const modalRef = document.getElementById("photoRef");
    const modalCategory = document.getElementById("photoCategory");
    const modalYear = document.getElementById("photoYear");
    const modalFormat = document.getElementById("photoFormat");
    const photoRefField = document.querySelector("input[name='your-photo-ref']");
    const suggestionContainer = document.querySelector(".containerSuggestion");

    let photos = window.photoGallery.photos || [];
    let currentIndex = 0;


    const getCurrentPhotoRefFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('photo_ref');
        return ref;
    };

    const getPhotoIndexByRef = (ref) => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].ref === ref) {
                return i;
            }
        }
        return -1;
    };

    const updateUrl = (ref) => {
        const newUrl = `?photo_ref=${ref}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    const updateNavButtons = (index) => {
        const prevIndex = index > 0 ? index - 1 : null;
        const nextIndex = index < photos.length - 1 ? index + 1 : null;
        const prevRef = prevIndex !== null ? photos[prevIndex].ref : '';
        const nextRef = nextIndex !== null ? photos[nextIndex].ref : '';

        prevButton.dataset.ref = prevRef;
        nextButton.dataset.ref = nextRef;

        if (prevRef) {
            previewPrev.src = photos[prevIndex].full;
        } else {
            previewPrev.src = '';
        }

        if (nextRef) {
            previewNext.src = photos[nextIndex].full;
        } else {
            previewNext.src = '';
        }
    };

    const loadSuggestions = (ref) => {
        fetch(`${photoGallery.ajaxUrl}?action=fetch_related_photos&ref=${ref}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && Array.isArray(data.data.photos) && data.data.photos.length > 0) {
                    suggestionContainer.innerHTML = '';
                    data.data.photos.forEach(photo => {
                        const img = document.createElement('img');
                        img.src = photo.full;
                        img.alt = photo.title;
                        img.classList.add('suggestion-image');
                        suggestionContainer.appendChild(img);
                    });
                } else {
                    suggestionContainer.innerHTML = '';
                }
            })
            .catch(error => {
                suggestionContainer.innerHTML = 'Erreur de chargement de suggesitons';
            });
    };

    // Utiliser la référence de photo injectée
    const photoRef = photoGallery.photoRef;
    loadSuggestions(photoRef);

    const showPhotoDetails = (index) => {
        const photo = photos[index];
        modalImage.src = photo.full;
        modalTitle.innerText = photo.title;
        modalRef.innerText = `Référence : ${photo.ref}`;
        modalCategory.innerText = `Catégorie : ${photo.category}`;
        modalYear.innerText = `Année : ${photo.year}`;
        modalFormat.innerText = `Format : ${photo.format}`;
        if (photoRefField) {
            photoRefField.value = photo.ref;
        }
        updateUrl(photo.ref); // Met à jour URL
        currentIndex = index;  // Mettre à jour currentIndex ici
        updateNavButtons(index);
        loadSuggestions(photo.ref); // Recharger les suggestions

    };

    const initializePage = () => {
        if (photos && photos.length > 0) {
            const currentPhotoRef = getCurrentPhotoRefFromUrl();
            currentIndex = getPhotoIndexByRef(currentPhotoRef);
            if (currentIndex !== -1) {
                showPhotoDetails(currentIndex);
            } else {
                console.error("Photo reference URL not found in array");
            }
        } else {
            console.error("Photos array is not empty or ini.");
        }
    };

    initializePage();

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-icon')) {
            const photoRef = event.target.getAttribute('data-ref');
            const photoIndex = event.target.getAttribute('data-index');
            if (photoRef && photoRef !== 'undefined') {
                currentIndex = parseInt(photoIndex);
                showPhotoDetails(currentIndex);
            } else {
                console.error('Photo ref est indefini ou invalide');
            }
        }

        if (event.target.classList.contains('fullscreen-icon')) {
            const fullImageUrl = event.target.dataset.full;
            const photoRef = event.target.dataset.ref;
            const photoCategory = event.target.dataset.category;
            if (fullImageUrl) {
                currentIndex = Array.from(document.querySelectorAll('.fullscreen-icon')).findIndex(icon => icon.dataset.full === fullImageUrl);
                showPhotoDetails(currentIndex);
            }
        }
    });

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showPhotoDetails(currentIndex);
                loadSuggestions(photos[currentIndex].ref); // Recharge les suggestions

            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < photos.length - 1) {
                currentIndex++;
                showPhotoDetails(currentIndex);
                loadSuggestions(photos[currentIndex].ref);

            }
        });

        // Event listeners pour le survol des boutons
        prevButton.addEventListener('mouseover', () => {
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
            const prevRef = prevIndex !== null ? photos[prevIndex].ref : '';
            if (prevRef) {
                previewPrev.src = photos[prevIndex].full;
                previewPrev.style.display = 'block'; 
            } else {
                previewPrev.src = '';
                previewPrev.style.display = 'none';
            }
        });

        nextButton.addEventListener('mouseover', () => {
            const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : null;
            const nextRef = nextIndex !== null ? photos[nextIndex].ref : '';
            if (nextRef) {
                previewNext.src = photos[nextIndex].full;
                previewNext.style.display = 'block';
            } else {
                previewNext.src = '';
                previewNext.style.display = 'none';
            }
        });

        prevButton.addEventListener('mouseout', () => {
            previewPrev.style.display = '';
        });

        nextButton.addEventListener('mouseout', () => {
            previewNext.style.display = '';
        });
    } else {
        console.error("PrevButton, NextButton, previewPrev ou previewNext indefini.");
    }

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

    const lightboxContactModal = document.getElementById("lightbox-contact-modal");
    const btnsLightboxContact = document.querySelectorAll(".contactFormModal");
    const spanLightboxContact = document.querySelector(".close-contact");

    btnsLightboxContact.forEach(btn => {
        btn.addEventListener('click', function() {
            lightboxContactModal.style.display = "block";
            const reference = this.getAttribute('data-reference');
            const refInput = lightboxContactModal.querySelector('input[name="your-photo-ref"]');
            if (refInput) {
                refInput.value = reference;
            }
        });
    });

    if (spanLightboxContact) {
        spanLightboxContact.onclick = function() {
            lightboxContactModal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == lightboxContactModal) {
            lightboxContactModal.style.display = "none";
        }
    }
});
