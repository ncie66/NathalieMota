<?php
get_header(); ?>

<main id="main" class="site-main" role="main">
    <h1>Catalogue de Photos</h1>

    <div class="filters">
        <label for="category-filter">Catégorie :</label>
        <select id="category-filter">
            <option value="">Toutes</option>
            <option value="reception">Réception</option>
            <option value="mariage">Mariage</option>
            <option value="concert">Concert</option>
            <option value="television">Télévision</option>
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
        <!-- les photos seront chargées ici via AJAX -->
    </div>

    <button id="load-more" data-page="1">Charger plus</button>

    <div id="photoModal" class="photo-modal">
    <span class="close">&times;</span>
    <div class="photo-modal-content">
        <div class="photo-modal-left">
            <h2 id="photoTitle"></h2>
            <p id="photoRef"></p>
            <p id="photoCategory"></p>
            <p id="photoYear"></p>
            <p id="photoFormat"></p>
            <p id="photoDate"></p>
        </div>
        <div class="photo-modal-right">
            <img id="photoImage" src="" alt="">
        </div>
    </div>
</div>
</main>

<?php
get_footer();
?>
