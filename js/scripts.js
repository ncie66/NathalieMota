document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('#category-filter, #format-filter, #sort-order');
    const loadMoreButton = document.querySelector('#load-more');
    const catalogue = document.querySelector('#photo-catalogue');
    const modal = document.getElementById("photoModal");
    const modalImage = document.getElementById("photoImage");
    const modalTitle = document.getElementById("photoTitle");
    const modalRef = document.getElementById("photoRef");
    const modalCategory = document.getElementById("photoCategory");
    const modalYear = document.getElementById("photoYear");
    const modalFormat = document.getElementById("photoFormat");
    const modalDate = document.getElementById("photoDate");
    const span = document.getElementsByClassName("close")[0];

    const fetchPhotos = (page = 1) => {
        const params = new URLSearchParams({
            action: 'load_photos',
            category: document.querySelector('#category-filter').value,
            format: document.querySelector('#format-filter').value,
            sort_order: document.querySelector('#sort-order').value,
            page
        });

        fetch(photoGallery.ajaxUrl, { method: 'POST', body: params })
            .then(response => response.json())
            .then(photos => {
                if (page === 1) catalogue.innerHTML = '';
                photos.forEach(photo => {
                    const photoItem = document.createElement('div');
                    photoItem.classList.add('photo-item');
                    photoItem.innerHTML = `<a href="${photo.full}" data-title="${photo.title}" data-ref="${photo.ref}" data-category="${photo.category}" data-year="${photo.year}" data-format="${photo.format}" data-date="${photo.date}"><img src="${photo.thumbnail}" alt="${photo.title}"></a>`;
                    photoItem.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        modal.style.display = "block";
                        modalImage.src = photo.full;
                        modalTitle.innerText = photo.title;
                        modalRef.innerText = `Référence : ${photo.ref}`;
                        modalCategory.innerText = `Catégorie : ${photo.category}`;
                        modalYear.innerText = `Année : ${photo.year}`;
                        modalFormat.innerText = `Format : ${photo.format}`;
                    });
                    catalogue.appendChild(photoItem);
                });
                loadMoreButton.dataset.page = page + 1;

                if (typeof SimpleLightbox !== 'undefined') {
                    const lightbox = new SimpleLightbox('[data-lightbox="gallery"]', {
                        captions: true,
                        captionsData: 'data-title',
                        captionPosition: 'bottom',
                        captionDelay: 250,
                    });
                    lightbox.refresh();
                }
            });
    };

    filters.forEach(filter => filter.addEventListener('change', () => fetchPhotos()));
    loadMoreButton.addEventListener('click', () => fetchPhotos(loadMoreButton.dataset.page));
    fetchPhotos();

    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
});
