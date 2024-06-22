<?php
get_header(); ?>

<main id="main" class="site-main" role="main">
    <section class="AllFilter">
        <div class="filtersLeft">
            <div class="Cat">
                <div class="filters">
                    <div class="dropdown">
                        <button class="dropbtn" data-dropdown="category-filter">Catégorie</button>
                        <div class="dropdown-content" id="category-filter">
                            <a href="#" data-category="">Tout</a>
                            <!-- Les autres options seront chargées dynamiquement -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="Form">
                <div class="filters">
                    <div class="dropdown">
                        <button class="dropbtn" data-dropdown="format-filter">Format</button>
                        <div class="dropdown-content" id="format-filter">
                            <a href="#" data-format="">Tout</a>
                            <!-- Les autres options seront chargées dynamiquement -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="filtersRight">
            <div class="Sort">
                <div class="filters">
                    <div class="dropdown">
                        <button class="dropbtn" data-dropdown="sort-order">Trier par</button>
                        <div class="dropdown-content" id="sort-order">
                            <a href="#" data-sort="desc">Les plus récentes</a>
                            <a href="#" data-sort="asc">Les plus anciennes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
        
        <div id="photo-catalogue" class="photo-gallery">
            <!-- Exemple de photo, les autres photos seront chargées dynamiquement -->
            <div class="photo-item">
                <div class="photo-container">
                    <img src="http://localhost:10018/wp-content/uploads/2024/05/nathalie-15.jpeg" data-full="http://localhost:10018/wp-content/uploads/2024/05/nathalie-15.jpeg" class="fullscreen-icon" alt="Photo">
                    <div class="overlay">
                        <span class="overlay-icon-view"><img src="<?php echo get_stylesheet_directory_uri(); ?>/images/Group.png" data-index="0" class="view-icon"></span>
                        <span class="overlay-icon-full"><img src="<?php echo get_stylesheet_directory_uri(); ?>/images/Icon_fullscreen.png" data-full="http://localhost:10018/wp-content/uploads/2024/05/nathalie-15.jpeg" class="fullscreen-icon"></span>
                    </div>
                </div>
            </div>
            <!-- Les autres photos seront chargées ici -->
        </div>
        <div id="fullscreenModal" class="fullscreen-modal">
            <span class="close-fullscreen">&times;</span>
            <img class="fullscreen-modal-content" id="fullscreenImage">
            <img class="prevFull" src="<?php echo get_stylesheet_directory_uri(); ?>/images/prev.png" alt="Précédent">
            <img class="nextFull" src="<?php echo get_stylesheet_directory_uri(); ?>/images/next.png" alt="Suivant">
            <div class="fullscreen-info">
                <div class="fullscreenRefLeft">
                    <p id="fullscreenRef"></p>
                </div>
                <div class="fullscreenCategoryRight">
                    <p id="fullscreenCategory"></p>
                </div>
            </div>
        </div>

        <div class="load-more">
            <button id="load-more" data-page="1">Charger plus</button>
        </div>

        <div id="photoModal" class="photo-modal">
            <span class="close">&times;</span>
            <div class="photo-modal-content">
                <div class="photo-modal-principal">
                    <div class="photo-modal-left">
                        <h2 id="photoTitle"></h2>
                        <p id="photoRef"></p>
                        <p id="photoCategory"></p>
                        <p id="photoFormat"></p>
                        <p id="photoYear"></p>
                    </div>
                    <div class="photo-modal-right">
                        <img id="photoImage" src="" alt="">
                    </div>
                </div>
                <div class="photo-modal-form">
                    <div class="containerContact">
                        <p>Cette photo vous intéresse ?</p>
                        <button type="button" class="contactFormModal" data-reference="">Contact</button>
                    </div>
                    <div class="containerNav">
                        <div class="Prevbtn">
                            <img class="prev" src="<?php echo get_stylesheet_directory_uri(); ?>/images/prev.png" alt="Précédent">
                            <img class="preview-prev" id="previewPrev" src="" alt="Aperçu Précédent">
                        </div>
                        <div class="Nextbtn">
                            <img class="next" src="<?php echo get_stylesheet_directory_uri(); ?>/images/next.png" alt="Suivant">
                            <img class="preview-next" id="previewNext" src="" alt="Aperçu Suivant">
                        </div>
                        
                    </div>
                </div>
                <p class="suggestionP">Vous aimerez aussi</p>
                <div class="containerSuggestion">
                    <div class="containerSuggestionImage">
                </div>             
                <div id="lightbox-contact-modal" class="modal">
                    <div class="modal-content">
                        <span class="close-contact">&times;</span>
                        <h2>Contactez-nous</h2>
                        <?php echo do_shortcode('[contact-form-7 id="8846904" title="Formulaire de contact 1"]'); ?>
                        <input type="hidden" name="your-photo-ref" value="">
                    </div>
                </div>
            </div>
        </div>
    </main>

<?php
get_footer();
?>
