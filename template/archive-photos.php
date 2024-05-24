<?php
get_header(); ?>

<main id="main" class="site-main" role="main">
    <h1>Catalogue de Photos</h1>

    <div class="filters">
        <label for="category-filter">Catégorie :</label>
        <select id="category-filter">
            <option value="">Toutes</option>
            <option value="Réception">Réception</option>
            <option value="Mariage">Mariage</option>
            <option value="Concert">Concert</option>
            <option value="Télévision">Télévision</option>
        </select>

        <label for="format-filter">Format :</label>
        <select id="format-filter">
            <option value="">Tous</option>
            <option value="paysage">Paysage</option>
            <option value="portrait">Portrait</option>
        </select>

        <label for="sort-order">Trier par date :</label>
        <select id="sort-order">
            <option value="desc">Les plus récentes</option>
            <option value="asc">Les plus anciennes</option>
        </select>
    </div>

    <div id="photo-catalogue" class="photo-gallery">
        <!-- Photos seront chargées ici via AJAX -->
    </div>

    <button id="load-more" data-page="1">Charger plus</button>
</main>

<?php
get_footer();
?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('#category-filter, #format-filter, #sort-order');
    const loadMoreButton = document.querySelector('#load-more');
    const catalogue = document.querySelector('#photo-catalogue');

    function fetchPhotos(page = 1) {
        const category = document.querySelector('#category-filter').value;
        const format = document.querySelector('#format-filter').value;
        const sortOrder = document.querySelector('#sort-order').value;

        const data = new URLSearchParams({
            action: 'load_photos',
            category,
            format,
            sort_order: sortOrder,
            page
        });

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(photos => {
            if (page === 1) {
                catalogue.innerHTML = '';
            }
            photos.forEach(photo => {
                const photoItem = document.createElement('div');
                photoItem.classList.add('photo-item');
                photoItem.innerHTML = `
                    <a href="${photo.full}" data-lightbox="gallery">
                        <img src="${photo.thumbnail}" alt="${photo.title}">
                    </a>
                    <h2>${photo.title}</h2>
                    <p>Référence : ${photo.ref}</p>
                    <p>Catégorie : ${photo.category}</p>
                    <p>Année : ${photo.year}</p>
                    <p>Format : ${photo.format}</p>
                    <p>Date de prise de vue : ${photo.date}</p>
                `;
                catalogue.appendChild(photoItem);
            });
            loadMoreButton.dataset.page = page + 1;

            // Re-initialize Simple Lightbox
            const lightbox = new SimpleLightbox('[data-lightbox="gallery"]');
            lightbox.refresh();
        });
    }

    filters.forEach(filter => filter.addEventListener('change', () => fetchPhotos()));
    loadMoreButton.addEventListener('click', () => fetchPhotos(loadMoreButton.dataset.page));
    
    fetchPhotos();
});
</script>
