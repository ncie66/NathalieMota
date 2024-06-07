<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title(); ?></title>
    <?php wp_head(); ?>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/style.css">
</head>
<body <?php body_class(); ?>>
    <header>
        <div class="container">
            <div class="logo">
                <a href="<?php echo home_url(); ?>">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/Logo.svg" alt="Nathalie Mota Logo">
                </a>
            </div>
            <nav>
                <ul>
                    <li><a href="<?php echo home_url(); ?>">Accueil</a></li>
                    <li><a href="<?php echo home_url('/a-propos'); ?>">À propos</a></li>
                    <li><a href="#" id="contact-link">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <section class="hero" id="hero-section">
        <div class="hero-content">
            <h1>PHOTOGRAPHE EVENT</h1>
        </div>
    </section>

    <main id="main" class="site-main" role="main">
    <h1>Catalogue de Photos</h1>

    <div class="filters">
        <div class="dropdown">
            <button class="dropbtn" data-dropdown="category-filter">Catégorie</button>
            <div class="dropdown-content" id="category-filter">
                <a href="#" data-category="">Toutes</a>
                <a href="#" data-category="reception">Réception</a>
                <a href="#" data-category="mariage">Mariage</a>
                <a href="#" data-category="concert">Concert</a>
                <a href="#" data-category="television">Télévision</a>
            </div>
        </div>

        <div class="dropdown">
            <button class="dropbtn" data-dropdown="format-filter">Format</button>
            <div class="dropdown-content" id="format-filter">
                <a href="#" data-format="">Tous</a>
                <a href="#" data-format="paysage">Paysage</a>
                <a href="#" data-format="portrait">Portrait</a>
            </div>
        </div>

        <div class="dropdown">
            <button class="dropbtn" data-dropdown="sort-order">Trier par date</button>
            <div class="dropdown-content" id="sort-order">
                <a href="#" data-sort="desc">Les plus récentes</a>
                <a href="#" data-sort="asc">Les plus anciennes</a>
            </div>
        </div>
    </div>

    <div id="photo-catalogue" class="photo-gallery">
        <!-- les photos seront chargées ici -->
    </div>

    <button id="load-more" data-page="1">Charger plus</button>

    <div id="photoModal" class="photo-modal">
        <span class="close">&times;</span>
        <div class="photo-modal-content">
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
            <div class="photo-modal-form">
                <?php echo do_shortcode('[contact-form-7 id="8846904" title="Formulaire de contact 1"]'); ?>
            </div>
            <div class="modal-navigation">
                <span class="prev">&laquo; Précédent</span>
                <span class="next">Suivant &raquo;</span>
            </div>
        </div>
    </div>

    <div id="contact-modal" class="modal">
        <div class="modal-content">
            <span class="close-contact">&times;</span>
            <h2>Contactez-nous</h2>
            <?php echo do_shortcode('[contact-form-7 id="8846904" title="Formulaire de contact 1"]'); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
