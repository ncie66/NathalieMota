<?php
/**
 * Template Name: Photo Detail
 */
include_once($_SERVER['DOCUMENT_ROOT'] . '/wp-load.php');
include_once('templates_part/modale.php');
include_once('php-details.php');
get_template_part('/templates_part/modale'); 
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title(); ?></title>
    <?php wp_head(); ?>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simplelightbox@2.9.0/dist/simple-lightbox.min.css">
</head>
<body <?php body_class(); ?>>
    <header>
        <div class="container">
            <div class="logo">
                <a href="<?php echo home_url(); ?>">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/Logo.svg" alt="Nathalie Mota Logo">
                </a>
            </div>
            <nav>
                <ul>
                    <li><a href="<?php echo home_url(); ?>">Accueil</a></li>
                    <li><a href="<?php echo home_url('/a-propos'); ?>">À propos</a></li>
                    <li><a href="#" id="contact-link">Contact</a></li>
                </ul>
            </nav>
            <button class="menu-toggle" aria-label="Toggle menu">
                &#9776;
            </button>
        </div>
    </header>

    <div id="photoDetailContent">
        <div class="photo-modal-content">
            <div class="photo-modal-principal">
                <div class="photo-modal-left">
                    <h2 id="photoTitle"><?php echo esc_html($photo_title); ?></h2>
                    <p id="photoRef">Référence : <?php echo esc_html($photo_ref_field); ?></p>
                    <p id="photoCategory">Catégorie : <?php echo esc_html($photo_category); ?></p>
                    <p id="photoFormat">Format : <?php echo esc_html($photo_format); ?></p>
                    <p id="photoYear">Année : <?php echo esc_html($photo_year); ?></p>
                </div>
                <div class="photo-modal-right">
                    <img id="photoImage" src="<?php echo esc_url($photo_full); ?>" alt="<?php echo esc_attr($photo_title); ?>">
                </div>
            </div>
            <div class="photo-modal-form">
                <div class="containerContact">
                    <p>Cette photo vous intéresse ?</p>
                    <button type="button" class="contactFormModal" data-reference="<?php echo esc_attr($photo_ref_field); ?>">Contact</button>
                </div>
                <div class="containerNav">
                    <div class="Prevbtn">
                        <img class="prev" src="<?php echo get_stylesheet_directory_uri(); ?>/images/prev.png" alt="Précédent" data-ref="">
                        <img class="preview-prev" id="previewPrev" src="" alt="Aperçu Précédent">
                    </div>
                    <div class="Nextbtn">
                        <img class="next" src="<?php echo get_stylesheet_directory_uri(); ?>/images/next.png" alt="Suivant" data-ref="">
                        <img class="preview-next" id="previewNext" src="" alt="Aperçu Suivant">
                    </div>
                </div>
            </div>
            <p class="suggestionP">Vous aimerez aussi</p>
            <div class="containerSuggestion">
                <div class="containerSuggestionImage"></div>
            </div>
        </div>
    </div>

    <div id="lightbox-contact-modal" class="modal">
        <div class="modal-content">
            <span class="close-contact">&times;</span>
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/Contact-header.png" class="photoContactForm" alt="Nathalie Mota contact">
            <?php echo do_shortcode('[contact-form-7 id="8846904" title="Formulaire de contact 1"]'); ?>
            <input type="hidden" name="your-photo-ref" value="">
        </div>
    </div>
    <footer class="footer">
        <div class="footer-links">
            <ul>
                <li><a href="<?php echo home_url('/mentions-legales'); ?>">Mentions légales</a></li>
                <li><a href="<?php echo home_url('/privacy-policy'); ?>">Vie privée</a></li>
                <li><a href="<?php echo home_url('/privacy-policy'); ?>">Tous droits réservés</a></li>
            </ul>
        </div>
    </footer>
    <?php wp_footer(); ?>
</body>
</html>
